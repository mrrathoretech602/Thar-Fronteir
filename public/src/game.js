// THAR FRONTIER: A SOLDIER'S PROMISE · 1971
// src/game.js - Main Game Scene & 2.5D Parallax Engine with Authentic Land Assets

import { MissionManager, MissionsData } from './missions.js';
import { DialogueManager } from './dialogue.js';

export class TharFrontierScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TharFrontierScene' });
    this.worldWidth = 3600;
    this.worldHeight = 900;
  }

  preload() {
    // 1. Load User's Authentic 2D Land & Environment Assets from Zgamland/files/
    this.load.image('ground_layer', 'Zgamland/files/ground_layer.png');
    this.load.image('dunes_layer', 'Zgamland/files/dunes_layer.png');
    this.load.image('khejri_tree', 'Zgamland/files/khejri_tree.png');
    this.load.image('border_pillar', 'Zgamland/files/border_pillar.png');
    this.load.image('camel_silhouette', 'Zgamland/files/camel_silhouette.png');
    this.load.image('barbed_wire', 'Zgamland/files/barbed_wire.png');
    this.load.image('concrete_fence_post', 'Zgamland/files/concrete_fence_post.png');
    this.load.image('desert_shrub', 'Zgamland/files/desert_shrub.png');
    this.load.image('sandstone_rock', 'Zgamland/files/sandstone_rock.png');
    this.load.image('full_scene_preview', 'Zgamland/files/full_scene_preview.png');

    // 2. Load Havildar Devrath Singh Official Painting & Jaisalmer Railway Station Assets
    this.load.image('devrath_hero', 'assets/characters/devrath/devrath_hero.png');
    this.load.image('railway_station', 'assets/environments/railway_station/railway_station.png');
    this.load.image('railway_station_scene', 'assets/environments/railway_station/railway_station_scene.png');

    // 3. Load Weapons, Vehicles & Longewala Battle Assets
    this.load.image('army_jeep_rcl', 'assets/weapons/army_jeep_rcl.png');
    this.load.image('destroyed_tank', 'assets/weapons/destroyed_tank.png');
    this.load.image('longewala_memorial', 'assets/weapons/longewala_memorial.png');
    this.load.image('longewala_battle_scene', 'assets/weapons/longewala_battle_scene.png');

    // 4. Load Extracted HD Asset Pack Sprites (Portraits, Units, Tanks, Aircraft, VFX)
    this.load.image('portrait_devrath_hd', 'assets/pack/portraits/devrath_portrait.png');
    this.load.image('portrait_chandpuri_hd', 'assets/pack/portraits/chandpuri_portrait.png');
    this.load.image('portrait_bhairon_hd', 'assets/pack/portraits/bhairon_portrait.png');
    this.load.image('portrait_pilot_hd', 'assets/pack/portraits/pilot_portrait.png');
    this.load.image('maa_letter_hd', 'assets/pack/ui/maa_letter.png');
    this.load.image('crosshair_hd', 'assets/pack/ui/crosshair.png');

    this.load.image('npc_chandpuri_hd', 'assets/pack/characters/chandpuri.png');
    this.load.image('npc_bhairon_hd', 'assets/pack/characters/bhairon_singh.png');
    this.load.image('pak_stand', 'assets/pack/characters/pak_stand.png');
    this.load.image('pak_kneel', 'assets/pack/characters/pak_kneel.png');
    this.load.image('pak_march', 'assets/pack/characters/pak_march.png');
    this.load.image('pak_run', 'assets/pack/characters/pak_run.png');
    this.load.image('pak_charge', 'assets/pack/characters/pak_charge.png');
    this.load.image('pak_prone', 'assets/pack/characters/pak_prone.png');

    this.load.image('type59_hull', 'assets/pack/vehicles/type59_hull.png');
    this.load.image('type59_turret', 'assets/pack/vehicles/type59_turret.png');
    this.load.image('diesel_fuel_drum', 'assets/pack/vehicles/fuel_drum.png');
    this.load.image('jonga_rcl_hd', 'assets/pack/vehicles/jonga_rcl.png');
    this.load.image('rcl_barrel_hd', 'assets/pack/vehicles/rcl_barrel.png');
    this.load.image('hawker_hunter', 'assets/pack/vehicles/hawker_hunter.png');
    this.load.image('destroyed_tank_fire', 'assets/pack/vehicles/destroyed_tank_fire.png');

    this.load.image('dawn_sky_hd', 'assets/pack/environments/dawn_sky.png');
    this.load.image('night_sky_hd', 'assets/pack/environments/night_sky.png');
    this.load.image('watchtower_hd', 'assets/pack/environments/watchtower.png');
    this.load.image('ruined_bunker_hd', 'assets/pack/environments/ruined_bunker.png');
    this.load.image('trench_ground_hd', 'assets/pack/environments/trench_ground.png');

    this.load.image('flag_india_hd', 'assets/pack/props/flag_india.png');
    this.load.image('ammo_crate_hd', 'assets/pack/props/ammo_crate.png');
    this.load.image('rcl_crate_hd', 'assets/pack/props/rcl_crate.png');
    this.load.image('field_radio_hd', 'assets/pack/props/field_radio.png');
    this.load.image('lantern_hd', 'assets/pack/props/lantern.png');
    this.load.image('sandbag_wall_hd', 'assets/pack/props/sandbag_wall.png');
    this.load.image('barbed_wire_hd', 'assets/pack/props/barbed_wire.png');

    this.load.image('muzzle_flash_hd', 'assets/pack/vfx/muzzle_flash.png');
    this.load.image('explosion_1', 'assets/pack/vfx/explosion_1.png');
    this.load.image('explosion_2', 'assets/pack/vfx/explosion_2.png');
    this.load.image('explosion_3', 'assets/pack/vfx/explosion_3.png');
    this.load.image('smoke_plume', 'assets/pack/vfx/smoke_plume.png');
    this.load.image('airstrike_smoke', 'assets/pack/vfx/airstrike_smoke.png');
    this.load.image('bullet_tracer_hd', 'assets/pack/vfx/bullet_tracer.png');
  }

  create() {
    // 1. Generate Paper-Art 2.5D Textures (Procedural fallbacks & portraits)
    TextureGenerator.generateAll(this);

    // 2. Physics World Setup
    this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight);

    // 3. Platform & Object Groups
    this.platforms = this.physics.add.staticGroup();
    this.bullets = this.physics.add.group();
    this.environmentObjects = [];
    this.currentEnvironment = null;

    // Bullet & Platform Collision with Impact Sparks
    this.physics.add.collider(this.bullets, this.platforms, (bullet, platform) => {
      this.createHitImpact(bullet.x, bullet.y);
      bullet.destroy();
    });

    // 4. Attach Camera Controller
    this.cameraController = new CameraController(this);
    window.cameraController = this.cameraController;

    // 5. Initialize Interaction Manager
    this.interactionManager = new InteractionManager(this);

    // 6. Initialize Player (Havildar Devrath Singh)
    this.createPlayer();
    this.playerHealth = 100;
    this.maxPlayerHealth = 100;
    this.inCover = false;
    this.lastDamageTakenAt = 0;
    this.ambientWindTimer = 0;
    this.artilleryFlashTimer = 0;
    this.emberTimer = 0;
    this.updateTacticalVitals();

    // 7. Initialize Narrative & Dialogue Subsystems (Level 6, Z: 1000)
    this.dialogueManager = new DialogueManager(this);
    window.dialogueManager = this.dialogueManager;

    this.missionManager = new MissionManager(this);
    window.missionManager = this.missionManager;
    window.gameScene = this;
    window.MissionsData = MissionsData;

    // 8. Global Narrative Event Listeners
    this.events.on('onMissionStarted', (mission) => {
      this.handleMissionStart(mission);
    });

    this.events.on('onDialogueSequenceFinished', (mission) => {
      this.handleDialogueFinished(mission);
    });

    this.events.on('onCampaignDemoFinished', () => {
      this.showDemoEndCard();
    });

    // 9. Start Campaign at Mission 1 (or saved checkpoint)
    const startIdx = (window.saveSystem && window.saveSystem.data.currentMission) ? (window.saveSystem.data.currentMission - 1) : 0;
    this.missionManager.startMission(Math.min(startIdx, MissionsData.length - 1));
  }

  jumpToMission(missionNumber) {
    const idx = Math.max(0, Math.min(MissionsData.length - 1, (missionNumber || 1) - 1));
    if (window.cutsceneManager && typeof window.cutsceneManager.cancelTitleCard === 'function') {
      window.cutsceneManager.cancelTitleCard();
    }
    if (window.dialogueManager && window.dialogueManager.isActive) {
      if (typeof window.dialogueManager.forceClose === 'function') {
        window.dialogueManager.forceClose();
      } else {
        window.dialogueManager.close();
      }
    }
    if (this.player && typeof this.player.resetInput === 'function') {
      this.player.resetInput();
    }
    ['letter-modal', 'ticket-modal', 'binocular-modal', 'ending-modal', 'campaign-modal'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });
    if (window.inventoryManager) {
      window.inventoryManager.markTicketCancelled(missionNumber >= 5);
      if (missionNumber >= 6) window.inventoryManager.giveItem('tanot_clay');
      if (missionNumber >= 7) window.inventoryManager.giveItem('binoculars');
      if (missionNumber >= 9) window.inventoryManager.giveItem('longewala_oath');
    }
    this.scene.resume();
    this.currentEnvironment = null;
    this.missionManager.startMission(idx);
  }

  createPlayer() {
    if (this.game && this.game.canvas && !this.game.canvas.hasAttribute('tabindex')) {
      this.game.canvas.setAttribute('tabindex', '0');
    }
    // Level 4 (Z: 100): Player Devrath
    this.player = new Player(this, 260, 720);
    this.player.sprite.setDepth(100);
    this.refreshPlatformCollider();

    // Camera follow with smooth lerp
    this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);
    this.cameras.main.startFollow(this.player.sprite, true, 0.08, 0.08);

    if (window.inventoryManager) {
      window.inventoryManager.updateUI();
    }
  }

  refreshPlatformCollider() {
    if (this.platformCollider) {
      this.physics.world.removeCollider(this.platformCollider);
    }
    if (this.player && this.player.sprite && this.platforms) {
      this.platformCollider = this.physics.add.collider(this.player.sprite, this.platforms);
    }
  }

  resetExtendedCombatState() {
    if (this.extendedTimers && this.extendedTimers.length) {
      this.extendedTimers.forEach(t => { if (t && t.remove) t.remove(false); });
    }
    this.extendedTimers = [];

    if (this.enemySoldiers && this.enemySoldiers.length) {
      this.enemySoldiers.forEach(s => { if (s && s.destroy) s.destroy(); });
    }
    this.enemySoldiers = [];

    if (this.enemyBullets && this.enemyBullets.length) {
      this.enemyBullets.forEach(b => { if (b && b.destroy) b.destroy(); });
    }
    this.enemyBullets = [];

    if (window.soundEngine && typeof window.soundEngine.stopTankEngineLoop === 'function') {
      window.soundEngine.stopTankEngineLoop();
    }

    if (this.tacticalCrosshair) {
      this.tacticalCrosshair.destroy();
      this.tacticalCrosshair = null;
    }
    if (this.tankWeakpointRing) {
      this.tweens.killTweensOf(this.tankWeakpointRing);
      this.tankWeakpointRing.destroy();
      this.tankWeakpointRing = null;
    }
    if (this.crestBeaconGroup && this.crestBeaconGroup.length) {
      this.crestBeaconGroup.forEach(obj => { if (obj && obj.destroy) obj.destroy(); });
    }
    this.crestBeaconGroup = [];
    this.extendedMissionState = null;

    if (this.player) {
      this.player.isJammed = false;
      this.player.speedMultiplier = 1.0;
      this.player.lockMovement(false);
      this.player.setCarrying(false);
    }

    const gc = document.getElementById('game-container');
    if (gc) gc.classList.remove('shell-shock-blur');

    ['combat-overlay-hud', 'ammo-wave-box', 'jam-meter-box', 'jam-qte-cue', 'grounding-box', 'action-toast', 'waypoint-compass'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });

    this.m2WaitingLetter = false;
    this.m3Stumbled = false;
    this.m6FlareState = null;
    this.m10AmbushState = null;

    if (this.cameras && this.cameras.main) {
      this.tweens.killTweensOf(this.cameras.main);
      this.cameras.main.setZoom(1.0);
      this.cameras.main.setFollowOffset(0, 0);
      if (this.player && this.player.sprite) {
        this.cameras.main.startFollow(this.player.sprite, true, 0.08, 0.08);
      }
    }
  }

  clearEnvironment() {
    this.resetExtendedCombatState();
    this.stationStage = 'platform';
    if (this.stationAlarmTween) {
      this.stationAlarmTween.stop();
      this.stationAlarmTween = null;
    }
    if (this.stationSearchlightTween) {
      this.stationSearchlightTween.stop();
      this.stationSearchlightTween = null;
    }
    if (this.enemyTankColumn) {
      this.enemyTankColumn.destroy();
      this.enemyTankColumn = null;
    }
    this.movingScenery = [];
    this.stationSearchlight = null;
    this.stationBaggageHazard = null;
    this.stationJetTimer = null;
    this.dawnSkyOverlay = null;
    this.redFlareOverlay = null;
    this.battleIllumOverlay = null;
    this.outpostRclJeep = null;
    this.stationTrainGroup = null;
    this.stationExitConvoyGroup = null;
    this.stationAlarmOverlay = null;
    this.environmentObjects.forEach(obj => {
      if (obj && obj.destroy) obj.destroy();
    });
    this.environmentObjects = [];
    this.platforms.clear(true, true);
    this.interactionManager.clear();
  }

  // ==========================================
  // ENVIRONMENT 1: JAISALMER RAILWAY STATION (1971)
  // Uses user's railway_station.png + Thar desert dusk horizon + 1971 Steam Train & Props
  // ==========================================
  setupStationEnvironment() {
    this.clearEnvironment();
    this.player.setSurface('stone');
    this.player.sprite.setPosition(260, 720);
    if (this.player.sprite.body) this.player.sprite.body.reset(260, 720);

    // Level 1 (Z: -100): Viewport-Locked Golden Desert Dusk Sky (Zero Edge Seams)
    const sky = this.add.image(640, 360, 'sky_station_dusk').setScrollFactor(0).setDepth(-100);
    this.environmentObjects.push(sky);

    // Distant Golden Dunes (Tiled across whole 3600px world)
    for (let x = 800; x < this.worldWidth + 1600; x += 1600) {
      const duneFar = this.add.image(x, 565, 'dune_far_dusk').setScrollFactor(0.18).setDepth(-90);
      this.environmentObjects.push(duneFar);
    }

    // Level 2 (Z: -55, Scroll: 0.35): User's Desert Dunes Layer matching railway_station_scene.png
    for (let x = 960; x < this.worldWidth + 1200; x += 1920) {
      const duneMid = this.add.image(x, 585, 'dunes_layer').setScrollFactor(0.35).setDepth(-55);
      this.environmentObjects.push(duneMid);
    }

    // Distant Desert Silhouettes & Perimeter Barbed Wire (inspired by railway_station_scene.png)
    [220, 1780, 2650, 3250].forEach(tx => {
      const tree = this.add.image(tx, 705, 'khejri_tree').setScrollFactor(0.65).setDepth(-35);
      this.environmentObjects.push(tree);
    });
    for (let wx = 180; wx < this.worldWidth; wx += 480) {
      if (wx > 520 && wx < 1520) continue; // Keep station facade open
      const wire = this.add.image(wx, 715, 'barbed_wire').setScrollFactor(0.65).setDepth(-30).setScale(0.75).setAlpha(0.75);
      this.environmentObjects.push(wire);
    }
    const camel = this.add.image(2100, 620, 'camel_silhouette').setScrollFactor(0.45).setDepth(-40).setScale(0.85).setAlpha(0.85);
    this.environmentObjects.push(camel);

    // User's Authentic Jaisalmer Railway Station Building (1000x600 -> anchored at Platform Y=800)
    const stationBuilding = this.add.image(1020, 560, 'railway_station').setDepth(-12);
    const stationSignText = this.add.text(1020, 598, 'जैसलमेर · JAISALMER', {
      fontSize: '18px',
      fontFamily: 'Tiro Devanagari Hindi, Cinzel, serif',
      fontStyle: 'bold',
      color: '#2c1810',
      align: 'center'
    }).setOrigin(0.5).setDepth(-11);
    this.environmentObjects.push(stationBuilding, stationSignText);

    // Level 3 (Z: 0): Playable Sandstone Platform Floor (Surface top at Y = 804)
    for (let x = 0; x < this.worldWidth; x += 512) {
      const p = this.platforms.create(x + 256, 852, 'station_platform');
      p.setDepth(0);
      p.refreshBody();
    }
    this.refreshPlatformCollider();

    // Vintage Platform Lantern Posts & Golden Dusk Glows
    [340, 710, 1280, 1620].forEach(lx => {
      const lamp = this.add.image(lx, 702, 'station_lamp').setDepth(-4);
      const glow = this.add.circle(lx, 622, 46, 0xffcc66, 0.14).setDepth(-3);
      this.tweens.add({
        targets: glow,
        alpha: 0.22,
        scale: 1.15,
        duration: 1800,
        yoyo: true,
        repeat: -1
      });
      this.environmentObjects.push(lamp, glow);
    });

    // Platform Props: Waiting Benches, Pendulum Clock Post, PA Horn Loudspeakers, Tea Stall
    const bench1 = this.add.image(460, 774, 'station_bench').setDepth(6);
    const bench2 = this.add.image(1220, 774, 'station_bench').setDepth(6);
    const clockPost = this.add.image(590, 712, 'station_clock').setDepth(6);
    const loudspeakerLeft = this.add.image(670, 704, 'station_loudspeaker').setDepth(6);
    const loudspeakerRight = this.add.image(1450, 704, 'station_loudspeaker').setDepth(6);
    const teaStall = this.add.image(810, 752, 'station_tea_stall').setDepth(7);
    const leftRock = this.add.image(140, 788, 'sandstone_rock').setDepth(8).setScale(0.75);
    const rightRock = this.add.image(2580, 788, 'sandstone_rock').setDepth(8).setScale(0.85);
    this.environmentObjects.push(
      bench1, bench2, clockPost, loudspeakerLeft, loudspeakerRight, teaStall, leftRock, rightRock
    );

    // 1971 Northern Railway Train (Missions 1-3: Coach Boarding at x=1840 & Steam Engine at x=2260)
    const trainCoach = this.add.image(1830, 706, 'train_coach').setDepth(3);
    const steamEngine = this.add.image(2250, 698, 'train_steam_engine').setDepth(4);
    const ticketDesk = this.add.image(1450, 774, this.textures.exists('lantern_hd') ? 'lantern_hd' : 'station_bench')
      .setDepth(7).setScale(this.textures.exists('lantern_hd') ? 0.36 : 1.0);
    const ticketSign = this.add.text(1450, 718, '🎫 TICKET CHECK', {
      fontSize: '11px',
      fontFamily: 'Rajdhani, sans-serif',
      fontStyle: 'bold',
      color: '#fde68a',
      backgroundColor: 'rgba(17, 24, 39, 0.85)',
      padding: { x: 6, y: 2 }
    }).setOrigin(0.5).setDepth(8);
    this.stationTrainGroup = [trainCoach, steamEngine, ticketDesk, ticketSign];
    this.environmentObjects.push(trainCoach, steamEngine, ticketDesk, ticketSign);

    // Moving Train Horizon Props (Activated in M2 when train moves toward Shekhawati)
    this.movingScenery = [];
    for (let mx = 1220; mx <= 2540; mx += 220) {
      const pole = this.add.image(mx, 710, 'concrete_fence_post').setDepth(-6).setScale(0.7).setAlpha(0.55).setVisible(false);
      const bush = this.add.image(mx + 95, 765, 'desert_shrub').setDepth(-5).setScale(0.85).setAlpha(0.6).setVisible(false);
      this.movingScenery.push(pole, bush);
      this.environmentObjects.push(pole, bush);
    }

    // Rising Steam Plumes aligned directly to Steam Locomotive Chimney (x = 2365)
    for (let i = 0; i < 14; i++) {
      const steam = this.add.image(2360 + (Math.random() - 0.5) * 20, 588 - i * 12, 'particle_steam').setDepth(500);
      this.tweens.add({
        targets: steam,
        y: steam.y - 115,
        x: steam.x - 95,
        scale: 2.3,
        alpha: 0,
        duration: 2400 + i * 190,
        repeat: -1
      });
      this.stationTrainGroup.push(steam);
      this.environmentObjects.push(steam);
    }

    // Military Convoy Exit Point (Revealed in Mission 4 when leaves are cancelled)
    const exitCheckpost = this.add.image(1620, 725, 'concrete_fence_post').setDepth(5).setVisible(false);
    const exitWire = this.add.image(1740, 765, 'barbed_wire').setDepth(5).setScale(0.6).setVisible(false);
    const convoyJeep = this.add.image(1930, 760, this.textures.exists('jonga_rcl_hd') ? 'jonga_rcl_hd' : 'jonga_jeep')
      .setDepth(6).setScale(this.textures.exists('jonga_rcl_hd') ? 0.72 : 1.0).setFlipX(true).setVisible(false);
    const jeepHeadlight = this.add.triangle(1840, 765, 0, 0, -240, -45, -240, 55, 0xfff3b0, 0.18).setDepth(7).setVisible(false);
    this.stationExitConvoyGroup = [exitCheckpost, exitWire, convoyJeep, jeepHeadlight];
    this.environmentObjects.push(exitCheckpost, exitWire, convoyJeep, jeepHeadlight);

    // M3 Air-Raid Baggage Hazard + Sweeping AA Searchlight Beam
    this.stationBaggageHazard = this.add.image(1340, 774, this.textures.exists('ammo_crate_hd') ? 'ammo_crate_hd' : 'ammo_box')
      .setDepth(9).setScale(this.textures.exists('ammo_crate_hd') ? 0.52 : 1.1).setTint(0xa8a29e).setVisible(false);
    this.stationSearchlight = this.add.triangle(1420, 760, 0, 0, -240, -640, 120, -640, 0xfef08a, 0.13)
      .setDepth(-8).setVisible(false);
    this.environmentObjects.push(this.stationBaggageHazard, this.stationSearchlight);

    // Emergency Air-Raid Alarm Wash (Activated during Mission 3 siren)
    this.stationAlarmOverlay = this.add.rectangle(640, 360, 1280, 720, 0xd90429, 0)
      .setScrollFactor(0).setDepth(450).setVisible(false);
    this.environmentObjects.push(this.stationAlarmOverlay);

    // Level 4 (Z: 11): Distinct Station NPCs with clear horizontal spacing
    this.chaiwalaNPC = new NPC(this, 875, 755, 'npc_chaiwala', 'रामू चायवाला (Station Chaiwala)');
    this.chaiwalaNPC.setFacing(true);
    this.mpOfficerNPC = new NPC(this, 1690, 755, 'npc_mp_officer', 'कैप्टन शर्मा (Military Police)');
    this.mpOfficerNPC.setFacing(true);
    this.environmentObjects.push(this.chaiwalaNPC, this.mpOfficerNPC);
  }

  // ==========================================
  // ENVIRONMENT 2: THAR DESERT CONVOY
  // (Using user's authentic dunes_layer, ground_layer, khejri_tree, camel_silhouette, sandstone_rock, desert_shrub)
  // ==========================================
  setupConvoyEnvironment() {
    this.clearEnvironment();
    this.player.setSurface('sand');
    this.player.sprite.setPosition(420, 720);
    if (this.player.sprite.body) this.player.sprite.body.reset(420, 720);

    // Level 1 (Z: -100): Viewport-Locked Dusk Sky & Tiled Far Desert Dunes
    const sky = this.add.image(640, 360, 'sky_dusk').setScrollFactor(0).setDepth(-100);
    this.environmentObjects.push(sky);

    for (let x = 800; x < this.worldWidth + 1600; x += 1600) {
      const duneFar = this.add.image(x, 560, 'dune_far_dusk').setScrollFactor(0.18).setDepth(-90);
      this.environmentObjects.push(duneFar);
    }

    // Level 2 (Z: -50, Scroll: 0.45): Authentic User's dunes_layer.png
    for (let x = 960; x < this.worldWidth + 1000; x += 1920) {
      const duneMid = this.add.image(x, 580, 'dunes_layer').setScrollFactor(0.45).setDepth(-50);
      this.environmentObjects.push(duneMid);
    }

    // BSF Camel Patrol Silhouette patrolling the distant dunes
    const camel = this.add.image(1300, 530, 'camel_silhouette').setScrollFactor(0.35).setDepth(-45).setAlpha(0.85);
    this.tweens.add({
      targets: camel,
      x: '+=160',
      duration: 10000,
      yoyo: true,
      repeat: -1
    });
    this.environmentObjects.push(camel);

    // Authentic User's Khejri Desert Trees (Scroll: 0.55)
    [550, 1250, 1950, 2650, 3350].forEach(tx => {
      const tree = this.add.image(tx, 710, 'khejri_tree').setScrollFactor(0.55).setDepth(-40);
      this.environmentObjects.push(tree);
    });

    // Level 3 (Z: 0): Authentic User's ground_layer.png (Playable Sand & Rock Terrain)
    for (let x = 960; x < this.worldWidth + 1000; x += 1920) {
      const visualGround = this.add.image(x, 780, 'ground_layer').setDepth(0);
      this.environmentObjects.push(visualGround);
    }

    // Solid collision platform matching the ground_layer surface
    for (let x = 0; x < this.worldWidth; x += 512) {
      const p = this.platforms.create(x + 256, 852, 'trench_ground');
      p.setDepth(0);
      p.setVisible(false); // Invisible collision backing the high-res ground_layer
      p.refreshBody();
    }
    this.refreshPlatformCollider();

    // Authentic Sandstone Rocks along the convoy path
    [350, 1100, 1850, 2700].forEach(rx => {
      const rock = this.add.image(rx, 785, 'sandstone_rock').setDepth(5);
      this.environmentObjects.push(rock);
    });

    // Authentic Desert Shrubs scattered along ground
    [250, 680, 1020, 1500, 2150, 2900].forEach(sx => {
      const shrub = this.add.image(sx, 790, 'desert_shrub').setDepth(6);
      this.environmentObjects.push(shrub);
    });

    // Convoy Vehicles: Shaktiman 4x4 Army Truck & User's Authentic 106mm RCL Jonga Jeep
    const truck = this.add.image(950, 748, 'military_truck').setDepth(10);
    const jeep = this.add.image(635, 750, 'army_jeep_rcl').setDepth(10).setScale(0.9);
    this.environmentObjects.push(truck, jeep);

    // Tanot Mata Shrine, Signal Field Radio & Longewala Sector Barrier
    const convoyShrine = this.add.image(1150, 735, 'tanot_shrine').setDepth(11);
    const shrineGlow = this.add.circle(1150, 730, 42, 0xffbe55, 0.16).setDepth(10);
    const radioKey = this.textures.exists('field_radio_hd') ? 'field_radio_hd' : 'ammo_box';
    const convoyRadio = this.add.image(1480, 774, radioKey).setDepth(11).setScale(radioKey === 'field_radio_hd' ? 0.52 : 1.0);
    const radioLabel = this.add.text(1480, 718, '📡 RADIO 104.5 MHz', {
      fontSize: '11px',
      fontFamily: 'Rajdhani, sans-serif',
      fontStyle: 'bold',
      color: '#a7f3d0',
      backgroundColor: 'rgba(6, 78, 59, 0.85)',
      padding: { x: 6, y: 2 }
    }).setOrigin(0.5).setDepth(12);
    const gatePost = this.add.image(2000, 725, 'concrete_fence_post').setDepth(11);
    const gateWire = this.add.image(2065, 760, 'barbed_wire').setDepth(11).setScale(0.65);
    const gateSign = this.add.text(2000, 645, 'SECTOR GATE · LONGEWALA', {
      fontSize: '12px',
      fontFamily: 'Rajdhani, sans-serif',
      fontStyle: 'bold',
      color: '#fde68a',
      backgroundColor: 'rgba(17, 24, 39, 0.88)',
      padding: { x: 7, y: 3 }
    }).setOrigin(0.5).setDepth(12);
    this.environmentObjects.push(convoyShrine, shrineGlow, convoyRadio, radioLabel, gatePost, gateWire, gateSign);

    // Level 4 (Z: 100): Naik Gurdeep (Distinct Patrol Sprite)
    this.driverNPC = new NPC(this, 470, 755, 'npc_dharamveer', 'नायक गुरदीप (Jeep Driver)', {
      tint: 0xdcfce7,
      fallbackTexture: 'npc_mp_officer'
    });
    this.environmentObjects.push(this.driverNPC);

    // Level 5 (Z: 500): Flying Desert Dust
    for (let i = 0; i < 35; i++) {
      const dust = this.add.image(Phaser.Math.Between(0, this.worldWidth), Phaser.Math.Between(600, 850), 'particle_dust').setDepth(500);
      this.tweens.add({
        targets: dust,
        x: dust.x - 260,
        y: dust.y + Phaser.Math.Between(-15, 15),
        alpha: 0,
        duration: Phaser.Math.Between(1800, 3000),
        repeat: -1
      });
      this.environmentObjects.push(dust);
    }
  }

  // ==========================================
  // ENVIRONMENT 3: LONGEWALA OUTPOST (NIGHT)
  // (Using user's border_pillar, concrete_fence_post, barbed_wire, dunes_layer, ground_layer)
  // ==========================================
  setupOutpostEnvironment() {
    this.clearEnvironment();
    this.player.setSurface('sand');
    this.player.sprite.setPosition(420, 720);
    if (this.player.sprite.body) this.player.sprite.body.reset(420, 720);

    // Level 1 (Z: -100): Celestial Starry Night Sky & Full Moon (Locked to viewport!)
    const sky = this.add.image(640, 360, 'sky_night').setScrollFactor(0).setDepth(-100);
    this.dawnSkyOverlay = this.add.image(640, 360, 'dawn_sky_hd')
      .setDisplaySize(1280, 720).setScrollFactor(0).setDepth(-99).setAlpha(0);
    this.battleIllumOverlay = this.add.rectangle(640, 360, 1280, 720, 0xffd166, 0)
      .setScrollFactor(0).setDepth(435);
    this.redFlareOverlay = this.add.rectangle(640, 360, 1280, 720, 0xd90429, 0)
      .setScrollFactor(0).setDepth(440);
    this.environmentObjects.push(sky, this.dawnSkyOverlay, this.battleIllumOverlay, this.redFlareOverlay);

    // Level 1.5 (Z: -90, Scroll: 0.18): Far Desert Sand Ridges
    for (let x = 800; x < this.worldWidth + 1200; x += 1600) {
      const duneFar = this.add.image(x, 560, 'dune_far').setScrollFactor(0.18).setDepth(-90);
      this.environmentObjects.push(duneFar);
    }

    // Level 2 (Z: -50, Scroll: 0.45): Authentic User's dunes_layer.png under Desert Night Ambience
    for (let x = 960; x < this.worldWidth + 1200; x += 1920) {
      const duneMid = this.add.image(x, 580, 'dunes_layer').setScrollFactor(0.45).setDepth(-50);
      this.environmentObjects.push(duneMid);
    }

    // Level 3 (Z: 0): Authentic User's ground_layer.png (Trench Floor)
    for (let x = 960; x < this.worldWidth + 1200; x += 1920) {
      const visualGround = this.add.image(x, 780, 'ground_layer').setDepth(0);
      this.environmentObjects.push(visualGround);
    }

    // Solid collision platform
    for (let x = 0; x < this.worldWidth; x += 512) {
      const g = this.platforms.create(x + 256, 852, 'trench_ground');
      g.setDepth(0);
      g.setVisible(false);
      g.refreshBody();
    }
    this.refreshPlatformCollider();

    // Authentic User's Sandstone Rocks and Shrubs on the ridge
    [480, 1150, 1820, 2750].forEach(rx => {
      const rock = this.add.image(rx, 785, 'sandstone_rock').setDepth(5);
      this.environmentObjects.push(rock);
    });

    [580, 920, 1480, 2180, 2920].forEach(sx => {
      const shrub = this.add.image(sx, 790, 'desert_shrub').setDepth(6);
      this.environmentObjects.push(shrub);
    });

    // Outpost Watchtower (HD Asset Pack) with searchlight beam
    const towerKey = this.textures.exists('watchtower_hd') ? 'watchtower_hd' : 'watchtower';
    const tower = this.add.image(280, 682, towerKey).setDepth(5).setScale(towerKey === 'watchtower_hd' ? 1.52 : 1.0);
    const beam = this.add.triangle(280, 580, 0, 0, 360, 240, 500, 240, 0xfff3b0, 0.14).setDepth(6);
    this.tweens.add({ targets: beam, alpha: 0.24, yoyo: true, duration: 2000, repeat: -1 });
    this.environmentObjects.push(tower, beam);

    // User's Authentic Longewala War Memorial Monument (with 23 Punjab 1971 plaque)
    const memorial = this.add.image(505, 663, 'longewala_memorial').setScale(0.75).setDepth(11);
    const memorialPlaque = this.add.text(505, 663, '23 PUNJAB\n1971', {
      fontSize: '8px',
      fontFamily: 'Cinzel, serif',
      fontStyle: 'bold',
      color: '#3b200e',
      align: 'center'
    }).setOrigin(0.5).setDepth(12);
    this.environmentObjects.push(memorial, memorialPlaque);

    // Command Bunker & Tactical Props (HD Asset Pack)
    if (this.textures.exists('ruined_bunker_hd')) {
      const bunker = this.add.image(1345, 750, 'ruined_bunker_hd').setDepth(4).setScale(1.15);
      this.environmentObjects.push(bunker);
    }
    if (this.textures.exists('flag_india_hd')) {
      const tiranga = this.add.image(1360, 650, 'flag_india_hd').setDepth(7).setScale(0.58);
      this.environmentObjects.push(tiranga);
    }
    if (this.textures.exists('field_radio_hd')) {
      const radio = this.add.image(1290, 778, 'field_radio_hd').setDepth(10).setScale(0.45);
      this.environmentObjects.push(radio);
    }
    if (this.textures.exists('lantern_hd')) {
      const lantern = this.add.image(1248, 774, 'lantern_hd').setDepth(10).setScale(0.38);
      const glow = this.add.circle(1248, 770, 32, 0xffbe55, 0.16).setDepth(9);
      this.environmentObjects.push(lantern, glow);
    }

    // Realistic Sandbag Defensive Walls
    const wallKey = this.textures.exists('sandbag_wall_hd') ? 'sandbag_wall_hd' : 'sandbag_wall';
    const wallScale = wallKey === 'sandbag_wall_hd' ? 0.72 : 1.0;
    const wall1 = this.add.image(650, 782, wallKey).setDepth(10).setScale(wallScale);
    const wall2 = this.add.image(1220, 782, wallKey).setDepth(10).setScale(wallScale);
    const wall3 = this.add.image(2160, 782, wallKey).setDepth(10).setScale(wallScale);
    this.environmentObjects.push(wall1, wall2, wall3);

    // 106mm RCL Anti-Tank Jonga Gun Jeep (HD Asset Pack)
    const jeepKey = this.textures.exists('jonga_rcl_hd') ? 'jonga_rcl_hd' : 'army_jeep_rcl';
    this.outpostRclJeep = this.add.image(960, 752, jeepKey).setDepth(10).setScale(jeepKey === 'jonga_rcl_hd' ? 0.78 : 0.9);
    this.environmentObjects.push(this.outpostRclJeep);

    // Distinct Historical Key Story Characters (HD Pack Sprites scaled to match 1971 Soldier Devrath)
    // 1. Major Kuldip Singh Chandpuri (Bunker Command Post)
    this.majorChandpuri = new NPC(
      this, 1405, 749,
      'npc_chandpuri_hd', 'मेजर चांदपुरी (23 Punjab CO)',
      { scale: 0.48, tagOffsetY: 66, fallbackTexture: 'npc_chandpuri' }
    );

    // 2. Authentic Rajasthani Tanot Mata Mandir Shrine (Altar of Faith)
    const shrine = this.add.image(1640, 735, 'tanot_shrine').setDepth(12);

    // 3. BSF Naik Bhairon Singh (Trench Defense Line)
    this.bhaironSingh = new NPC(
      this, 1800, 749,
      'npc_bhairon_hd', 'नायक भैरों सिंह (BSF)',
      { scale: 0.45, tagOffsetY: 66, fallbackTexture: 'npc_bhairon_singh' }
    );

    // 4. 2Lt Dharam Veer (Forward Observation Patrol)
    this.dharamveer = new NPC(this, 2460, 755, 'npc_dharamveer', '2Lt धरमवीर (Forward Patrol)');

    this.environmentObjects.push(this.majorChandpuri, shrine, this.bhaironSingh, this.dharamveer);

    // ========================================================
    // AUTHENTIC USER'S BORDER PILLAR 638 (BP-638) & FENCE POSTS
    // ========================================================
    const bp638 = this.add.image(2600, 715, 'border_pillar').setDepth(15);
    const bpLabel = this.add.text(2600, 625, 'BP-638 (Border Pillar)', {
      fontSize: '12px',
      fontFamily: 'Rajdhani, sans-serif',
      fontStyle: 'bold',
      color: '#ffd166',
      backgroundColor: 'rgba(10, 5, 20, 0.85)',
      padding: { x: 6, y: 2 }
    }).setOrigin(0.5).setDepth(20);
    this.environmentObjects.push(bp638, bpLabel);

    // Authentic User's Concrete Fence Posts & Border Barbed Wire along the boundary line
    [2340, 2400, 2680, 2760].forEach(fx => {
      const post = this.add.image(fx, 725, 'concrete_fence_post').setDepth(12);
      this.environmentObjects.push(post);
    });
    const borderWireLeft = this.add.image(2370, 760, 'barbed_wire').setDepth(11).setScale(0.65);
    const borderWireRight = this.add.image(2720, 760, 'barbed_wire').setDepth(11).setScale(0.75);
    this.environmentObjects.push(borderWireLeft, borderWireRight);

    // User's Authentic Knocked-Out Enemy Tanks in No Man's Land (Longewala Kill Zone)
    [
      { x: 2940, y: 738, scale: 0.92 },
      { x: 3360, y: 736, scale: 0.84 }
    ].forEach(wreck => {
      const tankWreck = this.add.image(wreck.x, wreck.y, 'destroyed_tank')
        .setDepth(8).setScale(wreck.scale).setFlipX(true);
      this.environmentObjects.push(tankWreck);

      // Rising dark battle smoke over wrecked hull
      for (let i = 0; i < 6; i++) {
        const smoke = this.add.image(wreck.x + (i % 2 ? 12 : -10), wreck.y - 46 - i * 10, 'particle_steam')
          .setDepth(500).setTint(0x454545).setAlpha(0.5);
        this.tweens.add({
          targets: smoke,
          y: smoke.y - 95,
          x: smoke.x - 40,
          scale: 2.4,
          alpha: 0,
          duration: 2400 + i * 320,
          repeat: -1
        });
        this.environmentObjects.push(smoke);
      }
    });

    // Interactive Props for Mission 9 & Mission 14 (Spaced out for easy pickup)
    const crateTex = this.textures.exists('ammo_crate_hd') ? 'ammo_crate_hd' : 'ammo_box';
    this.sandbagProp = this.add.image(1920, 795, 'sandbag_single').setDepth(100);
    this.ammoCrateProp = this.add.image(2020, 792, crateTex).setDepth(100)
      .setScale(crateTex === 'ammo_crate_hd' ? 0.56 : 1.0);
    this.bunkerCrateProp = this.add.image(1220, 790, this.textures.exists('rcl_crate_hd') ? 'rcl_crate_hd' : crateTex)
      .setDepth(100).setScale(0.45).setVisible(false);
    this.environmentObjects.push(this.sandbagProp, this.ammoCrateProp, this.bunkerCrateProp);
  }

  // ==========================================
  // DYNAMIC ENVIRONMENT RESOLVER & STATE MACHINE
  // ==========================================
  getRequiredEnvironment(missionId) {
    if (missionId >= 6) return 'outpost';
    if (missionId === 5) return 'convoy';
    return 'station';
  }

  ensureEnvironmentForMission(missionId, onReady) {
    const required = this.getRequiredEnvironment(missionId);
    if (this.currentEnvironment === required) {
      if (onReady) onReady();
      return;
    }

    const switchEnv = () => {
      this.currentEnvironment = required;
      if (required === 'station') {
        this.setupStationEnvironment();
      } else if (required === 'convoy') {
        this.setupConvoyEnvironment();
      } else if (required === 'outpost') {
        this.setupOutpostEnvironment();
      }
      if (onReady) onReady();
    };

    // If changing environment mid-game, fade smoothly; if initial load, run immediately
    if (this.currentEnvironment && window.cutsceneManager) {
      window.cutsceneManager.fadeToBlack(500, () => {
        switchEnv();
      });
    } else {
      switchEnv();
    }
  }

  // ==========================================
  // MISSION STATE MACHINE & SCENARIO LOGIC
  // ==========================================
  setStationStage(stage) {
    this.stationStage = stage;
    const showTrain = stage !== 'exit_convoy';
    if (this.stationTrainGroup) {
      this.stationTrainGroup.forEach(obj => { if (obj && obj.setVisible) obj.setVisible(showTrain); });
    }
    if (this.movingScenery) {
      const showMoving = stage === 'moving_train';
      this.movingScenery.forEach(obj => { if (obj && obj.setVisible) obj.setVisible(showMoving); });
    }
    if (this.stationExitConvoyGroup) {
      this.stationExitConvoyGroup.forEach(obj => { if (obj && obj.setVisible) obj.setVisible(!showTrain); });
    }
    if (this.stationBaggageHazard) {
      this.stationBaggageHazard.setVisible(stage === 'emergency');
    }
    if (this.stationSearchlightTween) {
      this.stationSearchlightTween.stop();
      this.stationSearchlightTween = null;
    }
    if (this.stationSearchlight) {
      if (stage === 'emergency') {
        this.stationSearchlight.setVisible(true).setAngle(-18);
        this.stationSearchlightTween = this.tweens.add({
          targets: this.stationSearchlight,
          angle: 22,
          duration: 1500,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      } else {
        this.stationSearchlight.setVisible(false);
      }
    }
    if (this.stationAlarmTween) {
      this.stationAlarmTween.stop();
      this.stationAlarmTween = null;
    }
    if (this.stationAlarmOverlay) {
      if (stage === 'emergency') {
        this.stationAlarmOverlay.setVisible(true).setAlpha(0.02);
        this.stationAlarmTween = this.tweens.add({
          targets: this.stationAlarmOverlay,
          alpha: 0.14,
          duration: 550,
          yoyo: true,
          repeat: -1
        });
      } else {
        this.stationAlarmOverlay.setVisible(false).setAlpha(0);
      }
    }
  }

  handleMissionStart(mission) {
    this.resetExtendedCombatState();
    this.updateHUDObjective(mission.chapter, mission.title, mission.objective);

    this.ensureEnvironmentForMission(mission.id, () => {
      // Ensure Outpost sky/atmosphere transitions match mission timeline
      if (this.dawnSkyOverlay) {
        const dawnAlphas = { 15: 0.14, 16: 0.65, 17: 0.85, 18: 1.0 };
        this.dawnSkyOverlay.setAlpha(dawnAlphas[mission.id] || 0);
      }
      if (this.redFlareOverlay) {
        this.redFlareOverlay.setAlpha([13, 14, 15].includes(mission.id) ? 0.11 : 0);
      }
      if (this.battleIllumOverlay) {
        this.battleIllumOverlay.setAlpha(mission.id === 12 ? 0.16 : 0);
      }

      switch (mission.id) {
        case 1:
          window.soundEngine.startAmbience('station');
          window.soundEngine.playSteamWhistle();
          this.setStationStage('platform');
          this.m1State = { chaiDrank: false, ticketChecked: false };
          this.player.sprite.setPosition(260, 720);
          if (this.player.sprite.body) this.player.sprite.body.reset(260, 720);
          break;

        case 2:
          window.soundEngine.startAmbience('station');
          window.soundEngine.playSteamWhistle();
          this.setStationStage('moving_train');
          this.m2WaitingLetter = false;
          this.player.sprite.setPosition(1830, 720);
          if (this.player.sprite.body) this.player.sprite.body.reset(1830, 720);
          break;

        case 3: {
          window.soundEngine.startAmbience('station');
          window.soundEngine.startAirRaidSiren();
          this.setStationStage('emergency');
          this.m3Stumbled = false;
          this.cameraController.shake(0.006, 260);
          this.player.sprite.setPosition(740, 720);
          if (this.player.sprite.body) this.player.sprite.body.reset(740, 720);
          const jetEvent = this.time.addEvent({
            delay: 3400,
            loop: true,
            callback: () => {
              if (!this.textures.exists('hawker_hunter') || this.stationStage !== 'emergency') return;
              if (window.soundEngine.playJetRoar) window.soundEngine.playJetRoar();
              const jet = this.add.image(2350, 185, 'hawker_hunter').setDepth(-7).setScale(0.42).setAlpha(0.75).setFlipX(true);
              this.tweens.add({ targets: jet, x: 350, y: 140, duration: 1450, onComplete: () => jet.destroy() });
            }
          });
          this.extendedTimers.push(jetEvent);
          break;
        }

        case 4:
          window.soundEngine.startAmbience('station');
          window.soundEngine.stopAirRaidSiren();
          this.setStationStage('exit_convoy');
          this.m4State = { passSurrendered: false };
          this.player.sprite.setPosition(1400, 720);
          if (this.player.sprite.body) this.player.sprite.body.reset(1400, 720);
          break;

        case 5:
          window.soundEngine.startAmbience('convoy');
          this.m5State = { blessed: false, radioTuned: false };
          this.player.sprite.setPosition(420, 720);
          if (this.player.sprite.body) this.player.sprite.body.reset(420, 720);
          break;

        case 6:
          window.soundEngine.startAmbience('night_outpost');
          this.m6FlareState = { active: false, triggered: false, crouchedSuccess: false };
          this.player.sprite.setPosition(420, 720);
          if (this.player.sprite.body) this.player.sprite.body.reset(420, 720);
          break;

        case 7:
          window.soundEngine.startAmbience('night_outpost');
          this.player.sprite.setPosition(2460, 720);
          if (this.player.sprite.body) this.player.sprite.body.reset(2460, 720);
          if (this.enemyTankColumn) this.enemyTankColumn.destroy();
          this.enemyTankColumn = new EnemyTankColumn(this, 2940, 742, 2);
          this.enemyTankColumn.startAdvancing();
          if (window.soundEngine.startTankEngineLoop) window.soundEngine.startTankEngineLoop(0.14);
          break;

        case 8:
          window.soundEngine.startAmbience('night_outpost');
          this.player.sprite.setPosition(1380, 720);
          if (this.player.sprite.body) this.player.sprite.body.reset(1380, 720);
          this.cameraController.panTo(1380, 540, 900, 1.0);
          break;

        case 9:
          window.soundEngine.startAmbience('night_outpost');
          this.player.sprite.setPosition(1920, 720);
          if (this.player.sprite.body) this.player.sprite.body.reset(1920, 720);
          if (this.sandbagProp) this.sandbagProp.setVisible(true);
          if (this.ammoCrateProp) this.ammoCrateProp.setVisible(true);
          if (this.bunkerCrateProp) this.bunkerCrateProp.setVisible(false);
          this.mission9State = { sandbagDelivered: false, ammoDelivered: false, wirePlaced: false };
          this.setupMission9Interactions();
          break;

        case 10:
          window.soundEngine.startAmbience('night_outpost');
          this.player.sprite.setPosition(1220, 720);
          if (this.player.sprite.body) this.player.sprite.body.reset(1220, 720);
          // Frame both RCL Jeep/Trench on left AND advancing Type-59 Tanks on right
          this.cameras.main.startFollow(this.player.sprite, true, 0.08, 0.08);
          this.cameras.main.setFollowOffset(-210, 0);
          if (this.enemyTankColumn) this.enemyTankColumn.destroy();
          this.enemyTankColumn = new EnemyTankColumn(this, 2240, 742, 3);
          this.m10AmbushState = { ready: false, fired: false, warnedEarly: false, zoneAnnounced: false, meters: 380 };
          window.soundEngine.playTankRumble();
          if (window.soundEngine.startTankEngineLoop) window.soundEngine.startTankEngineLoop(0.16);
          this.cameraController.shake(0.005, 220);
          this.setupMission10Interactions();
          break;

        case 11:
          window.soundEngine.startAmbience('night_outpost');
          this.player.sprite.setPosition(960, 720);
          if (this.player.sprite.body) this.player.sprite.body.reset(960, 720);
          if (this.enemyTankColumn) this.enemyTankColumn.destroy();
          this.enemyTankColumn = new EnemyTankColumn(this, 1540, 742, 3);
          this.enemyTankColumn.startAdvancing();
          if (window.soundEngine.startTankEngineLoop) window.soundEngine.startTankEngineLoop(0.24);
          this.cameras.main.setZoom(1.0);
          this.cameras.main.stopFollow();
          this.cameras.main.pan(1310, 520, 600);
          break;

        case 12:
          window.soundEngine.startAmbience('night_outpost');
          this.player.sprite.setPosition(960, 720);
          if (this.player.sprite.body) this.player.sprite.body.reset(960, 720);
          if (this.enemyTankColumn) this.enemyTankColumn.destroy();
          this.enemyTankColumn = new EnemyTankColumn(this, 1540, 742, 3);
          this.enemyTankColumn.convertToWreck(0);
          this.enemyTankColumn.startAdvancing();
          if (window.soundEngine.startTankEngineLoop) window.soundEngine.startTankEngineLoop(0.18);
          this.spawnWaveSoldiers([1660, 1860, 2060], 'stand');
          break;

        case 13:
          window.soundEngine.startAmbience('night_outpost');
          this.player.sprite.setPosition(680, 720);
          if (this.player.sprite.body) this.player.sprite.body.reset(680, 720);
          if (this.enemyTankColumn) this.enemyTankColumn.destroy();
          this.enemyTankColumn = new EnemyTankColumn(this, 2320, 742, 3);
          this.enemyTankColumn.convertToWreck(0);
          if (window.soundEngine.startTankEngineLoop) window.soundEngine.startTankEngineLoop(0.12);
          this.spawnWaveSoldiers([1420, 1680, 1940], 'march');
          break;

        case 14:
          window.soundEngine.startAmbience('night_outpost');
          this.player.sprite.setPosition(1120, 720);
          if (this.player.sprite.body) this.player.sprite.body.reset(1120, 720);
          if (this.bunkerCrateProp) this.bunkerCrateProp.setVisible(true);
          break;

        case 15:
          window.soundEngine.startAmbience('night_outpost');
          this.player.sprite.setPosition(1220, 720);
          if (this.player.sprite.body) this.player.sprite.body.reset(1220, 720);
          break;

        case 16:
          window.soundEngine.startAmbience('convoy');
          this.player.sprite.setPosition(1420, 720);
          if (this.player.sprite.body) this.player.sprite.body.reset(1420, 720);
          if (this.enemyTankColumn) this.enemyTankColumn.destroy();
          this.enemyTankColumn = new EnemyTankColumn(this, 2520, 742, 3);
          if (window.soundEngine.startTankEngineLoop) window.soundEngine.startTankEngineLoop(0.14);
          break;

        case 17:
          window.soundEngine.startAmbience('convoy');
          this.player.sprite.setPosition(1740, 720);
          if (this.player.sprite.body) this.player.sprite.body.reset(1740, 720);
          if (this.enemyTankColumn) this.enemyTankColumn.destroy();
          this.enemyTankColumn = new EnemyTankColumn(this, 1860, 742, 4);
          this.spawnWaveSoldiers([1940, 2210, 2480], 'stand');
          if (window.soundEngine.startTankEngineLoop) window.soundEngine.startTankEngineLoop(0.20);
          this.cameras.main.setZoom(1.0);
          this.cameras.main.stopFollow();
          this.cameras.main.pan(2230, 520, 700);
          break;

        case 18:
          if (window.soundEngine && typeof window.soundEngine.stopTankEngineLoop === 'function') {
            window.soundEngine.stopTankEngineLoop();
          }
          window.soundEngine.startAmbience('station');
          this.player.sprite.setPosition(900, 720);
          if (this.player.sprite.body) this.player.sprite.body.reset(900, 720);
          this.cameras.main.setZoom(1.0);
          this.cameras.main.startFollow(this.player.sprite, true, 0.08, 0.08);
          if (this.enemyTankColumn) this.enemyTankColumn.destroy();
          this.enemyTankColumn = new EnemyTankColumn(this, 2100, 742, 4);
          for (let i = 0; i < 4; i++) this.enemyTankColumn.convertToWreck(i);
          break;
      }
    });
  }

  handleDialogueFinished(mission) {
    switch (mission.id) {
      case 1:
        this.interactionManager.register(
          'ramu_chai', 875, 755, 110,
          '🍵 रामू से गरम मसाला चाय लें (Drink Chai)',
          () => {
            if (!this.m1State) this.m1State = {};
            this.m1State.chaiDrank = true;
            this.showActionToast('☕ गरम कुल्हड़ चाय पी! अब टिकट काउंटर (x=1450) जाँचें।', '#fbbf24', 2200);
          },
          () => !(this.m1State && this.m1State.chaiDrank)
        );
        this.interactionManager.register(
          'verify_ticket', 1450, 755, 120,
          '🎫 छुट्टी का रेलवे टिकट जाँचें (Inspect Leave Warrant)',
          () => {
            window.cutsceneManager.showTicketModal(() => {
              if (!this.m1State) this.m1State = {};
              this.m1State.ticketChecked = true;
              this.showActionToast('✅ टिकट वेरिफाइड! अब ट्रेन कोच [1850] में चढ़ें!', '#2ec4b6', 2400);
            }, false);
          },
          () => !(this.m1State && this.m1State.ticketChecked)
        );
        this.interactionManager.register(
          'coach_entrance', 1850, 755, 140,
          '🚂 ट्रेन के डिब्बे में प्रवेश करें (Board Shekhawati Mail)',
          () => {
            if (this.m1State && !this.m1State.ticketChecked) {
              window.cutsceneManager.showTicketModal(() => {
                this.m1State.ticketChecked = true;
                this.missionManager.completeMission();
              }, false);
            } else {
              this.missionManager.completeMission();
            }
          }
        );
        break;

      case 2:
        this.m2WaitingLetter = true;
        this.showActionToast('✉️ [SPACE] या [E] दबाकर माँ की चिट्ठी खोलें!', '#fbbf24', 3200);
        this.interactionManager.register(
          'coach_letter', 1830, 755, 280,
          '✉️ [SPACE] / [E] — माँ की चिट्ठी पढ़ें (Read Mother\'s Letter)',
          () => {
            this.openMission2Letter();
          },
          () => Boolean(this.m2WaitingLetter)
        );
        break;

      case 3:
        this.updateCombatHud('⚠️ AIR RAID EMERGENCY!', 'SPRINT EAST TO EXIT [1850] · JUMP CRATES [SPACE]');
        this.showActionToast('🚨 एयर-रेड! दाएँ भागें और रास्ते के सामान से [SPACE] दबाकर कूदें!', '#ff6b6b', 3000);
        this.interactionManager.register(
          'station_exit', 1850, 755, 150,
          '🏃 स्टेशन निकास द्वार पर पहुँचें (Reach Station Exit Post)',
          () => {
            this.missionManager.completeMission();
          }
        );
        break;

      case 4:
        this.interactionManager.register(
          'surrender_pass', 1690, 755, 120,
          '🎖️ कैप्टन शर्मा को छुट्टी पास सौंपें (Surrender Leave Pass)',
          () => {
            window.cutsceneManager.showTicketModal(() => {
              if (!this.m4State) this.m4State = {};
              this.m4State.passSurrendered = true;
              if (window.inventoryManager) window.inventoryManager.markTicketCancelled(true);
              this.showActionToast('छुट्टी रद्द! अब जोंगा कॉन्वॉय जीप (1930) में सवार हों!', '#fbbf24', 2500);
            }, true);
          },
          () => !(this.m4State && this.m4State.passSurrendered)
        );
        this.interactionManager.register(
          'board_jeep', 1930, 755, 150,
          '🚙 कॉन्वॉय जीप में बैठें (Mount Jonga Convoy Jeep)',
          () => {
            if (window.soundEngine.playTankRumble) window.soundEngine.playTankRumble();
            this.missionManager.completeMission();
          },
          () => Boolean(this.m4State && this.m4State.passSurrendered)
        );
        break;

      case 5:
        this.interactionManager.register(
          'tanot_blessing', 1150, 755, 120,
          '🙏 तनोट माता मंदिर: पवित्र मिट्टी माथे से लगाएँ',
          () => {
            if (!this.m5State) this.m5State = {};
            this.m5State.blessed = true;
            if (window.inventoryManager) window.inventoryManager.giveItem('tanot_clay');
            this.showActionToast('🙏 तनोट माता का आशीर्वाद मिला! अब रेडियो (1480) ट्यून करें।', '#fbbf24', 2400);
          },
          () => !(this.m5State && this.m5State.blessed)
        );
        this.interactionManager.register(
          'tune_radio', 1480, 755, 120,
          '📡 फील्ड रेडियो (104.5 MHz) ट्यून करें (Major Chandpuri Orders)',
          () => {
            if (!this.m5State) this.m5State = {};
            this.m5State.radioTuned = true;
            window.soundEngine.playRifleCock();
            this.showActionToast('📻 104.5 MHz: "LONGEWALA REPORT IMMEDIATELY!" आगे चौकी [2000] जाएं।', '#2ec4b6', 2600);
          },
          () => !(this.m5State && this.m5State.radioTuned)
        );
        this.interactionManager.register(
          'outpost_arrival', 2000, 755, 150,
          '🚩 लोंगेवाला चौकी में प्रवेश करें (Enter Longewala Outpost)',
          () => {
            this.missionManager.completeMission();
          },
          () => Boolean(this.m5State && this.m5State.radioTuned)
        );
        break;

      case 6:
        if (window.inventoryManager) window.inventoryManager.giveItem('binoculars');
        this.updateCombatHud('NIGHT RECON · BP-638', 'ADVANCE EAST · CROUCH [S] UNDER ENEMY FLARES');
        this.showActionToast('🔭 दूरबीन मिली! फ्लेयर रोशनी में [S] दबाकर झुकें, BP-638 (2460) जाएं!', '#fbbf24', 2800);
        // Raise binoculars at BP-638 (x = 2460)
        this.interactionManager.register(
          'raise_binoculars', 2460, 755, 160,
          '🔭 दूरबीन उठाएँ (Raise Binoculars — Scan Border Pillar 638)',
          () => {
            window.cutsceneManager.showBinoculars((spotted) => {
              if (spotted) {
                this.missionManager.completeMission();
              }
            });
          }
        );
        break;

      case 7:
        this.updateCombatHud('URGENT ARMOR ALERT!', 'HOLD [SHIFT] + [A] SPRINT WEST TO CHANDPURI BUNKER [1405]');
        this.showActionToast('⚠️ 40+ TYPE-59 TANKS SPOT! BUNKER (1405) की तरफ भागें!', '#ff6b6b', 3000);
        this.interactionManager.register(
          'alert_bunker', 1405, 755, 150,
          '📻 मेजर चांदपुरी को तुरंत चेतावनी दें! (Report to Major Chandpuri!)',
          () => {
            this.missionManager.completeMission();
          }
        );
        break;

      case 8:
        this.cameraController.zoomTo(1.0, 500);
        this.interactionManager.register(
          'stand_to_oath', 1380, 755, 150,
          '🇮🇳 मेजर चांदपुरी के साथ लौंगेवाला संकल्प लें (Take Stand-To Oath)',
          () => {
            this.interactionManager.clear();
            if (window.soundEngine && window.soundEngine.playVictoryCall) {
              window.soundEngine.playVictoryCall();
            }
            if (window.inventoryManager) window.inventoryManager.giveItem('longewala_oath');
            this.showActionToast('🇮🇳 BOLE SO NIHAL... SAT SRI AKAL! हम यहीं डटे रहेंगे!', '#2ec4b6', 2500);
            this.time.delayedCall(1200, () => {
              this.missionManager.completeMission();
            });
          }
        );
        break;

      case 9:
        this.setupMission9Interactions();
        break;

      case 10:
        if (this.m10AmbushState) this.m10AmbushState.ready = true;
        this.setupMission10Interactions();
        break;

      case 11:
        this.setupMission11();
        break;

      case 12:
        this.setupMission12();
        break;

      case 13:
        this.setupMission13();
        break;

      case 14:
        this.setupMission14();
        break;

      case 15:
        this.setupMission15();
        break;

      case 16:
        this.setupMission16();
        break;

      case 17:
        this.setupMission17();
        break;

      case 18:
        this.setupMission18();
        break;
    }
  }

  openMission2Letter() {
    if (!this.m2WaitingLetter) return;
    this.m2WaitingLetter = false;
    this.interactionManager.clear();
    if (window.cutsceneManager) {
      window.cutsceneManager.showLetterModal(() => {
        this.missionManager.completeMission();
      });
    }
  }

  updateMission9Hud() {
    if (!this.mission9State) return;
    const done = (this.mission9State.sandbagDelivered ? 1 : 0) +
      (this.mission9State.ammoDelivered ? 1 : 0) +
      (this.mission9State.wirePlaced ? 1 : 0);
    this.updateCombatHud(
      `FORTIFY OUTPOST · ${done}/3 COMPLETE`,
      `SANDBAG ${this.mission9State.sandbagDelivered ? '✓' : '1920→1560'} · AMMO ${this.mission9State.ammoDelivered ? '✓' : '2020→1220'} · WIRE ${this.mission9State.wirePlaced ? '✓' : '2240'}`
    );
  }

  setupMission9Interactions() {
    if (!this.mission9State) {
      this.mission9State = { sandbagDelivered: false, ammoDelivered: false, wirePlaced: false };
    }
    this.updateMission9Hud();

    // 1. Pick up & place sandbag wall at forward trench (1920 -> 1560)
    this.interactionManager.register(
      'pickup_sandbag', 1920, 795, 110,
      '🧱 रेत की बोरी उठाएँ (Pick up Sandbag Wall)',
      () => {
        window.soundEngine.playSandbagThud();
        this.player.setCarrying(true, 'sandbag');
        if (this.sandbagProp) this.sandbagProp.setVisible(false);
        this.showActionToast('बोरी उठाई! बाएँ खंदक (x=1560) पर रखें!', '#fbbf24', 2200);
      },
      () => Boolean(this.mission9State && !this.player.isCarrying && !this.mission9State.sandbagDelivered)
    );

    this.interactionManager.register(
      'deliver_sandbag', 1560, 785, 130,
      '🧱 खंदक पर रेत की दीवार मजबूत करें (Reinforce Trench Wall)',
      () => {
        window.soundEngine.playSandbagThud();
        this.player.setCarrying(false);
        this.mission9State.sandbagDelivered = true;
        const wk = this.textures.exists('sandbag_wall_hd') ? 'sandbag_wall_hd' : 'sandbag_wall';
        const placedWall = this.add.image(1560, 782, wk).setDepth(12).setScale(wk === 'sandbag_wall_hd' ? 0.68 : 1.0);
        this.environmentObjects.push(placedWall);
        this.updateMission9Hud();
        this.checkMission9Completion();
      },
      () => Boolean(this.mission9State && this.player.isCarrying && this.player.carriedType === 'sandbag')
    );

    // 2. Pick up MMG ammo box & deliver to Gun Pit (2020 -> 1220)
    this.interactionManager.register(
      'pickup_ammo', 2020, 795, 110,
      '📦 MMG गोला-बारूद पेटी उठाएँ (Pick up MMG Ammo Box)',
      () => {
        window.soundEngine.playAmmoCrate();
        this.player.setCarrying(true, 'ammo_box');
        if (this.ammoCrateProp) this.ammoCrateProp.setVisible(false);
        this.showActionToast('गोला-बारूद उठाया! गन पिट (x=1220) तक ले जाएं!', '#fbbf24', 2200);
      },
      () => Boolean(this.mission9State && !this.player.isCarrying && !this.mission9State.ammoDelivered)
    );

    this.interactionManager.register(
      'deliver_ammo', 1220, 785, 130,
      '📦 MMG बंकर में गोला-बारूद पहुँचाएँ (Deliver Ammo to Bunker)',
      () => {
        window.soundEngine.playAmmoCrate();
        this.player.setCarrying(false);
        this.mission9State.ammoDelivered = true;
        if (this.bunkerCrateProp) this.bunkerCrateProp.setVisible(true);
        this.updateMission9Hud();
        this.checkMission9Completion();
      },
      () => Boolean(this.mission9State && this.player.isCarrying && this.player.carriedType === 'ammo_box')
    );

    // 3. Stretch authentic deceptive barbed wire across ridge (2240)
    this.interactionManager.register(
      'lay_wire', 2240, 785, 130,
      '🚧 कांटेदार तार की बाड़ खींचें (Stretch Deceptive Cattle Fence Wire)',
      () => {
        window.soundEngine.playSandbagThud();
        this.mission9State.wirePlaced = true;
        const wk = this.textures.exists('barbed_wire_hd') ? 'barbed_wire_hd' : 'barbed_wire';
        const wire1 = this.add.image(2240, 775, wk).setDepth(15).setScale(wk === 'barbed_wire_hd' ? 0.85 : 1.0);
        const wire2 = this.add.image(2340, 775, wk).setDepth(15).setScale(wk === 'barbed_wire_hd' ? 0.85 : 1.0);
        this.environmentObjects.push(wire1, wire2);
        this.updateMission9Hud();
        this.checkMission9Completion();
      },
      () => Boolean(this.mission9State && !this.player.isCarrying && !this.mission9State.wirePlaced)
    );
  }

  checkMission9Completion() {
    if (this.mission9State && this.mission9State.sandbagDelivered && this.mission9State.ammoDelivered && this.mission9State.wirePlaced) {
      this.showActionToast('✅ OUTPOST FORTIFIED (3/3)! READY FOR THE LONG NIGHT!', '#2ec4b6', 2000);
      this.scheduleMissionComplete(900);
    }
  }

  setupMission10Interactions() {
    this.updateCombatHud('HOLD FIRE! DO NOT SHOOT YET', 'ENEMY ARMOR ADVANCING · WAIT UNTIL ≤ 150m');
    this.interactionManager.register(
      'ready_position', 1220, 785, 360,
      '🎯 150m किल-ज़ोन में RCL एम्बुश दागें! (Fire RCL Ambush Volley! [E] / [J])',
      () => {
        this.triggerMission10Volley();
      },
      () => Boolean(this.m10AmbushState && this.m10AmbushState.ready && !this.m10AmbushState.fired && this.m10AmbushState.meters <= 155)
    );
  }

  triggerMission10Volley() {
    if (!this.m10AmbushState || this.m10AmbushState.fired) return;
    this.m10AmbushState.fired = true;
    this.interactionManager.clear();
    this.cameras.main.setFollowOffset(0, 0);

    window.soundEngine.playRifleCock();
    window.soundEngine.playTankRumble();
    this.cameraController.shake(0.005, 220);

    // 106mm RCL Jonga Jeep Fires Anti-Tank Shell toward Advancing Enemy Tank Column
    const startX = this.outpostRclJeep ? this.outpostRclJeep.x + 85 : 1045;
    const startY = this.outpostRclJeep ? this.outpostRclJeep.y - 42 : 708;
    const fireTimer = this.time.delayedCall(260, () => {
      if (!this.m10AmbushState || !this.m10AmbushState.fired) return;
      if (window.soundEngine.playRCLBlast) window.soundEngine.playRCLBlast();
      const fk = this.textures.exists('muzzle_flash_hd') ? 'muzzle_flash_hd' : 'muzzle_flash';
      const flash = this.add.image(startX, startY, fk).setDepth(115).setScale(fk === 'muzzle_flash_hd' ? 0.72 : 2.6);
      this.tweens.add({ targets: flash, alpha: 0, scale: flash.scaleX * 1.35, duration: 160, onComplete: () => flash.destroy() });

      const targetTank = (this.enemyTankColumn && this.enemyTankColumn.tanks && this.enemyTankColumn.tanks[0])
        ? this.enemyTankColumn.tanks[0] : null;
      const impactX = targetTank && targetTank.sprite ? targetTank.sprite.x : 1760;
      const impactY = targetTank && targetTank.sprite ? targetTank.sprite.y : 720;

      const tk = this.textures.exists('bullet_tracer_hd') ? 'bullet_tracer_hd' : 'bullet_tracer';
      const shell = this.add.image(startX + 20, startY, tk)
        .setDepth(114).setScale(tk === 'bullet_tracer_hd' ? 0.52 : 2.8);
      this.tweens.add({
        targets: shell,
        x: impactX,
        y: impactY,
        duration: 280,
        ease: 'Power1',
        onComplete: () => {
          shell.destroy();
          if (window.soundEngine.playFuelExplosion) window.soundEngine.playFuelExplosion();
          this.spawnExplosionSequence(impactX, impactY - 14, 2.1);
          this.cameraController.shake(0.005, 220);

          if (this.enemyTankColumn) {
            this.enemyTankColumn.convertToWreck(0);
          }
          this.showActionToast('🔥 DIRECT AMBUSH HIT! LEAD TANK IN FLAMES!', '#2ec4b6', 2200);
        }
      });
    });
    if (!this.extendedTimers) this.extendedTimers = [];
    this.extendedTimers.push(fireTimer);

    this.cameraController.panTo(1540, 540, 1200, 1.0);
    this.scheduleMissionComplete(2100);
  }

  // ==========================================
  // EXTENDED CAMPAIGN MISSIONS 11 - 18
  // ==========================================
  showActionToast(msg, color = '#ffd166', durationMs = 2200) {
    const toast = document.getElementById('action-toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.style.color = color;
    toast.style.borderColor = color;
    toast.classList.remove('hidden');
    if (this.actionToastTimer) this.actionToastTimer.remove(false);
    this.actionToastTimer = this.time.delayedCall(durationMs, () => {
      if (toast) toast.classList.add('hidden');
    });
  }

  scheduleMissionComplete(delayMs = 1200) {
    const timer = this.time.delayedCall(delayMs, () => {
      if (this.missionManager) this.missionManager.completeMission();
    });
    if (!this.extendedTimers) this.extendedTimers = [];
    this.extendedTimers.push(timer);
    return timer;
  }

  updateCombatHud(badgeText, subText = '', jamPct = null, isJammed = false) {
    const hud = document.getElementById('combat-overlay-hud');
    const badge = document.getElementById('combat-hud-badge');
    const sub = document.getElementById('ammo-wave-box');
    const jamBox = document.getElementById('jam-meter-box');
    const jamFill = document.getElementById('jam-bar-fill');
    const jamCue = document.getElementById('jam-qte-cue');

    if (hud) hud.classList.remove('hidden');
    if (badge) badge.textContent = badgeText;
    if (sub) {
      if (subText) {
        sub.textContent = subText;
        sub.classList.remove('hidden');
      } else {
        sub.classList.add('hidden');
      }
    }
    if (jamBox) {
      if (jamPct !== null) {
        jamBox.classList.remove('hidden');
        if (jamFill) jamFill.style.width = `${Math.min(100, Math.max(0, Math.round(jamPct)))}%`;
        if (jamCue) jamCue.classList.toggle('hidden', !isJammed);
      } else {
        jamBox.classList.add('hidden');
      }
    }
  }

  spawnExplosionSequence(x, y, scale = 1.6) {
    const frames = ['explosion_1', 'explosion_2', 'explosion_3'].filter(k => this.textures.exists(k));
    if (frames.length > 0) {
      frames.forEach((key, idx) => {
        this.time.delayedCall(idx * 110, () => {
          const exp = this.add.image(x, y, key).setDepth(125).setScale(scale * (0.9 + idx * 0.2));
          this.tweens.add({
            targets: exp,
            alpha: 0,
            scale: exp.scaleX * 1.45,
            duration: 240,
            onComplete: () => exp.destroy()
          });
        });
      });
    } else {
      this.createHitImpact(x, y);
    }

    if (this.textures.exists('smoke_plume')) {
      const smoke = this.add.image(x, y - 24, 'smoke_plume').setDepth(122).setScale(scale * 0.9);
      this.tweens.add({
        targets: smoke,
        y: y - 135,
        alpha: 0,
        scale: smoke.scaleX * 1.8,
        duration: 1600,
        onComplete: () => smoke.destroy()
      });
    }
  }

  spawnWaveSoldiers(xPositions, variant = 'march') {
    xPositions.forEach(sx => {
      const soldier = new EnemySoldier(this, sx, 745, variant);
      this.enemySoldiers.push(soldier);
    });
  }

  enableTacticalCrosshair(startX, startY) {
    if (this.tacticalCrosshair) this.tacticalCrosshair.destroy();
    const key = this.textures.exists('crosshair_hd') ? 'crosshair_hd' : 'particle_hit_spark';
    this.tacticalCrosshair = this.add.image(startX, startY, key).setDepth(450).setScale(0.45);
  }

  setupMission11() {
    const tank0 = this.enemyTankColumn && this.enemyTankColumn.tanks[0];
    const startX = tank0 && tank0.fuelDrum ? tank0.fuelDrum.x : 1860;
    const startY = tank0 && tank0.fuelDrum ? tank0.fuelDrum.y : 710;
    this.enableTacticalCrosshair(startX, startY);

    if (tank0 && tank0.fuelDrum) {
      this.tankWeakpointRing = this.add.circle(tank0.fuelDrum.x, tank0.fuelDrum.y, 26, 0xff6b35, 0.0)
        .setStrokeStyle(3, 0xff9f1c, 0.95).setDepth(90);
      this.tweens.add({ targets: this.tankWeakpointRing, scale: 1.35, alpha: 0.4, duration: 550, yoyo: true, repeat: -1 });
    }

    this.extendedMissionState = { id: 11, completed: false };
    this.updateCombatHud(
      '106mm M40 RCL · RANGE 180m · ELEV 15°',
      'AIM REAR ORANGE DIESEL DRUM · FRONT ARMOR RICOCHETS!'
    );
  }

  setupMission12() {
    this.cameras.main.setZoom(1.0);
    this.cameras.main.startFollow(this.player.sprite, true, 0.08, 0.08);
    this.extendedMissionState = { id: 12, completed: false };
    this.updateCombatHud(
      '130mm ARTILLERY INCOMING!',
      'SPRINT LEFT TO SANDBAG BUNKER (x ≤ 680)'
    );
    this.showActionToast('⚠️ 130mm ARTILLERY RANGE LOCKED! RUN LEFT (←)!', '#ff6b6b', 3500);

    // Warning ring near Jeep + Incoming barrage after 2.2s
    const dangerRing = this.add.circle(960, 770, 55, 0xef4444, 0.25)
      .setStrokeStyle(3, 0xef4444, 0.9).setDepth(95);
    this.tweens.add({ targets: dangerRing, scale: 1.4, alpha: 0.55, duration: 300, yoyo: true, repeat: -1 });
    this.environmentObjects.push(dangerRing);

    if (window.soundEngine.playMortarWhistle) window.soundEngine.playMortarWhistle();
    const timer = this.time.delayedCall(2200, () => {
      if (dangerRing && dangerRing.destroy) dangerRing.destroy();
      if (!this.extendedMissionState || this.extendedMissionState.id !== 12 || this.extendedMissionState.completed) return;
      if (window.soundEngine.playFuelExplosion) window.soundEngine.playFuelExplosion();
      this.spawnExplosionSequence(960, 735, 1.9);
      this.cameraController.shake(0.005, 220);
      if (this.player && this.player.sprite && this.player.sprite.x > 740) {
        this.showActionToast('GET BEHIND BUNKER SANDBAGS (x ≤ 680)!', '#ffd166', 2500);
      }
    });
    this.extendedTimers.push(timer);
  }

  setupMission13() {
    this.extendedMissionState = {
      id: 13,
      sandBuildup: 35,
      jamsCleared: 0,
      requiredJams: 2,
      kills: 0,
      requiredKills: 6,
      completed: false
    };
    this.updateCombatHud(
      'SILICA SANDSTORM · 7.62mm SLR',
      'KILLS: 0/6 · JAMS CLEARED: 0/2',
      35,
      false
    );
  }

  setupMission14() {
    this.extendedMissionState = {
      id: 14,
      shellShockTriggered: false,
      shellShockActive: false,
      grounded: false,
      groundingProgress: 0,
      delivered: false
    };
    this.updateCombatHud('THE AMMO RUN (20kg CRATE)', 'PICK UP CRATE AT BUNKER (x=1220)');

    this.interactionManager.register(
      'm14_pickup', 1220, 785, 120,
      '20kg MMG गोला-बारूद पेटी उठाएँ (Pick up 20kg Ammo Crate [E])',
      () => {
        window.soundEngine.playAmmoCrate();
        this.player.setCarrying(true, 'ammo_box');
        if (this.bunkerCrateProp) this.bunkerCrateProp.setVisible(false);
        this.updateCombatHud('CARRY TO BHAIRON SINGH (x=1800)', 'WATCH FOR INCOMING MORTAR!');
        this.showActionToast('RUN RIGHT TOWARD BHAIRON SINGH (→)!', '#ffd166', 2200);
      },
      () => Boolean(this.extendedMissionState && this.extendedMissionState.id === 14 && !this.player.isCarrying && !this.extendedMissionState.delivered)
    );

    this.interactionManager.register(
      'm14_deliver', 1800, 755, 130,
      'भैरों सिंह को MMG एम्मो पेटी दें (Deliver Crate to Bhairon Singh [E])',
      () => {
        if (!this.extendedMissionState || this.extendedMissionState.delivered) return;
        this.extendedMissionState.delivered = true;
        window.soundEngine.playAmmoCrate();
        this.player.setCarrying(false);
        this.showActionToast('AMMO DELIVERED! SAT SRI AKAL!', '#2ec4b6', 2200);
        this.missionManager.completeMission();
      },
      () => Boolean(
        this.extendedMissionState && this.extendedMissionState.id === 14 &&
        this.player.isCarrying && this.extendedMissionState.grounded && !this.extendedMissionState.delivered
      )
    );
  }

  setupMission15() {
    this.extendedMissionState = {
      id: 15,
      ammo: 12,
      wave: 1,
      maxWaves: 3,
      completed: false
    };
    this.spawnWaveSoldiers([1780, 1980, 2180], 'march');
    this.updateCombatHud(
      'FINAL PRE-DAWN STAND (15% AMMO)',
      'RESERVE AMMO: 12 ROUNDS | WAVE: 1/3'
    );
  }

  setupMission16() {
    this.extendedMissionState = { id: 16, smokeDeployed: false, tracerTimer: 0 };
    this.updateCombatHud('FORWARD AIR CONTROL', 'SPRINT TO HIGH DUNE CREST (x=2320) & PRESS [E]');

    const ring = this.add.circle(2320, 760, 42, 0xf97316, 0.25)
      .setStrokeStyle(3, 0xff9f1c, 0.95).setDepth(90);
    const label = this.add.text(2320, 690, 'HIGH DUNE CREST\nDEPLOY SMOKE [E]', {
      fontSize: '13px',
      fontFamily: 'Rajdhani, sans-serif',
      fontStyle: 'bold',
      color: '#ff9f1c',
      backgroundColor: 'rgba(10, 15, 25, 0.85)',
      padding: { x: 8, y: 4 },
      align: 'center'
    }).setOrigin(0.5).setDepth(91);
    this.tweens.add({ targets: ring, scale: 1.25, alpha: 0.65, duration: 550, yoyo: true, repeat: -1 });
    this.crestBeaconGroup = [ring, label];

    this.interactionManager.register(
      'm16_smoke', 2320, 755, 145,
      'ऑरेंज सिग्नल स्मोक ग्रेनेड फोड़ें (Deploy Orange Signal Smoke [E])',
      () => {
        if (!this.extendedMissionState || this.extendedMissionState.smokeDeployed) return;
        this.extendedMissionState.smokeDeployed = true;
        window.soundEngine.playInteractTap();
        if (this.crestBeaconGroup) {
          this.crestBeaconGroup.forEach(obj => { if (obj && obj.destroy) obj.destroy(); });
          this.crestBeaconGroup = [];
        }
        const smokeKey = this.textures.exists('airstrike_smoke') ? 'airstrike_smoke' : 'smoke_plume';
        const plume = this.add.image(2320, 735, smokeKey).setDepth(125).setScale(1.1);
        this.tweens.add({ targets: plume, y: 560, scale: 1.85, alpha: 0.15, duration: 2200 });
        this.environmentObjects.push(plume);
        this.showActionToast('ORANGE SIGNAL ACTIVE · HUNTERS INBOUND!', '#ff9f1c', 2500);
        this.scheduleMissionComplete(1200);
      }
    );
  }

  setupMission17() {
    this.enableTacticalCrosshair(2250, 730);
    this.extendedMissionState = { id: 17, hits: 0, targetHits: 4, completed: false };
    this.updateCombatHud(
      'HAWKER HUNTER AIRSTRIKE',
      'PAINT STRANDED TANKS (CLICK OR [J]): 0 / 4'
    );
  }

  setupMission18() {
    this.cameras.main.zoomTo(1.0, 600);
    this.cameras.main.startFollow(this.player.sprite, true, 0.08, 0.08);
    this.extendedMissionState = { id: 18, finished: false };
    this.updateCombatHud('EPILOGUE · LONGEWALA DAWN', 'EXAMINE MEMORIAL (x=505) OR BUNKER (x=1350)');

    const finishLetterTrigger = () => {
      if (!this.extendedMissionState || this.extendedMissionState.finished) return;
      this.extendedMissionState.finished = true;
      this.interactionManager.clear();
      window.cutsceneManager.showLetterModal(() => {
        this.player.lockMovement(true);
        this.showActionToast('THEY GAVE UP THEIR TOMORROW FOR OUR TODAY', '#ffd166', 2800);
        this.cameraController.panTo(this.player.sprite.x, 380, 1800, 1.0, () => {
          this.missionManager.triggerCampaignOutro();
        });
      }, true);
    };

    this.interactionManager.register(
      'm18_memorial', 505, 755, 180,
      'स्मारक के पास बैठकर माँ को चिट्ठी पूरी करें (Conclude Letter at Memorial [E])',
      finishLetterTrigger
    );
    this.interactionManager.register(
      'm18_bunker', 1350, 755, 180,
      'बंकर पर तिरंगे के नीचे माँ को जवाब लिखें (Write Final Letter Home [E])',
      finishLetterTrigger
    );
  }

  handleCustomCombatAction() {
    // Mission 10: Hold-Fire Range Discipline
    if (this.m10AmbushState) {
      if (this.m10AmbushState.fired) return true;
      if (this.m10AmbushState.ready) {
        if (this.m10AmbushState.meters <= 155) {
          this.triggerMission10Volley();
          return true;
        }
        if (!this.m10AmbushState.warnedEarly) {
          this.m10AmbushState.warnedEarly = true;
          window.soundEngine.playRifleCock();
          this.time.delayedCall(1500, () => {
            if (this.m10AmbushState) this.m10AmbushState.warnedEarly = false;
          });
        }
        this.showActionToast(`⚠️ MAJOR CHANDPURI: HOLD FIRE! RANGE ${Math.round(this.m10AmbushState.meters)}m > 150m!`, '#ff6b6b', 1800);
      }
      return true;
    }

    if (!this.extendedMissionState) return false;
    const st = this.extendedMissionState;

    // Sync crosshair to exact pointer click world position for zero-lag mouse/tap shots
    if (this.tacticalCrosshair && this.input && this.input.activePointer && this.input.activePointer.isDown) {
      const ptr = this.input.activePointer;
      const wp = this.cameras.main.getWorldPoint(ptr.x, ptr.y);
      this.tacticalCrosshair.setPosition(wp.x, wp.y);
    }

    // Mission 11: 106mm RCL Gun Crosshair Aim & Rear Fuel Drum Kill
    if (st.id === 11 && !st.completed) {
      const tx = this.tacticalCrosshair ? this.tacticalCrosshair.x : 1650;
      const ty = this.tacticalCrosshair ? this.tacticalCrosshair.y : 710;
      const startX = this.outpostRclJeep ? this.outpostRclJeep.x + 88 : 1048;
      const startY = this.outpostRclJeep ? this.outpostRclJeep.y - 36 : 716;

      if (window.soundEngine.playRCLBlast) window.soundEngine.playRCLBlast();

      // Jeep suspension recoil bounce + fiery muzzle + backblast cloud
      if (this.outpostRclJeep) {
        this.tweens.add({
          targets: this.outpostRclJeep,
          x: this.outpostRclJeep.x - 10,
          duration: 75,
          yoyo: true
        });
        if (this.textures.exists('smoke_plume')) {
          const backblast = this.add.image(startX - 150, startY + 6, 'smoke_plume')
            .setDepth(118).setScale(0.9).setFlipX(true);
          this.tweens.add({
            targets: backblast,
            x: backblast.x - 90,
            alpha: 0,
            scale: 1.5,
            duration: 360,
            onComplete: () => backblast.destroy()
          });
        }
      }

      const flashKey = this.textures.exists('muzzle_flash_hd') ? 'muzzle_flash_hd' : 'muzzle_flash';
      const flash = this.add.image(startX, startY, flashKey).setDepth(120).setScale(flashKey === 'muzzle_flash_hd' ? 0.72 : 1.6);
      this.tweens.add({ targets: flash, alpha: 0, scale: flash.scaleX * 1.4, duration: 150, onComplete: () => flash.destroy() });

      const tracerKey = this.textures.exists('bullet_tracer_hd') ? 'bullet_tracer_hd' : 'bullet_tracer';
      const shell = this.add.image(startX, startY, tracerKey).setDepth(118).setScale(tracerKey === 'bullet_tracer_hd' ? 0.55 : 1.4);

      this.tweens.add({
        targets: shell,
        x: tx,
        y: ty,
        duration: 210,
        onComplete: () => {
          shell.destroy();
          const tank0 = this.enemyTankColumn && this.enemyTankColumn.tanks[0];
          const drumX = tank0 && tank0.fuelDrum ? tank0.fuelDrum.x : 1666;
          const drumY = tank0 && tank0.fuelDrum ? tank0.fuelDrum.y : 710;
          const distToDrum = Phaser.Math.Distance.Between(tx, ty, drumX, drumY);
          const hullX = tank0 && tank0.sprite ? tank0.sprite.x : 1540;

          if (distToDrum <= 90 || (tx >= hullX + 42 && Math.abs(ty - drumY) <= 82)) {
            // DIRECT HIT ON REAR DIESEL DRUM!
            st.completed = true;
            if (this.tankWeakpointRing) this.tankWeakpointRing.destroy();
            if (window.soundEngine.playFuelExplosion) window.soundEngine.playFuelExplosion();
            this.spawnExplosionSequence(drumX, drumY, 2.3);
            if (this.enemyTankColumn) this.enemyTankColumn.convertToWreck(0);
            if (this.battleIllumOverlay) this.battleIllumOverlay.setAlpha(0.18);
            this.showActionToast('DIRECT HIT! FIRST TYPE-59 DESTROYED!', '#2ec4b6', 2400);
            this.cameraController.shake(0.006, 220);
            this.scheduleMissionComplete(1700);
          } else {
            // FRONT ARMOR DEFLECTION -> RICOCHET!
            if (window.soundEngine.playRicochet) window.soundEngine.playRicochet();
            this.createHitImpact(tx, ty);
            // Bouncing metallic ricochet streak deflecting skyward off slanted Type-59 armor
            const ricStreak = this.add.image(tx, ty, tracerKey)
              .setDepth(121).setScale(0.35).setAngle(-38).setFlipX(true);
            this.tweens.add({
              targets: ricStreak,
              x: tx - 260,
              y: ty - 220,
              alpha: 0,
              duration: 280,
              onComplete: () => ricStreak.destroy()
            });
            this.showActionToast('RICOCHET! FRONT ARMOR DEFLECTED — AIM REAR DRUM!', '#ff6b6b', 2100);
          }
        }
      });
      return true;
    }

    // Mission 17: Hawker Hunter Airstrike Target Paint
    if (st.id === 17 && !st.completed && this.enemyTankColumn) {
      const tx = this.tacticalCrosshair ? this.tacticalCrosshair.x : 2100;
      const ty = this.tacticalCrosshair ? this.tacticalCrosshair.y : 730;
      const tanks = this.enemyTankColumn.tanks || [];

      let chosenIdx = -1;
      let bestDist = Infinity;
      tanks.forEach((t, idx) => {
        if (t.destroyed || !t.sprite) return;
        const d = Phaser.Math.Distance.Between(tx, ty, t.sprite.x, t.sprite.y);
        if (d < bestDist) {
          bestDist = d;
          chosenIdx = idx;
        }
      });

      // Allow hitting clicked/aimed tank or nearest alive tank via [J]
      if (chosenIdx !== -1 && (bestDist <= 240 || (this.player.keys.shoot && this.player.keys.shoot.isDown))) {
        const target = tanks[chosenIdx];
        const hitX = target.sprite.x;
        const hitY = target.sprite.y;
        this.enemyTankColumn.convertToWreck(chosenIdx);
        st.hits++;
        this.spawnHawkerHunterStrike(hitX, hitY);
        this.updateCombatHud(
          'HAWKER HUNTER AIRSTRIKE',
          `PAINT STRANDED TANKS: ${st.hits} / ${st.targetHits}`
        );

        // Once jets hammer the tanks, enemy infantry panic and retreat east!
        if (st.hits >= 2 && this.enemySoldiers && this.enemySoldiers.length) {
          this.enemySoldiers.forEach(s => { if (s.alive) s.retreatEast(); });
          this.showActionToast('DEKHO! DUSHMAN BHAG RAHA HAI!', '#ffd166', 2200);
        }

        if (st.hits >= st.targetHits) {
          st.completed = true;
          this.showActionToast('ALL ENEMY ARMOR DESTROYED! TURKEY SHOOT!', '#2ec4b6', 2500);
          this.scheduleMissionComplete(2100);
        }
      } else {
        this.showActionToast('ALIGN CROSSHAIR OVER AN INTACT TYPE-59 TANK!', '#ffd166', 1400);
      }
      return true;
    }

    return false;
  }

  spawnHawkerHunterStrike(targetX, targetY) {
    if (window.soundEngine.playJetRoar) window.soundEngine.playJetRoar();
    const smokeKey = this.textures.exists('airstrike_smoke') ? 'airstrike_smoke' : 'smoke_plume';
    const marker = this.add.image(targetX, targetY - 12, smokeKey).setDepth(118).setScale(0.75);
    this.tweens.add({ targets: marker, alpha: 0, duration: 1500, onComplete: () => marker.destroy() });

    const tracerKey = this.textures.exists('bullet_tracer_hd') ? 'bullet_tracer_hd' : 'bullet_tracer';
    if (this.textures.exists('hawker_hunter')) {
      // Lead jet + wingman in tight attack dive across horizon
      [0, 1].forEach(wing => {
        const startY = 230 + wing * 45;
        const jet = this.add.image(targetX - 780 - wing * 140, startY, 'hawker_hunter')
          .setDepth(420).setScale(wing === 0 ? 0.68 : 0.56);
        this.tweens.add({
          targets: jet,
          x: targetX + 860,
          y: startY + 75,
          duration: 1100 + wing * 140,
          ease: 'Quad.easeInOut',
          onComplete: () => jet.destroy()
        });
      });
    }

    // 30mm ADEN Cannon & Matra T-10 Rocket Volley diving into stranded tank
    for (let r = 0; r < 3; r++) {
      this.time.delayedCall(190 + r * 65, () => {
        const rocket = this.add.image(targetX - 360, 320 + r * 20, tracerKey)
          .setDepth(415).setScale(0.45).setAngle(34);
        this.tweens.add({
          targets: rocket,
          x: targetX + (r - 1) * 28,
          y: targetY - 10,
          duration: 180,
          onComplete: () => {
            rocket.destroy();
            if (r === 1) {
              if (window.soundEngine.playFuelExplosion) window.soundEngine.playFuelExplosion();
              this.spawnExplosionSequence(targetX, targetY - 16, 2.25);
              this.cameraController.shake(0.005, 220);
            } else {
              this.createHitImpact(targetX + (r - 1) * 28, targetY - 10);
            }
          }
        });
      });
    }
  }

  onJammedFireAttempt() {
    window.soundEngine.playRifleCock();
    this.showActionToast('⚠️ RIFLE JAMMED! PRESS [R] TO CLEAR SAND!', '#ff6b6b', 1600);
  }

  handleReloadKey() {
    if (!this.extendedMissionState || this.extendedMissionState.id !== 13) return false;
    const st = this.extendedMissionState;
    if (!this.player.isJammed && st.sandBuildup < 30) return false;

    window.soundEngine.playRifleCock();
    this.player.isJammed = false;
    st.sandBuildup = 0;
    st.jamsCleared++;
    this.showActionToast(`BOLT CLEARED! (${st.jamsCleared}/${st.requiredJams})`, '#2ec4b6', 1500);
    this.updateCombatHud(
      'SILICA SANDSTORM · 7.62mm SLR',
      `KILLS: ${st.kills}/${st.requiredKills} · JAMS CLEARED: ${st.jamsCleared}/${st.requiredJams}`,
      0,
      false
    );
    this.checkMission13Completion();
    return true;
  }

  consumeMissionAmmo() {
    if (!this.extendedMissionState) return true;
    const st = this.extendedMissionState;
    if (st.id === 13) {
      st.sandBuildup = Math.min(100, st.sandBuildup + 34);
      if (st.sandBuildup >= 100) {
        this.player.isJammed = true;
        this.showActionToast('⚠️ SILICA SAND JAMMED CHAMBER! PRESS [R]!', '#ff6b6b', 2000);
      }
      this.updateCombatHud(
        'SILICA SANDSTORM · 7.62mm SLR',
        `KILLS: ${st.kills}/${st.requiredKills} · JAMS CLEARED: ${st.jamsCleared}/${st.requiredJams}`,
        st.sandBuildup,
        this.player.isJammed
      );
      return true;
    }
    if (st.id === 15) {
      if (st.ammo <= 0) {
        st.ammo = 6;
        window.soundEngine.playAmmoCrate();
        this.showActionToast('SCAVENGED +6 RESERVE STRIPPER ROUNDS!', '#ffd166', 1800);
      } else {
        st.ammo--;
      }
      this.updateCombatHud(
        'FINAL PRE-DAWN STAND (15% AMMO)',
        `RESERVE AMMO: ${st.ammo} ROUNDS | WAVE: ${st.wave}/${st.maxWaves}`
      );
      return true;
    }
    return true;
  }

  onEnemySoldierKilled() {
    if (!this.extendedMissionState) return;
    const st = this.extendedMissionState;
    if (st.id === 13 && !st.completed) {
      st.kills++;
      if (st.kills >= st.requiredKills && st.jamsCleared < st.requiredJams) {
        st.sandBuildup = 100;
        this.player.isJammed = true;
        this.showActionToast('FINAL SAND JAM! PRESS [R] TO CLEAR BOLT!', '#ff6b6b', 2400);
      }
      this.updateCombatHud(
        'SILICA SANDSTORM · 7.62mm SLR',
        `KILLS: ${st.kills}/${st.requiredKills} · JAMS CLEARED: ${st.jamsCleared}/${st.requiredJams}`,
        st.sandBuildup,
        this.player.isJammed
      );
      this.checkMission13Completion();
    } else if (st.id === 15 && !st.completed) {
      const aliveCount = this.enemySoldiers.filter(s => s.alive).length;
      if (aliveCount === 0) {
        if (st.wave < st.maxWaves) {
          st.wave++;
          if (this.dawnSkyOverlay) this.dawnSkyOverlay.setAlpha(0.14 + st.wave * 0.14);
          this.showActionToast(`WAVE ${st.wave}/${st.maxWaves} INCOMING! EASTERN SKY GLOWS!`, '#ffd166', 2200);
          const count = st.wave === 3 ? 4 : 4;
          const xs = Array.from({ length: count }, (_, idx) => 1760 + idx * 170);
          this.spawnWaveSoldiers(xs, st.wave === 3 ? 'charge' : 'run');
          this.updateCombatHud(
            'FINAL PRE-DAWN STAND (15% AMMO)',
            `RESERVE AMMO: ${st.ammo} ROUNDS | WAVE: ${st.wave}/${st.maxWaves}`
          );
        } else {
          st.completed = true;
          this.showActionToast('DAWN BREAKS! OUTPOST HELD THROUGH THE NIGHT!', '#2ec4b6', 2500);
          this.scheduleMissionComplete(1400);
        }
      }
    }
  }

  checkMission13Completion() {
    const st = this.extendedMissionState;
    if (!st || st.id !== 13 || st.completed) return;
    if (st.kills >= st.requiredKills && st.jamsCleared >= st.requiredJams) {
      st.completed = true;
      this.showActionToast('TRENCH RUSH REPELLED!', '#2ec4b6', 2000);
      this.scheduleMissionComplete(1200);
    }
  }

  updateHUDObjective(chapter, title, objective) {
    const chapterEl = document.getElementById('hud-chapter');
    const titleEl = document.getElementById('hud-mission');
    const objEl = document.getElementById('hud-objective');
    if (chapterEl && chapter) chapterEl.textContent = chapter.toUpperCase();
    if (titleEl) titleEl.textContent = title;
    if (objEl) objEl.innerHTML = `<strong>उद्देश्य:</strong> ${objective}`;
  }

  showDemoEndCard() {
    this.scene.pause();
    if (window.cutsceneManager) {
      window.cutsceneManager.showDemoEnding();
    }
  }

  createFootstepDust(x, y) {
    if (!this.textures.exists('particle_dust')) return;
    const p = this.add.image(x, y, 'particle_dust').setDepth(105).setScale(0.8);
    this.tweens.add({
      targets: p,
      scale: 0.2,
      alpha: 0,
      y: y - 8,
      duration: 240,
      onComplete: () => p.destroy()
    });
  }

  createJumpDust(x, y) {
    if (!this.textures.exists('particle_dust')) return;
    for (let i = 0; i < 3; i++) {
      const p = this.add.image(x + (i - 1) * 8, y, 'particle_dust').setDepth(105);
      this.tweens.add({
        targets: p,
        scale: 0.1,
        alpha: 0,
        y: y - 10,
        duration: 280,
        onComplete: () => p.destroy()
      });
    }
  }

  createLandingDust(x, y) {
    if (!this.textures.exists('particle_dust')) return;
    for (let i = -1; i <= 1; i += 2) {
      const p = this.add.image(x, y, 'particle_dust').setDepth(105).setScale(1.1);
      this.tweens.add({
        targets: p,
        x: x + i * 24,
        alpha: 0,
        scale: 0.2,
        duration: 260,
        onComplete: () => p.destroy()
      });
    }
  }

  // ==========================================
  // REAL 1971 7.62mm 1A1 SLR COMBAT WEAPON SYSTEM
  // ==========================================
  fireBullet(x, y, facingRight) {
    // 1. High-Detail Muzzle Flash Flare + Gun Smoke (Zero viewport shake!)
    const flashKey = this.textures.exists('muzzle_flash_hd') ? 'muzzle_flash_hd' : 'muzzle_flash';
    if (this.textures.exists(flashKey)) {
      const flash = this.add.image(x + (facingRight ? 6 : -6), y, flashKey)
        .setDepth(115).setScale(flashKey === 'muzzle_flash_hd' ? 0.42 : 1.1);
      flash.setFlipX(!facingRight);
      this.tweens.add({
        targets: flash,
        scale: flash.scaleX * 1.35,
        alpha: 0,
        duration: 75,
        onComplete: () => flash.destroy()
      });
    }

    // Dynamic warm illumination flare at weapon muzzle
    const flashGlow = this.add.circle(x, y, 34, 0xffea00, 0.38).setDepth(113);
    this.tweens.add({
      targets: flashGlow,
      scale: 1.6,
      alpha: 0,
      duration: 65,
      onComplete: () => flashGlow.destroy()
    });

    // Gun smoke puff drifting from SLR barrel
    if (this.textures.exists('particle_smoke_puff')) {
      const smoke = this.add.image(x + (facingRight ? 10 : -10), y - 2, 'particle_smoke_puff')
        .setDepth(114).setScale(0.7).setAlpha(0.65);
      this.tweens.add({
        targets: smoke,
        x: smoke.x + (facingRight ? 24 : -24),
        y: smoke.y - 14,
        scale: 1.3,
        alpha: 0,
        duration: 320,
        onComplete: () => smoke.destroy()
      });
    }

    // 2. Brass Shell Casing Ejection (arcs back & drops to ground with metallic clink)
    if (this.textures.exists('particle_shell')) {
      const ejectDir = facingRight ? -1 : 1;
      const shell = this.add.image(x - (facingRight ? 16 : -16), y - 4, 'particle_shell').setDepth(112).setScale(0.9);
      shell.setAngle(Math.random() * 360);
      const groundY = this.player && this.player.sprite ? this.player.sprite.y + 44 : y + 50;

      this.tweens.add({
        targets: shell,
        x: shell.x + ejectDir * (24 + Math.random() * 16),
        y: shell.y - 18,
        angle: shell.angle + (ejectDir * 180),
        duration: 130,
        ease: 'Quad.easeOut',
        onComplete: () => {
          this.tweens.add({
            targets: shell,
            y: groundY,
            duration: 170,
            ease: 'Bounce.easeOut',
            onComplete: () => {
              if (window.soundEngine && typeof window.soundEngine.playShellDrop === 'function') {
                window.soundEngine.playShellDrop();
              }
              this.time.delayedCall(5000, () => {
                if (shell && shell.destroy) shell.destroy();
              });
            }
          });
        }
      });
    }

    // 3. Supersonic 7.62mm Bullet Tracer Projectile (Crisp HD streak)
    const tracerKey = this.textures.exists('bullet_tracer_hd') ? 'bullet_tracer_hd' : 'bullet_tracer';
    if (this.textures.exists(tracerKey)) {
      const bullet = this.physics.add.sprite(x, y, tracerKey);
      bullet.setDepth(114);
      if (tracerKey === 'bullet_tracer_hd') bullet.setScale(0.36);
      bullet.body.setAllowGravity(false);
      bullet.setVelocityX(facingRight ? 1550 : -1550);
      bullet.setFlipX(!facingRight);
      this.bullets.add(bullet);

      this.time.delayedCall(1800, () => {
        if (bullet && bullet.destroy) bullet.destroy();
      });
    }
  }

  fireEnemyBullet(x, y, facingRight) {
    const flashKey = this.textures.exists('muzzle_flash_hd') ? 'muzzle_flash_hd' : 'muzzle_flash';
    if (this.textures.exists(flashKey)) {
      const flash = this.add.image(x, y, flashKey)
        .setDepth(115).setScale(flashKey === 'muzzle_flash_hd' ? 0.34 : 0.9).setTint(0xffaa66).setFlipX(!facingRight);
      this.tweens.add({ targets: flash, alpha: 0, duration: 75, onComplete: () => flash.destroy() });
    }

    const tracerKey = this.textures.exists('bullet_tracer_hd') ? 'bullet_tracer_hd' : 'bullet_tracer';
    if (this.textures.exists(tracerKey)) {
      const eb = this.add.image(x, y, tracerKey).setDepth(113)
        .setScale(tracerKey === 'bullet_tracer_hd' ? 0.28 : 0.9)
        .setTint(0xff4d4d).setFlipX(!facingRight);
      eb.vx = facingRight ? 760 : -760;
      eb.life = 1800;
      if (!this.enemyBullets) this.enemyBullets = [];
      this.enemyBullets.push(eb);
    }
  }

  createHitImpact(x, y) {
    // Sparks
    if (this.textures.exists('particle_hit_spark')) {
      const spark = this.add.image(x, y, 'particle_hit_spark').setDepth(116).setScale(1.2);
      this.tweens.add({
        targets: spark,
        scale: 0.2,
        alpha: 0,
        duration: 120,
        onComplete: () => spark.destroy()
      });
    }
    // Sand dust burst
    if (this.textures.exists('particle_dust')) {
      for (let i = 0; i < 3; i++) {
        const d = this.add.image(x, y, 'particle_dust').setDepth(115).setScale(0.7);
        this.tweens.add({
          targets: d,
          x: x + (Math.random() - 0.5) * 24,
          y: y - 8 - Math.random() * 12,
          scale: 0.1,
          alpha: 0,
          duration: 220,
          onComplete: () => d.destroy()
        });
      }
    }
  }

  createBloodSpatter(x, y) {
    if (!this.textures.exists('particle_blood')) return;
    for (let i = 0; i < 4; i++) {
      const b = this.add.image(x, y, 'particle_blood').setDepth(116).setScale(1.0);
      const angle = Math.random() * Math.PI * 2;
      const dist = 12 + Math.random() * 20;
      this.tweens.add({
        targets: b,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist + 8,
        scale: 0.25,
        alpha: 0,
        duration: 260 + Math.random() * 120,
        onComplete: () => b.destroy()
      });
    }
  }

  showFloatingCombatText(x, y, text, color = '#ffd166') {
    const t = this.add.text(x, y, text, {
      fontSize: '14px',
      fontFamily: 'Rajdhani, sans-serif',
      fontStyle: 'bold',
      color: color,
      stroke: '#05070d',
      strokeThickness: 3
    }).setOrigin(0.5).setDepth(140);

    this.tweens.add({
      targets: t,
      y: y - 36,
      scale: 1.25,
      alpha: 0,
      duration: 650,
      ease: 'Back.easeOut',
      onComplete: () => t.destroy()
    });
  }

  updateTacticalVitals() {
    const fill = document.getElementById('vitals-bar-fill');
    const label = document.getElementById('vitals-hp-label');
    const rounds = document.getElementById('slr-rounds-count');
    const reloadCue = document.getElementById('slr-reload-cue');
    const coverBadge = document.getElementById('vitals-cover-badge');

    const hp = Math.max(0, Math.min(100, Math.round(this.playerHealth || 100)));
    if (fill) {
      fill.style.width = `${hp}%`;
      fill.classList.remove('warning', 'danger');
      if (hp <= 35) {
        fill.classList.add('danger');
      } else if (hp <= 65) {
        fill.classList.add('warning');
      }
    }
    if (label) {
      label.textContent = `HP ${hp}%`;
    }

    const curRounds = this.player ? (this.player.magazineRounds ?? 20) : 20;
    if (rounds) {
      rounds.textContent = `${curRounds} / 20`;
    }
    if (reloadCue) {
      if (this.player && this.player.isReloading) {
        reloadCue.textContent = 'RELOADING...';
        reloadCue.classList.add('pulse');
      } else if (curRounds <= 5) {
        reloadCue.textContent = '[R] RELOAD!';
        reloadCue.classList.add('pulse');
      } else {
        reloadCue.textContent = '[R] RELOAD';
        reloadCue.classList.remove('pulse');
      }
    }

    if (coverBadge) {
      if (this.inCover) {
        coverBadge.classList.remove('hidden');
      } else {
        coverBadge.classList.add('hidden');
      }
    }
  }

  flashDangerVignette() {
    const vig = document.getElementById('danger-vignette');
    if (!vig) return;
    vig.classList.add('active');
    this.time.delayedCall(220, () => {
      if (vig && (this.playerHealth || 100) > 30) {
        vig.classList.remove('active');
      }
    });
  }

  playerMeleeAttack(hitX, hitY) {
    this.createHitImpact(hitX, hitY);
    if (this.enemySoldiers && this.enemySoldiers.length) {
      this.enemySoldiers.forEach(soldier => {
        if (!soldier.alive || !soldier.sprite) return;
        const d = Phaser.Math.Distance.Between(hitX, hitY, soldier.sprite.x, soldier.sprite.y);
        if (d < 96) {
          soldier.takeDamage(2, this.player && this.player.facingRight ? 1 : -1);
        }
      });
    }
  }

  updateWaypointCompass(dialogueBlocking) {
    const el = document.getElementById('waypoint-compass');
    if (!el) return;
    if (dialogueBlocking || !this.interactionManager || !this.player || !this.player.sprite) {
      el.classList.add('hidden');
      return;
    }
    const target = this.interactionManager.getPrimaryTarget(this.player.sprite.x);
    if (!target) {
      el.classList.add('hidden');
      return;
    }
    const distPx = Math.abs(target.dx);
    const meters = Math.max(1, Math.round(distPx / 12));
    const dir = target.dx >= 0 ? '→' : '←';
    const shortLabel = (target.label || '').replace(/\(.+?\)/g, '').trim().slice(0, 32);

    el.classList.remove('hidden');
    if (distPx <= 115) {
      el.classList.add('near');
      el.textContent = `🎯 [E] READY · ${shortLabel}`;
    } else {
      el.classList.remove('near');
      el.textContent = `🧭 ${dir} ${meters}m · ${shortLabel}`;
    }
  }

  update(time, delta) {
    const dialogueBlocking = window.dialogueManager && window.dialogueManager.isActive;

    // Mission 2: Check [SPACE] BEFORE player.update consumes JustDown!
    if (this.m2WaitingLetter && !dialogueBlocking && this.player && this.player.keys) {
      const spaceJustDown = (this.player.keys.jump && Phaser.Input.Keyboard.JustDown(this.player.keys.jump)) ||
        (this.player.cursors && this.player.cursors.space && Phaser.Input.Keyboard.JustDown(this.player.cursors.space));
      if (spaceJustDown) {
        this.openMission2Letter();
      }
    }

    if (this.player) {
      this.player.update(time, delta);
    }

    if (this.interactionManager && this.player && this.player.sprite) {
      this.interactionManager.update(this.player.sprite.x, this.player.sprite.y);
    }

    this.updateWaypointCompass(dialogueBlocking);

    // Mission 2: Moving Evening Train Scenery
    if (this.stationStage === 'moving_train' && this.movingScenery && this.movingScenery.length) {
      const movePx = -290 * (delta / 1000);
      this.movingScenery.forEach(obj => {
        if (!obj) return;
        obj.x += movePx;
        if (obj.x < 1150) obj.x += 1420;
      });
    }

    // Mission 3: Emergency Luggage Hazard Jump Check
    if (
      this.stationStage === 'emergency' &&
      !dialogueBlocking &&
      this.stationBaggageHazard &&
      this.stationBaggageHazard.visible &&
      !this.m3Stumbled &&
      this.player &&
      this.player.sprite
    ) {
      const px = this.player.sprite.x;
      const py = this.player.sprite.y;
      if (Math.abs(px - 1340) < 34 && py > 685) {
        this.m3Stumbled = true;
        window.soundEngine.playSandbagThud();
        this.player.sprite.setVelocity(-190, -110);
        this.showActionToast('⚠️ गिरे हुए सामान से टकराए! [SPACE] से ऊपर कूदें!', '#fbbf24', 1800);
        this.time.delayedCall(900, () => { this.m3Stumbled = false; });
      }
    }

    // Mission 6: Enemy Star-Shell Illumination Flare & Crouch Stealth
    if (this.m6FlareState && !dialogueBlocking && this.player && this.player.sprite) {
      const px = this.player.sprite.x;
      if (!this.m6FlareState.triggered && px >= 1220) {
        this.m6FlareState.triggered = true;
        this.m6FlareState.active = true;
        if (this.battleIllumOverlay) this.battleIllumOverlay.setAlpha(0.24);
        this.showActionToast('💡 ENEMY FLARE ABOVE! [S] DABAKAR JHUKEN (CROUCH COVER)!', '#fbbf24', 2800);
        this.time.delayedCall(3400, () => {
          if (this.m6FlareState) this.m6FlareState.active = false;
          if (this.battleIllumOverlay) this.battleIllumOverlay.setAlpha(0);
          if (this.player) this.player.speedMultiplier = 1.0;
        });
      }
      if (this.m6FlareState.active) {
        if (this.player.isCrouching) {
          this.player.speedMultiplier = 1.0;
          if (!this.m6FlareState.crouchedSuccess) {
            this.m6FlareState.crouchedSuccess = true;
            this.showActionToast('✅ COVERED IN DUNE SHADOW! CLEAR TO ADVANCE!', '#2ec4b6', 1800);
          }
        } else {
          this.player.speedMultiplier = 0.7;
        }
      }
    }

    // Mission 10: Tank Column Creep & Hold-Fire Kill Zone Countdown
    if (this.m10AmbushState && this.m10AmbushState.ready && !this.m10AmbushState.fired && !dialogueBlocking) {
      const tanks = this.enemyTankColumn && this.enemyTankColumn.tanks ? this.enemyTankColumn.tanks : [];
      const lead = tanks[0] && tanks[0].sprite ? tanks[0].sprite : null;
      if (lead && lead.x > 1760) {
        const dx = -95 * (delta / 1000);
        tanks.forEach(t => {
          if (t.sprite) t.sprite.x += dx;
          if (t.turret) t.turret.x += dx;
          if (t.fuelDrum) t.fuelDrum.x += dx;
          if (t.light) t.light.x += dx;
        });
      }
      if (lead) {
        const distMeters = Math.max(135, Math.round(135 + ((lead.x - 1760) / 480) * 245));
        this.m10AmbushState.meters = distMeters;
        if (distMeters <= 155) {
          this.updateCombatHud(
            '🎯 KILL ZONE REACHED (150m)!',
            'FIRE RCL AMBUSH VOLLEY! PRESS [E], [J], OR CLICK'
          );
          if (!this.m10AmbushState.zoneAnnounced) {
            this.m10AmbushState.zoneAnnounced = true;
            window.soundEngine.playRifleCock();
            this.showActionToast('🔥 TANKS AT 150m WIRE! PRESS [E] OR [J] TO FIRE!', '#2ec4b6', 2600);
          }
        } else {
          this.updateCombatHud(
            'HOLD FIRE! DO NOT SHOOT YET',
            `TANK RANGE: ${distMeters}m → WAIT FOR 150m KILL ZONE`
          );
        }
      }
    }

    if (this.bullets) {
      const activeBullets = [...this.bullets.getChildren()];
      activeBullets.forEach(bullet => {
        if (!bullet || !bullet.active) return;
        let consumed = false;
        if (this.enemySoldiers && this.enemySoldiers.length) {
          for (const soldier of this.enemySoldiers) {
            if (!soldier.alive || !soldier.sprite) continue;
            if (Math.abs(bullet.x - soldier.sprite.x) < 36 && Math.abs(bullet.y - soldier.sprite.y) < 62) {
              this.createHitImpact(bullet.x, bullet.y);
              soldier.takeDamage(1, bullet.body && bullet.body.velocity.x >= 0 ? 1 : -1);
              bullet.destroy();
              consumed = true;
              break;
            }
          }
        }
        // Small-arms fire hitting intact Type-59 tank armor sparks and ricochets with SFX
        if (!consumed && !dialogueBlocking && this.enemyTankColumn && this.enemyTankColumn.tanks) {
          for (const t of this.enemyTankColumn.tanks) {
            if (!t || t.destroyed || !t.sprite) continue;
            if (Math.abs(bullet.x - t.sprite.x) < 110 && Math.abs(bullet.y - t.sprite.y) < 52) {
              this.createHitImpact(bullet.x, bullet.y);
              if (window.soundEngine && typeof window.soundEngine.playRicochet === 'function') {
                const nowMs = time || Date.now();
                if (!this._lastRicochetAt || nowMs - this._lastRicochetAt > 320) {
                  this._lastRicochetAt = nowMs;
                  window.soundEngine.playRicochet();
                }
              }
              bullet.destroy();
              break;
            }
          }
        }
      });
    }

    // Update enemy infantry (paused while dialogues are reading)
    if (this.enemySoldiers && this.enemySoldiers.length) {
      const px = this.player && this.player.sprite ? this.player.sprite.x : 1400;
      if (!dialogueBlocking) {
        this.enemySoldiers.forEach(s => { if (s.alive) s.update(delta, px); });
      }
    }

    // Cover Detection: Crouch [S] behind sandbags/trench provides bulletproof cover
    const playerX = this.player && this.player.sprite ? this.player.sprite.x : 0;
    const isPlayerCrouched = Boolean(this.player && this.player.isCrouching);
    const nearCover = (Math.abs(playerX - 1920) < 190) || (Math.abs(playerX - 1345) < 180) || (playerX <= 750);
    const wasCover = this.inCover;
    this.inCover = isPlayerCrouched && nearCover;
    if (this.inCover !== wasCover) {
      this.updateTacticalVitals();
    }

    // Passive Combat Health Recovery (regenerates after 3.2s without damage)
    if (this.playerHealth < this.maxPlayerHealth && time - this.lastDamageTakenAt > 3200) {
      this.playerHealth = Math.min(this.maxPlayerHealth, this.playerHealth + (delta / 1000) * 16);
      this.updateTacticalVitals();
    }

    // Atmospheric Battlefield Polish (Desert Wind Sand, Fire Embers & Distant Artillery)
    if (!dialogueBlocking && this.currentEnvironment === 'outpost') {
      // 1. Drifting desert sand grains in wind
      this.ambientWindTimer = (this.ambientWindTimer || 0) + delta;
      if (this.ambientWindTimer > 240 && this.textures.exists('particle_sand_grain')) {
        this.ambientWindTimer = 0;
        const cam = this.cameras.main;
        const sx = cam.scrollX - 40;
        const sy = 620 + Math.random() * 160;
        const sand = this.add.image(sx, sy, 'particle_sand_grain').setDepth(111).setAlpha(0.45);
        this.tweens.add({
          targets: sand,
          x: sx + cam.width + 100,
          y: sy + (Math.random() - 0.5) * 40,
          duration: 3200 + Math.random() * 800,
          onComplete: () => sand.destroy()
        });
      }

      // 2. Burning wreck fiery embers
      this.emberTimer = (this.emberTimer || 0) + delta;
      if (this.emberTimer > 280 && this.textures.exists('particle_ember')) {
        this.emberTimer = 0;
        const emberX = 1540 + (Math.random() - 0.5) * 60;
        const emberY = 710;
        const ember = this.add.image(emberX, emberY, 'particle_ember').setDepth(112).setScale(0.85);
        this.tweens.add({
          targets: ember,
          x: emberX + (Math.random() - 0.5) * 40,
          y: emberY - 95 - Math.random() * 45,
          scale: 0.15,
          alpha: 0,
          duration: 1800 + Math.random() * 600,
          onComplete: () => ember.destroy()
        });
      }

      // 3. Distant horizon artillery flash with bass rumble
      this.artilleryFlashTimer = (this.artilleryFlashTimer || 0) + delta;
      if (this.artilleryFlashTimer > 6200) {
        this.artilleryFlashTimer = 0;
        if (this.battleIllumOverlay && !this.battleIllumOverlay.visible) {
          this.battleIllumOverlay.setVisible(true).setAlpha(0.18);
          if (window.soundEngine && typeof window.soundEngine.playTankRumble === 'function') {
            window.soundEngine.playTankRumble();
          }
          this.time.delayedCall(120, () => {
            if (this.battleIllumOverlay) {
              this.battleIllumOverlay.setAlpha(this.extendedMissionState && this.extendedMissionState.id === 12 ? 0.16 : 0);
            }
          });
        }
      }
    }

    // Update Enemy Bullets & Cover Hit Detection
    if (this.enemyBullets && this.enemyBullets.length) {
      const remaining = [];
      const ps = this.player && this.player.sprite ? this.player.sprite : null;
      this.enemyBullets.forEach(eb => {
        if (!eb || !eb.scene) return;
        eb.x += eb.vx * (delta / 1000);
        eb.life -= delta;
        let hit = false;
        if (ps && !dialogueBlocking && Math.abs(eb.x - ps.x) < 22 && Math.abs(eb.y - ps.y) < 44) {
          hit = true;
          if (this.inCover) {
            // Deflected by sandbag cover!
            this.createHitImpact(eb.x, eb.y);
            if (window.soundEngine && typeof window.soundEngine.playSandbagThud === 'function') {
              window.soundEngine.playSandbagThud();
            }
            this.showActionToast('🛡️ DEFLECTED BY COVER!', '#2ec4b6', 400);
          } else {
            // Direct soldier hit
            this.createHitImpact(ps.x, eb.y);
            this.createBloodSpatter(ps.x, eb.y);
            this.playerHealth = Math.max(0, (this.playerHealth || 100) - 14);
            this.lastDamageTakenAt = time || Date.now();
            if (this.cameraController) this.cameraController.shake(0.004, 120);
            this.flashDangerVignette();
            this.updateTacticalVitals();

            if (this.playerHealth <= 0) {
              this.playerHealth = 100;
              this.showActionToast('⭐ माँ का आशीर्वाद: हिम्मत मत हारो! (SECOND WIND!)', '#ffd166', 2200);
              if (window.soundEngine && typeof window.soundEngine.playTanotMataBell === 'function') {
                window.soundEngine.playTanotMataBell();
              }
              this.updateTacticalVitals();
            }

            if (this.redFlareOverlay) {
              this.redFlareOverlay.setAlpha(0.24);
              this.time.delayedCall(180, () => {
                if (this.redFlareOverlay && this.extendedMissionState && [13, 14, 15].includes(this.extendedMissionState.id)) {
                  this.redFlareOverlay.setAlpha(0.11);
                } else if (this.redFlareOverlay) {
                  this.redFlareOverlay.setAlpha(0);
                }
              });
            }
          }
        }
        if (hit || eb.life <= 0) {
          eb.destroy();
        } else {
          remaining.push(eb);
        }
      });
      this.enemyBullets = remaining;
    }

    // Active Supportive Allied Fire & Enemy Tank Warning Shots (Makes Battlefield Feel Real!)
    if (!dialogueBlocking && this.extendedMissionState) {
      this._alliedFireTimer = (this._alliedFireTimer || 0) + delta;
      if (this._alliedFireTimer > 1400) {
        this._alliedFireTimer = 0;
        const mid = this.extendedMissionState.id;
        // Allied cover fire from Major Chandpuri / Bhairon Singh during M13 & M15
        if ((mid === 13 || mid === 15) && this.bhaironSingh && this.bhaironSingh.sprite) {
          const sx = this.bhaironSingh.sprite.x + 34;
          const sy = this.bhaironSingh.sprite.y - 6;
          const tk = this.textures.exists('bullet_tracer_hd') ? 'bullet_tracer_hd' : 'bullet_tracer';
          const tr = this.add.image(sx, sy, tk).setDepth(114).setScale(0.32);
          this.tweens.add({ targets: tr, x: sx + 750, duration: 420, onComplete: () => tr.destroy() });
        }
        // Intact Type-59 tank cannon flash & shell flying overhead in M11
        if (mid === 11 && !this.extendedMissionState.completed && this.enemyTankColumn && this.enemyTankColumn.tanks[1]) {
          const t1 = this.enemyTankColumn.tanks[1];
          if (t1.sprite && !t1.destroyed) {
            this.fireEnemyBullet(t1.sprite.x - 140, t1.sprite.y - 28, false);
          }
        }
      }
    }

    // Tactical Reticle Tracking (Missions 11 & 17)
    if (this.tacticalCrosshair && this.input && this.input.activePointer) {
      const ptr = this.input.activePointer;
      if (ptr.x > 0 || ptr.y > 0) {
        const wp = this.cameras.main.getWorldPoint(ptr.x, ptr.y);
        this.tacticalCrosshair.setPosition(wp.x, wp.y);
      }
      if (this.tankWeakpointRing && this.enemyTankColumn && this.enemyTankColumn.tanks[0] && this.enemyTankColumn.tanks[0].fuelDrum) {
        const drum = this.enemyTankColumn.tanks[0].fuelDrum;
        this.tankWeakpointRing.setPosition(drum.x, drum.y);
      }
    }

    // Extended Mission Runtime Checks (M12, M13, M14, M16)
    const st = this.extendedMissionState;
    if (st && this.player && this.player.sprite) {
      // Mission 12: Reach Outer Bunker Safety (x <= 680)
      if (st.id === 12 && !st.completed && this.player.sprite.x <= 680) {
        st.completed = true;
        this.showActionToast('SAFE IN OUTER TRENCH BUNKER!', '#2ec4b6', 2000);
        this.scheduleMissionComplete(900);
      }

      // Mission 13: Keep minimum enemies advancing & subtle sand drift buildup
      if (st.id === 13 && !st.completed) {
        const alive = this.enemySoldiers.filter(s => s.alive).length;
        if (alive < 2 && st.kills + alive < st.requiredKills) {
          this.spawnWaveSoldiers([1580 + Math.random() * 420], 'run');
        }
      }

      // Mission 14: Scripted Mortar Shell-Shock at x >= 1460 & Hold [E] Family Token Grounding
      if (st.id === 14 && this.player.isCarrying && !st.shellShockTriggered && this.player.sprite.x >= 1460) {
        st.shellShockTriggered = true;
        st.shellShockActive = true;
        if (window.soundEngine.playMortarWhistle) window.soundEngine.playMortarWhistle();
        if (window.soundEngine.playFuelExplosion) window.soundEngine.playFuelExplosion();
        if (window.soundEngine.playTinnitus) window.soundEngine.playTinnitus(4.2);
        this.spawnExplosionSequence(1515, 745, 2.0);
        this.cameraController.shake(0.006, 240);
        this.player.speedMultiplier = 0.45;
        const gc = document.getElementById('game-container');
        if (gc) gc.classList.add('shell-shock-blur');
        const gb = document.getElementById('grounding-box');
        if (gb) gb.classList.remove('hidden');
      }

      if (st.id === 14 && st.shellShockActive && !st.grounded) {
        const eDown = this.player.keys && this.player.keys.interact && this.player.keys.interact.isDown;
        if (eDown) {
          st.groundingProgress = Math.min(100, st.groundingProgress + (delta / 1000) * 90);
          const fill = document.getElementById('grounding-bar-fill');
          if (fill) fill.style.width = `${Math.round(st.groundingProgress)}%`;
          if (st.groundingProgress >= 100) {
            st.grounded = true;
            st.shellShockActive = false;
            this.player.speedMultiplier = 1.0;
            const gc = document.getElementById('game-container');
            if (gc) gc.classList.remove('shell-shock-blur');
            const gb = document.getElementById('grounding-box');
            if (gb) gb.classList.add('hidden');
            window.soundEngine.playInteractTap();
            this.showActionToast('HEARTBEAT STEADY! DELIVER CRATE TO BHAIRON (x=1800)', '#2ec4b6', 2400);
          }
        }
      }

      // Mission 16: Dramatic Tracer Fire Sweeping Dune Ridge
      if (st.id === 16 && !st.smokeDeployed) {
        st.tracerTimer = (st.tracerTimer || 0) + delta;
        if (st.tracerTimer > 950) {
          st.tracerTimer = 0;
          const tk = this.textures.exists('bullet_tracer_hd') ? 'bullet_tracer_hd' : 'bullet_tracer';
          const tr = this.add.image(2750, 710 + Math.random() * 45, tk).setDepth(114).setScale(1.2).setFlipX(true);
          this.tweens.add({ targets: tr, x: 1500, duration: 420, onComplete: () => tr.destroy() });
        }
      }
    }
  }
}

window.TharFrontierScene = TharFrontierScene;

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 1280,
  height: 720,
  backgroundColor: '#070913',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [TharFrontierScene]
};

window.addEventListener('DOMContentLoaded', () => {
  window.game = new Phaser.Game(config);

  const startAudioOnGesture = () => {
    if (window.soundEngine) {
      window.soundEngine.init();
      window.soundEngine.playBGM();
    }
  };

  window.addEventListener('click', startAudioOnGesture);
  window.addEventListener('keydown', startAudioOnGesture);
  window.addEventListener('touchstart', startAudioOnGesture);
});
