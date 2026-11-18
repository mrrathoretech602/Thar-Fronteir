// NPCs & Enemy Units Controller for THAR FRONTIER: A SOLDIER'S PROMISE · 1971
// Manages Major Chandpuri, BSF Bhairon Singh, Enemy Tank Vanguard, and Infantry Squads.

class NPC {
    constructor(scene, x, y, textureKey, label = '', options = {}) {
        this.scene = scene;
        const resolvedKey = scene.textures.exists(textureKey) ? textureKey : (options.fallbackTexture || textureKey);
        this.sprite = scene.physics.add.staticSprite(x, y, resolvedKey);
        this.sprite.setDepth(options.depth || 11);
        if (options.scale) {
            this.sprite.setScale(options.scale);
        }

        if (label) {
            const offsetY = options.tagOffsetY || 62;
            this.nameTag = scene.add.text(x, y - offsetY, label, {
                fontSize: '13px',
                fontFamily: 'Rajdhani, sans-serif',
                fontStyle: 'bold',
                color: '#ffd166',
                backgroundColor: 'rgba(10, 5, 20, 0.78)',
                padding: { x: 6, y: 2 }
            }).setOrigin(0.5).setDepth(20);
        }
    }

    setFacing(faceLeft) {
        if (this.sprite) this.sprite.setFlipX(faceLeft);
    }

    destroy() {
        if (this.sprite) this.sprite.destroy();
        if (this.nameTag) this.nameTag.destroy();
    }
}

class EnemyTankColumn {
    constructor(scene, x, y, count = 4) {
        this.scene = scene;
        this.tanks = [];
        this.active = false;
        const hasComposite = scene.textures.exists('type59_hull') && scene.textures.exists('type59_turret');

        for (let i = 0; i < count; i++) {
            const baseX = x + i * 245;
            const baseY = y - (i % 2) * 12;
            let sprite, turret = null, fuelDrum = null;

            if (hasComposite) {
                sprite = scene.add.sprite(baseX, baseY, 'type59_hull')
                    .setDepth(5)
                    .setScale(0.84)
                    .setFlipX(true);

                turret = scene.add.sprite(baseX - 24, baseY - 34, 'type59_turret')
                    .setDepth(6)
                    .setScale(0.80)
                    .setFlipX(true);

                if (scene.textures.exists('diesel_fuel_drum')) {
                    fuelDrum = scene.add.sprite(baseX + 126, baseY - 32, 'diesel_fuel_drum')
                        .setDepth(6)
                        .setScale(0.55)
                        .setTint(0xffb4a2);
                }
            } else {
                sprite = scene.add.sprite(baseX, baseY, 'enemy_tank')
                    .setDepth(5)
                    .setAlpha(0.9)
                    .setScale(0.9);
            }

            // Headlight searchlight beam cutting left through desert dust
            const light = scene.add.triangle(
                baseX - 135, baseY + 4,
                0, 0,
                -260, -52,
                -260, 58,
                0xfff3b0, 0.19
            ).setDepth(7);

            this.tanks.push({
                sprite,
                turret,
                fuelDrum,
                light,
                baseY,
                destroyed: false
            });
        }
    }

    startAdvancing() {
        this.active = true;
        this.tanks.forEach((item, idx) => {
            if (item.destroyed) return;
            const parts = [item.sprite, item.light, item.turret, item.fuelDrum].filter(Boolean);
            this.scene.tweens.add({
                targets: parts,
                x: '-=190',
                duration: 5600 + idx * 350,
                ease: 'Sine.easeInOut',
                repeat: -1,
                yoyo: true
            });
            // Subtle dune-cresting vertical bob so player times the rear drum shot
            this.scene.tweens.add({
                targets: parts,
                y: '-=26',
                duration: 2800 + idx * 200,
                ease: 'Sine.easeInOut',
                repeat: -1,
                yoyo: true
            });
        });
    }

    convertToWreck(index) {
        const item = this.tanks[index];
        if (!item || item.destroyed) return false;
        item.destroyed = true;

        const parts = [item.sprite, item.light, item.turret, item.fuelDrum].filter(Boolean);
        parts.forEach(p => this.scene.tweens.killTweensOf(p));

        if (item.turret) item.turret.setVisible(false);
        if (item.fuelDrum) item.fuelDrum.setVisible(false);
        if (item.light) item.light.setVisible(false);

        if (item.sprite) {
            const wreckKey = this.scene.textures.exists('destroyed_tank_fire')
                ? 'destroyed_tank_fire'
                : 'destroyed_tank';
            item.sprite.setTexture(wreckKey)
                .setFlipX(true)
                .setScale(wreckKey === 'destroyed_tank_fire' ? 1.45 : 0.92)
                .setAlpha(0.98);
        }
        return true;
    }

