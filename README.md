# 🏆 Continental eCup '26

A modern **eFootball tournament management platform** built for the **Continental eCup '26**. The website provides fixtures, live standings, player statistics, knockout brackets, tournament rules, and more—all from a single configurable data file.

---

## ✨ Features

- 🏆 League stage & knockout bracket
- 📅 Match fixtures and schedule
- 📊 Live standings
- 🥅 Player statistics
- ⏳ Next match countdown
- 📜 Tournament rules
- 📱 Responsive design
- ⚡ Lightweight HTML, CSS & JavaScript
- 🛠️ Optional Node.js admin panel for updating tournament data

---

## 📂 Project Structure

```
.
├── index.html
├── style.css
├── script.js
├── data.js              # Edit tournament data here
├── script/
│   ├── server.js
│   ├── package.json
│   └── ...
└── README.md
```

---

## 🚀 Getting Started

Clone the repository:

```bash
git clone https://github.com/sinlessrook/mec-efootball-championship.git
cd continental-ecup
```

### Run locally

You can simply open `index.html` in your browser or use a local server.

Using Python:

```bash
python -m http.server
```

Using Node.js:

```bash
npx serve
```

---

## 📝 Tournament Configuration

Everything related to the tournament is stored in **`data.js`**.

You can easily edit:

- Tournament name
- Participants
- Fixtures
- Results
- Knockout dates
- Rules
- Theme colors
- Statistics

No changes to `script.js` or `style.css` are required for normal tournament operation.

---

## 🏆 Tournament Format

- **16 Participants**
- **4 League Matchdays**
- Every player plays **4 matches**
- **Win = 3 Points**
- **Draw = 1 Point**
- **Loss = 0 Points**
- **Top 8** qualify for the Knockout Stage

Knockout progression:

```
Quarterfinals
      ↓
 Semifinals
      ↓
 Grand Final
```

---

## 🎮 Match Rules

- Players should use their assigned national team with authentic squads.
- If **both players agree before kickoff**, they may instead use **Dream Teams**, provided every player in the squad is eligible for their assigned national team.
- Match length: **Full 90 minutes**
- **Random Condition:** ON
- **Uniform Rating:** OFF

---

## 📷 Match Verification

After every match, **the losing player** must post a screenshot of the **match card** in the tournament WhatsApp group.

This helps verify results and promotes fair play and sportsmanship.

---

## 🔌 Disconnect Policy

- Disconnect **before the 60th minute** → Replay the match.
- Disconnect **after the 60th minute** → Players should agree on the result based on the score at the time of the disconnect.
- If no agreement is reached, the tournament organizer's decision will be final.

---

## 🛠️ Built With

- HTML5
- CSS3
- Vanilla JavaScript
- Node.js

---

## ❤️ Collaboration

This project started as a fun community project for hosting eFootball tournaments, and I'd love to keep improving it.

If you have ideas for new features, better UI/UX, bug fixes, or anything else, feel free to open an issue or submit a pull request.

Whether you're a beginner looking to contribute or an experienced developer, you're welcome to collaborate!

Let's build a better tournament platform together.

---

## 📄 License

This project is open source and available under the **MIT License**.

Feel free to use, modify, and adapt it for your own tournaments while retaining the original license.
