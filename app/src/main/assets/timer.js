// =========================================================
// BURN - Automated Rest Timer & Audio Alert Engine
// =========================================================
(function() {
  "use strict";

  let timerInterval = null;
  let remainingSeconds = 0;
  let initialDuration = 90;
  let isRunning = false;
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playAlertBeep() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const playTone = (freq, startTime, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const now = ctx.currentTime;
      playTone(587.33, now, 0.15); // D5
      playTone(880.00, now + 0.18, 0.35); // A5
    } catch(e) {
      console.warn("Rest timer audio notification:", e);
    }
  }

  window.BURN_TIMER = {
    start(seconds = 90) {
      this.stop();
      initialDuration = seconds;
      remainingSeconds = seconds;
      isRunning = true;
      getAudioContext(); // pre-warm audio context

      this.updateUI();

      timerInterval = setInterval(() => {
        if (remainingSeconds > 0) {
          remainingSeconds--;
          this.updateUI();
          if (remainingSeconds === 0) {
            this.stop();
            playAlertBeep();
            if (navigator.vibrate) {
              navigator.vibrate([200, 100, 200]);
            }
            this.updateUI(true);
          }
        } else {
          this.stop();
        }
      }, 1000);
    },

    stop() {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      isRunning = false;
      this.updateUI();
    },

    addSeconds(sec) {
      remainingSeconds = Math.max(0, remainingSeconds + sec);
      this.updateUI();
    },

    isActive() {
      return isRunning && remainingSeconds > 0;
    },

    getRemaining() {
      return remainingSeconds;
    },

    formatTime(sec) {
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    },

    updateUI(isFinishedAlert = false) {
      const banner = document.getElementById("rest-timer-banner");
      if (!banner) return;

      if (!isRunning && remainingSeconds === 0 && !isFinishedAlert) {
        banner.classList.add("hidden");
        return;
      }

      banner.classList.remove("hidden");
      const timeDisplay = document.getElementById("timer-display-time");
      if (timeDisplay) {
        if (isFinishedAlert) {
          timeDisplay.innerHTML = `<span class="text-emerald-400 font-black animate-pulse">REST COMPLETE!</span>`;
          setTimeout(() => {
            if (!isRunning) banner.classList.add("hidden");
          }, 4000);
        } else {
          timeDisplay.innerText = this.formatTime(remainingSeconds);
        }
      }
    }
  };
})();
