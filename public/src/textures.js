// THAR FRONTIER: A SOLDIER'S PROMISE · 1971
// src/textures.js - Procedural Indian Paper-Art 2.5D Texture Generator
// Includes exact Havildar Devrath Singh character art (Cap, Mustache, 1A1 SLR Battle Rifle, Multiple Animations).

class TextureGenerator {
    static generateAll(scene) {
        this.generateEnvironmentTextures(scene);
        this.generateDevrathAnimations(scene);
        this.generateNPCs(scene);
        this.generatePortraits(scene);
        this.generatePropsAndVehicles(scene);
        this.generateVFX(scene);
    }

    // ==========================================
    // 1. 2.5D ENVIRONMENT TEXTURES
    // ==========================================
    static generateEnvironmentTextures(scene) {
        // Dusk Skybox (Thar Sunset / Convoy)
        if (!scene.textures.exists('sky_dusk')) {
            const canvas = document.createElement('canvas');
            canvas.width = 1280;
            canvas.height = 720;
            const ctx = canvas.getContext('2d');
            const g = ctx.createLinearGradient(0, 0, 0, 720);
            g.addColorStop(0, '#231730');
            g.addColorStop(0.32, '#5c243a');
            g.addColorStop(0.62, '#b84b36');
            g.addColorStop(0.84, '#e58a48');
            g.addColorStop(1, '#f7ce85');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, 1280, 720);

            // Soft Evening Sun Glow near Left Horizon
            const sunG = ctx.createRadialGradient(240, 440, 20, 240, 440, 320);
            sunG.addColorStop(0, 'rgba(255, 240, 195, 0.55)');
            sunG.addColorStop(0.35, 'rgba(255, 190, 110, 0.25)');
            sunG.addColorStop(1, 'rgba(255, 150, 70, 0)');
            ctx.fillStyle = sunG;
            ctx.fillRect(0, 100, 650, 620);

            scene.textures.addCanvas('sky_dusk', canvas);
            scene.textures.addCanvas('sky_sunset', canvas);
        }

        // Jaisalmer Station Warm Desert Dusk Sky (Harmonizes with sandstone facade & dunes)
        if (!scene.textures.exists('sky_station_dusk')) {
            const canvas = document.createElement('canvas');
            canvas.width = 1280;
            canvas.height = 720;
            const ctx = canvas.getContext('2d');
            const g = ctx.createLinearGradient(0, 0, 0, 720);
            g.addColorStop(0, '#442b3c');
            g.addColorStop(0.24, '#8d4c42');
            g.addColorStop(0.48, '#d4824f');
            g.addColorStop(0.72, '#f0bb78');
            g.addColorStop(1, '#fae5ba');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, 1280, 720);

            // Warm Low Golden Sunset Disc & Halo
            const sunGlow = ctx.createRadialGradient(260, 360, 18, 260, 360, 300);
            sunGlow.addColorStop(0, 'rgba(255, 248, 220, 0.65)');
            sunGlow.addColorStop(0.3, 'rgba(255, 212, 138, 0.28)');
            sunGlow.addColorStop(1, 'rgba(240, 160, 90, 0)');
            ctx.fillStyle = sunGlow;
            ctx.fillRect(0, 40, 620, 640);

            // Subtle Dusk Cirrus Cloud Streaks
            ctx.fillStyle = 'rgba(255, 232, 185, 0.14)';
            ctx.beginPath();
            ctx.ellipse(540, 165, 190, 16, 0, 0, Math.PI * 2);
            ctx.ellipse(980, 125, 210, 18, 0, 0, Math.PI * 2);
            ctx.fill();

