// THAR FRONTIER: A SOLDIER'S PROMISE · 1971
// src/dialogue.js - Dialogue & Cinematic Controller

export class DialogueManager {
  constructor(scene) {
    this.scene = scene;
    this.dialogueQueue = [];
    this.isTyping = false;
    this.currentText = "";
    this.currentDialogue = null;
    this.portraitImage = null;
    this.speakerText = null;
    this.bodyText = null;
    this.onCompleteCallback = null;
    this.typingTimer = null;

    this.createUI();
  }

  get isActive() {
    return !!(this.container && this.container.visible);
  }

  createUI() {
    const { width, height } = this.scene.cameras.main;

    // Dialogue Container Group (Level 6, Z: 1000, Scroll: 0 pinned to screen)
    this.container = this.scene.add.container(0, height - 190)
      .setDepth(1000)
      .setScrollFactor(0)
      .setVisible(false);

    // Cinematic Box Background (Paper-Art styled dark overlay)
    const bg = this.scene.add.rectangle(width / 2, 85, width - 80, 150, 0x121417, 0.94)
      .setStrokeStyle(2, 0xd4af37, 0.85); // Golden Rajasthani border trim

    // Portrait Frame
    const portraitBg = this.scene.add.rectangle(130, 85, 110, 110, 0x1e2229)
      .setStrokeStyle(1.5, 0x8b7355, 0.9);
    this.portraitImage = this.scene.add.image(130, 85, "devrath_happy").setDisplaySize(100, 100);

    // Text Labels
    this.speakerText = this.scene.add.text(210, 26, "", {
      fontFamily: "'Cinzel', 'Noto Serif', serif",
      fontSize: "20px",
      fontStyle: "bold",
      color: "#f6c445"
    });

    this.bodyText = this.scene.add.text(210, 60, "", {
      fontFamily: "'Rajdhani', 'Roboto', sans-serif",
      fontSize: "19px",
      color: "#f4f1de",
      lineSpacing: 4,
      wordWrap: { width: width - 330 }
    });

    const continuePrompt = this.scene.add.text(width - 180, 138, "[SPACE / E] Continue ▸", {
      fontFamily: "'Cinzel', monospace",
      fontSize: "12px",
      color: "#cda160"
    });

    this.container.add([bg, portraitBg, this.portraitImage, this.speakerText, this.bodyText, continuePrompt]);

    // Space Key listener to advance
    this.scene.input.keyboard.on("keydown-SPACE", () => {
      if (this.isActive) this.advance();
    });

    this.scene.input.keyboard.on("keydown-E", () => {
      if (this.isActive) this.advance();
    });

    // Escape Key listener to skip entire dialogue instantly (Smooth playability for repeat playthroughs!)
    this.scene.input.keyboard.on("keydown-ESC", () => {
      if (this.isActive) this.close();
    });

    // Mouse click listener (single authoritative pointer owner during dialogue)
    this.scene.input.on("pointerdown", (pointer) => {
      if (!this.isActive) return;
      const ev = pointer && pointer.event;
      const target = ev && ev.target;
      if (target && target.closest && (target.closest('#hud-bar') || target.closest('.modal-overlay:not(.hidden)'))) {
        return;
      }
      this.advance();
    });
  }

  startDialogueChain(dialogues, onComplete) {
    if (!dialogues || dialogues.length === 0) {
      if (onComplete) onComplete();
      return;
    }
    this.dialogueQueue = [...dialogues];
    this.onCompleteCallback = onComplete;
    this.container.setVisible(true);

    if (window.cameraController) {
      window.cameraController.setCinematicBars(true);
    }

    this.showNextDialogue();
  }

