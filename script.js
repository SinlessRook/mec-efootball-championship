/* =========================================================
   CONTINENTAL eCUP 26 — interactivity
   All tournament data (TOURNAMENT, PARTICIPANTS, FIXTURES,
   RESULTS, dates, rules, knockout info) lives in data.js.
   This file only reads it and calculates things — edit data.js
   to run a new tournament or record a result, never this file.

   Nothing here assumes a fixed number of participants, a fixed
   number of matchdays, or a fixed number of matches per matchday.
   Everything is derived from FIXTURES / RESULTS / PARTICIPANTS
   at run time.
   ========================================================= */

/* ---------- flatten FIXTURES + RESULTS into one match list ----------
   No generation, no assumptions about who plays who — we simply
   read what's already written in data.js and attach each match's
   score (or null) from the matching RESULTS entry.               */
const MATCHES = [];
FIXTURES.forEach((md, mdIdx) => {
  md.matches.forEach((m, mIdx) => {
    const score = (RESULTS[mdIdx] && RESULTS[mdIdx][mIdx] !== undefined) ? RESULTS[mdIdx][mIdx] : null;
    MATCHES.push({
      matchday: md.matchday,
      date: md.date,
      home: m.home,
      away: m.away,
      time: m.time,
      score,
      played: Array.isArray(score),
    });
  });
});

const TOTAL_MATCHDAYS = FIXTURES.length;

/* the very next fixture whose score is still empty — drives the
   hero countdown and the "NEXT" tag on the schedule page          */
const NEXT_FIXTURE = MATCHES.find((f) => !f.played);

/* how many matchdays are fully completed (every match has a score) */
const COMPLETED_MATCHDAYS = FIXTURES.filter((md, i) =>
  md.matches.every((_, mIdx) => Array.isArray(RESULTS[i] && RESULTS[i][mIdx]))
).length;
const CURRENT_MATCHDAY = COMPLETED_MATCHDAYS < TOTAL_MATCHDAYS ? COMPLETED_MATCHDAYS + 1 : TOTAL_MATCHDAYS;

/* ---------- STANDINGS (derived from MATCHES) ----------
   Loop through every completed match and update the table.
   Doesn't care how many players there are or how the fixtures
   were arranged — just: if a match has a score, count it.        */
function computeStandings() {
  const table = {};
  PARTICIPANTS.forEach((p) => {
    table[p.code] = { code: p.code, name: p.name, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, form: [] };
  });
  MATCHES.filter((f) => f.played)
    .sort((a, b) => a.matchday - b.matchday)
    .forEach((f) => {
      const [hg, ag] = f.score;
      const H = table[f.home], A = table[f.away];
      if (!H || !A) return; // ignore matches referencing an unknown code
      H.p++; A.p++; H.gf += hg; H.ga += ag; A.gf += ag; A.ga += hg;
      if (hg > ag) { H.w++; A.l++; H.form.push("W"); A.form.push("L"); }
      else if (hg < ag) { A.w++; H.l++; H.form.push("L"); A.form.push("W"); }
      else { H.d++; A.d++; H.form.push("D"); A.form.push("D"); }
    });
  const rows = Object.values(table).map((t) => ({
    ...t, gd: t.gf - t.ga, pts: t.w * 3 + t.d,
    form: t.form.slice(-5),
  }));
  rows.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
  rows.forEach((r, i) => (r.pos = i + 1));
  return rows;
}
const STANDINGS = computeStandings();

/* the bracket should only reveal real names once the group stage is
   actually finished — otherwise, with no matches played yet, every
   player is tied on 0 points and the "standings" sort has nothing to
   go on, so it would show whoever happens to be listed first in
   PARTICIPANTS as if they'd already qualified. Guard against that. */
const GROUP_STAGE_COMPLETE = COMPLETED_MATCHDAYS === TOTAL_MATCHDAYS;

/* ---------- QUALIFICATION / BRACKET ----------
   Top TOURNAMENT.qualifyCount advance. The seeding order below
   (1v8, 4v5, 2v7, 3v6 for 8 qualifiers) is generated with the
   standard single-elimination seeding algorithm, so it works for
   any power-of-two qualifyCount, not just 8.                      */
