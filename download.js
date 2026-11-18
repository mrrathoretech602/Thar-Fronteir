/**
 * THAR FRONTIER: A SOLDIER'S PROMISE · 1971
 * Official Game Showcase & Download Engine Script
 */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initGalleryLightbox();
    initActTabs();
    initAudioWidget();
    initDownloadTriggers();
    initNavbarScroll();
});

/* ==========================================================================
   1. Interactive Desert Sand & Combat Embers Particle Canvas
   ========================================================================== */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];
    const particleCount = 65;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 20;
            this.size = Math.random() * 2.8 + 0.8;
            this.speedY = Math.random() * 0.9 + 0.3;
            this.speedX = (Math.random() - 0.35) * 0.8;
            this.opacity = Math.random() * 0.7 + 0.2;
            // Palette: Warm gold, desert amber, burning ember
            const colors = ['#e5b842', '#ff9933', '#d4af37', '#ff6b35', '#ffffff'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            if (this.y < -10 || this.x < -10 || this.x > width + 10) {
                this.reset();
            }
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.shadowBlur = this.size * 3;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        const p = new Particle();
        p.y = Math.random() * height; // Distribute across initial screen
        particles.push(p);
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        requestAnimationFrame(animate);
    }
    animate();
}

/* ==========================================================================
   2. Screenshot Lightbox Modal
   ========================================================================== */
function initGalleryLightbox() {
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-img');
    const modalCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('lightbox-close');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (!modal || !modalImg) return;

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const title = item.querySelector('h4')?.textContent || 'Thar Frontier 1971 Screenshot';
            const sub = item.querySelector('p')?.textContent || '';
            
            modalImg.src = img.src;
            modalCaption.textContent = `${title} — ${sub}`;
            modal.classList.add('active');
        });
    });

    const closeModal = () => modal.classList.remove('active');

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

/* ==========================================================================
   3. Campaign Acts & Missions Tabs
   ========================================================================== */
function initActTabs() {
    const tabBtns = document.querySelectorAll('.act-tab-btn');
    const actContents = document.querySelectorAll('.act-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetAct = btn.getAttribute('data-act');

            tabBtns.forEach(b => b.classList.remove('active'));
            actContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const activeContent = document.getElementById(`act-${targetAct}`);
            if (activeContent) activeContent.classList.add('active');
        });
    });
}

/* ==========================================================================
   4. Floating Audio Ambience Radio Widget
   ========================================================================== */
function initAudioWidget() {
    const pill = document.getElementById('audio-pill');
    const label = document.getElementById('audio-label');
    if (!pill) return;

    let isPlaying = false;
    let audioCtx = null;
    let bgOsc = null;
    let gainNode = null;

    // Use Web Audio synthetic ambient desert wind & vintage military radio hum
    function startAudio() {
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            
            // Desert wind generator (filtered pink noise)
            const bufferSize = audioCtx.sampleRate * 2;
            const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
            
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
                b6 = white * 0.115926;
            }

            const whiteNoise = audioCtx.createBufferSource();
            whiteNoise.buffer = noiseBuffer;
            whiteNoise.loop = true;

            const filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(380, audioCtx.currentTime);

            gainNode = audioCtx.createGain();
            gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.35, audioCtx.currentTime + 2);

            whiteNoise.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            whiteNoise.start();

            isPlaying = true;
            pill.classList.add('playing');
            if (label) label.textContent = '🔊 AMBIENCE: 1971 THAR WINDS';
        } catch (e) {
            console.log('Audio init prevented:', e);
        }
    }

    function stopAudio() {
        if (audioCtx) {
            try { audioCtx.close(); } catch {}
            audioCtx = null;
        }
        isPlaying = false;
        pill.classList.remove('playing');
        if (label) label.textContent = '📻 PLAY 1971 AMBIENCE';
    }

    pill.addEventListener('click', () => {
        if (!isPlaying) {
            startAudio();
        } else {
            stopAudio();
        }
    });
}

/* ==========================================================================
   5. Direct Download Triggers & Toast Notifications
   ========================================================================== */
function initDownloadTriggers() {
    const downloadBtns = document.querySelectorAll('.trigger-download');
    
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Display friendly notification
            showToast('🚀 Downloading Thar Frontier 1971 Setup.exe (~168 MB)... Direct 1-Click Install!');
        });
    });

    const shareBtn = document.getElementById('btn-share-link');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                showToast('📋 Game Website Link copied to clipboard!');
            }
        });
    }
}

function showToast(message) {
    let toast = document.getElementById('global-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'global-toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: linear-gradient(135deg, #182233 0%, #0a0e17 100%);
            border: 2px solid #d4af37;
            color: #fff;
            padding: 14px 28px;
            border-radius: 30px;
            font-size: 0.95rem;
            font-weight: 700;
            z-index: 1000;
            box-shadow: 0 10px 40px rgba(0,0,0,0.8), 0 0 20px rgba(212,175,55,0.4);
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            pointer-events: none;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.transform = 'translateX(-50%) translateY(0)';
    toast.style.opacity = '1';

    setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(100px)';
        toast.style.opacity = '0';
    }, 4500);
}

/* ==========================================================================
   6. Navbar Dynamic Styling on Scroll
   ========================================================================== */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(5, 7, 12, 0.96)';
            navbar.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.6)';
        } else {
            navbar.style.background = 'rgba(5, 7, 12, 0.88)';
            navbar.style.boxShadow = 'none';
        }
    });
}