  showNextDialogue() {
    if (this.dialogueQueue.length === 0) {
      this.close();
      return;
    }

    const item = this.dialogueQueue.shift();
    this.currentDialogue = item;
    this.speakerText.setText(item.speaker);

    // Set Portrait (HD Battle Pack + Official Hero Painting)
    const setScaledPortrait = (key) => {
      if (!this.scene.textures.exists(key)) return false;
      this.portraitImage.setTexture(key);
      const tex = this.scene.textures.get(key).getSourceImage();
      if (tex && tex.width && tex.height) {
        const scale = Math.min(102 / tex.width, 102 / tex.height);
        this.portraitImage.setDisplaySize(Math.round(tex.width * scale), Math.round(tex.height * scale));
      } else {
        this.portraitImage.setDisplaySize(100, 100);
      }
      return true;
    };

    const pKey = item.portrait || '';
    const spk = (item.speaker || '').toLowerCase();
    let applied = false;

    if (pKey === 'pilot_radio' || spk.includes('pilot') || spk.includes('atma') || spk.includes('bawa')) {
      applied = setScaledPortrait('portrait_pilot_hd');
    } else if (pKey === 'bhairon_singh' || spk.includes('bhairon') || spk.includes('भैरों')) {
      applied = setScaledPortrait('portrait_bhairon_hd');
    } else if (pKey === 'major_chandpuri' || pKey === 'major_radio' || spk.includes('chandpuri') || spk.includes('चांदपुरी')) {
      applied = setScaledPortrait('portrait_chandpuri_hd');
    } else if (pKey === 'letter_icon' || spk.includes('maa')) {
      applied = setScaledPortrait('maa_letter_hd');
    } else if (pKey === 'devrath_hero' || spk.includes('devrath') || spk.includes('देवरथ')) {
      // Battle-worn Devrath for combat cues, heroic oil painting for happy/determined beats
      const preferBattle = ['devrath_action', 'devrath_shocked', 'devrath_alert'].includes(pKey);
      applied = preferBattle
        ? (setScaledPortrait('portrait_devrath_hd') || setScaledPortrait('devrath_hero'))
        : (setScaledPortrait('devrath_hero') || setScaledPortrait('portrait_devrath_hd'));
    }

    if (!applied) {
      if (!setScaledPortrait(pKey)) {
        setScaledPortrait('portrait_devrath_hd') || setScaledPortrait('devrath_hero');
      }
    }

    // Play vocal chatter
    if (window.soundEngine && typeof window.soundEngine.playVocalChatter === 'function') {
      window.soundEngine.playVocalChatter(item.voicePitch || 1.0);
    }

    // Typewriter effect
    this.bodyText.setText("");
    this.currentText = item.text;
    this.isTyping = true;
    let charIndex = 0;

    if (this.typingTimer) this.typingTimer.remove();

    if (this.currentText && this.currentText.length > 0) {
      this.typingTimer = this.scene.time.addEvent({
        delay: 22,
        repeat: this.currentText.length - 1,
        callback: () => {
          charIndex++;
          this.bodyText.setText(this.currentText.substring(0, charIndex));
          if (charIndex >= this.currentText.length) {
            this.isTyping = false;
          }
        }
      });
    } else {
      this.isTyping = false;
    }

    // Keep camera framed cleanly without annoying dialogue zoom wobble
    if (this.scene && this.scene.cameras && this.scene.cameras.main) {
      this.scene.cameras.main.setZoom(1.0);
    }
  }

  advance() {
    if (!this.isActive) return;
    if (this.isTyping) {
      // Instantly finish sentence on first tap
      if (this.typingTimer) this.typingTimer.remove();
      this.bodyText.setText(this.currentText);
      this.isTyping = false;
    } else {
      this.showNextDialogue();
    }
  }

  close() {
    if (this.typingTimer) {
      this.typingTimer.remove();
      this.typingTimer = null;
    }
    this.isTyping = false;
    this.container.setVisible(false);
    if (this.scene && this.scene.cameras && this.scene.cameras.main) {
      this.scene.cameras.main.setZoom(1.0);
    }

    if (window.cameraController) {
      window.cameraController.setCinematicBars(false);
    }

    // Prevent the click/key that closed dialogue from immediately firing a bullet or leaving stale key state
    if (this.scene && this.scene.player) {
      this.scene.player.shootCooldown = Math.max(this.scene.player.shootCooldown || 0, 260);
      if (typeof this.scene.player.resetInput === 'function') {
        this.scene.player.resetInput();
      }
    }

    if (this.onCompleteCallback) {
      const cb = this.onCompleteCallback;
      this.onCompleteCallback = null;
      cb();
    }
  }

  forceClose() {
    this.dialogueQueue = [];
    this.onCompleteCallback = null;
    this.isTyping = false;
    if (this.typingTimer) {
      this.typingTimer.remove();
      this.typingTimer = null;
    }
    if (this.container) {
      this.container.setVisible(false);
    }
    if (this.scene && this.scene.cameras && this.scene.cameras.main) {
      this.scene.cameras.main.setZoom(1.0);
    }
    if (window.cameraController) {
      window.cameraController.setCinematicBars(false);
    }
    if (this.scene && this.scene.player && typeof this.scene.player.resetInput === 'function') {
      this.scene.player.resetInput();
    }
  }
}

// Attach to window
if (typeof window !== 'undefined') {
  window.DialogueManager = DialogueManager;
}
