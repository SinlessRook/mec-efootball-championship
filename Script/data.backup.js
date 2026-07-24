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
   ========================================================= */

const TOURNAMENT = {
  "name": "Continental eCup",
  "shortName": "CONTINENTAL eCUP",
  "season": "26",
  "logo": "⚽",
  "format": "Online 1v1 eFootball tournament — League Phase followed by Knockout Stage",
  "qualifyCount": 8
};

/* ---------- PARTICIPANTS ---------- */
const PARTICIPANTS = [
  { "code": "ARG", "name": "Paul Kuriakose", "country": "Argentina", "flag": "ar", "color": "#6EC6FF", "goals": 0, "assists": 0, "yellow": 0, "red": 0, "passes": 0 },
  { "code": "ESP", "name": "Adithyan", "country": "Spain", "flag": "es", "color": "#E53935", "goals": 2, "assists": 0, "yellow": 0, "red": 0, "passes": 109 },
  { "code": "GER", "name": "Hari Govind", "country": "Germany", "flag": "de", "color": "#212121", "goals": 0, "assists": 0, "yellow": 0, "red": 0, "passes": 0 },
  { "code": "FRA", "name": "Jo", "country": "France", "flag": "fr", "color": "#1565C0", "goals": 0, "assists": 0, "yellow": 0, "red": 0, "passes": 0 },
  { "code": "ENG", "name": "Eshaan", "country": "England", "flag": "gb-eng", "color": "#B71C1C", "goals": 0, "assists": 0, "yellow": 0, "red": 0, "passes": 0 },
  { "code": "BRA", "name": "Pranav", "country": "Brazil", "flag": "br", "color": "#2E7D32", "goals": 1, "assists": 0, "yellow": 0, "red": 0, "passes": 55 },
  { "code": "POR", "name": "Jones", "country": "Portugal", "flag": "pt", "color": "#C62828", "goals": 0, "assists": 0, "yellow": 0, "red": 0, "passes": 0 },
  { "code": "NED", "name": "Gopi", "country": "Netherlands", "flag": "nl", "color": "#EF6C00", "goals": 0, "assists": 0, "yellow": 0, "red": 0, "passes": 0 },
  { "code": "CRO", "name": "Adwin", "country": "Croatia", "flag": "hr", "color": "#D32F2F", "goals": 0, "assists": 0, "yellow": 0, "red": 0, "passes": 0 },
  { "code": "BEL", "name": "Akshay B", "country": "Belgium", "flag": "be", "color": "#F9A825", "goals": 0, "assists": 0, "yellow": 0, "red": 0, "passes": 0 },
  { "code": "ITA", "name": "Amithesh", "country": "Italy", "flag": "it", "color": "#1976D2", "goals": 0, "assists": 0, "yellow": 0, "red": 0, "passes": 0 },
  { "code": "MAR", "name": "Ivan", "country": "Morocco", "flag": "ma", "color": "#8E0000", "goals": 3, "assists": 0, "yellow": 0, "red": 0, "passes": 105 },
  { "code": "NOR", "name": "Pradham", "country": "Norway", "flag": "no", "color": "#3949AB", "goals": 0, "assists": 0, "yellow": 0, "red": 0, "passes": 0 },
  { "code": "SWE", "name": "Anujith", "country": "Switzerland", "flag": "ch", "color": "#888888", "goals": 0, "assists": 0, "yellow": 0, "red": 0, "passes": 0 },
  { "code": "JPN", "name": "Jeevan", "country": "Japan", "flag": "jp", "color": "#8ab931", "goals": 0, "assists": 0, "yellow": 0, "red": 0, "passes": 0 },
  { "code": "MEX", "name": "Akshay A", "country": "Mexico", "flag": "🇲🇽", "color": "#18e7d9", "goals": 0, "assists": 0, "yellow": 0, "red": 0, "passes": 0 }
];

/* ---------- FIXTURES ---------- */
const FIXTURES = [
  { "matchday": 1, "date": "Matchday 1", "matches": [
    { "home": "ESP", "away": "MAR", "time": "12:09" },
    { "home": "ARG", "away": "NOR", "time": "12:09" },
    { "home": "GER", "away": "CRO", "time": "12:09" },
    { "home": "FRA", "away": "BEL", "time": "12:09" },
    { "home": "ENG", "away": "POR", "time": "12:09" },
    { "home": "BRA", "away": "ITA", "time": "12:09" }
  ]},
  { "matchday": 2, "date": "Matchday 2", "matches": [
    { "home": "ESP", "away": "ENG", "time": "TBD" },
    { "home": "FRA", "away": "NED", "time": "TBD" },
    { "home": "ARG", "away": "CRO", "time": "TBD" },
    { "home": "GER", "away": "BEL", "time": "TBD" },
    { "home": "ITA", "away": "MAR", "time": "TBD" },
    { "home": "BRA", "away": "POR", "time": "TBD" }
  ]},
  { "matchday": 3, "date": "Matchday 3", "matches": [
    { "home": "ESP", "away": "GER", "time": "TBD" },
    { "home": "ARG", "away": "FRA", "time": "TBD" },
    { "home": "ENG", "away": "BRA", "time": "TBD" },
    { "home": "NED", "away": "BEL", "time": "TBD" },
    { "home": "CRO", "away": "ITA", "time": "TBD" },
    { "home": "POR", "away": "NOR", "time": "TBD" }
  ]},
  { "matchday": 4, "date": "Matchday 4", "matches": [
    { "home": "ESP", "away": "ARG", "time": "TBD" },
    { "home": "FRA", "away": "ENG", "time": "TBD" },
    { "home": "GER", "away": "NED", "time": "TBD" },
    { "home": "BRA", "away": "MAR", "time": "TBD" },
    { "home": "CRO", "away": "POR", "time": "TBD" },
    { "home": "BEL", "away": "NOR", "time": "TBD" }
  ]},
  { "matchday": 5, "date": "Matchday 5", "matches": [

  ]}
];

/* ---------- RESULTS ---------- */
const RESULTS = [
  [[2,3], null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  []
];

const NEXT_KICKOFF_ISO = "2026-07-25T17:00:00";

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
  { "icon": "🏆", "title": "The format", "text": "13 players face off online across 4 group-stage matchdays. The top 8 in the standings advance to a straight knockout: quarterfinals, semifinals, then the grand final." },
  { "icon": "🔢", "title": "Points", "text": "A win is worth 3 points, a draw is worth 1 point, and a loss is worth 0. Most points after the group stage wins top seed." },
  { "icon": "⚖️", "title": "Breaking ties", "text": "If players finish level on points, we check goal difference first, then total goals scored, then the head-to-head result between those players." },
  { "icon": "⏱️", "title": "Match length", "text": "Every match is played to the full 90 in-game minutes across two 45-minute halves. Knockout matches level after regulation get extra time, then a penalty shootout if still tied." },
  { "icon": "🟨", "title": "Cards", "text": "A yellow card is a caution; two in the same match means an automatic red. A red card sends a player off and rules them out of the next match." },
  { "icon": "🔄", "title": "Substitutions", "text": "Each player can make up to 5 substitutions, used across a maximum of 3 stoppages in play (plus half-time) — exactly as the game engine allows." },
  { "icon": "🔌", "title": "Disconnects", "text": "If a match disconnects before the 60th minute, it's replayed from scratch. After that, the score at the moment of the drop stands as full-time." },
  { "icon": "📌", "title": "Game Settings", "text": "Use authentic team. Condition should be set as random and uniform rating should be turned off" }
];
