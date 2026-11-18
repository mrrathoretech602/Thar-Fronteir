// THAR FRONTIER: A SOLDIER'S PROMISE · 1971
// src/missions.js - Complete 10-Minute Mission & Cinematic Dialogue Script

export const MissionsData = [
  {
    id: 1,
    chapter: "Prologue: The Revoked Horizon",
    title: "Mission 1: The Last Journey",
    location: "Jaisalmer Railway Station (Platform 1)",
    duration: 60,
    objective: "Platform par Chaiwala se milein, leave ticket verify karein (x=1450) aur train coach board karein [E].",
    subObjective: "Walk the platform, inspect your ticket & toy rattle, reach the coach entrance.",
    dialogues: [
      {
        speaker: "Havildar Devrath",
        text: "Bas kuch hi ghante... train sidha Shekhawati jayegi. Gudiya ke liye lakdi ka jhunjhuna aur Maa ke ghutne ka tel le liya hai. Pehli baar beti ko god me loonga.",
        portrait: "devrath_happy",
        voicePitch: 1.0
      },
      {
        speaker: "Station Chaiwala",
        text: "Bhai sahab, Fauji babu! Chai lete jao. Chhutti milna toh aajkal kismat ki baat hai border pe!",
        portrait: "chaiwala",
        voicePitch: 1.25
      },
      {
        speaker: "Havildar Devrath",
        text: "Shukriya bhai. Aath mahine baad chulhe ki roti naseeb hogi.",
        portrait: "devrath_happy",
        voicePitch: 1.0
      }
    ],
    triggers: { targetX: 1850, interactionKey: "E", action: "COACH_BOARD" }
  },
  {
    id: 2,
    chapter: "Prologue: The Revoked Horizon",
    title: "Mission 2: The Letter",
    location: "Train Compartment (Window Seat)",
    duration: 60,
    objective: "Maa ka bheja hua inland letter kholein aur padhein [SPACE].",
    subObjective: "Open and read your mother's handwritten letter from Shekhawati.",
    dialogues: [
      {
        speaker: "Maa (Voiceover)",
        text: "Devrath... chhat par se mitti utar di hai, bas tere aane ki der hai. Beti bilkul tere jaisi aakhein leke aayi hai. Sarhad thandi hai, apna dhyan rakhna beta.",
        portrait: "letter_icon",
        voicePitch: 0.85
      },
      {
        speaker: "Havildar Devrath",
        text: "Maa, chithi padhte hi lagta hai ghar pahunch gaya. Bas kal subah aangan me milunga.",
        portrait: "devrath_emotional",
        voicePitch: 1.0
      }
    ],
    triggers: { action: "HOLD_INSPECT", key: "SPACE" }
  },
  {
    id: 3,
    chapter: "Prologue: The Revoked Horizon",
    title: "Mission 3: The Emergency",
    location: "Railway Station Platform",
    duration: 60,
    objective: "Emergency siren bajte hi station exit post par daudein!",
    subObjective: "Air raid sirens screaming! Sprint towards the station exit gate!",
    dialogues: [
      {
        speaker: "Station PA System",
        text: "Emergency alert! Sabhi nagrik shanti banaye rakhein! Airfield sector me red alert ghoshit ho chuka hai!",
        portrait: "speaker_icon",
        voicePitch: 1.3
      },
      {
        speaker: "Station Military Officer",
        text: "Attention all armed forces personnel! Western Command ka flash message hai—All operational leaves stand cancelled with immediate effect!",
        portrait: "officer_shout",
        voicePitch: 0.95
      },
      {
        speaker: "Havildar Devrath",
        text: "Nahi... train chalne wali thi... Sirf 24 ghante...",
        portrait: "devrath_shocked",
        voicePitch: 1.0
      }
    ],
    triggers: { targetX: 1850, interactionKey: "RUN_EXIT" }
  },
  {
    id: 4,
    chapter: "Chapter 1: Return to Duty",
    title: "Mission 4: Leave Cancelled",
    location: "Station Exit Outpost",
    duration: 60,
    objective: "Leave pass surrender karein aur Jonga Convoy Jeep me baithein.",
    subObjective: "Surrender leave pass to Military Police and board the army convoy jeep.",
    dialogues: [
      {
        speaker: "Military Police",
        text: "Havildar Devrath Singh? 23 Punjab, 'A' Company? Board the convoy now.",
        portrait: "mp_officer",
        voicePitch: 0.9
      },
      {
        speaker: "Havildar Devrath",
        text: "Sahab... meri beti abhi 10 din ki hai... bas ek nazar dekhna tha...",
        portrait: "devrath_sad",
        voicePitch: 0.95
      },
      {
        speaker: "MP Officer",
        text: "Jawan... agar aaj sarhad chhoot gayi, toh kal wo ghar aur beti dono mehfooz nahi rahenge. Convoy nikal rahi hai. Chalo.",
        portrait: "mp_officer",
        voicePitch: 0.9
      },
      {
        speaker: "Havildar Devrath",
        text: "Jai Hind, Sahab. Khaki pehle, baki sab baad me.",
        portrait: "devrath_determined",
        voicePitch: 1.0
      }
    ],
    triggers: { vehicleBoard: "JONGA_JEEP", targetX: 1850 }
  },
  {
    id: 5,
    chapter: "Chapter 1: Return to Duty",
    title: "Mission 5: The Long Road",
    location: "Thar Desert Highway",
    duration: 60,
    objective: "Desert convoy me aage badhein aur Tanot Mata ki mitti mathe se lagayein.",
    subObjective: "Ride with the convoy through Thar dunes and receive sector radio orders.",
    dialogues: [
      {
        speaker: "Naik Gurdeep (Driver)",
        text: "Pura sector khali karwaya ja raha hai Devrath bhaji. Tanot Mata ke aage se nikle hain, mitti mathe se laga lo.",
        portrait: "gurdeep",
        voicePitch: 1.15
      },
      {
        speaker: "Havildar Devrath",
        text: "Mata rani raksha karegi. Humari company kahan deploy hai?",
        portrait: "devrath_happy",
        voicePitch: 1.0
      },
      {
        speaker: "Major Chandpuri (Radio)",
        text: "Convoy 4, expedite movement. Longewala outpost par defensive perimeter consolidate karna hai. Over.",
        portrait: "major_radio",
        voicePitch: 0.8
      }
    ],
    triggers: { radioFreq: 104.5, targetX: 2000 }
  },
  {
    id: 6,
    chapter: "Chapter 2: The Sound of Iron",
    title: "Mission 6: Into The Desert",
    location: "Boundary Pillar 638 (Outskirts of Longewala)",
    duration: 60,
    objective: "2Lt Dharam Veer ke sath dunes par crouch-patrol karein aur observation point tak pahunchein.",
    subObjective: "Night patrol across cold dunes to Border Pillar 638 observation ridge.",
    dialogues: [
      {
        speaker: "2Lt Dharam Veer",
        text: "Devrath... zameen par kaan lagao. Kya tumhe kuch ajeeb mehsus ho raha hai?",
        portrait: "dharamveer",
        voicePitch: 1.1
      },
      {
        speaker: "Havildar Devrath",
        text: "Sahab... ret kaanp rahi hai. Ye hawa nahi hai... heavy diesel engines ki vibration hai.",
        portrait: "devrath_alert",
        voicePitch: 1.0
      },
      {
        speaker: "2Lt Dharam Veer",
        text: "Binoculars nikalo. Border pillar 638 ke right coordinate par focus karo.",
        portrait: "dharamveer",
        voicePitch: 1.1
      }
    ],
    triggers: { reachRidgeX: 2400, action: "OPEN_BINOCULARS" }
  },
  {
    id: 7,
    chapter: "Chapter 2: The Sound of Iron",
    title: "Mission 7: The Unknown Column",
    location: "Observation Ridge at BP-638",
    duration: 60,
    objective: "Binoculars se dushman ke Type-59 tanks scan karein aur bunker ki taraf daudein!",
    subObjective: "Scan the advancing armored brigade through field binoculars and sprint back to post!",
    dialogues: [
      {
        speaker: "Havildar Devrath",
        text: "Waheguru... Sahab, ye koi choti patrol party nahi hai... Type-59 tanks hain! Poori brigade badh rahi hai humari taraf!",
        portrait: "devrath_shocked",
        voicePitch: 1.0
      },
      {
        speaker: "2Lt Dharam Veer",
        text: "God in heaven... kam se kam 40 tanks aur hazaron infantry! Turant post par bhaago! Major sahab ko wireless dena hoga abhi!",
        portrait: "dharamveer",
        voicePitch: 1.1
      },
      {
        speaker: "Havildar Devrath",
        text: "Daudte hain sahab, ek second bhi gavaya toh outpost ghir jayegi!",
        portrait: "devrath_alert",
        voicePitch: 1.0
      }
    ],
    triggers: { targetsIdentified: 3, returnToBunkerX: 1520 }
  },
  {
    id: 8,
    chapter: "Chapter 3: Hold the Line",
    title: "Mission 8: The Last Decision",
    location: "Longewala Command Bunker",
    duration: 60,
    objective: "Major Chandpuri ki briefing sunein aur Command Bunker par Stand-To Sankalp lein [E].",
    subObjective: "Attend tactical war council: Fall back or hold the outpost to the last man?",
    dialogues: [
      {
        speaker: "Major Chandpuri",
        text: "Jawano, HQ Sadhewala se clear order hai. Humare paas tanks nahi hain, aur Air Force subah suraj nikalne se pehle nahi aa sakti. Humare paas do raaste hain: Post chhod kar peeche hat jao... ya yahan datte raho.",
        portrait: "major_chandpuri",
        voicePitch: 0.8
      },
      {
        speaker: "BSF Bhairon Singh",
        text: "Sahab, BSF aur Punjab regiment ke rehte dushman bina lade aage badh jaye, ye nahi hoga!",
        portrait: "bhairon_singh",
        voicePitch: 0.9
      },
      {
        speaker: "Havildar Devrath",
        text: "Sahab, humne chhutti ka ticket desh ke liye choda hai. Ret ke iss teele ko unki kabristan bana denge par peeche nahi hatenge!",
        portrait: "devrath_determined",
        voicePitch: 1.0
      },
      {
        speaker: "Major Chandpuri",
        text: "Bole So Nihal... Sat Sri Akal! Har jawan apni trench sambhalo!",
        portrait: "major_chandpuri",
        voicePitch: 0.8
      }
    ],
    triggers: { briefingComplete: true }
  },
  {
    id: 9,
    chapter: "Chapter 3: Hold the Line",
    title: "Mission 9: Prepare The Outpost",
    location: "Outer Trenches & Sand Dike",
    duration: 60,
    objective: "Sandbag wall (1920→1560), MMG ammo crate (2020→1220) aur barbed wire (2240) deploy karein (3/3).",
    subObjective: "Deliver ammo crates to gun pit and stretch deceptive barbed wire fence across the ridge.",
    dialogues: [
      {
        speaker: "Havildar Devrath",
        text: "Sukhwinder! MMG ka spare barrel aur belt taiyar rakh! Ret mein jam nahi honi chahiye!",
        portrait: "devrath_action",
        voicePitch: 1.0
      },
      {
        speaker: "BSF Bhairon Singh",
        text: "Devrath, mines khatam ho gayi hain, ye normal kaantedar taar kyun laga rahe hain?",
        portrait: "bhairon_singh",
        voicePitch: 0.9
      },
      {
        speaker: "Havildar Devrath",
        text: "Dushman andhere me ise minefield samajhkar ruk jayega! Humein subah hone tak ka waqt mil jayega!",
        portrait: "devrath_determined",
        voicePitch: 1.0
      }
    ],
    triggers: { ammoDelivered: true, wirePlaced: true }
  },
  {
    id: 10,
    chapter: "Chapter 3: Hold the Line",
    title: "Mission 10: The First Night",
    location: "Trench Crest overlooking the Thar Desert",
    duration: 60,
    objective: "Dushman tanks ko 150m Kill Zone me aane dein (Hold Fire!) — range aate hi [E] / [J] se RCL Volley daagein!",
    subObjective: "Take firing position in trench. Face the massive 45-tank armored brigade at 02:00 AM!",
    dialogues: [
      {
        speaker: "Major Chandpuri",
        text: "Hold your fire! Jab tak tank 150 meter ke range me na aaye, koi goli nahi chalayega!",
        portrait: "major_chandpuri",
        voicePitch: 0.8
      },
      {
        speaker: "Havildar Devrath",
        text: "Gudiya... tere baap ka wada hai... subah ka suraj dekhkar hi dum lega.",
        portrait: "devrath_determined",
        voicePitch: 1.0
      }
    ],
    triggers: { readyTrenchPosition: true }
  },
  {
    id: 11,
    chapter: "Chapter 4: Night of the Burning Dunes",
    title: "Mission 11: The First Armor Kill",
    location: "Longewala RCL Gun Pit · 00:30 AM",
    duration: 90,
    objective: "106mm RCL Gun aim karein aur Type-59 tank ke pichle diesel fuel drum par hit karein! (Front armor par goli bounce hogi)",
    subObjective: "Aim the 106mm RCL gun at the rear diesel barrel as the tank climbs the dune.",
    dialogues: [
      {
        speaker: "Major Chandpuri (Radio)",
        text: "Front plate par ammunition barbad mat karo! Devrath, tank ke peeche bandhe diesel barrels par nishana lo!",
        portrait: "major_chandpuri",
        voicePitch: 0.85
      },
      {
        speaker: "Havildar Devrath",
        text: "Range 180 meters... turret angle 15 degrees... Taiyaar!",
        portrait: "devrath_action",
        voicePitch: 1.0
      }
    ],
    triggers: { targetType: "TANK_REAR_FUEL", requiredKills: 1 }
  },
  {
    id: 12,
    chapter: "Chapter 4: Night of the Burning Dunes",
    title: "Mission 12: The Desert Sun",
    location: "Exposed Perimeter Jeep Bay · 01:15 AM",
    duration: 60,
    objective: "130mm Artillery barrage se bachne ke liye RCL Jeep chhodkar Sandbag Bunker (Left x <= 680) me sprint karein!",
    subObjective: "Burning tank light exposes enemy infantry! Sprint left into the outer bunker before artillery hits.",
    dialogues: [
      {
        speaker: "Havildar Devrath",
        text: "Direct hit! Pehla tank dher ho gaya! Poora registan din ki tarah roshan ho gaya hai!",
        portrait: "devrath_determined",
        voicePitch: 1.0
      },
      {
        speaker: "Naik Bhairon Singh (BSF)",
        text: "Devrath! Jeep chhod ke daudo! Unki 130mm artillery ne range lock kar li hai!",
        portrait: "bhairon_singh",
        voicePitch: 0.9
      },
      {
        speaker: "Havildar Devrath",
        text: "Main cover me aa raha hoon! Khai khali rakho!",
        portrait: "devrath_alert",
        voicePitch: 1.05
      }
    ],
    triggers: { targetX: 680, dodgeArtillery: true }
  },
  {
    id: 13,
    chapter: "Chapter 5: The Bleeding Barchans",
    title: "Mission 13: Silica Sand & The Jammed SLR",
    location: "Forward Defense Trench · 03:00 AM",
    duration: 90,
    objective: "Jam hone par [R] dabakar SLR chamber saaf karein (2x) aur chadh rahe dushman squad (6) ko rokein!",
    subObjective: "Clear silica sand jams with [R] when the gun locks up and hold off enemy infantry rush.",
    dialogues: [
      {
        speaker: "Havildar Devrath",
        text: "Yeh regiraat har cheez me ghus rahi hai... rifle chamber jam ho gaya!",
        portrait: "devrath_shocked",
        voicePitch: 1.0
      },
      {
        speaker: "Sepoy Sukhwinder",
        text: "Devrath! Bayein bunker se dushman teele par chadh raha hai! MMG ka ammo box khatam ho gaya!",
        portrait: "officer_shout",
        voicePitch: 1.1
      },
      {
        speaker: "Havildar Devrath",
        text: "Rifle saaf karke aata hoon — tab tak dushman ko teele se neeche rakho!",
        portrait: "devrath_action",
        voicePitch: 1.0
      }
    ],
    triggers: { clearJams: 2, enemyKills: 6 }
  },
  {
    id: 14,
    chapter: "Chapter 5: The Bleeding Barchans",
    title: "Mission 14: The Ammo Run & Shell-Shock",
    location: "Trench Corridor · 04:15 AM",
    duration: 75,
    objective: "20kg MMG Ammo Crate bunker (x=1220) se utha kar Bhairon Singh (x=1800) tak pahunchayein! Shell-shock par [E] hold karein!",
    subObjective: "Dodge mortar craters, hold [E] for Family Token during shell-shock, and deliver ammo to Bhairon Singh.",
    dialogues: [
      {
        speaker: "Havildar Devrath",
        text: "Main main bunker se 20kg crate leke aata hoon, tum grenade fenk kar unhe roko!",
        portrait: "devrath_determined",
        voicePitch: 1.0
      },
      {
        speaker: "Naik Bhairon Singh (BSF)",
        text: "Jaldi karo Devrath! Mortar fire khandak ke bilkul paas gir raha hai!",
        portrait: "bhairon_singh",
        voicePitch: 0.9
      }
    ],
    triggers: { deliverCrate: true, useGroundingItem: true }
  },
  {
    id: 15,
    chapter: "Chapter 5: The Bleeding Barchans",
    title: "Mission 15: The Desperate Hours",
    location: "Longewala Inner Perimeter · 05:10 AM",
    duration: 100,
    objective: "15% bachi hui goliyaan soch-samajh kar chalayein aur subah hone tak 3 aakhri dushman waves rokein!",
    subObjective: "Conserve final reserve ammo and survive all 3 pre-dawn infantry assault waves.",
    dialogues: [
      {
        speaker: "Naik Bhairon Singh (BSF)",
        text: "Jeete raho Devrath! Ab dekho yeh MMG kaise bolti hai! Sat Sri Akal!",
        portrait: "bhairon_singh",
        voicePitch: 0.9
      },
      {
        speaker: "Major Chandpuri",
        text: "Aakhri magazine bachi hai jawano! Har goli dushman ke seene par honi chahiye! Bas aadha ghanta aur... poorab me roshni hone lagi hai!",
        portrait: "major_chandpuri",
        voicePitch: 0.85
      },
      {
        speaker: "Havildar Devrath",
        text: "Sahab! Suraj nikalne tak hum khade rahenge!",
        portrait: "devrath_determined",
        voicePitch: 1.0
      }
    ],
    triggers: { surviveWaves: 3 }
  },
  {
    id: 16,
    chapter: "Chapter 6: The Hunters of Dawn",
    title: "Mission 16: Signal The Sky",
    location: "High Dune Observation Crest · 06:30 AM",
    duration: 60,
    objective: "Unche Sand Dune Crest (Right x = 2320) par pahunchein aur [E] dabakar IAF ke liye Orange Smoke Signal chhodein!",
    subObjective: "Sprint to the highest sand dune crest overlooking the enemy column and pop Orange Signal Smoke.",
    dialogues: [
      {
        speaker: "Major Atma Singh (IAF Recon)",
        text: "Longewala ground post, this is Air Observation! Main tumhare upar hoon, tanks ki exact alignment mark karo!",
        portrait: "pilot_radio",
        voicePitch: 1.1
      },
      {
        speaker: "Major Chandpuri",
        text: "Devrath! Choti par jaao aur smoke grenade pop karo! Air Force ko batana hoga dushman kahan hai!",
        portrait: "major_chandpuri",
        voicePitch: 0.85
      },
      {
        speaker: "Havildar Devrath",
        text: "Jai Tanot Mata! Abhi dhuan nikalta hoon sahab!",
        portrait: "devrath_action",
        voicePitch: 1.0
      }
    ],
    triggers: { reachDuneCrest: true, deploySmoke: true }
  },
  {
    id: 17,
    chapter: "Chapter 6: The Hunters of Dawn",
    title: "Mission 17: Wrath of the Hawker Hunters",
    location: "Longewala Dawn Battlefield · 07:15 AM",
    duration: 80,
    objective: "Ret me phanse 4 enemy Type-59 tanks par target lock (Click / [J]) karein taaki Hawker Hunter jets rocket barsayein!",
    subObjective: "Designate 4 stranded Pakistani tanks with the tactical reticle for Hawker Hunter rocket strikes.",
    dialogues: [
      {
        speaker: "Wing Commander Bawa (IAF)",
        text: "Boys, welcome to the turkey shoot! Target visual confirmed, diving in with 30mm ADEN & rockets!",
        portrait: "pilot_radio",
        voicePitch: 0.95
      },
      {
        speaker: "Naik Bhairon Singh (BSF)",
        text: "Dekho! Dushman bhag raha hai! Unke tank ret me dhas gaye! Har Har Mahadev · Jo Bole So Nihal!",
        portrait: "bhairon_singh",
        voicePitch: 1.05
      }
    ],
    triggers: { airStrikeTargetsHit: 4 }
  },
  {
    id: 18,
    chapter: "Epilogue: A Soldier's Promise Kept",
    title: "Mission 18: The Unsent Letter Answered",
    location: "Peaceful Dawn over Longewala · 08:30 AM",
    duration: 60,
    objective: "Shaant ranbhoomi par chalkar Memorial (x=505) ya Command Bunker (x=1350) par [E] dabayein aur Maa ko jawab likhein.",
    subObjective: "Walk the quiet sunrise battlefield beneath the Tiranga and finish your letter home.",
    dialogues: [
      {
        speaker: "Havildar Devrath",
        text: "Maa... train chhoot gayi thi meri, par himmat nahi chhooti. Beti ko bolna uska baap uske aane wale kal ki hifazat ke liye yahan ruk gaya tha.",
        portrait: "devrath_emotional",
        voicePitch: 0.95
      },
      {
        speaker: "Havildar Devrath",
        text: "Sarhad mehfooz hai... aur tera beta jald ghar aayega.",
        portrait: "devrath_happy",
        voicePitch: 0.95
      }
    ],
    triggers: { completeCinematicWalk: true }
  }
];