const QUALIFY_COUNT = TOURNAMENT.qualifyCount;
const QUALIFIERS = GROUP_STAGE_COMPLETE
  ? STANDINGS.slice(0, QUALIFY_COUNT).map((r) => playerByCode(r.code)).filter(Boolean)
  : [];

function seedOrder(n) {
  let seeds = [1, 2];
  while (seeds.length < n) {
    const size = seeds.length * 2;
    const next = [];
    seeds.forEach((s) => { next.push(s); next.push(size + 1 - s); });
    seeds = next;
  }
  return seeds;
}

/* build the opening round's matchups from the seed order, e.g.
   for 8 qualifiers: [seed1 v seed8, seed4 v seed5, seed2 v seed7, seed3 v seed6].
   Before the group stage is complete, this returns TBD/TBD pairs so the
   bracket shape still draws correctly without pretending anyone has qualified. */
function firstRoundPairs() {
  const order = seedOrder(QUALIFY_COUNT);
  const pairs = [];
  for (let i = 0; i < order.length; i += 2) {
    if (!GROUP_STAGE_COMPLETE) { pairs.push([null, null]); continue; }
    pairs.push([QUALIFIERS[order[i] - 1] || null, QUALIFIERS[order[i + 1] - 1] || null]);
  }
  return pairs;
}

function roundName(roundsFromEnd) {
  if (roundsFromEnd === 0) return "Final";
  if (roundsFromEnd === 1) return "Semifinal";
  if (roundsFromEnd === 2) return "Quarterfinal";
  return `Round of ${Math.pow(2, roundsFromEnd + 1)}`;
}

/* =========================================================
   RENDERING
   ========================================================= */

const flagChip = (p) => `<span class="team-chip"><i class="team-dot" style="--c:${p.color}"></i><img class="flag-img" src="https://flagcdn.com/w20/${p.flag}.png" alt="${p.country}" width="20" height="14"> ${p.name}</span>`;

function playerByCode(code) { return PARTICIPANTS.find((p) => p.code === code); }

/* ---- header / hero bits driven entirely by data.js ---- */
function renderTournamentMeta() {
  const curMd = document.getElementById("curMatchday");
  const totalMd = document.getElementById("totalMatchdays");
  const statsMd = document.getElementById("statsMdRange");
  if (curMd) curMd.textContent = CURRENT_MATCHDAY;
  if (totalMd) totalMd.textContent = TOTAL_MATCHDAYS;
  if (statsMd) statsMd.textContent = CURRENT_MATCHDAY;

  const nations = [...new Set(PARTICIPANTS.map((p) => p.flag))];
  const flagsEl = document.getElementById("statPillFlags");
  const nationsEl = document.getElementById("statPillNations");
  const clubsEl = document.getElementById("statPillClubs");
  if (flagsEl) flagsEl.textContent = nations.slice(0, 3).join("");
  if (nationsEl) nationsEl.textContent = `${nations.length} Nations`;
  if (clubsEl) clubsEl.textContent = `${PARTICIPANTS.length} players, one cup`;

  const brandTitle = document.querySelector(".brand__title");
  const brandYear = document.querySelector(".brand__year");
  if (brandTitle) brandTitle.textContent = TOURNAMENT.shortName;
  if (brandYear) brandYear.textContent = TOURNAMENT.season;
  document.title = `${TOURNAMENT.shortName} ${TOURNAMENT.season} — Online Tournament Hub`;
}

/* ---- ticker ---- */
function renderTicker() {
  const played = MATCHES.filter((f) => f.played).slice(-8);
  const upcoming = MATCHES.filter((f) => !f.played).slice(0, 6);
  const items = [
    ...played.map((f) => `<span class="ti"><b>FT</b> ${f.home} ${f.score[0]}–${f.score[1]} ${f.away}</span>`),
    ...upcoming.map((f) => `<span class="ti"><b>MD${f.matchday}</b> ${f.home} v ${f.away} · ${f.date}</span>`),
  ];
  const html = items.join('<span class="ti-sep">●</span>');
  document.getElementById("tickerTrack").innerHTML = html + '<span class="ti-sep">●</span>' + html;
}

