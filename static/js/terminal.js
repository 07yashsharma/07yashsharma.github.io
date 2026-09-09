/**
 * Stark Industries / JARVIS Interactive Terminal
 * Accessible via `~` key or HUD terminal button.
 * Supports interactive command line queries, Easter eggs, and system overrides.
 */

class StarkTerminal {
    constructor() {
        this.modal = null;
        this.output = null;
        this.input = null;
        this.history = [];
        this.historyIndex = -1;
        this.isOpen = false;

        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.modal = document.getElementById('stark-terminal-modal');
            this.output = document.getElementById('terminal-output');
            this.input = document.getElementById('terminal-input');
            const closeBtn = document.getElementById('terminal-close');
            const openBtns = document.querySelectorAll('.open-stark-terminal');

            openBtns.forEach(btn => {
                btn.addEventListener('click', () => this.toggle());
            });

            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.close());
            }

            if (this.input) {
                this.input.addEventListener('keydown', (e) => this.handleKeyDown(e));
            }

            // Keyboard shortcut `~` or `T`
            document.addEventListener('keydown', (e) => {
                if (e.key === '`' || e.key === '~') {
                    e.preventDefault();
                    this.toggle();
                } else if (e.key.toLowerCase() === 't' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
                    e.preventDefault();
                    this.toggle();
                } else if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });

            this.printWelcome();
        });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        if (!this.modal) return;
        this.isOpen = true;
        this.modal.classList.remove('hidden');
        if (this.input) {
            this.input.focus();
        }
        if (window.marvelAudio) {
            window.marvelAudio.playJarvisBeep(1200);
        }
    }

    close() {
        if (!this.modal) return;
        this.isOpen = false;
        this.modal.classList.add('hidden');
        if (window.marvelAudio) {
            window.marvelAudio.playClick();
        }
    }

    printWelcome() {
        if (!this.output) return;
        this.output.innerHTML = `
<div class="text-cyan-400 font-mono text-xs leading-relaxed mb-3">
  ╔══════════════════════════════════════════════════════════════════════╗<br>
  ║ STARK INDUSTRIES PROTOCOL // JARVIS INTELLIGENCE INTERFACE v4.2      ║<br>
  ║ HOST OPERATOR: YASH SHARMA | B.TECH (1ST YEAR) @ JECRC UNIVERSITY   ║<br>
  ║ SUBSYSTEMS: ROBOTICS, ARTIFICIAL INTELLIGENCE & FULL-STACK SYSTEMS  ║<br>
  ╚══════════════════════════════════════════════════════════════════════╝<br>
  Type <span class="text-amber-400 font-bold">'help'</span> to view available Stark & Spider-Man commands.<br>
  Use <span class="text-amber-400 font-bold">'swing'</span> to launch Spider-Man or <span class="text-amber-400 font-bold">'blast'</span> for Repulsor power!
</div>
`;
    }

    handleKeyDown(e) {
        if (e.key === 'Enter') {
            const command = this.input.value.trim();
            if (command) {
                this.history.push(command);
                this.historyIndex = this.history.length;
                this.execute(command);
                this.input.value = '';
            }
        } else if (e.key === 'ArrowUp') {
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.input.value = this.history[this.historyIndex] || '';
            }
        } else if (e.key === 'ArrowDown') {
            if (this.historyIndex < this.history.length - 1) {
                this.historyIndex++;
                this.input.value = this.history[this.historyIndex] || '';
            } else {
                this.historyIndex = this.history.length;
                this.input.value = '';
            }
        } else {
            if (window.marvelAudio) {
                window.marvelAudio.playClick();
            }
        }
    }

    execute(cmd) {
        const cleanCmd = cmd.toLowerCase().trim();
        this.appendLine(`STARK-OS@YashSharma:~$ ${cmd}`, 'text-amber-400');

        if (window.marvelAudio) {
            window.marvelAudio.playJarvisBeep(980);
        }

        switch (cleanCmd) {
            case 'help':
                this.appendLine(`
Available Stark Terminal Commands:
  - <span class="text-cyan-300">about / bio</span>    : Yash Sharma's background, education & interests
  - <span class="text-cyan-300">skills</span>         : Technical arsenal (Robotics, AI, Languages, Web)
  - <span class="text-cyan-300">projects</span>       : High-tech projects and code repositories
  - <span class="text-cyan-300">education</span>      : JECRC University B.Tech coursework & credentials
  - <span class="text-cyan-300">contact</span>        : Uplink coordinates (Email, LinkedIn, GitHub)
  - <span class="text-cyan-300">swing</span>          : Spider-Man dynamic web-swinging maneuver
  - <span class="text-cyan-300">blast / repulsor</span>: Iron Man Mark-85 Repulsor firing sequence
  - <span class="text-cyan-300">stats</span>          : Fetch live backend database telemetry
  - <span class="text-cyan-300">clear</span>          : Clear terminal logs
  - <span class="text-cyan-300">exit</span>           : Close the terminal
  - <span class="text-cyan-300">matrix / avengers</span>: Classified Easter eggs
`, 'text-gray-200');
                break;

            case 'about':
            case 'bio':
                this.appendLine(`
[OPERATOR DOSSIER: YASH SHARMA]
------------------------------------------------------------
NAME: Yash Sharma
ROLE: 1st Year B.Tech Student (Computer Science & Engineering)
INSTITUTION: JECRC University, Jaipur
MISSION: Fusing Robotics, Artificial Intelligence & Modern Software.
SPECIALTY: Autonomous systems, embedded computing, clean code,
           and crafting futuristic interactive user experiences.
------------------------------------------------------------
`, 'text-cyan-300');
                break;

            case 'skills':
                this.appendLine(`
[STARK LABS TECHNICAL ARSENAL]
- Core Languages : Python, C/C++, JavaScript, HTML5/CSS3, SQL
- AI & Robotics  : OpenCV (Computer Vision), Arduino, ESP32,
                   Kinematics, Sensor Interfacing, Machine Learning
- Web & Backend  : React, Node.js, Express, Flask, REST APIs, Tailwind
- Systems & Tools: Linux, Git, GitHub, VS Code, Embedded IDEs
`, 'text-emerald-400');
                break;

            case 'projects':
                this.appendLine(`
[STARK ARCHIVES: FEATURED PROJECTS]
1. STARK-VISION ROBOTICS : Autonomous AI target tracking & computer vision.
2. AEROSENSE IOT PLATFORM: Embedded multi-sensor robotics telemetry platform.
3. WEB-SLINGER VISUALIZER: Algorithmic pathfinding (A*, Dijkstra) Spider-Man engine.
4. JARVIS VOICE ASSISTANT: Python desktop automation & neural voice commands.
5. CAMPUS-SYNC PORTAL    : Student collaboration & resources hub for JECRC engineers.
`, 'text-cyan-300');
                break;

            case 'education':
                this.appendLine(`
[ACADEMIC CREDENTIALS]
- Degree     : Bachelor of Technology (B.Tech in CSE)
- College    : JECRC University, Jaipur (2025 - 2029)
- Status     : 1st Year Undergraduate
- Core Topics: Data Structures, Robotics Workshops, AI Foundations
`, 'text-indigo-300');
                break;

            case 'contact':
                this.appendLine(`
[STARK SECURE TRANSMISSION CHANNELS]
- Email   : shyam277007@gmail.com
- LinkedIn: https://www.linkedin.com/in/yash-sharma-05a599432/
- GitHub  : https://github.com/07yashsharma
`, 'text-amber-300');
                break;

            case 'swing':
                this.appendLine(`[SPIDER-MAN PROTOCOL]: Web lines engaged! Thwip!`, 'text-red-400 font-bold');
                if (window.spiderManEngine) {
                    window.spiderManEngine.triggerSwing();
                }
                break;

            case 'blast':
            case 'repulsor':
                this.appendLine(`[IRON MAN PROTOCOL]: Repulsor coils charged! Firing!`, 'text-amber-400 font-bold');
                if (window.ironManEngine) {
                    window.ironManEngine.triggerRepulsorTransition(null);
                }
                break;

            case 'stats':
                this.appendLine(`Querying Stark Telemetry Server...`, 'text-cyan-400');
                fetch('/api/stats')
                    .then(res => res.json())
                    .then(res => {
                        if (res.success) {
                            this.appendLine(JSON.stringify(res.data, null, 2), 'text-emerald-400');
                        } else {
                            this.appendLine('Telemetry connection error.', 'text-red-400');
                        }
                    })
                    .catch(() => this.appendLine('Unable to reach telemetry backend.', 'text-red-400'));
                break;

            case 'clear':
                this.output.innerHTML = '';
                this.printWelcome();
                break;

            case 'exit':
                this.close();
                break;

            case 'matrix':
                this.appendLine(`WAKE UP, PETER PARKER... THE MATRIX HAS YOU.`, 'text-emerald-500 font-mono');
                document.body.classList.toggle('matrix-mode');
                break;

            case 'avengers':
                this.appendLine(`AVENGERS ASSEMBLE! Yash Sharma recruited for Stark Industries R&D.`, 'text-red-500 font-bold');
                if (window.marvelAudio) window.marvelAudio.playBootSound();
                break;

            case 'sudo':
            case 'sudo su':
                this.appendLine(`ACCESS GRANTED: WELCOME SUPREME COMMANDER YASH SHARMA.`, 'text-amber-400 font-bold');
                break;

            default:
                this.appendLine(`Command not recognized: '${cmd}'. Type 'help' for command directory.`, 'text-red-400');
                break;
        }

        // Auto-scroll to bottom of terminal
        this.output.scrollTop = this.output.scrollHeight;
    }

    appendLine(html, className = '') {
        const div = document.createElement('div');
        div.className = `leading-relaxed my-1 ${className}`;
        div.innerHTML = html;
        this.output.appendChild(div);
    }
}

// Global initialization
window.starkTerminal = new StarkTerminal();
