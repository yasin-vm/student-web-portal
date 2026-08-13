<?php
// Cyber Strike: Neon Vanguard - Main PHP Application Entry Point
$serverStatus = "ONLINE";
$phpVer = PHP_VERSION;
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cyber Strike: Neon Vanguard | Cyberpunk Arcade Rogue-Lite</title>
  <meta name="description" content="An intense 2D Cyberpunk Arcade Rogue-Lite shooter with HTML5 Canvas, Web Audio API synthesis, and PHP high-score backend.">
  <link rel="stylesheet" href="styles.css">
</head>
<body>

  <!-- Game Canvas Container -->
  <div id="game-container">
    <canvas id="game-canvas"></canvas>

    <!-- HUD Overlay Layer -->
    <div id="hud-layer" class="hud-container" style="display: none;">
      <!-- Top Bars & Info -->
      <div class="hud-top-bar">
        <div class="hud-left">
          <!-- HP Bar -->
          <div class="bar-wrapper">
            <div class="bar-header">
              <span style="color: var(--neon-emerald);">HEALTH</span>
              <span id="hp-value" style="color: var(--text-muted);">100/100</span>
            </div>
            <div class="bar-track">
              <div id="hp-bar-fill" class="hp-fill" style="width: 100%;"></div>
            </div>
          </div>
          <!-- Shield Bar -->
          <div class="bar-wrapper">
            <div class="bar-header">
              <span style="color: var(--neon-cyan);">SHIELD</span>
              <span id="shield-value" style="color: var(--text-muted);">60/60</span>
            </div>
            <div class="bar-track">
              <div id="shield-bar-fill" class="shield-fill" style="width: 100%;"></div>
            </div>
          </div>
          <!-- XP Bar -->
          <div class="bar-wrapper">
            <div class="bar-header">
              <span id="hud-level" style="color: var(--electric-magenta);">LVL 1</span>
              <span style="color: var(--text-muted);">EXP</span>
            </div>
            <div class="bar-track">
              <div id="xp-bar-fill" class="xp-fill" style="width: 0%;"></div>
            </div>
          </div>
        </div>

        <!-- Center Score & Wave -->
        <div class="hud-center">
          <div id="hud-score" class="score-display">0</div>
          <div id="hud-wave" class="wave-display">WAVE 1</div>
        </div>

        <!-- Right Indicators -->
        <div class="hud-right">
          <div class="combo-badge">CYBER MODE</div>
          <div class="weapon-indicator">LASER CANNON</div>
        </div>
      </div>

      <!-- Boss Health Bar -->
      <div id="boss-hud-container" class="boss-bar-container">
        <div class="boss-name">⚡ HYPERION CORE MECH ⚡</div>
        <div class="boss-hp-track">
          <div id="boss-hp-fill" class="boss-hp-fill" style="width: 100%;"></div>
        </div>
      </div>
    </div>

    <!-- UI Screen: Start Screen -->
    <div id="start-screen" class="screen active ui-interactive">
      <div class="glass-panel start-screen-card">
        <h1 class="neon-title">CYBER STRIKE</h1>
        <div class="neon-subtitle">NEON VANGUARD</div>

        <div class="pilot-name-input-group">
          <input type="text" id="pilot-name-input" class="neon-input" placeholder="ENTER PILOT CALLSIGN" maxlength="14" value="VANGUARD_01">
        </div>

        <div class="menu-actions-row">
          <button id="btn-start-game" class="btn">DEPLOY MISSION</button>
          <button id="btn-open-armory" class="btn btn-secondary">ARMORY & SHIPS</button>
          <button id="btn-open-leaderboard" class="btn btn-gold">LEADERBOARD</button>
          <button id="btn-open-settings" class="btn" style="border-color: var(--neon-purple);">SETTINGS</button>
        </div>

        <div class="server-badge">
          <span class="dot-online"></span>
          <span>PHP BACKEND: <?= $serverStatus ?> (PHP <?= $phpVer ?>)</span>
        </div>
      </div>
    </div>

    <!-- UI Screen: Ship Selection / Armory -->
    <div id="ship-screen" class="screen ui-interactive">
      <div class="glass-panel" style="padding: 2.5rem; width: min(90%, 900px); display: flex; flex-direction: column; align-items: center;">
        <h2 class="neon-title" style="font-size: 2rem;">ARMORY BAY</h2>
        <p style="color: var(--text-muted); margin-bottom: 2rem;">SELECT YOUR COMBAT VESSEL</p>

        <div class="ship-grid">
          <!-- Vanguard Ship Card -->
          <div class="glass-panel ship-card selected" data-ship="Vanguard">
            <div class="ship-preview-box">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <polygon points="30,5 10,50 30,40 50,50" fill="#0e111e" stroke="#00f3ff" stroke-width="3"/>
                <circle cx="30" cy="25" r="4" fill="#ffffff"/>
              </svg>
            </div>
            <div class="ship-name" style="color: var(--neon-cyan);">VANGUARD</div>
            <div class="ship-desc">Balanced interceptor ship equipped with dual deflector shields and fast plasma blasters.</div>
            <div class="ship-stat-bar">
              <div class="stat-label"><span>SPEED</span><span>80%</span></div>
              <div class="progress-track"><div class="progress-fill" style="width: 80%;"></div></div>
            </div>
            <div class="ship-stat-bar">
              <div class="stat-label"><span>ARMOR</span><span>70%</span></div>
              <div class="progress-track"><div class="progress-fill" style="width: 70%;"></div></div>
            </div>
          </div>

          <!-- Phantom Ship Card -->
          <div class="glass-panel ship-card" data-ship="Phantom">
            <div class="ship-preview-box">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <polygon points="30,5 5,52 30,35 55,52" fill="#0e111e" stroke="#ff007f" stroke-width="3"/>
                <circle cx="30" cy="22" r="4" fill="#ff007f"/>
              </svg>
            </div>
            <div class="ship-name" style="color: var(--electric-magenta);">PHANTOM</div>
            <div class="ship-desc">High-speed stealth fighter. Rapid fire rate and increased critical hit power.</div>
            <div class="ship-stat-bar">
              <div class="stat-label"><span>SPEED</span><span>100%</span></div>
              <div class="progress-track"><div class="progress-fill" style="width: 100%;"></div></div>
            </div>
            <div class="ship-stat-bar">
              <div class="stat-label"><span>ARMOR</span><span>50%</span></div>
              <div class="progress-track"><div class="progress-fill" style="width: 50%;"></div></div>
            </div>
          </div>

          <!-- Titan Ship Card -->
          <div class="glass-panel ship-card" data-ship="Titan">
            <div class="ship-preview-box">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <polygon points="30,5 12,45 30,38 48,45" fill="#0e111e" stroke="#ffd700" stroke-width="4"/>
                <rect x="24" y="20" width="12" height="12" fill="#ffd700"/>
              </svg>
            </div>
            <div class="ship-name" style="color: var(--neon-gold);">TITAN</div>
            <div class="ship-desc">Heavy armored battlecruiser. Massive hit points and devastating heavy blast cannons.</div>
            <div class="ship-stat-bar">
              <div class="stat-label"><span>SPEED</span><span>55%</span></div>
              <div class="progress-track"><div class="progress-fill" style="width: 55%;"></div></div>
            </div>
            <div class="ship-stat-bar">
              <div class="stat-label"><span>ARMOR</span><span>100%</span></div>
              <div class="progress-track"><div class="progress-fill" style="width: 100%;"></div></div>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 1rem;">
          <button id="btn-launch-mission" class="btn">LAUNCH MISSION</button>
          <button id="btn-back-to-main" class="btn btn-secondary">MAIN MENU</button>
        </div>
      </div>
    </div>

    <!-- UI Screen: Game Over -->
    <div id="game-over-screen" class="screen ui-interactive">
      <div class="glass-panel" style="padding: 3rem; text-align: center; width: min(90%, 550px);">
        <h2 class="neon-title" style="color: var(--neon-crimson); font-size: 2.8rem;">MISSION FAILED</h2>
        <div class="neon-subtitle" style="color: var(--text-muted); margin-bottom: 1.5rem;">VESSEL DESTROYED</div>

        <div style="background: rgba(0,0,0,0.4); padding: 1.2rem; border-radius: var(--radius-sm); margin-bottom: 2rem;">
          <div style="font-family: var(--font-heading); font-size: 0.9rem; color: var(--text-muted);">FINAL SCORE</div>
          <div id="final-score" style="font-family: var(--font-heading); font-size: 2.8rem; font-weight: 900; color: var(--neon-cyan);">0</div>
          <div style="display: flex; justify-content: space-around; margin-top: 1rem;">
            <div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">WAVES</div>
              <div id="final-wave" style="font-family: var(--font-heading); font-weight: 800; font-size: 1.2rem; color: var(--neon-gold);">1</div>
            </div>
            <div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">HOSTILES KILLED</div>
              <div id="final-kills" style="font-family: var(--font-heading); font-weight: 800; font-size: 1.2rem; color: var(--electric-magenta);">0</div>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: center; gap: 1rem;">
          <button id="btn-play-again" class="btn">PLAY AGAIN</button>
          <button id="btn-menu-from-gameover" class="btn btn-secondary">MAIN MENU</button>
        </div>
      </div>
    </div>

    <!-- Modal: Level Up Perk Picker -->
    <div id="level-up-modal" class="modal-overlay ui-interactive">
      <div class="glass-panel modal-card" style="text-align: center;">
        <div class="modal-title" style="color: var(--neon-gold);">⚡ SYSTEM OVERCLOCK ⚡</div>
        <p style="color: var(--text-muted);">SELECT A MODULE UPGRADE TO ENGAGE</p>
        <div id="perk-options-container" class="perk-grid"></div>
      </div>
    </div>

    <!-- Modal: Global Leaderboard -->
    <div id="leaderboard-modal" class="modal-overlay ui-interactive">
      <div class="glass-panel modal-card">
        <div class="modal-header">
          <div class="modal-title">🏆 GLOBAL LEADERBOARD</div>
          <button class="btn-close">&times;</button>
        </div>
        <div class="table-container">
          <table class="leaderboard-table">
            <thead>
              <tr>
                <th>RANK</th>
                <th>PILOT CALLSIGN</th>
                <th>SCORE</th>
                <th>WAVE</th>
                <th>SHIP CLASS</th>
              </tr>
            </thead>
            <tbody id="leaderboard-body">
              <!-- Dynamically populated via PHP API -->
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal: Settings -->
    <div id="settings-modal" class="modal-overlay ui-interactive">
      <div class="glass-panel modal-card" style="max-width: 500px;">
        <div class="modal-header">
          <div class="modal-title">⚙️ SYSTEM CONFIG</div>
          <button class="btn-close">&times;</button>
        </div>
        <div style="display: flex; flex-direction: column; gap: 1.5rem; margin-top: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>AUDIO SFX & MUSIC</span>
            <button class="btn" style="padding: 0.4rem 1rem; font-size: 0.8rem;" onclick="audioFX.toggleMute(); this.textContent = audioFX.muted ? 'UNMUTE' : 'MUTE';">MUTE</button>
          </div>
          <div style="background: rgba(0,0,0,0.4); padding: 1rem; border-radius: var(--radius-sm); font-size: 0.85rem; color: var(--text-muted);">
            <strong style="color: var(--neon-cyan);">CONTROLS GUIDE:</strong><br>
            • <strong>W A S D / Arrow Keys</strong>: Move Vessel<br>
            • <strong>Mouse Pointer</strong>: Aim Weapons<br>
            • <strong>Left Mouse Button</strong>: Fire Plasma Cannons
          </div>
        </div>
      </div>
    </div>

  </div>

  <!-- JavaScript Modules -->
  <script src="js/api.js"></script>
  <script src="js/audio.js"></script>
  <script src="js/entities.js"></script>
  <script src="js/ui.js"></script>
  <script src="js/game.js"></script>
</body>
</html>
