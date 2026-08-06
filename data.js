/* =========================================================
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

const TOURNAMENT = {
  "name": "Continental eCup",
  "shortName": "CONTINENTAL eCUP",
  "season": "26",
  "logo": "⚽",
  "format": "Online 1v1 eFootball tournament — League Phase followed by Knockout Stage",
  "qualifyCount": 8
};

/* ---------- PARTICIPANTS (stat totals are auto-calculated — see PARTICIPANT_BASE below) ---------- */
const PARTICIPANTS = [
  { "code": "ARG", "name": "Paul Kuriakose", "country": "Argentina", "flag": "ar", "color": "#6EC6FF", "goals": 3, "assists": 0, "yellow": 0, "red": 0, "passes": 154 },
  { "code": "ESP", "name": "Adithyan", "country": "Spain", "flag": "es", "color": "#E53935", "goals": 6, "assists": 0, "yellow": 0, "red": 0, "passes": 382 },
  { "code": "GER", "name": "Hari Govind", "country": "Germany", "flag": "de", "color": "#212121", "goals": 1, "assists": 0, "yellow": 1, "red": 0, "passes": 275 },
  { "code": "FRA", "name": "Jo", "country": "France", "flag": "fr", "color": "#1565C0", "goals": 1, "assists": 0, "yellow": 0, "red": 0, "passes": 146 },
  { "code": "ENG", "name": "Eshaan", "country": "England", "flag": "gb-eng", "color": "#B71C1C", "goals": 8, "assists": 0, "yellow": 0, "red": 0, "passes": 149 },
  { "code": "BRA", "name": "Pranav", "country": "Brazil", "flag": "br", "color": "#2E7D32", "goals": 10, "assists": 0, "yellow": 0, "red": 1, "passes": 198 },
  { "code": "POR", "name": "Jones", "country": "Portugal", "flag": "pt", "color": "#C62828", "goals": 7, "assists": 0, "yellow": 0, "red": 0, "passes": 197 },
  { "code": "NED", "name": "Gopi", "country": "Netherlands", "flag": "nl", "color": "#EF6C00", "goals": 8, "assists": 0, "yellow": 0, "red": 0, "passes": 323 },
  { "code": "CRO", "name": "Adwin", "country": "Croatia", "flag": "hr", "color": "#D32F2F", "goals": 6, "assists": 0, "yellow": 0, "red": 0, "passes": 148 },
  { "code": "BEL", "name": "Akshay B", "country": "Belgium", "flag": "be", "color": "#F9A825", "goals": 4, "assists": 0, "yellow": 0, "red": 0, "passes": 204 },
  { "code": "ITA", "name": "Amithesh", "country": "Italy", "flag": "it", "color": "#1976D2", "goals": 9, "assists": 0, "yellow": 0, "red": 0, "passes": 190 },
  { "code": "MAR", "name": "Ivan", "country": "Morocco", "flag": "ma", "color": "#8E0000", "goals": 5, "assists": 0, "yellow": 0, "red": 0, "passes": 198 },
  { "code": "NOR", "name": "Pradham", "country": "Norway", "flag": "no", "color": "#3949AB", "goals": 7, "assists": 0, "yellow": 0, "red": 0, "passes": 250 },
  { "code": "SWE", "name": "Anujith", "country": "Switzerland", "flag": "ch", "color": "#888888", "goals": 3, "assists": 0, "yellow": 0, "red": 0, "passes": 97 },
  { "code": "JPN", "name": "Jeevan", "country": "Japan", "flag": "jp", "color": "#8ab931", "goals": 6, "assists": 0, "yellow": 0, "red": 0, "passes": 60 },
  { "code": "MEX", "name": "Akshay A", "country": "Mexico", "flag": "mx", "color": "#18e7d9", "goals": 2, "assists": 0, "yellow": 0, "red": 0, "passes": 146 }
];

/* ---------- PARTICIPANT_BASE — starting totals per player, carried over from
   before per-match tracking (or manual adjustments). Edit these in the
   Participants tab under "Starting totals"; don't edit PARTICIPANTS' stat
   fields above by hand, they get overwritten on every save. ---------- */
