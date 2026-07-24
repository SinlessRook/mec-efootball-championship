/* =========================================================
   CONTINENTAL eCUP 26 — EDIT ME
   This is the ONLY file you should need to touch while running
   a tournament. Add/remove players, write the fixtures, fill in
   scores as matches are played, adjust dates or rules — here.
   script.js and style.css read everything from these variables
   and never need to change. Nothing in this file calculates
   anything: no standings, no bracket, no totals. Just data.
   ========================================================= */

/* ---------- TOURNAMENT INFO ---------- */
const TOURNAMENT = {
  name: "Continental eCup",
  shortName: "CONTINENTAL eCUP",
  season: "26",
  logo: "⚽",
  format: "Online 1v1 eFootball tournament — League Phase followed by Knockout Stage",
  qualifyCount: 8, // how many players advance from the group stage to the knockout bracket
};

/* ---------- PARTICIPANTS ----------
   13 individual players competing under their country's flag.
   code    : short unique ID, used everywhere to reference this player
   name    : in-game gamertag/handle shown on the broadcast overlay
   country : nationality of the player behind the controller
   flag    : emoji flag for country
   color   : accent dot color shown next to the player's name

   goals / assists / yellow / red are OPTIONAL season stats used
   on the Stats page. Leave them at 0 if you're not tracking them. */
const PARTICIPANTS = [
{ code: "ARG", name: "Paul Kuriakose", country: "Argentina", flag: "🇦🇷", color: "#6EC6FF", goals: 0, assists: 0, yellow: 0, red: 0 },

{ code: "ESP", name: "Adithyan", country: "Spain", flag: "🇪🇸", color: "#E53935", goals: 0, assists: 0, yellow: 0, red: 0 },
  { code: "GER", name: "Hari Govind", country: "Germany", flag: "", color: "#212121", goals: 0, assists: 0, yellow: 0, red: 0 },
  { code: "FRA", name: "Jo Mec", country: "France", flag: "", color: "#1565C0", goals: 0, assists: 0, yellow: 0, red: 0 },
  { code: "ENG", name: "Eshaan", country: "England", flag: "", color: "#B71C1C", goals: 0, assists: 0, yellow: 0, red: 0 },
  { code: "BRA", name: "Pranav", country: "Brazil", flag: "", color: "#2E7D32", goals: 0, assists: 0, yellow: 0, red: 0 },
  { code: "POR", name: "Jones", country: "Portugal", flag: "", color: "#C62828", goals: 0, assists: 0, yellow: 0, red: 0 },
  { code: "NED", name: "Gopi", country: "Netherlands", flag: "", color: "#EF6C00", goals: 0, assists: 0, yellow: 0, red: 0 },
  { code: "CRO", name: "Adwin", country: "Croatia", flag: "", color: "#D32F2F", goals: 0, assists: 0, yellow: 0, red: 0 },
  { code: "BEL", name: "Akshay", country: "Belgium", flag: "", color: "#F9A825", goals: 0, assists: 0, yellow: 0, red: 0 },
  { code: "ITA", name: "Amithesh", country: "Italy", flag: "", color: "#1976D2", goals: 0, assists: 0, yellow: 0, red: 0 },
  { code: "MAR", name: "Ivan", country: "Morocco", flag: "", color: "#8E0000", goals: 0, assists: 0, yellow: 0, red: 0 },
  { code: "NOR", name: "Pradham", country: "Norway", flag: "", color: "#3949AB", goals: 0, assists: 0, yellow: 0, red: 0 },
];

/* ---------- FIXTURES ----------
   Written by hand, in the exact order you want them to appear.
   Every matchday is its own object with its own date/time and its
   own list of matches — matchdays don't need to have the same
   number of matches (byes are fine, like the 13-player groups
   below, which have one bye per matchday).

   "home" / "away" must match a PARTICIPANTS "code" above.        */