            scene.textures.addCanvas('sky_station_dusk', canvas);
        }

        // Night Skybox (Rich Starry Midnight over Thar Desert with Glowing Moon)
        if (!scene.textures.exists('sky_night')) {
            const canvas = document.createElement('canvas');
            canvas.width = 1280;
            canvas.height = 720;
            const ctx = canvas.getContext('2d');

            // Deep Celestial Night Sky Gradient
            const g = ctx.createLinearGradient(0, 0, 0, 720);
            g.addColorStop(0, '#02040b');
            g.addColorStop(0.35, '#070f24');
            g.addColorStop(0.7, '#0f1a38');
            g.addColorStop(1, '#1b2848');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, 1280, 720);

            // Procedural Desert Twinkling Stars (120 stars)
            for (let i = 0; i < 120; i++) {
                const sx = (i * 97) % 1280;
                const sy = (i * 53) % 460;
                const r = ((i % 5) === 0) ? 1.6 : (((i % 3) === 0) ? 1.2 : 0.8);
                const a = 0.35 + ((i % 7) / 10);
                ctx.fillStyle = `rgba(235, 245, 255, ${a})`;
                ctx.beginPath();
                ctx.arc(sx, sy, r, 0, Math.PI * 2);
                ctx.fill();
            }

            // Thar Desert Full Moon Glow
            const moonX = 980;
            const moonY = 140;
            const moonRad = 40;

            const glow = ctx.createRadialGradient(moonX, moonY, moonRad, moonX, moonY, 140);
            glow.addColorStop(0, 'rgba(215, 235, 255, 0.45)');
            glow.addColorStop(0.5, 'rgba(160, 195, 245, 0.15)');
            glow.addColorStop(1, 'rgba(10, 20, 50, 0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(moonX, moonY, 140, 0, Math.PI * 2);
            ctx.fill();

            // Silvery Full Moon Surface
            ctx.fillStyle = '#f8fbff';
            ctx.beginPath();
            ctx.arc(moonX, moonY, moonRad, 0, Math.PI * 2);
            ctx.fill();

            // Moon craters / mare textures
            ctx.fillStyle = 'rgba(190, 205, 225, 0.35)';
            ctx.beginPath();
            ctx.arc(moonX - 8, moonY - 6, 12, 0, Math.PI * 2);
            ctx.arc(moonX + 10, moonY + 8, 14, 0, Math.PI * 2);
            ctx.arc(moonX + 6, moonY - 14, 8, 0, Math.PI * 2);
            ctx.fill();

            scene.textures.addCanvas('sky_night', canvas);
        }

        // Dunes Far (Gentle Distant Moonlit Desert Ridge)
        if (!scene.textures.exists('dune_far')) {
            const canvas = document.createElement('canvas');
            canvas.width = 1600;
            canvas.height = 360;
            const ctx = canvas.getContext('2d');

            // Soft moonlit night sand gradient
            const grad = ctx.createLinearGradient(0, 200, 0, 360);
            grad.addColorStop(0, '#243248');
            grad.addColorStop(0.5, '#1e293c');
            grad.addColorStop(1, '#151d2c');
            ctx.fillStyle = grad;

            ctx.beginPath();
            ctx.moveTo(0, 360);
            ctx.quadraticCurveTo(400, 230, 800, 260);
            ctx.quadraticCurveTo(1200, 220, 1600, 270);
            ctx.lineTo(1600, 360);
            ctx.closePath();
            ctx.fill();
            scene.textures.addCanvas('dune_far', canvas);
        }

        // Dunes Far Dusk (Warm Golden Desert Ridge for Sunset/Station/Convoy)
        if (!scene.textures.exists('dune_far_dusk')) {
            const canvas = document.createElement('canvas');
            canvas.width = 1600;
            canvas.height = 360;
            const ctx = canvas.getContext('2d');
            const grad = ctx.createLinearGradient(0, 190, 0, 360);
            grad.addColorStop(0, '#d89b5a');
            grad.addColorStop(0.55, '#b97b3f');
            grad.addColorStop(1, '#8c5728');
            ctx.fillStyle = grad;

            ctx.beginPath();
            ctx.moveTo(0, 360);
            ctx.quadraticCurveTo(380, 215, 800, 255);
            ctx.quadraticCurveTo(1220, 205, 1600, 265);
            ctx.lineTo(1600, 360);
            ctx.closePath();
            ctx.fill();
            scene.textures.addCanvas('dune_far_dusk', canvas);
        }

        // Dunes Mid
        if (!scene.textures.exists('dune_mid')) {
            const canvas = document.createElement('canvas');
            canvas.width = 1600;
            canvas.height = 300;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#aa773d';
            ctx.beginPath();
            ctx.moveTo(0, 300);
            ctx.quadraticCurveTo(420, 70, 880, 180);
            ctx.quadraticCurveTo(1280, 50, 1600, 200);
            ctx.lineTo(1600, 300);
            ctx.closePath();
            ctx.fill();
            scene.textures.addCanvas('dune_mid', canvas);
        }

        // Playable Ground Fallback
        if (!scene.textures.exists('ground_sand') || !scene.textures.exists('trench_ground')) {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 96;
            const ctx = canvas.getContext('2d');
            const g = ctx.createLinearGradient(0, 0, 0, 96);
            g.addColorStop(0, '#cfa462');
            g.addColorStop(0.3, '#b48545');
            g.addColorStop(1, '#66471e');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, 512, 96);
            scene.textures.addCanvas('ground_sand', canvas);
            scene.textures.addCanvas('trench_ground', canvas);
        }

        // Jaisalmer Sandstone Platform (Station Flooring & Lower Ballast Rail Track)
        if (!scene.textures.exists('station_platform')) {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 96;
            const ctx = canvas.getContext('2d');

            // Top sandstone paving apron (y = 0..64)
            const g = ctx.createLinearGradient(0, 0, 0, 64);
            g.addColorStop(0, '#cbb490');
            g.addColorStop(0.18, '#b6894b');
            g.addColorStop(1, '#7c5627');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, 512, 64);

            // Subtle stone slab seams
            ctx.strokeStyle = 'rgba(55, 34, 12, 0.32)';
            ctx.lineWidth = 1.5;
            for (let x = 0; x < 512; x += 64) {
                ctx.beginPath();
                ctx.moveTo(x, 10);
                ctx.lineTo(x, 62);
                ctx.stroke();
            }

            // Platform Coping Edge + Weathered Safety Stripe (top lip y = 0..9)
            ctx.fillStyle = '#ddd3c0';
            ctx.fillRect(0, 0, 512, 5);
            ctx.fillStyle = '#d4a347';
            ctx.fillRect(0, 5, 512, 4);
            ctx.fillStyle = 'rgba(35, 22, 10, 0.45)';
            ctx.fillRect(0, 9, 512, 2);

            // Foreground Railway Ballast Bed & Steel Track (y = 64..96)
            const ballastGrad = ctx.createLinearGradient(0, 64, 0, 96);
            ballastGrad.addColorStop(0, '#4d3d2f');
            ballastGrad.addColorStop(1, '#261d15');
            ctx.fillStyle = ballastGrad;
            ctx.fillRect(0, 64, 512, 32);

            // Timber sleepers along foreground track
            ctx.fillStyle = '#3b2414';
            for (let sx = 8; sx < 512; sx += 36) {
                ctx.fillRect(sx, 74, 18, 14);
            }
            // Twin steel rails
            ctx.fillStyle = '#8b939c';
            ctx.fillRect(0, 72, 512, 3);
            ctx.fillStyle = '#5a626b';
            ctx.fillRect(0, 84, 512, 3);

            scene.textures.addCanvas('station_platform', canvas);
        }

        // Station Arch
        if (!scene.textures.exists('station_arch')) {
            const canvas = document.createElement('canvas');
            canvas.width = 400;
            canvas.height = 320;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#d49b38';
            ctx.fillRect(20, 40, 48, 280);
            ctx.fillRect(332, 40, 48, 280);
            ctx.beginPath();
            ctx.moveTo(20, 100);
            ctx.quadraticCurveTo(80, 20, 200, 20);
            ctx.quadraticCurveTo(320, 20, 380, 100);
            ctx.lineTo(380, 0);
            ctx.lineTo(20, 0);
            ctx.closePath();
            ctx.fill();
            scene.textures.addCanvas('station_arch', canvas);
        }
    }

    // ==========================================
    // 2. HAVILDAR DEVRATH SINGH MULTIPLE ANIMATIONS & 7.62mm 1A1 SLR RIFLE
    // (Matches exact user image: Peaked Military Cap with Golden Crest, Mustache, Olive Uniform & Real SLR)
    // ==========================================
    static generateDevrathAnimations(scene) {
        const createDevrathFrame = (animType) => {
            const canvas = document.createElement('canvas');
            canvas.width = 110;
            canvas.height = 125;
            const ctx = canvas.getContext('2d');
            const cx = 50;
            const cy = 82;

            // Colors matching user's uploaded painting:
            const oliveTunic = '#485427';
            const oliveTrousers = '#38421d';
            const skinTone = '#c68b59';
            const capGreen = '#485427';
            const capVisor = '#111111';
            const goldEmblem = '#ffd166';
            const mustacheColor = '#111111';
            const slrWood = '#5a3518';
            const slrSteel = '#1c2127';

            // ---- 1. LEGS & BOOTS ----
            ctx.fillStyle = oliveTrousers;

            if (animType === 'walk_1') {
                ctx.fillRect(cx - 15, cy, 11, 30);
                ctx.fillRect(cx + 4, cy - 6, 11, 24);
            } else if (animType === 'walk_2') {
                ctx.fillRect(cx - 8, cy, 11, 28);
                ctx.fillRect(cx + 2, cy, 11, 28);
            } else if (animType === 'walk_3') {
                ctx.fillRect(cx - 4, cy - 6, 11, 24);
                ctx.fillRect(cx + 7, cy, 11, 30);
            } else if (animType === 'walk_4') {
                ctx.fillRect(cx - 8, cy, 11, 28);
                ctx.fillRect(cx + 1, cy, 11, 28);
            } else if (animType === 'run_1') {
                ctx.fillRect(cx - 20, cy + 2, 11, 28);
                ctx.fillRect(cx + 8, cy - 10, 11, 22);
            } else if (animType === 'run_2') {
                ctx.fillRect(cx - 10, cy, 11, 28);
                ctx.fillRect(cx + 3, cy - 4, 11, 26);
            } else if (animType === 'run_3') {
                ctx.fillRect(cx - 6, cy - 10, 11, 22);
                ctx.fillRect(cx + 12, cy + 2, 11, 28);
            } else if (animType === 'run_4') {
                ctx.fillRect(cx - 2, cy - 4, 11, 26);
                ctx.fillRect(cx + 6, cy, 11, 28);
            } else if (animType === 'jump') {
                ctx.fillRect(cx - 16, cy - 8, 11, 20);
                ctx.fillRect(cx + 6, cy - 12, 11, 18);
            } else if (animType === 'crouch') {
                ctx.fillRect(cx - 18, cy + 8, 14, 18);
                ctx.fillRect(cx + 4, cy + 12, 14, 14);
            } else if (animType === 'fight_2') {
                // Lunge forward stance
                ctx.fillRect(cx - 22, cy + 2, 12, 28);
                ctx.fillRect(cx + 12, cy - 4, 12, 26);
            } else { // idle / aim / shoot / fight_1 / carry
                ctx.fillRect(cx - 13, cy, 11, 29);
                ctx.fillRect(cx + 3, cy, 11, 29);
            }

            // Black Officer Boots
            ctx.fillStyle = '#0f1114';
            ctx.fillRect(cx - 16, cy + 26, 15, 9);
            ctx.fillRect(cx + 3, cy + 26, 15, 9);

            // ---- 2. TORSO (Olive Uniform Tunic with Golden Buttons) ----
            ctx.fillStyle = oliveTunic;
            const torsoYOffset = (animType === 'crouch') ? 10 : 0;
            const leanForward = (animType.startsWith('run_') || animType === 'fight_2') ? 4 : 0;

            ctx.fillRect(cx - 16 + leanForward, cy - 38 + torsoYOffset, 32, 40);

            // Shoulder Epaulettes
            ctx.fillStyle = '#3a441e';
            ctx.fillRect(cx - 18 + leanForward, cy - 38 + torsoYOffset, 36, 5);

            // Golden Buttons & Service Ribbons (From the painting)
            ctx.fillStyle = goldEmblem;
            for (let b = 0; b < 3; b++) {
                ctx.beginPath();
                ctx.arc(cx + leanForward, cy - 30 + b * 9 + torsoYOffset, 2, 0, Math.PI * 2);
                ctx.fill();
            }

            // Ribbons on chest pocket (Tricolor / Medals)
            ctx.fillStyle = '#ff9f1c';
            ctx.fillRect(cx + 3 + leanForward, cy - 32 + torsoYOffset, 4, 3);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(cx + 7 + leanForward, cy - 32 + torsoYOffset, 4, 3);
            ctx.fillStyle = '#2a9d8f';
            ctx.fillRect(cx + 11 + leanForward, cy - 32 + torsoYOffset, 4, 3);

            // Black Leather Belt with Brass Buckle & Holster
            ctx.fillStyle = '#111';
            ctx.fillRect(cx - 16 + leanForward, cy - 5 + torsoYOffset, 32, 7);
            ctx.fillStyle = goldEmblem;
            ctx.fillRect(cx - 4 + leanForward, cy - 6 + torsoYOffset, 8, 9);

            // Ammo Pouch on side
            ctx.fillStyle = '#222';
            ctx.fillRect(cx - 18 + leanForward, cy - 4 + torsoYOffset, 6, 8);

            // ---- 3. HEAD, MUSTACHE & PEAKED MILITARY CAP ----
            const headY = cy - 48 + torsoYOffset;
            const headX = cx + leanForward;

            // Face
            ctx.fillStyle = skinTone;
            ctx.beginPath();
            ctx.arc(headX, headY, 12, 0, Math.PI * 2);
            ctx.fill();

            // Bold Handlebar Mustache (Exactly from user's painting!)
            ctx.fillStyle = mustacheColor;
            ctx.beginPath();
            ctx.moveTo(headX - 10, headY + 5);
            ctx.quadraticCurveTo(headX, headY + 2, headX + 10, headY + 5);
            ctx.quadraticCurveTo(headX + 13, headY + 2, headX + 12, headY);
            ctx.quadraticCurveTo(headX, headY + 6, headX - 12, headY);
            ctx.closePath();
            ctx.fill();

            // Eyes & Brows
            ctx.fillStyle = '#111';
            ctx.fillRect(headX - 6, headY - 3, 3, 2);
            ctx.fillRect(headX + 3, headY - 3, 3, 2);
            ctx.fillRect(headX - 8, headY - 6, 6, 2);
            ctx.fillRect(headX + 2, headY - 6, 6, 2);

            // Peaked Military Officer Cap (From user's painting)
            // Visor (Black leather peak)
            ctx.fillStyle = capVisor;
            ctx.beginPath();
            ctx.ellipse(headX + 3, headY - 11, 16, 5, 0.1, 0, Math.PI * 2);
            ctx.fill();

            // Cap Crown (Olive green top)
            ctx.fillStyle = capGreen;
            ctx.beginPath();
            ctx.moveTo(headX - 14, headY - 12);
            ctx.quadraticCurveTo(headX, headY - 24, headX + 16, headY - 12);
            ctx.lineTo(headX + 14, headY - 10);
            ctx.lineTo(headX - 14, headY - 10);
            ctx.closePath();
            ctx.fill();

            // Golden Ashoka State Emblem / Military Insignia on cap
            ctx.fillStyle = goldEmblem;
            ctx.beginPath();
            ctx.arc(headX, headY - 16, 3.5, 0, Math.PI * 2);
            ctx.fill();

            // Golden Cap Band
            ctx.strokeStyle = goldEmblem;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(headX - 13, headY - 11);
            ctx.lineTo(headX + 15, headY - 11);
            ctx.stroke();

            // ---- 4. REAL 7.62mm 1A1 SLR RIFLE & ARMS ----
            const drawSLR = (rx, ry, angle, isShooting) => {
                ctx.save();
                ctx.translate(rx, ry);
                ctx.rotate(angle);

                // Wooden Buttstock
                ctx.fillStyle = slrWood;
                ctx.beginPath();
                ctx.moveTo(-24, 6);
                ctx.lineTo(-4, 2);
                ctx.lineTo(-4, -4);
                ctx.lineTo(-24, -2);
                ctx.closePath();
                ctx.fill();

                // Steel Receiver & Bolt
                ctx.fillStyle = slrSteel;
                ctx.fillRect(-4, -5, 26, 8);

                // 20-Round Box Magazine sticking down
                ctx.fillStyle = '#111';
                ctx.fillRect(6, 3, 7, 14);

                // Wooden Foregrip / Handguard
                ctx.fillStyle = slrWood;
                ctx.fillRect(22, -4, 24, 6);

                // Steel Barrel & Flash Suppressor
                ctx.fillStyle = slrSteel;
                ctx.fillRect(46, -3, 26, 4); // Long rifle barrel
                // Flash Hider
                ctx.fillRect(72, -4, 6, 6);
                // Front Sight Post
                ctx.fillRect(66, -7, 2, 4);

                // Muzzle Flash if shooting!
                if (isShooting) {
                    ctx.fillStyle = '#ffd166';
                    ctx.shadowColor = '#ff5400';
                    ctx.shadowBlur = 16;
                    ctx.beginPath();
                    ctx.moveTo(78, -1);
                    ctx.lineTo(98, -10);
                    ctx.lineTo(92, -1);
                    ctx.lineTo(104, 0);
                    ctx.lineTo(92, 2);
                    ctx.lineTo(98, 9);
                    ctx.closePath();
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }

                ctx.restore();
            };

            // Arm & Rifle Pose Variations
            ctx.fillStyle = oliveTunic;

            if (animType === 'aim' || animType === 'shoot') {
                // Two-handed shouldered rifle aiming pose
                drawSLR(headX + 10, headY + 12, 0, animType === 'shoot');

                // Arms supporting rifle
                ctx.fillRect(headX - 6, headY + 10, 16, 6);
                ctx.fillRect(headX + 16, headY + 11, 14, 6);
            } else if (animType === 'fight_1') {
                // Rifle butt windup (drawn back)
                drawSLR(headX - 10, headY + 14, -0.6, false);
                ctx.fillRect(headX - 14, headY + 8, 14, 7);
                ctx.fillRect(headX + 4, headY + 12, 12, 7);
            } else if (animType === 'fight_2') {
                // Forward strike with rifle butt smash!
                drawSLR(headX + 18, headY + 12, 0.5, false);
                ctx.fillRect(headX, headY + 8, 22, 8);

                // Melee Swoosh trail
                ctx.strokeStyle = 'rgba(255, 209, 102, 0.7)';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(headX + 35, headY + 10, 25, -Math.PI * 0.3, Math.PI * 0.4);
                ctx.stroke();
            } else if (animType.startsWith('run_')) {
                // Low-ready tactical sprint angle (barrel angled forward-down)
                drawSLR(headX + 6, headY + 18, 0.45, false);
                ctx.fillRect(headX - 8, headY + 10, 16, 7);
                ctx.fillRect(headX + 8, headY + 14, 12, 7);
            } else if (animType === 'carry') {
                // Both arms extended holding crate
                ctx.fillRect(headX + 8, cy - 25, 20, 8);
                ctx.fillRect(headX - 2, cy - 20, 14, 8);
            } else {
                // Idle & Walk: Rifle held diagonally across body / slung ready
                drawSLR(headX + 4, headY + 16, -0.4, false);
                ctx.fillRect(headX - 10, headY + 10, 8, 20);
                ctx.fillRect(headX + 6, headY + 12, 8, 18);
            }

            return canvas;
        };

        const animations = [
            'idle',
            'walk_1', 'walk_2', 'walk_3', 'walk_4',
            'run_1', 'run_2', 'run_3', 'run_4',
            'jump', 'crouch',
            'aim', 'shoot',
            'fight_1', 'fight_2',
            'carry'
        ];

        animations.forEach(anim => {
            scene.textures.remove(`devrath_${anim}`); // refresh with high quality
            scene.textures.addCanvas(`devrath_${anim}`, createDevrathFrame(anim));
        });
    }

    // ==========================================
    // 3. NPCS (MAJOR CHANDPURI, MP OFFICER, ETC.)
    // ==========================================
    static generateNPCs(scene) {
        // Major Kuldip Singh Chandpuri (Maha Vir Chakra - 23 Punjab Regiment CO)
        if (!scene.textures.exists('npc_chandpuri')) {
            const canvas = document.createElement('canvas');
            canvas.width = 80;
            canvas.height = 115;
            const ctx = canvas.getContext('2d');
            const cx = 40, cy = 76;

            // Legs & Boots
            ctx.fillStyle = '#343e1d';
            ctx.fillRect(cx - 12, cy, 10, 28);
            ctx.fillRect(cx + 2, cy, 10, 28);
            ctx.fillStyle = '#111';
            ctx.fillRect(cx - 14, cy + 24, 13, 8);
            ctx.fillRect(cx + 2, cy + 24, 13, 8);

            // Torso (Heavy Olive Indian Army Winter Sweater & Uniform)
            ctx.fillStyle = '#414e24';
            ctx.fillRect(cx - 16, cy - 38, 32, 40);

            // Red Major rank collar tabs
            ctx.fillStyle = '#d90429';
            ctx.fillRect(cx - 12, cy - 38, 5, 8);
            ctx.fillRect(cx + 7, cy - 38, 5, 8);

            // Ashoka Lion Insignia on epaulettes
            ctx.fillStyle = '#ffd166';
            ctx.beginPath();
            ctx.arc(cx - 10, cy - 36, 2, 0, Math.PI * 2);
            ctx.arc(cx + 10, cy - 36, 2, 0, Math.PI * 2);
            ctx.fill();

            // Medals & Ribbons on chest (Maha Vir Chakra ribbons)
            ctx.fillStyle = '#ff9f1c';
            ctx.fillRect(cx - 10, cy - 28, 4, 3);
            ctx.fillStyle = '#2a9d8f';
            ctx.fillRect(cx - 6, cy - 28, 4, 3);
            ctx.fillStyle = '#e76f51';
            ctx.fillRect(cx - 2, cy - 28, 4, 3);

            // Leather Sam Browne cross belt & holster
            ctx.fillStyle = '#1a140d';
            ctx.fillRect(cx - 16, cy - 4, 32, 6);
            ctx.beginPath();
            ctx.moveTo(cx - 14, cy - 38);
            ctx.lineTo(cx + 8, cy - 4);
            ctx.lineWidth = 4;
            ctx.strokeStyle = '#1a140d';
            ctx.stroke();

            // Face
            ctx.fillStyle = '#c68b59';
            ctx.beginPath();
            ctx.arc(cx, cy - 48, 12, 0, Math.PI * 2);
            ctx.fill();

            // Full Sikh Beard & Mustache
            ctx.fillStyle = '#111111';
            ctx.beginPath();
            ctx.arc(cx, cy - 44, 10, 0, Math.PI);
            ctx.fill();
            ctx.fillRect(cx - 8, cy - 46, 16, 4);

            // Eyes
            ctx.fillStyle = '#111';
            ctx.fillRect(cx - 6, cy - 50, 3, 2);
            ctx.fillRect(cx + 3, cy - 50, 3, 2);

            // Signature Sikh Dastaar / Turban (Navy Blue / Olive with golden crest)
            ctx.fillStyle = '#1c2638';
            ctx.beginPath();
            ctx.ellipse(cx, cy - 58, 16, 13, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffd166';
            ctx.beginPath();
            ctx.arc(cx, cy - 58, 3, 0, Math.PI * 2);
            ctx.fill();

            scene.textures.addCanvas('npc_chandpuri', canvas);
        }

        // BSF Naik Bhairon Singh (Sena Medal - Tanot Defense Hero)
        if (!scene.textures.exists('npc_bhairon_singh')) {
            const canvas = document.createElement('canvas');
            canvas.width = 80;
            canvas.height = 115;
            const ctx = canvas.getContext('2d');
            const cx = 40, cy = 76;

            // BSF Sand / Khaki Uniform trousers
            ctx.fillStyle = '#8b7348';
            ctx.fillRect(cx - 12, cy, 10, 28);
            ctx.fillRect(cx + 2, cy, 10, 28);
            ctx.fillStyle = '#111';
            ctx.fillRect(cx - 14, cy + 24, 13, 8);
            ctx.fillRect(cx + 2, cy + 24, 13, 8);

            // Torso (BSF Khaki Shirt)
            ctx.fillStyle = '#aa8f5b';
            ctx.fillRect(cx - 15, cy - 38, 30, 40);

            // MMG Ammunition Belt slung diagonally across chest!
            ctx.strokeStyle = '#ffd166';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(cx - 14, cy - 36);
            ctx.lineTo(cx + 12, cy - 2);
            ctx.stroke();

            // Belt & Pouches
            ctx.fillStyle = '#222';
            ctx.fillRect(cx - 15, cy - 4, 30, 6);

            // Face
            ctx.fillStyle = '#c68b59';
            ctx.beginPath();
            ctx.arc(cx, cy - 48, 12, 0, Math.PI * 2);
            ctx.fill();

            // Signature Rajasthani Handlebar Mustache
            ctx.fillStyle = '#111';
            ctx.beginPath();
            ctx.moveTo(cx - 10, cy - 44);
            ctx.quadraticCurveTo(cx, cy - 46, cx + 10, cy - 44);
            ctx.quadraticCurveTo(cx + 12, cy - 47, cx + 11, cy - 49);
            ctx.quadraticCurveTo(cx, cy - 44, cx - 11, cy - 49);
            ctx.closePath();
            ctx.fill();

            // Maroon BSF Military Beret tilted proudly
            ctx.fillStyle = '#6b1824';
            ctx.beginPath();
            ctx.ellipse(cx + 3, cy - 56, 16, 7, 0.2, 0, Math.PI * 2);
            ctx.fill();
            // Golden BSF Insignia badge
            ctx.fillStyle = '#ffd166';
            ctx.beginPath();
            ctx.arc(cx - 4, cy - 55, 2.5, 0, Math.PI * 2);
            ctx.fill();

            // SLR / MMG held at hip
            ctx.fillStyle = '#1c2127';
            ctx.fillRect(cx + 10, cy - 25, 6, 32);

            scene.textures.addCanvas('npc_bhairon_singh', canvas);
        }

        // 2Lt Dharam Veer (Punjab Regiment - Forward Observation Officer)
        if (!scene.textures.exists('npc_dharamveer')) {
            const canvas = document.createElement('canvas');
            canvas.width = 80;
            canvas.height = 115;
            const ctx = canvas.getContext('2d');
            const cx = 40, cy = 76;

            // Punjab Regiment Olive uniform
            ctx.fillStyle = '#343e1d';
            ctx.fillRect(cx - 12, cy, 10, 28);
            ctx.fillRect(cx + 2, cy, 10, 28);
            ctx.fillStyle = '#111';
            ctx.fillRect(cx - 14, cy + 24, 13, 8);
            ctx.fillRect(cx + 2, cy + 24, 13, 8);

            ctx.fillStyle = '#445226';
            ctx.fillRect(cx - 15, cy - 38, 30, 40);

            // Dual Military Field Binoculars at chest
            ctx.fillStyle = '#1a1f16';
            ctx.fillRect(cx - 8, cy - 22, 16, 12);
            ctx.fillStyle = '#7da2a9';
            ctx.beginPath();
            ctx.arc(cx - 4, cy - 14, 3, 0, Math.PI * 2);
            ctx.arc(cx + 4, cy - 14, 3, 0, Math.PI * 2);
            ctx.fill();

            // Face
            ctx.fillStyle = '#c68b59';
            ctx.beginPath();
            ctx.arc(cx, cy - 48, 12, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#111';
            ctx.fillRect(cx - 6, cy - 45, 12, 3); // Mustache

            // Officer Peaked Cap
            ctx.fillStyle = '#111';
            ctx.beginPath();
            ctx.ellipse(cx + 2, cy - 56, 15, 5, 0.1, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#445226';
            ctx.beginPath();
            ctx.moveTo(cx - 13, cy - 57);
            ctx.quadraticCurveTo(cx, cy - 67, cx + 15, cy - 57);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#ffd166';
            ctx.beginPath();
            ctx.arc(cx, cy - 60, 2.5, 0, Math.PI * 2);
            ctx.fill();

            scene.textures.addCanvas('npc_dharamveer', canvas);
        }

        // MP Officer
        if (!scene.textures.exists('npc_mp_officer')) {
            const canvas = document.createElement('canvas');
            canvas.width = 80;
            canvas.height = 110;
            const ctx = canvas.getContext('2d');
            const cx = 40, cy = 72;

            ctx.fillStyle = '#343a18';
            ctx.fillRect(cx - 10, cy, 9, 27);
            ctx.fillRect(cx + 3, cy, 9, 27);

            ctx.fillStyle = '#424a21';
            ctx.fillRect(cx - 14, cy - 36, 28, 38);

            ctx.fillStyle = '#d90429';
            ctx.fillRect(cx - 15, cy - 25, 7, 10);

            ctx.fillStyle = '#b27a4d';
            ctx.beginPath();
            ctx.arc(cx, cy - 46, 11, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#222';
            ctx.fillRect(cx - 14, cy - 56, 28, 8);
            ctx.fillRect(cx - 8, cy - 64, 16, 9);

            scene.textures.addCanvas('npc_mp_officer', canvas);
        }

        // Station Chaiwala (Ramu Chaiwala - Kurta, Nehru Vest, Rajasthani Pagdi & Brass Tea Kettle)
        if (!scene.textures.exists('npc_chaiwala')) {
            const canvas = document.createElement('canvas');
            canvas.width = 86;
            canvas.height = 112;
            const ctx = canvas.getContext('2d');
            const cx = 42, cy = 74;

            // Ground shadow
            ctx.fillStyle = 'rgba(20, 10, 5, 0.35)';
            ctx.beginPath();
            ctx.ellipse(cx, cy + 29, 18, 5, 0, 0, Math.PI * 2);
            ctx.fill();

            // Dhoti / Loose Pyjama Legs & Simple Chappals
            ctx.fillStyle = '#e5dccb';
            ctx.fillRect(cx - 11, cy, 9, 25);
            ctx.fillRect(cx + 2, cy, 9, 25);
            ctx.fillStyle = '#4a3220';
            ctx.fillRect(cx - 12, cy + 24, 11, 5);
            ctx.fillRect(cx + 1, cy + 24, 11, 5);

            // White Kurta Sleeves & Body
            ctx.fillStyle = '#f4ede1';
            ctx.fillRect(cx - 14, cy - 35, 28, 37);

            // Brown Khadi/Woolen Nehru Waistcoat
            ctx.fillStyle = '#5c4028';
            ctx.fillRect(cx - 13, cy - 34, 26, 30);
            // Open front cream kurta strip
            ctx.fillStyle = '#f4ede1';
            ctx.fillRect(cx - 3, cy - 34, 6, 30);

            // Towel / Gamchha draped on shoulder
            ctx.fillStyle = '#c84b31';
            ctx.fillRect(cx - 13, cy - 35, 6, 20);
            ctx.fillStyle = '#f4ede1';
            ctx.fillRect(cx - 13, cy - 19, 6, 3);

            // Head & Warm Rajasthani Complexion
            ctx.fillStyle = '#b7794a';
            ctx.beginPath();
            ctx.arc(cx, cy - 45, 10.5, 0, Math.PI * 2);
            ctx.fill();

            // Mustache
            ctx.fillStyle = '#1f1612';
            ctx.fillRect(cx - 6, cy - 42, 12, 2.5);

            // Traditional Marwari Saffron/Cream Pagdi (Turban)
            ctx.fillStyle = '#e07a2d';
            ctx.beginPath();
            ctx.ellipse(cx, cy - 55, 14, 7.5, -0.08, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#f2b755';
            ctx.beginPath();
            ctx.ellipse(cx - 2, cy - 58, 10, 4, 0.1, 0, Math.PI * 2);
            ctx.fill();

            // Extended Forearm Holding Brass Tea Kettle
            ctx.fillStyle = '#f4ede1';
            ctx.fillRect(cx + 12, cy - 26, 12, 7);
            ctx.fillStyle = '#b7794a';
            ctx.fillRect(cx + 22, cy - 24, 6, 5);

            // Steaming Brass/Aluminium Tea Kettle
            ctx.fillStyle = '#b5b8bd';
            ctx.beginPath();
            ctx.arc(cx + 27, cy - 11, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#7f848c';
            ctx.fillRect(cx + 22, cy - 20, 10, 3);
            ctx.strokeStyle = '#6c727a';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(cx + 27, cy - 17, 5, Math.PI, 0);
            ctx.stroke();

            scene.textures.addCanvas('npc_chaiwala', canvas);
        }
    }

    // ==========================================
    // 4. PORTRAITS
    // ==========================================
    static generatePortraits(scene) {
        // Fallback canvas portraits if PNG files are not yet loaded
        const fallbackPortraits = [
            'devrath_happy', 'devrath_emotional', 'devrath_shocked',
            'devrath_sad', 'devrath_determined', 'devrath_alert', 'devrath_action',
            'chaiwala', 'letter_icon', 'speaker_icon', 'officer_shout',
            'mp_officer', 'gurdeep', 'major_radio', 'dharamveer',
            'major_chandpuri', 'bhairon_singh'
        ];

        fallbackPortraits.forEach(key => {
            if (!scene.textures.exists(key)) {
                const canvas = document.createElement('canvas');
                canvas.width = 100;
                canvas.height = 100;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#283618';
                ctx.fillRect(0, 0, 100, 100);
                ctx.strokeStyle = '#cda160';
                ctx.lineWidth = 3;
                ctx.strokeRect(1, 1, 98, 98);
                ctx.fillStyle = '#ffd166';
                ctx.font = 'bold 11px sans-serif';
                ctx.fillText(key, 10, 50);
                scene.textures.addCanvas(key, canvas);
            }
        });
    }

    // ==========================================
    // 5. VEHICLES & PROPS
    // ==========================================
    static generatePropsAndVehicles(scene) {
        // 1971 Indian Railways Steam Locomotive (Facing Right)
        if (!scene.textures.exists('train_steam_engine')) {
            const canvas = document.createElement('canvas');
            canvas.width = 460;
            canvas.height = 210;
            const ctx = canvas.getContext('2d');

            // Ground Track Shadow
            ctx.fillStyle = 'rgba(15, 10, 5, 0.45)';
            ctx.fillRect(10, 196, 440, 10);

            // Chassis Frame & Red Buffer Beam
            ctx.fillStyle = '#1b1f23';
            ctx.fillRect(18, 152, 412, 22);
            ctx.fillStyle = '#a8201a';
            ctx.fillRect(424, 148, 14, 28); // Front buffer plate
            ctx.fillRect(12, 150, 10, 24);  // Rear buffer coupling

            // Cowcatcher / Pilot Grille at front right
            ctx.fillStyle = '#2b3036';
            ctx.beginPath();
            ctx.moveTo(418, 168);
            ctx.lineTo(454, 198);
            ctx.lineTo(412, 198);
            ctx.closePath();
            ctx.fill();

            // Main Cylindrical Black Boiler & Smokebox
            const boilerGrad = ctx.createLinearGradient(0, 62, 0, 154);
            boilerGrad.addColorStop(0, '#343a40');
            boilerGrad.addColorStop(0.28, '#212529');
            boilerGrad.addColorStop(1, '#101316');
            ctx.fillStyle = boilerGrad;
            ctx.fillRect(125, 62, 275, 90);
            // Smokebox front nose
            ctx.beginPath();
            ctx.arc(400, 107, 45, -Math.PI * 0.5, Math.PI * 0.5);
            ctx.fill();

            // Polished Brass Boiler Rings & Conical Steam Dome
            ctx.fillStyle = '#d4a338';
            [185, 255, 325, 368].forEach(bx => ctx.fillRect(bx, 62, 5, 90));
            ctx.beginPath();
            ctx.arc(240, 62, 22, Math.PI, 0);
            ctx.fill();

            // Tall Flared Smokestack / Chimney (aligned at x = 355, top y = 12)
            ctx.fillStyle = '#171a1d';
            ctx.fillRect(343, 18, 24, 46);
            ctx.fillStyle = '#d4a338';
            ctx.fillRect(339, 14, 32, 6);

            // Warm Amber Headlight Lamp on Smokebox Front
            ctx.fillStyle = '#2d3338';
            ctx.fillRect(398, 52, 22, 18);
            ctx.fillStyle = '#ffe18c';
            ctx.beginPath();
            ctx.arc(420, 61, 7, 0, Math.PI * 2);
            ctx.fill();

            // Locomotive Crew Cab (Left, x = 18..126)
            ctx.fillStyle = '#252b30';
            ctx.fillRect(18, 34, 108, 120);
            ctx.fillStyle = '#a8201a'; // Indian Railways Cab Roof overhang
            ctx.fillRect(10, 26, 124, 10);

            // Glowing Amber Firebox Window in Crew Cab
            ctx.fillStyle = '#ff9f1c';
            ctx.fillRect(42, 52, 34, 28);
            ctx.strokeStyle = '#111';
            ctx.lineWidth = 3;
            ctx.strokeRect(42, 52, 34, 28);

            // Brass Heritage Numberplate & Stencil
            ctx.fillStyle = '#a8201a';
            ctx.fillRect(195, 98, 118, 22);
            ctx.strokeStyle = '#d4a338';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(195, 98, 118, 22);
            ctx.fillStyle = '#ffd166';
            ctx.font = 'bold 11px monospace';
            ctx.fillText("NR · WP 7061", 204, 113);

            // Running Footplate Crimson Trim
            ctx.fillStyle = '#b5231b';
            ctx.fillRect(122, 146, 290, 6);

            // Big Spoked Driving Wheels (y = 184, r = 22) + Front Bogie Wheels (r = 12)
            [170, 232, 294].forEach(wx => {
                ctx.fillStyle = '#121417';
                ctx.beginPath();
                ctx.arc(wx, 184, 22, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#a8201a';
                ctx.beginPath();
                ctx.arc(wx, 184, 16, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#d4d8dd';
                ctx.beginPath();
                ctx.arc(wx, 184, 5, 0, Math.PI * 2);
                ctx.fill();
            });
            // Connecting Piston Rod across Drivers
            ctx.fillStyle = '#c5ccd4';
            ctx.fillRect(166, 181, 165, 6);
            ctx.fillStyle = '#2d3339';
            ctx.fillRect(322, 166, 48, 22); // Cylinder chest

            // Rear Cab & Front Guiding Wheels
            [64, 108, 376, 408].forEach(wx => {
                ctx.fillStyle = '#121417';
                ctx.beginPath();
                ctx.arc(wx, 193, 13, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#7c241d';
                ctx.beginPath();
                ctx.arc(wx, 193, 8, 0, Math.PI * 2);
                ctx.fill();
            });

            scene.textures.addCanvas('train_steam_engine', canvas);
        }

        // 1971 Northern Railway Passenger Coach (Open Boarding Door at center x=210)
        if (!scene.textures.exists('train_coach')) {
            const canvas = document.createElement('canvas');
            canvas.width = 420;
            canvas.height = 195;
            const ctx = canvas.getContext('2d');

            // Curved Clerestory Metal Roof & Roof Vents
            ctx.fillStyle = '#495057';
            ctx.beginPath();
            ctx.roundRect(8, 24, 404, 22, [12, 12, 0, 0]);
            ctx.fill();
            ctx.fillStyle = '#2b3035';
            [70, 145, 275, 350].forEach(vx => ctx.fillRect(vx, 18, 16, 6));

            // Classic 1971 Indian Railways Maroon / Olive Livery Body
            const bodyGrad = ctx.createLinearGradient(0, 44, 0, 164);
            bodyGrad.addColorStop(0, '#5a1f1c');
            bodyGrad.addColorStop(1, '#3b1311');
            ctx.fillStyle = bodyGrad;
            ctx.fillRect(10, 44, 400, 120);

            // Warm Cream Window Band & Mustard Stripe
            ctx.fillStyle = '#e7d7b9';
            ctx.fillRect(10, 62, 400, 46);
            ctx.fillStyle = '#d4a338';
            ctx.fillRect(10, 114, 400, 4);

            // Warm Lit Compartment Windows with Security Bars
            [30, 82, 134, 256, 308, 356].forEach(wx => {
                ctx.fillStyle = '#f9c74f';
                ctx.fillRect(wx, 68, 34, 34);
                ctx.strokeStyle = '#3b2416';
                ctx.lineWidth = 2;
                ctx.strokeRect(wx, 68, 34, 34);
                // Iron bars
                ctx.fillStyle = '#4a3525';
                ctx.fillRect(wx, 82, 34, 2);
                ctx.fillRect(wx, 90, 34, 2);
            });

            // Open Center Boarding Doorway (x = 185..235)
            ctx.fillStyle = '#1f0d09';
            ctx.fillRect(184, 54, 52, 110);
            ctx.fillStyle = '#ffd166';
            ctx.globalAlpha = 0.25;
            ctx.fillRect(188, 58, 44, 102);
            ctx.globalAlpha = 1;
            ctx.strokeStyle = '#d4a338';
            ctx.lineWidth = 2;
            ctx.strokeRect(184, 54, 52, 110);
            // Brass door grab handles & boarding footsteps
            ctx.fillStyle = '#e0b354';
            ctx.fillRect(178, 86, 4, 42);
            ctx.fillRect(238, 86, 4, 42);
            ctx.fillStyle = '#6c757d';
            ctx.fillRect(182, 164, 56, 6);
            ctx.fillRect(186, 172, 48, 5);

            // Markings & Bogie Frames + Steel Wheels (y = 182, r = 12)
            ctx.fillStyle = '#f4e9cd';
            ctx.font = 'bold 9px monospace';
            ctx.fillText("N.R. 2nd CLASS · द्वितीय श्रेणी", 34, 138);
            ctx.fillStyle = '#1f2326';
            ctx.fillRect(6, 162, 408, 12);
            [48, 96, 324, 372].forEach(wx => {
                ctx.fillStyle = '#111417';
                ctx.beginPath();
                ctx.arc(wx, 182, 12, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#7d8590';
                ctx.beginPath();
                ctx.arc(wx, 182, 5, 0, Math.PI * 2);
                ctx.fill();
            });

            scene.textures.addCanvas('train_coach', canvas);
        }

        // Station Wooden Platform Bench (1971 Cast-Iron & Teak Wood)
        if (!scene.textures.exists('station_bench')) {
            const canvas = document.createElement('canvas');
            canvas.width = 120;
            canvas.height = 64;
            const ctx = canvas.getContext('2d');
            // Shadow
            ctx.fillStyle = 'rgba(20, 12, 4, 0.35)';
            ctx.beginPath();
            ctx.ellipse(60, 60, 52, 4, 0, 0, Math.PI * 2);
            ctx.fill();
            // Cast iron legs & armrests
            ctx.fillStyle = '#22282a';
            ctx.fillRect(18, 22, 6, 38);
            ctx.fillRect(96, 22, 6, 38);
            ctx.fillRect(14, 34, 92, 5);
            // Teak wooden backrest & seat planks
            ctx.fillStyle = '#8b5126';
            ctx.fillRect(12, 10, 96, 8);
            ctx.fillRect(12, 22, 96, 8);
            ctx.fillRect(10, 38, 100, 9);
            ctx.fillStyle = '#ab6b38';
            ctx.fillRect(12, 10, 96, 2);
            ctx.fillRect(10, 38, 100, 2);
            scene.textures.addCanvas('station_bench', canvas);
        }

        // Station Pendulum Pillar Clock & Timetable Stand
        if (!scene.textures.exists('station_clock')) {
            const canvas = document.createElement('canvas');
            canvas.width = 90;
            canvas.height = 190;
            const ctx = canvas.getContext('2d');
            // Cast iron base plinth & fluted post
            ctx.fillStyle = '#25312c';
            ctx.fillRect(28, 174, 34, 14);
            ctx.fillRect(39, 52, 12, 124);
            // Double-sided brass rim clock head
            ctx.fillStyle = '#3b2416';
            ctx.beginPath();
            ctx.arc(45, 34, 24, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#f8f1e0';
            ctx.beginPath();
            ctx.arc(45, 34, 19, 0, Math.PI * 2);
            ctx.fill();
            // Clock hands (5:40 PM)
            ctx.strokeStyle = '#1d1a16';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(45, 34); ctx.lineTo(45, 22);
            ctx.moveTo(45, 34); ctx.lineTo(54, 41);
            ctx.stroke();
            // Hanging wooden timetable board
            ctx.fillStyle = '#2d4a3e';
            ctx.fillRect(18, 92, 54, 32);
            ctx.strokeStyle = '#d4a338';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(18, 92, 54, 32);
            ctx.fillStyle = '#f8f1e0';
            ctx.font = 'bold 7px monospace';
            ctx.fillText("17:45 EXP", 25, 106);
            ctx.fillText("SHEKHAWATI", 23, 117);
            scene.textures.addCanvas('station_clock', canvas);
        }

        // Station PA Loudspeaker Horn Pole
        if (!scene.textures.exists('station_loudspeaker')) {
            const canvas = document.createElement('canvas');
            canvas.width = 80;
            canvas.height = 210;
            const ctx = canvas.getContext('2d');
            // Iron pole & base flange
            ctx.fillStyle = '#2c3531';
            ctx.fillRect(30, 196, 20, 10);
            ctx.fillRect(36, 26, 8, 172);
            // Red siren cap on top
            ctx.fillStyle = '#b5231b';
            ctx.beginPath();
            ctx.arc(40, 22, 6, 0, Math.PI * 2);
            ctx.fill();
            // Twin flaring PA speaker horns
            ctx.fillStyle = '#bfc5cc';
            ctx.beginPath();
            ctx.moveTo(36, 44); ctx.lineTo(10, 32); ctx.lineTo(10, 56); ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(44, 44); ctx.lineTo(70, 32); ctx.lineTo(70, 56); ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#495057';
            ctx.fillRect(10, 32, 3, 24);
            ctx.fillRect(67, 32, 3, 24);
            scene.textures.addCanvas('station_loudspeaker', canvas);
        }

        // Vintage Station Platform Lantern Post
        if (!scene.textures.exists('station_lamp')) {
            const canvas = document.createElement('canvas');
            canvas.width = 70;
            canvas.height = 220;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#232e29';
            ctx.fillRect(24, 204, 22, 10);
            ctx.fillRect(32, 42, 6, 164);
            // Ornate iron top bracket
            ctx.fillRect(26, 40, 18, 5);
            // Glowing lantern globe
            ctx.fillStyle = '#ffd166';
            ctx.beginPath();
            ctx.arc(35, 28, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#232e29';
            ctx.beginPath();
            ctx.moveTo(22, 22); ctx.lineTo(48, 22); ctx.lineTo(35, 11); ctx.closePath();
            ctx.fill();
            scene.textures.addCanvas('station_lamp', canvas);
        }

        // Station Wooden Chai Stall ("गरम चाय · CHAI")
        if (!scene.textures.exists('station_tea_stall')) {
            const canvas = document.createElement('canvas');
            canvas.width = 140;
            canvas.height = 110;
            const ctx = canvas.getContext('2d');
            // Canopy posts & striped cloth roof
            ctx.fillStyle = '#5c3a21';
            ctx.fillRect(12, 14, 6, 94);
            ctx.fillRect(122, 14, 6, 94);
            ctx.fillStyle = '#a83226';
            ctx.fillRect(4, 6, 132, 14);
            ctx.fillStyle = '#f4e9cd';
            for (let x = 8; x < 130; x += 22) ctx.fillRect(x, 6, 11, 14);
            // Wooden Counter Box
            ctx.fillStyle = '#7c4c26';
            ctx.fillRect(10, 62, 120, 44);
            ctx.fillStyle = '#a06839';
            ctx.fillRect(6, 58, 128, 7);
            // Brass Tea Samovar Boiler + Glass Biscuit Jar + Stacked Kulhads
            ctx.fillStyle = '#d4a338';
            ctx.fillRect(26, 36, 22, 22);
            ctx.fillStyle = '#ffd166';
            ctx.fillRect(24, 34, 26, 4);
            ctx.fillStyle = '#c47943'; // Kulhad stack
            ctx.fillRect(62, 48, 12, 10);
            ctx.fillRect(78, 48, 12, 10);
            ctx.fillStyle = 'rgba(235, 245, 255, 0.65)'; // Cookie jar
            ctx.fillRect(102, 40, 18, 18);
            // Board text
            ctx.fillStyle = '#ffd166';
            ctx.font = 'bold 11px sans-serif';
            ctx.fillText("गरम चाय · CHAI", 28, 86);
            scene.textures.addCanvas('station_tea_stall', canvas);
        }

        // Willys / Jonga Jeep (Station MP Pickup fallback)
        if (!scene.textures.exists('military_jeep') || !scene.textures.exists('jonga_jeep')) {
            const canvas = document.createElement('canvas');
            canvas.width = 180;
            canvas.height = 95;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'rgba(20, 15, 5, 0.38)';
            ctx.beginPath();
            ctx.ellipse(90, 86, 74, 5, 0, 0, Math.PI * 2);
            ctx.fill();
            // Canvas Soft-Top Canopy & Roll Frame
            ctx.fillStyle = '#585b3a';
            ctx.beginPath();
            ctx.roundRect(45, 16, 86, 26, [8, 8, 0, 0]);
            ctx.fill();
            ctx.fillStyle = '#b9c9d4';
            ctx.fillRect(114, 21, 14, 15);
            // Main Olive Chassis & Hood
            ctx.fillStyle = '#3d4720';
            ctx.fillRect(20, 38, 136, 30);
            ctx.fillRect(118, 42, 42, 26);
            ctx.fillStyle = '#ffe599';
            ctx.beginPath();
            ctx.arc(158, 52, 4.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 14px sans-serif';
            ctx.fillText("★", 64, 58);
            // Deep-Tread Wheels
            [48, 128].forEach(wx => {
                ctx.fillStyle = '#141618';
                ctx.beginPath();
                ctx.arc(wx, 70, 17, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#686e75';
                ctx.beginPath();
                ctx.arc(wx, 70, 7, 0, Math.PI * 2);
                ctx.fill();
            });
            scene.textures.addCanvas('military_jeep', canvas);
            scene.textures.addCanvas('jonga_jeep', canvas);
        }

        // Shaktiman 4x4 Military Convoy Truck
        if (!scene.textures.exists('military_truck')) {
            const canvas = document.createElement('canvas');
            canvas.width = 280;
            canvas.height = 140;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'rgba(20, 15, 5, 0.38)';
            ctx.beginPath();
            ctx.ellipse(140, 126, 122, 6, 0, 0, Math.PI * 2);
            ctx.fill();
            // Canvas Troop Bed Cover
            ctx.fillStyle = '#747551';
            ctx.beginPath();
            ctx.roundRect(86, 16, 178, 72, 10);
            ctx.fill();
            ctx.strokeStyle = 'rgba(35, 38, 20, 0.45)';
            ctx.lineWidth = 2;
            [125, 165, 205].forEach(rx => {
                ctx.beginPath();
                ctx.moveTo(rx, 18); ctx.lineTo(rx, 88); ctx.stroke();
            });
            // Olive Steel Cab & Truck Chassis Bed
            ctx.fillStyle = '#3b451f';
            ctx.fillRect(22, 40, 68, 48);
            ctx.fillRect(16, 86, 250, 14);
            ctx.fillStyle = '#a8bec9';
            ctx.fillRect(28, 46, 30, 18); // Cab windshield
            // Heavy Truck Wheels
            [56, 158, 224].forEach(wx => {
                ctx.fillStyle = '#121417';
                ctx.beginPath();
                ctx.arc(wx, 108, 19, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#5c6269';
                ctx.beginPath();
                ctx.arc(wx, 108, 8, 0, Math.PI * 2);
                ctx.fill();
            });
            scene.textures.addCanvas('military_truck', canvas);
        }

        // Realistic High-Detail Stacked Sandbag Defensive Wall
        if (!scene.textures.exists('sandbag_wall')) {
            const canvas = document.createElement('canvas');
            canvas.width = 160;
            canvas.height = 75;
            const ctx = canvas.getContext('2d');

            const drawBag = (bx, by, bw, bh) => {
                // Ground / underlying contact shadow
                ctx.fillStyle = 'rgba(40, 28, 12, 0.65)';
                ctx.beginPath();
                ctx.ellipse(bx + bw / 2, by + bh - 2, bw / 2, bh / 3, 0, 0, Math.PI * 2);
                ctx.fill();

                // Main Burlap Sack Body (Khaki burlap gradient)
                const grad = ctx.createLinearGradient(bx, by, bx, by + bh);
                grad.addColorStop(0, '#cca978');
                grad.addColorStop(0.35, '#b49261');
                grad.addColorStop(1, '#785f39');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.roundRect(bx, by, bw, bh, 7);
                ctx.fill();

                // Fabric fold highlights & seams
                ctx.strokeStyle = 'rgba(255, 240, 210, 0.45)';
                ctx.lineWidth = 1.4;
                ctx.beginPath();
                ctx.moveTo(bx + 6, by + 4);
                ctx.quadraticCurveTo(bx + bw / 2, by + 2, bx + bw - 6, by + 4);
                ctx.stroke();

                // Tied ear knots at bag corners
                ctx.fillStyle = '#594426';
                ctx.beginPath();
                ctx.arc(bx + 2.5, by + bh / 2, 2.5, 0, Math.PI * 2);
                ctx.arc(bx + bw - 2.5, by + bh / 2, 2.5, 0, Math.PI * 2);
                ctx.fill();
            };

            // Staggered Interlocking Rows of Sandbags
            // Row 1 (Bottom, Y=44): 4 bags
            for (let i = 0; i < 4; i++) {
                drawBag(4 + i * 38, 44, 38, 26);
            }
            // Row 2 (Middle, Y=26): 3 bags
            for (let i = 0; i < 3; i++) {
                drawBag(22 + i * 39, 26, 38, 25);
            }
            // Row 3 (Top, Y=8): 3 bags
            for (let i = 0; i < 3; i++) {
                drawBag(25 + i * 37, 8, 36, 24);
            }

            scene.textures.addCanvas('sandbag_wall', canvas);
        }

        // Realistic Single Bulk Sandbag
        if (!scene.textures.exists('sandbag_single')) {
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 36;
            const ctx = canvas.getContext('2d');

            const grad = ctx.createLinearGradient(0, 0, 0, 36);
            grad.addColorStop(0, '#d2b180');
            grad.addColorStop(0.4, '#b59364');
            grad.addColorStop(1, '#6d532f');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.roundRect(4, 6, 56, 24, 8);
            ctx.fill();

            // Stitch lines & tied knot
            ctx.strokeStyle = 'rgba(255, 245, 220, 0.5)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(10, 11);
            ctx.quadraticCurveTo(32, 8, 54, 11);
            ctx.stroke();

            ctx.fillStyle = '#47351d';
            ctx.beginPath();
            ctx.arc(6, 18, 3, 0, Math.PI * 2);
            ctx.fill();

            scene.textures.addCanvas('sandbag_single', canvas);
        }

        // Authentic Indian Army 1971 Heavy Ammo Crate
        if (!scene.textures.exists('ammo_crate') || !scene.textures.exists('ammo_box')) {
            const canvas = document.createElement('canvas');
            canvas.width = 80;
            canvas.height = 50;
            const ctx = canvas.getContext('2d');

            // Olive drab wood body
            const bgGrad = ctx.createLinearGradient(0, 0, 0, 50);
            bgGrad.addColorStop(0, '#465327');
            bgGrad.addColorStop(1, '#2c3516');
            ctx.fillStyle = bgGrad;
            ctx.beginPath();
            ctx.roundRect(4, 6, 72, 40, 4);
            ctx.fill();

            // Wood plank lines
            ctx.strokeStyle = '#1e240f';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(4, 19); ctx.lineTo(76, 19);
            ctx.moveTo(4, 33); ctx.lineTo(76, 33);
            ctx.stroke();

            // Steel Corner brackets
            ctx.fillStyle = '#171c0d';
            ctx.fillRect(4, 6, 8, 8);
            ctx.fillRect(68, 6, 8, 8);
            ctx.fillRect(4, 38, 8, 8);
            ctx.fillRect(68, 38, 8, 8);

            // Stenciled 1971 Indian Army Markings
            ctx.fillStyle = '#ffd166';
            ctx.font = 'bold 8px monospace';
            ctx.fillText("ORD 1971", 18, 16);
            ctx.fillText("7.62mm 1A1", 12, 28);
            ctx.fillStyle = '#e5dec9';
            ctx.font = 'bold 7px monospace';
            ctx.fillText("23 PUNJAB", 16, 40);

            // Metal Latch
            ctx.fillStyle = '#d4af37';
            ctx.fillRect(37, 16, 6, 8);

            scene.textures.addCanvas('ammo_crate', canvas);
            scene.textures.addCanvas('ammo_box', canvas);
        }

        // Authentic Rajasthani Tanot Mata Mandir Shrine (Altar of Faith)
        if (!scene.textures.exists('tanot_shrine')) {
            const canvas = document.createElement('canvas');
            canvas.width = 120;
            canvas.height = 150;
            const ctx = canvas.getContext('2d');

            // Sandstone Plinth (Jaisalmer Golden Stone)
            const stoneGrad = ctx.createLinearGradient(0, 0, 0, 150);
            stoneGrad.addColorStop(0, '#e5b66d');
            stoneGrad.addColorStop(1, '#a67838');
            ctx.fillStyle = stoneGrad;

            // Tiered base steps
            ctx.fillRect(10, 130, 100, 16);
            ctx.fillRect(18, 114, 84, 16);
            ctx.fillRect(24, 100, 72, 14);

            // Carved Sandstone Pillars
            ctx.fillStyle = '#c99648';
            ctx.fillRect(28, 48, 10, 52); // Left pillar
            ctx.fillRect(82, 48, 10, 52); // Right pillar

            // Mandir Sanctum Niche (Inner alcove)
            ctx.fillStyle = '#3a200a';
            ctx.beginPath();
            ctx.roundRect(38, 50, 44, 50, 4);
            ctx.fill();

            // Rajput Chhatri Arch / Dome (Shikhara)
            ctx.fillStyle = '#dca255';
            ctx.beginPath();
            ctx.moveTo(20, 48);
            ctx.quadraticCurveTo(60, 18, 100, 48);
            ctx.closePath();
            ctx.fill();

            // Kalash & Sacred Red/Saffron Dhwaja (Flag)
            ctx.fillStyle = '#ffd166';
            ctx.beginPath();
            ctx.arc(60, 18, 5, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ff5400';
            ctx.beginPath();
            ctx.moveTo(60, 13);
            ctx.lineTo(76, 7);
            ctx.lineTo(60, 1);
            ctx.closePath();
            ctx.fill();

            // Divine Idol / Mata Murti with Red Silk Backdrop & Golden Face
            ctx.fillStyle = '#d90429';
            ctx.fillRect(44, 62, 32, 34);
            ctx.fillStyle = '#ffd166';
            ctx.beginPath();
            ctx.arc(60, 74, 9, 0, Math.PI * 2);
            ctx.fill();

            // Marigold Flower Garland (Orange & Yellow beads)
            const garlandColors = ['#ff7b00', '#ffd000', '#ff5400'];
            for (let g = 0; g < 7; g++) {
                ctx.fillStyle = garlandColors[g % 3];
                ctx.beginPath();
                ctx.arc(48 + g * 4, 85, 2.5, 0, Math.PI * 2);
                ctx.fill();
            }

            // Hanging Brass Temple Bell with chain
            ctx.fillStyle = '#ffd166';
            ctx.fillRect(59, 44, 2, 8);
            ctx.beginPath();
            ctx.moveTo(56, 56);
            ctx.lineTo(64, 56);
            ctx.lineTo(66, 52);
            ctx.lineTo(54, 52);
            ctx.closePath();
            ctx.fill();

            // Clay Diya (Oil Lamp) on the pedestal with warm glowing flame
            ctx.fillStyle = '#9c5427';
            ctx.beginPath();
            ctx.ellipse(60, 103, 8, 3.5, 0, 0, Math.PI * 2);
            ctx.fill();

            // Glowing Diya Flame
            ctx.fillStyle = '#ff9f1c';
            ctx.shadowColor = '#ffe49e';
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.moveTo(58, 101);
            ctx.quadraticCurveTo(60, 94, 60, 93);
            ctx.quadraticCurveTo(60, 94, 62, 101);
            ctx.closePath();
            ctx.fill();
            ctx.shadowBlur = 0;

            scene.textures.addCanvas('tanot_shrine', canvas);
        }

        // Watchtower
        if (!scene.textures.exists('watchtower')) {
            const canvas = document.createElement('canvas');
            canvas.width = 120;
            canvas.height = 280;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#3a2e1d';
            ctx.fillRect(20, 90, 80, 16);
            ctx.fillRect(30, 50, 60, 40);
            scene.textures.addCanvas('watchtower', canvas);
        }

        // Enemy Tank
        if (!scene.textures.exists('enemy_tank')) {
            const canvas = document.createElement('canvas');
            canvas.width = 260;
            canvas.height = 110;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#1c1f1a';
            ctx.fillRect(40, 50, 170, 32);
            ctx.fillRect(0, 38, 110, 8);
            ctx.fillStyle = '#111';
            ctx.beginPath();
            ctx.roundRect(30, 72, 190, 30, 12);
            ctx.fill();
            scene.textures.addCanvas('enemy_tank', canvas);
        }
    }

    // ==========================================
    // 6. REAL GUN COMBAT VFX & PARTICLES
    // ==========================================
    static generateVFX(scene) {
        // Muzzle Flash
        if (!scene.textures.exists('muzzle_flash')) {
            const canvas = document.createElement('canvas');
            canvas.width = 40;
            canvas.height = 40;
            const ctx = canvas.getContext('2d');
            const g = ctx.createRadialGradient(20, 20, 2, 20, 20, 18);
            g.addColorStop(0, '#ffffff');
            g.addColorStop(0.3, '#ffea00');
            g.addColorStop(0.7, '#ff5400');
            g.addColorStop(1, 'rgba(255, 0, 0, 0)');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(20, 20, 18, 0, Math.PI * 2);
            ctx.fill();
            scene.textures.addCanvas('muzzle_flash', canvas);
        }

        // Bullet Tracer Streak
        if (!scene.textures.exists('bullet_tracer')) {
            const canvas = document.createElement('canvas');
            canvas.width = 32;
            canvas.height = 6;
            const ctx = canvas.getContext('2d');
            const g = ctx.createLinearGradient(0, 0, 32, 0);
            g.addColorStop(0, 'rgba(255, 230, 150, 0)');
            g.addColorStop(0.4, '#ffd166');
            g.addColorStop(1, '#ffffff');
            ctx.fillStyle = g;
            ctx.fillRect(0, 1, 32, 4);
            scene.textures.addCanvas('bullet_tracer', canvas);
        }

        // Ejected Brass Shell Casing
        if (!scene.textures.exists('particle_shell')) {
            const canvas = document.createElement('canvas');
            canvas.width = 10;
            canvas.height = 6;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffd166';
            ctx.fillRect(0, 0, 8, 5);
            ctx.fillStyle = '#8a5c18';
            ctx.fillRect(8, 1, 2, 3);
            scene.textures.addCanvas('particle_shell', canvas);
        }

        // Hit Spark
        if (!scene.textures.exists('particle_hit_spark')) {
            const canvas = document.createElement('canvas');
            canvas.width = 16;
            canvas.height = 16;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ff9f1c';
            ctx.fillRect(6, 0, 4, 16);
            ctx.fillRect(0, 6, 16, 4);
            scene.textures.addCanvas('particle_hit_spark', canvas);
        }

        // Dust particle
        if (!scene.textures.exists('particle_dust')) {
            const canvas = document.createElement('canvas');
            canvas.width = 12;
            canvas.height = 12;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'rgba(230, 195, 140, 0.65)';
            ctx.beginPath();
            ctx.arc(6, 6, 5, 0, Math.PI * 2);
            ctx.fill();
            scene.textures.addCanvas('particle_dust', canvas);
        }

        // Steam particle
        if (!scene.textures.exists('particle_steam')) {
            const canvas = document.createElement('canvas');
            canvas.width = 24;
            canvas.height = 24;
            const ctx = canvas.getContext('2d');
            const g = ctx.createRadialGradient(12, 12, 2, 12, 12, 11);
            g.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
            g.addColorStop(1, 'rgba(220, 220, 220, 0)');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(12, 12, 11, 0, Math.PI * 2);
            ctx.fill();
            scene.textures.addCanvas('particle_steam', canvas);
        }

        // Blood Splatter / Combat Impact Particle
        if (!scene.textures.exists('particle_blood')) {
            const canvas = document.createElement('canvas');
            canvas.width = 10;
            canvas.height = 10;
            const ctx = canvas.getContext('2d');
            const g = ctx.createRadialGradient(5, 5, 1, 5, 5, 4);
            g.addColorStop(0, '#b91c1c');
            g.addColorStop(0.6, '#7f1d1d');
            g.addColorStop(1, 'rgba(127, 29, 29, 0)');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(5, 5, 4, 0, Math.PI * 2);
            ctx.fill();
            scene.textures.addCanvas('particle_blood', canvas);
        }

        // Fiery Burning Ember Particle
        if (!scene.textures.exists('particle_ember')) {
            const canvas = document.createElement('canvas');
            canvas.width = 8;
            canvas.height = 8;
            const ctx = canvas.getContext('2d');
            const g = ctx.createRadialGradient(4, 4, 1, 4, 4, 3);
            g.addColorStop(0, '#ffffff');
            g.addColorStop(0.4, '#fbbf24');
            g.addColorStop(0.8, '#f97316');
            g.addColorStop(1, 'rgba(239, 68, 68, 0)');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(4, 4, 3, 0, Math.PI * 2);
            ctx.fill();
            scene.textures.addCanvas('particle_ember', canvas);
        }

        // Gun Smoke Puff
        if (!scene.textures.exists('particle_smoke_puff')) {
            const canvas = document.createElement('canvas');
            canvas.width = 28;
            canvas.height = 28;
            const ctx = canvas.getContext('2d');
            const g = ctx.createRadialGradient(14, 14, 2, 14, 14, 13);
            g.addColorStop(0, 'rgba(180, 180, 180, 0.45)');
            g.addColorStop(0.5, 'rgba(120, 120, 120, 0.25)');
            g.addColorStop(1, 'rgba(60, 60, 60, 0)');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(14, 14, 13, 0, Math.PI * 2);
            ctx.fill();
            scene.textures.addCanvas('particle_smoke_puff', canvas);
        }

        // Drifting Sand Grain Particle
        if (!scene.textures.exists('particle_sand_grain')) {
            const canvas = document.createElement('canvas');
            canvas.width = 6;
            canvas.height = 4;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'rgba(238, 204, 148, 0.55)';
            ctx.fillRect(0, 0, 4, 2);
            ctx.fillStyle = 'rgba(212, 175, 114, 0.35)';
            ctx.fillRect(2, 1, 3, 2);
            scene.textures.addCanvas('particle_sand_grain', canvas);
        }

        // Tactical Crosshair Reticle
        if (!scene.textures.exists('tactical_reticle')) {
            const canvas = document.createElement('canvas');
            canvas.width = 44;
            canvas.height = 44;
            const ctx = canvas.getContext('2d');
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 1.8;
            // Outer segmented circle
            ctx.beginPath();
            ctx.arc(22, 22, 14, 0, Math.PI * 2);
            ctx.stroke();
            // Center point
            ctx.fillStyle = '#f87171';
            ctx.beginPath();
            ctx.arc(22, 22, 2.5, 0, Math.PI * 2);
            ctx.fill();
            // Crosshair tick marks
            ctx.beginPath();
            ctx.moveTo(22, 2); ctx.lineTo(22, 6);
            ctx.moveTo(22, 38); ctx.lineTo(22, 42);
            ctx.moveTo(2, 22); ctx.lineTo(6, 22);
            ctx.moveTo(38, 22); ctx.lineTo(42, 22);
            ctx.stroke();
            scene.textures.addCanvas('tactical_reticle', canvas);
        }
    }
}

window.TextureGenerator = TextureGenerator;
