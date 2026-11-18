// Cutscene & Cinematic Overlay Controller for THAR FRONTIER
// Handles Title Cards, Letter inspection, Binocular simulation, Memory fades, and Chapter Cards.

class CutsceneManager {
    constructor() {
        this.titleCardElem = document.getElementById('title-card');
        this.letterModalElem = document.getElementById('letter-modal');
        this.ticketModalElem = document.getElementById('ticket-modal');
        this.binocularModalElem = document.getElementById('binocular-modal');
        this.endingModalElem = document.getElementById('ending-modal');
        this.fadeOverlay = document.getElementById('fade-overlay');
    }

    showTitleCard(chapterText, missionText, subtitleText, duration = 3000, onComplete = null) {
        if (!this.titleCardElem) return;
        const chap = document.getElementById('title-chapter');
        const miss = document.getElementById('title-mission');
        const sub = document.getElementById('title-sub');

        if (chap) chap.textContent = chapterText;
        if (miss) miss.textContent = missionText;
        if (sub) sub.textContent = subtitleText;

        this.titleCardElem.classList.remove('hidden');
        this.titleCardElem.classList.add('visible');

        if (this._titleCardTimer) {
            clearTimeout(this._titleCardTimer);
            this._titleCardTimer = null;
        }
        this._titleCardTimer = setTimeout(() => {
            this._titleCardTimer = null;
            this.titleCardElem.classList.remove('visible');
            this.titleCardElem.classList.add('hidden');
            if (onComplete) onComplete();
        }, duration);
    }

    cancelTitleCard() {
        if (this._titleCardTimer) {
            clearTimeout(this._titleCardTimer);
            this._titleCardTimer = null;
        }
        if (this.titleCardElem) {
            this.titleCardElem.classList.remove('visible');
            this.titleCardElem.classList.add('hidden');
        }
    }

    fadeToBlack(duration = 600, onMidpoint = null, onComplete = null) {
        if (!this.fadeOverlay) return;
        this.fadeOverlay.style.transition = `opacity ${duration / 1000}s ease`;
        this.fadeOverlay.classList.add('active');

        setTimeout(() => {
            if (onMidpoint) onMidpoint();
            setTimeout(() => {
                this.fadeOverlay.classList.remove('active');
                if (onComplete) onComplete();
            }, duration);
        }, duration);
    }

    showLetterModal(onClose = null, isEpilogueAnswer = false) {
        if (!this.letterModalElem) return;

        const titleEl = document.getElementById('letter-modal-title');
        const bodyEl = document.getElementById('letter-modal-body');
        const subEl = document.getElementById('letter-modal-sub');
        const closeBtn = document.getElementById('btn-close-letter');
        const pm1 = document.getElementById('letter-postmark-1');
        const pm2 = document.getElementById('letter-postmark-2');
        const pm3 = document.getElementById('letter-postmark-3');

        if (isEpilogueAnswer) {
            if (pm1) pm1.textContent = 'LONGEWALA';
            if (pm2) pm2.textContent = '05 DEC 1971';
            if (pm3) pm3.textContent = 'POST VICTORIOUS';
            if (titleEl) titleEl.textContent = 'माँ के नाम आख़िरी जवाब (The Unsent Letter Answered)';
            if (bodyEl) {
                bodyEl.innerHTML =
                    `"माँ...<br><br>` +
                    `ट्रेन छूट गई थी मेरी, par हिम्मत नहीं छूटी।<br><br>` +
                    `बिटिया काव्या को बोलना, उसका बाप उसके आने वाले कल की हिफ़ाज़त के लिए यहाँ रुक गया था।<br><br>` +
                    `सरहद महफ़ूज़ है... और तेरा बेटा जल्द घर आएगा।<br><br>— तेरा देवरथ"`.replace('par', 'पर');
            }
            if (subEl) {
                subEl.textContent = '"Maa... My train was missed, not my courage. Tell our daughter her father stayed here to safeguard her tomorrow. The border is safe... your son will come home soon."';
            }
            if (closeBtn) closeBtn.textContent = 'चिट्ठी लिफ़ाफ़े में बंद करें (Seal Letter Home)';
        } else {
            if (pm1) pm1.textContent = 'POSTED';
            if (pm2) pm2.textContent = '01 DEC 1971';
            if (pm3) pm3.textContent = 'SHEKHAWATI';
            if (titleEl) titleEl.textContent = "माँ का आशीर्वाद (Mother's Blessing)";
            if (bodyEl) {
                bodyEl.innerHTML =
                    `"चिरंजीव देवरथ...<br><br>` +
                    `तेरी बिटिया काव्या अब घुटनों के बल चलने लगी है। हर आहट पर दरवाज़े की तरफ देखती है, मानो जानती हो कि उसका बापू आने वाला है।<br><br>` +
                    `गाँव में सब कुशल है। बस मेरी आँखों में तेरी राह है बेटा... समय से घर पहुँचना, अपनी बिटिया को अपनी गोद में खिलाना।<br><br>` +
                    `— तेरी माँ"`;
            }
            if (subEl) {
                subEl.textContent = '"My beloved Devrath, your little daughter Kavya has started crawling. She watches the door at every step, waiting for her father. Come home safely soon."';
            }
            if (closeBtn) closeBtn.textContent = 'पत्र वापस जेब में रखें (Close Letter)';
        }

        this.letterModalElem.classList.remove('hidden');
        window.soundEngine.playPaperRustle();

        const handleClose = () => {
            if (closeBtn && typeof closeBtn.blur === 'function') closeBtn.blur();
            this.letterModalElem.classList.add('hidden');
            closeBtn.removeEventListener('click', handleClose);
            const canvas = document.querySelector('#game-container canvas');
            if (canvas) canvas.focus({ preventScroll: true });
            if (onClose) onClose();
        };
        closeBtn.addEventListener('click', handleClose);
    }

