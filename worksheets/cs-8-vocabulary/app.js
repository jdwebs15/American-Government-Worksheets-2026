// ================================================================
// PASTE THIS WORKSHEET'S GOOGLE APPS SCRIPT /exec WEB ADDRESS BELOW
// ================================================================
const APPS_SCRIPT_URL="/* ============================================================================
   LEAN UNIVERSAL WORKSHEET BACKEND - 2026

   Records:
   - student identity and assignment
   - first start, latest save, and final submission
   - active/away time, tab leaves, copy/paste totals
   - score, completion, answers, and recoverable payload
   - one readable assignment/period tab

   It does not process Work Sessions or Activity Events.
   ============================================================================ */

const CONFIG = Object.freeze({
  SPREADSHEET_ID: "1UrYT4DkOJnaaHYOdTTxnekltXCpISjMZFBEbT-p_bQg",
  DEFAULT_COURSE: "GOV",
  SAVES_SHEET: "Student Work",
  INDEX_SHEET: "Class Tab Index",
  INFO_SHEET: "Backend Information",
  MAX_SHEET_NAME_LENGTH: 99,
  CLASS_TITLE_LENGTH: 48
});

const SAVE_HEADERS = [
  "Record Key", "Course", "Assignment Key", "Assignment Title",
  "Student Name", "Normalized Period", "Entered Period", "School Email",
  "First Started", "Latest Session Started", "Last Saved", "Last Retrieved",
  "Final Submitted", "Status", "Total Elapsed Seconds", "Active Seconds",
  "Away Seconds", "Tab Leaves", "Copies", "Pastes", "Session Count",
  "Score", "Total Points", "Percent", "Answer Count", "Session IDs JSON",
  "Session Log JSON", "Leave/Return Events JSON", "Copy Events JSON",
  "Paste Events JSON", "Question Times JSON", "Copy By Question JSON",
  "Paste By Question JSON", "Answers JSON", "Accepted JSON",
  "Telemetry JSON", "Latest Payload JSON"
];

const INDEX_HEADERS = [
  "Sheet Name", "Course", "Assignment Key", "Assignment Title",
  "Period", "Created", "Last Updated"
];

const CLASS_BASE_HEADERS = [
  "Student", "Started", "Submitted", "Active Time", "Away Time",
  "Total Elapsed", "Tab Leaves", "Copies", "Pastes", "Score", "Status",
  "School Email", "Sessions", "Last Saved", "Last Retrieved",
  "Assignment Key", "Course", "Period"
];

function setup() {
  withLock_(function () {
    const ss = spreadsheet_();
    ensureSheet_(ss, CONFIG.SAVES_SHEET, SAVE_HEADERS);
    ensureSheet_(ss, CONFIG.INDEX_SHEET, INDEX_HEADERS);
    writeInformation_(ss);
  });
}

function doPost(e) {
  try {
    const d = parseRequest_(e);
    const action = normalizeAction_(d.action || statusAction_(d));

    if (action === "load") {
      return json_(loadRecord_(d));
    }

    if (action !== "save" && action !== "submit") {
      throw new Error(
        "Unknown action. Use save, submit, load, or retrieve."
      );
    }

    const result = withLock_(function () {
      return saveRecord_(d, action);
    });

    return json_(result);
  } catch (err) {
    return json_({
      ok: false,
      message: safeError_(err)
    });
  }
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  let result;

  try {
    if (normalizeAction_(p.action) === "load") {
      result = withLock_(function () {
        return loadRecord_(p);
      });
    } else {
      result = {
        ok: true,
        service: "Lean Universal Worksheet Backend",
        version: "2026.1"
      };
    }
  } catch (err) {
    result = {
      ok: false,
      found: false,
      message: safeError_(err)
    };
  }

  return p.callback
    ? jsonp_(p.callback, result)
    : json_(result);
}

function saveRecord_(d, action) {
  const ss = spreadsheet_();
  const sheet = ensureSheet_(
    ss,
    CONFIG.SAVES_SHEET,
    SAVE_HEADERS
  );

  const incoming = incomingRecord_(d, action);
  validate_(incoming);

  const existingRow = findRecordRow_(
    sheet,
    incoming.recordKey
  );

  const old = existingRow
    ? recordFromRow_(sheet, existingRow)
    : null;

  const record = mergeRecord_(
    old,
    incoming,
    Boolean(d.resetRequested)
  );

  writeMasterRow_(sheet, existingRow, record);
  upsertClassTab_(ss, record);

  return {
    ok: true,
    action: action,
    savedAt: iso_(record.lastSaved),
    submittedAt: record.finalSubmitted
      ? iso_(record.finalSubmitted)
      : "",
    sheetName: classSheetName_(record)
  };
}

function loadRecord_(p) {
  const ss = spreadsheet_();
  const sheet = ensureSheet_(
    ss,
    CONFIG.SAVES_SHEET,
    SAVE_HEADERS
  );

  const course = normalizeCourse_(
    p.course || p.courseKey || ""
  );

  const assignmentKey = String(
    p.assignmentKey || p.assignmentId || ""
  ).trim();

  const email = String(
    p.email || p.schoolEmail || ""
  ).trim().toLowerCase();

  if (!assignmentKey || !email) {
    return {
      ok: true,
      found: false
    };
  }

  let row = 0;

  if (course) {
    row = findRecordRow_(
      sheet,
      makeRecordKey_(course, assignmentKey, email)
    );
  }

  if (!row) {
    row = findByAssignmentAndEmail_(
      sheet,
      assignmentKey,
      email
    );
  }

  if (!row) {
    return {
      ok: true,
      found: false
    };
  }

  const record = recordFromRow_(sheet, row);
  record.lastRetrieved = new Date();

  writeMasterRow_(sheet, row, record);
  upsertClassTab_(ss, record);

  return {
    ok: true,
    found: true,
    payload: record.payload,
    retrievedAt: iso_(record.lastRetrieved)
  };
}

