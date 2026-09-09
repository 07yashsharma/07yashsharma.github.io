/**
 * Marvel Sound Synthesizer via Web Audio API
 * Generates zero-dependency, zero-latency sound effects:
 * - Spider-Man Web Shooter ("Thwip")
 * - Iron Man Repulsor Blast & Charging
 * - Stark JARVIS HUD Chimes & System Boot
 */

class MarvelAudioSystem {
    constructor() {
        this.ctx = null;
        this.isMuted = localStorage.getItem('marvel_portfolio_muted') === 'true';
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
                this.initialized = true;
            }
        } catch (e) {
            console.warn('Web Audio API not supported', e);
        }
    }

    resume() {
        this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('marvel_portfolio_muted', this.isMuted);
        return this.isMuted;
    }

    // Spider-Man Web Shooter "Thwip" Sound Effect
    playThwip() {
        if (this.isMuted) return;
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        // White noise burst for air compression
        const bufferSize = this.ctx.sampleRate * 0.12;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2800, now);
        filter.frequency.exponentialRampToValueAtTime(700, now + 0.1);
        filter.Q.setValueAtTime(4, now);

        const gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(0.35, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        // High frequency whistle / elastic snap
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(3200, now + 0.05);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.12);

        oscGain.gain.setValueAtTime(0.2, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        osc.connect(oscGain);
        oscGain.connect(this.ctx.destination);

        noise.start(now);
        osc.start(now);
        noise.stop(now + 0.12);
        osc.stop(now + 0.12);
    }

    // Iron Man Repulsor Blast Effect
    playRepulsor() {
        if (this.isMuted) return;
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        // 1. High-pitch charging sweep
        const oscCharge = this.ctx.createOscillator();
        const chargeGain = this.ctx.createGain();
        oscCharge.type = 'sawtooth';
        oscCharge.frequency.setValueAtTime(450, now);
        oscCharge.frequency.exponentialRampToValueAtTime(2400, now + 0.18);

        chargeGain.gain.setValueAtTime(0.12, now);
        chargeGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        oscCharge.connect(chargeGain);
        chargeGain.connect(this.ctx.destination);

        oscCharge.start(now);
        oscCharge.stop(now + 0.2);

        // 2. Punch blast (sub-bass punch + distortion)
        const oscBlast = this.ctx.createOscillator();
        const blastGain = this.ctx.createGain();
        oscBlast.type = 'triangle';
        oscBlast.frequency.setValueAtTime(320, now + 0.15);
        oscBlast.frequency.exponentialRampToValueAtTime(40, now + 0.45);

        blastGain.gain.setValueAtTime(0.001, now);
        blastGain.gain.setValueAtTime(0.4, now + 0.15);
        blastGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        oscBlast.connect(blastGain);
        blastGain.connect(this.ctx.destination);

        oscBlast.start(now + 0.15);
        oscBlast.stop(now + 0.5);
    }

    // JARVIS UI Telemetry Beep
    playJarvisBeep(pitch = 880) {
        if (this.isMuted) return;
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(pitch, now);
        osc.frequency.setValueAtTime(pitch * 1.5, now + 0.04);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.1);
    }

    // Stark Boot Sequence Chime
    playBootSound() {
        if (this.isMuted) return;
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const notes = [220, 330, 440, 660, 880];

        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);

            gain.gain.setValueAtTime(0.001, now);
            gain.gain.setValueAtTime(0.15, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.4);
        });
    }

    // Interactive Button Click / Tick
    playClick() {
        if (this.isMuted) return;
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.03);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.03);
    }
}

// Global instance
window.marvelAudio = new MarvelAudioSystem();
