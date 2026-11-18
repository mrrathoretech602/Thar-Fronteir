// Havildar Devrath Singh - Bulletproof Player Controller
// Handles 1971 Indian Army Soldier with Multiple Animations & Authentic 7.62mm 1A1 SLR Combat
// Features: Walk (A/D), Run / Sprint (Shift+A/D), Jump (Space/W), Crouch (S), Shoot SLR (J/Click), Melee Fight (C/Q), Aim (F/Right Click)

class Player {
    constructor(scene, x, y) {
        this.scene = scene;

        // Disable right-click context menu so Right-Click Aim works seamlessly
        if (scene.input && scene.input.mouse) {
            scene.input.mouse.disableContextMenu();
        }

        // Create player sprite
        this.sprite = scene.physics.add.sprite(x, y, 'devrath_idle');
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setBounce(0);
        this.sprite.setGravityY(1100);

        // Standing Hitbox (Frame is 110x125, boots bottom at Y=117, center at X=50)
        this.standingWidth = 34;
        this.standingHeight = 96;
        this.standingOffsetX = 33;
        this.standingOffsetY = 21;

        // Crouching Hitbox
        this.crouchWidth = 34;
        this.crouchHeight = 60;
        this.crouchOffsetX = 33;
        this.crouchOffsetY = 57;

        this.sprite.setSize(this.standingWidth, this.standingHeight);
        this.sprite.setOffset(this.standingOffsetX, this.standingOffsetY);

        // Movement Speeds
        this.walkSpeed = 210;
        this.runSpeed = 340;
        this.aimSpeed = 95;
        this.carrySpeed = 160;
        this.jumpForce = -470;
        this.surface = 'stone'; // 'stone' or 'sand'

        // State Flags
        this.facingRight = true;
        this.isCarrying = false;
        this.carriedType = null;
        this.wasOnGround = false;
        this.isLocked = false;
        this.isSprinting = false;
        this.isCrouching = false;
        this.isAiming = false;
        this.isJammed = false;
        this.speedMultiplier = 1.0;

        // 7.62mm 1A1 SLR 20-Round Box Magazine System
        this.magazineRounds = 20;
        this.maxMagazine = 20;
        this.isReloading = false;
        this.reloadTimer = 0;

        // Fluid Movement Polish: Jump Buffer & Coyote Timers
        this.jumpBufferTimer = 0;
        this.coyoteTimer = 0;
        this.slideTimer = 0;

        // Combat Timers & Cooldowns
        this.isShooting = false;
        this.shootTimer = 0;       // ms displaying shoot texture
        this.shootCooldown = 0;   // ms before next shot (semi-auto)
        this.isFighting = false;
        this.meleePhase = 0;      // 1: windup, 2: strike
        this.meleeTimer = 0;
        this.meleeCooldown = 0;

        // Animation Frame Timers
        this.walkTimer = 0;
        this.walkFrame = 1;
        this.runTimer = 0;
        this.runFrame = 1;
        this.footstepTimer = 0;

        // Dual Controls: Keyboard WASD + Arrows + Combat Keys
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.keys = scene.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
            arrowLeft: Phaser.Input.Keyboard.KeyCodes.LEFT,
            arrowRight: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            arrowUp: Phaser.Input.Keyboard.KeyCodes.UP,
            arrowDown: Phaser.Input.Keyboard.KeyCodes.DOWN,
            shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
            shoot: Phaser.Input.Keyboard.KeyCodes.J,
            aim: Phaser.Input.Keyboard.KeyCodes.F,
            melee1: Phaser.Input.Keyboard.KeyCodes.C,
            melee2: Phaser.Input.Keyboard.KeyCodes.Q,
            interact: Phaser.Input.Keyboard.KeyCodes.E,
            reload: Phaser.Input.Keyboard.KeyCodes.R
        });

        // Mouse Controls (Left Click: Shoot, Right Click: Aim; Dialogue owns clicks when active)
        scene.input.on('pointerdown', (pointer) => {
            if (window.dialogueManager && window.dialogueManager.isActive) {
                return;
            }
            const ev = pointer && pointer.event;
            const target = ev && ev.target;
            if (target && target.closest && (
                target.closest('#hud-bar') ||
                target.closest('#dialogue-box') ||
                target.closest('.modal-overlay:not(.hidden)')
            )) {
                return;
            }
            if (this.isLocked) return;

            if (pointer.rightButtonDown()) {
                this.isAiming = true;
            } else if (pointer.leftButtonDown()) {
                this.triggerShoot();
            }
        });

        scene.input.on('pointerup', (pointer) => {
            if (!pointer.rightButtonDown()) {
                this.isAiming = false;
            }
        });

        // Clear any stuck keys if browser tab loses focus, minimizes, or toggles fullscreen
        this._resetInputHandler = () => this.resetInput();
        this._visibilityHandler = () => {
            if (document.hidden) this.resetInput();
        };
        window.addEventListener('blur', this._resetInputHandler);
        document.addEventListener('visibilitychange', this._visibilityHandler);
        document.addEventListener('fullscreenchange', this._resetInputHandler);
        scene.events.once('shutdown', () => {
            window.removeEventListener('blur', this._resetInputHandler);
            document.removeEventListener('visibilitychange', this._visibilityHandler);
            document.removeEventListener('fullscreenchange', this._resetInputHandler);
        });
    }

    resetInput() {
        const resetKeyObj = (k) => {
            if (!k) return;
            if (typeof k.reset === 'function') k.reset();
            k.isDown = false;
            k.isUp = true;
            k.timeDown = 0;
        };
        if (this.keys) {
            Object.values(this.keys).forEach(resetKeyObj);
        }
        if (this.cursors) {
            Object.values(this.cursors).forEach(resetKeyObj);
        }
        this.isAiming = false;
        this.isSprinting = false;
        this.isCrouching = false;
        this.isShooting = false;
        this.isFighting = false;
        if (this.sprite && this.sprite.body) {
            this.sprite.setVelocityX(0);
        }
    }

    setSurface(surface) {
        this.surface = surface;
    }

    setCarrying(carrying, type = null) {
        this.isCarrying = carrying;
        this.carriedType = type;
        if (window.inventoryManager) {
            window.inventoryManager.setCarriedProp(carrying ? type : null);
        }
    }

    lockMovement(locked) {
        this.isLocked = locked;
        if (locked) {
            this.resetInput();
            if (this.sprite) {
                this.sprite.setTexture(this.isCarrying ? 'devrath_carry' : 'devrath_idle');
            }
        }
    }

    // Trigger 7.62mm 1A1 SLR Gunshot (or active mission weapon/strike)
    triggerShoot() {
        if (this.isLocked || this.isCarrying || this.shootCooldown > 0 || this.isFighting) return;

        // If reloading, cannot shoot until magazine is locked in
        if (this.isReloading) return;

        // Auto-trigger reload if magazine empty
        if (this.magazineRounds <= 0) {
            this.triggerReload();
            return;
        }

        // Allow Mission 11 (RCL Gun) or Mission 17 (Hawker Hunter Airstrike) to override standard rifle click/[J]
        if (this.scene && typeof this.scene.handleCustomCombatAction === 'function') {
            if (this.scene.handleCustomCombatAction()) {
                this.shootCooldown = 360;
                return;
            }
        }

        // Check Silica Sand Weapon Jam (Mission 13)
        if (this.isJammed) {
            if (this.scene && typeof this.scene.onJammedFireAttempt === 'function') {
                this.scene.onJammedFireAttempt();
            }
            this.shootCooldown = 250;
            return;
        }

        // Check Reserve Ammo Depletion Hook (Mission 15)
        if (this.scene && typeof this.scene.consumeMissionAmmo === 'function') {
            if (!this.scene.consumeMissionAmmo()) {
                this.shootCooldown = 250;
                return;
            }
        }

        this.magazineRounds--;
        if (this.scene && typeof this.scene.updateTacticalVitals === 'function') {
            this.scene.updateTacticalVitals();
        }

        this.isShooting = true;
        this.shootTimer = 150;     // Display muzzle flash frame for 150ms
        this.shootCooldown = 280;  // 1A1 SLR semi-auto cycling cadence
        this.sprite.setTexture('devrath_shoot');

        // Supersonic 7.62mm Gunshot Audio
        if (window.soundEngine && typeof window.soundEngine.playSLRShot === 'function') {
            window.soundEngine.playSLRShot();
        }

        // Fire physical bullet projectile & spawn muzzle flash / brass shell
        if (this.scene && typeof this.scene.fireBullet === 'function') {
            const muzzleX = this.sprite.x + (this.facingRight ? 54 : -54);
            const muzzleY = this.sprite.y - 10 + (this.isCrouching ? 10 : 0);
            this.scene.fireBullet(muzzleX, muzzleY, this.facingRight);
        }

        // Micro visual recoil punch on weapon fire (springs back in 60ms)
        const recoilDir = this.facingRight ? -2.5 : 2.5;
        this.sprite.x += recoilDir;
        if (this.scene && this.scene.tweens) {
            this.scene.tweens.add({
                targets: this.sprite,
                x: this.sprite.x - recoilDir,
                duration: 60,
                ease: 'Sine.easeOut'
            });
        }

        // Keep horizontal footing stable while firing (no involuntary backward slide)
        if (this.sprite && this.sprite.body && Math.abs(this.sprite.body.velocity.x) < 1) {
            this.sprite.setVelocityX(0);
        }
    }

    // Tactical 7.62mm Magazine Reload
    triggerReload() {
        if (this.isLocked || this.isCarrying || this.isReloading || this.magazineRounds >= this.maxMagazine) return;
        this.isReloading = true;
        this.reloadTimer = 750;
        if (window.soundEngine && typeof window.soundEngine.playRifleCock === 'function') {
            window.soundEngine.playRifleCock();
        }
        if (this.scene && typeof this.scene.showActionToast === 'function') {
            this.scene.showActionToast('🔄 RELOADING 7.62mm SLR...', '#ffd166', 800);
        }
        if (this.scene && typeof this.scene.updateTacticalVitals === 'function') {
            this.scene.updateTacticalVitals();
        }
    }

    // Trigger Melee Combat Strike (Rifle Butt Smash / Bayonet Strike)
    triggerMelee() {
        if (this.isLocked || this.isCarrying || this.meleeCooldown > 0 || this.isFighting) return;

        this.isFighting = true;
        this.meleePhase = 1;
        this.meleeTimer = 260;
        this.meleeCooldown = 420;
        this.sprite.setTexture('devrath_fight_1');

        // Forward strike lunge impulse
        if (this.sprite && this.sprite.body) {
            this.sprite.setVelocityX((this.facingRight ? 1 : -1) * 160);
        }
    }

    update(time, delta) {
        if (!this.sprite || !this.sprite.body) return;

        // Update Timers & Cooldowns
        if (this.shootCooldown > 0) this.shootCooldown -= delta;
        if (this.meleeCooldown > 0) this.meleeCooldown -= delta;
        if (this.isReloading) {
            this.reloadTimer -= delta;
            if (this.reloadTimer <= 0) {
                this.isReloading = false;
                this.magazineRounds = this.maxMagazine;
                if (this.scene && typeof this.scene.updateTacticalVitals === 'function') {
                    this.scene.updateTacticalVitals();
                }
            }
        }

        // Handle Active Melee Sequence
        if (this.isFighting) {
            this.meleeTimer -= delta;
            if (this.meleeTimer <= 160 && this.meleePhase === 1) {
                this.meleePhase = 2;
                this.sprite.setTexture('devrath_fight_2');

                // Play impactful melee hit audio
                if (window.soundEngine && typeof window.soundEngine.playMeleeHit === 'function') {
                    window.soundEngine.playMeleeHit();
                }

                // Call scene melee hitbox check
                if (this.scene && typeof this.scene.playerMeleeAttack === 'function') {
                    const hitX = this.sprite.x + (this.facingRight ? 45 : -45);
                    const hitY = this.sprite.y - 8;
                    this.scene.playerMeleeAttack(hitX, hitY);
                }
            }

            if (this.meleeTimer <= 0) {
                this.isFighting = false;
                this.meleePhase = 0;
            }
        }

        // Handle Active Shoot Frame Timeout
        if (this.isShooting) {
            this.shootTimer -= delta;
            if (this.shootTimer <= 0) {
                this.isShooting = false;
            }
        }

        const onGround = this.sprite.body.blocked.down || this.sprite.body.touching.down;
        if (onGround) {
            this.coyoteTimer = 110;
        } else if (this.coyoteTimer > 0) {
            this.coyoteTimer -= delta;
        }
        if (this.jumpBufferTimer > 0) {
            this.jumpBufferTimer -= delta;
        }

        // Landing Sound & Dust
        if (onGround && !this.wasOnGround) {
            if (window.soundEngine && typeof window.soundEngine.playLand === 'function') {
                window.soundEngine.playLand();
            }
            if (this.scene && typeof this.scene.createLandingDust === 'function') {
                this.scene.createLandingDust(this.sprite.x, this.sprite.y + 48);
            }
        }
        this.wasOnGround = onGround;

        // Pause player movement & combat inputs cleanly while cinematic dialogue is active
        if (window.dialogueManager && window.dialogueManager.isActive) {
            this.sprite.setVelocityX(0);
            this.isShooting = false;
            this.isFighting = false;
            this.sprite.setTexture(this.isCarrying ? 'devrath_carry' : 'devrath_idle');
            return;
        }

        // Interaction Key [E]
        if (this.keys.interact && Phaser.Input.Keyboard.JustDown(this.keys.interact)) {
            if (this.scene.interactionManager) {
                this.scene.interactionManager.handleInteractKey();
            }
        }

        if (this.isLocked) {
            this.sprite.setVelocityX(0);
            return;
        }

        // Clear Jam / Reload Key [R]
        if (this.keys.reload && Phaser.Input.Keyboard.JustDown(this.keys.reload)) {
            let handled = false;
            if (this.scene && typeof this.scene.handleReloadKey === 'function') {
                handled = this.scene.handleReloadKey();
            }
            if (!handled) {
                this.triggerReload();
            }
        }

        // Combat Key Triggers: Shoot [J]
        if (this.keys.shoot && Phaser.Input.Keyboard.JustDown(this.keys.shoot)) {
            this.triggerShoot();
        }

        // Combat Key Triggers: Melee [C] or [Q]
        if ((this.keys.melee1 && Phaser.Input.Keyboard.JustDown(this.keys.melee1)) ||
            (this.keys.melee2 && Phaser.Input.Keyboard.JustDown(this.keys.melee2))) {
            this.triggerMelee();
        }

        // Combat Key: Aim [F]
        const aimHeld = (this.keys.aim && this.keys.aim.isDown);
        if (aimHeld) {
            this.isAiming = true;
        } else if (!this.scene.input.activePointer.rightButtonDown()) {
            this.isAiming = false;
        }

        // Crouch Check: [S] or [Down Arrow]
        const downPressed = (this.keys.down && this.keys.down.isDown) ||
                            (this.keys.arrowDown && this.keys.arrowDown.isDown) ||
                            (this.cursors && this.cursors.down && this.cursors.down.isDown);

        if (downPressed && onGround && !this.isCarrying) {
            if (!this.isCrouching) {
                this.isCrouching = true;
                this.sprite.setSize(this.crouchWidth, this.crouchHeight);
                this.sprite.setOffset(this.crouchOffsetX, this.crouchOffsetY);
                // Tactical combat sand slide if sprinting
                if (this.isSprinting && Math.abs(this.sprite.body.velocity.x) > 160) {
                    this.slideTimer = 340;
                    if (this.scene && typeof this.scene.createFootstepDust === 'function') {
                        for (let i = 0; i < 3; i++) {
                            this.scene.createFootstepDust(this.sprite.x + (this.facingRight ? -14 - i * 12 : 14 + i * 12), this.sprite.y + 46);
                        }
                    }
                }
            }
        } else if (this.isCrouching) {
            this.isCrouching = false;
            this.slideTimer = 0;
            this.sprite.setSize(this.standingWidth, this.standingHeight);
            this.sprite.setOffset(this.standingOffsetX, this.standingOffsetY);
        }

        if (this.slideTimer > 0) {
            this.slideTimer -= delta;
        }

        // Read Horizontal Movement Inputs (A, D, Left Arrow, Right Arrow)
        const leftPressed = (this.keys.left && this.keys.left.isDown) ||
                            (this.keys.arrowLeft && this.keys.arrowLeft.isDown) ||
                            (this.cursors && this.cursors.left && this.cursors.left.isDown);

        const rightPressed = (this.keys.right && this.keys.right.isDown) ||
                             (this.keys.arrowRight && this.keys.arrowRight.isDown) ||
                             (this.cursors && this.cursors.right && this.cursors.right.isDown);

        const moveX = (rightPressed ? 1 : 0) - (leftPressed ? 1 : 0);
        if (moveX < 0) {
            this.facingRight = false;
            this.sprite.setFlipX(true);
        } else if (moveX > 0) {
            this.facingRight = true;
            this.sprite.setFlipX(false);
        }

        // Sprint Check: [Shift]
        const shiftPressed = (this.keys.shift && this.keys.shift.isDown);
        this.isSprinting = shiftPressed && moveX !== 0 && !this.isCarrying && !this.isAiming && !this.isCrouching;

        // Determine Speed
        let currentSpeed = this.walkSpeed;
        if (this.isCarrying) {
            currentSpeed = this.carrySpeed;
        } else if (this.slideTimer > 0) {
            currentSpeed = 240; // Slide momentum
        } else if (this.isCrouching) {
            currentSpeed = moveX !== 0 ? 80 : 0; // Low crawl
        } else if (this.isAiming) {
            currentSpeed = this.aimSpeed;
        } else if (this.isSprinting) {
            currentSpeed = this.runSpeed;
        }

        // Apply Speed Multiplier (e.g. 0.5x during Shell-Shock trauma in Mission 14)
        currentSpeed *= (this.speedMultiplier || 1.0);

        // Apply Horizontal Velocity with smooth organic acceleration & crisp stop (no icy sliding)
        if (!this.isFighting) {
            const targetVx = moveX * currentSpeed;
            const currentVx = this.sprite.body.velocity.x;
            if (moveX !== 0) {
                if ((moveX > 0 && currentVx < -10) || (moveX < 0 && currentVx > 10)) {
                    this.sprite.setVelocityX(targetVx * 0.75);
                } else {
                    const newVx = Phaser.Math.Linear(currentVx, targetVx, 0.65);
                    this.sprite.setVelocityX(Math.abs(newVx - targetVx) < 5 ? targetVx : newVx);
                }
            } else {
                if (Math.abs(currentVx) > 6) {
                    const newVx = Phaser.Math.Linear(currentVx, 0, 0.60);
                    this.sprite.setVelocityX(Math.abs(newVx) < 6 ? 0 : newVx);
                } else {
                    this.sprite.setVelocityX(0);
                }
            }
        }

        // Jump Inputs (W, Space, Up Arrow)
        const jumpPressed = (this.keys.jump && Phaser.Input.Keyboard.JustDown(this.keys.jump)) ||
                            (this.keys.up && Phaser.Input.Keyboard.JustDown(this.keys.up)) ||
                            (this.keys.arrowUp && Phaser.Input.Keyboard.JustDown(this.keys.arrowUp)) ||
                            (this.cursors && this.cursors.up && Phaser.Input.Keyboard.JustDown(this.cursors.up));

        if (jumpPressed) {
            this.jumpBufferTimer = 130;
        }

        const canJump = (this.jumpBufferTimer > 0) && (onGround || this.coyoteTimer > 0) && !this.isCrouching && !this.isFighting;
        if (canJump) {
            this.jumpBufferTimer = 0;
            this.coyoteTimer = 0;
            this.sprite.setVelocityY(this.jumpForce);
            if (window.soundEngine && typeof window.soundEngine.playJump === 'function') {
                window.soundEngine.playJump();
            }
            if (this.scene && typeof this.scene.createJumpDust === 'function') {
                this.scene.createJumpDust(this.sprite.x, this.sprite.y + 48);
            }
        }

        // ==========================================
        // ANIMATION & STATE PRIORITY RESOLUTION
        // ==========================================
        if (this.isShooting) {
            this.sprite.setTexture('devrath_shoot');
        } else if (this.isFighting) {
            this.sprite.setTexture(this.meleePhase === 2 ? 'devrath_fight_2' : 'devrath_fight_1');
        } else if (this.isCarrying) {
            this.sprite.setTexture('devrath_carry');
        } else if (!onGround) {
            // In Air Jump Pose
            this.sprite.setTexture('devrath_jump');
        } else if (this.isCrouching) {
            // Crouched behind sandbag / in trench
            this.sprite.setTexture('devrath_crouch');
        } else if (this.isAiming) {
            // Shouldered SLR Ready Sight
            this.sprite.setTexture('devrath_aim');
        } else if (moveX !== 0) {
            // Movement: Walk vs Run / Tactical Sprint
            if (this.isSprinting) {
                // Tactical Sprint Cycle (4 frames, fast 70ms)
                this.runTimer += delta;
                if (this.runTimer > 70) {
                    this.runFrame = (this.runFrame % 4) + 1;
                    const frameKey = `devrath_run_${this.runFrame}`;
                    if (this.scene.textures.exists(frameKey)) {
                        this.sprite.setTexture(frameKey);
                    }
                    this.runTimer = 0;
                }

                // Rapid Footsteps & Dust
                this.footstepTimer += delta;
                if (this.footstepTimer > 170) {
                    if (window.soundEngine && typeof window.soundEngine.playFootstep === 'function') {
                        window.soundEngine.playFootstep(this.surface);
                    }
                    if (this.scene && typeof this.scene.createFootstepDust === 'function') {
                        this.scene.createFootstepDust(this.sprite.x + (this.facingRight ? -16 : 16), this.sprite.y + 46);
                    }
                    this.footstepTimer = 0;
                }
            } else {
                // Steady Walking Cycle (4 frames, 110ms)
                this.walkTimer += delta;
                if (this.walkTimer > 110) {
                    this.walkFrame = (this.walkFrame % 4) + 1;
                    const frameKey = `devrath_walk_${this.walkFrame}`;
                    if (this.scene.textures.exists(frameKey)) {
                        this.sprite.setTexture(frameKey);
                    }
                    this.walkTimer = 0;
                }

                // Normal Walking Footsteps
                this.footstepTimer += delta;
                if (this.footstepTimer > 260) {
                    if (window.soundEngine && typeof window.soundEngine.playFootstep === 'function') {
                        window.soundEngine.playFootstep(this.surface);
                    }
                    if (this.scene && typeof this.scene.createFootstepDust === 'function') {
                        this.scene.createFootstepDust(this.sprite.x + (this.facingRight ? -12 : 12), this.sprite.y + 46);
                    }
                    this.footstepTimer = 0;
                }
            }
        } else {
            // Standing Idle with SLR
            this.sprite.setTexture('devrath_idle');
            this.footstepTimer = 200;
        }
    }
}

window.Player = Player;