function incomingRecord_(d, action) {
  const now = new Date();
  const student = safeObject_(d.student);
  const state = safeObject_(
    d.state || (d.gameState && d.gameState.state)
  );
  const telemetry = safeObject_(
    d.telemetry || d.activity || state.telemetry
  );
  const gameState = safeObject_(d.gameState);

  const course = normalizeCourse_(
    d.course ||
    d.courseKey ||
    student.course ||
    CONFIG.DEFAULT_COURSE
  );

  const assignmentKey = String(
    d.assignmentKey ||
    d.assignmentId ||
    d.id ||
    ""
  ).trim();

  const assignmentTitle = String(
    d.assignmentTitle ||
    d.title ||
    assignmentKey ||
    "Worksheet"
  ).trim();

  const name = String(
    d.name ||
    d.studentName ||
    student.name ||
    gameState.name ||
    ""
  ).trim();

  const periodRaw = String(
    d.period ||
    d.classPeriod ||
    student.period ||
    gameState.period ||
    ""
  ).trim();

  const email = String(
    d.email ||
    d.schoolEmail ||
    student.email ||
    gameState.email ||
    ""
  ).trim().toLowerCase();

  const answers = normalizeAnswers_(
    d.answers ||
    state.answers ||
    gameState.answers
  );

  const accepted = safeObject_(
    d.accepted ||
    d.mastered ||
    state.mastered ||
    gameState.accepted
  );

  const firstStarted = toDate_(
    firstValue_([
      d.startedAt,
      state.firstStart,
      telemetry.firstStartedAt,
      telemetry.startedAt,
      gameState.start
    ])
  ) || now;

  const submittedAt = toDate_(
    firstValue_([
      d.completedAt,
      state.submittedAt,
      telemetry.submittedAt,
      telemetry.finalSubmittedAt,
      gameState.end
    ])
  );

  const statusText = String(
    d.status ||
    state.status ||
    "in_progress"
  ).toLowerCase();

  const submitted =
    action === "submit" ||
    statusText === "submitted" ||
    Boolean(submittedAt);

  const explicitScore = firstDefined_([
    d.score,
    d.pointsEarned
  ]);

  const explicitTotal = firstDefined_([
    d.total,
    d.totalPoints
  ]);

  const answerCount = number_(
    firstDefined_([
      d.answerCount,
      Object.keys(answers).length
    ])
  );

  const score =
    explicitScore !== undefined
      ? number_(explicitScore)
      : truthyCount_(accepted);

  const total =
    explicitTotal !== undefined
      ? number_(explicitTotal)
      : Math.max(
          answerCount,
          Object.keys(accepted).length
        );

  const runId = String(
    d.runId ||
    state.runId ||
    gameState.runId ||
    telemetry.sessionId ||
    ""
  );

  const active = seconds_(
    firstDefined_([
      telemetry.activeSeconds,
      state.activeSeconds,
      gameState.activeSeconds,
      d.activeSeconds
    ])
  );

  const away = seconds_(
    firstDefined_([
      telemetry.awaySeconds,
      state.awaySeconds,
      gameState.awaySeconds,
      d.awaySeconds
    ])
  );

  const elapsed =
    seconds_(
      firstDefined_([
        telemetry.elapsedSeconds,
        d.elapsedSeconds
      ])
    ) ||
    Math.max(
      0,
      Math.round((now - firstStarted) / 1000)
    );

  return {
    recordKey: makeRecordKey_(
      course,
      assignmentKey,
      email
    ),
    course: course,
    assignmentKey: assignmentKey,
    assignmentTitle: assignmentTitle,
    name: name,
    period: normalizePeriod_(periodRaw),
    periodRaw: periodRaw,
    email: email,

    firstStarted: firstStarted,
    latestSessionStarted: firstStarted,
    lastSaved: now,
    lastRetrieved: null,
    finalSubmitted: submitted
      ? submittedAt || now
      : null,

    status: submitted
      ? "submitted"
      : d.status || state.status || "in_progress",

    elapsedSeconds: elapsed,
    activeSeconds: active,
    awaySeconds: away,

    tabLeaves: number_(
      firstDefined_([
        telemetry.tabLeaves,
        state.tabLeaves,
        gameState.tabLeaves,
        d.tabLeaves
      ])
    ),

    copies: number_(
      firstDefined_([
        telemetry.copies,
        state.copies,
        gameState.copies,
        d.copies
      ])
    ),

    pastes: number_(
      firstDefined_([
        telemetry.pastes,
        state.pastes,
        gameState.pastes,
        d.pastes
      ])
    ),

    sessionCount:
      number_(
        firstDefined_([
          telemetry.sessionCount,
          state.sessions,
          d.sessionCount
        ])
      ) || 1,

    score: score,
    total: total,
    percent: total
      ? Math.round(score / total * 1000) / 10
      : 0,

    answerCount: answerCount,
    answers: answers,
    accepted: accepted,

    questionTimes: safeObject_(
      telemetry.questionTimes ||
      state.questionSeconds ||
      gameState.questionSeconds
    ),

    copyByQuestion: safeObject_(
      telemetry.copyByQuestion ||
      d.copyByQuestion
    ),

    pasteByQuestion: safeObject_(
      telemetry.pasteByQuestion ||
      d.pasteByQuestion
    ),

    telemetry: telemetry,
    payload: safeObject_(d),
    runId: runId
  };
}