export class MissionManager {
  constructor(scene) {
    this.scene = scene;
    this.currentMissionIndex = 0;
    this.currentMission = MissionsData[0];
    this.isMissionActive = false;
    this.completeTimer = null;
  }

  getCurrentMission() {
    return this.currentMission;
  }

  startMission(index) {
    if (this.completeTimer) {
      this.completeTimer.remove(false);
      this.completeTimer = null;
    }
    if (index >= MissionsData.length) {
      this.triggerCampaignOutro();
      return;
    }
    this.currentMissionIndex = index;
    this.currentMission = MissionsData[index];
    this.isMissionActive = true;

    if (window.saveSystem) {
      window.saveSystem.setMission(this.currentMission.id);
    }

    // Emit event for UI and scene logic
    this.scene.events.emit("onMissionStarted", this.currentMission);

    // Show Title Card
    if (window.cutsceneManager) {
      window.cutsceneManager.showTitleCard(
        this.currentMission.chapter,
        this.currentMission.title,
        this.currentMission.location,
        2800,
        () => {
          this.playMissionDialogues();
        }
      );
    } else {
      this.playMissionDialogues();
    }
  }

  playMissionDialogues() {
    if (this.scene.dialogueManager && this.currentMission.dialogues && this.currentMission.dialogues.length > 0) {
      this.scene.dialogueManager.startDialogueChain(this.currentMission.dialogues, () => {
        this.scene.events.emit("onDialogueSequenceFinished", this.currentMission);
      });
    }
  }

  completeMission() {
    if (this.completeTimer) {
      this.completeTimer.remove(false);
      this.completeTimer = null;
    }
    this.isMissionActive = false;
    this.scene.events.emit("onMissionCompleted", this.currentMission);

    // Auto advance to next mission after a brief cinematic pause
    this.completeTimer = this.scene.time.delayedCall(1600, () => {
      this.completeTimer = null;
      this.startMission(this.currentMissionIndex + 1);
    });
  }

  triggerCampaignOutro() {
    this.scene.events.emit("onCampaignDemoFinished");
  }
}

// Attach to window for universal access across module and vanilla scripts
if (typeof window !== 'undefined') {
  window.MissionsData = MissionsData;
  window.MissionManager = MissionManager;
}
