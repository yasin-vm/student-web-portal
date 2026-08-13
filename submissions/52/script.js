/* 
   ==========================================================================
   SWETHA'S 6TH MONTH ANNIVERSARY - INTERACTIVE APPLICATION LOGIC
   ==========================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. CONFIG & SETUP
    // ----------------------------------------------------------------------
    const cfg = (typeof CONFIG !== 'undefined') ? CONFIG : {
        partner1Name: "My Love",
        partner2Name: "Swetha",
        anniversaryTitle: "Happy 6th Month Anniversary, Swetha! 💕",
        startDate: "2026-02-13T00:00:00",
        loveLetter: {
            title: "To My Dearest Swetha",
            salutation: "My Sweet Swetha,",
            body: ["Six months of pure happiness with you."],
            signature: "Forever & Always Yours, ❤️"
        },
        timeline: [],
        reasonsToLove: ["Your beautiful smile."],
        gallery: [],
        quiz: [],
        bucketList: []
    };

    // ----------------------------------------------------------------------
    // 1.5 PLAYFUL "ARE YOU DUMB?" RUNAWAY BUTTON GATE
    // ----------------------------------------------------------------------
    const loveGate = document.getElementById('loveGate');
    const yesLoveBtn = document.getElementById('yesLoveBtn');
    const noLoveBtn = document.getElementById('noLoveBtn');
    const gateTeaseMsg = document.getElementById('gateTeaseMsg');

    const teaseMessages = [
        "Hey! You can't click 'No'! 😂",
        "Nice try! But you can't escape! 😜",
        "Error 404: 'No' is impossible to click! 🤪",
        "The 'No' button ran away! Just click YES! 🤣",
        "Admit it, you're Yasin's cute dumbhead! ❤️",
        "Look how big the YES button is getting! 💖"
    ];

    let teaseIdx = 0;
    let yesScale = 1;

    function dodgeNoButton() {
        if (!noLoveBtn) return;
        noLoveBtn.style.position = 'fixed';

        const padding = 60;
        const maxX = window.innerWidth - noLoveBtn.offsetWidth - padding;
        const maxY = window.innerHeight - noLoveBtn.offsetHeight - padding;

        const randomX = Math.max(padding, Math.floor(Math.random() * maxX));
        const randomY = Math.max(padding, Math.floor(Math.random() * maxY));

        noLoveBtn.style.left = `${randomX}px`;
        noLoveBtn.style.top = `${randomY}px`;

        if (gateTeaseMsg) {
            gateTeaseMsg.textContent = teaseMessages[teaseIdx % teaseMessages.length];
            teaseIdx++;
        }

        if (yesLoveBtn) {
            yesScale += 0.1;
            if (yesScale > 1.8) yesScale = 1.8;
            yesLoveBtn.style.transform = `scale(${yesScale})`;
        }
    }

    if (noLoveBtn) {
        noLoveBtn.addEventListener('mouseover', dodgeNoButton);
        noLoveBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            dodgeNoButton();
        });
        noLoveBtn.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            dodgeNoButton();
        });
        noLoveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            dodgeNoButton();
        });
    }

    if (yesLoveBtn) {
        yesLoveBtn.addEventListener('click', () => {
            if (loveGate) {
                loveGate.style.opacity = '0';
                loveGate.style.pointerEvents = 'none';
                setTimeout(() => loveGate.classList.add('hidden'), 600);
            }
            triggerConfettiBurst();
            for (let i = 0; i < 20; i++) {
                particles.push(new HeartParticle(window.innerWidth / 2, window.innerHeight / 2));
            }
            if (typeof customAudio !== 'undefined' && customAudio && customAudio.paused) {
                customAudio.play().then(() => {
                    isPlaying = true;
                    const mBtn = document.getElementById('musicToggleBtn');
                    if (mBtn) {
                        mBtn.querySelector('.btn-text').textContent = 'Pause Song 🎵';
                        mBtn.classList.add('heart-burst-btn');
                    }
                }).catch(() => {});
            }
        });
    }

    if (noLoveBtn) {
        noLoveBtn.addEventListener('mouseover', dodgeNoButton);
        noLoveBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            dodgeNoButton();
        });
        noLoveBtn.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            dodgeNoButton();
        });
        noLoveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            dodgeNoButton();
        });
    }

    if (yesLoveBtn) {
        yesLoveBtn.addEventListener('click', () => {
            if (loveGate) {
                loveGate.style.opacity = '0';
                loveGate.style.pointerEvents = 'none';
                setTimeout(() => loveGate.classList.add('hidden'), 600);
            }
            triggerConfettiBurst();
            for (let i = 0; i < 20; i++) {
                particles.push(new HeartParticle(window.innerWidth / 2, window.innerHeight / 2));
            }
            if (typeof customAudio !== 'undefined' && customAudio && customAudio.paused) {
                customAudio.play().then(() => {
                    isPlaying = true;
                    const mBtn = document.getElementById('musicToggleBtn');
                    if (mBtn) {
                        mBtn.querySelector('.btn-text').textContent = 'Pause Song 🎵';
                        mBtn.classList.add('heart-burst-btn');
                    }
                }).catch(() => {});
            }
        });
    }

    // ----------------------------------------------------------------------
    // 2. AMBIENT HEART PARTICLE CANVAS
    // ----------------------------------------------------------------------
    const heartCanvas = document.getElementById('heartCanvas');
    const ctx = heartCanvas.getContext('2d');
    let width = heartCanvas.width = window.innerWidth;
    let height = heartCanvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = heartCanvas.width = window.innerWidth;
        height = heartCanvas.height = window.innerHeight;
    });

    const particles = [];
    const heartColors = ['#ff3b60', '#ff758c', '#ff7eb3', '#ffd700', '#e83e8c'];

    class HeartParticle {
        constructor(x, y) {
            this.x = x || Math.random() * width;
            this.y = y || height + 20;
            this.size = Math.random() * 15 + 8;
            this.speedY = Math.random() * 1.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.8;
            this.color = heartColors[Math.floor(Math.random() * heartColors.length)];
            this.opacity = Math.random() * 0.7 + 0.3;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotSpeed = (Math.random() - 0.5) * 0.02;
        }

        update() {
            this.y -= this.speedY;
            this.x += Math.sin(this.y * 0.01) + this.speedX;
            this.rotation += this.rotSpeed;

            if (this.y < -30) {
                this.y = height + 20;
                this.x = Math.random() * width;
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            
            // Draw Heart Shape
            ctx.beginPath();
            const topCurveHeight = this.size * 0.3;
            ctx.moveTo(0, topCurveHeight);
            ctx.bezierCurveTo(
                0, 0, 
                -this.size / 2, 0, 
                -this.size / 2, topCurveHeight
            );
            ctx.bezierCurveTo(
                -this.size / 2, (this.size + topCurveHeight) / 2, 
                0, this.size, 
                0, this.size
            );
            ctx.bezierCurveTo(
                0, this.size, 
                this.size / 2, (this.size + topCurveHeight) / 2, 
                this.size / 2, topCurveHeight
            );
            ctx.bezierCurveTo(
                this.size / 2, 0, 
                0, 0, 
                0, topCurveHeight
            );
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < 35; i++) {
        particles.push(new HeartParticle());
    }

    function animateHearts() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateHearts);
    }
    animateHearts();

    // Spawn heart on click / touch
    window.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'A' && e.target.tagName !== 'INPUT') {
            for (let i = 0; i < 5; i++) {
                particles.push(new HeartParticle(e.clientX, e.clientY));
                if (particles.length > 60) particles.shift();
            }
        }
    });

    // ----------------------------------------------------------------------
    // 3. LIVE ANNIVERSARY COUNTDOWN CLOCK
    // ----------------------------------------------------------------------
    const countDaysEl = document.getElementById('countDays');
    const countHoursEl = document.getElementById('countHours');
    const countMinutesEl = document.getElementById('countMinutes');
    const countSecondsEl = document.getElementById('countSeconds');

    function updateAnniversaryTimer() {
        const start = new Date(cfg.startDate).getTime();
        const now = new Date().getTime();
        const diff = now - start;

        if (isNaN(diff) || diff < 0) {
            countDaysEl.textContent = "00";
            countHoursEl.textContent = "00";
            countMinutesEl.textContent = "00";
            countSecondsEl.textContent = "00";
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        countDaysEl.textContent = days < 10 ? '0' + days : days;
        countHoursEl.textContent = hours < 10 ? '0' + hours : hours;
        countMinutesEl.textContent = minutes < 10 ? '0' + minutes : minutes;
        countSecondsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
    }

    updateAnniversaryTimer();
    setInterval(updateAnniversaryTimer, 1000);

    // ----------------------------------------------------------------------
    // 4. DIGITAL 3D LOVE ENVELOPE & MODAL LETTER
    // ----------------------------------------------------------------------
    const waxSeal = document.getElementById('waxSeal');
    const envelopeCard = document.getElementById('envelopeCard');
    const letterModal = document.getElementById('letterModal');
    const closeLetterBtn = document.getElementById('closeLetterBtn');
    const letterBody = document.getElementById('letterBody');

    function renderLetterContent() {
        const letter = cfg.loveLetter;
        document.getElementById('letterTitle').textContent = letter.title || "To My Dearest Swetha";
        document.getElementById('letterSignature').textContent = letter.signature || "Forever & Always Yours, ❤️";

        let bodyHtml = `<p><strong>${letter.salutation || "My Sweet Kunju,"}</strong></p>`;
        if (Array.isArray(letter.body)) {
            letter.body.forEach(paragraph => {
                bodyHtml += `<p>${paragraph}</p>`;
            });
        }
        letterBody.innerHTML = bodyHtml;
    }
    renderLetterContent();

    function openEnvelopeModal() {
        const flap = document.querySelector('.envelope-flap');
        if (flap) {
            flap.style.transform = 'rotateX(180deg)';
        }
        setTimeout(() => {
            letterModal.classList.add('active');
            triggerConfettiBurst();
        }, 300);
    }

    waxSeal.addEventListener('click', openEnvelopeModal);
    envelopeCard.addEventListener('click', openEnvelopeModal);

    closeLetterBtn.addEventListener('click', () => {
        letterModal.classList.remove('active');
        const flap = document.querySelector('.envelope-flap');
        if (flap) flap.style.transform = 'rotateX(0deg)';
    });

    letterModal.addEventListener('click', (e) => {
        if (e.target === letterModal) {
            letterModal.classList.remove('active');
        }
    });

    // ----------------------------------------------------------------------
    // 5. OUR STORY TIMELINE
    // ----------------------------------------------------------------------
    const timelineList = document.getElementById('timelineList');

    function renderTimeline() {
        if (!cfg.timeline || !cfg.timeline.length) return;

        timelineList.innerHTML = cfg.timeline.map((item, idx) => `
            <div class="timeline-item">
                <div class="timeline-dot">${item.icon || '💖'}</div>
                <div class="timeline-content">
                    <span class="timeline-badge">${item.badge || `Milestone ${idx + 1}`}</span>
                    ${item.date ? `<div class="timeline-date">${item.date}</div>` : ''}
                    <h3 class="timeline-title">${item.title}</h3>
                    ${item.img ? `
                        <div class="timeline-img-wrapper">
                            <img src="${item.img}" alt="${item.title}" class="timeline-img" onerror="this.parentElement.style.display='none'">
                        </div>
                    ` : ''}
                    <p class="timeline-desc">${item.description}</p>
                </div>
            </div>
        `).join('');
    }
    renderTimeline();

    // ----------------------------------------------------------------------
    // 6. 100 REASONS WHY I LOVE YOU GENERATOR
    // ----------------------------------------------------------------------
    const reasonNumberEl = document.getElementById('reasonNumber');
    const reasonTextEl = document.getElementById('reasonText');
    const nextReasonBtn = document.getElementById('nextReasonBtn');
    const randomReasonBtn = document.getElementById('randomReasonBtn');
    const reasonCard = document.getElementById('reasonCard');

    let currentReasonIndex = 0;
    const reasons = cfg.reasonsToLove && cfg.reasonsToLove.length ? cfg.reasonsToLove : ["Your contagious smile!"];

    function updateReason(index) {
        reasonCard.style.transform = 'scale(0.95)';
        reasonCard.style.opacity = '0.5';

        setTimeout(() => {
            currentReasonIndex = index;
            reasonNumberEl.textContent = `Reason #${currentReasonIndex + 1}`;
            reasonTextEl.textContent = reasons[currentReasonIndex];
            reasonCard.style.transform = 'scale(1)';
            reasonCard.style.opacity = '1';
        }, 200);
    }

    nextReasonBtn.addEventListener('click', () => {
        const nextIdx = (currentReasonIndex + 1) % reasons.length;
        updateReason(nextIdx);
    });

    randomReasonBtn.addEventListener('click', () => {
        let randIdx = Math.floor(Math.random() * reasons.length);
        if (randIdx === currentReasonIndex && reasons.length > 1) {
            randIdx = (randIdx + 1) % reasons.length;
        }
        updateReason(randIdx);
    });

    // ----------------------------------------------------------------------
    // 7. POLAROID MEMORY GALLERY & LIGHTBOX & FILE UPLOADER
    // ----------------------------------------------------------------------
    const polaroidGrid = document.getElementById('polaroidGrid');
    const photoUploader = document.getElementById('photoUploader');
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxText = document.getElementById('lightboxText');
    const lightboxDate = document.getElementById('lightboxDate');
    const lightboxClose = document.getElementById('lightboxClose');

    let galleryItems = [...(cfg.gallery || [])];

    function renderGallery() {
        polaroidGrid.innerHTML = galleryItems.map((item, idx) => `
            <div class="polaroid-card" data-index="${idx}">
                <div class="polaroid-img-wrapper">
                    <img class="polaroid-img" src="${item.src}" alt="${item.title}" 
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="polaroid-placeholder" style="display:none;">
                        <span class="polaroid-placeholder-icon">💖</span>
                        <span>${item.title || 'Our Memory'}</span>
                        <small style="opacity:0.7;">(Add photo file in assets/)</small>
                    </div>
                </div>
                <div class="polaroid-caption">
                    <h4 class="polaroid-title">${item.title}</h4>
                    <p class="polaroid-text">${item.caption}</p>
                    <span class="polaroid-date">${item.date || ''}</span>
                </div>
            </div>
        `).join('');

        // Attach click listener for lightbox
        document.querySelectorAll('.polaroid-card').forEach(card => {
            card.addEventListener('click', () => {
                const idx = card.getAttribute('data-index');
                openLightbox(galleryItems[idx]);
            });
        });
    }

    function openLightbox(item) {
        lightboxImg.src = item.src;
        lightboxTitle.textContent = item.title;
        lightboxText.textContent = item.caption;
        lightboxDate.textContent = item.date || '';
        lightboxModal.classList.add('active');
    }

    lightboxClose.addEventListener('click', () => lightboxModal.classList.remove('active'));
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) lightboxModal.classList.remove('active');
    });

    // Handle Upload Photos from Web Interface
    photoUploader.addEventListener('change', (e) => {
        const files = e.target.files;
        if (!files || !files.length) return;

        Array.from(files).forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const newMemory = {
                    id: Date.now() + index,
                    src: event.target.result,
                    title: file.name.replace(/\.[^/.]+$/, ""),
                    caption: "A newly added core memory! 💕",
                    date: "Just Now"
                };
                galleryItems.unshift(newMemory);
                renderGallery();
                triggerConfettiBurst();
            };
            reader.readAsDataURL(file);
        });
    });

    renderGallery();

    // ----------------------------------------------------------------------
    // 8. RELATIONSHIP QUIZ GAME
    // ----------------------------------------------------------------------
    const quizQuestionEl = document.getElementById('quizQuestion');
    const quizOptionsEl = document.getElementById('quizOptions');
    const quizFeedbackEl = document.getElementById('quizFeedback');
    const quizProgressEl = document.getElementById('quizProgress');
    const quizStepTextEl = document.getElementById('quizStepText');
    const quizScoreTextEl = document.getElementById('quizScoreText');
    const quizContainer = document.getElementById('quizContainer');
    const quizResult = document.getElementById('quizResult');
    const resultScoreMsg = document.getElementById('resultScoreMsg');
    const retryQuizBtn = document.getElementById('retryQuizBtn');

    let currentQuestionIdx = 0;
    let quizScore = 0;
    const questions = cfg.quiz || [];

    function loadQuizQuestion() {
        if (!questions.length) return;

        if (currentQuestionIdx >= questions.length) {
            showQuizResult();
            return;
        }

        const q = questions[currentQuestionIdx];
        quizQuestionEl.textContent = q.question;
        quizStepTextEl.textContent = `Question ${currentQuestionIdx + 1} of ${questions.length}`;
        quizScoreTextEl.textContent = `Score: ${quizScore}`;
        quizProgressEl.style.width = `${((currentQuestionIdx + 1) / questions.length) * 100}%`;
        quizFeedbackEl.className = 'quiz-feedback';
        quizFeedbackEl.style.display = 'none';

        quizOptionsEl.innerHTML = q.options.map((opt, i) => `
            <button class="quiz-option-btn" data-index="${i}">${opt}</button>
        `).join('');

        document.querySelectorAll('.quiz-option-btn').forEach(btn => {
            btn.addEventListener('click', () => handleQuizAnswer(parseInt(btn.getAttribute('data-index'))));
        });
    }

    function handleQuizAnswer(selectedIndex) {
        const q = questions[currentQuestionIdx];
        const allBtns = document.querySelectorAll('.quiz-option-btn');

        allBtns.forEach(btn => btn.disabled = true);

        if (selectedIndex === q.correct) {
            quizScore++;
            allBtns[selectedIndex].classList.add('correct');
            quizFeedbackEl.textContent = `✨ Correct! ${q.explanation || ''}`;
            quizFeedbackEl.style.color = '#2ecc71';
            triggerConfettiBurst();
        } else {
            allBtns[selectedIndex].classList.add('wrong');
            allBtns[q.correct].classList.add('correct');
            quizFeedbackEl.textContent = `❤️ Nice try! ${q.explanation || ''}`;
            quizFeedbackEl.style.color = '#ff758c';
        }

        quizFeedbackEl.style.display = 'block';

        setTimeout(() => {
            currentQuestionIdx++;
            loadQuizQuestion();
        }, 2200);
    }

    function showQuizResult() {
        quizContainer.classList.add('hidden');
        quizResult.classList.remove('hidden');
        resultScoreMsg.textContent = `You scored ${quizScore} out of ${questions.length}! 🎉`;
        triggerConfettiBurst();
    }

    retryQuizBtn.addEventListener('click', () => {
        currentQuestionIdx = 0;
        quizScore = 0;
        quizResult.classList.add('hidden');
        quizContainer.classList.remove('hidden');
        loadQuizQuestion();
    });

    loadQuizQuestion();

    // ----------------------------------------------------------------------
    // 9. CONFETTI FIREWORKS ENGINE
    // ----------------------------------------------------------------------
    const confettiCanvas = document.getElementById('confettiCanvas');
    const cCtx = confettiCanvas.getContext('2d');
    let cWidth = confettiCanvas.width = window.innerWidth;
    let cHeight = confettiCanvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        cWidth = confettiCanvas.width = window.innerWidth;
        cHeight = confettiCanvas.height = window.innerHeight;
    });

    let confettiParticles = [];
    let confettiAnimating = false;

    function triggerConfettiBurst() {
        const colors = ['#ff3b60', '#ff758c', '#ffd700', '#ffffff', '#ff7eb3'];
        for (let i = 0; i < 60; i++) {
            confettiParticles.push({
                x: cWidth / 2,
                y: cHeight / 2,
                vx: (Math.random() - 0.5) * 14,
                vy: (Math.random() - 0.8) * 14,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 100,
                opacity: 1
            });
        }
        if (!confettiAnimating) {
            confettiAnimating = true;
            renderConfetti();
        }
    }

    function renderConfetti() {
        if (confettiParticles.length === 0) {
            cCtx.clearRect(0, 0, cWidth, cHeight);
            confettiAnimating = false;
            return;
        }
        cCtx.clearRect(0, 0, cWidth, cHeight);
        for (let i = confettiParticles.length - 1; i >= 0; i--) {
            const p = confettiParticles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.25; // Gravity
            p.life--;
            p.opacity = p.life / 100;

            cCtx.save();
            cCtx.globalAlpha = Math.max(0, p.opacity);
            cCtx.fillStyle = p.color;
            cCtx.beginPath();
            cCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            cCtx.fill();
            cCtx.restore();

            if (p.life <= 0) {
                confettiParticles.splice(i, 1);
            }
        }
        requestAnimationFrame(renderConfetti);
    }

    // ----------------------------------------------------------------------
    // 10. "IF THE WORLD WAS ENDING" MUSIC PLAYER (Web Audio API + Audio Track)
    // ----------------------------------------------------------------------
    const musicToggleBtn = document.getElementById('musicToggleBtn');
    let audioCtx = null;
    let isPlaying = false;
    let melodyTimer = null;
    let customAudio = new Audio();
    const songPath = (cfg && cfg.musicUrl) ? cfg.musicUrl : 'assets/if_the_world_was_ending.mp3';
    customAudio.src = encodeURI(songPath);
    customAudio.loop = true;

    // "If the World Was Ending" - JP Saxe Melody & Chord Progression (C - G - Am - F)
    const melodyNotes = [
        { freq: 392.00, duration: 0.4 }, // G4 "If"
        { freq: 392.00, duration: 0.4 }, // G4 "the"
        { freq: 392.00, duration: 0.4 }, // G4 "world"
        { freq: 440.00, duration: 0.5 }, // A4 "was"
        { freq: 392.00, duration: 0.6 }, // G4 "end-"
        { freq: 329.63, duration: 0.6 }, // E4 "-ing"
        { freq: 293.66, duration: 0.5 }, // D4 "you'd"
        { freq: 261.63, duration: 0.5 }, // C4 "come"
        { freq: 293.66, duration: 0.5 }, // D4 "over,"
        { freq: 329.63, duration: 0.8 }, // E4 "right?"
        
        { freq: 392.00, duration: 0.4 }, // G4 "You'd"
        { freq: 392.00, duration: 0.4 }, // G4 "come"
        { freq: 392.00, duration: 0.4 }, // G4 "over"
        { freq: 440.00, duration: 0.5 }, // A4 "and"
        { freq: 392.00, duration: 0.5 }, // G4 "you'd"
        { freq: 329.63, duration: 0.5 }, // E4 "stay"
        { freq: 293.66, duration: 0.5 }, // D4 "the"
        { freq: 261.63, duration: 0.9 }  // C4 "night..."
    ];

    function playTone(freq, duration) {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    }

    function startIfWorldWasEndingMelody() {
        let noteIdx = 0;
        melodyTimer = setInterval(() => {
            if (!isPlaying) return;
            const currentNote = melodyNotes[noteIdx % melodyNotes.length];
            playTone(currentNote.freq, currentNote.duration);
            noteIdx++;
        }, 520);
    }

    musicToggleBtn.addEventListener('click', () => {
        // Toggle off if already playing
        if (isPlaying) {
            isPlaying = false;
            customAudio.pause();
            if (melodyTimer) clearInterval(melodyTimer);
            musicToggleBtn.querySelector('.btn-text').textContent = cfg.songTitle || 'Romantic Music 🎵';
            musicToggleBtn.classList.remove('heart-burst-btn');
            return;
        }

        // Try playing custom MP3 track
        customAudio.play().then(() => {
            isPlaying = true;
            musicToggleBtn.querySelector('.btn-text').textContent = 'Pause Song 🎵';
            musicToggleBtn.classList.add('heart-burst-btn');
            triggerConfettiBurst();
        }).catch(() => {
            // Fallback to Web Audio synthesized melody
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }

            audioCtx.resume();
            isPlaying = true;
            musicToggleBtn.querySelector('.btn-text').textContent = 'Pause Song 🎵';
            musicToggleBtn.classList.add('heart-burst-btn');
            startIfWorldWasEndingMelody();
            triggerConfettiBurst();
        });
    });

    // ----------------------------------------------------------------------
    // 11. KISS BURST & FINAL HUGS BUTTON
    // ----------------------------------------------------------------------
    const burstLoveBtn = document.getElementById('burstLoveBtn');
    const finalHugsBtn = document.getElementById('finalHugsBtn');

    function handleLoveBurst() {
        triggerConfettiBurst();
        for (let i = 0; i < 25; i++) {
            particles.push(new HeartParticle(window.innerWidth / 2, window.innerHeight / 2));
        }
    }

    burstLoveBtn.addEventListener('click', handleLoveBurst);
    finalHugsBtn.addEventListener('click', handleLoveBurst);
});