    showTicketModal(onClose = null, isCancelled = false) {
        if (!this.ticketModalElem) return;
        const stampElem = document.getElementById('ticket-cancelled-stamp');
        if (stampElem) {
            if (isCancelled) {
                stampElem.classList.remove('hidden');
            } else {
                stampElem.classList.add('hidden');
            }
        }
        this.ticketModalElem.classList.remove('hidden');
        if (isCancelled && window.soundEngine && window.soundEngine.playRifleCock) {
            window.soundEngine.playRifleCock();
        } else if (window.soundEngine) {
            window.soundEngine.playPaperRustle();
        }

        const closeBtn = document.getElementById('btn-close-ticket');
        const oldText = closeBtn.textContent;
        if (isCancelled) {
            closeBtn.textContent = 'आदेश स्वीकार करें — ड्यूटी पर लौटें (Accept Duty Order)';
        } else {
            closeBtn.textContent = 'टिकट संभाल कर जेब में रखें (Keep Ticket)';
        }
        const handleClose = () => {
            if (closeBtn && typeof closeBtn.blur === 'function') closeBtn.blur();
            this.ticketModalElem.classList.add('hidden');
            closeBtn.textContent = oldText;
            closeBtn.removeEventListener('click', handleClose);
            const canvas = document.querySelector('#game-container canvas');
            if (canvas) canvas.focus({ preventScroll: true });
            if (onClose) onClose();
        };
        closeBtn.addEventListener('click', handleClose);
    }