function mergeRecord_(old, incoming, resetRequested) {
  if (
    !old ||
    resetRequested ||
    (
      old.runId &&
      incoming.runId &&
      old.runId !== incoming.runId
    )
  ) {
    return incoming;
  }

  const r = Object.assign({}, incoming);

  r.firstStarted = earliest_(
    old.firstStarted,
    incoming.firstStarted
  );

  r.lastRetrieved = old.lastRetrieved || null;

  r.finalSubmitted =
    incoming.finalSubmitted ||
    old.finalSubmitted ||
    null;

  r.status = incoming.finalSubmitted
    ? "submitted"
    : incoming.status;

  r.activeSeconds = Math.max(
    old.activeSeconds || 0,
    incoming.activeSeconds || 0
  );

  r.awaySeconds = Math.max(
    old.awaySeconds || 0,
    incoming.awaySeconds || 0
  );

  r.elapsedSeconds = Math.max(
    old.elapsedSeconds || 0,
    incoming.elapsedSeconds || 0
  );

  r.tabLeaves = Math.max(
    old.tabLeaves || 0,
    incoming.tabLeaves || 0
  );

  r.copies = Math.max(
    old.copies || 0,
    incoming.copies || 0
  );

  r.pastes = Math.max(
    old.pastes || 0,
    incoming.pastes || 0
  );

  r.sessionCount = Math.max(
    old.sessionCount || 1,
    incoming.sessionCount || 1
  );

  r.answers = mergeAnswers_(
    old.answers,
    incoming.answers
  );

  r.accepted = Object.assign(
    {},
    old.accepted || {},
    incoming.accepted || {}
  );

  r.questionTimes = mergeNumericMap_(
    old.questionTimes,
    incoming.questionTimes
  );

  r.copyByQuestion = mergeNumericMap_(
    old.copyByQuestion,
    incoming.copyByQuestion
  );

  r.pasteByQuestion = mergeNumericMap_(
    old.pasteByQuestion,
    incoming.pasteByQuestion
  );

  r.answerCount = Math.max(
    incoming.answerCount || 0,
    nonblankCount_(r.answers)
  );

  r.score = Math.max(
    old.score || 0,
    incoming.score || 0
  );

  r.total = Math.max(
    old.total || 0,
    incoming.total || 0
  );

  r.percent = r.total
    ? Math.round(r.score / r.total * 1000) / 10
    : 0;

  r.payload = mergePayload_(
    old.payload,
    incoming.payload,
    r
  );

  return r;
}

function mergePayload_(oldPayload, newPayload, record) {
  const p = Object.assign(
    {},
    safeObject_(oldPayload),
    safeObject_(newPayload)
  );

  p.answers = record.answers;
  p.accepted = record.accepted;

  if (p.mastered !== undefined) {
    p.mastered = record.accepted;
  }

  if (p.state && typeof p.state === "object") {
    p.state = Object.assign(
      {},
      p.state,
      {
        answers: record.answers,
        mastered: record.accepted
      }
    );
  }

  p.name = record.name;
  p.period = record.periodRaw;
  p.email = record.email;
  p.assignmentKey = record.assignmentKey;
  p.assignmentTitle = record.assignmentTitle;
  p.course = record.course;

  return p;
}

function writeMasterRow_(sheet, row, r) {
  const values = [[
    r.recordKey,
    r.course,
    r.assignmentKey,
    r.assignmentTitle,
    r.name,
    r.period,
    r.periodRaw,
    r.email,
    r.firstStarted || "",
    r.latestSessionStarted || "",
    r.lastSaved || new Date(),
    r.lastRetrieved || "",
    r.finalSubmitted || "",
    r.status || "in_progress",
    r.elapsedSeconds || 0,
    r.activeSeconds || 0,
    r.awaySeconds || 0,
    r.tabLeaves || 0,
    r.copies || 0,
    r.pastes || 0,
    r.sessionCount || 1,
    r.score || 0,
    r.total || 0,
    r.percent || 0,
    r.answerCount || 0,
    JSON.stringify(r.runId ? [r.runId] : []),
    "[]",
    "[]",
    "[]",
    "[]",
    JSON.stringify(r.questionTimes || {}),
    JSON.stringify(r.copyByQuestion || {}),
    JSON.stringify(r.pasteByQuestion || {}),
    JSON.stringify(r.answers || {}),
    JSON.stringify(r.accepted || {}),
    JSON.stringify(r.telemetry || {}),
    JSON.stringify(r.payload || {})
  ]];

  const target = row || sheet.getLastRow() + 1;

  ensureGrid_(
    sheet,
    target,
    SAVE_HEADERS.length
  );

  sheet
    .getRange(
      target,
      1,
      1,
      SAVE_HEADERS.length
    )
    .setValues(values);
}

function recordFromRow_(sheet, row) {
  const map = headerMap_(sheet);

  const v = sheet
    .getRange(
      row,
      1,
      1,
      sheet.getLastColumn()
    )
    .getValues()[0];

  function get(header) {
    return map[header]
      ? v[map[header] - 1]
      : "";
  }

  const answers = parseJson_(
    get("Answers JSON"),
    {}
  );

  const payload = parseJson_(
    get("Latest Payload JSON"),
    {}
  );

  const sessionIds = parseJson_(
    get("Session IDs JSON"),
    []
  );

  return {
    recordKey: String(
      get("Record Key") || ""
    ),

    course: String(
      get("Course") || CONFIG.DEFAULT_COURSE
    ),

    assignmentKey: String(
      get("Assignment Key") || ""
    ),

    assignmentTitle: String(
      get("Assignment Title") || "Worksheet"
    ),

    name: String(
      get("Student Name") || ""
    ),

    period: String(
      get("Normalized Period") || "P-UNKNOWN"
    ),

    periodRaw: String(
      get("Entered Period") || ""
    ),

    email: String(
      get("School Email") || ""
    ).toLowerCase(),

    firstStarted: toDate_(
      get("First Started")
    ),

    latestSessionStarted: toDate_(
      get("Latest Session Started")
    ),

    lastSaved: toDate_(
      get("Last Saved")
    ),

    lastRetrieved: toDate_(
      get("Last Retrieved")
    ),

    finalSubmitted: toDate_(
      get("Final Submitted")
    ),

    status: String(
      get("Status") || "in_progress"
    ),

    elapsedSeconds: number_(
      get("Total Elapsed Seconds")
    ),

    activeSeconds: number_(
      get("Active Seconds")
    ),

    awaySeconds: number_(
      get("Away Seconds")
    ),

    tabLeaves: number_(
      get("Tab Leaves")
    ),

    copies: number_(
      get("Copies")
    ),

    pastes: number_(
      get("Pastes")
    ),

    sessionCount:
      number_(get("Session Count")) || 1,

    score: number_(
      get("Score")
    ),

    total: number_(
      get("Total Points")
    ),

    percent:
      Number(get("Percent")) || 0,

    answerCount: number_(
      get("Answer Count")
    ),

    answers: answers,

    accepted: parseJson_(
      get("Accepted JSON"),
      {}
    ),

    questionTimes: parseJson_(
      get("Question Times JSON"),
      {}
    ),

    copyByQuestion: parseJson_(
      get("Copy By Question JSON"),
      {}
    ),

    pasteByQuestion: parseJson_(
      get("Paste By Question JSON"),
      {}
    ),

    telemetry: parseJson_(
      get("Telemetry JSON"),
      {}
    ),

    payload: payload,

    runId: String(
      sessionIds[0] ||
      payload.runId ||
      ""
    )
  };
}

