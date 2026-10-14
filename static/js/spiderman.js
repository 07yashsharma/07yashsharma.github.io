/**
 * Spider-Man Web-Swinging Engine & Web-Shooter Interactive FX
 * Creates physics-based swinging Spider-Man animations across the screen,
 * interactive web shooting on click, and Spider-Sense visual cues.
 */

class SpiderManEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.isSwinging = false;
        this.swingProgress = 0;
        this.swingDirection = 1; // 1: left to right, -1: right to left
        this.webs = [];
        this.particles = [];
        this.webShooterActive = true;
        this.lastSwingTime = 0;

        this.init();
    }

    init() {
        // Create canvas for swinging & web fx
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'spiderman-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '9998';
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.resize();

        window.addEventListener('resize', () => this.resize());

        // Bind interactive web shooter to clicks
        document.addEventListener('click', (e) => {
            // Only shoot if not clicking an interactive form, button, or botpress chatbot widget
            if (this.webShooterActive && !['BUTTON', 'INPUT', 'TEXTAREA', 'A'].includes(e.target.tagName) && !e.target.closest('[class*="bp-"], iframe, #bp-web-widget')) {
                this.shootWeb(e.clientX, e.clientY);
            }
        });

        // Animation loop
        requestAnimationFrame(() => this.loop());

        // Initial swing after 2.5s
        setTimeout(() => {
            this.triggerSwing();
        }, 2500);
    }

    resize() {
        if (!this.canvas) return;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width * window.devicePixelRatio;
        this.canvas.height = this.height * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    triggerSwing() {
        if (this.isSwinging) return;
        this.isSwinging = true;
        this.swingProgress = 0;
        this.swingDirection = Math.random() > 0.5 ? 1 : -1;
        this.lastSwingTime = Date.now();

        if (window.marvelAudio) {
            window.marvelAudio.playThwip();
        }

        // Show spider-sense notification
        this.flashSpiderSense("SPIDER-MAN SWINGING IN!");
    }

    shootWeb(targetX, targetY) {
        if (window.marvelAudio) {
            window.marvelAudio.playThwip();
        }

        const startX = this.swingDirection > 0 ? 0 : this.width;
        const startY = this.height - 20;

        const web = {
            startX: startX,
            startY: startY,
            targetX: targetX,
            targetY: targetY,
            progress: 0,
            opacity: 1,
            strands: []
        };

        // Create secondary web strands for web-net appearance
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i + (Math.random() * 0.4 - 0.2);
            const dist = 30 + Math.random() * 40;
            web.strands.push({
                x: targetX + Math.cos(angle) * dist,
                y: targetY + Math.sin(angle) * dist
            });
        }

        this.webs.push(web);

        // Spawn web particle sparks
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x: targetX,
                y: targetY,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                radius: 2 + Math.random() * 3,
                color: Math.random() > 0.4 ? '#ffffff' : '#00f2fe',
                life: 1
            });
        }
    }

    flashSpiderSense(message = "SPIDER-SENSE ACTIVATED!") {
        const hud = document.getElementById('spidersense-hud');
        if (hud) {
            hud.textContent = message;
            hud.classList.remove('hidden');
            hud.classList.add('pulse-glow');
            setTimeout(() => {
                hud.classList.add('hidden');
                hud.classList.remove('pulse-glow');
            }, 3000);
        }
    }

    drawSpiderMan(x, y, angle, scale = 1) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(angle);
        this.ctx.scale(scale, scale);

        // Shadow / Glow
        this.ctx.shadowColor = 'rgba(226, 54, 54, 0.6)';
        this.ctx.shadowBlur = 15;

        // Torso (Crimson & Deep Blue)
        this.ctx.fillStyle = '#b11313';
        this.ctx.beginPath();
        this.ctx.ellipse(0, 5, 14, 24, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Blue suit flanks
        this.ctx.fillStyle = '#0f172a';
        this.ctx.beginPath();
        this.ctx.ellipse(-10, 8, 5, 16, -0.2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.ellipse(10, 8, 5, 16, 0.2, 0, Math.PI * 2);
        this.ctx.fill();

        // Spider Emblem on chest
        this.ctx.fillStyle = '#05070d';
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, 4, 7, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Spider Legs on emblem
        this.ctx.strokeStyle = '#05070d';
        this.ctx.lineWidth = 1.5;
        for (let i = -1; i <= 1; i += 2) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, -3);
            this.ctx.lineTo(i * 8, -9);
            this.ctx.lineTo(i * 12, -4);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(0, 3);
            this.ctx.lineTo(i * 9, 10);
            this.ctx.lineTo(i * 14, 6);
            this.ctx.stroke();
        }

        // Spider-Man Head / Mask
        this.ctx.fillStyle = '#e23636';
        this.ctx.beginPath();
        this.ctx.ellipse(0, -22, 11, 14, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Mask Web Lines
        this.ctx.strokeStyle = 'rgba(0,0,0,0.35)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -36);
        this.ctx.lineTo(0, -8);
        this.ctx.moveTo(-11, -22);
        this.ctx.lineTo(11, -22);
        this.ctx.stroke();

        // Iconic Spider Eyes (Angled white reflective with black outline)
        this.ctx.fillStyle = '#ffffff';
        this.ctx.strokeStyle = '#0a0a0a';
        this.ctx.lineWidth = 2.5;

        // Left Eye
        this.ctx.beginPath();
        this.ctx.moveTo(-2, -26);
        this.ctx.lineTo(-8, -24);
        this.ctx.lineTo(-3, -17);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        // Right Eye
        this.ctx.beginPath();
        this.ctx.moveTo(2, -26);
        this.ctx.lineTo(8, -24);
        this.ctx.lineTo(3, -17);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        // Arms (Dynamic swinging pose)
        this.ctx.strokeStyle = '#e23636';
        this.ctx.lineWidth = 6;
        this.ctx.lineCap = 'round';

        // Arm holding web (reaching up)
        this.ctx.beginPath();
        this.ctx.moveTo(8, -6);
        this.ctx.lineTo(18, -28);
        this.ctx.lineTo(14, -46);
        this.ctx.stroke();

        // Other Arm (reaching back / web shooter pose)
        this.ctx.beginPath();
        this.ctx.moveTo(-8, -6);
        this.ctx.lineTo(-24, 4);
        this.ctx.lineTo(-32, -8);
        this.ctx.stroke();

        // Legs (Athletic bent swinging pose)
        this.ctx.strokeStyle = '#0f172a';
        this.ctx.lineWidth = 6;

        // Leg 1
        this.ctx.beginPath();
        this.ctx.moveTo(-6, 22);
        this.ctx.lineTo(-14, 40);
        this.ctx.lineTo(-26, 36);
        this.ctx.stroke();

        // Red Boot 1
        this.ctx.strokeStyle = '#e23636';
        this.ctx.lineWidth = 5;
        this.ctx.beginPath();
        this.ctx.moveTo(-20, 38);
        this.ctx.lineTo(-30, 34);
        this.ctx.stroke();

        // Leg 2
        this.ctx.strokeStyle = '#0f172a';
        this.ctx.lineWidth = 6;
        this.ctx.beginPath();
        this.ctx.moveTo(6, 22);
        this.ctx.lineTo(18, 38);
        this.ctx.lineTo(14, 52);
        this.ctx.stroke();

        // Red Boot 2
        this.ctx.strokeStyle = '#e23636';
        this.ctx.lineWidth = 5;
        this.ctx.beginPath();
        this.ctx.moveTo(16, 44);
        this.ctx.lineTo(12, 55);
        this.ctx.stroke();

        this.ctx.restore();
    }

    loop() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Update & Render Interactive Webs
        for (let i = this.webs.length - 1; i >= 0; i--) {
            const web = this.webs[i];
            web.progress = Math.min(1, web.progress + 0.12);
            web.opacity -= 0.012;

            if (web.opacity <= 0) {
                this.webs.splice(i, 1);
                continue;
            }

            const currentX = web.startX + (web.targetX - web.startX) * web.progress;
            const currentY = web.startY + (web.targetY - web.startY) * web.progress;

            this.ctx.save();
            this.ctx.strokeStyle = `rgba(240, 245, 255, ${web.opacity})`;
            this.ctx.lineWidth = 2.5;
            this.ctx.shadowColor = 'rgba(0, 242, 254, 0.8)';
            this.ctx.shadowBlur = 8;

            // Main web line
            this.ctx.beginPath();
            this.ctx.moveTo(web.startX, web.startY);
            this.ctx.lineTo(currentX, currentY);
            this.ctx.stroke();

            // Web Splat Net at target
            if (web.progress >= 0.7) {
                this.ctx.lineWidth = 1.2;
                web.strands.forEach((pt) => {
                    this.ctx.beginPath();
                    this.ctx.moveTo(web.targetX, web.targetY);
                    this.ctx.lineTo(pt.x, pt.y);
                    this.ctx.stroke();
                });

                // Connecting web ring
                this.ctx.beginPath();
                web.strands.forEach((pt, idx) => {
                    if (idx === 0) this.ctx.moveTo(pt.x, pt.y);
                    else this.ctx.lineTo(pt.x, pt.y);
                });
                this.ctx.closePath();
                this.ctx.stroke();
            }

            this.ctx.restore();
        }

        // Update & Render Particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2; // gravity
            p.life -= 0.03;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.life;
            this.ctx.shadowColor = p.color;
            this.ctx.shadowBlur = 6;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius * p.life, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }

        // Update & Render Swinging Spider-Man
        if (this.isSwinging) {
            this.swingProgress += 0.012;

            if (this.swingProgress >= 1) {
                this.isSwinging = false;
            } else {
                // Pendulum physics calculation
                const t = this.swingProgress;
                // Anchor point at top center of screen
                const anchorX = this.width * 0.5 + (this.swingDirection * this.width * 0.1);
                const anchorY = -60;

                // Path parametric equation
                const swingAngle = Math.sin((t - 0.5) * Math.PI) * 1.1 * this.swingDirection;
                const ropeLength = this.height * 0.72;

                const spideyX = anchorX + Math.sin(swingAngle) * ropeLength;
                const spideyY = anchorY + Math.cos(swingAngle) * ropeLength;

                // Dynamic hand anchor offset
                const handX = spideyX + Math.sin(swingAngle - 0.2) * 45;
                const handY = spideyY - Math.cos(swingAngle - 0.2) * 45;

                // Draw Elastic Web Line
                this.ctx.save();
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
                this.ctx.lineWidth = 2.5;
                this.ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
                this.ctx.shadowBlur = 10;

                // Curved bezier rope
                this.ctx.beginPath();
                this.ctx.moveTo(anchorX, anchorY);
                const midX = (anchorX + handX) / 2 + Math.sin(t * Math.PI * 4) * 8;
                const midY = (anchorY + handY) / 2 + 15;
                this.ctx.quadraticCurveTo(midX, midY, handX, handY);
                this.ctx.stroke();
                this.ctx.restore();

                // Draw Spider-Man Character
                const bodyRotation = swingAngle * 0.85;
                this.drawSpiderMan(spideyX, spideyY, bodyRotation, 1.15);

                // Release particle burst at peak of swing
                if (Math.abs(t - 0.5) < 0.02 && this.particles.length < 30) {
                    for (let p = 0; p < 8; p++) {
                        this.particles.push({
                            x: spideyX,
                            y: spideyY,
                            vx: (Math.random() - 0.5) * 6,
                            vy: (Math.random() - 0.5) * 6,
                            radius: 2,
                            color: '#00f2fe',
                            life: 0.8
                        });
                    }
                }
            }
        }

        requestAnimationFrame(() => this.loop());
    }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
    window.spiderManEngine = new SpiderManEngine();
});