    openCampaignMenu(currentMissionIndex = 1, onSelectMission = null) {
        const modal = document.getElementById('campaign-modal');
        const grid = document.getElementById('campaign-mission-grid');
        const closeBtn = document.getElementById('btn-close-campaign');
        if (!modal || !grid) return;

        grid.innerHTML = '';
        const list = window.MissionsData || ((typeof MissionsData !== 'undefined') ? MissionsData : []);
        list.forEach((m, idx) => {
            const mNum = m.id || (idx + 1);
            const card = document.createElement('button');
            card.className = 'campaign-card-item' + (mNum === currentMissionIndex ? ' active' : '');
            card.innerHTML = `
                <div class="campaign-item-chapter">${m.chapter || 'CAMPAIGN'}</div>
                <div class="campaign-item-title">M${mNum}: ${m.title || ''}</div>
                <div class="campaign-item-obj">${m.objective || ''}</div>
            `;
            card.addEventListener('click', () => {
                if (typeof card.blur === 'function') card.blur();
                if (window.soundEngine && window.soundEngine.playInteractTap) {
                    window.soundEngine.playInteractTap();
                }
                this.closeCampaignMenu();
                if (onSelectMission) {
                    onSelectMission(mNum);
                } else if (window.gameScene && window.gameScene.jumpToMission) {
                    window.gameScene.jumpToMission(mNum);
                }
            });
            grid.appendChild(card);
        });

        modal.classList.remove('hidden');
        if (closeBtn) {
            const onClose = () => {
                if (typeof closeBtn.blur === 'function') closeBtn.blur();
                this.closeCampaignMenu();
                closeBtn.removeEventListener('click', onClose);
            };
            closeBtn.addEventListener('click', onClose);
        }
    }

    closeCampaignMenu() {
        const modal = document.getElementById('campaign-modal');
        if (modal) modal.classList.add('hidden');
        const canvas = document.querySelector('#game-container canvas');
        if (canvas) canvas.focus({ preventScroll: true });
    }

    showBinoculars(onTankSpotted = null) {
        if (!this.binocularModalElem) return;
        this.binocularModalElem.classList.remove('hidden');
        window.soundEngine.playBinocularsFocus();

        let spotted = false;
        const tankSilhouette = document.getElementById('binocular-tank-target');
        const scanPrompt = document.getElementById('binocular-prompt');

        if (scanPrompt) scanPrompt.textContent = "रेगिस्तान के छोर पर नजर रखें... (Scan the dark ridge...)";

        const timer = setTimeout(() => {
            if (tankSilhouette) {
                tankSilhouette.classList.add('visible');
                window.soundEngine.playTankRumble();
                if (scanPrompt) {
                    scanPrompt.textContent = "⚠️ भारी टैंकों का काफिला दिखाई दे रहा है! (Enemy Armored Column Detected!)";
                    scanPrompt.style.color = "#ff3333";
                }
            }
            spotted = true;
        }, 1800);

        const closeBtn = document.getElementById('btn-close-binocular');
        const handleClose = () => {
            if (closeBtn && typeof closeBtn.blur === 'function') closeBtn.blur();
            clearTimeout(timer);
            this.binocularModalElem.classList.add('hidden');
            closeBtn.removeEventListener('click', handleClose);
            const canvas = document.querySelector('#game-container canvas');
            if (canvas) canvas.focus({ preventScroll: true });
            if (onTankSpotted) onTankSpotted(spotted);
        };
        closeBtn.addEventListener('click', handleClose);
    }

    showDemoEnding(isFullCampaign = true) {
        if (!this.endingModalElem) return;
        const titleEl = document.getElementById('ending-title-text');
        const locEl = document.getElementById('ending-location-text');
        const descEl = document.getElementById('ending-desc-text');

        if (isFullCampaign) {
            if (titleEl) titleEl.textContent = "A SOLDIER'S PROMISE KEPT";
            if (locEl) locEl.textContent = 'Battle of Longewala · 4–5 December 1971';
            if (descEl) {
                descEl.innerHTML =
                    '<strong>Dedicated to the 120 soldiers of 23 Punjab and BSF at the Battle of Longewala (1971).</strong><br><br>' +
                    '<em>They gave up their tomorrow for our today.</em><br><br>' +
                    '34+ enemy tanks destroyed across the burning sands of Thar. The frontier holds, and Havildar Devrath\'s promise to Maa and little Kavya endures.';
            }
        } else {
            if (titleEl) titleEl.textContent = 'THE NIGHT HAS BEGUN';
            if (locEl) locEl.textContent = 'Longewala · December 1971';
            if (descEl) {
                descEl.innerHTML =
                    '120 brave soldiers of 23rd Punjab Regiment stood their ground against an entire Pakistani Armored Brigade throughout the freezing desert night.';
            }
        }

        this.endingModalElem.classList.remove('hidden');
        window.soundEngine.playVictoryCall();
    }
}

window.cutsceneManager = new CutsceneManager();

