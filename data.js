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
  { "code": "MEX", "name": "Akshay A", "country": "Mexico", "flag": "mx", "color": "#18e7d9", "goals": 0, "assists": 0, "yellow": 0, "red": 0, "passes": 0 }
];

/* ---------- FIXTURES ---------- */
const FIXTURES = [
  {
    "matchday": 1, "date": "Matchday 1", "matches": [
      { "home": "ESP", "away": "MAR", "time": "12:09" },
      { "home": "ARG", "away": "NOR", "time": "12:09" },
      { "home": "GER", "away": "CRO", "time": "12:09" },
      { "home": "FRA", "away": "BEL", "time": "12:09" },
      { "home": "ENG", "away": "POR", "time": "12:09" },
      { "home": "NED", "away": "SWE", "time": "12:09" }
    ]
  },
  {
    "matchday": 2, "date": "Matchday 2", "matches": [
      { "home": "ESP", "away": "GER", "time": "TBD" },
      { "home": "FRA", "away": "NED", "time": "TBD" },
      { "home": "ARG", "away": "JPN", "time": "TBD" },
      { "home": "ITA", "away": "MAR", "time": "TBD" },
      { "home": "BRA", "away": "POR", "time": "TBD" },
      { "home": "NOR", "away": "MEX", "time": "TBD" },
      { "home": "ENG", "away": "SWE", "time": "TBD" }
    ]
  },
  {
    "matchday": 3, "date": "Matchday 3", "matches": [
      { "home": "ESP", "away": "ARG", "time": "TBD" },
      { "home": "CRO", "away": "ITA", "time": "TBD" },
      { "home": "ENG", "away": "BRA", "time": "TBD" },
      { "home": "NED", "away": "BEL", "time": "TBD" },
      { "home": "SWE", "away": "MEX", "time": "TBD" },
      { "home": "JPN", "away": "NOR", "time": "TBD" }
    ]
  },
  {
    "matchday": 4, "date": "Matchday 4", "matches": [
      { "home": "ESP", "away": "FRA", "time": "TBD" },
      { "home": "GER", "away": "NED", "time": "TBD" },
      { "home": "CRO", "away": "POR", "time": "TBD" },
      { "home": "BRA", "away": "MAR", "time": "TBD" },
      { "home": "ITA", "away": "ENG", "time": "TBD" },
      { "home": "BEL", "away": "NOR", "time": "TBD" },
      { "home": "JPN", "away": "MEX", "time": "TBD" }
    ]
  },
  {
    "matchday": 5, "date": "Matchday 5", "matches": [
      { "home": "MAR", "away": "ARG", "time": "TBD" },
      { "home": "CRO", "away": "MEX", "time": "TBD" },
      { "home": "FRA", "away": "JPN", "time": "TBD" },
      { "home": "GER", "away": "BEL", "time": "TBD" },
      { "home": "ITA", "away": "BRA", "time": "TBD" },
      { "home": "POR", "away": "SWE", "time": "TBD" }
    ]
  }
];

/* ---------- RESULTS ---------- */
const RESULTS = [
  [[2, 3], null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, [1, 0], null, null, null],
  [null, null, null, null, null, null]
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
  {
    icon: "🏆",
    title: "The Format",
    text: "16 players compete across 4 league-stage matchdays. Each player plays 4 matches, and the top 8 in the standings qualify for the knockout stage consisting of quarterfinals, semifinals, and the grand final."
  },
  {
    icon: "🔢",
    title: "Points",
    text: "A win earns 3 points, a draw earns 1 point, and a loss earns 0 points. Teams are ranked by total points at the end of the league stage."
  },
  {
    icon: "⚖️",
    title: "Breaking Ties",
    text: "If players finish level on points, the tiebreakers are applied in this order: goal difference, goals scored, and then the head-to-head result."
  },
  {
    icon: "🎮",
    title: "Team Selection",
    text: "Players should use their assigned national team with authentic squads. However, if both players mutually agree before kickoff, they may instead use Dream Teams consisting only of players eligible for their assigned national team."
  },
  {
    icon: "⏱️",
    title: "Match Length",
    text: "Matches are played over the full 90 in-game minutes. Knockout matches level after regulation proceed to extra time and, if required, a penalty shootout."
  },
  {
    icon: "🔄",
    title: "Substitutions",
    text: "Up to 5 substitutions may be made across a maximum of 3 stoppages in play (excluding half-time), following the game's standard rules."
  },
  {
    icon: "📷",
    title: "Match Result",
    text: "After every match, the losing player must share a screenshot of the match card in the tournament group. This helps verify the result and promotes good sportsmanship."
  },
  {
    icon: "🔌",
    title: "Disconnects",
    text: "If a match disconnects before the 60th in-game minute, it should be replayed. If the disconnect occurs after the 60th minute, both players should mutually agree on the result based on the score at the time of the disconnect. If no agreement is reached, the tournament organizer will make the final decision."
  },
  {
    icon: "📌",
    title: "Game Settings",
    text: "Use Random Condition and keep Uniform Rating turned OFF."
  }
];