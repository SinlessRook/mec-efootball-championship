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

   MATCH_STATS holds the per-match passes/yellow/red cards you
   enter alongside a score. PARTICIPANT_BASE holds each player's
   "starting totals" — stats from before this tracking existed
   (or anything you'd rather adjust by hand). Every player's
   final season total (in PARTICIPANTS below) is always just:
     starting total + everything tallied from MATCH_STATS/RESULTS
   You never need to hand-edit PARTICIPANTS' stat numbers — the
   admin UI recalculates them on every save.
   ========================================================= */
`;

/* ---------- load data.js as data, without needing module.exports in the file itself ---------- */
function loadData() {
  const code = fs.readFileSync(DATA_PATH, "utf8");
  const footer = `
;module.exports = {
  TOURNAMENT, PARTICIPANTS, FIXTURES, RESULTS,
  MATCH_STATS: typeof MATCH_STATS !== 'undefined' ? MATCH_STATS : undefined,
  PARTICIPANT_BASE: typeof PARTICIPANT_BASE !== 'undefined' ? PARTICIPANT_BASE : undefined,
  NEXT_KICKOFF_ISO, KNOCKOUT_DATES, RULES
};
`;
  const sandbox = { module: { exports: {} }, console };
  vm.createContext(sandbox);
  vm.runInContext(code + footer, sandbox, { filename: "data.js" });
  const data = sandbox.module.exports;

  migrate(data);
  return data;
}

/* ---------- one-time migration: add MATCH_STATS / PARTICIPANT_BASE the first time
   this admin UI touches an older data.js that doesn't have them yet ---------- */
function migrate(data) {
  if (!Array.isArray(data.RESULTS)) data.RESULTS = [];
  if (!Array.isArray(data.FIXTURES)) data.FIXTURES = [];

  // MATCH_STATS: same shape as RESULTS (per matchday, per match), null until entered
  if (!Array.isArray(data.MATCH_STATS)) {
    data.MATCH_STATS = data.FIXTURES.map((md) => md.matches.map(() => null));
  } else {
    // keep it in sync if matches were added/removed since last save
    data.MATCH_STATS = data.FIXTURES.map((md, mdi) =>
      md.matches.map((m, mi) => (data.MATCH_STATS[mdi] && data.MATCH_STATS[mdi][mi]) || null)
    );
  }

  // PARTICIPANT_BASE: "starting totals" per player code, computed once so that
  // base.goals + (goals already visible in RESULTS) === the goals total that
  // was already sitting in PARTICIPANTS before this feature existed.
  if (!data.PARTICIPANT_BASE || typeof data.PARTICIPANT_BASE !== "object") {
    const goalsFromResults = tallyGoalsFromResults(data);
    data.PARTICIPANT_BASE = {};
    (data.PARTICIPANTS || []).forEach((p) => {
      const alreadyCounted = goalsFromResults[p.code] || 0;
      data.PARTICIPANT_BASE[p.code] = {
        goals: Math.max(0, Number(p.goals || 0) - alreadyCounted),
        assists: Number(p.assists || 0),
        yellow: Number(p.yellow || 0),
        red: Number(p.red || 0),
        passes: Number(p.passes || 0),
      };
    });
  } else {
    // make sure every current player has a base entry (new players added since)
    (data.PARTICIPANTS || []).forEach((p) => {
      if (!data.PARTICIPANT_BASE[p.code]) {
        data.PARTICIPANT_BASE[p.code] = { goals: 0, assists: 0, yellow: 0, red: 0, passes: 0 };
      }
    });
  }

  recomputeCumulativeTotals(data);
}

function tallyGoalsFromResults(data) {
  const totals = {};
  (data.FIXTURES || []).forEach((md, mdi) => {
    md.matches.forEach((m, mi) => {
      const score = data.RESULTS[mdi] && data.RESULTS[mdi][mi];
      if (!score) return;
      totals[m.home] = (totals[m.home] || 0) + Number(score[0] || 0);
      totals[m.away] = (totals[m.away] || 0) + Number(score[1] || 0);
    });
  });
  return totals;
}

/* ---------- recompute every player's cumulative goals/assists/yellow/red/passes
   from PARTICIPANT_BASE + RESULTS (goals) + MATCH_STATS (passes/yellow/red).
   Assists aren't tracked per-match (no per-match input for them), so a
   player's assists total is just their PARTICIPANT_BASE assists value,
   editable directly in the Participants tab. ---------- */
function recomputeCumulativeTotals(data) {
  const goalsFromResults = tallyGoalsFromResults(data);
  const passes = {};
  const yellow = {};
  const red = {};

  (data.FIXTURES || []).forEach((md, mdi) => {
    md.matches.forEach((m, mi) => {
      const s = data.MATCH_STATS[mdi] && data.MATCH_STATS[mdi][mi];
      if (!s) return;
      if (s.passes) {
        passes[m.home] = (passes[m.home] || 0) + Number(s.passes[0] || 0);
        passes[m.away] = (passes[m.away] || 0) + Number(s.passes[1] || 0);
      }
      if (s.yellow) {
        yellow[m.home] = (yellow[m.home] || 0) + Number(s.yellow[0] || 0);
        yellow[m.away] = (yellow[m.away] || 0) + Number(s.yellow[1] || 0);
      }
      if (s.red) {
        red[m.home] = (red[m.home] || 0) + Number(s.red[0] || 0);
        red[m.away] = (red[m.away] || 0) + Number(s.red[1] || 0);
      }
    });
  });

  (data.PARTICIPANTS || []).forEach((p) => {
    const base = data.PARTICIPANT_BASE[p.code] || { goals: 0, assists: 0, yellow: 0, red: 0, passes: 0 };
    p.goals = base.goals + (goalsFromResults[p.code] || 0);
    p.assists = base.assists;
    p.yellow = base.yellow + (yellow[p.code] || 0);
    p.red = base.red + (red[p.code] || 0);
    p.passes = base.passes + (passes[p.code] || 0);
  });
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

function matchStatsBlock(matchStats) {
  const rows = matchStats.map((md) => {
    const cells = md.map((s) => (s ? JSON.stringify(s) : "null"));
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

function participantBaseBlock(base) {
  const rows = Object.keys(base).map(
    (code) =>
      `  ${JSON.stringify(code)}: { "goals": ${Number(base[code].goals) || 0}, "assists": ${
        Number(base[code].assists) || 0
      }, "yellow": ${Number(base[code].yellow) || 0}, "red": ${Number(base[code].red) || 0}, "passes": ${
        Number(base[code].passes) || 0
      } }`
  );
  return `{\n${rows.join(",\n")}\n}`;
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
  recomputeCumulativeTotals(data);

  const out = `${HEADER}
const TOURNAMENT = ${JSON.stringify(data.TOURNAMENT, null, 2)};

/* ---------- PARTICIPANTS (stat totals are auto-calculated — see PARTICIPANT_BASE below) ---------- */
const PARTICIPANTS = ${participantsBlock(data.PARTICIPANTS)};

/* ---------- PARTICIPANT_BASE — starting totals per player, carried over from
   before per-match tracking (or manual adjustments). Edit these in the
   Participants tab under "Starting totals"; don't edit PARTICIPANTS' stat
   fields above by hand, they get overwritten on every save. ---------- */
const PARTICIPANT_BASE = ${participantBaseBlock(data.PARTICIPANT_BASE)};

/* ---------- FIXTURES ---------- */
const FIXTURES = ${fixturesBlock(data.FIXTURES)};

/* ---------- RESULTS ---------- */
const RESULTS = ${resultsBlock(data.RESULTS)};

/* ---------- MATCH_STATS — passes/yellow/red per match, same shape as RESULTS.
   null means "not entered yet". Format per match: {"passes":[home,away],
   "yellow":[home,away],"red":[home,away]} ---------- */
const MATCH_STATS = ${matchStatsBlock(data.MATCH_STATS)};

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