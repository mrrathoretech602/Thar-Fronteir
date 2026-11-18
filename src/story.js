// Story Director for THAR FRONTIER: A SOLDIER'S PROMISE · 1971
// Orchestrates 10-Minute Campaign: Objectives, Sequences, Dialogues, Audio & Mission Progression.

class StoryDirector {
    constructor(scene) {
        this.scene = scene;
        this.currentMissionIndex = 1;
        this.missionData = window.MISSIONS_DATA;
    }

    startCampaign(startMission = 1) {
        this.loadMission(startMission);
    }

    loadMission(missionNum) {
        this.currentMissionIndex = missionNum;
        const data = this.missionData[missionNum];
        if (!data) return;

        if (window.saveSystem) {
            window.saveSystem.setMission(missionNum);
        }

        // Update UI
        this.updateHUD(data);

        // Show Cinematic Title Card
        if (window.cutsceneManager) {
            window.cutsceneManager.showTitleCard(
                data.chapter,
                data.title,
                data.location,
                3200,
                () => {
                    this.executeMissionLogic(missionNum);
                }
            );
        } else {
            this.executeMissionLogic(missionNum);
        }
    }

    updateHUD(data) {
        const chapElem = document.getElementById('hud-chapter');
        const missElem = document.getElementById('hud-mission');
        const objElem = document.getElementById('hud-objective');

        if (chapElem) chapElem.textContent = data.chapter;
        if (missElem) missElem.textContent = data.title;
        if (objElem) objElem.innerHTML = `<strong>उद्देश्य:</strong> ${data.objective}<br><span style="color:#b8a9c9;font-size:12px;">${data.subObjective}</span>`;
    }

    executeMissionLogic(missionNum) {
        const scene = this.scene;
        const data = this.missionData[missionNum];

        switch (missionNum) {
            case 1:
                // Mission 1: The Last Journey
                window.soundEngine.startAmbience('station');
                window.soundEngine.playSteamWhistle();
                scene.setupStationEnvironment();

                // Devrath intro thoughts
                window.dialogueManager.start(data.dialogues.intro, () => {
                    scene.setupMission1Interactions();
                });
                break;

            case 2:
                // Mission 2: The Letter
                scene.setupMission2Interactions();
                break;

            case 3:
                // Mission 3: The Emergency
                window.soundEngine.startAirRaidSiren();
                scene.cameraController.shake(0.015, 600);
                scene.setupMission3Interactions();
                break;

            case 4:
                // Mission 4: Leave Cancelled
                window.soundEngine.stopAirRaidSiren();
                scene.setupMission4Interactions();
                break;

            case 5:
                // Mission 5: The Long Road (Desert Convoy)
                window.cutsceneManager.fadeToBlack(700, () => {
                    scene.setupConvoyEnvironment();
                    window.soundEngine.startAmbience('convoy');
                }, () => {
                    window.dialogueManager.start(data.dialogues.convoyTalk, () => {
                        scene.setupMission5Interactions();
                    });
                });
                break;

            case 6:
                // Mission 6: Into The Desert (Longewala Night Patrol)
                window.cutsceneManager.fadeToBlack(700, () => {
                    scene.setupOutpostEnvironment();
                    window.soundEngine.startAmbience('night_outpost');
                }, () => {
                    window.dialogueManager.start(data.dialogues.patrolStart, () => {
                        scene.setupMission6Interactions();
                    });
                });
                break;

            case 7:
                // Mission 7: The Unknown Column
                scene.setupMission7Interactions();
                break;

            case 8:
                // Mission 8: The Last Decision (War Council)
                scene.player.sprite.setPosition(1500, 720);
                scene.cameraController.panTo(1500, 680, 1000, 1.2, () => {
                    window.dialogueManager.start(data.dialogues.councilDialogue, () => {
                        scene.cameraController.zoomTo(1.0, 600);
                        this.advanceMission();
                    });
                });
                break;

            case 9:
                // Mission 9: Prepare The Outpost
                scene.setupMission9Interactions();
                break;

            case 10:
                // Mission 10: The First Night
                scene.setupMission10Interactions();
                break;
        }
    }

    advanceMission() {
        if (this.currentMissionIndex < 10) {
            this.loadMission(this.currentMissionIndex + 1);
        } else {
            // Demo Complete
            window.cutsceneManager.showDemoEnding();
        }
    }
}

window.StoryDirector = StoryDirector;
