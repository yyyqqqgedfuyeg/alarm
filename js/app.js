const viewport = document.getElementById("chaos-viewport");
    const btnReorder = document.getElementById("btn-reorder");
    const btnAutoFlicker = document.getElementById("btn-auto-flicker");
    const flickerDot = document.getElementById("flicker-dot");
    const flickerText = document.getElementById("flicker-text");
    const btnAudio = document.getElementById("btn-audio");
    const audioText = document.getElementById("audio-text");
    const btnDensityDec = document.getElementById("btn-density-dec");
    const btnDensityInc = document.getElementById("btn-density-inc");
    const cardCounter = document.getElementById("card-counter");

    // Realistic iPhone Clock alarm templates
    const alarmPresets = [
      { time: "4:30", ampm: "AM", label: "Early Flight" },
      { time: "5:00", ampm: "AM", label: "Alarm" },
      { time: "5:15", ampm: "AM", label: "Alarm" },
      { time: "5:30", ampm: "AM", label: "Workout" },
      { time: "5:45", ampm: "AM", label: "Alarm" },
      { time: "6:00", ampm: "AM", label: "Alarm" },
      { time: "6:05", ampm: "AM", label: "Wake up" },
      { time: "6:10", ampm: "AM", label: "Alarm" },
      { time: "6:15", ampm: "AM", label: "Alarm" },
      { time: "6:30", ampm: "AM", label: "Alarm" },
      { time: "6:45", ampm: "AM", label: "GET UP" },
      { time: "7:00", ampm: "AM", label: "Alarm" },
      { time: "7:03", ampm: "AM", label: "Alarm" },
      { time: "7:07", ampm: "AM", label: "Alarm" },
      { time: "7:15", ampm: "AM", label: "Really wake up" },
      { time: "7:30", ampm: "AM", label: "Alarm" },
      { time: "7:45", ampm: "AM", label: "Alarm" },
      { time: "8:00", ampm: "AM", label: "Alarm" },
      { time: "8:05", ampm: "AM", label: "Late!" },
      { time: "8:15", ampm: "AM", label: "Alarm" },
      { time: "8:30", ampm: "AM", label: "Meeting" },
      { time: "9:00", ampm: "AM", label: "Alarm" },
      { time: "9:30", ampm: "AM", label: "Alarm" }
    ];

    let totalCardTarget = window.innerWidth > 1024 ? 90 : (window.innerWidth > 640 ? 70 : 50);
    let cardElements = [];
    let isAutoFlickering = true;
    let autoInterval = null;

    // Helper: random number generator between min and max
    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const randFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(2);

    /**
     * Builds and scatters ultra chaotic, heavily overlapping alarm cards
     */
    function buildChaoticStack() {
      viewport.innerHTML = "";
      cardElements = [];
      cardCounter.textContent = totalCardTarget;

      const vWidth = window.innerWidth;
      const vHeight = window.innerHeight;

      // Define grid spread seeds with high random perturbation for complete chaos
      for (let i = 0; i < totalCardTarget; i++) {
        const item = alarmPresets[rand(0, alarmPresets.length - 1)];
        const card = document.createElement("div");
        card.className = "alarm-card";

        // Random initial switch state (approx 65% active, similar to meme)
        const isActive = Math.random() > 0.35;
        if (isActive) card.classList.add("is-active");

        // High dimensional variance:
        // Variable widths: 220px to 480px (adapted to viewport)
        const minW = Math.min(230, vWidth * 0.55);
        const maxW = Math.min(480, vWidth * 0.95);
        const cardWidth = rand(minW, maxW);

        // Radical coordinate placement: allow sticking out from -10% to +105%
        const left = rand(-50, vWidth - cardWidth + 50);
        // Distribute along height with huge jitter
        const progressY = i / totalCardTarget;
        const top = Math.round(progressY * (vHeight + 100) - 80 + rand(-75, 75));

        // Random rotation angle (-6deg to +6deg)
        const rotation = randFloat(-6, 6);
        const scale = randFloat(0.9, 1.15);
        const fontSize = Math.round(30 * scale);

        // STRICT Z-INDEX ASSIGNMENT (Preserved throughout drags)
        const originalZIndex = i + 1;

        // Custom CSS variables for hover / dragging transform retention
        card.style.setProperty('--base-rot', `${rotation}deg`);
        card.style.setProperty('--base-scale', `${scale}`);
        card.style.width = `${cardWidth}px`;
        card.style.left = `${left}px`;
        card.style.top = `${top}px`;
        card.style.zIndex = originalZIndex;
        card.style.transform = `scale(${scale}) rotate(${rotation}deg)`;

        card.innerHTML = `
          <div class="alarm-time-wrap">
            <div class="alarm-time" style="font-size: ${fontSize}px">
              ${item.time}<span class="alarm-ampm">${item.ampm}</span>
            </div>
            <div class="alarm-subtext">${item.label}</div>
          </div>
          <div class="ios-switch">
            <div class="thumb"></div>
          </div>
        `;

        // Store reference data
        card._data = {
          x: left,
          y: top,
          rotation: parseFloat(rotation),
          scale: parseFloat(scale),
          zIndex: originalZIndex,
          isFlickering: false
        };

        // Attach dragging and clicking behaviors
        attachDragAndEvents(card);

        viewport.appendChild(card);
        cardElements.push(card);
      }
    }

    /**
     * Touch & Mouse drag handler preserving exact z-index
     * Plus hover scaling
     */
    function attachDragAndEvents(card) {
      let isDragging = false;
      let startPointerX = 0;
      let startPointerY = 0;
      let initialLeft = 0;
      let initialTop = 0;
      let hasMovedSignificantly = false;

      // Hover scale behavior (without altering card._data.zIndex)
      card.addEventListener("mouseenter", () => {
        if (!isDragging && !card._data.isFlickering) {
          const hoveredScale = card._data.scale * 1.1;
          card.style.transform = `scale(${hoveredScale}) rotate(${card._data.rotation}deg)`;
        }
      });

      card.addEventListener("mouseleave", () => {
        if (!isDragging && !card._data.isFlickering) {
          card.style.transform = `scale(${card._data.scale}) rotate(${card._data.rotation}deg)`;
        }
      });

      // Pointer down for drag initiation
      card.addEventListener("pointerdown", (e) => {
        // Prevent default text drag
        isDragging = true;
        hasMovedSignificantly = false;
        startPointerX = e.clientX;
        startPointerY = e.clientY;
        initialLeft = card._data.x;
        initialTop = card._data.y;

        card.setPointerCapture(e.pointerId);
        card.style.transition = "none"; // Crisp drag tracking
      });

      card.addEventListener("pointermove", (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startPointerX;
        const dy = e.clientY - startPointerY;

        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
          hasMovedSignificantly = true;
        }

        const newX = initialLeft + dx;
        const newY = initialTop + dy;

        card._data.x = newX;
        card._data.y = newY;
        card.style.left = `${newX}px`;
        card.style.top = `${newY}px`;
      });

      const endDrag = (e) => {
        if (!isDragging) return;
        isDragging = false;
        try {
          card.releasePointerCapture(e.pointerId);
        } catch (_) {}

        card.style.transition = "box-shadow 0.2s ease, filter 0.2s ease";
        card.style.transform = `scale(${card._data.scale}) rotate(${card._data.rotation}deg)`;

        // If it was a quick tap/click rather than a drag -> trigger manual spastic flicker!
        if (!hasMovedSignificantly) {
          triggerSpasticManualBurst(card);
        }
      };

      card.addEventListener("pointerup", endDrag);
      card.addEventListener("pointercancel", endDrag);
    }

    /**
     * Requirement 3: Manual click triggers rapid "crazy flickering"
     * on that exact card alongside screen twitch and audio feedback!
     */
    function triggerSpasticManualBurst(card) {
      if (card._data.isFlickering) return;
      card._data.isFlickering = true;

      // Visual twitch effect
      card.classList.add("spastic-burst");

      let flickCounter = 0;
      const burstCycles = rand(8, 14); // 8 to 14 lightning toggles

      const burstTimer = setInterval(() => {
        card.classList.toggle("is-active");
        flickCounter++;

        // Trigger staccato Radar tone when sound is enabled
        radarSound.playAlarm();

        if (flickCounter >= burstCycles) {
          clearInterval(burstTimer);
          card.classList.remove("spastic-burst");
          card._data.isFlickering = false;
          // Settle state firmly
          card.classList.toggle("is-active", Math.random() > 0.3);
          card.style.transform = `scale(${card._data.scale}) rotate(${card._data.rotation}deg)`;
        }
      }, 55); // 55ms hyper-fast strobe
    }

    /**
     * Automatic chaos loop across the whole pile.
     * Sound ONLY sounds when cards are actively flickering in this loop.
     */
    function startAutoChaos() {
      if (autoInterval) clearInterval(autoInterval);
      viewport.classList.add("chaos-jitter");

      autoInterval = setInterval(() => {
        if (!isAutoFlickering || cardElements.length === 0) return;

        // Pick 4 to 12 cards per tick
        const batch = rand(4, 12);
        for (let b = 0; b < batch; b++) {
          const idx = rand(0, cardElements.length - 1);
          const target = cardElements[idx];
          if (target && !target._data.isFlickering) {
            target.classList.toggle("is-active");
          }
        }

        // Play rhythm notes in sync with active auto-toggling
        if (Math.random() > 0.4) {
          radarSound.playAlarm();
        }
      }, 75);
    }

    function stopAutoChaos() {
      if (autoInterval) {
        clearInterval(autoInterval);
        autoInterval = null;
      }
      viewport.classList.remove("chaos-jitter");
    }

    // Re-randomize layout button
    btnReorder.addEventListener("click", () => {
      buildChaoticStack();
      if (isAutoFlickering) startAutoChaos();
    });

    // Auto flicker toggle
    btnAutoFlicker.addEventListener("click", () => {
      isAutoFlickering = !isAutoFlickering;
      if (isAutoFlickering) {
        btnAutoFlicker.classList.replace("bg-neutral-700", "bg-emerald-600");
        flickerDot.classList.remove("hidden");
        flickerText.textContent = "自动疯闪: 开";
        startAutoChaos();
      } else {
        btnAutoFlicker.classList.replace("bg-emerald-600", "bg-neutral-700");
        flickerDot.classList.add("hidden");
        flickerText.textContent = "自动疯闪: 关";
        stopAutoChaos();
      }
    });

    // Audio Engine Toggle: purely enables/disables sound generation
    btnAudio.addEventListener("click", () => {
      radarSound.init();
      radarSound.enabled = !radarSound.enabled;
      if (radarSound.enabled) {
        audioText.textContent = "Radar: 开";
        btnAudio.classList.add("bg-emerald-700/40", "border-emerald-500/50");
      } else {
        audioText.textContent = "Radar: 关";
        btnAudio.classList.remove("bg-emerald-700/40", "border-emerald-500/50");
      }
    });

    // Card density adjustments
    btnDensityInc.addEventListener("click", () => {
      totalCardTarget = Math.min(130, totalCardTarget + 15);
      buildChaoticStack();
    });

    btnDensityDec.addEventListener("click", () => {
      totalCardTarget = Math.max(30, totalCardTarget - 15);
      buildChaoticStack();
    });

    // Handle dynamic viewport resize
    let resizeTimer = null;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        buildChaoticStack();
      }, 200);
    });

    // Initialize application
    window.onload = function() {
      buildChaoticStack();
      startAutoChaos();
    };