/* ---- schedule: league ---- */
function renderMatchdayList(filterCode = "all") {
  const wrap = document.getElementById("matchdayList");
  wrap.innerHTML = "";
  const byRound = {};
  MATCHES.forEach((f) => {
    if (filterCode !== "all" && f.home !== filterCode && f.away !== filterCode) return;
    (byRound[f.matchday] ||= []).push(f);
  });
  Object.keys(byRound).sort((a, b) => a - b).forEach((md) => {
    const group = document.createElement("div");
    group.className = "md-group";
    const mdInfo = FIXTURES.find((f) => f.matchday == md);
    group.innerHTML = `<div class="md-head">Matchday ${md} <span>${mdInfo ? mdInfo.date : ""}</span></div>`;
    const list = document.createElement("div");
    list.className = "md-matches";
    byRound[md].forEach((f, idx) => {
      const home = playerByCode(f.home), away = playerByCode(f.away);
      if (!home || !away) return;
      const statusHtml = f.played
        ? `<div class="score"><span>${f.score[0]}</span><i>–</i><span>${f.score[1]}</span></div><span class="tag tag--ft">FT</span>`
        : `<div class="score score--tbd">${f.time}</div><span class="tag tag--next">${f === NEXT_FIXTURE ? "NEXT" : "UPCOMING"}</span>`;
      list.innerHTML += `
        <div class="match-card ${f === NEXT_FIXTURE ? "is-next" : ""}" style="--i:${idx}">
          <div class="match-team">${flagChip(home)}</div>
          ${statusHtml}
          <div class="match-team match-team--right">${flagChip(away)}</div>
          <div class="match-venue">🎮 Streamed live · ${f.date}</div>
        </div>`;
    });
    group.appendChild(list);
    wrap.appendChild(group);
  });
}

function populatePlayerFilter() {
  const sel = document.getElementById("teamFilter");
  PARTICIPANTS.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p.code; opt.textContent = `${p.flag} ${p.name}`;
    sel.appendChild(opt);
  });
  sel.addEventListener("change", (e) => renderMatchdayList(e.target.value));
}

/* ---- schedule: knockout bracket ----
   Fully dynamic: draws however many rounds it takes to go from
   QUALIFY_COUNT players down to 1 champion (Quarterfinal ->
   Semifinal -> Final for 8 qualifiers, more rounds for 16, etc). */
function renderBracket() {
  const wrap = document.getElementById("bracketRounds");
  if (!wrap) return;

  const totalRounds = Math.log2(QUALIFY_COUNT);
  const slot = (label, player, sub) => `
    <div class="bslot">
      <div class="bslot__label">${label}</div>
      <div class="bslot__team">${player ? flagChip(player) : '<span class="tbd">To be decided</span>'}</div>
      ${sub ? `<div class="bslot__sub">${sub}</div>` : ""}
    </div>`;

  let html = "";

  /* round 0: the seeded pairs straight from the group-stage standings */
  const pairs = firstRoundPairs();
  const kdKeys = Object.keys(KNOCKOUT_DATES).filter((k) => k.startsWith("qf"));
  html += `<div class="bracket-round" data-round="r0">`;
  pairs.forEach((pair, i) => {
    const label = totalRounds === 1 ? "FINAL" : `${roundName(totalRounds - 1).toUpperCase()} ${i + 1}`;
    html += `<div class="bmatch-pair">
      ${slot(label, pair[0], kdKeys[i] ? KNOCKOUT_DATES[kdKeys[i]] : "")}
      ${slot("", pair[1], "")}
    </div>`;
  });
  html += `</div>`;

  /* every later round is unknown until the previous round is played,
     so we just draw empty TBD slots — the shape is still correct   */
  let matchesInRound = pairs.length / 2;
  for (let r = 1; r < totalRounds; r++) {
    const roundsFromEnd = totalRounds - 1 - r;
    const name = roundName(roundsFromEnd).toUpperCase();
    html += `<div class="bracket-round" data-round="r${r}">`;
    for (let i = 0; i < matchesInRound; i++) {
      if (roundsFromEnd === 0) {
        html += `<div class="bmatch-pair bmatch-pair--single">${slot("FINAL", null, KNOCKOUT_DATES.final)}</div>`;
      } else {
        const label = `${name} ${i + 1}`;
        const dateKey = roundsFromEnd === 1 ? `sf${i + 1}` : `${name.toLowerCase()}${i + 1}`;
        html += `<div class="bmatch-pair">
          ${slot(label, null, KNOCKOUT_DATES[dateKey] || "")}
          ${slot("", null, "")}
        </div>`;
      }
    }
    html += `</div>`;
    matchesInRound = matchesInRound / 2;
  }

  wrap.innerHTML = html;
}

