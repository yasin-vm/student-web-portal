/* ==========================================================================
   Cyber Strike: Neon Vanguard - Entity Classes & Combat Physics
   ========================================================================== */

// Helper Math Utilities
const Utils = {
  clamp: (v, min, max) => Math.min(Math.max(v, min), max),
  dist: (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1),
  angle: (x1, y1, x2, y2) => Math.atan2(y2 - y1, x2 - x1),
  randomRange: (min, max) => min + Math.random() * (max - min)
};

/* --------------------------------------------------------------------------
   PARTICLE ENGINE
   -------------------------------------------------------------------------- */
class Particle {
  constructor(x, y, vx, vy, color, size, life, glow = true) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.size = size;
    this.maxLife = life;
    this.life = life;
    this.glow = glow;
  }

  update(dt) {
    this.x += this.vx * dt * 60;
    this.y += this.vy * dt * 60;
    this.vx *= 0.96;
    this.vy *= 0.96;
    this.life -= dt;
  }

  draw(ctx) {
    if (this.life <= 0) return;
    const alpha = Math.max(0, this.life / this.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    if (this.glow) {
      ctx.shadowColor = this.color;
      ctx.shadowBlur = this.size * 2;
    }
    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.max(0.5, this.size * alpha), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/* --------------------------------------------------------------------------
   FLOATING COMBAT TEXT
   -------------------------------------------------------------------------- */
class DamageText {
  constructor(x, y, text, color = '#ff007f') {
    this.x = x + (Math.random() * 20 - 10);
    this.y = y;
    this.text = text;
    this.color = color;
    this.life = 0.8;
    this.maxLife = 0.8;
    this.vy = -30;
  }

  update(dt) {
    this.y += this.vy * dt;
    this.life -= dt;
  }

  draw(ctx) {
    if (this.life <= 0) return;
    const alpha = Math.max(0, this.life / this.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = '700 14px Orbitron';
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 8;
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
}

/* --------------------------------------------------------------------------
   PROJECTILES
   -------------------------------------------------------------------------- */
class Projectile {
  constructor(x, y, angle, speed, damage, isEnemy = false, color = '#00f3ff', radius = 4) {
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.damage = damage;
    this.isEnemy = isEnemy;
    this.color = color;
    this.radius = radius;
    this.life = 3.0;
  }

  update(dt, canvasWidth, canvasHeight) {
    this.x += this.vx * dt * 60;
    this.y += this.vy * dt * 60;
    this.life -= dt;

    if (this.x < -50 || this.x > canvasWidth + 50 || this.y < -50 || this.y > canvasHeight + 50) {
      this.life = 0;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/* --------------------------------------------------------------------------
   XP CUBES & POWERUPS
   -------------------------------------------------------------------------- */
class DropItem {
  constructor(x, y, type = 'xp', value = 10) {
    this.x = x;
    this.y = y;
    this.type = type; // 'xp', 'health', 'emp', 'coin'
    this.value = value;
    this.radius = type === 'xp' ? 5 : 9;
    this.life = 15.0;
    this.angle = Math.random() * Math.PI * 2;
  }

  update(dt, player) {
    this.life -= dt;
    this.angle += dt * 3;

    // Magnetic pull towards player
    const distToPlayer = Utils.dist(this.x, this.y, player.x, player.y);
    if (distToPlayer < player.magnetRadius) {
      const angle = Utils.angle(this.x, this.y, player.x, player.y);
      const pullSpeed = (1 - distToPlayer / player.magnetRadius) * 400;
      this.x += Math.cos(angle) * pullSpeed * dt;
      this.y += Math.sin(angle) * pullSpeed * dt;
    }
  }

  draw(ctx) {
    ctx.save();
    let color = '#ff007f';
    if (this.type === 'health') color = '#00ff88';
    if (this.type === 'emp') color = '#00f3ff';
    if (this.type === 'coin') color = '#ffd700';

    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;

    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillRect(-this.radius, -this.radius, this.radius * 2, this.radius * 2);
    ctx.restore();
  }
}

/* --------------------------------------------------------------------------
   PLAYER CLASS & SHIPS
   -------------------------------------------------------------------------- */
class Player {
  constructor(shipType = 'Vanguard') {
    this.x = 0;
    this.y = 0;
    this.radius = 18;
    this.shipType = shipType;

    // Base Stats
    this.maxHealth = shipType === 'Titan' ? 160 : 100;
    this.health = this.maxHealth;
    this.maxShield = shipType === 'Phantom' ? 40 : 60;
    this.shield = this.maxShield;
    this.shieldRechargeDelay = 0;

    this.speed = shipType === 'Phantom' ? 380 : (shipType === 'Titan' ? 280 : 330);
    this.fireRate = shipType === 'Phantom' ? 0.12 : 0.18; // Seconds per shot
    this.fireTimer = 0;

    this.level = 1;
    this.xp = 0;
    this.xpToNext = 50;
    this.score = 0;
    this.kills = 0;
    this.creditsEarned = 0;
    this.magnetRadius = 160;

    // Perks & Upgrades
    this.multiShotLevel = 0;
    this.plasmaDroneActive = false;
    this.vampiricShield = false;
    this.empCooldown = 0;

    // Input States
    this.keys = {};
    this.mouse = { x: 0, y: 0, down: false };
    this.angle = 0;
  }

  applyUpgrades(upgrades = {}) {
    if (upgrades.max_health) {
      this.maxHealth += upgrades.max_health * 20;
      this.health = this.maxHealth;
    }
    if (upgrades.fire_rate) {
      this.fireRate = Math.max(0.08, this.fireRate - upgrades.fire_rate * 0.02);
    }
    if (upgrades.move_speed) {
      this.speed += upgrades.move_speed * 35;
    }
    if (upgrades.magnet_radius) {
      this.magnetRadius += upgrades.magnet_radius * 40;
    }
  }

  update(dt, canvasWidth, canvasHeight, createParticle) {
    // Movement Logic
    let dx = 0, dy = 0;
    if (this.keys['KeyW'] || this.keys['ArrowUp']) dy -= 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) dy += 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) dx -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) dx += 1;

    if (dx !== 0 && dy !== 0) {
      dx *= 0.7071;
      dy *= 0.7071;
    }

    this.x = Utils.clamp(this.x + dx * this.speed * dt, this.radius, canvasWidth - this.radius);
    this.y = Utils.clamp(this.y + dy * this.speed * dt, this.radius, canvasHeight - this.radius);

    // Aim Angle towards Mouse
    this.angle = Utils.angle(this.x, this.y, this.mouse.x, this.mouse.y);

    // Shield Regeneration
    if (this.shieldRechargeDelay > 0) {
      this.shieldRechargeDelay -= dt;
    } else if (this.shield < this.maxShield) {
      this.shield = Math.min(this.maxShield, this.shield + dt * 15);
    }

    // Engine Thruster Particle Effect
    if (dx !== 0 || dy !== 0) {
      const trailAngle = this.angle + Math.PI + (Math.random() * 0.4 - 0.2);
      createParticle(
        this.x - Math.cos(this.angle) * 12,
        this.y - Math.sin(this.angle) * 12,
        Math.cos(trailAngle) * 60,
        Math.sin(trailAngle) * 60,
        '#00f3ff',
        3,
        0.25
      );
    }

    this.fireTimer -= dt;
    if (this.empCooldown > 0) this.empCooldown -= dt;
  }

  shoot() {
    if (this.fireTimer > 0) return null;
    this.fireTimer = this.fireRate;

    const projectiles = [];
    const baseDamage = this.shipType === 'Titan' ? 28 : (this.shipType === 'Phantom' ? 18 : 22);

    if (this.multiShotLevel === 0) {
      projectiles.push(new Projectile(this.x, this.y, this.angle, 750, baseDamage, false, '#00f3ff', 4));
    } else if (this.multiShotLevel === 1) {
      projectiles.push(new Projectile(this.x, this.y, this.angle - 0.1, 750, baseDamage, false, '#00f3ff', 4));
      projectiles.push(new Projectile(this.x, this.y, this.angle + 0.1, 750, baseDamage, false, '#00f3ff', 4));
    } else {
      projectiles.push(new Projectile(this.x, this.y, this.angle, 750, baseDamage, false, '#ff007f', 5));
      projectiles.push(new Projectile(this.x, this.y, this.angle - 0.2, 750, baseDamage * 0.8, false, '#00f3ff', 4));
      projectiles.push(new Projectile(this.x, this.y, this.angle + 0.2, 750, baseDamage * 0.8, false, '#00f3ff', 4));
    }

    audioFX.playLaser(this.shipType === 'Phantom' ? 950 : 750);
    return projectiles;
  }

  takeDamage(amount) {
    this.shieldRechargeDelay = 3.0; // Reset shield timer
    if (this.shield > 0) {
      if (this.shield >= amount) {
        this.shield -= amount;
        audioFX.playShieldHit();
        return;
      } else {
        amount -= this.shield;
        this.shield = 0;
      }
    }
    this.health -= amount;
  }

  addXP(amount) {
    this.xp += amount;
    let leveledUp = false;
    if (this.xp >= this.xpToNext) {
      this.xp -= this.xpToNext;
      this.level++;
      this.xpToNext = Math.floor(this.xpToNext * 1.35);
      leveledUp = true;
      audioFX.playLevelUp();
    }
    return leveledUp;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Ship Hull Render
    ctx.fillStyle = '#0e111e';
    ctx.strokeStyle = this.shipType === 'Phantom' ? '#ff007f' : (this.shipType === 'Titan' ? '#ffd700' : '#00f3ff');
    ctx.lineWidth = 3;
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 15;

    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.lineTo(-14, -14);
    ctx.lineTo(-6, 0);
    ctx.lineTo(-14, 14);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Cockpit Glow
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(4, 0, 4, 0, Math.PI * 2);
    ctx.fill();

    // Shield Aura
    if (this.shield > 0) {
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 6, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }
}

/* --------------------------------------------------------------------------
   ENEMY CLASSES & BOSS AI
   -------------------------------------------------------------------------- */
class Enemy {
  constructor(x, y, type = 'Scout', wave = 1) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.wave = wave;

    this.radius = type === 'Boss' ? 45 : (type === 'Heavy' ? 24 : 14);
    this.maxHealth = (type === 'Boss' ? 1200 + wave * 300 : (type === 'Heavy' ? 120 + wave * 25 : 30 + wave * 10));
    this.health = this.maxHealth;
    this.speed = type === 'Boss' ? 60 : (type === 'Heavy' ? 120 : 210);
    this.scoreValue = type === 'Boss' ? 5000 : (type === 'Heavy' ? 450 : 150);
    this.angle = 0;
    this.shootTimer = 0;
  }

  update(dt, playerX, playerY) {
    this.angle = Utils.angle(this.x, this.y, playerX, playerY);

    // Chasing AI logic
    this.x += Math.cos(this.angle) * this.speed * dt;
    this.y += Math.sin(this.angle) * this.speed * dt;

    this.shootTimer -= dt;
  }

  shoot(playerX, playerY) {
    if (this.shootTimer > 0) return null;
    this.shootTimer = this.type === 'Boss' ? 0.6 : 2.2;

    const projectiles = [];
    if (this.type === 'Heavy') {
      projectiles.push(new Projectile(this.x, this.y, this.angle, 350, 15, true, '#ff2a4b', 6));
    } else if (this.type === 'Boss') {
      // Bullet hell radial burst
      for (let i = -2; i <= 2; i++) {
        projectiles.push(new Projectile(this.x, this.y, this.angle + i * 0.25, 300, 20, true, '#ff007f', 6));
      }
    }
    return projectiles.length ? projectiles : null;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    let mainColor = '#ff2a4b';
    if (this.type === 'Heavy') mainColor = '#9d4edd';
    if (this.type === 'Boss') mainColor = '#ff007f';

    ctx.fillStyle = '#140810';
    ctx.strokeStyle = mainColor;
    ctx.lineWidth = this.type === 'Boss' ? 4 : 2;
    ctx.shadowColor = mainColor;
    ctx.shadowBlur = 12;

    if (this.type === 'Boss') {
      ctx.beginPath();
      ctx.moveTo(35, 0);
      ctx.lineTo(-25, -30);
      ctx.lineTo(-10, 0);
      ctx.lineTo(-25, 30);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(14, 0);
      ctx.lineTo(-10, -10);
      ctx.lineTo(-10, 10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  }
}