const FIXTURES = [
{
matchday:1,
date:"Matchday 1",
matches:[
{home:"ESP",away:"MAR",time:"TBD"},
{home:"ARG",away:"NOR",time:"TBD"},
{home:"GER",away:"CRO",time:"TBD"},
{home:"FRA",away:"BEL",time:"TBD"},
{home:"ENG",away:"POR",time:"TBD"},
{home:"BRA",away:"ITA",time:"TBD"},
]
},

{
matchday:2,
date:"Matchday 2",
matches:[
{home:"ESP",away:"ENG",time:"TBD"},
{home:"FRA",away:"NED",time:"TBD"},
{home:"ARG",away:"CRO",time:"TBD"},
{home:"GER",away:"BEL",time:"TBD"},
{home:"ITA",away:"MAR",time:"TBD"},
{home:"BRA",away:"POR",time:"TBD"},
]
},

{
matchday:3,
date:"Matchday 3",
matches:[
{home:"ESP",away:"GER",time:"TBD"},
{home:"ARG",away:"FRA",time:"TBD"},
{home:"ENG",away:"BRA",time:"TBD"},
{home:"NED",away:"BEL",time:"TBD"},
{home:"CRO",away:"ITA",time:"TBD"},
{home:"POR",away:"NOR",time:"TBD"},
]
},

{
matchday:4,
date:"Matchday 4",
matches:[
{home:"ESP",away:"ARG",time:"TBD"},
{home:"FRA",away:"ENG",time:"TBD"},
{home:"GER",away:"NED",time:"TBD"},
{home:"BRA",away:"MAR",time:"TBD"},
{home:"CRO",away:"POR",time:"TBD"},
{home:"BEL",away:"NOR",time:"TBD"},
]
}
];

/* ---------- RESULTS ----------
   One entry per matchday, and inside it one [home goals, away
   goals] entry per match, in the SAME ORDER as that matchday's
   "matches" array above. Use null for a match that hasn't been
   played yet — script.js treats "score is null" as "upcoming".

   To record a result, just replace a null with a scoreline, e.g.
   null -> [2, 1]. Nothing else needs to change.                  */
const RESULTS = [
  // Matchday 1 (6 matches)
  [null, null, null, null, null, null],
  // Matchday 2 (6 matches)
  [null, null, null, null, null, null],
  // Matchday 3 (6 matches)
  [null, null, null, null, null, null],
  // Matchday 4 (6 matches)
  [null, null, null, null, null, null],
];

/* ISO datetime the hero countdown clock counts down to
   (should match the date/time of the next unplayed fixture) */
const NEXT_KICKOFF_ISO = "2026-07-25T17:00:00";

/* ---------- KNOCKOUT DATES ----------
   Shown on the bracket once the group stage produces a Top 8.
   No physical venues — every knockout match is streamed live.    */
const KNOCKOUT_DATES = {
  qf1: "15 Aug · Streamed live — Twitch/YouTube",
  qf2: "15 Aug · Streamed live — Twitch/YouTube",
  qf3: "16 Aug · Streamed live — Twitch/YouTube",
  qf4: "16 Aug · Streamed live — Twitch/YouTube",
  sf1: "27 Aug · Streamed live — Twitch/YouTube",
  sf2: "27 Aug · Streamed live — Twitch/YouTube",
  final: "31 Aug · Grand Final broadcast",
};

/* ---------- RULES ---------- */
const RULES = [
  { icon: "🏆", title: "The format", text: "13 players face off online across 4 group-stage matchdays. The top 8 in the standings advance to a straight knockout: quarterfinals, semifinals, then the grand final." },
  { icon: "🔢", title: "Points", text: "A win is worth 3 points, a draw is worth 1 point, and a loss is worth 0. Most points after the group stage wins top seed." },
  { icon: "⚖️", title: "Breaking ties", text: "If players finish level on points, we check goal difference first, then total goals scored, then the head-to-head result between those players." },
  { icon: "⏱️", title: "Match length", text: "Every match is played to the full 90 in-game minutes across two 45-minute halves. Knockout matches level after regulation get extra time, then a penalty shootout if still tied." },
  { icon: "🟨", title: "Cards", text: "A yellow card is a caution; two in the same match means an automatic red. A red card sends a player off and rules them out of the next match." },
  { icon: "🔄", title: "Substitutions", text: "Each player can make up to 5 substitutions, used across a maximum of 3 stoppages in play (plus half-time) — exactly as the game engine allows." },
  { icon: "🔌", title: "Disconnects", text: "If a match disconnects before the 60th minute, it's replayed from scratch. After that, the score at the moment of the drop stands as full-time." },
];