/* ---- rules ---- */
function renderRules() {
  const grid = document.getElementById("rulesGrid");
  grid.innerHTML = RULES.map((r, i) => `
    <div class="rule-card" style="--i:${i}">
      <div class="rule-icon">${r.icon}</div>
      <h3>${r.title}</h3>
      <p>${r.text}</p>
    </div>`).join("");
}

/* ---- leaderboard ---- */
let sortKey = "pts", sortDir = -1;
function renderBoard() {
  const rows = [...STANDINGS].sort((a, b) => (a[sortKey] > b[sortKey] ? 1 : -1) * sortDir);
  const body = document.getElementById("boardBody");
  body.innerHTML = rows.map((r) => {
    const qualified = r.pos <= QUALIFY_COUNT;
    const formHtml = r.form.map((res) => `<span class="pill pill--${res.toLowerCase()}">${res}</span>`).join("");
    return `
      <tr class="${qualified ? "qualified" : ""}">
        <td>${r.pos}</td>
        <td class="al team-cell">${flagChip(playerByCode(r.code))}</td>
        <td>${r.p}</td><td>${r.w}</td><td>${r.d}</td><td>${r.l}</td>
        <td>${r.gf}</td><td>${r.ga}</td><td>${r.gd > 0 ? "+" : ""}${r.gd}</td>
        <td class="pts">${r.pts}</td>
        <td class="al">${formHtml}</td>
      </tr>`;
  }).join("");
}

function initSortableTable() {
  document.querySelectorAll("#boardTable th[data-key]").forEach((th) => {
    th.addEventListener("click", () => {
      const key = th.dataset.key;
      sortDir = key === sortKey ? -sortDir : -1;
      sortKey = key;
      document.querySelectorAll("#boardTable th").forEach((h) => h.classList.remove("sorted"));
      th.classList.add("sorted");
      renderBoard();
    });
  });
}

/* ---- stats ---- */
function renderStats() {
  const scorers = [...PARTICIPANTS].sort((a, b) => b.goals - a.goals).slice(0, 6);
  const passes = [...PARTICIPANTS].sort((a, b) => b.passes - a.passes).slice(0, 6);
  const discipline = [...PARTICIPANTS]
    .map((p) => ({ ...p, points: p.yellow + p.red * 2 }))
    .sort((a, b) => b.points - a.points).slice(0, 6);

  const maxGoals = Math.max(1, scorers[0]?.goals || 0);
  const maxPasses = Math.max(1, passes[0]?.passes || 0);
  const maxDisc = Math.max(1, discipline[0]?.points || 0);

  const row = (p, val, displayVal, max) => `
    <li>
      <div class="stat-row__name">${flagChip(p)}</div>
      <div class="stat-row__bar"><i style="--w:${Math.max(8, (val / max) * 100)}%"></i></div>
      <div class="stat-row__val">${displayVal}</div>
    </li>`;

  document.getElementById("topScorers").innerHTML = scorers.map((p) => row(p, p.goals, p.goals, maxGoals)).join("");
  document.getElementById("mostPasses").innerHTML = passes.map((p) => row(p, p.passes, p.passes, maxPasses)).join("");
  document.getElementById("discipline").innerHTML = discipline.map((p) =>
    row(p, p.points, `${p.yellow}🟨${p.red ? " " + p.red + "🟥" : ""}`, maxDisc)
  ).join("");

  const totalGoals = MATCHES.filter((f) => f.played).reduce((s, f) => s + f.score[0] + f.score[1], 0);
  const played = MATCHES.filter((f) => f.played).length;
  const cleanSheets = MATCHES.filter((f) => f.played && (f.score[0] === 0 || f.score[1] === 0)).length;
  const avg = played ? (totalGoals / played).toFixed(2) : "0.0";

  const summary = document.getElementById("statSummary");
  summary.innerHTML = `
    <div class="stat-tile"><span class="count-up" data-target="${played}">0</span><label>Matches played</label></div>
    <div class="stat-tile"><span class="count-up" data-target="${totalGoals}">0</span><label>Goals scored</label></div>
    <div class="stat-tile"><span class="count-up" data-target="${avg}" data-decimal="1">0</span><label>Goals / match</label></div>
    <div class="stat-tile"><span class="count-up" data-target="${cleanSheets}">0</span><label>Clean sheets</label></div>`;
}

