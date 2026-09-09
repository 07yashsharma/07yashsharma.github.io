/**
 * Main Controller for Yash Sharma's Marvel Portfolio Website
 * Handles state, contact form transmission, project filters,
 * live telemetry, audio toggles, and keyboard shortcuts.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Audio Toggle Setup
    const audioBtn = document.getElementById('audio-toggle-btn');
    const audioIcon = document.getElementById('audio-toggle-icon');
    const audioText = document.getElementById('audio-toggle-text');

    function updateAudioUI() {
        if (!window.marvelAudio) return;
        const isMuted = window.marvelAudio.isMuted;
        if (audioIcon) {
            audioIcon.innerHTML = isMuted
                ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />`
                : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />`;
        }
        if (audioText) {
            audioText.textContent = isMuted ? 'AUDIO: OFF' : 'AUDIO: ON';
        }
    }

    if (audioBtn) {
        audioBtn.addEventListener('click', () => {
            if (window.marvelAudio) {
                window.marvelAudio.toggleMute();
                updateAudioUI();
                if (!window.marvelAudio.isMuted) {
                    window.marvelAudio.playJarvisBeep(1100);
                }
            }
        });
        updateAudioUI();
    }

    // 2. Web Swing Triggers
    const swingBtns = document.querySelectorAll('.trigger-web-swing');
    swingBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (window.spiderManEngine) {
                window.spiderManEngine.triggerSwing();
            }
        });
    });

    // 3. Web Shooter Toggle
    const webShooterToggle = document.getElementById('web-shooter-toggle');
    if (webShooterToggle) {
        webShooterToggle.addEventListener('click', () => {
            if (window.spiderManEngine) {
                window.spiderManEngine.webShooterActive = !window.spiderManEngine.webShooterActive;
                webShooterToggle.classList.toggle('active', window.spiderManEngine.webShooterActive);
                webShooterToggle.textContent = window.spiderManEngine.webShooterActive ? 'WEB SHOOTER: ARMED' : 'WEB SHOOTER: SAFE';
                if (window.marvelAudio) window.marvelAudio.playClick();
            }
        });
    }

    // 4. Project Category Filtering
    const filterBtns = document.querySelectorAll('.project-filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');

            if (window.marvelAudio) window.marvelAudio.playClick();

            projectCards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                if (category === 'all' || cardCat === category) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 200);
                }
            });
        });
    });

    // 5. Project Like Buttons
    const projLikeBtns = document.querySelectorAll('.project-like-btn');
    projLikeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const projectId = btn.getAttribute('data-project');
            const countElem = btn.querySelector('.project-like-count');

            if (window.marvelAudio) window.marvelAudio.playThwip();

            btn.classList.add('scale-125');
            setTimeout(() => btn.classList.remove('scale-125'), 300);

            fetch('/api/like', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'project', project_id: projectId })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success && countElem) {
                    countElem.textContent = data.likes;
                }
            })
            .catch(err => console.error('Project like failed:', err));
        });
    });

    // 6. Contact Form Transmission (Stark Uplink)
    const contactForm = document.getElementById('stark-contact-form');
    const contactStatus = document.getElementById('contact-status');
    const submitBtn = document.getElementById('contact-submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const subject = document.getElementById('contact-subject').value.trim();
            const message = document.getElementById('contact-message').value.trim();

            if (!name || !email || !message) {
                showContactStatus('All required Stark transmission fields must be filled.', 'error');
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    ENCRYPTING & TRANSMITTING...
                `;
            }

            if (window.marvelAudio) {
                window.marvelAudio.playRepulsor();
            }

            fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, subject, message })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    showContactStatus(data.message, 'success');
                    contactForm.reset();
                    if (window.marvelAudio) window.marvelAudio.playBootSound();
                    if (window.spiderManEngine) window.spiderManEngine.flashSpiderSense("TRANSMISSION RECEIVED BY YASH SHARMA!");
                } else {
                    showContactStatus(data.error || 'Transmission failed.', 'error');
                }
            })
            .catch(err => {
                // Fallback for static GitHub Pages or offline mode
                const mailtoUrl = `mailto:shyam277007@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Uplink')}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
                showContactStatus(`Stark Server offline. Message prepared! Click here to send directly to Yash: <a href="${mailtoUrl}" class="underline text-amber-300 font-bold ml-1" target="_blank">Launch Mail App</a>`, 'success');
                if (window.marvelAudio) window.marvelAudio.playBootSound();
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `
                        <span class="relative z-10 flex items-center justify-center font-bold tracking-wider">
                            TRANSMIT MESSAGE TO YASH SHARMA
                            <svg class="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                        </span>
                    `;
                }
            });
        });
    }

    function showContactStatus(text, type) {
        if (!contactStatus) return;
        contactStatus.textContent = text;
        contactStatus.className = `p-4 rounded-lg font-mono text-sm border ${
            type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'bg-red-950/80 border-red-500 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
        }`;
        contactStatus.classList.remove('hidden');

        setTimeout(() => {
            contactStatus.classList.add('hidden');
        }, 8000);
    }

    // 7. Fetch Live Telemetry (Visitors & Likes)
    function fetchTelemetry() {
        fetch('/api/stats')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const visitorElem = document.getElementById('visitor-count');
                    const arcLikesElem = document.getElementById('arc-likes-counter');
                    if (visitorElem) visitorElem.textContent = data.data.visitors;
                    if (arcLikesElem) arcLikesElem.textContent = data.data.arc_likes;

                    // Update project likes if available
                    if (data.data.project_likes) {
                        for (const [pId, pCount] of Object.entries(data.data.project_likes)) {
                            const btn = document.querySelector(`.project-like-btn[data-project="${pId}"] .project-like-count`);
                            if (btn) btn.textContent = pCount;
                        }
                    }
                }
            })
            .catch(err => console.log('Telemetry fetch skipped.'));
    }
    fetchTelemetry();

    // 8. Mobile Navigation Drawer
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileMenuBtn && mobileNavDrawer) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = !mobileNavDrawer.classList.contains('hidden');
            if (isOpen) {
                mobileNavDrawer.classList.add('hidden');
            } else {
                mobileNavDrawer.classList.remove('hidden');
            }
            if (window.marvelAudio) window.marvelAudio.playClick();
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                mobileNavDrawer.classList.add('hidden');
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    if (window.ironManEngine) {
                        window.ironManEngine.triggerRepulsorTransition(targetId);
                    }
                }
            });
        });
    }

    // 9. Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        // Skip if typing in an input
        if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

        const key = e.key.toLowerCase();
        if (key === 's') {
            e.preventDefault();
            if (window.spiderManEngine) window.spiderManEngine.triggerSwing();
        } else if (key === 'm') {
            e.preventDefault();
            if (audioBtn) audioBtn.click();
        } else if (key === 'a') {
            e.preventDefault();
            const reactor = document.querySelector('.interactive-arc-reactor');
            if (reactor && window.ironManEngine) window.ironManEngine.overchargeReactor(reactor);
        } else if (['1', '2', '3', '4', '5', '6'].includes(key)) {
            const sections = ['hero', 'about', 'skills', 'projects', 'education', 'contact'];
            const target = sections[parseInt(key) - 1];
            if (window.ironManEngine) window.ironManEngine.triggerRepulsorTransition(target);
        }
    });

    // 10. Typewriter Effect for Hero Subtitle
    const typewriterElem = document.getElementById('typewriter-text');
    if (typewriterElem) {
        const roles = [
            "B.Tech Student @ JECRC University",
            "Robotics & Embedded Systems Builder",
            "Artificial Intelligence & ML Explorer",
            "Full-Stack Web Slinger & Coder",
            "Innovating Like Stark, Agile Like Spidey"
        ];
        let roleIdx = 0;
        let charIdx = 0;
        let isDeleting = false;

        function type() {
            const current = roles[roleIdx];
            if (isDeleting) {
                typewriterElem.textContent = current.substring(0, charIdx - 1);
                charIdx--;
            } else {
                typewriterElem.textContent = current.substring(0, charIdx + 1);
                charIdx++;
            }

            let delay = isDeleting ? 40 : 80;

            if (!isDeleting && charIdx === current.length) {
                delay = 2000;
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                roleIdx = (roleIdx + 1) % roles.length;
                delay = 500;
            }

            setTimeout(type, delay);
        }
        setTimeout(type, 1000);
    }
});
