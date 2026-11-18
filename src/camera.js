// Cinematic Camera Controller for THAR FRONTIER
// Manages smooth follow, dramatic pans, emotional zoom-ins, screen shakes, and letterboxing.

class CameraController {
    constructor(scene) {
        this.scene = scene;
        this.cam = scene.cameras.main;
        this.isCinematic = false;
        this.originalZoom = 1.0;
    }

    followPlayer(playerSprite, lerpX = 0.08, lerpY = 0.08) {
        this.cam.startFollow(playerSprite, true, lerpX, lerpY);
        this.cam.setZoom(this.originalZoom);
    }

    stopFollow() {
        this.cam.stopFollow();
    }

    panTo(x, y, duration = 1200, zoom = 1.1, onComplete = null) {
        this.cam.stopFollow();
        this.scene.tweens.add({
            targets: this.cam,
            scrollX: x - this.cam.width / 2,
            scrollY: y - this.cam.height / 2,
            zoom: zoom,
            duration: duration,
            ease: 'Power2',
            onComplete: () => {
                if (onComplete) onComplete();
            }
        });
    }

    zoomTo(zoomLevel, duration = 800) {
        const clampedZoom = Math.max(1.0, Math.min(1.08, zoomLevel || 1.0));
        this.scene.tweens.add({
            targets: this.cam,
            zoom: clampedZoom,
            duration: duration,
            ease: 'Sine.easeInOut'
        });
    }

    shake(intensity = 0.005, duration = 220) {
        const safeIntensity = Math.min(intensity || 0.004, 0.006);
        const safeDuration = Math.min(duration || 200, 240);
        this.cam.shake(safeDuration, safeIntensity);
    }

    setCinematicBars(active) {
        this.isCinematic = active;
        const topBar = document.getElementById('letterbox-top');
        const bottomBar = document.getElementById('letterbox-bottom');
        if (topBar && bottomBar) {
            if (active) {
                topBar.classList.add('active');
                bottomBar.classList.add('active');
            } else {
                topBar.classList.remove('active');
                bottomBar.classList.remove('active');
            }
        }
    }
}

window.CameraController = CameraController;