const PARTICIPANT_BASE = {
  "ARG": { "goals": 0, "assists": 0, "yellow": 0, "red": 0, "passes": 0 },
  "ESP": { "goals": 0, "assists": 0, "yellow": 0, "red": 0, "passes": 109 },
  "GER": { "goals": 0, "assists": 0, "yellow": 1, "red": 0, "passes": 166 },
  "FRA": { "goals": 0, "assists": 0, "yellow": 0, "red": 0, "passes": 0 },
  "ENG": { "goals": 0, "assists": 0, "yellow": 0, "red": 0, "passes": 0 },
  "BRA": { "goals": 0, "assists": 0, "yellow": 0, "red": 0, "passes": 55 },
  "POR": { "goals": 0, "assists": 0, "yellow": 0, "red": 0, "passes": 0 },
  "NED": { "goals": 0, "assists": 0, "yellow": 0, "red": 0, "passes": 73 },
  "CRO": { "goals": 0, "assists": 0, "yellow": 0, "red": 0, "passes": 24 },
  "BEL": { "goals": 0, "assists": 0, "yellow": 0, "red": 0, "passes": 119 },
  "ITA": { "goals": 0, "assists": 0, "yellow": 0, "red": 0, "passes": 51 },
  "MAR": { "goals": 0, "assists": 0, "yellow": 0, "red": 0, "passes": 150 },
  "NOR": { "goals": 0, "assists": 0, "yellow": 0, "red": 0, "passes": 0 },
  "SWE": { "goals": 0, "assists": 0, "yellow": 0, "red": 0, "passes": 0 },
  "JPN": { "goals": 0, "assists": 0, "yellow": 0, "red": 0, "passes": 0 },
  "MEX": { "goals": 0, "assists": 0, "yellow": 0, "red": 0, "passes": 0 }
};

/* ---------- FIXTURES ---------- */
const FIXTURES = [
  { "matchday": 1, "date": "Matchday 1", "matches": [
    { "home": "ESP", "away": "MAR", "time": "12:09" },
    { "home": "ARG", "away": "NOR", "time": "12:09" },
    { "home": "GER", "away": "CRO", "time": "12:09" },
    { "home": "FRA", "away": "BEL", "time": "12:09" },
    { "home": "ENG", "away": "POR", "time": "12:09" },
    { "home": "NED", "away": "SWE", "time": "12:09" }
  ]},
  { "matchday": 2, "date": "Matchday 2", "matches": [
    { "home": "ESP", "away": "GER", "time": "TBD" },
    { "home": "FRA", "away": "NED", "time": "TBD" },
    { "home": "ARG", "away": "JPN", "time": "TBD" },
    { "home": "ITA", "away": "MAR", "time": "TBD" },
    { "home": "BRA", "away": "POR", "time": "TBD" },
    { "home": "NOR", "away": "MEX", "time": "TBD" },
    { "home": "ENG", "away": "SWE", "time": "TBD" }
  ]},
  { "matchday": 3, "date": "Matchday 3", "matches": [
    { "home": "ESP", "away": "ARG", "time": "TBD" },
    { "home": "CRO", "away": "ITA", "time": "TBD" },
    { "home": "ENG", "away": "BRA", "time": "TBD" },
    { "home": "NED", "away": "BEL", "time": "TBD" },
    { "home": "SWE", "away": "MEX", "time": "TBD" },
    { "home": "JPN", "away": "NOR", "time": "TBD" }
  ]},
  { "matchday": 4, "date": "Matchday 4", "matches": [
    { "home": "ESP", "away": "FRA", "time": "TBD" },
    { "home": "GER", "away": "NED", "time": "TBD" },
    { "home": "CRO", "away": "POR", "time": "TBD" },
    { "home": "BRA", "away": "MAR", "time": "TBD" },
    { "home": "ITA", "away": "ENG", "time": "TBD" },
    { "home": "BEL", "away": "NOR", "time": "TBD" },
    { "home": "JPN", "away": "MEX", "time": "ASAP" }
  ]},
  { "matchday": 5, "date": "Matchday 5", "matches": [
    { "home": "MAR", "away": "ARG", "time": "TBD" },
    { "home": "CRO", "away": "MEX", "time": "TBD" },
    { "home": "FRA", "away": "JPN", "time": "ASAP" },
    { "home": "GER", "away": "BEL", "time": "TBD" },
    { "home": "ITA", "away": "BRA", "time": "TBD" },
    { "home": "POR", "away": "SWE", "time": "ASAP" }
  ]}
];