    destroy() {
        this.tanks.forEach(item => {
            const parts = [item.sprite, item.light, item.turret, item.fuelDrum].filter(Boolean);
            parts.forEach(p => {
                this.scene.tweens.killTweensOf(p);
                p.destroy();
            });
        });
        this.tanks = [];
    }
}

class EnemySoldier {
    constructor(scene, x, y, variant = 'march') {
        this.scene = scene;
        this.alive = true;
        this.isRetreating = false;
        this.maxHp = variant === 'charge' ? 3 : 2;
        this.hp = this.maxHp;
        this.speed = variant === 'run' || variant === 'charge' ? 128 : 84;
        this.animTimer = 0;
        this.animStep = 0;
        this.fireCooldown = 1200 + Math.random() * 1100;
        this.kneelShootTimer = 0;

        const initialTex = scene.textures.exists(`pak_${variant}`)
            ? `pak_${variant}`
            : (scene.textures.exists('pak_stand') ? 'pak_stand' : 'devrath_idle');

        this.sprite = scene.physics.add.sprite(x, y, initialTex);
        this.sprite.setDepth(96);
        this.sprite.setFlipX(true); // Facing left toward Indian outpost
        this.sprite.setScale(this.getScaleForTex(initialTex));
        if (this.sprite.body) {
            this.sprite.body.setAllowGravity(false);
            this.sprite.body.setSize(this.sprite.width * 0.65, this.sprite.height * 0.88);
        }

        // Compact overhead combat HP bar (hidden until injured)
        this.hpBg = scene.add.rectangle(x, y - 62, 38, 5, 0x111827, 0.85).setDepth(118).setVisible(false);
        this.hpFill = scene.add.rectangle(x - 18, y - 62, 36, 3, 0xef4444, 0.95).setOrigin(0, 0.5).setDepth(119).setVisible(false);
    }

    getScaleForTex(key) {
        if (key === 'pak_stand') return 0.54;
        if (key === 'pak_march') return 0.62;
        if (key === 'pak_run') return 0.62;
        if (key === 'pak_charge') return 0.72;
        if (key === 'pak_kneel') return 0.74;
        if (key === 'pak_prone') return 0.68;
        return 0.60;
    }

    syncHpBar() {
        if (!this.sprite || !this.hpBg || !this.hpFill) return;
        const bx = this.sprite.x;
        const by = this.sprite.y - 60;
        this.hpBg.setPosition(bx, by);
        this.hpFill.setPosition(bx - 18, by);
    }

    takeDamage(dmg = 1, knockbackDir = 1) {
        if (!this.alive || !this.sprite) return false;
        this.hp -= dmg;
        this.sprite.setTint(0xff6b6b);
        this.sprite.x += knockbackDir * 18;

        // Visceral tactile hit feedback & screen juice
        if (this.scene.cameraController) {
            this.scene.cameraController.shake(0.003, 60);
        }
        if (this.scene && typeof this.scene.createBloodSpatter === 'function') {
            this.scene.createBloodSpatter(this.sprite.x, this.sprite.y - 12);
        }
        if (this.scene && typeof this.scene.showFloatingCombatText === 'function') {
            const isCrit = dmg >= 2;
            this.scene.showFloatingCombatText(this.sprite.x, this.sprite.y - 48, isCrit ? '💥 CRITICAL -50' : '-35', isCrit ? '#ef4444' : '#ffd166');
        }

        if (this.hp > 0 && this.hpBg && this.hpFill) {
            this.hpBg.setVisible(true);
            this.hpFill.setVisible(true);
            this.hpFill.setDisplaySize(Math.max(2, Math.round(36 * (this.hp / this.maxHp))), 3);
            this.syncHpBar();
        }

        if (window.soundEngine && typeof window.soundEngine.playMeleeHit === 'function') {
            window.soundEngine.playMeleeHit();
        }

        this.scene.time.delayedCall(90, () => {
            if (this.sprite && this.sprite.active && this.alive) this.sprite.clearTint();
        });

        if (this.hp <= 0) {
            this.die(knockbackDir);
            return true;
        }
        return false;
    }

