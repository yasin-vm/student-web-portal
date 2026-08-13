const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const dataDir = path.join(__dirname, 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const scoresFile = path.join(dataDir, 'scores.json');
const saveFile = path.join(dataDir, 'save.json');
const statsFile = path.join(dataDir, 'stats.json');

const defaultScores = [
  { player_name: "CYBER_ACE", score: 125000, wave: 28, ship_type: "Titan", kills: 482, created_at: "2026-08-13 22:00:00" },
  { player_name: "NEON_VIPER", score: 98400, wave: 24, ship_type: "Phantom", kills: 395, created_at: "2026-08-13 20:00:00" },
  { player_name: "VANGUARD_01", score: 76200, wave: 19, ship_type: "Vanguard", kills: 310, created_at: "2026-08-13 18:00:00" },
  { player_name: "GHOST_RUNNER", score: 54100, wave: 15, ship_type: "Phantom", kills: 220, created_at: "2026-08-13 12:00:00" },
  { player_name: "TITAN_CRUSHER", score: 41800, wave: 12, ship_type: "Titan", kills: 175, created_at: "2026-08-12 15:00:00" }
];

function readJson(file, fallback) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(fallback, null, 2));
    return fallback;
  }
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    return fallback;
  }
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Serve index.html or index.php as index
app.get('/', (req, res) => {
  let htmlPath = path.join(__dirname, 'index.php');
  if (fs.existsSync(htmlPath)) {
    // Read php content and strip top PHP code tags or render standard app shell
    let raw = fs.readFileSync(htmlPath, 'utf8');
    // Simple PHP render simulation for node dev server
    let rendered = raw
      .replace(/<\?php[\s\S]*?\?>/g, '') // remove raw php logic blocks when serving through node
      .replace(/<\?=\s*([^;?]+);?\s*\?>/g, '<span>CYBER_STRIKE_ONLINE</span>');
    res.setHeader('Content-Type', 'text/html');
    res.send(rendered);
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

// API Routes mimicking PHP behavior
app.get('/api/leaderboard.php', (req, res) => {
  let scores = readJson(scoresFile, defaultScores);
  scores.sort((a, b) => b.score - a.score);
  res.json({ status: "success", leaderboard: scores.slice(0, 50) });
});

app.post('/api/leaderboard.php', (req, res) => {
  const { player_name, score, wave, ship_type, kills } = req.body || {};
  const name = (player_name || 'PILOT_' + Math.floor(Math.random() * 900 + 100)).substring(0, 16).toUpperCase();
  const entry = {
    player_name: name,
    score: parseInt(score || 0),
    wave: parseInt(wave || 1),
    ship_type: ship_type || 'Vanguard',
    kills: parseInt(kills || 0),
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };

  let scores = readJson(scoresFile, defaultScores);
  scores.push(entry);
  scores.sort((a, b) => b.score - a.score);
  writeJson(scoresFile, scores.slice(0, 100));

  let stats = readJson(statsFile, { total_games: 120, total_kills: 3600, highest_score: 125000 });
  stats.total_games += 1;
  stats.total_kills += entry.kills;
  if (entry.score > stats.highest_score) stats.highest_score = entry.score;
  writeJson(statsFile, stats);

  const rank = scores.findIndex(s => s.score === entry.score && s.player_name === name) + 1;

  res.json({
    status: "success",
    message: "Score submitted successfully!",
    rank: rank || 1,
    entry
  });
});

app.get('/api/save.php', (req, res) => {
  const playerId = req.query.player_id || 'default_pilot';
  const saves = readJson(saveFile, {});
  const userSave = saves[playerId] || {
    player_id: playerId,
    credits: 250,
    unlocked_ships: ["Vanguard"],
    upgrades: { max_health: 0, fire_rate: 0, move_speed: 0, magnet_radius: 0 }
  };
  res.json({ status: "success", save: userSave });
});

app.post('/api/save.php', (req, res) => {
  const { player_id, credits, unlocked_ships, upgrades } = req.body || {};
  const playerId = player_id || 'default_pilot';
  const saves = readJson(saveFile, {});

  const saveData = {
    player_id: playerId,
    credits: Math.max(0, parseInt(credits || 0)),
    unlocked_ships: Array.from(new Set(unlocked_ships || ["Vanguard"])),
    upgrades: upgrades || { max_health: 0, fire_rate: 0, move_speed: 0, magnet_radius: 0 },
    updated_at: new Date().toISOString()
  };

  saves[playerId] = saveData;
  writeJson(saveFile, saves);

  res.json({ status: "success", message: "Game state saved successfully", save: saveData });
});

app.get('/api/stats.php', (req, res) => {
  const stats = readJson(statsFile, { total_games: 120, total_kills: 3600, highest_score: 125000 });
  res.json({
    status: "success",
    server_time: new Date().toISOString(),
    php_version: "Node-PHP-Emulation/8.3.0",
    stats
  });
});

app.use((req, res, next) => {
  if (req.path.endsWith('.php')) return next();
  express.static(__dirname)(req, res, next);
});

app.listen(PORT, () => {


  console.log(`==================================================`);
  console.log(`  Cyber Strike: Neon Vanguard Server Active!`);
  console.log(`  Local URL: http://localhost:${PORT}`);
  console.log(`==================================================`);
});
