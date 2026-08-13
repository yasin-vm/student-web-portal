/* ==========================================================================
   Cyber Strike: Neon Vanguard - Dynamic UI & HUD Controller
   ========================================================================== */

class UIController {
  constructor(game) {
    this.game = game;
    this.elements = {};
    this.initDOMElements();
    this.bindEvents();
  }

  initDOMElements() {
    this.elements = {
      // Screens
      startScreen: document.getElementById('start-screen'),
      shipScreen: document.getElementById('ship-screen'),
      hudLayer: document.getElementById('hud-layer'),
      gameOverScreen: document.getElementById('game-over-screen'),
      
      // Modals
      levelUpModal: document.getElementById('level-up-modal'),
      leaderboardModal: document.getElementById('leaderboard-modal'),
      settingsModal: document.getElementById('settings-modal'),

      // Inputs & Buttons
      pilotInput: document.getElementById('pilot-name-input'),
      btnStartGame: document.getElementById('btn-start-game'),
      btnOpenArmory: document.getElementById('btn-open-armory'),
      btnOpenLeaderboard: document.getElementById('btn-open-leaderboard'),
      btnOpenSettings: document.getElementById('btn-open-settings'),
      btnLaunchMission: document.getElementById('btn-launch-mission'),
      btnBackToMain: document.getElementById('btn-back-to-main'),
      btnPlayAgain: document.getElementById('btn-play-again'),
      btnMenuFromGameOver: document.getElementById('btn-menu-from-gameover'),
      
      // HUD Labels & Bars
      hpBar: document.getElementById('hp-bar-fill'),
      hpValue: document.getElementById('hp-value'),
      shieldBar: document.getElementById('shield-bar-fill'),
      shieldValue: document.getElementById('shield-value'),
      xpBar: document.getElementById('xp-bar-fill'),
      scoreText: document.getElementById('hud-score'),
      waveText: document.getElementById('hud-wave'),
      levelText: document.getElementById('hud-level'),
      comboText: document.getElementById('hud-combo'),
      
      // Boss HUD
      bossContainer: document.getElementById('boss-hud-container'),
      bossHpBar: document.getElementById('boss-hp-fill'),
      
      // Shop & Stats
      creditsDisplay: document.getElementById('shop-credits'),
      leaderboardTableBody: document.getElementById('leaderboard-body'),
      perkOptionsContainer: document.getElementById('perk-options-container')
    };
  }