    die(knockbackDir = 1) {
        if (!this.alive) return;
        this.alive = false;
        if (this.hpBg) { this.hpBg.destroy(); this.hpBg = null; }
        if (this.hpFill) { this.hpFill.destroy(); this.hpFill = null; }

        if (this.scene && typeof this.scene.showFloatingCombatText === 'function') {
            this.scene.showFloatingCombatText(this.sprite.x, this.sprite.y - 45, '⚔️ ENEMY DOWN +100', '#2ec4b6');
        }

        if (this.sprite) {
            if (this.sprite.body) {
                this.sprite.setVelocity(0, 0);
                this.sprite.body.enable = false;
            }
            const proneTex = this.scene.textures.exists('pak_prone') ? 'pak_prone' : 'pak_kneel';
            if (this.scene.textures.exists(proneTex)) {
                this.sprite.setTexture(proneTex);
                this.sprite.setScale(this.getScaleForTex(proneTex));
            }
            this.sprite.setTint(0x9ca3af);
            const dropY = this.sprite.y + 24;
            this.scene.tweens.add({
                targets: this.sprite,
                x: this.sprite.x + knockbackDir * 18,
                y: dropY,
                duration: 210,
                ease: 'Bounce.easeOut',
                onComplete: () => {
                    if (this.scene && this.scene.createLandingDust && this.sprite) {
                        this.scene.createLandingDust(this.sprite.x, this.sprite.y + 10);
                    }
                }
            });
            this.scene.tweens.add({
                targets: this.sprite,
                alpha: 0,
                duration: 1400,
                delay: 900,
                onComplete: () => this.destroy()
            });
        }
        if (this.scene && typeof this.scene.onEnemySoldierKilled === 'function') {
            this.scene.onEnemySoldierKilled(this);
        }
    }

    retreatEast() {
        if (!this.alive || !this.sprite) return;
        this.isRetreating = true;
        if (this.hpBg) this.hpBg.setVisible(false);
        if (this.hpFill) this.hpFill.setVisible(false);
        this.sprite.setFlipX(false);
        this.speed = 230;
    }

    update(delta, playerX) {
        if (!this.alive || !this.sprite || !this.sprite.active) return;

        if (this.isRetreating) {
            this.sprite.x += this.speed * (delta / 1000);
            if (this.scene.textures.exists('pak_run')) {
                this.sprite.setTexture('pak_run');
                this.sprite.setScale(this.getScaleForTex('pak_run'));
            }
            if (this.sprite.x > 3500) this.destroy();
            return;
        }

        const dx = playerX - this.sprite.x;
        const dir = dx < 0 ? -1 : 1;
        this.sprite.setFlipX(dir < 0);

        // Fire return shots periodically when engaged inside visible battle sector
        this.fireCooldown -= delta;
        if (Math.abs(dx) < 820 && Math.abs(dx) > 100 && this.fireCooldown <= 0) {
            this.fireCooldown = 1750 + Math.random() * 1100;
            this.kneelShootTimer = 360;
            if (this.scene.textures.exists('pak_kneel')) {
                this.sprite.setTexture('pak_kneel');
                this.sprite.setScale(this.getScaleForTex('pak_kneel'));
            }
            if (this.scene && typeof this.scene.fireEnemyBullet === 'function') {
                const muzX = this.sprite.x + (dir * 38);
                this.scene.fireEnemyBullet(muzX, this.sprite.y - 6, dir > 0);
            }
        }

        if (this.kneelShootTimer > 0) {
            this.kneelShootTimer -= delta;
            this.syncHpBar();
            return;
        }

        // Advance until within trench firefight range (~160px), then hold kneeling cover
        if (Math.abs(dx) > 165) {
            this.sprite.x += dir * this.speed * (delta / 1000);
            this.animTimer += delta;
            if (this.animTimer > 220) {
                this.animTimer = 0;
                this.animStep = (this.animStep + 1) % 2;
                const tex = this.animStep === 0
                    ? (this.scene.textures.exists('pak_run') ? 'pak_run' : 'pak_stand')
                    : (this.scene.textures.exists('pak_march') ? 'pak_march' : 'pak_charge');
                if (this.scene.textures.exists(tex)) {
                    this.sprite.setTexture(tex);
                    this.sprite.setScale(this.getScaleForTex(tex));
                }
            }
        } else {
            if (this.scene.textures.exists('pak_kneel')) {
                this.sprite.setTexture('pak_kneel');
                this.sprite.setScale(this.getScaleForTex('pak_kneel'));
            }
        }
        this.syncHpBar();
    }

    destroy() {
        this.alive = false;
        if (this.hpBg) { this.hpBg.destroy(); this.hpBg = null; }
        if (this.hpFill) { this.hpFill.destroy(); this.hpFill = null; }
        if (this.sprite) {
            this.scene.tweens.killTweensOf(this.sprite);
            this.sprite.destroy();
            this.sprite = null;
        }
    }
}

window.NPC = NPC;
window.EnemyTankColumn = EnemyTankColumn;
window.EnemySoldier = EnemySoldier;
