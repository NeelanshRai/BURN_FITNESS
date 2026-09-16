// =========================================================
// BURN - Storage & Local State Management Engine
// =========================================================
(function() {
  "use strict";

  const STORAGE_KEYS = {
    PROFILE: "burn_user_profile",
    CUSTOM_EXERCISES: "burn_custom_exercises",
    ROUTINES: "burn_user_routines",
    HISTORY: "burn_workout_history_v3",
    MEASUREMENTS: "burn_body_measurements",
    SETTINGS: "burn_user_settings",
    PRS: "burn_personal_records"
  };

  window.BURN_STORAGE = {
    // Settings
    getSettings() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (raw) return JSON.parse(raw);
      } catch(e) {}
      return {
        contextMode: "GLOBAL", // "SAME_ROUTINE" or "GLOBAL"
        defaultRestSeconds: 90,
        soundEnabled: true,
        barWeightKg: 20
      };
    },

    saveSettings(settings) {
      try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      } catch(e) {}
    },

    // Profile
    getProfile() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
        if (raw) return JSON.parse(raw);
      } catch(e) {}
      return { name: "ATHLETE", height: 175, dob: "2000-01-01" };
    },

    saveProfile(profile) {
      try {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
      } catch(e) {}
    },

    // Custom Exercises
    getCustomExercises() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_EXERCISES);
        if (raw) return JSON.parse(raw);
      } catch(e) {}
      return [];
    },

    saveCustomExercise(exercise) {
      const list = this.getCustomExercises();
      const existingIdx = list.findIndex(e => e.name.toUpperCase() === exercise.name.toUpperCase());
      if (existingIdx >= 0) {
        list[existingIdx] = exercise;
      } else {
        list.push(exercise);
      }
      try {
        localStorage.setItem(STORAGE_KEYS.CUSTOM_EXERCISES, JSON.stringify(list));
      } catch(e) {}
      return list;
    },

    // All available exercises (Built-in + Custom)
    getAllExercises() {
      const builtIn = (window.BURN_DB && window.BURN_DB.EXERCISES) ? window.BURN_DB.EXERCISES : [];
      const custom = this.getCustomExercises();
      const combined = [...builtIn];
      custom.forEach(c => {
        if (!combined.some(b => b.name.toUpperCase() === c.name.toUpperCase())) {
          combined.push(c);
        }
      });
      return combined.sort((a, b) => a.name.localeCompare(b.name));
    },

    // Routines (Custom + Defaults)
    getRoutines() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.ROUTINES);
        if (raw) {
          const list = JSON.parse(raw);
          if (Array.isArray(list) && list.length > 0) return list;
        }
      } catch(e) {}
      return window.BURN_DB?.DEFAULT_ROUTINES || [];
    },

    saveRoutine(routine) {
      const list = this.getRoutines();
      const idx = list.findIndex(r => r.id === routine.id);
      if (idx >= 0) {
        list[idx] = routine;
      } else {
        list.push(routine);
      }
      try {
        localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(list));
      } catch(e) {}
      return list;
    },

    deleteRoutine(routineId) {
      let list = this.getRoutines();
      list = list.filter(r => r.id !== routineId);
      try {
        localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(list));
      } catch(e) {}
      return list;
    },

    // 30-Day Workout History
    getHistoryMap() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
        if (raw) return JSON.parse(raw);
      } catch(e) {}
      return {};
    },

    saveHistoryMap(map) {
      try {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(map));
      } catch(e) {}
    },

    prune30DayHistory() {
      const map = this.getHistoryMap();
      const cutoff = Date.now() - (30 * 24 * 60 * 60 * 1000);
      let modified = false;

      for (const [key, session] of Object.entries(map)) {
        if (session.timestamp && session.timestamp < cutoff) {
          delete map[key];
          modified = true;
        }
      }
      if (modified) this.saveHistoryMap(map);
      return map;
    },

    saveWorkoutSession(sessionData) {
      const map = this.prune30DayHistory();
      const key = sessionData.id || `${sessionData.dateKey}_${Date.now()}`;
      map[key] = {
        id: key,
        timestamp: Date.now(),
        dateKey: sessionData.dateKey,
        routineId: sessionData.routineId || "custom",
        routineName: sessionData.routineName || "Workout Session",
        userWeight: sessionData.userWeight || 70,
        duration: sessionData.duration || 0,
        totalVolumeKg: sessionData.totalVolumeKg || 0,
        totalSets: sessionData.totalSets || 0,
        totalReps: sessionData.totalReps || 0,
        prsCount: sessionData.prsCount || 0,
        targetedMuscles: sessionData.targetedMuscles || [],
        exercises: sessionData.exercises || [],
        recoveryNext48Hours: sessionData.recoveryNext48Hours || [],
        detailedSummary: sessionData.detailedSummary || ""
      };
      this.saveHistoryMap(map);
      this.updatePRsFromSession(sessionData);
      return map[key];
    },

    getPast30DaysSessions() {
      const map = this.prune30DayHistory();
      return Object.values(map).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    },

    // Personal Records (PRs)
    getPRMap() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.PRS);
        if (raw) return JSON.parse(raw);
      } catch(e) {}
      return {};
    },

    savePRMap(prs) {
      try {
        localStorage.setItem(STORAGE_KEYS.PRS, JSON.stringify(prs));
      } catch(e) {}
    },

    updatePRsFromSession(session) {
      const prs = this.getPRMap();
      let changed = false;

      (session.exercises || []).forEach(ex => {
        const exName = ex.name.toUpperCase();
        if (!prs[exName]) {
          prs[exName] = { maxWeight: 0, max1RM: 0, maxVolume: 0, bestReps: 0, date: session.dateKey };
        }
        const currentPR = prs[exName];

        let exerciseVolume = 0;
        (ex.sets || []).forEach(set => {
          if (!set.completed) return;
          const wt = Number(set.weight) || 0;
          const reps = Number(set.reps) || 0;
          exerciseVolume += (wt * reps);

          if (wt > currentPR.maxWeight) {
            currentPR.maxWeight = wt;
            currentPR.date = session.dateKey;
            changed = true;
          }
          if (reps > currentPR.bestReps) {
            currentPR.bestReps = reps;
            changed = true;
          }
          const estimated1RM = wt > 0 && reps > 0 ? Math.round(wt * (1 + reps / 30)) : wt;
          if (estimated1RM > currentPR.max1RM) {
            currentPR.max1RM = estimated1RM;
            changed = true;
          }
        });

        if (exerciseVolume > currentPR.maxVolume) {
          currentPR.maxVolume = exerciseVolume;
          changed = true;
        }
      });

      if (changed) {
        this.savePRMap(prs);
      }
    },

    // Check if a specific set is a PR
    checkIfSetIsPR(exerciseName, weight, reps) {
      const wt = Number(weight) || 0;
      const rp = Number(reps) || 0;
      if (wt <= 0 || rp <= 0) return false;

      const prs = this.getPRMap();
      const currentPR = prs[exerciseName.toUpperCase()];
      if (!currentPR || currentPR.maxWeight === 0) return true; // First recorded set

      const estimated1RM = Math.round(wt * (1 + rp / 30));
      return (wt > currentPR.maxWeight) || (estimated1RM > currentPR.max1RM);
    },

    // Inline "PREVIOUS" Column Data Fetcher
    // Supports Smart Context Modes: "SAME_ROUTINE" or "GLOBAL"
    getPreviousSetsForExercise(exerciseName, currentRoutineId) {
      const settings = this.getSettings();
      const historyList = this.getPast30DaysSessions();
      const targetName = exerciseName.toUpperCase();

      for (const session of historyList) {
        // Filter by routine if contextMode is SAME_ROUTINE
        if (settings.contextMode === "SAME_ROUTINE" && currentRoutineId && session.routineId !== currentRoutineId) {
          continue;
        }

        const foundEx = (session.exercises || []).find(e => e.name.toUpperCase() === targetName);
        if (foundEx && foundEx.sets && foundEx.sets.length > 0) {
          const completedSets = foundEx.sets.filter(s => s.completed || s.reps > 0 || s.weight > 0);
          if (completedSets.length > 0) {
            return {
              dateKey: session.dateKey,
              routineName: session.routineName,
              sets: completedSets
            };
          }
        }
      }
      return null;
    },

    // Chronological Exercise History for Modal
    getHistoryForExercise(exerciseName) {
      const historyList = this.getPast30DaysSessions();
      const targetName = exerciseName.toUpperCase();
      const logs = [];

      historyList.forEach(session => {
        const foundEx = (session.exercises || []).find(e => e.name.toUpperCase() === targetName);
        if (foundEx && foundEx.sets) {
          const validSets = foundEx.sets.filter(s => s.completed || s.weight > 0 || s.reps > 0);
          if (validSets.length > 0) {
            let volume = 0;
            let maxWeight = 0;
            let max1RM = 0;
            validSets.forEach(s => {
              const w = Number(s.weight) || 0;
              const r = Number(s.reps) || 0;
              volume += (w * r);
              if (w > maxWeight) maxWeight = w;
              const rm = Math.round(w * (1 + r / 30));
              if (rm > max1RM) max1RM = rm;
            });

            logs.push({
              dateKey: session.dateKey,
              routineName: session.routineName,
              sets: validSets,
              note: foundEx.note || "",
              volume,
              maxWeight,
              max1RM
            });
          }
        }
      });
      return logs;
    },

    // Body Measurements
    getMeasurements() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.MEASUREMENTS);
        if (raw) return JSON.parse(raw);
      } catch(e) {}
      return [];
    },

    addMeasurement(entry) {
      const list = this.getMeasurements();
      list.unshift({
        id: `m_${Date.now()}`,
        timestamp: Date.now(),
        date: entry.date || new Date().toISOString().split("T")[0],
        weightKg: Number(entry.weightKg) || 0,
        bodyFat: Number(entry.bodyFat) || 0,
        chestCm: Number(entry.chestCm) || 0,
        waistCm: Number(entry.waistCm) || 0,
        armsCm: Number(entry.armsCm) || 0,
        thighsCm: Number(entry.thighsCm) || 0
      });
      try {
        localStorage.setItem(STORAGE_KEYS.MEASUREMENTS, JSON.stringify(list));
      } catch(e) {}
      return list;
    }
  };
})();