function upsertClassTab_(ss, r) {
  const name = classSheetName_(r);
  const existing = ss.getSheetByName(name);

  const oldKeys = existing
    ? classQuestionKeys_(existing)
    : [];

  const keys = orderedKeys_(
    Object.assign(
      {},
      keysObject_(oldKeys),
      r.answers
    )
  );

  const headers = classHeaders_(keys);

  const sheet = ensureSheet_(
    ss,
    name,
    headers
  );

  const row = findRowByValue_(
    sheet,
    "School Email",
    r.email
  );

  const target = row || sheet.getLastRow() + 1;
  const values = classRow_(r, keys);

  ensureGrid_(
    sheet,
    target,
    headers.length
  );

  sheet
    .getRange(
      target,
      1,
      1,
      headers.length
    )
    .setValues([values]);

  formatClassSheet_(
    sheet,
    headers.length
  );

  recordClassTab_(
    ss,
    name,
    r
  );
}

function classHeaders_(keys) {
  const headers = CLASS_BASE_HEADERS.slice();

  keys.forEach(function (key) {
    const label = displayQuestion_(key);

    headers.push(
      label + " Answer",
      label + " Time",
      label + " Copies",
      label + " Pastes"
    );
  });

  return headers;
}

function classRow_(r, keys) {
  const scoreDisplay = r.total
    ? r.score +
      "/" +
      r.total +
      " (" +
      r.percent +
      "%)"
    : "";

  const row = [
    r.name,
    r.firstStarted || "",
    r.finalSubmitted || "",
    duration_(r.activeSeconds),
    duration_(r.awaySeconds),
    duration_(r.elapsedSeconds),
    r.tabLeaves,
    r.copies,
    r.pastes,
    scoreDisplay,
    r.status,
    r.email,
    r.sessionCount,
    r.lastSaved || "",
    r.lastRetrieved || "",
    r.assignmentKey,
    r.course,
    r.period
  ];

  keys.forEach(function (key) {
    row.push(
      answerValue_(r.answers[key]),
      duration_(r.questionTimes[key]),
      number_(r.copyByQuestion[key]),
      number_(r.pasteByQuestion[key])
    );
  });

  return row;
}

function rebuildAllClassTabs() {
  withLock_(function () {
    const ss = spreadsheet_();

    const sheet = ensureSheet_(
      ss,
      CONFIG.SAVES_SHEET,
      SAVE_HEADERS
    );

    for (
      let row = 2;
      row <= sheet.getLastRow();
      row++
    ) {
      if (sheet.getRange(row, 1).getValue()) {
        upsertClassTab_(
          ss,
          recordFromRow_(sheet, row)
        );
      }
    }
  });
}

function recordClassTab_(ss, name, r) {
  const sheet = ensureSheet_(
    ss,
    CONFIG.INDEX_SHEET,
    INDEX_HEADERS
  );

  const row = findRowByValue_(
    sheet,
    "Sheet Name",
    name
  );

  const created = row
    ? sheet.getRange(row, 6).getValue()
    : new Date();

  const target = row || sheet.getLastRow() + 1;

  ensureGrid_(
    sheet,
    target,
    INDEX_HEADERS.length
  );

  sheet
    .getRange(
      target,
      1,
      1,
      INDEX_HEADERS.length
    )
    .setValues([[
      name,
      r.course,
      r.assignmentKey,
      r.assignmentTitle,
      r.period,
      created,
      new Date()
    ]]);
}

function writeInformation_(ss) {
  const sheet =
    ss.getSheetByName(CONFIG.INFO_SHEET) ||
    ss.insertSheet(CONFIG.INFO_SHEET);

  const rows = [
    [
      "Lean Universal Worksheet Backend",
      "2026.1"
    ],
    [
      "Primary data sheet",
      CONFIG.SAVES_SHEET
    ],
    [
      "Stored",
      "Identity, timestamps, completion, timing totals, monitoring totals, answers, retrieval payload"
    ],
    [
      "Not processed",
      "Work Sessions and Activity Events"
    ],
    [
      "Retrieval",
      "Latest Payload JSON remains available through GET action=load"
    ],
    [
      "Deployment",
      "Deploy as Web app; execute as owner; access anyone"
    ],
    [
      "Safe maintenance",
      "Run setup after pasting; run rebuildAllClassTabs only when class tabs need rebuilding"
    ]
  ];

  sheet.clearContents();

  ensureGrid_(
    sheet,
    rows.length,
    2
  );

  sheet
    .getRange(
      1,
      1,
      rows.length,
      2
    )
    .setValues(rows);

  sheet
    .getRange(1, 1, 1, 2)
    .setFontWeight("bold")
    .setBackground("#17365d")
    .setFontColor("#ffffff");

  sheet.autoResizeColumns(1, 2);
}

function parseRequest_(e) {
  const params =
    (e && e.parameter) || {};

  const text =
    e &&
    e.postData &&
    e.postData.contents;

  let request = {};

  if (text) {
    try {
      request = JSON.parse(text);
    } catch (err) {
      request = Object.assign({}, params);
    }
  } else {
    request = Object.assign({}, params);
  }

  const nested = parseJson_(
    request.payload,
    null
  );

  if (
    nested &&
    typeof nested === "object" &&
    !Array.isArray(nested)
  ) {
    return Object.assign(
      {},
      request,
      nested,
      {
        action:
          request.action ||
          nested.action ||
          statusAction_(nested)
      }
    );
  }

  return request;
}