/* =========================================================
   INTERACTIVITY
   ========================================================= */

/* tabs */
function initTabs() {
  document.querySelectorAll(".tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(`view-${btn.dataset.tab}`).classList.add("active");
      if (btn.dataset.tab === "stats") triggerCountUps();
    });
  });
  document.querySelectorAll("[data-goto]").forEach((el) => {
    el.addEventListener("click", () => {
      document.querySelector(`.tab[data-tab="${el.dataset.goto}"]`).click();
      document.getElementById("tabnav").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

/* league / knockout format toggle */
function initFormatToggle() {
  document.querySelectorAll(".format-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".format-btn").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".format-panel").forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(`format-${btn.dataset.format}`).classList.add("active");
    });
  });
}

/* countdown clock */
function initCountdown() {
  const target = new Date(NEXT_KICKOFF_ISO).getTime();
  const label = document.getElementById("countdownMatch");

  if (NEXT_FIXTURE && label) {
    const home = playerByCode(NEXT_FIXTURE.home);
    const away = playerByCode(NEXT_FIXTURE.away);

    label.innerHTML = (home && away)
      ? `${flagChip(home)} <span class="vs">vs</span> ${flagChip(away)}`
      : `${NEXT_FIXTURE.home} vs ${NEXT_FIXTURE.away}`;
  } else if (label) {
    label.textContent = "Group stage complete";
  }
  function tick() {
    const diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    document.getElementById("cd-d").textContent = String(d).padStart(2, "0");
    document.getElementById("cd-h").textContent = String(h).padStart(2, "0");
    document.getElementById("cd-m").textContent = String(m).padStart(2, "0");
    document.getElementById("cd-s").textContent = String(s).padStart(2, "0");
  }
  tick();
  setInterval(tick, 1000);
}

/* count-up numbers (stats) */
let countUpDone = false;
function triggerCountUps() {
  if (countUpDone) return;
  countUpDone = true;
  document.querySelectorAll(".count-up").forEach((el) => {
    const target = parseFloat(el.dataset.target);
    const decimal = el.dataset.decimal;
    let cur = 0;
    const steps = 40;
    const inc = target / steps || 0;
    const iv = setInterval(() => {
      cur += inc;
      if (cur >= target) { cur = target; clearInterval(iv); }
      el.textContent = decimal ? cur.toFixed(1) : Math.round(cur);
    }, 20);
  });
}

/* hero kickoff scene: ball gets struck into the net, net ripples, confetti pops */
function spawnConfetti() {
  const field = document.getElementById("confettiField");
  if (!field) return;
  const colors = ["#E7B740", "#F3F6EE", "#E1503D", "#7ED0A0", "#4FA6E0"];
  for (let i = 0; i < 18; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    const angle = Math.random() * Math.PI - Math.PI / 2;
    const dist = 30 + Math.random() * 40;
    piece.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
    piece.style.setProperty("--dy", `${-Math.abs(Math.sin(angle) * dist) - 10}px`);
    piece.style.setProperty("--rot", `${Math.random() * 360}deg`);
    piece.style.background = colors[i % colors.length];
    piece.style.animationDelay = `${Math.random() * 0.1}s`;
    field.appendChild(piece);
    setTimeout(() => piece.remove(), 1100);
  }
}

function initKickoffScene() {
  const ball = document.getElementById("ball");
  const shadow = document.getElementById("ballShadow");
  const net = document.getElementById("goalNet");
  if (!ball) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) { ball.classList.add("at-rest"); return; }

  setTimeout(() => {
    ball.classList.add("is-kicking");
    shadow.classList.add("is-kicking");
  }, 700);

  ball.addEventListener("animationend", () => {
    net.classList.add("hit");
    spawnConfetti();
    ball.classList.remove("is-kicking");
    ball.classList.add("at-rest");
  }, { once: true });
}

/* =========================================================
   INIT
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  renderTournamentMeta();
  renderTicker();
  populatePlayerFilter();
  renderMatchdayList();
  renderBracket();
  renderRules();
  renderBoard();
  renderStats();

  initTabs();
  initFormatToggle();
  initCountdown();
  initSortableTable();
  initKickoffScene();
});