  bindEvents() {
    // Menu Navigation
    this.elements.btnStartGame?.addEventListener('click', () => {
      audioFX.init();
      audioFX.startSynthMusic();
      this.showScreen('shipScreen');
    });

    this.elements.btnOpenArmory?.addEventListener('click', () => {
      audioFX.init();
      this.showScreen('shipScreen');
    });

    this.elements.btnLaunchMission?.addEventListener('click', () => {
      const name = this.elements.pilotInput?.value.trim() || 'PILOT_01';
      this.game.startNewGame(name);
      this.showScreen('hudLayer');
    });

    this.elements.btnBackToMain?.addEventListener('click', () => {
      this.showScreen('startScreen');
    });

    this.elements.btnPlayAgain?.addEventListener('click', () => {
      const name = this.elements.pilotInput?.value.trim() || 'PILOT_01';
      this.game.startNewGame(name);
      this.showScreen('hudLayer');
    });

    this.elements.btnMenuFromGameOver?.addEventListener('click', () => {
      this.showScreen('startScreen');
    });

    // Modals
    this.elements.btnOpenLeaderboard?.addEventListener('click', () => this.openLeaderboard());
    this.elements.btnOpenSettings?.addEventListener('click', () => this.openSettings());

    document.querySelectorAll('.btn-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal-overlay');
        if (modal) modal.classList.remove('active');
      });
    });
  }

  showScreen(screenKey) {
    ['startScreen', 'shipScreen', 'gameOverScreen'].forEach(key => {
      if (this.elements[key]) this.elements[key].classList.remove('active');
    });
    if (this.elements.hudLayer) {
      this.elements.hudLayer.style.display = screenKey === 'hudLayer' ? 'flex' : 'none';
    }
    if (this.elements[screenKey]) {
      this.elements[screenKey].classList.add('active');
    }
  }

  updateHUD(player, wave) {
    if (!player) return;

    // HP Bar
    const hpPct = Math.max(0, (player.health / player.maxHealth) * 100);
    if (this.elements.hpBar) this.elements.hpBar.style.width = `${hpPct}%`;
    if (this.elements.hpValue) this.elements.hpValue.textContent = `${Math.ceil(player.health)}/${player.maxHealth}`;

    // Shield Bar
    const shieldPct = Math.max(0, (player.shield / player.maxShield) * 100);
    if (this.elements.shieldBar) this.elements.shieldBar.style.width = `${shieldPct}%`;
    if (this.elements.shieldValue) this.elements.shieldValue.textContent = `${Math.ceil(player.shield)}/${player.maxShield}`;

    // XP Bar
    const xpPct = Math.max(0, (player.xp / player.xpToNext) * 100);
    if (this.elements.xpBar) this.elements.xpBar.style.width = `${xpPct}%`;

    // Stats
    if (this.elements.scoreText) this.elements.scoreText.textContent = player.score.toLocaleString();
    if (this.elements.waveText) this.elements.waveText.textContent = `WAVE ${wave}`;
    if (this.elements.levelText) this.elements.levelText.textContent = `LVL ${player.level}`;
  }

  updateBossHUD(boss) {
    if (!boss || boss.health <= 0) {
      if (this.elements.bossContainer) this.elements.bossContainer.classList.remove('visible');
      return;
    }
    if (this.elements.bossContainer) this.elements.bossContainer.classList.add('visible');
    const hpPct = Math.max(0, (boss.health / boss.maxHealth) * 100);
    if (this.elements.bossHpBar) this.elements.bossHpBar.style.width = `${hpPct}%`;
  }

  showLevelUpModal(choices, onSelect) {
    if (!this.elements.levelUpModal || !this.elements.perkOptionsContainer) return;
    this.elements.perkOptionsContainer.innerHTML = '';

    choices.forEach(perk => {
      const card = document.createElement('div');
      card.className = 'perk-card';
      card.innerHTML = `
        <div class="perk-icon">${perk.icon}</div>
        <div class="perk-title">${perk.title}</div>
        <div class="perk-desc">${perk.desc}</div>
      `;
      card.addEventListener('click', () => {
        onSelect(perk);
        this.elements.levelUpModal.classList.remove('active');
      });
      this.elements.perkOptionsContainer.appendChild(card);
    });

    this.elements.levelUpModal.classList.add('active');
  }

  async openLeaderboard() {
    if (!this.elements.leaderboardModal) return;
    this.elements.leaderboardModal.classList.add('active');
    
    if (this.elements.leaderboardTableBody) {
      this.elements.leaderboardTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 2rem;">Loading Scores from PHP Backend...</td></tr>';
    }

    const scores = await GameAPI.getLeaderboard();
    if (this.elements.leaderboardTableBody) {
      this.elements.leaderboardTableBody.innerHTML = '';
      scores.forEach((entry, idx) => {
        const tr = document.createElement('tr');
        const rankClass = idx < 3 ? `rank-${idx + 1}` : '';
        tr.innerHTML = `
          <td><span class="rank-badge ${rankClass}">${idx + 1}</span></td>
          <td><strong>${entry.player_name}</strong></td>
          <td style="color: var(--neon-cyan); font-family: var(--font-heading);">${entry.score.toLocaleString()}</td>
          <td>WAVE ${entry.wave}</td>
          <td>${entry.ship_type || 'Vanguard'}</td>
        `;
        this.elements.leaderboardTableBody.appendChild(tr);
      });
    }
  }

  openSettings() {
    if (this.elements.settingsModal) {
      this.elements.settingsModal.classList.add('active');
    }
  }

  showGameOver(player, wave) {
    this.showScreen('gameOverScreen');
    document.getElementById('final-score').textContent = player.score.toLocaleString();
    document.getElementById('final-wave').textContent = wave;
    document.getElementById('final-kills').textContent = player.kills;
  }
}