function statusAction_(d) {
  const status = String(
    d.status ||
    (d.state && d.state.status) ||
    ""
  ).toLowerCase();

  return status === "submitted"
    ? "submit"
    : "save";
}

function normalizeAction_(value) {
  const action = String(
    value || "save"
  ).toLowerCase();

  if (
    action === "retrieve" ||
    action === "get" ||
    action === "resume"
  ) {
    return "load";
  }

  if (
    action === "final" ||
    action === "finish"
  ) {
    return "submit";
  }

  return action;
}

function normalizeCourse_(value) {
  const course = String(
    value || ""
  ).trim().toUpperCase();

  if (
    course.indexOf("AMERICAN STUD") >= 0 ||
    course === "AMST" ||
    course === "HISTORY"
  ) {
    return "AMST";
  }

  if (course.indexOf("GOV") >= 0) {
    return "GOV";
  }

  return course || CONFIG.DEFAULT_COURSE;
}

function normalizePeriod_(value) {
  const match = String(
    value || ""
  ).match(/\d+/);

  return match
    ? "P" + match[0]
    : "P-UNKNOWN";
}

function makeRecordKey_(course, key, email) {
  return [
    course,
    key,
    String(email || "").toLowerCase()
  ].join("|");
}

function validate_(record) {
  if (!record.assignmentKey) {
    throw new Error("Missing assignment key.");
  }

  if (!record.name) {
    throw new Error("Missing student name.");
  }

  if (!record.email) {
    throw new Error("Missing school email.");
  }
}

function spreadsheet_() {
  return SpreadsheetApp.openById(
    CONFIG.SPREADSHEET_ID
  );
}

function withLock_(fn) {
  const lock =
    LockService.getScriptLock();

  lock.waitLock(30000);

  try {
    return fn();
  } finally {
    lock.releaseLock();
  }
}

function ensureSheet_(ss, name, headers) {
  let sheet = ss.getSheetByName(name);

  if (!sheet) {
    sheet = ss.insertSheet(name);
  }

  ensureGrid_(
    sheet,
    2,
    headers.length
  );

  const current = sheet
    .getRange(
      1,
      1,
      1,
      headers.length
    )
    .getValues()[0];

  let changed = false;

  for (
    let i = 0;
    i < headers.length;
    i++
  ) {
    if (
      String(current[i] || "") !==
      headers[i]
    ) {
      changed = true;
      break;
    }
  }

  if (changed) {
    sheet
      .getRange(
        1,
        1,
        1,
        headers.length
      )
      .setValues([headers]);
  }

  sheet.setFrozenRows(1);

  sheet
    .getRange(
      1,
      1,
      1,
      headers.length
    )
    .setFontWeight("bold")
    .setBackground("#17365d")
    .setFontColor("#ffffff")
    .setWrap(true);

  return sheet;
}

function ensureGrid_(sheet, rows, columns) {
  if (sheet.getMaxRows() < rows) {
    sheet.insertRowsAfter(
      sheet.getMaxRows(),
      rows - sheet.getMaxRows()
    );
  }

  if (sheet.getMaxColumns() < columns) {
    sheet.insertColumnsAfter(
      sheet.getMaxColumns(),
      columns - sheet.getMaxColumns()
    );
  }
}

function headerMap_(sheet) {
  const map = {};

  if (!sheet.getLastColumn()) {
    return map;
  }

  sheet
    .getRange(
      1,
      1,
      1,
      sheet.getLastColumn()
    )
    .getValues()[0]
    .forEach(function (value, index) {
      map[String(value)] = index + 1;
    });

  return map;
}

function findRecordRow_(sheet, key) {
  return findRowByValue_(
    sheet,
    "Record Key",
    key
  );
}

function findRowByValue_(
  sheet,
  header,
  wanted
) {
  const map = headerMap_(sheet);
  const column = map[header];
  const lastRow = sheet.getLastRow();

  if (!column || lastRow < 2) {
    return 0;
  }

  const values = sheet
    .getRange(
      2,
      column,
      lastRow - 1,
      1
    )
    .getDisplayValues();

  const target = String(
    wanted || ""
  ).trim().toLowerCase();

  for (
    let i = 0;
    i < values.length;
    i++
  ) {
    if (
      String(values[i][0] || "")
        .trim()
        .toLowerCase() === target
    ) {
      return i + 2;
    }
  }

  return 0;
}

function findByAssignmentAndEmail_(
  sheet,
  key,
  email
) {
  const map = headerMap_(sheet);
  const lastRow = sheet.getLastRow();

  if (
    lastRow < 2 ||
    !map["Assignment Key"] ||
    !map["School Email"]
  ) {
    return 0;
  }

  const values = sheet
    .getRange(
      2,
      1,
      lastRow - 1,
      sheet.getLastColumn()
    )
    .getDisplayValues();

  for (
    let i = 0;
    i < values.length;
    i++
  ) {
    const rowKey =
      values[i][map["Assignment Key"] - 1];

    const rowEmail = String(
      values[i][map["School Email"] - 1]
    ).toLowerCase();

    if (
      String(rowKey) === String(key) &&
      rowEmail === email
    ) {
      return i + 2;
    }
  }

  return 0;
}

function classSheetName_(record) {
  return safeSheetName_(
    record.course +
    " - " +
    shortTitle_(record.assignmentTitle) +
    " - " +
    record.period
  );
}

