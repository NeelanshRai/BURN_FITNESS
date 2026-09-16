// =========================================================
// BURN - Progressive Performance & In-Gym Workout Engine
// =========================================================

(function() {
  "use strict";

  const root = document.getElementById("root");
  if (!root) return;

  // -------------------------------------------------------
  // GLOBAL STATE
  // -------------------------------------------------------
  const state = {
    currentTab: "WORKOUT", // "WORKOUT" | "ROUTINES" | "EXERCISES" | "MEASURE" | "HISTORY"
    profile: window.BURN_STORAGE.getProfile(),
    settings: window.BURN_STORAGE.getSettings(),

    // Active live workout session
    activeWorkout: null,

    // Modals
    plateModal: { open: false, targetWeight: 100, barWeight: 20 },
    exerciseDetailModal: { open: false, exerciseName: null, activeMetric: "MAX_WEIGHT" },
    routineEditorModal: { open: false, routine: null, isNew: false },
    customExerciseModal: { open: false, form: { name: "", category: "CHEST", trackingType: "WEIGHT_REPS", instructions: "" } },
    addExerciseModal: { open: false, search: "", selectedCategory: "ALL", targetType: "WORKOUT" },
    measurementModal: { open: false, form: { weightKg: "", bodyFat: "", chestCm: "", waistCm: "", armsCm: "", thighsCm: "" } },
    settingsModal: { open: false },
    viewingHistoryDetail: null,
    summaryModal: { open: false, session: null }
  };

  // -------------------------------------------------------
  // WORKOUT LIFECYCLE MANAGEMENT
  // -------------------------------------------------------
  function startWorkoutFromRoutine(routine) {
    const exercises = (routine.exercises || []).map(exName => {
      const dbEx = window.BURN_STORAGE.getAllExercises().find(e => e.name.toUpperCase() === exName.toUpperCase());
      const previousData = window.BURN_STORAGE.getPreviousSetsForExercise(exName, routine.id);

      // Pre-fill default 3 sets or based on previous session length
      const initialSetCount = previousData && previousData.sets.length > 0 ? previousData.sets.length : 3;
      const sets = [];
      for (let i = 1; i <= initialSetCount; i++) {
        sets.push({
          id: `s_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 4)}`,
          setNum: i,
          type: "NORMAL", // NORMAL, WARMUP, DROP, FAILURE
          weight: "",
          reps: "",
          completed: false,
          isPR: false
        });
      }

      return {
        name: exName,
        category: dbEx?.category || "STRENGTH",
        trackingType: dbEx?.trackingType || "WEIGHT_REPS",
        note: "",
        restTimerSeconds: state.settings.defaultRestSeconds || 90,
        sets: sets,
        previous: previousData
      };
    });

    state.activeWorkout = {
      id: `session_${Date.now()}`,
      routineId: routine.id || "quick",
      routineName: routine.name || "Custom Workout",
      startTime: Date.now(),
      userWeight: state.profile.currentWeightKg || 75,
      exercises: exercises
    };

    state.currentTab = "WORKOUT";
    render();
  }

  function finishActiveWorkout() {
    if (!state.activeWorkout) return;
    const session = state.activeWorkout;
    const durationMins = Math.max(1, Math.round((Date.now() - session.startTime) / 60000));

    // Filter to exercises that have at least one completed or logged set
    const completedExercises = session.exercises.filter(ex => {
      return ex.sets.some(s => s.completed || (Number(s.reps) > 0 && Number(s.weight) >= 0));
    });

    if (completedExercises.length === 0) {
      if (confirm("No completed sets logged yet. Discard this session?")) {
        state.activeWorkout = null;
        window.BURN_TIMER.stop();
        render();
      }
      return;
    }

    let totalVolume = 0;
    let totalSets = 0;
    let totalReps = 0;
    let totalPRs = 0;
    const musclesSet = new Set();

    completedExercises.forEach(ex => {
      const dbEx = window.BURN_STORAGE.getAllExercises().find(e => e.name.toUpperCase() === ex.name.toUpperCase());
      if (dbEx?.primary) musclesSet.add(dbEx.primary);
      (dbEx?.secondary || []).forEach(m => musclesSet.add(m));

      ex.sets.forEach(set => {
        if (!set.completed) return;
        totalSets++;
        const wt = Number(set.weight) || 0;
        const rp = Number(set.reps) || 0;
        totalReps += rp;
        totalVolume += (wt * rp);
        if (set.isPR) totalPRs++;
      });
    });

    const targetedMuscles = Array.from(musclesSet);
    if (targetedMuscles.length === 0) targetedMuscles.push("Full Body Prime Movers", "Core Stabilizers");

    const recoveryPlan = [
      "0-12 Hours: Glycogen repletion & acute neuromuscular recovery. Hydrate with 500-750ml electrolyte water and ingest 30-40g high-bioavailability protein within 2 hours.",
      "12-24 Hours: Peak muscle protein synthesis (MPS). Mild Delayed Onset Muscle Soreness (DOMS) may manifest across primary agonists.",
      "24-48 Hours: Full structural myofibrillar supercompensation. Prioritize 8+ hours restorative sleep and light active recovery."
    ];

    const detailedSummary = generateBiomechanicalSummary(session.routineName, completedExercises, totalVolume, totalSets, totalReps, durationMins, targetedMuscles);

    const todayDate = new Date().toISOString().split("T")[0];
    const savedRecord = window.BURN_STORAGE.saveWorkoutSession({
      id: session.id,
      dateKey: todayDate,
      routineId: session.routineId,
      routineName: session.routineName,
      userWeight: session.userWeight,
      duration: durationMins,
      totalVolumeKg: Math.round(totalVolume),
      totalSets: totalSets,
      totalReps: totalReps,
      prsCount: totalPRs,
      targetedMuscles: targetedMuscles,
      exercises: completedExercises,
      recoveryNext48Hours: recoveryPlan,
      detailedSummary: detailedSummary
    });

    window.BURN_TIMER.stop();
    state.activeWorkout = null;
    state.summaryModal = { open: true, session: savedRecord };
    render();
  }

  function generateBiomechanicalSummary(routineName, exercises, volume, sets, reps, duration, muscles) {
    const exerciseNames = exercises.map(e => e.name).join(", ");
    const primaryMuscleList = muscles.slice(0, 4).join(", ");

    return `Today's ${routineName} session was executed with high mechanical tension and progressive overload density. Over the course of ${duration} minutes, you completed ${sets} sets and accumulated ${reps} total repetitions, driving ${volume.toLocaleString()} kg of gross mechanical workload across the ${primaryMuscleList}.
Exercises performed included: ${exerciseNames}.
The resistance density sustained provides strong hypertrophic signaling through high motor-unit recruitment and localized cellular swelling. Follow the recovery guidelines over the next 48 hours to maximize strength adaptation and connective tissue repair.`;
  }

  // -------------------------------------------------------
  // HTML ESCAPING UTILS
  // -------------------------------------------------------
  function escapeHtml(str) {
    return String(str || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;")
      .replaceAll("\n", "<br/>");
  }

  function escapeAttr(str) {
    return String(str || "").replaceAll('"', "&quot;");
  }

  // -------------------------------------------------------
  // MAIN RENDER ENGINE
  // -------------------------------------------------------
  function render() {
    root.innerHTML = `
      <div class="min-h-screen max-w-lg mx-auto bg-black text-white flex flex-col justify-between selection:bg-[#042854] pb-16">
        
        <!-- Top App Bar -->
        ${renderTopAppBar()}

        <!-- Main Tab Content -->
        <main class="flex-1 px-3 sm:px-4 py-2 overflow-y-auto">
          ${renderTabContent()}
        </main>

        <!-- Persistent Rest Timer Banner (Floating) -->
        ${renderRestTimerBanner()}

        <!-- Bottom Navigation Bar -->
        ${renderBottomNavBar()}

        <!-- Modals -->
        ${state.plateModal.open ? renderPlateCalculatorModal() : ""}
        ${state.exerciseDetailModal.open ? renderExerciseDetailModal() : ""}
        ${state.routineEditorModal.open ? renderRoutineEditorModal() : ""}
        ${state.customExerciseModal.open ? renderCustomExerciseModal() : ""}
        ${state.addExerciseModal.open ? renderAddExerciseModal() : ""}
        ${state.measurementModal.open ? renderMeasurementModal() : ""}
        ${state.settingsModal.open ? renderSettingsModal() : ""}
        ${state.viewingHistoryDetail ? renderHistoryDetailModal(state.viewingHistoryDetail) : ""}
        ${state.summaryModal.open ? renderSummaryModal() : ""}
      </div>
    `;

    bindEvents();
  }

  // -------------------------------------------------------
  // TOP APP BAR
  // -------------------------------------------------------
  function renderTopAppBar() {
    return `
      <header class="px-3.5 py-2.5 border-b border-zinc-900 flex items-center justify-between gap-2 shrink-0 bg-black/95 sticky top-0 z-30">
        <div class="flex items-center gap-2">
          <img src="./app_logo.jpg" alt="BURN" class="w-8 h-8 rounded-lg border border-zinc-800 object-cover shadow-sm" />
          <div>
            <div class="flex items-center gap-1.5">
              <h1 class="text-xl font-black tracking-tight text-white leading-none">BURN</h1>
              <span class="text-[9px] font-black bg-blue-950 text-blue-400 border border-blue-900 px-1.5 py-0.5 rounded">PRO</span>
            </div>
            <p class="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">PROGRESSIVE OVERLOAD ENGINE</p>
          </div>
        </div>

        <div class="flex items-center gap-1.5">
          <!-- Plate Calculator Quick Button -->
          <button data-a="open-plate-calc" class="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition" title="Barbell Plate Calculator">
            <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" stroke-width="2"></circle>
              <circle cx="12" cy="12" r="3" stroke-width="2"></circle>
              <line x1="12" y1="3" x2="12" y2="6" stroke-width="2"></line>
              <line x1="12" y1="18" x2="12" y2="21" stroke-width="2"></line>
            </svg>
          </button>

          <!-- Settings Button -->
          <button data-a="open-settings" class="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition" title="Settings">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <circle cx="12" cy="12" r="3" stroke-width="2"></circle>
            </svg>
          </button>
        </div>
      </header>
    `;
  }

  // -------------------------------------------------------
  // BOTTOM NAVIGATION BAR
  // -------------------------------------------------------
  function renderBottomNavBar() {
    const tabs = [
      { id: "WORKOUT", label: "Workout", icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>` },
      { id: "ROUTINES", label: "Routines", icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>` },
      { id: "EXERCISES", label: "Library", icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>` },
      { id: "MEASURE", label: "Metrics", icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>` },
      { id: "HISTORY", label: "30D Log", icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>` }
    ];

    const buttons = tabs.map(t => {
      const active = state.currentTab === t.id;
      return `
        <button data-a="switch-tab" data-tab="${t.id}" class="flex-1 py-1.5 flex flex-col items-center justify-center transition ${
          active ? "text-blue-400 font-black" : "text-zinc-500 hover:text-zinc-300 font-bold"
        }">
          <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">${t.icon}</svg>
          <span class="text-[9px] uppercase tracking-wider">${t.label}</span>
        </button>
      `;
    }).join("");

    return `
      <nav class="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-zinc-950/95 border-t border-zinc-900 px-1 py-1 flex items-center justify-around z-40 backdrop-blur-md">
        ${buttons}
      </nav>
    `;
  }

  // -------------------------------------------------------
  // REST TIMER FLOATING BANNER
  // -------------------------------------------------------
  function renderRestTimerBanner() {
    const isRunning = window.BURN_TIMER.isActive();
    const remaining = window.BURN_TIMER.getRemaining();
    const timeFormatted = window.BURN_TIMER.formatTime(remaining);

    return `
      <div id="rest-timer-banner" class="${isRunning ? "" : "hidden"} fixed bottom-14 left-0 right-0 max-w-lg mx-auto px-3 z-30 pointer-events-none">
        <div class="pointer-events-auto bg-blue-950/90 border border-blue-800/80 backdrop-blur-md rounded-2xl p-2.5 px-4 shadow-xl flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <span class="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping"></span>
            <div>
              <span class="text-[9px] font-black uppercase text-blue-300 tracking-wider block">REST TIMER</span>
              <span id="timer-display-time" class="text-lg font-black font-mono text-white leading-none">${timeFormatted}</span>
            </div>
          </div>

          <div class="flex items-center gap-1.5">
            <button data-a="timer-minus" class="px-2 py-1 text-[10px] font-bold bg-blue-900/60 hover:bg-blue-900 border border-blue-700/60 rounded-lg text-white transition">-15s</button>
            <button data-a="timer-plus" class="px-2 py-1 text-[10px] font-bold bg-blue-900/60 hover:bg-blue-900 border border-blue-700/60 rounded-lg text-white transition">+15s</button>
            <button data-a="timer-skip" class="px-2.5 py-1 text-[10px] font-bold bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-zinc-300 transition">Skip</button>
          </div>
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------
  // TAB ROUTING
  // -------------------------------------------------------
  function renderTabContent() {
    if (state.activeWorkout && state.currentTab === "WORKOUT") {
      return renderActiveWorkoutView();
    }

    switch (state.currentTab) {
      case "WORKOUT":
        return renderWorkoutHomeView();
      case "ROUTINES":
        return renderRoutinesView();
      case "EXERCISES":
        return renderExerciseLibraryView();
      case "MEASURE":
        return renderMeasurementsView();
      case "HISTORY":
        return renderHistoryView();
      default:
        return renderWorkoutHomeView();
    }
  }

  // -------------------------------------------------------
  // 1. WORKOUT HOME VIEW (When no active workout)
  // -------------------------------------------------------
  function renderWorkoutHomeView() {
    const routines = window.BURN_STORAGE.getRoutines();
    const todayDay = new Date().getDay(); // 0 = Sun, 1 = Mon ...
    const dayMap = [6, 0, 1, 2, 3, 4, 5]; // mapped to standard splits
    const suggestedRoutine = routines[dayMap[todayDay] % routines.length] || routines[0];

    return `
      <div class="fade-step space-y-4 py-2">
        <!-- Quick Start Card -->
        <div class="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-black tracking-widest text-blue-400 uppercase">RECOMMENDED SESSION</span>
            <span class="text-[9px] font-bold text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded-full">${new Date().toLocaleDateString("en-US", { weekday: "long" })}</span>
          </div>

          <div>
            <h2 class="text-2xl font-black uppercase text-white tracking-tight leading-tight">${escapeHtml(suggestedRoutine.name)}</h2>
            <p class="text-xs text-zinc-400 mt-1">${suggestedRoutine.exercises.length} calibrated exercises • Progressive Overload</p>
          </div>

          <div class="flex flex-wrap gap-1 pt-1">
            ${suggestedRoutine.exercises.slice(0, 5).map(e => `
              <span class="text-[10px] font-bold bg-zinc-800/60 text-zinc-300 border border-zinc-700/50 px-2 py-0.5 rounded">${escapeHtml(e)}</span>
            `).join("")}
            ${suggestedRoutine.exercises.length > 5 ? `<span class="text-[10px] font-bold text-zinc-500 py-0.5">+${suggestedRoutine.exercises.length - 5} more</span>` : ""}
          </div>

          <button data-a="start-routine" data-id="${suggestedRoutine.id}" class="w-full py-4 text-sm font-black uppercase tracking-widest text-white accent-bg hover:brightness-110 active:scale-[0.99] rounded-xl shadow-lg shadow-blue-950/40 transition flex items-center justify-center gap-2">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            START THIS WORKOUT
          </button>
        </div>

        <!-- Quick Routine Pickers -->
        <div class="space-y-2">
          <div class="flex items-center justify-between px-1">
            <h3 class="text-xs font-black uppercase tracking-wider text-zinc-400">ALL ROUTINE SPLITS</h3>
            <button data-a="open-new-routine" class="text-[10px] font-bold text-blue-400 hover:text-blue-300 uppercase tracking-wider">+ Create Routine</button>
          </div>

          <div class="grid grid-cols-1 gap-2.5">
            ${routines.map(r => `
              <div class="bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 rounded-xl p-3.5 flex items-center justify-between transition">
                <div class="min-w-0 pr-3">
                  <h4 class="font-black text-sm text-white uppercase tracking-tight truncate">${escapeHtml(r.name)}</h4>
                  <p class="text-[10px] text-zinc-500 font-bold mt-0.5">${r.exercises.length} exercises</p>
                </div>
                <button data-a="start-routine" data-id="${r.id}" class="px-3.5 py-2 text-xs font-black uppercase tracking-wider bg-blue-950 text-blue-300 border border-blue-900 hover:bg-blue-900 hover:text-white rounded-lg transition shrink-0">
                  START
                </button>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------
  // 2. ACTIVE WORKOUT LOGGING VIEW (Hevy-style in-gym logger)
  // -------------------------------------------------------
  function renderActiveWorkoutView() {
    const workout = state.activeWorkout;
    if (!workout) return "";

    const exerciseCards = workout.exercises.map((ex, exIdx) => {
      const dbEx = window.BURN_STORAGE.getAllExercises().find(e => e.name.toUpperCase() === ex.name.toUpperCase());
      const isBarbell = ex.name.toLowerCase().includes("barbell") || ex.name.toLowerCase().includes("bench") || ex.name.toLowerCase().includes("squat") || ex.name.toLowerCase().includes("deadlift");

      const setsRows = ex.sets.map((set, setIdx) => {
        const prevSet = ex.previous?.sets?.[setIdx];
        const prevText = prevSet ? `${prevSet.weight}kg × ${prevSet.reps}` : "—";
        const estimated1RM = set.weight && set.reps ? window.BURN_CALC.calculate1RM(set.weight, set.reps) : null;

        // Set type badges: NORMAL (1, 2, 3), WARMUP (W), DROP (D), FAILURE (F)
        let typeBadge = `${set.setNum}`;
        let typeClass = "bg-zinc-800 text-zinc-300";
        if (set.type === "WARMUP") {
          typeBadge = "W";
          typeClass = "bg-amber-950 text-amber-300 border border-amber-800";
        } else if (set.type === "DROP") {
          typeBadge = "D";
          typeClass = "bg-purple-950 text-purple-300 border border-purple-800";
        } else if (set.type === "FAILURE") {
          typeBadge = "F";
          typeClass = "bg-red-950 text-red-300 border border-red-800";
        }

        const isCompleted = set.completed;

        return `
          <div class="grid grid-cols-12 gap-1.5 items-center py-1.5 ${isCompleted ? "opacity-95" : ""}">
            <!-- Set Type / Number Button (Tap to toggle type) -->
            <div class="col-span-2 flex items-center justify-center">
              <button data-a="cycle-set-type" data-exidx="${exIdx}" data-setidx="${setIdx}"
                class="w-7 h-7 rounded-lg text-xs font-black font-mono transition flex items-center justify-center ${typeClass}"
                title="Tap to change set type (Normal, Warmup, Drop, Failure)">
                ${typeBadge}
              </button>
            </div>

            <!-- PREVIOUS Column (One-Tap Autofill!) -->
            <div class="col-span-3 text-center">
              <button data-a="autofill-previous" data-exidx="${exIdx}" data-setidx="${setIdx}"
                class="w-full py-1 text-[10px] font-mono font-bold text-zinc-400 hover:text-blue-400 bg-zinc-950/60 hover:bg-zinc-900 border border-zinc-800/80 rounded-md transition truncate px-1"
                title="Tap to quick autofill with previous values">
                ${prevText}
              </button>
            </div>

            <!-- KG / Weight Input -->
            <div class="col-span-3">
              <input data-a="set-weight" data-exidx="${exIdx}" data-setidx="${setIdx}"
                type="number" step="0.5" placeholder="0" value="${set.weight !== "" ? set.weight : ""}"
                class="w-full py-1.5 px-2 bg-zinc-800/90 focus:bg-zinc-800 border ${isCompleted ? "border-emerald-800/60 text-emerald-300" : "border-zinc-700/80 text-white"} focus:border-blue-500 rounded-lg text-center font-mono font-bold text-sm outline-none" />
            </div>

            <!-- Reps Input -->
            <div class="col-span-2">
              <input data-a="set-reps" data-exidx="${exIdx}" data-setidx="${setIdx}"
                type="number" placeholder="0" value="${set.reps !== "" ? set.reps : ""}"
                class="w-full py-1.5 px-1 bg-zinc-800/90 focus:bg-zinc-800 border ${isCompleted ? "border-emerald-800/60 text-emerald-300" : "border-zinc-700/80 text-white"} focus:border-blue-500 rounded-lg text-center font-mono font-bold text-sm outline-none" />
            </div>

            <!-- Checkmark / Complete Button -->
            <div class="col-span-2 flex items-center justify-center">
              <button data-a="toggle-complete-set" data-exidx="${exIdx}" data-setidx="${setIdx}"
                class="w-7 h-7 rounded-lg flex items-center justify-center transition ${
                  isCompleted
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-950"
                    : "bg-zinc-800 hover:bg-zinc-700 text-zinc-500 hover:text-white"
                }"
                title="Mark set completed">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                </svg>
              </button>
            </div>
          </div>
        `;
      }).join("");

      // Exercise 1RM best in current session
      const validSets = ex.sets.filter(s => Number(s.weight) > 0 && Number(s.reps) > 0);
      const bestSession1RM = validSets.length > 0 ? Math.max(...validSets.map(s => window.BURN_CALC.calculate1RM(s.weight, s.reps))) : null;

      return `
        <div class="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3.5 space-y-3">
          <!-- Exercise Header -->
          <div class="flex items-start justify-between gap-2 border-b border-zinc-800/80 pb-2">
            <div class="min-w-0 flex-1">
              <!-- Clickable exercise title opens exercise history & cues modal -->
              <button data-a="open-ex-history" data-name="${escapeAttr(ex.name)}"
                class="text-left font-black text-sm text-white hover:text-blue-400 uppercase tracking-tight flex items-center gap-1.5 group">
                <span class="truncate">${escapeHtml(ex.name)}</span>
                <svg class="w-3.5 h-3.5 text-zinc-500 group-hover:text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </button>
              
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-[9px] font-bold text-blue-400 uppercase tracking-wider">${escapeHtml(ex.category)}</span>
                ${bestSession1RM ? `<span class="text-[9px] font-mono font-bold text-amber-400 bg-amber-950/40 border border-amber-900/40 px-1.5 py-0.2 rounded">Est 1RM: ${bestSession1RM} kg</span>` : ""}
              </div>
            </div>

            <!-- Action buttons for exercise: Plate Calc, Remove -->
            <div class="flex items-center gap-1 shrink-0">
              ${isBarbell ? `
                <button data-a="calc-plates-for-ex" data-exidx="${exIdx}" class="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-blue-400 rounded-lg text-xs" title="Plate Calculator">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke-width="2"></circle><circle cx="12" cy="12" r="3" stroke-width="2"></circle></svg>
                </button>
              ` : ""}
              <button data-a="remove-exercise" data-exidx="${exIdx}" class="p-1.5 text-zinc-500 hover:text-red-400 rounded-lg" title="Remove exercise">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
          </div>

          <!-- In-Set Notes Field -->
          <div>
            <input data-a="exercise-note" data-exidx="${exIdx}" type="text" placeholder="Add note (seat height, tempo, cues)..."
              value="${escapeAttr(ex.note || "")}"
              class="w-full text-[11px] bg-black/40 border border-zinc-800/80 focus:border-zinc-700 rounded-lg px-2.5 py-1.5 text-zinc-300 placeholder-zinc-600 outline-none" />
          </div>

          <!-- Sets Table Header -->
          <div class="grid grid-cols-12 gap-1.5 text-[9px] font-black uppercase tracking-wider text-zinc-500 text-center px-1">
            <div class="col-span-2">SET</div>
            <div class="col-span-3">PREVIOUS</div>
            <div class="col-span-3">KG</div>
            <div class="col-span-2">REPS</div>
            <div class="col-span-2">DONE</div>
          </div>

          <!-- Sets Rows -->
          <div class="space-y-1">
            ${setsRows}
          </div>

          <!-- Add Set Button -->
          <div class="pt-1 flex items-center justify-between">
            <button data-a="add-set" data-exidx="${exIdx}"
              class="py-1.5 px-3 text-xs font-bold text-zinc-300 hover:text-white bg-zinc-800/70 hover:bg-zinc-800 border border-zinc-700/60 rounded-lg transition flex items-center gap-1">
              <span class="text-blue-400 font-black">+</span> Add Set
            </button>
            <span class="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Rest: ${ex.restTimerSeconds || 90}s</span>
          </div>
        </div>
      `;
    }).join("");

    return `
      <div class="fade-step space-y-4 pb-20">
        <!-- Live Workout Sub-Header -->
        <div class="flex items-center justify-between pb-2 border-b border-zinc-800">
          <div>
            <span class="text-[9px] font-black text-blue-400 uppercase tracking-widest block">IN-GYM LIVE SESSION</span>
            <h2 class="text-lg font-black uppercase text-white tracking-tight leading-none">${escapeHtml(workout.routineName)}</h2>
          </div>
          <button data-a="finish-workout" class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-md shadow-emerald-950">
            FINISH WORKOUT
          </button>
        </div>

        <!-- Exercise Cards -->
        <div class="space-y-3.5">
          ${exerciseCards}
        </div>

        <!-- Add Exercise to Workout Button -->
        <div class="pt-2 space-y-2">
          <button data-a="open-add-ex-workout" class="w-full py-3.5 border border-dashed border-zinc-700 hover:border-zinc-500 bg-zinc-950 hover:bg-zinc-900 rounded-xl text-xs font-black uppercase tracking-widest text-zinc-300 hover:text-white transition flex items-center justify-center gap-2">
            <span class="text-blue-400 text-base leading-none">+</span> ADD EXERCISE
          </button>

          <button data-a="cancel-workout" class="w-full py-2 text-[11px] font-bold text-zinc-500 hover:text-red-400 uppercase tracking-widest transition">
            Discard Workout
          </button>
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------
  // 3. ROUTINES TAB
  // -------------------------------------------------------
  function renderRoutinesView() {
    const routines = window.BURN_STORAGE.getRoutines();

    return `
      <div class="fade-step space-y-4 py-2">
        <div class="flex items-center justify-between pb-1 border-b border-zinc-900">
          <div>
            <h2 class="text-xl font-black uppercase tracking-tight text-white">ROUTINE PROGRAMS</h2>
            <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Structured workout splits</p>
          </div>
          <button data-a="open-new-routine" class="px-3 py-1.5 text-xs font-black bg-blue-600 hover:bg-blue-500 text-white uppercase rounded-lg transition shadow-sm">
            + NEW ROUTINE
          </button>
        </div>

        <div class="space-y-3">
          ${routines.map(r => `
            <div class="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 space-y-3">
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="font-black text-base uppercase text-white tracking-tight">${escapeHtml(r.name)}</h3>
                  <span class="text-[9px] font-bold text-blue-400 uppercase tracking-wider">${escapeHtml(r.split || "CUSTOM")}</span>
                </div>
                <div class="flex items-center gap-1">
                  <button data-a="edit-routine" data-id="${r.id}" class="text-[10px] font-bold text-zinc-400 hover:text-white px-2 py-1 bg-zinc-800 rounded">
                    Edit
                  </button>
                  ${!r.id.startsWith("routine_") ? `
                    <button data-a="delete-routine" data-id="${r.id}" class="text-[10px] font-bold text-red-400 hover:text-red-300 px-2 py-1 bg-zinc-800 rounded">
                      ✕
                    </button>
                  ` : ""}
                </div>
              </div>

              <div class="flex flex-wrap gap-1.5">
                ${(r.exercises || []).map(ex => `
                  <span class="text-[10px] font-bold bg-black/50 text-zinc-300 border border-zinc-800 px-2 py-0.5 rounded">${escapeHtml(ex)}</span>
                `).join("")}
              </div>

              <button data-a="start-routine" data-id="${r.id}" class="w-full py-2.5 bg-zinc-800 hover:bg-blue-900 text-zinc-200 hover:text-white text-xs font-black uppercase tracking-widest rounded-xl transition">
                START WORKOUT
              </button>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------
  // 4. EXERCISE LIBRARY TAB
  // -------------------------------------------------------
  function renderExerciseLibraryView() {
    const all = window.BURN_STORAGE.getAllExercises();
    const categories = ["ALL", "CHEST", "BACK", "SHOULDERS", "LEGS", "ARMS", "CORE"];

    return `
      <div class="fade-step space-y-3.5 py-2">
        <div class="flex items-center justify-between pb-1 border-b border-zinc-900">
          <div>
            <h2 class="text-xl font-black uppercase tracking-tight text-white">EXERCISE LIBRARY</h2>
            <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">${all.length} movements available</p>
          </div>
          <button data-a="open-custom-ex" class="px-2.5 py-1.5 text-xs font-black bg-zinc-800 hover:bg-zinc-700 text-blue-400 border border-zinc-700 rounded-lg transition">
            + CUSTOM
          </button>
        </div>

        <!-- Search Bar -->
        <div>
          <input id="lib-search" type="text" placeholder="Search exercises by name..."
            class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-bold outline-none focus:border-blue-500 transition" />
        </div>

        <!-- Exercise List -->
        <div id="lib-list" class="space-y-1.5 max-h-[65vh] overflow-y-auto pr-1">
          ${all.map(ex => `
            <button data-a="open-ex-history" data-name="${escapeAttr(ex.name)}"
              class="w-full text-left bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800/80 p-3 rounded-xl flex items-center justify-between transition group">
              <div class="min-w-0 pr-2">
                <h4 class="font-bold text-sm text-white tracking-tight group-hover:text-blue-400 transition truncate">${escapeHtml(ex.name)}</h4>
                <span class="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">${escapeHtml(ex.category)} • ${escapeHtml(ex.primary || "Strength")}</span>
              </div>
              <svg class="w-4 h-4 text-zinc-600 group-hover:text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
          `).join("")}
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------
  // 5. BODY METRICS & MEASUREMENTS TAB
  // -------------------------------------------------------
  function renderMeasurementsView() {
    const list = window.BURN_STORAGE.getMeasurements();

    return `
      <div class="fade-step space-y-4 py-2">
        <div class="flex items-center justify-between pb-1 border-b border-zinc-900">
          <div>
            <h2 class="text-xl font-black uppercase tracking-tight text-white">BODY METRICS</h2>
            <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Weight & circumference tracking</p>
          </div>
          <button data-a="open-measure-modal" class="px-3 py-1.5 text-xs font-black bg-blue-600 hover:bg-blue-500 text-white uppercase rounded-lg transition shadow-sm">
            + LOG METRICS
          </button>
        </div>

        ${list.length === 0 ? `
          <div class="text-center py-10 bg-zinc-950/60 rounded-2xl border border-zinc-900 p-6 space-y-2">
            <svg class="w-8 h-8 text-zinc-700 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            <p class="text-xs font-bold text-zinc-400 uppercase">No measurements recorded yet</p>
            <p class="text-[10px] text-zinc-600">Track your weight, body fat %, and circumference measurements alongside progressive volume.</p>
          </div>
        ` : `
          <div class="space-y-2.5">
            ${list.map(m => `
              <div class="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3.5 space-y-2">
                <div class="flex items-center justify-between border-b border-zinc-800/60 pb-1.5">
                  <span class="text-xs font-black text-blue-400 font-mono">${m.date}</span>
                  <span class="text-sm font-black text-white">${m.weightKg ? `${m.weightKg} kg` : "—"}</span>
                </div>
                <div class="grid grid-cols-4 gap-2 text-center text-[10px]">
                  <div class="bg-black/40 p-1.5 rounded border border-zinc-800/80">
                    <span class="text-zinc-500 block text-[8px] uppercase">Body Fat</span>
                    <span class="font-bold text-zinc-200">${m.bodyFat ? `${m.bodyFat}%` : "—"}</span>
                  </div>
                  <div class="bg-black/40 p-1.5 rounded border border-zinc-800/80">
                    <span class="text-zinc-500 block text-[8px] uppercase">Chest</span>
                    <span class="font-bold text-zinc-200">${m.chestCm ? `${m.chestCm}cm` : "—"}</span>
                  </div>
                  <div class="bg-black/40 p-1.5 rounded border border-zinc-800/80">
                    <span class="text-zinc-500 block text-[8px] uppercase">Waist</span>
                    <span class="font-bold text-zinc-200">${m.waistCm ? `${m.waistCm}cm` : "—"}</span>
                  </div>
                  <div class="bg-black/40 p-1.5 rounded border border-zinc-800/80">
                    <span class="text-zinc-500 block text-[8px] uppercase">Arms</span>
                    <span class="font-bold text-zinc-200">${m.armsCm ? `${m.armsCm}cm` : "—"}</span>
                  </div>
                </div>
              </div>
            `).join("")}
          </div>
        `}
      </div>
    `;
  }

  // -------------------------------------------------------
  // 6. 30-DAY LOGS TAB (With full set details, reps & weights)
  // -------------------------------------------------------
  function renderHistoryView() {
    const sessions = window.BURN_STORAGE.getPast30DaysSessions();

    return `
      <div class="fade-step space-y-4 py-2">
        <div class="flex items-center justify-between pb-1 border-b border-zinc-900">
          <div>
            <h2 class="text-xl font-black uppercase tracking-tight text-white">30-DAY WORKOUT LOG</h2>
            <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">${sessions.length} completed sessions recorded</p>
          </div>
        </div>

        ${sessions.length === 0 ? `
          <div class="text-center py-12 bg-zinc-950/60 rounded-2xl border border-zinc-900 p-6 space-y-2">
            <p class="text-xs font-bold text-zinc-400 uppercase">No completed workouts yet</p>
            <p class="text-[10px] text-zinc-600">Start a session and tick off your completed sets to view your comprehensive 30-day activity logs.</p>
          </div>
        ` : `
          <div class="space-y-3">
            ${sessions.map(s => `
              <button data-a="view-history-detail" data-id="${s.id}"
                class="w-full text-left bg-zinc-900/80 hover:bg-zinc-800/90 border border-zinc-800 p-4 rounded-2xl transition space-y-2.5 group">
                <div class="flex items-start justify-between">
                  <div>
                    <span class="text-[10px] font-mono font-bold text-blue-400">${s.dateKey}</span>
                    <h3 class="font-black text-base text-white uppercase tracking-tight group-hover:text-blue-300 transition">${escapeHtml(s.routineName)}</h3>
                  </div>
                  <div class="text-right">
                    <span class="text-base font-black text-white font-mono">${s.totalVolumeKg ? `${s.totalVolumeKg.toLocaleString()} kg` : "—"}</span>
                    <span class="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block">VOLUME</span>
                  </div>
                </div>

                <div class="flex items-center gap-3 text-xs text-zinc-400 font-mono">
                  <span>⏱ ${s.duration} mins</span>
                  <span>•</span>
                  <span>${s.totalSets || 0} sets</span>
                  <span>•</span>
                  <span>${s.totalReps || 0} reps</span>
                </div>

                <!-- Exercise List with Sets/Reps/Weight Snippet -->
                <div class="border-t border-zinc-800/80 pt-2 space-y-1">
                  ${(s.exercises || []).map(ex => {
                    const completedSets = (ex.sets || []).filter(st => st.completed || st.reps > 0);
                    const setSummaries = completedSets.map(st => `${st.weight}kg×${st.reps}`).join(", ");
                    return `
                      <div class="flex items-baseline justify-between text-[11px]">
                        <span class="font-bold text-zinc-300 truncate pr-2">${escapeHtml(ex.name)}</span>
                        <span class="font-mono text-zinc-500 text-[10px] shrink-0">${setSummaries || `${completedSets.length} sets`}</span>
                      </div>
                    `;
                  }).join("")}
                </div>
              </button>
            `).join("")}
          </div>
        `}
      </div>
    `;
  }

  // -------------------------------------------------------
  // MODAL: PLATE CALCULATOR
  // -------------------------------------------------------
  function renderPlateCalculatorModal() {
    const calc = window.BURN_CALC.calculatePlates(state.plateModal.targetWeight, state.plateModal.barWeight);

    return `
      <div class="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex flex-col justify-end">
        <div class="bg-zinc-900 border-t border-zinc-800 p-5 rounded-t-3xl max-h-[85vh] flex flex-col space-y-4">
          <div class="flex justify-between items-center pb-2 border-b border-zinc-800">
            <div>
              <h3 class="font-black text-base uppercase tracking-tight text-white">PLATE CALCULATOR</h3>
              <p class="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Exact barbell plate configuration</p>
            </div>
            <button data-a="close-plate-calc" class="text-xs font-bold text-zinc-400 hover:text-white px-3 py-1.5 bg-zinc-800 rounded-lg">CLOSE</button>
          </div>

          <!-- Target Weight Input -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Target Weight (KG)</label>
              <input id="plate-target-input" type="number" step="0.5" value="${state.plateModal.targetWeight}"
                class="w-full bg-zinc-800 rounded-xl p-3 text-white font-mono font-bold text-lg outline-none border border-zinc-700 focus:border-blue-500" />
            </div>
            <div>
              <label class="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Barbell Weight (KG)</label>
              <select id="plate-bar-select" class="w-full bg-zinc-800 rounded-xl p-3.5 text-white font-mono font-bold text-sm outline-none border border-zinc-700">
                <option value="20" ${state.plateModal.barWeight === 20 ? "selected" : ""}>20 kg (Standard Olympic)</option>
                <option value="15" ${state.plateModal.barWeight === 15 ? "selected" : ""}>15 kg (Women's Olympic)</option>
                <option value="10" ${state.plateModal.barWeight === 10 ? "selected" : ""}>10 kg (EZ Bar)</option>
              </select>
            </div>
          </div>

          <!-- Result Display -->
          <div class="bg-black/60 rounded-2xl p-4 border border-zinc-800 space-y-3">
            <div class="flex justify-between items-center">
              <div>
                <span class="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">PER SIDE LOAD</span>
                <span class="text-2xl font-black text-blue-400 font-mono">${calc.weightPerSide} kg</span>
              </div>
              <div class="text-right">
                <span class="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">TOTAL BARBELL</span>
                <span class="text-2xl font-black text-white font-mono">${calc.totalAchieved} kg</span>
              </div>
            </div>

            <!-- Plates Per Side Visual List -->
            <div>
              <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Plates Needed Per Side:</span>
              <div class="flex flex-wrap gap-2">
                ${calc.platesPerSide.length > 0 ? calc.platesPerSide.map(p => {
                  const cfg = window.BURN_CALC.PLATE_COLORS[p] || { bg: "#3b82f6", text: "#fff" };
                  return `
                    <div class="px-3 py-1.5 rounded-lg font-mono font-black text-xs shadow-sm flex items-center gap-1 border border-white/20"
                      style="background-color: ${cfg.bg}; color: ${cfg.text}">
                      ${p} kg
                    </div>
                  `;
                }).join("") : `<span class="text-xs text-zinc-500">Only empty barbell</span>`}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------
  // MODAL: EXERCISE DETAIL & HISTORY MODAL
  // -------------------------------------------------------
  function renderExerciseDetailModal() {
    const exName = state.exerciseDetailModal.exerciseName;
    const dbEx = window.BURN_STORAGE.getAllExercises().find(e => e.name.toUpperCase() === exName.toUpperCase());
    const historyLogs = window.BURN_STORAGE.getHistoryForExercise(exName);
    const prs = window.BURN_STORAGE.getPRMap()[exName.toUpperCase()] || { maxWeight: 0, max1RM: 0, maxVolume: 0 };

    // Prepare chart data points based on activeMetric
    const activeMetric = state.exerciseDetailModal.activeMetric || "MAX_WEIGHT";
    const chartPoints = historyLogs.slice(0, 10).reverse().map(log => {
      let val = 0;
      if (activeMetric === "MAX_WEIGHT") val = log.maxWeight;
      else if (activeMetric === "1RM") val = log.max1RM;
      else if (activeMetric === "VOLUME") val = log.volume;
      else if (activeMetric === "REPS") val = log.sets.reduce((acc, s) => acc + (Number(s.reps) || 0), 0);

      return {
        label: log.dateKey.slice(5), // "08-29"
        value: val
      };
    });

    return `
      <div class="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex flex-col justify-end">
        <div class="bg-zinc-900 border-t border-zinc-800 p-5 rounded-t-3xl max-h-[88vh] flex flex-col space-y-4">
          <div class="flex justify-between items-start border-b border-zinc-800 pb-2">
            <div>
              <h3 class="font-black text-lg uppercase tracking-tight text-white">${escapeHtml(exName)}</h3>
              <p class="text-[10px] text-blue-400 font-bold uppercase tracking-wider">${escapeHtml(dbEx?.category || "STRENGTH")} • ${escapeHtml(dbEx?.primary || "")}</p>
            </div>
            <button data-a="close-ex-history" class="text-xs font-bold text-zinc-400 hover:text-white px-3 py-1.5 bg-zinc-800 rounded-lg">CLOSE</button>
          </div>

          <div class="overflow-y-auto space-y-4 pr-1">
            <!-- Personal Records Banner -->
            <div class="grid grid-cols-3 gap-2 bg-black/60 p-3 rounded-xl border border-zinc-800 text-center">
              <div>
                <span class="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block">MAX WEIGHT</span>
                <span class="text-base font-black text-amber-400 font-mono">${prs.maxWeight || 0} kg</span>
              </div>
              <div>
                <span class="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block">EST. 1RM</span>
                <span class="text-base font-black text-blue-400 font-mono">${prs.max1RM || 0} kg</span>
              </div>
              <div>
                <span class="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block">BEST VOLUME</span>
                <span class="text-base font-black text-emerald-400 font-mono">${prs.maxVolume || 0} kg</span>
              </div>
            </div>

            <!-- Performance Chart Visualizer -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-black uppercase text-zinc-400">PERFORMANCE GRAPH</span>
                <div class="flex gap-1">
                  ${["MAX_WEIGHT", "1RM", "VOLUME"].map(m => `
                    <button data-a="switch-chart-metric" data-metric="${m}"
                      class="text-[9px] font-bold px-2 py-1 rounded transition ${activeMetric === m ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-white"}">
                      ${m === "MAX_WEIGHT" ? "WEIGHT" : m}
                    </button>
                  `).join("")}
                </div>
              </div>

              ${window.BURN_CHARTS.renderTrendChart(chartPoints, activeMetric, "kg")}
            </div>

            <!-- Movement Instructions & Form Cues -->
            ${dbEx?.instructions ? `
              <div class="space-y-1 bg-black/40 p-3 rounded-xl border border-zinc-800">
                <span class="text-[10px] font-black uppercase tracking-wider text-blue-400 block">EXECUTION & FORM CUES</span>
                <p class="text-xs text-zinc-300 leading-relaxed">${escapeHtml(dbEx.instructions)}</p>
              </div>
            ` : ""}

            <!-- Chronological Log of Past Sessions -->
            <div class="space-y-2">
              <span class="text-xs font-black uppercase text-zinc-400 block">PAST SESSIONS HISTORY</span>
              ${historyLogs.length === 0 ? `
                <p class="text-xs text-zinc-600 py-3 text-center">No past logs for this exercise yet</p>
              ` : `
                <div class="space-y-2">
                  ${historyLogs.map(h => `
                    <div class="bg-zinc-950/70 border border-zinc-800/80 p-3 rounded-xl space-y-1.5">
                      <div class="flex items-center justify-between">
                        <span class="text-[10px] font-mono font-bold text-blue-400">${h.dateKey}</span>
                        <span class="text-[10px] font-mono text-zinc-400">Vol: ${h.volume} kg</span>
                      </div>
                      <div class="flex flex-wrap gap-1.5">
                        ${h.sets.map((s, idx) => `
                          <span class="text-[10px] font-mono bg-zinc-800 text-zinc-200 px-2 py-0.5 rounded">
                            Set ${idx + 1}: ${s.weight}kg × ${s.reps}
                          </span>
                        `).join("")}
                      </div>
                      ${h.note ? `<p class="text-[10px] text-zinc-400 italic">"${escapeHtml(h.note)}"</p>` : ""}
                    </div>
                  `).join("")}
                </div>
              `}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------
  // MODAL: ROUTINE EDITOR (Create / Edit Routine)
  // -------------------------------------------------------
  function renderRoutineEditorModal() {
    const routine = state.routineEditorModal.routine;

    return `
      <div class="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex flex-col justify-end">
        <div class="bg-zinc-900 border-t border-zinc-800 p-5 rounded-t-3xl max-h-[85vh] flex flex-col space-y-4">
          <div class="flex justify-between items-center pb-2 border-b border-zinc-800">
            <h3 class="font-black text-base uppercase tracking-tight text-white">${state.routineEditorModal.isNew ? "NEW ROUTINE" : "EDIT ROUTINE"}</h3>
            <button data-a="close-routine-editor" class="text-xs font-bold text-zinc-400 hover:text-white px-3 py-1.5 bg-zinc-800 rounded-lg">CLOSE</button>
          </div>

          <div class="space-y-3">
            <div>
              <label class="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Routine Name</label>
              <input id="edit-routine-name" type="text" value="${escapeAttr(routine.name)}" placeholder="e.g. Upper Body Hypertrophy"
                class="w-full bg-zinc-800 rounded-xl p-3 text-white font-bold text-sm outline-none border border-zinc-700" />
            </div>

            <div>
              <div class="flex justify-between items-center mb-1">
                <label class="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Exercises (${routine.exercises.length})</label>
                <button data-a="open-add-ex-routine" class="text-[10px] font-bold text-blue-400 uppercase">+ Add Exercise</button>
              </div>

              <div class="max-h-[35vh] overflow-y-auto space-y-1.5 pr-1">
                ${routine.exercises.map((ex, idx) => `
                  <div class="bg-zinc-800/80 px-3 py-2 rounded-xl flex items-center justify-between border border-zinc-700/60">
                    <span class="text-xs font-bold text-white truncate">${escapeHtml(ex)}</span>
                    <button data-a="routine-remove-ex" data-idx="${idx}" class="text-red-400 hover:text-red-300 text-xs px-2">✕</button>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>

          <button data-a="save-routine" class="w-full py-4 text-sm font-black uppercase tracking-widest text-white accent-bg rounded-xl">
            SAVE ROUTINE
          </button>
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------
  // MODAL: CUSTOM EXERCISE CREATOR
  // -------------------------------------------------------
  function renderCustomExerciseModal() {
    return `
      <div class="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex flex-col justify-end">
        <div class="bg-zinc-900 border-t border-zinc-800 p-5 rounded-t-3xl max-h-[85vh] flex flex-col space-y-4">
          <div class="flex justify-between items-center pb-2 border-b border-zinc-800">
            <h3 class="font-black text-base uppercase tracking-tight text-white">NEW CUSTOM MOVEMENT</h3>
            <button data-a="close-custom-ex" class="text-xs font-bold text-zinc-400 hover:text-white px-3 py-1.5 bg-zinc-800 rounded-lg">CLOSE</button>
          </div>

          <div class="space-y-3">
            <div>
              <label class="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Exercise Name</label>
              <input id="custom-ex-name" type="text" placeholder="e.g. Belt Squat"
                class="w-full bg-zinc-800 rounded-xl p-3 text-white font-bold text-sm outline-none border border-zinc-700" />
            </div>

            <div class="grid grid-cols-2 gap-2.5">
              <div>
                <label class="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Muscle Group</label>
                <select id="custom-ex-cat" class="w-full bg-zinc-800 rounded-xl p-3 text-white text-xs font-bold outline-none border border-zinc-700">
                  <option value="CHEST">Chest</option>
                  <option value="BACK">Back</option>
                  <option value="SHOULDERS">Shoulders</option>
                  <option value="LEGS">Legs</option>
                  <option value="ARMS">Arms</option>
                  <option value="CORE">Core</option>
                  <option value="CARDIO">Cardio</option>
                </select>
              </div>

              <div>
                <label class="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Tracking Type</label>
                <select id="custom-ex-type" class="w-full bg-zinc-800 rounded-xl p-3 text-white text-xs font-bold outline-none border border-zinc-700">
                  <option value="WEIGHT_REPS">Weight & Reps</option>
                  <option value="BODYWEIGHT_REPS">Bodyweight Reps</option>
                  <option value="DURATION">Duration (Time)</option>
                  <option value="DISTANCE">Distance</option>
                </select>
              </div>
            </div>

            <div>
              <label class="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Form Notes / Setup Cues (Optional)</label>
              <textarea id="custom-ex-notes" rows="2" placeholder="e.g. Set pins at height 4, wide stance..."
                class="w-full bg-zinc-800 rounded-xl p-2.5 text-white text-xs outline-none border border-zinc-700"></textarea>
            </div>
          </div>

          <button data-a="save-custom-ex" class="w-full py-4 text-sm font-black uppercase tracking-widest text-white accent-bg rounded-xl">
            CREATE EXERCISE
          </button>
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------
  // MODAL: ADD EXERCISE (Search & Select)
  // -------------------------------------------------------
  function renderAddExerciseModal() {
    const all = window.BURN_STORAGE.getAllExercises();
    const q = (state.addExerciseModal.search || "").toUpperCase().trim();
    const filtered = all.filter(ex => ex.name.toUpperCase().includes(q));

    return `
      <div class="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex flex-col justify-end">
        <div class="bg-zinc-900 border-t border-zinc-800 p-5 rounded-t-3xl max-h-[85vh] flex flex-col space-y-3.5">
          <div class="flex justify-between items-center pb-1">
            <h3 class="font-black text-base uppercase tracking-tight text-white">ADD EXERCISE</h3>
            <button data-a="close-add-ex-modal" class="text-xs font-bold text-zinc-400 hover:text-white px-3 py-1.5 bg-zinc-800 rounded-lg">DONE</button>
          </div>

          <input id="add-modal-search" type="text" placeholder="Search exercises..." value="${escapeAttr(state.addExerciseModal.search)}"
            class="w-full bg-zinc-800 rounded-xl p-3 text-white font-bold text-sm outline-none border border-zinc-700 focus:border-blue-500" />

          <div class="overflow-y-auto max-h-[50vh] pr-1 space-y-1">
            ${filtered.map(ex => `
              <button data-a="select-add-exercise" data-name="${escapeAttr(ex.name)}"
                class="w-full text-left py-3 px-3.5 border-b border-zinc-800 text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 text-zinc-300 hover:text-white transition flex items-center justify-between">
                <span>+ ${escapeHtml(ex.name)}</span>
                <span class="text-[9px] text-zinc-500 font-mono">${escapeHtml(ex.category)}</span>
              </button>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------
  // MODAL: MEASUREMENT ENTRY
  // -------------------------------------------------------
  function renderMeasurementModal() {
    const today = new Date().toISOString().split("T")[0];

    return `
      <div class="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex flex-col justify-end">
        <div class="bg-zinc-900 border-t border-zinc-800 p-5 rounded-t-3xl max-h-[85vh] flex flex-col space-y-4">
          <div class="flex justify-between items-center pb-2 border-b border-zinc-800">
            <h3 class="font-black text-base uppercase tracking-tight text-white">LOG BODY METRICS</h3>
            <button data-a="close-measure-modal" class="text-xs font-bold text-zinc-400 hover:text-white px-3 py-1.5 bg-zinc-800 rounded-lg">CLOSE</button>
          </div>

          <div class="space-y-3">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Body Weight (KG)</label>
                <input id="m-weight" type="number" step="0.1" placeholder="75.0"
                  class="w-full bg-zinc-800 rounded-xl p-3 text-white font-mono font-bold text-sm outline-none border border-zinc-700" />
              </div>
              <div>
                <label class="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Body Fat (%)</label>
                <input id="m-fat" type="number" step="0.1" placeholder="15.0"
                  class="w-full bg-zinc-800 rounded-xl p-3 text-white font-mono font-bold text-sm outline-none border border-zinc-700" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Chest (CM)</label>
                <input id="m-chest" type="number" step="0.5" placeholder="102"
                  class="w-full bg-zinc-800 rounded-xl p-3 text-white font-mono font-bold text-sm outline-none border border-zinc-700" />
              </div>
              <div>
                <label class="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Waist (CM)</label>
                <input id="m-waist" type="number" step="0.5" placeholder="82"
                  class="w-full bg-zinc-800 rounded-xl p-3 text-white font-mono font-bold text-sm outline-none border border-zinc-700" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Arms (CM)</label>
                <input id="m-arms" type="number" step="0.5" placeholder="38"
                  class="w-full bg-zinc-800 rounded-xl p-3 text-white font-mono font-bold text-sm outline-none border border-zinc-700" />
              </div>
              <div>
                <label class="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Thighs (CM)</label>
                <input id="m-thighs" type="number" step="0.5" placeholder="58"
                  class="w-full bg-zinc-800 rounded-xl p-3 text-white font-mono font-bold text-sm outline-none border border-zinc-700" />
              </div>
            </div>
          </div>

          <button data-a="save-measurements" class="w-full py-4 text-sm font-black uppercase tracking-widest text-white accent-bg rounded-xl">
            SAVE METRICS
          </button>
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------
  // MODAL: SETTINGS & SMART CONTEXT MODES
  // -------------------------------------------------------
  function renderSettingsModal() {
    const s = state.settings;

    return `
      <div class="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex flex-col justify-end">
        <div class="bg-zinc-900 border-t border-zinc-800 p-5 rounded-t-3xl max-h-[85vh] flex flex-col space-y-4">
          <div class="flex justify-between items-center pb-2 border-b border-zinc-800">
            <h3 class="font-black text-base uppercase tracking-tight text-white">APP SETTINGS</h3>
            <button data-a="close-settings" class="text-xs font-bold text-zinc-400 hover:text-white px-3 py-1.5 bg-zinc-800 rounded-lg">CLOSE</button>
          </div>

          <div class="space-y-4">
            <!-- Smart Context Modes for PREVIOUS column -->
            <div class="bg-black/50 p-3.5 rounded-xl border border-zinc-800 space-y-2">
              <span class="text-xs font-black uppercase tracking-wider text-blue-400 block">PREVIOUS COLUMN CONTEXT MODE</span>
              <p class="text-[10px] text-zinc-400 leading-relaxed">Choose how BURN looks up your past sets and weights when showing the inline PREVIOUS column:</p>

              <div class="space-y-2 pt-1">
                <label class="flex items-start gap-2.5 cursor-pointer">
                  <input type="radio" name="contextMode" value="GLOBAL" ${s.contextMode === "GLOBAL" ? "checked" : ""} class="mt-1 accent-blue-500" />
                  <div>
                    <span class="text-xs font-bold text-white block">All Workouts (Global)</span>
                    <span class="text-[10px] text-zinc-500 block">Pulls your latest performed numbers for that exercise regardless of routine.</span>
                  </div>
                </label>

                <label class="flex items-start gap-2.5 cursor-pointer">
                  <input type="radio" name="contextMode" value="SAME_ROUTINE" ${s.contextMode === "SAME_ROUTINE" ? "checked" : ""} class="mt-1 accent-blue-500" />
                  <div>
                    <span class="text-xs font-bold text-white block">Same Routine Only</span>
                    <span class="text-[10px] text-zinc-500 block">Pulls numbers strictly from the last time you completed this exact routine split.</span>
                  </div>
                </label>
              </div>
            </div>

            <!-- Default Rest Timer -->
            <div>
              <label class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Default Rest Timer Duration</label>
              <select id="setting-rest-timer" class="w-full bg-zinc-800 rounded-xl p-3 text-white text-xs font-bold outline-none border border-zinc-700">
                <option value="60" ${s.defaultRestSeconds === 60 ? "selected" : ""}>60 seconds (1 min)</option>
                <option value="90" ${s.defaultRestSeconds === 90 ? "selected" : ""}>90 seconds (1.5 min)</option>
                <option value="120" ${s.defaultRestSeconds === 120 ? "selected" : ""}>120 seconds (2 mins)</option>
                <option value="180" ${s.defaultRestSeconds === 180 ? "selected" : ""}>180 seconds (3 mins - Heavy Compound)</option>
              </select>
            </div>
          </div>

          <button data-a="save-app-settings" class="w-full py-4 text-sm font-black uppercase tracking-widest text-white accent-bg rounded-xl">
            SAVE SETTINGS
          </button>
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------
  // MODAL: WORKOUT SUMMARY (NO CALORIES, DETAILED EXERCISES)
  // -------------------------------------------------------
  function renderSummaryModal() {
    const s = state.summaryModal.session;
    if (!s) return "";

    return `
      <div class="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col justify-end">
        <div class="bg-zinc-900 border-t border-zinc-800 p-5 rounded-t-3xl max-h-[88vh] flex flex-col space-y-4">
          <div class="flex justify-between items-start border-b border-zinc-800 pb-2">
            <div>
              <span class="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">SESSION COMPLETED</span>
              <h3 class="font-black text-xl uppercase tracking-tight text-white">${escapeHtml(s.routineName)}</h3>
            </div>
            <button data-a="close-summary" class="text-xs font-bold text-zinc-400 hover:text-white px-3 py-1.5 bg-zinc-800 rounded-lg">DONE</button>
          </div>

          <div class="overflow-y-auto space-y-4 pr-1">
            <!-- Core Workload Metrics (No Calorie Counter!) -->
            <div class="grid grid-cols-3 gap-2 bg-black/60 p-3.5 rounded-2xl border border-zinc-800 text-center">
              <div>
                <span class="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block">TOTAL VOLUME</span>
                <span class="text-lg font-black text-blue-400 font-mono">${s.totalVolumeKg ? `${s.totalVolumeKg.toLocaleString()} kg` : "—"}</span>
              </div>
              <div>
                <span class="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block">SETS LOGGED</span>
                <span class="text-lg font-black text-white font-mono">${s.totalSets || 0}</span>
              </div>
              <div>
                <span class="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block">DURATION</span>
                <span class="text-lg font-black text-emerald-400 font-mono">${s.duration} min</span>
              </div>
            </div>

            <!-- Targeted Muscles Involved -->
            <div class="space-y-1.5">
              <span class="text-xs font-black uppercase text-zinc-400 block">TARGETED MUSCLE GROUPS</span>
              <div class="flex flex-wrap gap-1.5">
                ${(s.targetedMuscles || []).map(m => `
                  <span class="text-[10px] font-bold bg-zinc-800 border border-zinc-700 text-zinc-200 px-2.5 py-1 rounded-lg">${escapeHtml(m)}</span>
                `).join("")}
              </div>
            </div>

            <!-- Full Exercise Breakdown with Names, Reps & Weights -->
            <div class="space-y-2">
              <span class="text-xs font-black uppercase text-zinc-400 block">EXERCISES & COMPLETED SETS</span>
              <div class="space-y-2">
                ${(s.exercises || []).map(ex => {
                  const completed = (ex.sets || []).filter(st => st.completed || st.reps > 0);
                  return `
                    <div class="bg-black/50 border border-zinc-800/80 p-3 rounded-xl space-y-1.5">
                      <div class="flex justify-between items-center">
                        <span class="font-black text-xs text-white uppercase">${escapeHtml(ex.name)}</span>
                        <span class="text-[9px] font-bold text-blue-400 uppercase">${escapeHtml(ex.category)}</span>
                      </div>
                      <div class="grid grid-cols-2 sm:grid-cols-3 gap-1 text-[10px] font-mono">
                        ${completed.map((st, idx) => `
                          <div class="bg-zinc-900 px-2 py-1 rounded border border-zinc-800 flex justify-between text-zinc-300">
                            <span>Set ${st.setNum || (idx + 1)}:</span>
                            <span class="font-bold text-white">${st.weight}kg × ${st.reps}</span>
                          </div>
                        `).join("")}
                      </div>
                      ${ex.note ? `<p class="text-[10px] text-zinc-400 italic">"${escapeHtml(ex.note)}"</p>` : ""}
                    </div>
                  `;
                }).join("")}
              </div>
            </div>

            <!-- Dynamic Biomechanical Analysis -->
            <div class="space-y-1.5">
              <span class="text-xs font-black uppercase text-zinc-400 block">BIOMECHANICAL PERFORMANCE ANALYSIS</span>
              <div class="text-xs text-zinc-300 bg-black/40 p-3.5 rounded-xl border border-zinc-800 leading-relaxed font-normal">
                ${escapeHtml(s.detailedSummary)}
              </div>
            </div>

            <!-- 48-Hour Recovery Guidelines -->
            <div class="space-y-1.5">
              <span class="text-xs font-black uppercase text-zinc-400 block">48-HOUR RECOVERY PROTOCOL</span>
              <ul class="space-y-1.5 bg-black/40 p-3 rounded-xl border border-zinc-800 text-xs text-zinc-300">
                ${(s.recoveryNext48Hours || []).map(r => `
                  <li class="flex items-start gap-1.5">
                    <span class="text-blue-400 font-bold">•</span>
                    <span>${escapeHtml(r)}</span>
                  </li>
                `).join("")}
              </ul>
            </div>
          </div>

          <button data-a="close-summary" class="w-full py-4 text-sm font-black uppercase tracking-widest text-white accent-bg rounded-xl">
            RETURN TO DASHBOARD
          </button>
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------
  // MODAL: 30-DAY HISTORY DETAIL
  // -------------------------------------------------------
  function renderHistoryDetailModal(entry) {
    return `
      <div class="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col justify-end">
        <div class="bg-zinc-900 border-t border-zinc-800 p-5 rounded-t-3xl max-h-[88vh] flex flex-col space-y-4">
          <div class="flex justify-between items-start border-b border-zinc-800 pb-2">
            <div>
              <span class="text-[10px] font-mono text-blue-400">${entry.dateKey}</span>
              <h3 class="font-black text-lg uppercase tracking-tight text-white">${escapeHtml(entry.routineName)}</h3>
            </div>
            <button data-a="close-history-detail" class="text-xs font-bold text-zinc-400 hover:text-white px-3 py-1.5 bg-zinc-800 rounded-lg">CLOSE</button>
          </div>

          <div class="overflow-y-auto space-y-4 pr-1">
            <!-- Stats Bar -->
            <div class="grid grid-cols-3 gap-2 bg-black/60 p-3 rounded-xl border border-zinc-800 text-center">
              <div>
                <span class="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block">VOLUME</span>
                <span class="text-base font-black text-blue-400 font-mono">${entry.totalVolumeKg ? `${entry.totalVolumeKg.toLocaleString()} kg` : "—"}</span>
              </div>
              <div>
                <span class="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block">SETS</span>
                <span class="text-base font-black text-white font-mono">${entry.totalSets || 0}</span>
              </div>
              <div>
                <span class="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block">DURATION</span>
                <span class="text-base font-black text-emerald-400 font-mono">${entry.duration} min</span>
              </div>
            </div>

            <!-- Full Exercise Details List -->
            <div class="space-y-2">
              <span class="text-xs font-black uppercase text-zinc-400 block">EXERCISES COMPLETED</span>
              <div class="space-y-2">
                ${(entry.exercises || []).map(ex => {
                  const completed = (ex.sets || []).filter(st => st.completed || st.reps > 0);
                  return `
                    <div class="bg-black/50 border border-zinc-800 p-3 rounded-xl space-y-1.5">
                      <div class="flex justify-between items-center">
                        <span class="font-black text-xs text-white uppercase">${escapeHtml(ex.name)}</span>
                        <span class="text-[9px] font-bold text-blue-400 uppercase">${escapeHtml(ex.category)}</span>
                      </div>
                      <div class="flex flex-wrap gap-1 text-[10px] font-mono">
                        ${completed.map((st, idx) => `
                          <span class="bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-300">
                            Set ${st.setNum || (idx + 1)}: <strong class="text-white">${st.weight}kg × ${st.reps}</strong>
                          </span>
                        `).join("")}
                      </div>
                      ${ex.note ? `<p class="text-[10px] text-zinc-400 italic">"${escapeHtml(ex.note)}"</p>` : ""}
                    </div>
                  `;
                }).join("")}
              </div>
            </div>

            <!-- Detailed Summary -->
            <div class="space-y-1.5">
              <span class="text-xs font-black uppercase text-zinc-400 block">PERFORMANCE SUMMARY</span>
              <div class="text-xs text-zinc-300 bg-black/40 p-3.5 rounded-xl border border-zinc-800 leading-relaxed">
                ${escapeHtml(entry.detailedSummary)}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------
  // EVENT DELEGATION
  // -------------------------------------------------------
  let eventsBound = false;
  function bindEvents() {
    if (eventsBound) return;
    eventsBound = true;

    // Click Delegation
    document.addEventListener("click", (e) => {
      const el = e.target.closest("[data-a]");
      if (!el) return;
      const a = el.getAttribute("data-a");

      // Tabs
      if (a === "switch-tab") {
        state.currentTab = el.getAttribute("data-tab");
        render();
        return;
      }

      // Start Workout
      if (a === "start-routine") {
        const rId = el.getAttribute("data-id");
        const routine = window.BURN_STORAGE.getRoutines().find(r => r.id === rId);
        if (routine) {
          startWorkoutFromRoutine(routine);
        }
        return;
      }

      // Finish Workout
      if (a === "finish-workout") {
        finishActiveWorkout();
        return;
      }

      // Cancel Workout
      if (a === "cancel-workout") {
        if (confirm("Discard current active workout?")) {
          state.activeWorkout = null;
          window.BURN_TIMER.stop();
          render();
        }
        return;
      }

      // Complete Set (Tick button) -> Triggers Rest Timer!
      if (a === "toggle-complete-set") {
        const exIdx = Number(el.getAttribute("data-exidx"));
        const setIdx = Number(el.getAttribute("data-setidx"));
        const set = state.activeWorkout?.exercises?.[exIdx]?.sets?.[setIdx];
        if (set) {
          set.completed = !set.completed;
          if (set.completed) {
            // Check if PR
            const exName = state.activeWorkout.exercises[exIdx].name;
            const isPR = window.BURN_STORAGE.checkIfSetIsPR(exName, set.weight, set.reps);
            set.isPR = isPR;

            // Start Automated Rest Timer!
            const restSeconds = state.activeWorkout.exercises[exIdx].restTimerSeconds || state.settings.defaultRestSeconds || 90;
            window.BURN_TIMER.start(restSeconds);
          }
          render();
        }
        return;
      }

      // Cycle Set Type (Normal -> Warmup -> Drop -> Failure -> Normal)
      if (a === "cycle-set-type") {
        const exIdx = Number(el.getAttribute("data-exidx"));
        const setIdx = Number(el.getAttribute("data-setidx"));
        const set = state.activeWorkout?.exercises?.[exIdx]?.sets?.[setIdx];
        if (set) {
          const types = ["NORMAL", "WARMUP", "DROP", "FAILURE"];
          const currentIdx = types.indexOf(set.type || "NORMAL");
          set.type = types[(currentIdx + 1) % types.length];
          render();
        }
        return;
      }

      // One-Tap Quick Autofill from PREVIOUS column!
      if (a === "autofill-previous") {
        const exIdx = Number(el.getAttribute("data-exidx"));
        const setIdx = Number(el.getAttribute("data-setidx"));
        const ex = state.activeWorkout?.exercises?.[exIdx];
        const prevSet = ex?.previous?.sets?.[setIdx];
        if (ex && prevSet) {
          ex.sets[setIdx].weight = prevSet.weight;
          ex.sets[setIdx].reps = prevSet.reps;
          render();
        }
        return;
      }

      // Add Set
      if (a === "add-set") {
        const exIdx = Number(el.getAttribute("data-exidx"));
        const ex = state.activeWorkout?.exercises?.[exIdx];
        if (ex) {
          const prevSet = ex.sets[ex.sets.length - 1];
          ex.sets.push({
            id: `s_${Date.now()}_${ex.sets.length + 1}`,
            setNum: ex.sets.length + 1,
            type: "NORMAL",
            weight: prevSet?.weight || "",
            reps: prevSet?.reps || "",
            completed: false,
            isPR: false
          });
          render();
        }
        return;
      }

      // Remove Exercise from Live Workout
      if (a === "remove-exercise") {
        const exIdx = Number(el.getAttribute("data-exidx"));
        if (state.activeWorkout) {
          state.activeWorkout.exercises.splice(exIdx, 1);
          render();
        }
        return;
      }

      // Rest Timer Controls
      if (a === "timer-minus") {
        window.BURN_TIMER.addSeconds(-15);
        return;
      }
      if (a === "timer-plus") {
        window.BURN_TIMER.addSeconds(15);
        return;
      }
      if (a === "timer-skip") {
        window.BURN_TIMER.stop();
        window.BURN_TIMER.updateUI();
        return;
      }

      // Plate Calculator
      if (a === "open-plate-calc") {
        state.plateModal.open = true;
        render();
        return;
      }
      if (a === "close-plate-calc") {
        state.plateModal.open = false;
        render();
        return;
      }
      if (a === "calc-plates-for-ex") {
        const exIdx = Number(el.getAttribute("data-exidx"));
        const ex = state.activeWorkout?.exercises?.[exIdx];
        const maxSetWeight = ex?.sets?.reduce((max, s) => Math.max(max, Number(s.weight) || 0), 0) || 60;
        state.plateModal.targetWeight = maxSetWeight || 60;
        state.plateModal.open = true;
        render();
        return;
      }

      // Exercise History / Detail Modal
      if (a === "open-ex-history") {
        const name = el.getAttribute("data-name");
        state.exerciseDetailModal.exerciseName = name;
        state.exerciseDetailModal.activeMetric = "MAX_WEIGHT";
        state.exerciseDetailModal.open = true;
        render();
        return;
      }
      if (a === "close-ex-history") {
        state.exerciseDetailModal.open = false;
        render();
        return;
      }
      if (a === "switch-chart-metric") {
        state.exerciseDetailModal.activeMetric = el.getAttribute("data-metric");
        render();
        return;
      }

      // Routine Editor
      if (a === "open-new-routine") {
        state.routineEditorModal = {
          open: true,
          isNew: true,
          routine: { id: `routine_${Date.now()}`, name: "New Routine", split: "CUSTOM", exercises: [] }
        };
        render();
        return;
      }
      if (a === "edit-routine") {
        const rId = el.getAttribute("data-id");
        const r = window.BURN_STORAGE.getRoutines().find(x => x.id === rId);
        if (r) {
          state.routineEditorModal = {
            open: true,
            isNew: false,
            routine: JSON.parse(JSON.stringify(r))
          };
          render();
        }
        return;
      }
      if (a === "close-routine-editor") {
        state.routineEditorModal.open = false;
        render();
        return;
      }
      if (a === "routine-remove-ex") {
        const idx = Number(el.getAttribute("data-idx"));
        state.routineEditorModal.routine.exercises.splice(idx, 1);
        render();
        return;
      }
      if (a === "save-routine") {
        const name = (root.querySelector("#edit-routine-name")?.value || "").trim() || "Custom Routine";
        state.routineEditorModal.routine.name = name;
        window.BURN_STORAGE.saveRoutine(state.routineEditorModal.routine);
        state.routineEditorModal.open = false;
        render();
        return;
      }
      if (a === "delete-routine") {
        const rId = el.getAttribute("data-id");
        if (confirm("Delete this routine?")) {
          window.BURN_STORAGE.deleteRoutine(rId);
          render();
        }
        return;
      }

      // Add Exercise Modal
      if (a === "open-add-ex-workout") {
        state.addExerciseModal = { open: true, search: "", targetType: "WORKOUT" };
        render();
        return;
      }
      if (a === "open-add-ex-routine") {
        state.addExerciseModal = { open: true, search: "", targetType: "ROUTINE" };
        render();
        return;
      }
      if (a === "close-add-ex-modal") {
        state.addExerciseModal.open = false;
        render();
        return;
      }
      if (a === "select-add-exercise") {
        const name = el.getAttribute("data-name");
        if (state.addExerciseModal.targetType === "WORKOUT" && state.activeWorkout) {
          const dbEx = window.BURN_STORAGE.getAllExercises().find(e => e.name.toUpperCase() === name.toUpperCase());
          const previousData = window.BURN_STORAGE.getPreviousSetsForExercise(name, state.activeWorkout.routineId);
          state.activeWorkout.exercises.push({
            name,
            category: dbEx?.category || "STRENGTH",
            trackingType: dbEx?.trackingType || "WEIGHT_REPS",
            note: "",
            restTimerSeconds: 90,
            sets: [
              { id: `s_${Date.now()}_1`, setNum: 1, type: "NORMAL", weight: "", reps: "", completed: false, isPR: false },
              { id: `s_${Date.now()}_2`, setNum: 2, type: "NORMAL", weight: "", reps: "", completed: false, isPR: false },
              { id: `s_${Date.now()}_3`, setNum: 3, type: "NORMAL", weight: "", reps: "", completed: false, isPR: false }
            ],
            previous: previousData
          });
        } else if (state.addExerciseModal.targetType === "ROUTINE" && state.routineEditorModal.routine) {
          if (!state.routineEditorModal.routine.exercises.includes(name)) {
            state.routineEditorModal.routine.exercises.push(name);
          }
        }
        state.addExerciseModal.open = false;
        render();
        return;
      }

      // Custom Exercise Creation
      if (a === "open-custom-ex") {
        state.customExerciseModal.open = true;
        render();
        return;
      }
      if (a === "close-custom-ex") {
        state.customExerciseModal.open = false;
        render();
        return;
      }
      if (a === "save-custom-ex") {
        const name = (root.querySelector("#custom-ex-name")?.value || "").trim();
        const category = root.querySelector("#custom-ex-cat")?.value || "CHEST";
        const trackingType = root.querySelector("#custom-ex-type")?.value || "WEIGHT_REPS";
        const instructions = (root.querySelector("#custom-ex-notes")?.value || "").trim();

        if (!name) {
          alert("Please enter an exercise name");
          return;
        }

        window.BURN_STORAGE.saveCustomExercise({
          name,
          category,
          primary: category,
          trackingType,
          instructions
        });

        state.customExerciseModal.open = false;
        render();
        return;
      }

      // Measurement Modal
      if (a === "open-measure-modal") {
        state.measurementModal.open = true;
        render();
        return;
      }
      if (a === "close-measure-modal") {
        state.measurementModal.open = false;
        render();
        return;
      }
      if (a === "save-measurements") {
        const weightKg = root.querySelector("#m-weight")?.value || "";
        const bodyFat = root.querySelector("#m-fat")?.value || "";
        const chestCm = root.querySelector("#m-chest")?.value || "";
        const waistCm = root.querySelector("#m-waist")?.value || "";
        const armsCm = root.querySelector("#m-arms")?.value || "";
        const thighsCm = root.querySelector("#m-thighs")?.value || "";

        window.BURN_STORAGE.addMeasurement({
          weightKg,
          bodyFat,
          chestCm,
          waistCm,
          armsCm,
          thighsCm
        });

        state.measurementModal.open = false;
        render();
        return;
      }

      // Settings Modal
      if (a === "open-settings") {
        state.settingsModal.open = true;
        render();
        return;
      }
      if (a === "close-settings") {
        state.settingsModal.open = false;
        render();
        return;
      }
      if (a === "save-app-settings") {
        const modeEl = root.querySelector('input[name="contextMode"]:checked');
        const restEl = root.querySelector("#setting-rest-timer");
        state.settings.contextMode = modeEl ? modeEl.value : "GLOBAL";
        state.settings.defaultRestSeconds = Number(restEl?.value) || 90;
        window.BURN_STORAGE.saveSettings(state.settings);
        state.settingsModal.open = false;
        render();
        return;
      }

      // Summary & History Detail Modals
      if (a === "close-summary") {
        state.summaryModal.open = false;
        state.currentTab = "HISTORY";
        render();
        return;
      }
      if (a === "view-history-detail") {
        const id = el.getAttribute("data-id");
        const session = window.BURN_STORAGE.getPast30DaysSessions().find(x => x.id === id);
        if (session) {
          state.viewingHistoryDetail = session;
          render();
        }
        return;
      }
      if (a === "close-history-detail") {
        state.viewingHistoryDetail = null;
        render();
        return;
      }
    });

    // Input Delegation
    document.addEventListener("input", (e) => {
      const target = e.target;
      const a = target.getAttribute("data-a");

      if (a === "set-weight") {
        const exIdx = Number(target.getAttribute("data-exidx"));
        const setIdx = Number(target.getAttribute("data-setidx"));
        const set = state.activeWorkout?.exercises?.[exIdx]?.sets?.[setIdx];
        if (set) {
          set.weight = target.value;
        }
        return;
      }

      if (a === "set-reps") {
        const exIdx = Number(target.getAttribute("data-exidx"));
        const setIdx = Number(target.getAttribute("data-setidx"));
        const set = state.activeWorkout?.exercises?.[exIdx]?.sets?.[setIdx];
        if (set) {
          set.reps = target.value;
        }
        return;
      }

      if (a === "exercise-note") {
        const exIdx = Number(target.getAttribute("data-exidx"));
        const ex = state.activeWorkout?.exercises?.[exIdx];
        if (ex) {
          ex.note = target.value;
        }
        return;
      }

      if (target.id === "plate-target-input") {
        state.plateModal.targetWeight = Number(target.value) || 0;
        render();
        return;
      }

      if (target.id === "add-modal-search") {
        state.addExerciseModal.search = target.value;
        render();
        return;
      }

      if (target.id === "lib-search") {
        const q = target.value.toUpperCase().trim();
        const all = window.BURN_STORAGE.getAllExercises();
        const filtered = all.filter(ex => ex.name.toUpperCase().includes(q));
        const listEl = document.getElementById("lib-list");
        if (listEl) {
          listEl.innerHTML = filtered.map(ex => `
            <button data-a="open-ex-history" data-name="${escapeAttr(ex.name)}"
              class="w-full text-left bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800/80 p-3 rounded-xl flex items-center justify-between transition group">
              <div class="min-w-0 pr-2">
                <h4 class="font-bold text-sm text-white tracking-tight group-hover:text-blue-400 transition truncate">${escapeHtml(ex.name)}</h4>
                <span class="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">${escapeHtml(ex.category)} • ${escapeHtml(ex.primary || "Strength")}</span>
              </div>
              <svg class="w-4 h-4 text-zinc-600 group-hover:text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
          `).join("");
        }
        return;
      }
    });

    // Change Delegation
    document.addEventListener("change", (e) => {
      const target = e.target;
      if (target.id === "plate-bar-select") {
        state.plateModal.barWeight = Number(target.value) || 20;
        render();
      }
    });
  }

  // Initial startup render
  render();

})();
