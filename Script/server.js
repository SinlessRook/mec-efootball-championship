/* =========================================================
   CONTINENTAL eCUP — Admin Server
   Serves a small web UI (public/index.html) for editing
   data.js, and rewrites data.js on disk whenever you hit Save.

   Run:
     npm install
     node server.js
   Then open:  http://localhost:3737
   ========================================================= */

const express = require("express");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const app = express();
const PORT = process.env.PORT || 3737;
const DATA_PATH = path.join(__dirname, "../data.js");

app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(__dirname, "public")));

const HEADER = `/* =========================================================
   CONTINENTAL eCUP 26 — EDIT ME
   This is the ONLY file you should need to touch while running
   a tournament. Add/remove players, write the fixtures, fill in
   scores as matches are played, adjust dates or rules — here.
   script.js and style.css read everything from these variables
   and never need to change. Nothing in this file calculates
   anything: no standings, no bracket, no totals. Just data.

   NOTE: this file is also read & rewritten by the admin server
   (server.js) when you use the web UI. It's safe to keep hand-
   editing it too — just restart the admin UI page afterwards
   to pick up your changes.
   ========================================================= */
`;

/* ---------- load data.js as data, without needing module.exports in the file itself ---------- */
function loadData() {
  const code = fs.readFileSync(DATA_PATH, "utf8");
  const footer = `
;module.exports = { TOURNAMENT, PARTICIPANTS, FIXTURES, RESULTS, NEXT_KICKOFF_ISO, KNOCKOUT_DATES, RULES };
`;
  const sandbox = { module: { exports: {} }, console };
  vm.createContext(sandbox);
  vm.runInContext(code + footer, sandbox, { filename: "data.js" });
  return sandbox.module.exports;
}

/* ---------- pretty-print one matchday's matches block ---------- */
function fixturesBlock(fixtures) {
  const days = fixtures.map((md) => {
    const matches = md.matches
      .map(
        (m) =>
          `    { "home": ${JSON.stringify(m.home)}, "away": ${JSON.stringify(
            m.away
          )}, "time": ${JSON.stringify(m.time)} }`
      )
      .join(",\n");
    return `  { "matchday": ${md.matchday}, "date": ${JSON.stringify(
      md.date
    )}, "matches": [\n${matches}\n  ]}`;
  });
  return `[\n${days.join(",\n")}\n]`;
}

function resultsBlock(results) {
  const rows = results.map((md) => {
    const cells = md.map((score) => (score ? JSON.stringify(score) : "null"));
    return `  [${cells.join(", ")}]`;
  });
  return `[\n${rows.join(",\n")}\n]`;
}

function participantsBlock(list) {
  const rows = list.map(
    (p) =>
      `  { "code": ${JSON.stringify(p.code)}, "name": ${JSON.stringify(
        p.name
      )}, "country": ${JSON.stringify(p.country)}, "flag": ${JSON.stringify(
        p.flag
      )}, "color": ${JSON.stringify(p.color)}, "goals": ${Number(
        p.goals
      ) || 0}, "assists": ${Number(p.assists) || 0}, "yellow": ${Number(
        p.yellow
      ) || 0}, "red": ${Number(p.red) || 0}, "passes": ${Number(p.passes) || 0} }`
  );
  return `[\n${rows.join(",\n")}\n]`;
}

function rulesBlock(rules) {
  const rows = rules.map(
    (r) =>
      `  { "icon": ${JSON.stringify(r.icon)}, "title": ${JSON.stringify(
        r.title
      )}, "text": ${JSON.stringify(r.text)} }`
  );
  return `[\n${rows.join(",\n")}\n]`;
}

/* ---------- regenerate the whole data.js file from a data object ---------- */
function writeData(data) {
  const out = `${HEADER}
const TOURNAMENT = ${JSON.stringify(data.TOURNAMENT, null, 2)};

/* ---------- PARTICIPANTS ---------- */
const PARTICIPANTS = ${participantsBlock(data.PARTICIPANTS)};

/* ---------- FIXTURES ---------- */
const FIXTURES = ${fixturesBlock(data.FIXTURES)};

/* ---------- RESULTS ---------- */
const RESULTS = ${resultsBlock(data.RESULTS)};

const NEXT_KICKOFF_ISO = ${JSON.stringify(data.NEXT_KICKOFF_ISO)};

const KNOCKOUT_DATES = ${JSON.stringify(data.KNOCKOUT_DATES, null, 2)};

const RULES = ${rulesBlock(data.RULES)};
`;
  fs.writeFileSync(DATA_PATH, out, "utf8");
}

/* ---------- API ---------- */
app.get("/api/data", (req, res) => {
  try {
    res.json(loadData());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not read data.js: " + err.message });
  }
});

app.post("/api/data", (req, res) => {
  try {
    // keep a one-file rolling backup before overwriting
    if (fs.existsSync(DATA_PATH)) {
      fs.copyFileSync(DATA_PATH, path.join(__dirname, "data.backup.js"));
    }
    writeData(req.body);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not save data.js: " + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Continental eCup admin running at http://localhost:${PORT}`);
});
