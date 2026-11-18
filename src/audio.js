// Procedural Audio Engine for THAR FRONTIER: A SOLDIER'S PROMISE · 1971
// Synthesizes 1971 Military SFX, Air Raid Sirens, Tank Rumbles, Steam Trains,
// Desert Winds, Rajasthani Folk-Military Melodies, and Vocal Inflections.

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.ambientGain = null;
        this.ambientMode = 'station'; // 'station', 'convoy', 'night_outpost'
        this.sirenOsc = null;
        this.sirenGain = null;
        this.sirenActive = false;
        this.tankRumbleOsc = null;
        this.initialized = false;

        // Background Music: "Registaan Mera Aakhri Ghar"
        // Soft, smooth volume (~0.22) so it blends with ambient soundscapes and combat SFX
        this.bgmAudio = null;
        this.bgmTargetVolume = 0.22;
        this.bgmFadeInterval = null;
        this.bgmStarted = false;

        // Real Studio/Battlefield MP3 SFX Banks (FXsound/)
        this.fxBanks = {
            ricochet: [
                'FXsound/Bullet_ricocheting_o_#1-1794385849924.mp3',
                'FXsound/Bullet_ricocheting_o_#2-1794385866707.mp3',
                'FXsound/Bullet_ricocheting_o_#3-1794385873728.mp3',
                'FXsound/Bullet_ricocheting_o_#4-1794385877901.mp3'
            ],
            fuel_explosion: [
                'FXsound/sfx_fuel_explosion.m_#1-1794386236423.mp3',
                'FXsound/sfx_fuel_explosion.m_#2-1794386245364.mp3',
                'FXsound/sfx_fuel_explosion.m_#3-1794386252678.mp3',
                'FXsound/sfx_fuel_explosion.m_#4-1794386258628.mp3'
            ],
            hunter_flyby: [
                'FXsound/sfx_hunter_flyby.mp3_#1-1794386389512.mp3',
                'FXsound/sfx_hunter_flyby.mp3_#2-1794386406343.mp3',
                'FXsound/sfx_hunter_flyby.mp3_#3-1794386414579.mp3',
                'FXsound/sfx_hunter_flyby.mp3_#4-1794386421770.mp3'
            ],
            rcl_fire: [
                'FXsound/sfx_rcl_fire.mp3_Hea_#1-1794385261751.mp3',
                'FXsound/sfx_rcl_fire.mp3_Hea_#2-1794385261752.mp3',
                'FXsound/sfx_rcl_fire.mp3_Hea_#3-1794385261752.mp3',
                'FXsound/sfx_rcl_fire.mp3_Hea_#4-1794385263196.mp3'
            ],
            tank_engine: [
                'FXsound/sfx_tank_engine_loop_#1-1794385386772.mp3',
                'FXsound/sfx_tank_engine_loop_#2-1794385412393.mp3',
                'FXsound/sfx_tank_engine_loop_#3-1794385427679.mp3',
                'FXsound/sfx_tank_engine_loop_#4-1794385434770.mp3'
            ],
            tinnitus: [
                'FXsound/sfx_tinnitus_ringing_#1-1794386705717.mp3',
                'FXsound/sfx_tinnitus_ringing_#2-1794386720707.mp3',
                'FXsound/sfx_tinnitus_ringing_#3-1794386724865.mp3',
                'FXsound/sfx_tinnitus_ringing_#4-1794386730709.mp3'
            ]
        };
        this.fxBuffers = {};
        this.fxLoadingPromises = {};
        this.fxPreloaded = false;
        this.tankLoopSource = null;
        this.tankLoopGain = null;
        this.tankLoopHtmlAudio = null;
        this.tankLoopActive = false;
        this.tankLoopVolume = 0.16;
    }

    encodeAssetUrl(relPath) {
        return relPath.split('/').map(seg => encodeURIComponent(seg)).join('/');
    }

    loadFXBuffer(relPath) {
        if (!this.ctx) return Promise.resolve(null);
        if (this.fxBuffers[relPath]) return Promise.resolve(this.fxBuffers[relPath]);
        if (this.fxLoadingPromises[relPath]) return this.fxLoadingPromises[relPath];

        const p = fetch(this.encodeAssetUrl(relPath))
            .then(res => (res.ok ? res.arrayBuffer() : Promise.reject(new Error('HTTP ' + res.status))))
            .then(buf => this.ctx.decodeAudioData(buf))
            .then(decoded => {
                this.fxBuffers[relPath] = decoded;
                delete this.fxLoadingPromises[relPath];
                return decoded;
            })
            .catch(() => {
                delete this.fxLoadingPromises[relPath];
                return null;
            });
        this.fxLoadingPromises[relPath] = p;
        return p;
    }

    preloadFXBuffers() {
        if (this.fxPreloaded || !this.ctx) return;
        this.fxPreloaded = true;
        Object.values(this.fxBanks).forEach(list => {
            list.forEach(p => { this.loadFXBuffer(p); });
        });
    }

    playFXSample(bankKey, volume = 0.6, durationSec = null, fallbackFn = null) {
        if (this.isMuted) return;
        this.ensureContext();
        const list = this.fxBanks[bankKey];
        if (!list || list.length === 0) {
            if (fallbackFn) fallbackFn();
            return;
        }
        const chosen = list[Math.floor(Math.random() * list.length)];
        const cached = this.fxBuffers[chosen];
        if (this.ctx && cached) {
            const now = this.ctx.currentTime;
            const src = this.ctx.createBufferSource();
            src.buffer = cached;
            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(volume, now);
            if (durationSec && durationSec > 0.2 && cached.duration > durationSec) {
                gain.gain.setValueAtTime(volume, now + durationSec - 0.35);
                gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);
            }
            src.connect(gain);
            gain.connect(this.ctx.destination);
            src.start(now);
            if (durationSec && durationSec > 0.2) {
                src.stop(now + durationSec + 0.05);
            }
            return;
        }

        // Kick off decode for next time and play immediately via HTMLAudioElement
        if (this.ctx) this.loadFXBuffer(chosen);
        try {
            const audio = new Audio(this.encodeAssetUrl(chosen));
            audio.volume = Math.max(0, Math.min(1, volume));
            const p = audio.play();
            if (p && typeof p.catch === 'function') {
                p.catch(() => { if (fallbackFn) fallbackFn(); });
            }
            if (durationSec && durationSec > 0.2) {
                setTimeout(() => {
                    try { audio.pause(); audio.currentTime = 0; } catch {}
                }, Math.round(durationSec * 1000));
            }
        } catch {
            if (fallbackFn) fallbackFn();
        }
    }

    initBGM() {
        if (this.bgmAudio) return;
        try {
            this.bgmAudio = new Audio('assets/audio/registaan_bgm.mp3');
            this.bgmAudio.loop = true;
            this.bgmAudio.volume = 0;
            this.bgmAudio.preload = 'auto';
        } catch (e) {
            console.warn("Could not create BGM Audio object:", e);
        }
    }

    playBGM() {
        this.initBGM();
        if (!this.bgmAudio || this.isMuted) return;

        const playPromise = this.bgmAudio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                this.bgmStarted = true;
                this.fadeBGM(this.bgmTargetVolume, 2500); // 2.5s gentle fade in
            }).catch(e => {
                // Pending user interaction gesture
            });
        }
    }

    fadeBGM(targetVolume, durationMs = 2000) {
        if (!this.bgmAudio) return;
        if (this.bgmFadeInterval) clearInterval(this.bgmFadeInterval);

        const steps = 30;
        const stepTime = durationMs / steps;
        const startVolume = this.bgmAudio.volume;
        const volumeDiff = targetVolume - startVolume;
        let step = 0;

        this.bgmFadeInterval = setInterval(() => {
            step++;
            const progress = step / steps;
            const newVol = Math.max(0, Math.min(1, startVolume + volumeDiff * progress));
            if (this.bgmAudio) this.bgmAudio.volume = newVol;

            if (step >= steps) {
                clearInterval(this.bgmFadeInterval);
                this.bgmFadeInterval = null;
                if (targetVolume === 0 && this.bgmAudio) {
                    this.bgmAudio.pause();
                }
            }
        }, stepTime);
    }

    stopBGM() {
        if (!this.bgmAudio) return;
        this.fadeBGM(0, 1000);
    }

    setBGMVolume(vol) {
        this.bgmTargetVolume = vol;
        if (!this.isMuted && this.bgmAudio) {
            this.bgmAudio.volume = vol;
        }
    }

    init() {
        if (this.initialized) {
            if (!this.bgmStarted && !this.isMuted) {
                this.playBGM();
            }
            return;
        }
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            this.initialized = true;
            this.preloadFXBuffers();
            this.playBGM();
            this.startAmbience('station');
            if (this.tankLoopActive) {
                this.startTankEngineLoop(this.tankLoopVolume);
            }
        } catch (e) {
            console.warn("Web Audio initialization pending gesture:", e);
        }
    }

    ensureContext() {
        if (!this.ctx) {
            this.init();
        } else if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        if (!this.bgmStarted && !this.isMuted) {
            this.playBGM();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.ambientGain && this.ctx) {
            this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.08, this.ctx.currentTime);
        }
        if (this.tankLoopGain && this.ctx) {
            this.tankLoopGain.gain.setValueAtTime(this.isMuted || !this.tankLoopActive ? 0 : this.tankLoopVolume, this.ctx.currentTime);
        }
        if (this.tankLoopHtmlAudio) {
            this.tankLoopHtmlAudio.muted = this.isMuted;
        }
        if (this.bgmAudio) {
            if (this.isMuted) {
                this.fadeBGM(0, 400);
            } else {
                this.bgmAudio.play().catch(() => {});
                this.fadeBGM(this.bgmTargetVolume, 800);
            }
        }
        return this.isMuted;
    }

    // Footsteps: 'stone' (Platform) or 'sand' (Dunes)
    playFootstep(surface = 'sand') {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        if (surface === 'stone') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(110 + Math.random() * 30, now);
            osc.frequency.exponentialRampToValueAtTime(30, now + 0.06);
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(500, now);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        } else {
            // Muffled desert sand crunch
            osc.type = 'sine';
            osc.frequency.setValueAtTime(70 + Math.random() * 20, now);
            osc.frequency.exponentialRampToValueAtTime(25, now + 0.08);
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(280, now);
            gain.gain.setValueAtTime(0.16, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        }

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.09);
    }

    playJump() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(280, now + 0.12);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
    }

    playLand() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.1);

        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.11);
    }

    // 1971 Mechanical Air Raid Siren (Historical rising & falling scream)
    startAirRaidSiren() {
        if (this.isMuted || this.sirenActive) return;
        this.ensureContext();
        if (!this.ctx) return;

        this.sirenActive = true;
        const now = this.ctx.currentTime;

        this.sirenOsc = this.ctx.createOscillator();
        this.sirenGain = this.ctx.createGain();

        this.sirenOsc.type = 'sawtooth';
        this.sirenGain.gain.setValueAtTime(0.01, now);
        this.sirenGain.gain.linearRampToValueAtTime(0.25, now + 0.5);

        // LFO to cycle pitch from 350Hz to 680Hz
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(0.3, now); // cycle every 3.3s
        lfoGain.gain.setValueAtTime(160, now);

        this.sirenOsc.frequency.setValueAtTime(500, now);
        lfo.connect(lfoGain);
        lfoGain.connect(this.sirenOsc.frequency);

        this.sirenOsc.connect(this.sirenGain);
        this.sirenGain.connect(this.ctx.destination);

        this.sirenOsc.start(now);
        lfo.start(now);
        this.sirenLfo = lfo;
    }

    stopAirRaidSiren() {
        if (!this.sirenActive || !this.sirenGain || !this.ctx) return;
        const now = this.ctx.currentTime;
        this.sirenGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
        setTimeout(() => {
            if (this.sirenOsc) {
                this.sirenOsc.stop();
                this.sirenOsc.disconnect();
            }
            if (this.sirenLfo) {
                this.sirenLfo.stop();
                this.sirenLfo.disconnect();
            }
            this.sirenActive = false;
        }, 900);
    }

    // 1970s Steam Locomotive Whistle
    playSteamWhistle() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        [440, 554.37, 659.25].forEach(freq => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);
            osc.frequency.linearRampToValueAtTime(freq * 1.02, now + 0.8);

            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 1.25);
        });
    }

    // 7.62mm 1A1 SLR Battle Rifle Gunshot
    playSLRShot() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        // 1. Supersonic Gunshot Acoustic Crack (Noise Burst)
        const bufferSize = this.ctx.sampleRate * 0.25;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.15));
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(3500, now);
        filter.frequency.exponentialRampToValueAtTime(400, now + 0.22);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(now);

        // 2. Heavy Gunpowder Low-End Thrum (7.62mm heavy punch)
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(180, now);
        bassOsc.frequency.exponentialRampToValueAtTime(32, now + 0.18);

        bassGain.gain.setValueAtTime(0.55, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        bassOsc.connect(bassGain);
        bassGain.connect(this.ctx.destination);
        bassOsc.start(now);
        bassOsc.stop(now + 0.22);

        // 3. Mechanical SLR Bolt Clack
        setTimeout(() => {
            if (!this.ctx) return;
            const t = this.ctx.currentTime;
            const boltOsc = this.ctx.createOscillator();
            const boltGain = this.ctx.createGain();
            boltOsc.type = 'square';
            boltOsc.frequency.setValueAtTime(650, t);
            boltOsc.frequency.exponentialRampToValueAtTime(280, t + 0.05);
            boltGain.gain.setValueAtTime(0.12, t);
            boltGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
            boltOsc.connect(boltGain);
            boltGain.connect(this.ctx.destination);
            boltOsc.start(t);
            boltOsc.stop(t + 0.06);
        }, 90);
    }

    // Rifle Bolt Cocking (Klick-Clack)
    playRifleCock() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        [0, 0.08].forEach((offset, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(idx === 0 ? 550 : 800, now + offset);
            osc.frequency.exponentialRampToValueAtTime(250, now + offset + 0.05);

            gain.gain.setValueAtTime(0.2, now + offset);
            gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.05);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + offset);
            osc.stop(now + offset + 0.06);
        });
    }

    // Melee Rifle Butt Strike / Close Combat Punch
    playMeleeHit() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        // Low blunt thud
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.14);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);

        // Whoosh swoosh
        const noise = this.ctx.createOscillator();
        const nGain = this.ctx.createGain();
        noise.type = 'sine';
        noise.frequency.setValueAtTime(450, now);
        noise.frequency.exponentialRampToValueAtTime(150, now + 0.08);
        nGain.gain.setValueAtTime(0.25, now);
        nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        noise.connect(nGain);
        nGain.connect(this.ctx.destination);
        noise.start(now);
        noise.stop(now + 0.09);
    }

    // Ejected Brass Shell Casing Drop
    playShellDrop() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.06);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.07);
    }

    // Paper Rustle (When reading Mother's letter or train ticket)
    playPaperRustle() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const bufferSize = this.ctx.sampleRate * 0.12;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1400, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(now);
    }

    // Field Binoculars Lens Focus Adjustment Click
    playBinocularsFocus() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(700, now + 0.04);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
    }

    // Distant Tank Rumble & Clanking Steel Tracks
    playTankRumble() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        // Heavy low rumble
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(42, now);
        gain.gain.setValueAtTime(0.28, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 3.0);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(120, now);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 3.1);

        // Clanking track links
        for (let i = 0; i < 4; i++) {
            const clickTime = now + 0.4 + i * 0.6;
            const clickOsc = this.ctx.createOscillator();
            const clickGain = this.ctx.createGain();
            clickOsc.type = 'square';
            clickOsc.frequency.setValueAtTime(320 + Math.random() * 40, clickTime);
            clickGain.gain.setValueAtTime(0.08, clickTime);
            clickGain.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.06);

            clickOsc.connect(clickGain);
            clickGain.connect(this.ctx.destination);
            clickOsc.start(clickTime);
            clickOsc.stop(clickTime + 0.07);
        }
    }

    // Heavy Fortification Sandbag Thud
    playSandbagThud() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(90, now);
        osc.frequency.exponentialRampToValueAtTime(25, now + 0.22);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.24);
    }

    // 106mm RCL Ammo Crate Pickup / Placement
    playAmmoCrate() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
    }

    // Tanot Mata Temple Brass Bell Chime
    playTanotMataBell() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const base = 528; // Solfeggio sacred frequency (Transformation & Miracles)
        [1, 2.75, 4.2, 7.8].forEach((h, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(base * h, now);

            const dur = 2.4 / (i + 1);
            gain.gain.setValueAtTime(0.22 / (i + 1), now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + dur);
        });
    }

    // Dialogue Vocal Chatter (Gentle voice tone inflection)
    playVocalChatter(pitch = 1.0) {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(180 * pitch, now);
        osc.frequency.linearRampToValueAtTime(240 * pitch, now + 0.04);
        osc.frequency.linearRampToValueAtTime(160 * pitch, now + 0.08);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
    }

    playInteractTap() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
    }

    playVictoryCall() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const notes = [293.66, 369.99, 440, 587.33]; // D Major Military Bugle
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const startT = now + idx * 0.22;

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, startT);

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1400, startT);

            gain.gain.setValueAtTime(0.2, startT);
            gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.45);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(startT);
            osc.stop(startT + 0.48);
        });
    }

    // Adaptive Ambient Music Engine: Station / Convoy / Night Outpost
    startAmbience(mode = 'station') {
        if (!this.ctx) return;
        this.ambientMode = mode;

        if (this.ambientGain) {
            this.ambientGain.disconnect();
        }

        const now = this.ctx.currentTime;
        this.ambientGain = this.ctx.createGain();
        this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.08, now);

        if (mode === 'station') {
            // Warm Rajasthani Raga Desh drone (Sarangi / Ektara flavor: D & A root)
            this.createDroneOsc(146.83, 'sawtooth', 340, now); // D3
            this.createDroneOsc(220.00, 'sine', 500, now);     // A3
        } else if (mode === 'convoy') {
            // Diesel engine hum + desert wind filter
            this.createDroneOsc(90.0, 'sawtooth', 220, now);
            this.createDroneOsc(135.0, 'triangle', 300, now);
        } else if (mode === 'night_outpost') {
            // Deep suspenseful war drone (C# & G# brooding minor feel)
            this.createDroneOsc(69.30, 'sawtooth', 180, now); // C#2
            this.createDroneOsc(103.83, 'sine', 260, now);    // G#2
        }

        this.ambientGain.connect(this.ctx.destination);
    }

    createDroneOsc(freq, type, filterFreq, now) {
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(filterFreq, now);

        osc.connect(filter);
        filter.connect(this.ambientGain);
        osc.start(now);
    }

    // Extended Battle SFX: 106mm RCL Blast, Armor Ricochet, Fuel Explosion, Tank Engine Loop, Tinnitus, IAF Hunter Flyby
    playRCLBlast() {
        this.playFXSample('rcl_fire', 0.68, null, () => this._synthRCLBlast());
    }

    _synthRCLBlast() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(32, now + 0.55);

        gain.gain.setValueAtTime(0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.68);
        this.playSLRShot();
    }

    playFuelExplosion() {
        this.playFXSample('fuel_explosion', 0.72, null, () => this._synthRCLBlast());
    }

    playRicochet() {
        this.playFXSample('ricochet', 0.54, null, () => {
            if (this.isMuted) return;
            this.ensureContext();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1850, now);
            osc.frequency.exponentialRampToValueAtTime(620, now + 0.34);
            gain.gain.setValueAtTime(0.24, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.38);
        });
    }

    startTankEngineLoop(volume = 0.16) {
        this.tankLoopVolume = Math.max(0.04, Math.min(0.45, volume || 0.16));
        this.tankLoopActive = true;
        if (this.isMuted) return;

        const chosen = this.fxBanks.tank_engine[Math.floor(Math.random() * this.fxBanks.tank_engine.length)];
        if (this.tankLoopSource && this.tankLoopGain && this.ctx) {
            this.tankLoopGain.gain.setTargetAtTime(this.tankLoopVolume, this.ctx.currentTime, 0.15);
            return;
        }
        if (this.tankLoopHtmlAudio) {
            this.tankLoopHtmlAudio.volume = this.tankLoopVolume;
            this.tankLoopHtmlAudio.muted = this.isMuted;
            this.tankLoopHtmlAudio.play().catch(() => {});
            return;
        }

        if (this.ctx) {
            this.loadFXBuffer(chosen).then(buf => {
                if (!this.tankLoopActive || this.tankLoopSource || !buf || !this.ctx) return;
                if (this.tankLoopHtmlAudio) {
                    try { this.tankLoopHtmlAudio.pause(); this.tankLoopHtmlAudio = null; } catch {}
                }
                const now = this.ctx.currentTime;
                const src = this.ctx.createBufferSource();
                src.buffer = buf;
                src.loop = true;
                const gain = this.ctx.createGain();
                gain.gain.setValueAtTime(this.isMuted ? 0 : this.tankLoopVolume, now);
                src.connect(gain);
                gain.connect(this.ctx.destination);
                src.start(now);
                this.tankLoopSource = src;
                this.tankLoopGain = gain;
            });
            return;
        }

        try {
            const audio = new Audio(this.encodeAssetUrl(chosen));
            audio.loop = true;
            audio.volume = this.tankLoopVolume;
            audio.muted = this.isMuted;
            audio.play().catch(() => {});
            this.tankLoopHtmlAudio = audio;
        } catch {}
    }

    stopTankEngineLoop() {
        this.tankLoopActive = false;
        if (this.tankLoopSource) {
            try { this.tankLoopSource.stop(); } catch {}
            try { this.tankLoopSource.disconnect(); } catch {}
            this.tankLoopSource = null;
        }
        if (this.tankLoopGain) {
            try { this.tankLoopGain.disconnect(); } catch {}
            this.tankLoopGain = null;
        }
        if (this.tankLoopHtmlAudio) {
            try { this.tankLoopHtmlAudio.pause(); this.tankLoopHtmlAudio.currentTime = 0; } catch {}
            this.tankLoopHtmlAudio = null;
        }
    }

    playMortarWhistle() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1250, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.85);
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.7);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.92);
    }

    playTinnitus(durationSec = 3.5) {
        this.playFXSample('tinnitus', 0.44, durationSec, () => {
            if (this.isMuted) return;
            this.ensureContext();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(3400, now);
            gain.gain.setValueAtTime(0.09, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + durationSec + 0.05);
        });
    }

    playJetRoar() {
        this.playFXSample('hunter_flyby', 0.65, null, () => {
            if (this.isMuted) return;
            this.ensureContext();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;
            const bufferSize = this.ctx.sampleRate * 1.4;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
            const src = this.ctx.createBufferSource();
            src.buffer = buffer;
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(950, now);
            filter.frequency.exponentialRampToValueAtTime(220, now + 1.35);
            filter.Q.value = 1.6;
            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.02, now);
            gain.gain.linearRampToValueAtTime(0.32, now + 0.35);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.38);
            src.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);
            src.start(now);
        });
    }
}

window.soundEngine = new SoundEngine();