function shortTitle_(value) {
  return String(
    value || "Worksheet"
  )
    .replace(/Research/gi, "")
    .replace(/Assignment/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .substring(
      0,
      CONFIG.CLASS_TITLE_LENGTH
    )
    .trim();
}

function safeSheetName_(value) {
  return String(value)
    .replace(
      /[\\\/\?\*\[\]:]/g,
      "-"
    )
    .substring(
      0,
      CONFIG.MAX_SHEET_NAME_LENGTH
    )
    .trim();
}

function classQuestionKeys_(sheet) {
  if (
    sheet.getLastColumn() <=
    CLASS_BASE_HEADERS.length
  ) {
    return [];
  }

  const headers = sheet
    .getRange(
      1,
      CLASS_BASE_HEADERS.length + 1,
      1,
      sheet.getLastColumn() -
        CLASS_BASE_HEADERS.length
    )
    .getValues()[0];

  const keys = [];

  for (
    let i = 0;
    i < headers.length;
    i += 4
  ) {
    const label = String(
      headers[i] || ""
    ).replace(/ Answer$/, "");

    if (label) {
      keys.push(
        headerLabelToKey_(label)
      );
    }
  }

  return keys;
}

function headerLabelToKey_(label) {
  const numbered = String(
    label
  ).match(/^Q(\d+)$/i);

  if (numbered) {
    return "q" + numbered[1];
  }

  return String(label)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatClassSheet_(sheet, width) {
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(1);

  sheet
    .getRange(1, 1, 1, width)
    .setFontWeight("bold")
    .setBackground("#17365d")
    .setFontColor("#ffffff")
    .setWrap(true);

  sheet
    .getRange(
      1,
      1,
      Math.max(1, sheet.getLastRow()),
      width
    )
    .setVerticalAlignment("top");

  sheet.autoResizeColumns(
    1,
    Math.min(width, 18)
  );
}

function normalizeAnswers_(value) {
  if (Array.isArray(value)) {
    const answers = {};

    value.forEach(function (answer, index) {
      answers[
        "q" + (index + 1)
      ] = answer;
    });

    return answers;
  }

  return safeObject_(value);
}

function mergeAnswers_(oldAnswers, newAnswers) {
  const output = Object.assign(
    {},
    safeObject_(oldAnswers)
  );

  Object
    .keys(safeObject_(newAnswers))
    .forEach(function (key) {
      const value = newAnswers[key];

      if (
        value !== "" &&
        value !== null &&
        value !== undefined
      ) {
        output[key] = value;
      }
    });

  return output;
}

function mergeNumericMap_(oldMap, newMap) {
  const output = Object.assign(
    {},
    safeObject_(oldMap)
  );

  Object
    .keys(safeObject_(newMap))
    .forEach(function (key) {
      output[key] = Math.max(
        number_(output[key]),
        number_(newMap[key])
      );
    });

  return output;
}

function orderedKeys_(object) {
  return Object
    .keys(safeObject_(object))
    .sort(function (a, b) {
      const am = String(a).match(/\d+/);
      const bm = String(b).match(/\d+/);

      if (am && bm) {
        return (
          Number(am[0]) -
          Number(bm[0])
        );
      }

      return String(a).localeCompare(
        String(b)
      );
    });
}

function keysObject_(keys) {
  const object = {};

  keys.forEach(function (key) {
    object[key] = "";
  });

  return object;
}

function displayQuestion_(key) {
  if (/^q\d+$/i.test(key)) {
    return (
      "Q" +
      String(key).match(/\d+/)[0]
    );
  }

  return String(key)
    .replace(/-/g, " ")
    .replace(
      /\b\w/g,
      function (character) {
        return character.toUpperCase();
      }
    );
}

function answerValue_(value) {
  if (
    value &&
    typeof value === "object"
  ) {
    return JSON.stringify(value);
  }

  return value === undefined ||
    value === null
    ? ""
    : value;
}

function nonblankCount_(object) {
  return Object
    .keys(safeObject_(object))
    .filter(function (key) {
      const value = object[key];

      return (
        value !== "" &&
        value !== null &&
        value !== undefined
      );
    })
    .length;
}

function truthyCount_(object) {
  return Object
    .keys(safeObject_(object))
    .filter(function (key) {
      return Boolean(object[key]);
    })
    .length;
}

function safeObject_(value) {
  return (
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
  )
    ? value
    : {};
}

function parseJson_(value, fallback) {
  if (
    value === "" ||
    value === null ||
    value === undefined
  ) {
    return fallback;
  }

  if (typeof value === "object") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (err) {
    return fallback;
  }
}

function firstValue_(values) {
  for (
    let i = 0;
    i < values.length;
    i++
  ) {
    if (
      values[i] !== undefined &&
      values[i] !== null &&
      values[i] !== ""
    ) {
      return values[i];
    }
  }

  return "";
}

function firstDefined_(values) {
  for (
    let i = 0;
    i < values.length;
    i++
  ) {
    if (
      values[i] !== undefined &&
      values[i] !== null &&
      values[i] !== ""
    ) {
      return values[i];
    }
  }

  return undefined;
}

function number_(value) {
  return Math.round(
    Number(value) || 0
  );
}

function seconds_(value) {
  return Math.max(
    0,
    Math.round(Number(value) || 0)
  );
}

function earliest_(a, b) {
  const first = toDate_(a);
  const second = toDate_(b);

  if (!first) {
    return second;
  }

  if (!second) {
    return first;
  }

  return first < second
    ? first
    : second;
}

function toDate_(value) {
  if (!value) {
    return null;
  }

  if (
    Object.prototype.toString.call(value) ===
      "[object Date]" &&
    !isNaN(value)
  ) {
    return value;
  }

  const date = new Date(value);

  return isNaN(date.getTime())
    ? null
    : date;
}

function iso_(value) {
  const date = toDate_(value);

  return date
    ? date.toISOString()
    : "";
}

function duration_(value) {
  const seconds = seconds_(value);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(
    (seconds % 3600) / 60
  );
  const remainder = seconds % 60;

  if (hours) {
    return (
      hours +
      ":" +
      String(minutes).padStart(2, "0") +
      ":" +
      String(remainder).padStart(2, "0")
    );
  }

  return (
    minutes +
    ":" +
    String(remainder).padStart(2, "0")
  );
}

function safeError_(error) {
  return error && error.message
    ? error.message
    : String(error);
}

function json_(object) {
  return ContentService
    .createTextOutput(
      JSON.stringify(object)
    )
    .setMimeType(
      ContentService.MimeType.JSON
    );
}

function jsonp_(callback, object) {
  const safeCallback = String(
    callback || "callback"
  ).replace(/[^\w$]/g, "");

  return ContentService
    .createTextOutput(
      safeCallback +
      "(" +
      JSON.stringify(object) +
      ");"
    )
    .setMimeType(
      ContentService.MimeType.JAVASCRIPT
    );
}";
const questions=window.BLOCK_QUESTIONS;
const C=window.BLOCK_CONFIG;
const $=id=>document.getElementById(id);
const state={answers:{},mastered:{},attempts:{},wrongTotal:0,correctChecks:0,currentIndex:0,firstStart:new Date().toISOString(),sessions:1,activeSeconds:0,awaySeconds:0,tabLeaves:0,events:[],questionSeconds:{},lastTick:Date.now(),status:"in progress"};
let saveTimer=null,advanceTimer=null,started=false;

function init(){
  $("pageTitle").textContent=C.title;$("pageDescription").textContent=C.description;$("practiceText").textContent=C.practice;
  $("startBtn").onclick=start;$("loadBtn").onclick=loadCloud;$("saveBtn").onclick=()=>cloudSave(true);$("resetBtn").onclick=resetAssignment;$("workspaceResetBtn").onclick=resetAssignment;$("submitBtn").onclick=submit;$("completionResetBtn").onclick=resetAssignment;
  ["studentName","email"].forEach(id=>$(id).addEventListener("change",restoreLocal));$("period").addEventListener("change",saveLocal);
  document.addEventListener("visibilitychange",()=>{tick();if(document.hidden)state.tabLeaves++;state.events.push({type:document.hidden?"leave":"return",at:new Date().toISOString()})});
  document.addEventListener("copy",()=>state.events.push({type:"copy",question:currentQuestion()?.id||"",at:new Date().toISOString()}));
  document.addEventListener("paste",()=>state.events.push({type:"paste",question:currentQuestion()?.id||"",at:new Date().toISOString()}));
  setInterval(()=>{tick();updateStats();if(started)saveLocal()},1000);
}
function student(){return{name:$("studentName").value.trim(),period:$("period").value,email:$("email").value.trim().toLowerCase()}}
function valid(show=true){const s=student(),ok=s.name&&s.period&&/^\S+@\S+\.\S+$/.test(s.email);if(!ok&&show)$("saveStatus").textContent="Enter full name, period, and a valid school email first.";return ok}
function storageKey(){return `${C.assignmentKey}|${student().email}`}
function resetAssignment(){
  if(!student().email){$("saveStatus").textContent="Enter the same school email used for this assignment, then select Reset Assignment.";return}
  if(!confirm("Restart this assignment at Question 1 on this device? Earlier teacher records will remain in the spreadsheet."))return;
  localStorage.removeItem(storageKey());
  location.reload();
}
function start(){if(!valid(true))return;restoreLocal();started=true;state.sessions=Math.max(1,state.sessions||1);$("studentPanel").classList.add("hidden");$("workspace").classList.remove("hidden");goToFirstUnmastered();renderQuestion();updateStats();queueCloudSave()}
function currentQuestion(){return questions[state.currentIndex]}
function goToFirstUnmastered(){const i=questions.findIndex(q=>!state.mastered[q.id]);state.currentIndex=i<0?questions.length:i}
function renderQuestion(){
  if(state.currentIndex>=questions.length){showCompletion();return}
  const q=currentQuestion(),n=state.currentIndex+1,letters=["A","B","C","D"];
  $("questionCard").innerHTML=`<h2>${escapeHtml(q.topic||q.cs)}</h2><p class="prompt">${escapeHtml(q.prompt)}</p><div class="choices">${q.choices.map((choice,i)=>`<button class="choice" data-choice="${i}"><span class="choice-letter">${letters[i]}.</span><span>${escapeHtml(choice)}</span></button>`).join("")}</div><div id="feedback" class="feedback" role="status"></div>${q.source?`<div class="source-box"><a href="${q.source}" target="_blank" rel="noopener">Open supporting source ↗</a><p><strong>Where to look:</strong> ${escapeHtml(q.where)}</p></div>`:""}`;
  document.querySelectorAll("[data-choice]").forEach(b=>b.onclick=()=>answer(Number(b.dataset.choice),b));
  updateStats();window.scrollTo({top:Math.max(0,$("workspace").offsetTop-12),behavior:"smooth"});
}
function answer(choice,button){
  if(advanceTimer)return;const q=currentQuestion(),f=$("feedback");state.answers[q.id]=choice;state.attempts[q.id]=(state.attempts[q.id]||0)+1;
  if(choice===q.answer){
    state.correctChecks++;state.mastered[q.id]=true;button.classList.add("correct");document.querySelectorAll("[data-choice]").forEach(b=>b.disabled=true);
    f.className="feedback good";f.innerHTML=`<strong>Correct.</strong> ${escapeHtml(q.explanation)}<span class="advance-note">Advancing to the next question…</span>`;
    state.events.push({type:"correct",question:q.id,attempt:state.attempts[q.id],at:new Date().toISOString()});saveLocal();updateStats();queueCloudSave();
    advanceTimer=setTimeout(()=>{advanceTimer=null;state.currentIndex++;while(state.currentIndex<questions.length&&state.mastered[questions[state.currentIndex].id])state.currentIndex++;renderQuestion()},4000);
  }else{
    state.wrongTotal++;button.classList.add("wrong");setTimeout(()=>button.classList.remove("wrong"),550);f.className="feedback bad";f.innerHTML=`<strong>Not yet.</strong> ${escapeHtml(q.hint)}`;
    state.events.push({type:"wrong",question:q.id,choice,at:new Date().toISOString()});saveLocal();updateStats();queueCloudSave();
  }
}
function updateStats(){const mastered=questions.filter(q=>state.mastered[q.id]).length,attempts=Object.values(state.attempts).reduce((a,b)=>a+(Number(b)||0),0),accuracy=attempts?Math.round(mastered/attempts*100):100;$("progressStat").textContent=`${Math.min(mastered+1,questions.length)} / ${questions.length}`;$("accuracyStat").textContent=`${accuracy}%`;$("runtimeStat").textContent=formatTime(state.activeSeconds)}
function formatTime(s){s=Math.max(0,Math.floor(s||0));const h=Math.floor(s/3600),m=Math.floor(s%3600/60),sec=s%60;return h?`${h}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`:`${m}:${String(sec).padStart(2,"0")}`}
function tick(){const now=Date.now(),sec=Math.min(15,Math.max(0,(now-state.lastTick)/1000));if(started){if(document.hidden)state.awaySeconds+=sec;else state.activeSeconds+=sec;const q=currentQuestion();if(q)state.questionSeconds[q.id]=(state.questionSeconds[q.id]||0)+sec}state.lastTick=now}
function showCompletion(){started=false;state.status="completed";state.completedAt=state.completedAt||new Date().toISOString();$("workspace").classList.add("hidden");$("completion").classList.remove("hidden");const attempts=Object.values(state.attempts).reduce((a,b)=>a+(Number(b)||0),0),accuracy=attempts?Math.round(questions.length/attempts*100):100,s=student();let nameLine=$("completionStudent");if(!nameLine){nameLine=document.createElement("h3");nameLine.id="completionStudent";nameLine.style.cssText="margin:.8rem auto;color:#fff;font-size:1.55rem;padding:10px 14px;border:1px solid #4b6fa8;border-radius:12px;background:#172c4d;max-width:620px";$("completion").insertBefore(nameLine,$("completionSummary"))}nameLine.textContent=`Completed by: ${s.name} • Period ${s.period}`;$("completionSummary").textContent=`${questions.length} of ${questions.length} mastered • ${attempts} attempts • ${accuracy}% accuracy • ${formatTime(state.activeSeconds)} active time.`;saveLocal();queueCloudSave()}
function payload(){tick();const mastered=questions.filter(q=>state.mastered[q.id]).length,totalAttempts=Object.values(state.attempts).reduce((a,b)=>a+(Number(b)||0),0),accuracy=totalAttempts?Math.round(mastered/totalAttempts*100):100;return{assignmentKey:C.assignmentKey,assignmentTitle:C.title,course:"Government",assignmentType:"vocabulary",student:student(),state:{...state},answers:{...state.answers},mastered:{...state.mastered},score:mastered,total:questions.length,percent:Math.round(mastered/questions.length*100),masteryScore:mastered,masteryPercent:Math.round(mastered/questions.length*100),totalAttempts,accuracyPercent:accuracy,answerCount:Object.keys(state.answers).length,wrongAttempts:state.wrongTotal,updatedAt:new Date().toISOString()}}
function saveLocal(){if(!student().email)return;localStorage.setItem(storageKey(),JSON.stringify(payload()))}
function restoreLocal(){if(!student().email)return;const raw=localStorage.getItem(storageKey());if(!raw)return;try{mergeDraft(JSON.parse(raw));$("saveStatus").textContent="Saved work restored on this device."}catch{}}
function mergeDraft(d){if(!d)return;const s=d.state||d;Object.assign(state.answers,d.answers||s.answers||{});Object.assign(state.mastered,d.mastered||s.mastered||{});for(const[k,v]of Object.entries(s.attempts||{}))state.attempts[k]=Math.max(state.attempts[k]||0,Number(v)||0);state.wrongTotal=Math.max(state.wrongTotal||0,s.wrongTotal||d.wrongAttempts||0);state.correctChecks=Math.max(state.correctChecks||0,s.correctChecks||0);state.activeSeconds=Math.max(state.activeSeconds||0,s.activeSeconds||0);state.awaySeconds=Math.max(state.awaySeconds||0,s.awaySeconds||0);state.tabLeaves=Math.max(state.tabLeaves||0,s.tabLeaves||0);state.firstStart=s.firstStart||state.firstStart;state.events=[...(state.events||[]),...(s.events||[])].slice(-500);state.questionSeconds=Object.assign({},s.questionSeconds||{},state.questionSeconds||{});goToFirstUnmastered()}
function queueCloudSave(){clearTimeout(saveTimer);saveTimer=setTimeout(()=>cloudSave(false),750)}
async function cloudSave(manual){if(!valid(false)||APPS_SCRIPT_URL.startsWith("PASTE_")){if(manual)$("saveStatus").textContent=APPS_SCRIPT_URL.startsWith("PASTE_")?"Saved on this device. Add the Apps Script web-app URL for teacher saving.":"Enter complete student information first.";return}saveLocal();try{await fetch(APPS_SCRIPT_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({action:"save",payload:JSON.stringify(payload())})});$("saveStatus").textContent="Saved on this device and sent to your teacher draft."}catch{$("saveStatus").textContent="Saved on this device. Teacher save could not be confirmed."}}
function loadCloud(){if(!valid(true)||APPS_SCRIPT_URL.startsWith("PASTE_")){if(APPS_SCRIPT_URL.startsWith("PASTE_"))$("saveStatus").textContent="Add the Apps Script web-app URL before loading teacher drafts.";return}const cb=`load_${Date.now()}`,script=document.createElement("script");window[cb]=r=>{try{if(r&&r.found)mergeDraft(r.payload);saveLocal();$("saveStatus").textContent=r&&r.found?"Previous work merged safely.":"No teacher draft was found."}finally{delete window[cb];script.remove()}};script.src=`${APPS_SCRIPT_URL}?action=load&assignmentKey=${encodeURIComponent(C.assignmentKey)}&email=${encodeURIComponent(student().email)}&callback=${cb}`;script.onerror=()=>{$("saveStatus").textContent="Could not load the teacher draft.";delete window[cb];script.remove()};document.body.appendChild(script)}
async function submit(){if(!valid(true))return;state.status="submitted";state.submittedAt=new Date().toISOString();await cloudSave(true);$("submitStatus").textContent="Submitted successfully at 100% mastery.";$("submitBtn").disabled=true}
function escapeHtml(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
init();
