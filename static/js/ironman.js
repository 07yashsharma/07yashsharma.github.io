/**
 * Iron Man Stark Industries HUD & Transition Engine
 * Features:
 * - Boot Sequence Preloader with Arc Reactor & JARVIS Diagnostics
 * - High-Tech Repulsor Beam Section Transitions
 * - Interactive Arc Reactor Core with Telemetry & Overcharge FX
 */

class IronManEngine {
    constructor() {
        this.preloader = null;
        this.transitionOverlay = null;
        this.arcReactor = null;
        this.isTransitioning = false;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.preloader = document.getElementById('ironman-preloader');
            this.transitionOverlay = document.getElementById('ironman-transition-overlay');
            this.arcReactor = document.getElementById('hud-arc-reactor');

            this.runBootSequence();
            this.setupNavigationTransitions();
            this.setupArcReactorClick();
        });
    }

    runBootSequence() {
        if (!this.preloader) return;

        const logElem = document.getElementById('preloader-log');
        const progressElem = document.getElementById('preloader-progress');
        const progressBar = document.getElementById('preloader-bar');
        const bypassBtn = document.getElementById('preloader-bypass');

        const logs = [
            "STARK INDUSTRIES MARK-85 OS ONLINE...",
            "INITIALIZING NEURAL INTERFACE PROTOCOL...",
            "AUTHENTICATING HOST: YASH SHARMA [JECRC UNIVERSITY]...",
            "CALIBRATING REPULSOR EMITTERS & WEB-SHOOTERS...",
            "LOADING ROBOTICS, AI & COMPUTER VISION SUITES...",
            "CORE TELEMETRY: 100% OPERATIONAL. WELCOME, MR. SHARMA."
        ];

        let currentLog = 0;
        let progress = 0;

        // Bypass button
        if (bypassBtn) {
            bypassBtn.addEventListener('click', () => {
                this.dismissPreloader();
            });
        }

        const interval = setInterval(() => {
            progress += 5;
            if (progressElem) progressElem.textContent = `${progress}%`;
            if (progressBar) progressBar.style.width = `${progress}%`;

            if (progress % 20 === 0 && currentLog < logs.length) {
                if (logElem) logElem.textContent = logs[currentLog];
                if (window.marvelAudio) window.marvelAudio.playJarvisBeep(600 + currentLog * 80);
                currentLog++;
            }

            if (progress >= 100) {
                clearInterval(interval);
                if (logElem) logElem.textContent = logs[logs.length - 1];
                if (window.marvelAudio) window.marvelAudio.playBootSound();

                setTimeout(() => {
                    this.dismissPreloader();
                }, 800);
            }
        }, 60);
    }

    dismissPreloader() {
        if (!this.preloader) return;
        this.preloader.style.opacity = '0';
        this.preloader.style.transform = 'scale(1.08)';
        this.preloader.style.pointerEvents = 'none';

        setTimeout(() => {
            this.preloader.style.display = 'none';
        }, 700);

        if (window.marvelAudio) {
            window.marvelAudio.playRepulsor();
        }
    }

    // High-Tech Iron Man Repulsor Sweep Transition between sections
    triggerRepulsorTransition(targetSectionId, callback) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        if (window.marvelAudio) {
            window.marvelAudio.playRepulsor();
        }

        if (!this.transitionOverlay) {
            this.transitionOverlay = document.getElementById('ironman-transition-overlay');
        }

        if (this.transitionOverlay) {
            this.transitionOverlay.classList.remove('hidden');
            this.transitionOverlay.classList.add('active');

            // Mid-transition callback (scroll / page switch)
            setTimeout(() => {
                if (callback) {
                    callback();
                } else if (targetSectionId) {
                    const elem = document.getElementById(targetSectionId);
                    if (elem) {
                        elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            }, 350);

            // Clean up transition
            setTimeout(() => {
                this.transitionOverlay.classList.remove('active');
                setTimeout(() => {
                    this.transitionOverlay.classList.add('hidden');
                    this.isTransitioning = false;
                }, 400);
            }, 750);
        } else {
            // Fallback direct scroll
            if (targetSectionId) {
                const elem = document.getElementById(targetSectionId);
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
            }
            this.isTransitioning = false;
        }
    }

    setupNavigationTransitions() {
        document.querySelectorAll('a.stark-nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    this.triggerRepulsorTransition(targetId);

                    // Update active nav state
                    document.querySelectorAll('a.stark-nav-link').forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        });
    }

    setupArcReactorClick() {
        const reactors = document.querySelectorAll('.interactive-arc-reactor');
        reactors.forEach(elem => {
            elem.addEventListener('click', () => {
                this.overchargeReactor(elem);
            });
        });
    }

    overchargeReactor(elem) {
        elem.classList.add('overcharged');
        if (window.marvelAudio) {
            window.marvelAudio.playRepulsor();
        }

        // Spawn energy ripple ring
        const ripple = document.createElement('div');
        ripple.className = 'arc-reactor-ripple';
        elem.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
            elem.classList.remove('overcharged');
        }, 1200);

        // Send Arc Like to Backend API
        fetch('/api/like', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'arc' })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const counter = document.getElementById('arc-likes-counter');
                if (counter) counter.textContent = data.likes;
                const tooltip = document.getElementById('arc-tooltip');
                if (tooltip) {
                    tooltip.textContent = `ARC POWER BOOSTED: ${data.likes} kW!`;
                    tooltip.style.opacity = '1';
                    setTimeout(() => tooltip.style.opacity = '0', 2500);
                }
            }
        })
        .catch(err => console.error('Like API error:', err));
    }
}

// Global initialization
window.ironManEngine = new IronManEngine();