/* ---------- RESULTS ---------- */
const RESULTS = [
  [[2,3], [0,1], [1,0], [0,1], [1,2], [2,0]],
  [[1,0], [1,2], [2,2], [2,1], [6,1], [4,1], [2,0]],
  [[1,0], [1,2], [3,3], [3,1], [3,1], [1,2]],
  [[2,0], [0,1], [2,0], [1,0], [2,2], [1,0], [3,0]],
  [[1,1], [3,0], null, [0,1], [3,0], [4,0]]
];

/* ---------- MATCH_STATS — passes/yellow/red per match, same shape as RESULTS.
   null means "not entered yet". Format per match: {"passes":[home,away],
   "yellow":[home,away],"red":[home,away]} ---------- */
const MATCH_STATS = [
  [null, {"passes":[60,45],"yellow":[0,0],"red":[0,0]}, null, {"passes":[54,49],"yellow":[0,0],"red":[0,0]}, {"passes":[46,57],"yellow":[0,0],"red":[0,0]}, {"passes":[108,21],"yellow":[0,0],"red":[0,0]}],
  [{"passes":[98,50],"yellow":[0,0],"red":[0,0]}, {"passes":[52,81],"yellow":[0,0],"red":[0,0]}, null, null, {"passes":[57,70],"yellow":[0,0],"red":[0,0]}, {"passes":[63,30],"yellow":[0,0],"red":[0,0]}, {"passes":[47,27],"yellow":[0,0],"red":[0,0]}],
  [{"passes":[85,42],"yellow":[0,0],"red":[0,0]}, {"passes":[32,70],"yellow":[0,0],"red":[0,0]}, {"passes":[56,40],"yellow":[0,0],"red":[0,0]}, null, {"passes":[49,45],"yellow":[0,0],"red":[0,0]}, {"passes":[60,75],"yellow":[0,0],"red":[0,0]}],
  [{"passes":[90,40],"yellow":[0,0],"red":[0,0]}, {"passes":[59,61],"yellow":[0,0],"red":[0,0]}, {"passes":[32,70],"yellow":[0,0],"red":[0,0]}, null, null, {"passes":[36,67],"yellow":[0,0],"red":[0,0]}, null],
  [{"passes":[48,52],"yellow":[0,0],"red":[0,0]}, {"passes":[60,71],"yellow":[0,0],"red":[0,0]}, null, null, {"passes":[69,46],"yellow":[0,0],"red":[0,1]}, null]
];

const NEXT_KICKOFF_ISO = "2026-07-26T17:00:00";

const KNOCKOUT_DATES = {
  "qf1": "15 Aug",
  "qf2": "15 Aug",
  "qf3": "16 Aug",
  "qf4": "16 Aug",
  "sf1": "27 Aug",
  "sf2": "27 Aug",
  "final": "31 Aug · Grand Final"
};

const RULES = [
  { "icon": "🏆", "title": "The Format", "text": "16 players compete across 4 league-stage matchdays. Each player plays 4 matches, and the top 8 in the standings qualify for the knockout stage consisting of quarterfinals, semifinals, and the grand final." },
  { "icon": "🔢", "title": "Points", "text": "A win earns 3 points, a draw earns 1 point, and a loss earns 0 points. Teams are ranked by total points at the end of the league stage." },
  { "icon": "⚖️", "title": "Breaking Ties", "text": "If players finish level on points, the tiebreakers are applied in this order: goal difference, goals scored, and then the head-to-head result." },
  { "icon": "🎮", "title": "Team Selection", "text": "Players should use their assigned national team with authentic squads. However, if both players mutually agree before kickoff, they may instead use Dream Teams consisting only of players eligible for their assigned national team." },
  { "icon": "⏱️", "title": "Match Length", "text": "Matches are played over the full 90 in-game minutes. Knockout matches level after regulation proceed to extra time and, if required, a penalty shootout." },
  { "icon": "🔄", "title": "Substitutions", "text": "Up to 5 substitutions may be made across a maximum of 3 stoppages in play (excluding half-time), following the game's standard rules." },
  { "icon": "📷", "title": "Match Result", "text": "After every match, the losing player must share a screenshot of the match card in the tournament group. This helps verify the result and promotes good sportsmanship." },
  { "icon": "🔌", "title": "Disconnects", "text": "If a match disconnects before the 60th in-game minute, it should be replayed. If the disconnect occurs after the 60th minute, both players should mutually agree on the result based on the score at the time of the disconnect. If no agreement is reached, the tournament organizer will make the final decision." },
  { "icon": "📌", "title": "Game Settings", "text": "Use Random Condition and keep Uniform Rating turned OFF." }
];
