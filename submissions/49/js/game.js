/* ==========================================================================
   Cyber Strike: Neon Vanguard - Core Game Engine
   ========================================================================== */

class GameEngine {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    
    this.state = 'MENU'; // 'MENU', 'PLAYING', 'PAUSED', 'LEVEL_UP', 'GAME_OVER'
    this.player = null;
    this.shipType = 'Vanguard';
    this.wave = 1;
    this.waveTimer = 0;
    this.waveState = 'COMBAT'; // 'COMBAT', 'INTERMISSION'

    this.enemies = [];
    this.projectiles = [];
    this.particles = [];
    this.drops = [];
    this.damageTexts = [];
    this.boss = null;

    this.lastTime = 0;
    this.screenShake = 0;

    this.saveData = { credits: 250, unlocked_ships: ["Vanguard"], upgrades: {} };
    this.ui = new UIController(this);

    this.initCanvasSize();
    this.bindInputs();
    this.loadSave();
  }

  initCanvasSize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    });
  }

  async loadSave() {
    this.saveData = await GameAPI.getSaveData('default_pilot');
  }

  bindInputs() {
    window.addEventListener('keydown', (e) => {
      if (this.player) this.player.keys[e.code] = true;
    });

    window.addEventListener('keyup', (e) => {
      if (this.player) this.player.keys[e.code] = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (this.player) {
        this.player.mouse.x = e.clientX;
        this.player.mouse.y = e.clientY;
      }
    });

    window.addEventListener('mousedown', (e) => {
      if (this.player && e.button === 0) {
        this.player.mouse.down = true;
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (this.player && e.button === 0) {
        this.player.mouse.down = false;
      }
    });
  }

  startNewGame(pilotName = 'PILOT_01') {
    this.player = new Player(this.shipType);
    this.player.pilotName = pilotName;
    this.player.applyUpgrades(this.saveData.upgrades || {});

    // Spawn player in center
    this.player.x = this.width / 2;
    this.player.y = this.height / 2;

    this.wave = 1;
    this.waveTimer = 0;
    this.enemies = [];
    this.projectiles = [];
    this.particles = [];
    this.drops = [];
    this.damageTexts = [];
    this.boss = null;

    this.state = 'PLAYING';
    this.spawnWaveEnemies();
  }

  spawnWaveEnemies() {
    const enemyCount = 5 + this.wave * 3;
    const isBossWave = this.wave % 5 === 0;

    if (isBossWave) {
      // Spawn Boss
      this.boss = new Enemy(this.width / 2, -100, 'Boss', this.wave);
      this.enemies.push(this.boss);
    } else {
      for (let i = 0; i < enemyCount; i++) {
        // Spawn along screen border
        let x, y;
        if (Math.random() < 0.5) {
          x = Math.random() < 0.5 ? -30 : this.width + 30;
          y = Math.random() * this.height;
        } else {
          x = Math.random() * this.width;
          y = Math.random() < 0.5 ? -30 : this.height + 30;
        }

        const type = Math.random() < 0.25 ? 'Heavy' : 'Scout';
        this.enemies.push(new Enemy(x, y, type, this.wave));
      }
    }
  }

  createParticle(x, y, vx, vy, color, size = 3, life = 0.4) {
    this.particles.push(new Particle(x, y, vx, vy, color, size, life));
  }

  addDamageText(x, y, text, color) {
    this.damageTexts.push(new DamageText(x, y, text, color));
  }

  triggerScreenShake(intensity = 10) {
    this.screenShake = intensity;
  }

  update(dt) {
    if (this.state !== 'PLAYING' && this.state !== 'LEVEL_UP') return;

    // Screen Shake Decay
    if (this.screenShake > 0) {
      this.screenShake -= dt * 30;
    }

    if (this.state === 'PLAYING') {
      // Player Shooting
      if (this.player.mouse.down) {
        const newShots = this.player.shoot();
        if (newShots) {
          this.projectiles.push(...newShots);
        }
      }

      // Update Player
      this.player.update(dt, this.width, this.height, this.createParticle.bind(this));

      // Update Projectiles
      for (let i = this.projectiles.length - 1; i >= 0; i--) {
        const p = this.projectiles[i];
        p.update(dt, this.width, this.height);
        if (p.life <= 0) {
          this.projectiles.splice(i, 1);
        }
      }

      // Update Enemies & Shooting
      for (let i = this.enemies.length - 1; i >= 0; i--) {
        const e = this.enemies[i];
        e.update(dt, this.player.x, this.player.y);

        const enemyShots = e.shoot(this.player.x, this.player.y);
        if (enemyShots) {
          this.projectiles.push(...enemyShots);
        }
      }

      // Wave Completion Check
      if (this.enemies.length === 0) {
        this.wave++;
        this.spawnWaveEnemies();
      }

      // Check Collisions
      this.checkCollisions();

      // Update Particles & Drops
      this.particles.forEach((pt, idx) => {
        pt.update(dt);
        if (pt.life <= 0) this.particles.splice(idx, 1);
      });

      this.drops.forEach((drop, idx) => {
        drop.update(dt, this.player);
        if (Utils.dist(drop.x, drop.y, this.player.x, this.player.y) < this.player.radius + drop.radius) {
          if (drop.type === 'xp') {
            const leveledUp = this.player.addXP(drop.value);
            if (leveledUp) this.triggerLevelUp();
          } else if (drop.type === 'health') {
            this.player.health = Math.min(this.player.maxHealth, this.player.health + 30);
            this.addDamageText(this.player.x, this.player.y, '+30 HP', '#00ff88');
          } else if (drop.type === 'coin') {
            this.player.creditsEarned += drop.value;
            this.addDamageText(this.player.x, this.player.y, `+${drop.value} CR`, '#ffd700');
          }
          audioFX.playPowerup();
          this.drops.splice(idx, 1);
        }
      });

      this.damageTexts.forEach((txt, idx) => {
        txt.update(dt);
        if (txt.life <= 0) this.damageTexts.splice(idx, 1);
      });

      // Update UI HUD
      this.ui.updateHUD(this.player, this.wave);
      this.ui.updateBossHUD(this.boss);
    }
  }

  triggerLevelUp() {
    this.state = 'LEVEL_UP';
    const choices = [
      { id: 'multishot', title: 'Twin Lasers', desc: 'Adds additional spread projectile per shot.', icon: '⚡' },
      { id: 'speed', title: 'Overclock Thrusters', desc: '+25% Movement Speed and Dash maneuver.', icon: '🚀' },
      { id: 'health', title: 'Nanite Repair', desc: 'Instantly restores 50% Max HP and increases Shield.', icon: '🛡️' }
    ];

    this.ui.showLevelUpModal(choices, (selected) => {
      if (selected.id === 'multishot') this.player.multiShotLevel++;
      if (selected.id === 'speed') this.player.speed *= 1.2;
      if (selected.id === 'health') {
        this.player.health = Math.min(this.player.maxHealth, this.player.health + this.player.maxHealth * 0.5);
        this.player.maxShield += 20;
      }
      this.state = 'PLAYING';
    });
  }

  checkCollisions() {
    // Projectile vs Enemy / Player
    for (let pi = this.projectiles.length - 1; pi >= 0; pi--) {
      const p = this.projectiles[pi];

      if (!p.isEnemy) {
        // Player shot vs Enemies
        for (let ei = this.enemies.length - 1; ei >= 0; ei--) {
          const e = this.enemies[ei];
          if (Utils.dist(p.x, p.y, e.x, e.y) < p.radius + e.radius) {
            e.health -= p.damage;
            this.addDamageText(e.x, e.y, Math.round(p.damage), '#00f3ff');
            
            // Explosion particles
            for (let k = 0; k < 4; k++) {
              this.createParticle(p.x, p.y, (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 80, '#00f3ff', 2, 0.2);
            }

            if (e.health <= 0) {
              this.onEnemyKilled(e);
              this.enemies.splice(ei, 1);
              if (e === this.boss) this.boss = null;
            }

            this.projectiles.splice(pi, 1);
            break;
          }
        }
      } else {
        // Enemy shot vs Player
        if (Utils.dist(p.x, p.y, this.player.x, this.player.y) < p.radius + this.player.radius) {
          this.player.takeDamage(p.damage);
          this.triggerScreenShake(8);
          this.addDamageText(this.player.x, this.player.y, `-${Math.round(p.damage)}`, '#ff2a4b');
          this.projectiles.splice(pi, 1);

          if (this.player.health <= 0) {
            this.gameOver();
          }
        }
      }
    }

    // Enemy body vs Player body
    for (let e of this.enemies) {
      if (Utils.dist(e.x, e.y, this.player.x, this.player.y) < e.radius + this.player.radius) {
        this.player.takeDamage(20);
        this.triggerScreenShake(12);
        if (this.player.health <= 0) {
          this.gameOver();
        }
      }
    }
  }

  onEnemyKilled(enemy) {
    this.player.score += enemy.scoreValue;
    this.player.kills++;
    audioFX.playExplosion(enemy.type === 'Boss');

    // Spawn XP / Drops
    const dropType = Math.random() < 0.15 ? 'health' : (Math.random() < 0.25 ? 'coin' : 'xp');
    this.drops.push(new DropItem(enemy.x, enemy.y, dropType, enemy.type === 'Boss' ? 50 : 15));

    // Particle Burst
    const color = enemy.type === 'Boss' ? '#ff007f' : '#00f3ff';
    for (let i = 0; i < (enemy.type === 'Boss' ? 30 : 12); i++) {
      this.createParticle(
        enemy.x,
        enemy.y,
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200,
        color,
        4,
        0.5
      );
    }
  }

  async gameOver() {
    this.state = 'GAME_OVER';
    audioFX.stopSynthMusic();

    // Save Score & Progression via PHP API
    const scoreData = {
      player_name: this.player.pilotName,
      score: this.player.score,
      wave: this.wave,
      ship_type: this.shipType,
      kills: this.player.kills
    };

    await GameAPI.submitScore(scoreData);

    this.saveData.credits += this.player.creditsEarned;
    await GameAPI.saveGame(this.saveData);

    this.ui.showGameOver(this.player, this.wave);
  }

  draw() {
    this.ctx.save();
    
    // Apply Screen Shake
    if (this.screenShake > 0) {
      const rx = (Math.random() - 0.5) * this.screenShake;
      const ry = (Math.random() - 0.5) * this.screenShake;
      this.ctx.translate(rx, ry);
    }

    // Clear Canvas with fading trail
    this.ctx.fillStyle = 'rgba(7, 8, 14, 0.35)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Draw Grid Backdrop
    this.drawGrid();

    // Draw Game Objects
    this.drops.forEach(d => d.draw(this.ctx));
    this.projectiles.forEach(p => p.draw(this.ctx));
    this.enemies.forEach(e => e.draw(this.ctx));
    if (this.player && this.player.health > 0) this.player.draw(this.ctx);
    this.particles.forEach(pt => pt.draw(this.ctx));
    this.damageTexts.forEach(t => t.draw(this.ctx));

    this.ctx.restore();
  }

  drawGrid() {
    this.ctx.strokeStyle = 'rgba(0, 243, 255, 0.04)';
    this.ctx.lineWidth = 1;
    const gridSize = 60;
    
    for (let x = 0; x < this.width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }
  }

  loop(timestamp) {
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timestamp;

    this.update(dt);
    this.draw();

    requestAnimationFrame(this.loop.bind(this));
  }

  start() {
    requestAnimationFrame(this.loop.bind(this));
  }
}

// Instantiate Engine when DOM Ready
window.addEventListener('DOMContentLoaded', () => {
  const game = new GameEngine();
  game.start();
});
