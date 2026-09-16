// =========================================================
// BURN - 1RM & Barbell Plate Calculator Engine
// =========================================================
(function() {
  "use strict";

  window.BURN_CALC = {
    // 1RM Calculation Formulas
    // Epley: w * (1 + r / 30)
    // Brzycki: w * (36 / (37 - r))
    calculate1RM(weight, reps) {
      const w = Number(weight) || 0;
      const r = Number(reps) || 0;
      if (w <= 0 || r <= 0) return 0;
      if (r === 1) return Math.round(w);

      // Safe clamp for reps <= 30
      const epley = w * (1 + r / 30);
      return Math.round(epley);
    },

    // Detailed percentage breakdown of estimated 1RM
    get1RMTable(oneRM) {
      const rm = Number(oneRM) || 0;
      if (rm <= 0) return [];
      const percentages = [
        { percent: 100, reps: 1 },
        { percent: 95, reps: 2 },
        { percent: 90, reps: 4 },
        { percent: 85, reps: 6 },
        { percent: 80, reps: 8 },
        { percent: 75, reps: 10 },
        { percent: 70, reps: 12 },
        { percent: 65, reps: 15 }
      ];
      return percentages.map(p => ({
        ...p,
        weight: Math.round(rm * (p.percent / 100) * 2) / 2 // rounded to nearest 0.5
      }));
    },

    // Standard Olympic Plates (in kg)
    STANDARD_PLATES: [25, 20, 15, 10, 5, 2.5, 1.25],

    // Color codes for standard Olympic plates
    PLATE_COLORS: {
      25: { bg: "#dc2626", text: "#ffffff", label: "25kg Red" },
      20: { bg: "#2563eb", text: "#ffffff", label: "20kg Blue" },
      15: { bg: "#eab308", text: "#000000", label: "15kg Yellow" },
      10: { bg: "#16a34a", text: "#ffffff", label: "10kg Green" },
      5: { bg: "#ffffff", text: "#000000", label: "5kg White" },
      2.5: { bg: "#000000", border: "#52525b", text: "#ffffff", label: "2.5kg Black" },
      1.25: { bg: "#71717a", text: "#ffffff", label: "1.25kg Chrome" }
    },

    // Calculate Barbell Plate Configuration
    // Target Weight, Bar Weight, Custom Available Plates
    calculatePlates(targetWeight, barWeight = 20, availablePlates = [25, 20, 15, 10, 5, 2.5, 1.25]) {
      const target = Number(targetWeight) || 0;
      const bar = Number(barWeight) || 20;

      if (target <= bar) {
        return {
          target,
          bar,
          weightPerSide: 0,
          platesPerSide: [],
          totalAchieved: bar,
          remainder: 0
        };
      }

      const weightToLoad = target - bar;
      let perSideTarget = weightToLoad / 2;
      const sortedPlates = [...availablePlates].sort((a, b) => b - a);

      const platesPerSide = [];
      let currentRemainder = perSideTarget;

      for (const plate of sortedPlates) {
        while (currentRemainder >= plate - 0.001) {
          platesPerSide.push(plate);
          currentRemainder -= plate;
          currentRemainder = Math.round(currentRemainder * 1000) / 1000;
        }
      }

      const actualLoadedPerSide = platesPerSide.reduce((sum, p) => sum + p, 0);
      const totalAchieved = bar + (actualLoadedPerSide * 2);

      return {
        target,
        bar,
        weightPerSide: actualLoadedPerSide,
        platesPerSide,
        totalAchieved,
        remainder: Math.round((target - totalAchieved) * 10) / 10
      };
    }
  };
})();
