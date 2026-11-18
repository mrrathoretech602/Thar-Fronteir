// THAR FRONTIER: A SOLDIER'S PROMISE · 1971
// Save System: Tracks mission progression, letter reads, and checkpoint states in localStorage.

class SaveSystem {
    constructor() {
        this.storageKey = 'thar_frontier_1971_save';
        this.data = this.load();
    }

    getDefaults() {
        return {
            currentMission: 1,
            completedMissions: [],
            hasReadLetter: false,
            hasInspectedTicket: false,
            sandbagsPlaced: 0,
            ammoCratesDelivered: 0,
            shrineVisited: false,
            audioMuted: false,
            lastCheckpoint: 'mission_1'
        };
    }

    load() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            if (raw) {
                return Object.assign(this.getDefaults(), JSON.parse(raw));
            }
        } catch (e) {
            console.warn("Could not load save data:", e);
        }
        return this.getDefaults();
    }

    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        } catch (e) {
            console.warn("Could not save data:", e);
        }
    }

    setMission(missionNum) {
        this.data.currentMission = missionNum;
        if (!this.data.completedMissions.includes(missionNum - 1) && missionNum > 1) {
            this.data.completedMissions.push(missionNum - 1);
        }
        this.save();
    }

    reset() {
        this.data = this.getDefaults();
        this.save();
    }
}

window.saveSystem = new SaveSystem();

