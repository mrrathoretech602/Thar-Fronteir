// Proximity Interaction Controller for THAR FRONTIER
// Detects nearby interactive objects and triggers actions when player presses [E].

class InteractionManager {
    constructor(scene) {
        this.scene = scene;
        this.interactables = [];
        this.activeTarget = null;
        this.promptElem = document.getElementById('interaction-prompt');
    }

    register(id, x, y, radius, label, actionCallback, conditionCallback = null, showWaypoint = true) {
        // Destroy existing marker on duplicate id
        this.interactables = this.interactables.filter(item => {
            if (item.id === id) {
                if (item.marker && item.marker.destroy) item.marker.destroy();
                return false;
            }
            return true;
        });

        let marker = null;
        if (showWaypoint && this.scene && this.scene.add) {
            marker = this.scene.add.text(x, y - 92, '▼', {
                fontFamily: 'Arial, sans-serif',
                fontSize: '20px',
                fontStyle: 'bold',
                color: '#fbbf24',
                stroke: '#111827',
                strokeThickness: 4
            }).setOrigin(0.5).setDepth(680).setVisible(false);

            if (this.scene.tweens) {
                this.scene.tweens.add({
                    targets: marker,
                    y: y - 104,
                    alpha: { from: 0.95, to: 0.5 },
                    duration: 720,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }
        }

        this.interactables.push({
            id,
            x,
            y,
            radius,
            label,
            action: actionCallback,
            condition: conditionCallback || (() => true),
            enabled: true,
            marker
        });
    }

    clear() {
        for (const item of this.interactables) {
            if (item.marker && item.marker.destroy) {
                item.marker.destroy();
            }
        }
        this.interactables = [];
        this.activeTarget = null;
        this.hidePrompt();
    }

    update(playerX, playerY) {
        let closest = null;
        let minDistance = Infinity;

        for (const item of this.interactables) {
            const isActive = !!(item.enabled && item.condition());
            if (item.marker) {
                item.marker.setVisible(isActive);
            }
            if (!isActive) continue;

            const dist = Phaser.Math.Distance.Between(playerX, playerY, item.x, item.y);
            if (dist <= item.radius && dist < minDistance) {
                closest = item;
                minDistance = dist;
            }
        }

        if (closest) {
            this.activeTarget = closest;
            this.showPrompt(closest.label);
        } else {
            this.activeTarget = null;
            this.hidePrompt();
        }
    }

    getPrimaryTarget(playerX) {
        let best = null;
        let bestDist = Infinity;
        for (const item of this.interactables) {
            if (!item.enabled || !item.condition() || !item.marker) continue;
            const dx = item.x - playerX;
            const dist = Math.abs(dx);
            if (dist < bestDist) {
                bestDist = dist;
                best = { id: item.id, x: item.x, y: item.y, label: item.label, dx };
            }
        }
        return best;
    }

    handleInteractKey() {
        if (this.activeTarget && this.activeTarget.action) {
            window.soundEngine.playInteractTap();
            this.activeTarget.action();
            return true;
        }
        return false;
    }

    showPrompt(text) {
        if (!this.promptElem) return;
        this.promptElem.innerHTML = `<span class="key-tag">E</span> ${text}`;
        this.promptElem.classList.remove('hidden');
    }

    hidePrompt() {
        if (!this.promptElem) return;
        this.promptElem.classList.add('hidden');
    }
}

window.InteractionManager = InteractionManager;

