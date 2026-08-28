// =========================================================
// BURN - Metabolic & Progressive Performance Engine v4.0
// =========================================================

(function() {
  "use strict";

  const root = document.getElementById("root");
  if (!root) return;

  // -------------------------------------------------------
  // MASTER EXERCISE DATABASE
  // -------------------------------------------------------
  const MASTER_EXERCISE_LIST = [
    // Chest
    "Barbell Bench Press",
    "Dumbbell Bench Press",
    "Incline Barbell Bench Press",
    "Incline Dumbbell Bench Press",
    "Decline Barbell Bench Press",
    "Decline Dumbbell Bench Press",
    "Flat Dumbbell Fly",
    "Incline Dumbbell Fly",
    "Cable Fly",
    "Pec Deck Fly",
    "Machine Chest Press",
    "Smith Machine Bench Press",
    "Push-Up",
    "Wide Push-Up",
    "Diamond Push-Up",
    "Deficit Push-Up",

    // Back & Lats
    "Pull-Up",
    "Chin-Up",
    "Lat Pulldown",
    "Wide-Grip Lat Pulldown",
    "Close-Grip Lat Pulldown",
    "Barbell Bent-Over Row",
    "Pendlay Row",
    "Seated Cable Row",
    "Dumbbell Row",
    "Deadlift",
    "Romanian Deadlift",
    "Stiff-Leg Deadlift",
    "Back Extension",
    "Hyperextension",
    "Good Morning",
    "Barbell Shrug",
    "Dumbbell Shrug",

    // Shoulders
    "Overhead Barbell Press",
    "Standing Military Press",
    "Seated Barbell Press",
    "Dumbbell Shoulder Press",
    "Arnold Press",
    "Machine Shoulder Press",
    "Dumbbell Lateral Raise",
    "Cable Lateral Raise",
    "Front Raise",
    "Face Pull",
    "Rear Delt Fly",
    "Reverse Fly",
    "Incline Dumbbell Rear Delt Fly",
    "Machine Reverse Fly",
    "Cable Rear Delt Fly",

    // Biceps & Forearms
    "Barbell Curl",
    "EZ Bar Curl",
    "Dumbbell Curl",
    "Alternating Dumbbell Curl",
    "Hammer Curl",
    "Incline Dumbbell Curl",
    "Concentration Curl",
    "Preacher Curl",
    "Cable Curl",
    "Wrist Curl",
    "Reverse Wrist Curl",
    "Farmer's Carry",
    "Plate Pinch Hold",
    "Dead Hang",

    // Triceps
    "Close-Grip Bench Press",
    "Skull Crusher",
    "Overhead Dumbbell Extension",
    "Cable Pushdown",
    "Rope Pushdown",
    "Kickback",
    "Bench Dip",
    "Parallel Bar Dip",

    // Core & Abs
    "Crunch",
    "Sit-Up",
    "Decline Sit-Up",
    "Reverse Crunch",
    "Bicycle Crunch",
    "V-Up",
    "Plank",
    "Hollow Body Hold",
    "Dead Bug",
    "Hanging Leg Raise",
    "Hanging Knee Raise",
    "Side Crunch",
    "Cable Woodchopper",
    "Russian Twist",
    "Heel Tap",
    "Toe Taps",
    "Flutter Kicks",
    "Half Crunches",
    "Rope Crunch",
    "Dragon Flags",
    "Turkish Get-Up",
    "Superman",
    "Bird Dog",
    "Copenhagen Plank",

    // Legs & Glutes
    "Back Squat",
    "Front Squat",
    "Goblet Squat",
    "Leg Press",
    "Leg Extension",
    "Bulgarian Split Squat",
    "Walking Lunge",
    "Wall Sit",
    "Lying Leg Curl",
    "Seated Leg Curl",
    "Glute Ham Raise",
    "Standing Calf Raise",
    "Seated Calf Raise",
    "Single-Leg Calf Raise",
    "Tibialis Raise",
    "Wall Tibialis Raise",
    "Barbell Hip Thrust",
    "Dumbbell Hip Thrust",
    "Glute Bridge",
    "Clamshell",
    "Fire Hydrant",
    "Hip Abduction Machine",
    "Banded Side Walk",
    "Hip Adduction Machine",

    // Neck
    "Neck Flexion",
    "Neck Extension",

    // Conditioning & Calisthenics
    "Burpees",
    "Jump Squats",
    "Butt Kicks",
    "Murph",
    "Double Under",
    "10 m Sprint",
    "Beep Test",
    "Box Jump",
    "Vertical Jump",
    "High Knees",
    "Handstands",
    "One-Arm Balance",
    "Crow Pose",

    // Stretches & Recovery
    "Hamstring Stretch",
    "Cobra Stretch",
    "Child's Pose",
    "Mobility Protocol",
    "Walking",

    // Sports & Cardio
    "Football (Soccer)",
    "Basketball",
    "Badminton",
    "Volleyball",
    "Cricket",
    "Running",
    "Cycling",
    "Rowing Machine",
    "Elliptical",
    "Treadmill Walk",
    "Swimming",
    "Tennis",
    "Table Tennis",
    "Squash"
  ];

  const ALL_WORKOUTS = Array.from(new Set(MASTER_EXERCISE_LIST.map(e => e.trim().toUpperCase()))).sort((a,b) => a.localeCompare(b));

  const ABS_EXERCISES = [
    "LEG RAISE", "V-UP", "RUSSIAN TWIST", "HEEL TAP", "TOE TAP", "HOLLOW", "PLANK",
    "FLUTTER KICK", "CRUNCH", "DRAGON FLAG", "DEAD BUG", "WOODCHOPPER", "COPENHAGEN"
  ];

  // -------------------------------------------------------
  // 7-DAY WORKOUT SCHEDULE
  // -------------------------------------------------------
  const WEEKLY_SCHEDULE = [
    {
      dayNum: 1,
      dayName: "MONDAY",
      title: "DAY 1 - MONDAY",
      muscleGroup: "PULL DAY",
      exercises: [
        "PULL-UP",
        "BARBELL BENT-OVER ROW",
        "LAT PULLDOWN",
        "SEATED CABLE ROW",
        "DUMBBELL ROW",
        "DEADLIFT",
        "BARBELL CURL",
        "HAMMER CURL",
        "FACE PULL",
        "REAR DELT FLY",
        "DEAD HANG"
      ]
    },
    {
      dayNum: 2,
      dayName: "TUESDAY",
      title: "DAY 2 - TUESDAY",
      muscleGroup: "PUSH DAY",
      exercises: [
        "BARBELL BENCH PRESS",
        "INCLINE DUMBBELL BENCH PRESS",
        "OVERHEAD BARBELL PRESS",
        "DUMBBELL LATERAL RAISE",
        "PARALLEL BAR DIP",
        "CABLE PUSHDOWN",
        "ROPE PUSHDOWN",
        "HANGING LEG RAISE"
      ]
    },
    {
      dayNum: 3,
      dayName: "WEDNESDAY",
      title: "DAY 3 - WEDNESDAY",
      muscleGroup: "LEG DAY",
      exercises: [
        "BACK SQUAT",
        "ROMANIAN DEADLIFT",
        "LEG PRESS",
        "BULGARIAN SPLIT SQUAT",
        "WALKING LUNGE",
        "LYING LEG CURL",
        "STANDING CALF RAISE",
        "PLANK"
      ]
    },
    {
      dayNum: 4,
      dayName: "THURSDAY",
      title: "DAY 4 - THURSDAY",
      muscleGroup: "ARMS DAY",
      exercises: [
        "CLOSE-GRIP BENCH PRESS",
        "SKULL CRUSHER",
        "BARBELL CURL",
        "EZ BAR CURL",
        "INCLINE DUMBBELL CURL",
        "OVERHEAD DUMBBELL EXTENSION",
        "ROPE PUSHDOWN",
        "WRIST CURL",
        "REVERSE WRIST CURL"
      ]
    },
    {
      dayNum: 5,
      dayName: "FRIDAY",
      title: "DAY 5 - FRIDAY",
      muscleGroup: "CHEST AND BACK SPLIT",
      exercises: [
        "INCLINE BARBELL BENCH PRESS",
        "DUMBBELL BENCH PRESS",
        "FLAT DUMBBELL FLY",
        "PENDLAY ROW",
        "WIDE-GRIP LAT PULLDOWN",
        "PUSH-UP",
        "DRAGON FLAGS",
        "RUSSIAN TWIST"
      ]
    },
    {
      dayNum: 6,
      dayName: "SATURDAY",
      title: "DAY 6 - SATURDAY",
      muscleGroup: "SPORTS",
      exercises: [
        "FOOTBALL (SOCCER)",
        "BASKETBALL",
        "BADMINTON",
        "VOLLEYBALL",
        "RUNNING",
        "CYCLING",
        "10 M SPRINT",
        "BURPEES"
      ]
    },
    {
      dayNum: 7,
      dayName: "SUNDAY",
      title: "DAY 7 - SUNDAY",
      muscleGroup: "SPORTS / REST",
      exercises: [
        "TREADMILL WALK",
        "SWIMMING",
        "HAMSTRING STRETCH",
        "COBRA STRETCH",
        "CHILD'S POSE",
        "ROWING MACHINE",
        "CYCLING"
      ]
    }
  ];

  // -------------------------------------------------------
  // SPORT POSITIONS DEFINITIONS
  // -------------------------------------------------------
  const SPORT_CONFIGS = {
    "FOOTBALL": {
      name: "Football (Soccer)",
      positions: ["Midfielder", "Striker / Forward", "Winger", "Fullback / Wingback", "Center Back", "Goalkeeper"]
    },
    "BASKETBALL": {
      name: "Basketball",
      positions: ["Point Guard", "Shooting Guard", "Small Forward", "Power Forward", "Center"]
    },
    "VOLLEYBALL": {
      name: "Volleyball",
      positions: ["Outside Hitter / Spiker", "Middle Blocker", "Setter", "Libero / Defensive Specialist", "Opposite Hitter"]
    },
    "CRICKET": {
      name: "Cricket",
      positions: ["Pace Bowler", "Spin Bowler", "Top-Order Batsman", "Middle-Order / Finisher", "Wicketkeeper", "All-Rounder"]
    },
    "BADMINTON": {
      name: "Badminton",
      positions: ["Singles (Attacking)", "Singles (Rally / Defensive)", "Doubles (Front Court)", "Doubles (Back Court Power)"]
    },
    "TENNIS": {
      name: "Tennis / Squash",
      positions: ["Singles Match", "Doubles Match", "Drills / Rally Practice"]
    }
  };

  // -------------------------------------------------------
  // LOCAL STORAGE & 30-DAY ROLLING HISTORY
  // -------------------------------------------------------
  function getStoredProfile() {
    try {
      const raw = localStorage.getItem("burn_user_profile");
      if (raw) return JSON.parse(raw);
    } catch(e) {}
    return null;
  }

  function saveProfile(prof) {
    try {
      localStorage.setItem("burn_user_profile", JSON.stringify(prof));
    } catch(e) {}
  }

  function getHistoryMap() {
    try {
      const raw = localStorage.getItem("burn_history_v2");
      if (raw) return JSON.parse(raw);
    } catch(e) {}
    return {};
  }

  function saveHistoryMap(map) {
    try {
      localStorage.setItem("burn_history_v2", JSON.stringify(map));
    } catch(e) {}
  }

  function prune30DayHistory() {
    const map = getHistoryMap();
    const now = new Date();
    const cutoffTime = now.getTime() - (30 * 24 * 60 * 60 * 1000);
    let modified = false;

    for (const dateKey of Object.keys(map)) {
      const [y, m, d] = dateKey.split("-").map(Number);
      const entryDate = new Date(y, m - 1, d).getTime();
      if (entryDate < cutoffTime) {
        delete map[dateKey];
        modified = true;
      }
    }

    if (modified) {
      saveHistoryMap(map);
    }
    return map;
  }

  function getPast30DaysList() {
    const historyMap = prune30DayHistory();
    const list = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const target = new Date();
      target.setDate(today.getDate() - i);
      const key = `${target.getFullYear()}-${String(target.getMonth()+1).padStart(2,"0")}-${String(target.getDate()).padStart(2,"0")}`;
      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const dayOfWeek = dayNames[target.getDay()];

      const recorded = historyMap[key];
      if (recorded) {
        list.push({
          dateKey: key,
          dateFormatted: target.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          dayName: dayOfWeek,
          isRest: false,
          ...recorded
        });
      } else {
        list.push({
          dateKey: key,
          dateFormatted: target.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          dayName: dayOfWeek,
          isRest: true,
          splitName: "REST / RECOVERY DAY",
          calories: 0,
          duration: 0,
          exercisesCount: 0
        });
      }
    }
    return list;
  }

  function logSessionToHistory(sessionData) {
    const map = prune30DayHistory();
    const key = sessionData.dateKey || todayKey();
    map[key] = {
      timestamp: Date.now(),
      splitName: sessionData.splitName,
      userWeight: sessionData.userWeight,
      duration: sessionData.duration,
      calories: sessionData.calories,
      targetedMuscles: sessionData.targetedMuscles,
      recoveryNext48Hours: sessionData.recoveryNext48Hours,
      detailedSummary: sessionData.detailedSummary,
      exercisesLogged: sessionData.exercisesLogged
    };
    saveHistoryMap(map);
  }

  // -------------------------------------------------------
  // HELPERS
  // -------------------------------------------------------
  function getTodayDayNum() {
    const day = new Date().getDay();
    return day === 0 ? 7 : day;
  }

  function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  }

  function calculateAge(dobString) {
    if (!dobString) return 25;
    try {
      const dob = new Date(dobString);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      return age > 0 ? age : 25;
    } catch(e) {
      return 25;
    }
  }

  function isAbExercise(name) {
    const upper = String(name).toUpperCase();
    return ABS_EXERCISES.some(abs => upper.includes(abs));
  }

  function getExerciseCategory(name) {
    const n = String(name).toUpperCase().trim();
    if (n.includes("FOOTBALL") || n.includes("SOCCER")) return "SPORT_FOOTBALL";
    if (n.includes("BASKETBALL")) return "SPORT_BASKETBALL";
    if (n.includes("VOLLEYBALL")) return "SPORT_VOLLEYBALL";
    if (n.includes("CRICKET")) return "SPORT_CRICKET";
    if (n.includes("BADMINTON")) return "SPORT_BADMINTON";
    if (n.includes("TENNIS") || n.includes("SQUASH") || n.includes("TABLE TENNIS")) return "SPORT_RACKET";
    if (n.includes("RUNNING") || n.includes("SPRINT") || n.includes("BEEP TEST")) return "CARDIO_RUNNING";
    if (n.includes("CYCLING")) return "CARDIO_CYCLING";
    if (n.includes("WALK") || n.includes("TREADMILL")) return "CARDIO_WALKING";
    if (n.includes("SWIMMING") || n.includes("ROWING") || n.includes("ELLIPTICAL")) return "CARDIO_MACHINE";
    if (n.includes("STRETCH") || n.includes("POSE") || n.includes("MOBILITY")) return "MOBILITY";
    if (n.includes("HANDSTAND") || n.includes("BALANCE") || n.includes("CROW") || n.includes("DEAD HANG") || n.includes("WALL SIT")) return "ISOMETRIC";
    return "STRENGTH";
  }

  function createLogForExercise(name) {
    const cat = getExerciseCategory(name);
    if (cat === "SPORT_FOOTBALL") {
      return { kind: "SPORT", name, sportType: "FOOTBALL", mins: 0, position: "Midfielder", difficulty: 7 };
    }
    if (cat === "SPORT_BASKETBALL") {
      return { kind: "SPORT", name, sportType: "BASKETBALL", mins: 0, position: "Point Guard", difficulty: 7 };
    }
    if (cat === "SPORT_VOLLEYBALL") {
      return { kind: "SPORT", name, sportType: "VOLLEYBALL", mins: 0, position: "Outside Hitter / Spiker", difficulty: 7 };
    }
    if (cat === "SPORT_CRICKET") {
      return { kind: "SPORT", name, sportType: "CRICKET", mins: 0, position: "All-Rounder", difficulty: 7 };
    }
    if (cat === "SPORT_BADMINTON") {
      return { kind: "SPORT", name, sportType: "BADMINTON", mins: 0, position: "Singles (Attacking)", difficulty: 7 };
    }
    if (cat === "SPORT_RACKET") {
      return { kind: "SPORT", name, sportType: "TENNIS", mins: 0, position: "Singles Match", difficulty: 7 };
    }
    if (cat === "CARDIO_RUNNING") {
      return { kind: "RUNNING", name, mins: 0, distanceKm: 0, difficulty: 7 };
    }
    if (cat === "CARDIO_CYCLING") {
      return { kind: "CYCLING", name, mins: 0, difficulty: 6 };
    }
    if (cat === "CARDIO_WALKING" || cat === "CARDIO_MACHINE") {
      return { kind: "CARDIO_GENERAL", name, mins: 0, difficulty: 5 };
    }
    if (cat === "MOBILITY") {
      return { kind: "MOBILITY", name, mins: 0 };
    }
    if (cat === "ISOMETRIC") {
      return { kind: "ISOMETRIC", name, secs: 0, difficulty: 6 };
    }
    return { kind: "STRENGTH", name, value: 0, weight: 0, mode: "REPS", isAbdominal: isAbExercise(name) };
  }

  // -------------------------------------------------------
  // ANATOMY & METABOLIC ENGINE
  // -------------------------------------------------------
  function getMusclesForExercise(name) {
    const n = String(name).toUpperCase();
    const targeted = [];

    if (n.includes("BENCH") || n.includes("CHEST") || n.includes("FLY") || n.includes("PUSH-UP") || n.includes("PEC DECK")) {
      targeted.push("Pectoralis Major (Sternocostal Head)", "Anterior Deltoids", "Triceps Brachii");
    }
    if (n.includes("INCLINE")) {
      targeted.push("Clavicular Head (Upper Chest)", "Anterior Deltoids");
    }
    if (n.includes("DIP")) {
      targeted.push("Lower Pectoralis", "Triceps Brachii", "Anterior Deltoids");
    }
    if (n.includes("PULL-UP") || n.includes("CHIN-UP") || n.includes("LAT PULLDOWN")) {
      targeted.push("Latissimus Dorsi", "Teres Major", "Biceps Brachii", "Rhomboids");
    }
    if (n.includes("ROW") || n.includes("DEADLIFT") || n.includes("PENDLAY")) {
      targeted.push("Latissimus Dorsi", "Rhomboids", "Middle & Lower Trapezius", "Erector Spinae");
    }
    if (n.includes("SHOULDER") || n.includes("MILITARY") || n.includes("ARNOLD") || n.includes("OVERHEAD")) {
      targeted.push("Anterior Deltoids", "Lateral Deltoids", "Triceps Brachii", "Upper Trapezius");
    }
    if (n.includes("REAR DELT") || n.includes("REVERSE FLY") || n.includes("FACE PULL")) {
      targeted.push("Posterior Deltoids (Rear Delts)", "Rhomboids", "Infraspinatus", "Middle Trapezius");
    }
    if (n.includes("LATERAL RAISE")) {
      targeted.push("Lateral Deltoids (Medial Head)", "Supraspinatus");
    }
    if (n.includes("CURL")) {
      targeted.push("Biceps Brachii (Short & Long Heads)", "Brachialis", "Brachioradialis");
    }
    if (n.includes("TRICEPS") || n.includes("PUSHDOWN") || n.includes("SKULL CRUSHER") || n.includes("KICKBACK")) {
      targeted.push("Triceps Brachii (Lateral, Long, and Medial Heads)");
    }
    if (n.includes("SQUAT") || n.includes("LEG PRESS") || n.includes("LUNGE") || n.includes("EXTENSION")) {
      targeted.push("Quadriceps Femoris (Rectus Femoris, Vastus Lateralis/Medialis)", "Gluteus Maximus");
    }
    if (n.includes("RDL") || n.includes("ROMANIAN") || n.includes("LEG CURL") || n.includes("STIFF-LEG")) {
      targeted.push("Hamstrings (Biceps Femoris, Semitendinosus)", "Gluteus Maximus", "Erector Spinae");
    }
    if (n.includes("CALF") || n.includes("TIBIALIS")) {
      targeted.push("Gastrocnemius", "Soleus", "Tibialis Anterior");
    }
    if (n.includes("HIP THRUST") || n.includes("GLUTE BRIDGE") || n.includes("CLAMSHELL")) {
      targeted.push("Gluteus Maximus", "Gluteus Medius", "Gluteus Minimus");
    }
    if (isAbExercise(n)) {
      targeted.push("Rectus Abdominis", "Transverse Abdominis", "Internal & External Obliques");
    }
    if (n.includes("FOOTBALL") || n.includes("SOCCER")) {
      targeted.push("Cardiorespiratory System", "Quadriceps", "Hamstrings", "Gastrocnemius", "Adductors", "Agility Core");
    }
    if (n.includes("BASKETBALL")) {
      targeted.push("Cardiovascular System", "Calf Complex", "Quadriceps", "Deltoids", "Rotational Core");
    }
    if (n.includes("VOLLEYBALL")) {
      targeted.push("Posterior Chain", "Quadriceps (Explosive Jump Mechanics)", "Shoulder Rotator Cuff", "Core Stabilizers");
    }
    if (n.includes("BADMINTON") || n.includes("TENNIS")) {
      targeted.push("Shoulder Rotators", "Forearm Flexors", "Calves", "Lateral Hip Stabilizers");
    }
    if (n.includes("RUNNING") || n.includes("CYCLING") || n.includes("SPRINT")) {
      targeted.push("Cardiorespiratory System", "Quadriceps", "Gastrocnemius/Soleus", "Gluteal Complex");
    }

    if (targeted.length === 0) {
      targeted.push("Full Body Neuromuscular Engagement", "Core Trunk Stabilizers");
    }
    return Array.from(new Set(targeted));
  }

  function computeMetabolicReport(profile, userWeight, durationMins, logs, workoutTitle, workoutSplit) {
    const weight = Number(userWeight) || 70;
    const height = Number(profile?.height) || 175;
    const age = profile?.dob ? calculateAge(profile.dob) : 25;
    const mins = Number(durationMins) || 45;

    // 1. Precise BMR Formula (Mifflin-St Jeor)
    const bmr = 10 * weight + 6.25 * height - 5 * age + 5;

    // 2. Work Analysis
    let totalSets = 0;
    let totalVolumeKg = 0;
    let sportsMinutes = 0;
    let cardioMinutes = 0;
    const loggedMuscles = new Set();
    const activeExerciseList = [];

    Object.entries(logs).forEach(([name, log]) => {
      const muscles = getMusclesForExercise(name);
      muscles.forEach(m => loggedMuscles.add(m));

      if (log.kind === "STRENGTH") {
        const val = Number(log.value) || 0;
        const wt = Number(log.weight) || 0;
        if (val > 0) {
          totalSets++;
          totalVolumeKg += (val * (wt || (weight * 0.6)));
          activeExerciseList.push(`${name} (${val} ${log.mode}, ${wt}kg)`);
        }
      } else if (log.kind === "SPORT") {
        const sm = Number(log.mins) || 0;
        if (sm > 0) {
          sportsMinutes += sm;
          activeExerciseList.push(`${name} [${log.position}, ${sm} mins, diff ${log.difficulty}/10]`);
        }
      } else if (log.kind === "RUNNING") {
        const rm = Number(log.mins) || 0;
        if (rm > 0) {
          cardioMinutes += rm;
          activeExerciseList.push(`${name} (${rm} mins, ${log.distanceKm || 0} km)`);
        }
      } else if (log.mins > 0 || log.secs > 0) {
        cardioMinutes += Number(log.mins || (log.secs / 60));
        activeExerciseList.push(`${name}`);
      }
    });

    // 3. Dynamic MET Multiplier
    let baseMET = 6.2;
    if (sportsMinutes > 0) baseMET += 2.2;
    if (cardioMinutes > 20) baseMET += 1.8;
    if (totalVolumeKg > 4000) baseMET += 1.2;

    const netCalories = (baseMET * 3.5 * weight / 200) * mins;
    const epoc = netCalories * 0.14; // EPOC factor
    const totalCalories = Math.max(80, Math.round(netCalories + epoc));

    const targetedMusclesList = Array.from(loggedMuscles);
    if (targetedMusclesList.length === 0) {
      targetedMusclesList.push("Latissimus Dorsi", "Pectoralis Major", "Quadriceps Femoris", "Core Stabilizers");
    }

    const recoveryNext48Hours = [
      "0 to 12 Hours: Acute glycogen depletion and neuromuscular fatigue. Myofibrillar micro-tears begin signaling localized inflammatory recovery cascades. Rehydrate with 600-800ml electrolyte fluids and consume 30-40g fast-digesting protein within 90 minutes.",
      "12 to 24 Hours: Onset of Delayed Onset Muscle Soreness (DOMS). Muscle protein synthesis reaches peak velocity. Expect mild localized stiffness and connective tissue tightness across the primary prime movers.",
      "24 to 48 Hours: Peak structural remodeling and nervous system stabilization. Prioritize 8+ hours of continuous restorative sleep, light active-recovery mobility walking, and 1.8-2.2g protein per kilogram of bodyweight to maximize athletic supercompensation."
    ];

    const detailedSummary = `Today's performance session delivered an intense athletic stimulus calibrated specifically to your biometric profile of ${weight} kg body mass, ${height} cm stature, and age ${age}. Over the course of ${mins} continuous minutes, you achieved an estimated energy expenditure of ${totalCalories} total calories, incorporating standard metabolic equivalency, work density, and excess post-exercise oxygen consumption (EPOC).

Focusing on the ${workoutSplit || "Scheduled Program"}, your session placed concentrated mechanical tension and metabolic stress across the ${targetedMusclesList.slice(0, 4).join(", ")}, with synergistic neuromuscular stability provided by the trunk and core stabilizers. The volume accumulation reflects a high-intensity resistance density pattern, stimulating mammalian target of rapamycin (mTOR) signaling pathways essential for muscular hypertrophy, athletic power output, and cardiovascular conditioning.

Over the upcoming 48-hour recovery cycle, your body will transition through muscular supercompensation. Ensure consistent nutrient timing with adequate protein ingestion, sustained sodium-potassium electrolyte balance, and active myofascial mobility work. Maintain optimal sleep hygiene tonight to facilitate human growth hormone (HGH) release and maximize physical adaptation before your next scheduled training split.`;

    return {
      calories: totalCalories,
      targetedMuscles: targetedMusclesList,
      recoveryNext48Hours: recoveryNext48Hours,
      detailedSummary: detailedSummary,
      activeExercisesCount: activeExerciseList.length,
      exercisesLogged: activeExerciseList
    };
  }

  // -------------------------------------------------------
  // APP STATE
  // -------------------------------------------------------
  const storedProfile = getStoredProfile();
  const state = {
    profile: storedProfile || { name: "ATHLETE", height: 175, dob: "2000-01-01" },
    step: "WELCOME", // Direct to Welcome/Home dashboard
    selectedDayNum: getTodayDayNum(),
    userWeight: 0,
    duration: 0,
    logs: {},
    addedExtras: [],
    result: null,
    isCalculating: false,
    modalOpen: false,
    search: "",
    historyModalOpen: false,
    profileModalOpen: false,
    viewingHistoryDetail: null
  };

  function getCurrentWorkout() {
    return WEEKLY_SCHEDULE.find(w => w.dayNum === state.selectedDayNum) || WEEKLY_SCHEDULE[0];
  }

  function initCurrentLogs() {
    const w = getCurrentWorkout();
    const all = w.exercises.concat(state.addedExtras);
    const newLogs = {};
    all.forEach(ex => {
      newLogs[ex] = state.logs[ex] || createLogForExercise(ex);
    });
    state.logs = newLogs;
  }

  // -------------------------------------------------------
  // GEMINI AI INTEGRATION
  // -------------------------------------------------------
  async function calculateWithGemini() {
    state.isCalculating = true;
    render();

    const currentW = getCurrentWorkout();
    const offlineFallback = computeMetabolicReport(
      state.profile,
      state.userWeight,
      state.duration,
      state.logs,
      currentW.title,
      currentW.muscleGroup
    );

    const apiKey = window.GEMINI_KEY;
    if (!apiKey) {
      finalizeSession(offlineFallback);
      return;
    }

    try {
      const payload = {
        athlete: {
          name: state.profile?.name || "Guest",
          heightCm: state.profile?.height || 175,
          dob: state.profile?.dob || "1999-01-01",
          age: state.profile?.dob ? calculateAge(state.profile.dob) : 25,
          currentWeightKg: state.userWeight || 70
        },
        session: {
          workoutTitle: currentW.title,
          split: currentW.muscleGroup,
          durationMinutes: state.duration,
          logs: state.logs
        }
      };

      const prompt = `You are the BURN elite sports science AI engine. Analyze this complete workout session and athlete biometrics:
${JSON.stringify(payload)}

Calculate the precise calories burned using metabolic equivalency, biometric parameters (height, weight, age, BMR), and total volume load.
Provide:
1. "calories": Total estimated calories burned (integer number).
2. "targetedMuscles": Array of strings naming specific anatomical muscle groups targeted in this session.
3. "recoveryNext48Hours": Array of 3 comprehensive strings detailing what the athlete should expect in the next 12h, 24h, and 48h (DOMS, neuromuscular recovery, protein targets, hydration).
4. "detailedSummary": A comprehensive, analytical, highly thorough breakdown of AT LEAST 160 WORDS explaining the mechanical tension, metabolic stress, energy pathway contributions, nervous system fatigue, and recovery supercompensation protocol for this session.

Return ONLY raw JSON with keys "calories" (number), "targetedMuscles" (array of strings), "recoveryNext48Hours" (array of strings), and "detailedSummary" (string of >= 160 words). Do NOT wrap in markdown block quotes.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const cleanJson = rawText.replace(/```json|```/g, "").trim();
      
      if (cleanJson) {
        const parsed = JSON.parse(cleanJson);
        if (parsed.calories && parsed.detailedSummary) {
          finalizeSession({
            calories: Number(parsed.calories) || offlineFallback.calories,
            targetedMuscles: Array.isArray(parsed.targetedMuscles) ? parsed.targetedMuscles : offlineFallback.targetedMuscles,
            recoveryNext48Hours: Array.isArray(parsed.recoveryNext48Hours) ? parsed.recoveryNext48Hours : offlineFallback.recoveryNext48Hours,
            detailedSummary: parsed.detailedSummary.length >= 100 ? parsed.detailedSummary : offlineFallback.detailedSummary,
            exercisesLogged: offlineFallback.exercisesLogged
          });
          return;
        }
      }
      finalizeSession(offlineFallback);
    } catch(e) {
      console.warn("AI network calculation fallback:", e);
      finalizeSession(offlineFallback);
    }
  }

  function finalizeSession(reportResult) {
    const currentW = getCurrentWorkout();
    state.result = reportResult;
    state.isCalculating = false;
    state.step = "RESULT";

    // Auto-save to 30-day history
    logSessionToHistory({
      dateKey: todayKey(),
      splitName: currentW.muscleGroup,
      userWeight: state.userWeight,
      duration: state.duration,
      calories: reportResult.calories,
      targetedMuscles: reportResult.targetedMuscles,
      recoveryNext48Hours: reportResult.recoveryNext48Hours,
      detailedSummary: reportResult.detailedSummary,
      exercisesLogged: reportResult.exercisesLogged
    });

    render();
  }

  // -------------------------------------------------------
  // RENDERING & HTML ESCAPING
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

  function render() {
    const currentW = getCurrentWorkout();
    const userName = (state.profile?.name || "GUEST").toUpperCase();

    root.innerHTML = `
      <div class="min-h-screen max-w-lg mx-auto px-4 bg-black text-white flex flex-col justify-between selection:bg-[#042854]">
        
        <!-- Header -->
        <header class="pt-5 pb-3.5 shrink-0 flex items-center justify-between border-b border-zinc-900">
          <div class="flex items-center gap-3">
            <img src="./app_logo.jpg" alt="BURN Logo" class="w-10 h-10 rounded-xl border border-zinc-800 object-cover shadow-md shadow-blue-950/30" />
            <div>
              <h1 class="text-2xl font-black tracking-tighter text-white leading-none">BURN</h1>
              <p class="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">METABOLIC WORKOUT ENGINE</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <!-- 30-Day History Button -->
            <button data-a="open-history" class="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full hover:border-zinc-700 transition" title="View 30-Day Activity History">
              <svg class="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span class="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">30D LOGS</span>
            </button>

            <!-- Profile Badge -->
            ${state.profile ? `
              <button data-a="open-profile" class="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full hover:border-zinc-700 transition">
                <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                <span class="text-[11px] font-bold text-zinc-300 tracking-wider">${escapeHtml(userName)}</span>
              </button>
            ` : ""}
          </div>
        </header>

        <!-- Main Step View -->
        <main class="flex-1 flex flex-col py-4">
          ${renderStep(currentW)}
        </main>

        <!-- Add Workout Modal -->
        ${state.modalOpen ? renderAddWorkoutModal() : ""}

        <!-- 30-Day History Modal -->
        ${state.historyModalOpen ? renderHistoryModal() : ""}

        <!-- History Detail Modal -->
        ${state.viewingHistoryDetail ? renderHistoryDetailModal(state.viewingHistoryDetail) : ""}

        <!-- User Profile Settings Modal -->
        ${state.profileModalOpen ? renderProfileModal() : ""}
      </div>
    `;

    bindEvents();
  }

  function renderStep(workout) {
    // 1. ONBOARDING
    if (state.step === "ONBOARDING") {
      return `
        <div class="fade-step flex flex-col justify-center flex-1 space-y-6 py-2">
          <div class="space-y-2">
            <span class="text-blue-400 text-xs font-black uppercase tracking-widest px-2.5 py-1 bg-blue-950/40 border border-blue-900/40 rounded-full inline-block">ATHLETE CALIBRATION</span>
            <h2 class="text-3xl font-black tracking-tighter uppercase leading-tight">
              SETUP YOUR<br/>METABOLIC PROFILE
            </h2>
            <p class="text-xs text-zinc-400 leading-relaxed">
              Enter your biometrics once. BURN combines your height, age, and real-time body mass to compute precise metabolic energy expenditure.
            </p>
          </div>

          <div class="space-y-4 pt-1">
            <div>
              <label class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Athlete Name</label>
              <input id="prof-name" type="text" placeholder="Guest" value="${escapeAttr(state.profile?.name || "Guest")}"
                class="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-white font-bold text-sm outline-none focus:border-blue-500 transition" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Height (CM)</label>
                <input id="prof-height" type="number" placeholder="175" value="${state.profile?.height || "175"}"
                  class="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-white font-mono font-bold text-sm outline-none focus:border-blue-500 transition" />
              </div>
              <div>
                <label class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Date of Birth</label>
                <input id="prof-dob" type="date" value="${state.profile?.dob || "1999-06-15"}"
                  class="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white font-mono font-bold text-sm outline-none focus:border-blue-500 transition" />
              </div>
            </div>
          </div>

          <div class="pt-4 space-y-3">
            <button data-a="save-profile" class="w-full py-5 text-base font-black tracking-widest text-white hover:brightness-110 active:scale-[0.98] accent-bg rounded-xl transition shadow-lg shadow-blue-950/50">
              CONTINUE TO WORKOUT
            </button>
          </div>
        </div>
      `;
    }

    // 2. WELCOME / DASHBOARD
    if (state.step === "WELCOME") {
      const userName = (state.profile?.name || "GUEST").toUpperCase();
      const dayButtons = WEEKLY_SCHEDULE.map(d => {
        const isSelected = d.dayNum === state.selectedDayNum;
        return `
          <button data-a="select-day" data-day="${d.dayNum}"
            class="px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition shrink-0 ${
              isSelected
                ? "bg-blue-900/60 text-blue-300 border border-blue-600/60 shadow-sm"
                : "bg-zinc-900/80 text-zinc-400 border border-zinc-800 hover:border-zinc-700"
            }">
            ${d.dayName.slice(0, 3)}
          </button>
        `;
      }).join("");

      return `
        <div class="fade-step flex flex-col justify-between flex-1 space-y-6 py-2">
          <div class="space-y-5">
            <!-- Day Pill Selector -->
            <div>
              <p class="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2">7-DAY WORKOUT SPLIT</p>
              <div class="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                ${dayButtons}
              </div>
            </div>

            <!-- Greeting Header -->
            <div class="space-y-4 pt-1">
              <div class="flex items-center gap-3.5">
                <img src="./app_logo.jpg" alt="Physique Emblem" class="w-16 h-16 rounded-2xl border border-zinc-800 object-cover shadow-lg shadow-blue-950/40 shrink-0" />
                <div>
                  <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">PERFORMANCE ENGINE</p>
                  <h2 class="text-2xl sm:text-3xl font-black tracking-tight leading-tight uppercase text-white">
                    HELLO ${escapeHtml(userName)},<br/>
                    IT'S <span class="text-blue-400">${escapeHtml(workout.title)}</span>
                  </h2>
                </div>
              </div>
              
              <div class="p-4 bg-zinc-900/70 border border-zinc-800/80 rounded-2xl space-y-1.5">
                <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">SCHEDULED FOCUS</p>
                <p class="text-2xl font-black text-white uppercase tracking-tight">${escapeHtml(workout.muscleGroup)}</p>
                <p class="text-xs text-zinc-400 pt-0.5">${workout.exercises.length} calibrated exercises in this split</p>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <button data-a="go" class="w-full py-5 text-lg font-black tracking-widest text-white hover:brightness-110 active:scale-[0.98] accent-bg rounded-xl shadow-lg shadow-blue-950/40 transition">
              START SESSION
            </button>
          </div>
        </div>
      `;
    }

    // 3. WEIGHT CHECK (Asked Every Time)
    if (state.step === "WEIGHT") {
      const enabled = Number(state.userWeight) > 0;
      return `
        <div class="fade-step flex flex-col justify-between flex-1 space-y-8 py-2">
          <div class="space-y-2">
            <p class="text-zinc-500 text-xs font-bold uppercase tracking-widest">Daily Weight Check</p>
            <h2 class="text-3xl sm:text-4xl font-black tracking-tighter uppercase leading-none">
              HOW MUCH DO YOU<br/>WEIGH TODAY?
            </h2>
            <p class="text-xs text-zinc-400">
              Accurate mass calibration ensures metabolic calculation precision for today's volume load.
            </p>
          </div>

          <div class="w-full space-y-4 my-auto">
            <div class="border-b-2 border-zinc-800 pb-2 focus-within:border-blue-500 transition">
              <div class="flex items-baseline gap-2">
                <input id="w" type="number" step="0.1" value="${state.userWeight ? String(state.userWeight) : ""}"
                  class="w-full text-7xl font-black bg-transparent focus:outline-none text-white placeholder-zinc-800"
                  placeholder="00.0" inputmode="decimal" autofocus />
                <span class="text-3xl font-black text-zinc-500">KG</span>
              </div>
            </div>
          </div>

          <div class="space-y-2.5">
            <button id="startBtn" data-a="start"
              class="w-full py-5 text-lg font-black tracking-widest transition-all rounded-xl ${
                enabled ? "text-white hover:brightness-110 accent-bg shadow-lg shadow-blue-950/40" : "text-zinc-700 bg-zinc-900 cursor-not-allowed"
              }">
              LOG EXERCISES
            </button>
            <button data-a="back-to-welcome" class="w-full py-2.5 text-xs font-bold text-zinc-500 uppercase tracking-widest hover:text-white transition">
              Back to Split Selection
            </button>
          </div>
        </div>
      `;
    }

    // 4. EXERCISE LIST
    if (state.step === "LIST") {
      initCurrentLogs();
      const exercises = workout.exercises.concat(state.addedExtras);
      const list = exercises.map(ex => renderRow(ex, state.logs[ex])).join("");

      return `
        <div class="fade-step space-y-5 pb-10">
          <div class="flex items-center justify-between pb-2 border-b border-zinc-900">
            <div>
              <p class="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">ACTIVE SESSION</p>
              <h2 class="text-2xl font-black uppercase tracking-tight text-white">${escapeHtml(workout.muscleGroup)}</h2>
            </div>
            <div class="text-right">
              <span class="text-xs font-mono font-bold text-blue-400 bg-blue-950/40 px-3 py-1 rounded-full border border-blue-900/40">${state.userWeight} KG</span>
            </div>
          </div>

          <div class="space-y-3.5">${list}</div>

          <div class="pt-3 space-y-2.5">
            <button data-a="open-add-modal" class="w-full py-4 text-xs font-black tracking-[0.2em] uppercase border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 transition rounded-xl flex items-center justify-center gap-2">
              <span class="text-blue-400 text-base font-bold">+</span> ADD OTHER WORKOUT (${ALL_WORKOUTS.length} EXERCISES)
            </button>

            <button data-a="proceed" class="w-full text-white font-black py-5 tracking-widest hover:brightness-110 active:scale-[0.98] accent-bg rounded-xl shadow-lg shadow-blue-950/40 transition">
              PROCEED TO DURATION
            </button>
          </div>
        </div>
      `;
    }

    // 5. DURATION
    if (state.step === "DURATION") {
      const enabled = !state.isCalculating && Number(state.duration) > 0;
      return `
        <div class="fade-step flex flex-col justify-between flex-1 space-y-8 py-2">
          <div class="space-y-2">
            <p class="text-zinc-500 text-xs font-bold uppercase tracking-widest">Session Summary</p>
            <h2 class="text-3xl sm:text-4xl font-black tracking-tighter uppercase leading-none">TOTAL DURATION</h2>
            <p class="text-xs text-zinc-400">Total time spent working, resting, and completing all sets.</p>
          </div>

          <div class="w-full space-y-4 my-auto">
            <div class="border-b-2 border-zinc-800 pb-2 focus-within:border-blue-500 transition">
              <div class="flex items-baseline gap-2">
                <input id="d" type="number" value="${state.duration || ""}"
                  class="w-full text-7xl font-black bg-transparent focus:outline-none text-white placeholder-zinc-800"
                  placeholder="00" inputmode="numeric" autofocus />
                <span class="text-3xl font-black text-zinc-500">MINS</span>
              </div>
            </div>
          </div>

          <div class="space-y-2.5">
            <button id="calcBtn" data-a="calc"
              class="w-full py-5 font-black tracking-widest transition-all rounded-xl flex items-center justify-center gap-3 ${
                enabled ? "text-white hover:brightness-110 accent-bg shadow-lg shadow-blue-950/40" : "text-zinc-700 bg-zinc-900 cursor-not-allowed"
              }">
              ${state.isCalculating ? `
                <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                COMPUTING METABOLICS...
              ` : "CALCULATE DETAILED REPORT"}
            </button>

            <button data-a="back-to-list" class="w-full text-zinc-500 text-xs font-black uppercase tracking-[0.2em] py-2 hover:text-white transition-colors">
              Back to exercises
            </button>
          </div>
        </div>
      `;
    }

    // 6. RESULT
    if (state.step === "RESULT" && state.result) {
      const res = state.result;
      const musclesTags = (res.targetedMuscles || []).map(m => `
        <span class="text-[11px] font-bold bg-zinc-800 border border-zinc-700/60 text-zinc-200 px-3 py-1.5 rounded-lg">
          ${escapeHtml(m)}
        </span>
      `).join("");

      const recoveryItems = (res.recoveryNext48Hours || []).map(r => `
        <li class="flex items-start gap-2 text-xs text-zinc-300 leading-relaxed">
          <span class="text-blue-400 font-black mt-0.5">•</span>
          <span>${escapeHtml(r)}</span>
        </li>
      `).join("");

      return `
        <div class="fade-step flex-1 pb-10 space-y-5">
          <div class="bg-zinc-900/80 border border-zinc-800 p-5 sm:p-6 rounded-2xl space-y-5">
            <div class="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span class="text-zinc-400 text-[10px] font-black uppercase tracking-[0.25em]">METABOLIC EXPENDITURE</span>
              <span class="text-[10px] font-bold text-blue-400 bg-blue-950/40 border border-blue-900/50 px-2.5 py-0.5 rounded-full">LOGGED TO 30D HISTORY</span>
            </div>

            <div>
              <span class="text-7xl font-black tracking-tighter block leading-none text-white">
                ${Math.round(res.calories || 0)}
              </span>
              <span class="text-xs font-bold uppercase tracking-widest text-blue-400 mt-1 block">
                ESTIMATED CALORIES BURNT
              </span>
            </div>

            <!-- Targeted Muscles -->
            <div class="border-t border-zinc-800 pt-4 space-y-2">
              <h3 class="text-xs font-black uppercase tracking-wider text-zinc-300">Specific Muscles Targeted</h3>
              <div class="flex flex-wrap gap-1.5">
                ${musclesTags}
              </div>
            </div>

            <!-- Next 2 Days Expectations -->
            <div class="border-t border-zinc-800 pt-4 space-y-2">
              <h3 class="text-xs font-black uppercase tracking-wider text-zinc-300">What To Expect (Next 48 Hours)</h3>
              <ul class="space-y-2 bg-black/50 p-3.5 rounded-xl border border-zinc-800/80">
                ${recoveryItems}
              </ul>
            </div>

            <!-- Detailed Summary (150+ words) -->
            <div class="border-t border-zinc-800 pt-4 space-y-2">
              <h3 class="text-xs font-black uppercase tracking-wider text-zinc-300">Comprehensive Performance Breakdown</h3>
              <div class="text-zinc-300 text-xs leading-relaxed font-normal bg-black/50 p-4 rounded-xl border border-zinc-800/80">
                ${escapeHtml(res.detailedSummary || "")}
              </div>
            </div>

            <!-- Finish Button -->
            <div class="pt-2">
              <button data-a="close-session" class="w-full bg-white text-black font-black py-4 tracking-widest hover:bg-zinc-200 transition-all uppercase rounded-xl">
                RETURN TO DASHBOARD
              </button>
            </div>
          </div>
        </div>
      `;
    }

    return "";
  }

  // -------------------------------------------------------
  // ROW RENDERING FOR DIFFERENT EXERCISE TYPES
  // -------------------------------------------------------
  function renderRow(name, log) {
    if (!log) return "";
    const exAttr = escapeAttr(name);

    // 1. SPORTS (Football, Basketball, Volleyball, Cricket, Badminton, etc.)
    if (log.kind === "SPORT") {
      const cfg = SPORT_CONFIGS[log.sportType] || { positions: ["General Player"] };
      const posOptions = cfg.positions.map(p => `
        <option value="${escapeAttr(p)}" ${log.position === p ? "selected" : ""}>${escapeHtml(p)}</option>
      `).join("");

      return `
        <div class="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800 flex flex-col gap-3">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-bold text-white text-sm tracking-tight">${escapeHtml(name)}</h3>
              <span class="text-[9px] font-bold text-blue-400 uppercase tracking-widest block mt-0.5">SPORT • TIME & POSITION PLAYED</span>
            </div>
            <span class="text-[10px] font-bold bg-blue-950/60 text-blue-300 border border-blue-900/50 px-2 py-0.5 rounded-md">DIFFICULTY: ${log.difficulty || 7}/10</span>
          </div>

          <div class="grid grid-cols-2 gap-2.5">
            <div>
              <label class="text-[9px] font-bold text-zinc-400 uppercase mb-1 block">Time Played (Mins)</label>
              <input data-a="sport-mins" data-ex="${exAttr}" type="number" placeholder="0" value="${log.mins || ""}"
                class="w-full bg-zinc-800/80 rounded-xl py-2.5 px-3 text-white font-mono text-sm outline-none border border-zinc-700/60 focus:border-blue-500" />
            </div>
            <div>
              <label class="text-[9px] font-bold text-zinc-400 uppercase mb-1 block">Position Played</label>
              <select data-a="sport-pos" data-ex="${exAttr}"
                class="w-full bg-zinc-800/80 rounded-xl py-2.5 px-2.5 text-white text-xs font-bold outline-none border border-zinc-700/60 focus:border-blue-500">
                ${posOptions}
              </select>
            </div>
          </div>

          <div>
            <div class="flex justify-between text-[9px] font-bold text-zinc-400 uppercase mb-1">
              <span>Match Intensity / Difficulty</span>
              <span class="text-white">${log.difficulty || 7} / 10</span>
            </div>
            <input data-a="sport-diff" data-ex="${exAttr}" type="range" min="1" max="10" value="${log.difficulty || 7}"
              class="w-full accent-blue-500 cursor-pointer" />
          </div>
        </div>
      `;
    }

    // 2. RUNNING / SPRINTING
    if (log.kind === "RUNNING") {
      const mins = Number(log.mins) || 0;
      const km = Number(log.distanceKm) || 0;
      const speed = mins > 0 && km > 0 ? (km / (mins / 60)) : 0;
      const pace = km > 0 && mins > 0 ? (mins / km) : 0;
      const paceStr = pace ? `${Math.floor(pace)}:${String(Math.round((pace - Math.floor(pace)) * 60)).padStart(2,"0")} /km` : "-";

      return `
        <div class="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800 flex flex-col gap-3">
          <div>
            <h3 class="font-bold text-white text-sm tracking-tight">${escapeHtml(name)}</h3>
            <span class="text-[9px] font-bold text-blue-400 uppercase tracking-widest block mt-0.5">CARDIO • DISTANCE & SPEED</span>
          </div>

          <div class="grid grid-cols-2 gap-2.5">
            <div>
              <label class="text-[9px] font-bold text-zinc-400 uppercase mb-1 block">Time (Mins)</label>
              <input data-a="run-mins" data-ex="${exAttr}" type="number" placeholder="0" value="${log.mins || ""}"
                class="w-full bg-zinc-800/80 rounded-xl py-2.5 px-3 text-white font-mono text-sm outline-none border border-zinc-700/60 focus:border-blue-500" />
            </div>
            <div>
              <label class="text-[9px] font-bold text-zinc-400 uppercase mb-1 block">Distance (KM)</label>
              <input data-a="run-km" data-ex="${exAttr}" type="number" step="0.01" placeholder="0.00" value="${log.distanceKm || ""}"
                class="w-full bg-zinc-800/80 rounded-xl py-2.5 px-3 text-white font-mono text-sm outline-none border border-zinc-700/60 focus:border-blue-500" />
            </div>
          </div>

          <div class="text-[11px] text-zinc-400 bg-black/40 px-3 py-1.5 rounded-xl border border-zinc-800 flex items-center justify-between">
            <span>Speed: <strong class="text-white">${speed ? speed.toFixed(2) : "-"}</strong> km/h</span>
            <span class="text-zinc-600">|</span>
            <span>Pace: <strong class="text-white">${paceStr}</strong></span>
          </div>
        </div>
      `;
    }

    // 3. CYCLING / GENERAL CARDIO / MACHINE
    if (log.kind === "CYCLING" || log.kind === "CARDIO_GENERAL") {
      return `
        <div class="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800 flex flex-col gap-3">
          <div>
            <h3 class="font-bold text-white text-sm tracking-tight">${escapeHtml(name)}</h3>
            <span class="text-[9px] font-bold text-blue-400 uppercase tracking-widest block mt-0.5">CARDIO / CONDITIONING • DURATION</span>
          </div>

          <div class="grid grid-cols-2 gap-2.5">
            <div>
              <label class="text-[9px] font-bold text-zinc-400 uppercase mb-1 block">Time (Mins)</label>
              <input data-a="cardio-mins" data-ex="${exAttr}" type="number" placeholder="0" value="${log.mins || ""}"
                class="w-full bg-zinc-800/80 rounded-xl py-2.5 px-3 text-white font-mono text-sm outline-none border border-zinc-700/60 focus:border-blue-500" />
            </div>
            <div>
              <label class="text-[9px] font-bold text-zinc-400 uppercase mb-1 block">Intensity (1-10)</label>
              <input data-a="cardio-diff" data-ex="${exAttr}" type="number" min="1" max="10" placeholder="6" value="${log.difficulty || "6"}"
                class="w-full bg-zinc-800/80 rounded-xl py-2.5 px-3 text-white font-mono text-sm outline-none border border-zinc-700/60 focus:border-blue-500" />
            </div>
          </div>
        </div>
      `;
    }

    // 4. MOBILITY / STRETCH
    if (log.kind === "MOBILITY") {
      return `
        <div class="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800 flex flex-col gap-3">
          <div>
            <h3 class="font-bold text-white text-sm tracking-tight">${escapeHtml(name)}</h3>
            <span class="text-[9px] font-bold text-blue-400 uppercase tracking-widest block mt-0.5">RECOVERY & MOBILITY</span>
          </div>
          <div>
            <label class="text-[9px] font-bold text-zinc-400 uppercase mb-1 block">Hold / Routine Time (Mins)</label>
            <input data-a="cardio-mins" data-ex="${exAttr}" type="number" placeholder="0" value="${log.mins || ""}"
              class="w-full bg-zinc-800/80 rounded-xl py-2.5 px-3 text-white font-mono text-sm outline-none border border-zinc-700/60 focus:border-blue-500" />
          </div>
        </div>
      `;
    }

    // 5. ISOMETRIC / SKILL
    if (log.kind === "ISOMETRIC") {
      return `
        <div class="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800 flex flex-col gap-3">
          <div>
            <h3 class="font-bold text-white text-sm tracking-tight">${escapeHtml(name)}</h3>
            <span class="text-[9px] font-bold text-blue-400 uppercase tracking-widest block mt-0.5">ISOMETRIC HOLD • SECONDS</span>
          </div>
          <div class="grid grid-cols-2 gap-2.5">
            <div>
              <label class="text-[9px] font-bold text-zinc-400 uppercase mb-1 block">Hold Secs</label>
              <input data-a="iso-secs" data-ex="${exAttr}" type="number" placeholder="0" value="${log.secs || ""}"
                class="w-full bg-zinc-800/80 rounded-xl py-2.5 px-3 text-white font-mono text-sm outline-none border border-zinc-700/60 focus:border-blue-500" />
            </div>
            <div>
              <label class="text-[9px] font-bold text-zinc-400 uppercase mb-1 block">Difficulty (1-10)</label>
              <input data-a="iso-diff" data-ex="${exAttr}" type="number" min="1" max="10" placeholder="6" value="${log.difficulty || "6"}"
                class="w-full bg-zinc-800/80 rounded-xl py-2.5 px-3 text-white font-mono text-sm outline-none border border-zinc-700/60 focus:border-blue-500" />
            </div>
          </div>
        </div>
      `;
    }

    // 6. DEFAULT STRENGTH EXERCISE
    const abTag = log.isAbdominal ? `<span class="text-[9px] font-bold text-blue-400 uppercase tracking-widest block mt-0.5">+5KG ANKLE WEIGHTS RECOM.</span>` : "";

    return `
      <div class="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800 flex flex-col gap-3">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h3 class="font-bold text-white text-sm tracking-tight">${escapeHtml(name)}</h3>
            ${abTag}
          </div>
          <button data-a="toggle-mode" data-ex="${exAttr}"
            class="text-[10px] font-black border border-zinc-700 px-2.5 py-1 rounded-lg hover:bg-zinc-800 text-zinc-300 uppercase tracking-wider transition">
            ${log.mode === "REPS" ? "REPS" : "SECS"}
          </button>
        </div>

        <div class="grid grid-cols-2 gap-2.5">
          <div>
            <label class="text-[9px] font-bold text-zinc-400 uppercase mb-1 block">${log.mode === "REPS" ? "Reps" : "Secs"}</label>
            <input data-a="str-val" data-ex="${exAttr}" type="number" placeholder="0" value="${log.value || ""}"
              class="w-full bg-zinc-800/80 rounded-xl py-2.5 px-3 text-white font-mono text-sm outline-none border border-zinc-700/60 focus:border-blue-500" />
          </div>
          <div>
            <label class="text-[9px] font-bold text-zinc-400 uppercase mb-1 block">Weight (kg)</label>
            <input data-a="str-wt" data-ex="${exAttr}" type="number" placeholder="0" value="${log.weight || ""}"
              class="w-full bg-zinc-800/80 rounded-xl py-2.5 px-3 text-white font-mono text-sm outline-none border border-zinc-700/60 focus:border-blue-500" />
          </div>
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------
  // 30-DAY ROLLING HISTORY MODAL
  // -------------------------------------------------------
  function renderHistoryModal() {
    const past30 = getPast30DaysList();
    const activeLogs = past30.filter(x => !x.isRest);
    const total30Calories = activeLogs.reduce((acc, cur) => acc + (cur.calories || 0), 0);
    const total30Duration = activeLogs.reduce((acc, cur) => acc + (cur.duration || 0), 0);

    const items = past30.map(day => {
      if (day.isRest) {
        return `
          <div class="bg-zinc-950/70 border border-zinc-800/60 p-3.5 rounded-xl flex items-center justify-between opacity-75">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-[11px] font-bold text-zinc-400">${day.dateFormatted}</span>
                <span class="text-[9px] font-bold text-zinc-600 uppercase">(${day.dayName.slice(0,3)})</span>
              </div>
              <p class="text-xs font-bold text-zinc-500 uppercase mt-0.5">REST / RECOVERY DAY</p>
            </div>
            <span class="text-[10px] font-mono font-bold text-zinc-600 bg-zinc-900 px-2 py-1 rounded-md">NO WORKOUT</span>
          </div>
        `;
      }

      return `
        <button data-a="view-history-detail" data-key="${day.dateKey}"
          class="w-full text-left bg-zinc-900/90 hover:bg-zinc-800/90 border border-zinc-800 p-3.5 rounded-xl flex items-center justify-between transition group">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-[11px] font-bold text-blue-400">${day.dateFormatted}</span>
              <span class="text-[9px] font-bold text-zinc-400 uppercase">(${day.dayName.slice(0,3)})</span>
            </div>
            <p class="text-xs font-black text-white uppercase tracking-tight mt-0.5">${escapeHtml(day.splitName)}</p>
            <p class="text-[10px] text-zinc-400 font-mono">${day.duration} mins • ${day.userWeight || 70} kg</p>
          </div>
          <div class="text-right">
            <span class="text-base font-black text-blue-400 block">${day.calories}</span>
            <span class="text-[8px] font-bold text-zinc-500 uppercase tracking-wider">CALORIES</span>
          </div>
        </button>
      `;
    }).join("");

    return `
      <div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col justify-end">
        <div class="bg-zinc-900 border-t border-zinc-800 p-5 rounded-t-3xl max-h-[85vh] flex flex-col space-y-4">
          <div class="flex justify-between items-center pb-2 border-b border-zinc-800">
            <div>
              <h3 class="font-black text-lg uppercase tracking-tight text-white">30-DAY WORKOUT HISTORY</h3>
              <p class="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Auto-purges older than 30 days</p>
            </div>
            <button data-a="close-history" class="text-xs font-bold text-zinc-400 hover:text-white px-3 py-1.5 bg-zinc-800 rounded-lg">
              CLOSE
            </button>
          </div>

          <!-- Quick 30-Day Metrics -->
          <div class="grid grid-cols-2 gap-2 bg-black/50 p-3 rounded-xl border border-zinc-800/80">
            <div>
              <span class="text-[9px] font-bold text-zinc-500 uppercase block">30D Active Sessions</span>
              <span class="text-xl font-black text-white">${activeLogs.length} <span class="text-xs text-zinc-500 font-normal">/ 30 Days</span></span>
            </div>
            <div>
              <span class="text-[9px] font-bold text-zinc-500 uppercase block">Total Burned</span>
              <span class="text-xl font-black text-blue-400">${total30Calories.toLocaleString()} <span class="text-xs text-zinc-500 font-normal">kcal</span></span>
            </div>
          </div>

          <div class="overflow-y-auto space-y-2 flex-1 pr-1">
            ${items}
          </div>
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------
  // HISTORY DETAIL MODAL
  // -------------------------------------------------------
  function renderHistoryDetailModal(entry) {
    const muscles = (entry.targetedMuscles || []).map(m => `
      <span class="text-[10px] font-bold bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-md">${escapeHtml(m)}</span>
    `).join("");

    return `
      <div class="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex flex-col justify-end">
        <div class="bg-zinc-900 border-t border-zinc-800 p-5 rounded-t-3xl max-h-[85vh] flex flex-col space-y-4">
          <div class="flex justify-between items-center pb-2 border-b border-zinc-800">
            <div>
              <h3 class="font-black text-base uppercase tracking-tight text-white">${escapeHtml(entry.splitName)}</h3>
              <p class="text-[10px] text-blue-400 font-mono font-bold">${entry.dateKey} • ${entry.duration} MINS • ${entry.userWeight} KG</p>
            </div>
            <button data-a="close-history-detail" class="text-xs font-bold text-zinc-400 hover:text-white px-3 py-1.5 bg-zinc-800 rounded-lg">
              CLOSE
            </button>
          </div>

          <div class="overflow-y-auto space-y-4 pr-1">
            <div class="bg-black/50 p-4 rounded-xl border border-zinc-800">
              <span class="text-4xl font-black text-white block leading-none">${entry.calories}</span>
              <span class="text-xs font-bold text-blue-400 uppercase tracking-widest mt-1 block">CALORIES BURNED</span>
            </div>

            <div class="space-y-1.5">
              <h4 class="text-xs font-bold text-zinc-300 uppercase">Targeted Muscles</h4>
              <div class="flex flex-wrap gap-1.5">${muscles}</div>
            </div>

            <div class="space-y-1.5">
              <h4 class="text-xs font-bold text-zinc-300 uppercase">Performance Summary</h4>
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
  // ADD WORKOUT MODAL
  // -------------------------------------------------------
  function renderAddWorkoutModal() {
    const q = state.search.toUpperCase().trim();
    const filtered = ALL_WORKOUTS.filter(x => x.includes(q));

    const items = filtered.map(item => `
      <button data-a="add-extra" data-ex="${escapeAttr(item)}"
        class="w-full text-left py-3 px-3.5 border-b border-zinc-800/80 text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 text-zinc-300 hover:text-white transition flex items-center justify-between">
        <span>+ ${escapeHtml(item)}</span>
        <span class="text-[9px] text-zinc-500 font-mono">${isAbExercise(item) ? "ABS" : getExerciseCategory(item)}</span>
      </button>
    `).join("");

    return `
      <div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col justify-end">
        <div class="bg-zinc-900 border-t border-zinc-800 p-5 rounded-t-3xl max-h-[85vh] flex flex-col space-y-3.5">
          <div class="flex justify-between items-center pb-1">
            <div>
              <h3 class="font-black text-base uppercase tracking-tight text-white">ADD EXERCISE</h3>
              <p id="search-count" class="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">${filtered.length} Exercises found</p>
            </div>
            <button data-a="close-add-modal" class="text-xs font-bold text-zinc-400 hover:text-white px-3 py-1.5 bg-zinc-800 rounded-lg">
              DONE
            </button>
          </div>

          <input id="modal-search" type="text" placeholder="Search exercises..." value="${escapeAttr(state.search)}"
            class="w-full bg-zinc-800 rounded-xl p-3 text-white font-bold text-sm outline-none border border-zinc-700 focus:border-blue-500" />

          <div id="modal-search-list" class="overflow-y-auto max-h-[50vh] pr-1 space-y-1">
            ${items.length ? items : `<p class="text-xs text-zinc-500 py-6 text-center">No exercises matching query</p>`}
          </div>
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------
  // USER PROFILE MODAL
  // -------------------------------------------------------
  function renderProfileModal() {
    return `
      <div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col justify-end">
        <div class="bg-zinc-900 border-t border-zinc-800 p-5 rounded-t-3xl max-h-[85vh] flex flex-col space-y-4">
          <div class="flex justify-between items-center pb-2 border-b border-zinc-800">
            <h3 class="font-black text-base uppercase tracking-tight text-white">ATHLETE BIOMETRIC SETTINGS</h3>
            <button data-a="close-profile" class="text-xs font-bold text-zinc-400 hover:text-white px-3 py-1.5 bg-zinc-800 rounded-lg">
              CLOSE
            </button>
          </div>

          <div class="space-y-3.5">
            <div>
              <label class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Athlete Name</label>
              <input id="edit-name" type="text" value="${escapeAttr(state.profile?.name || "Athlete")}"
                class="w-full bg-zinc-800 rounded-xl p-3 text-white font-bold text-sm outline-none border border-zinc-700" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Height (CM)</label>
                <input id="edit-height" type="number" value="${state.profile?.height || "175"}"
                  class="w-full bg-zinc-800 rounded-xl p-3 text-white font-mono font-bold text-sm outline-none border border-zinc-700" />
              </div>
              <div>
                <label class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Date of Birth</label>
                <input id="edit-dob" type="date" value="${state.profile?.dob || "2000-01-01"}"
                  class="w-full bg-zinc-800 rounded-xl p-2.5 text-white font-mono font-bold text-sm outline-none border border-zinc-700" />
              </div>
            </div>
          </div>

          <div class="pt-2">
            <button data-a="save-edited-profile" class="w-full py-4 text-sm font-black tracking-widest text-white accent-bg rounded-xl uppercase">
              SAVE CHANGES
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------
  // GLOBAL DELEGATED EVENT LISTENER
  // -------------------------------------------------------
  let eventsBound = false;
  function bindEvents() {
    if (eventsBound) return;
    eventsBound = true;

    // 1. Click / Tap Delegation
    document.addEventListener("click", (e) => {
      const actionEl = e.target.closest("[data-a]");
      if (!actionEl) return;

      const action = actionEl.getAttribute("data-a");

      if (action === "save-profile") {
        const name = (root.querySelector("#prof-name")?.value || "").trim() || "Athlete";
        const height = Number(root.querySelector("#prof-height")?.value) || 175;
        const dob = root.querySelector("#prof-dob")?.value || "2000-01-01";
        state.profile = { name, height, dob };
        saveProfile(state.profile);
        state.step = "WELCOME";
        render();
        return;
      }

      if (action === "skip-profile") {
        state.step = "WELCOME";
        render();
        return;
      }

      if (action === "save-edited-profile") {
        const name = (root.querySelector("#edit-name")?.value || "").trim() || "Athlete";
        const height = Number(root.querySelector("#edit-height")?.value) || 175;
        const dob = root.querySelector("#edit-dob")?.value || "2000-01-01";
        state.profile = { name, height, dob };
        saveProfile(state.profile);
        state.profileModalOpen = false;
        render();
        return;
      }

      if (action === "select-day") {
        state.selectedDayNum = Number(actionEl.getAttribute("data-day"));
        state.addedExtras = [];
        state.logs = {};
        render();
        return;
      }

      if (action === "go") {
        state.step = "WEIGHT";
        render();
        return;
      }

      if (action === "back-to-welcome") {
        state.step = "WELCOME";
        render();
        return;
      }

      if (action === "start") {
        if (state.userWeight > 0) {
          state.step = "LIST";
          render();
        }
        return;
      }

      if (action === "proceed") {
        state.step = "DURATION";
        render();
        return;
      }

      if (action === "back-to-list") {
        state.step = "LIST";
        render();
        return;
      }

      if (action === "calc") {
        if (state.duration > 0 && !state.isCalculating) {
          calculateWithGemini();
        }
        return;
      }

      if (action === "close-session") {
        state.step = "WELCOME";
        state.result = null;
        state.duration = 0;
        state.addedExtras = [];
        state.logs = {};
        render();
        return;
      }

      if (action === "toggle-mode") {
        const ex = actionEl.getAttribute("data-ex");
        if (state.logs[ex]) {
          state.logs[ex].mode = state.logs[ex].mode === "REPS" ? "SECS" : "REPS";
          render();
        }
        return;
      }

      if (action === "open-add-modal") {
        state.modalOpen = true;
        state.search = "";
        render();
        return;
      }

      if (action === "close-add-modal") {
        state.modalOpen = false;
        render();
        return;
      }

      if (action === "add-extra") {
        const ex = actionEl.getAttribute("data-ex");
        if (!state.addedExtras.includes(ex)) {
          state.addedExtras.push(ex);
          state.logs[ex] = createLogForExercise(ex);
        }
        state.modalOpen = false;
        render();
        return;
      }

      if (action === "open-history") {
        state.historyModalOpen = true;
        render();
        return;
      }

      if (action === "close-history") {
        state.historyModalOpen = false;
        render();
        return;
      }

      if (action === "view-history-detail") {
        const key = actionEl.getAttribute("data-key");
        const map = getHistoryMap();
        if (map[key]) {
          state.viewingHistoryDetail = { dateKey: key, ...map[key] };
          render();
        }
        return;
      }

      if (action === "close-history-detail") {
        state.viewingHistoryDetail = null;
        render();
        return;
      }

      if (action === "open-profile") {
        state.profileModalOpen = true;
        render();
        return;
      }

      if (action === "close-profile") {
        state.profileModalOpen = false;
        render();
        return;
      }
    });

    // 2. Input / Change Delegation
    document.addEventListener("input", (e) => {
      const target = e.target;
      const id = target.id;
      const action = target.getAttribute("data-a");
      const ex = target.getAttribute("data-ex");

      if (id === "w") {
        state.userWeight = Number(target.value) || 0;
        const btn = document.getElementById("startBtn");
        if (btn) {
          if (state.userWeight > 0) {
            btn.className = "w-full py-5 text-lg font-black tracking-widest text-white hover:brightness-110 accent-bg shadow-lg shadow-blue-950/40 rounded-xl transition-all";
          } else {
            btn.className = "w-full py-5 text-lg font-black tracking-widest text-zinc-700 bg-zinc-900 cursor-not-allowed rounded-xl transition-all";
          }
        }
        return;
      }

      if (id === "d") {
        state.duration = Number(target.value) || 0;
        const btn = document.getElementById("calcBtn");
        if (btn && !state.isCalculating) {
          if (state.duration > 0) {
            btn.className = "w-full py-5 font-black tracking-widest text-white hover:brightness-110 accent-bg shadow-lg shadow-blue-950/40 rounded-xl flex items-center justify-center gap-3 transition-all";
          } else {
            btn.className = "w-full py-5 font-black tracking-widest text-zinc-700 bg-zinc-900 cursor-not-allowed rounded-xl flex items-center justify-center gap-3 transition-all";
          }
        }
        return;
      }

      if (id === "modal-search") {
        state.search = target.value;
        const q = state.search.toUpperCase().trim();
        const filtered = ALL_WORKOUTS.filter(x => x.includes(q));
        const listEl = document.getElementById("modal-search-list");
        const countEl = document.getElementById("search-count");
        if (countEl) countEl.innerText = `${filtered.length} Exercises found`;
        if (listEl) {
          listEl.innerHTML = filtered.length ? filtered.map(item => `
            <button data-a="add-extra" data-ex="${escapeAttr(item)}"
              class="w-full text-left py-3 px-3.5 border-b border-zinc-800/80 text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 text-zinc-300 hover:text-white transition flex items-center justify-between">
              <span>+ ${escapeHtml(item)}</span>
              <span class="text-[9px] text-zinc-500 font-mono">${isAbExercise(item) ? "ABS" : getExerciseCategory(item)}</span>
            </button>
          `).join("") : `<p class="text-xs text-zinc-500 py-6 text-center">No exercises matching "${escapeHtml(state.search)}"</p>`;
        }
        return;
      }

      if (action === "str-val" && ex && state.logs[ex]) {
        state.logs[ex].value = Number(target.value) || 0;
        return;
      }

      if (action === "str-wt" && ex && state.logs[ex]) {
        state.logs[ex].weight = Number(target.value) || 0;
        return;
      }

      if (action === "sport-mins" && ex && state.logs[ex]) {
        state.logs[ex].mins = Number(target.value) || 0;
        return;
      }

      if (action === "sport-diff" && ex && state.logs[ex]) {
        state.logs[ex].difficulty = Number(target.value) || 7;
        const label = target.parentElement?.querySelector(".text-white");
        if (label) label.innerText = `${state.logs[ex].difficulty} / 10`;
        return;
      }

      if (action === "run-mins" && ex && state.logs[ex]) {
        state.logs[ex].mins = Number(target.value) || 0;
        return;
      }

      if (action === "run-km" && ex && state.logs[ex]) {
        state.logs[ex].distanceKm = Number(target.value) || 0;
        return;
      }

      if (action === "cardio-mins" && ex && state.logs[ex]) {
        state.logs[ex].mins = Number(target.value) || 0;
        return;
      }

      if (action === "cardio-diff" && ex && state.logs[ex]) {
        state.logs[ex].difficulty = Number(target.value) || 6;
        return;
      }

      if (action === "iso-secs" && ex && state.logs[ex]) {
        state.logs[ex].secs = Number(target.value) || 0;
        return;
      }

      if (action === "iso-diff" && ex && state.logs[ex]) {
        state.logs[ex].difficulty = Number(target.value) || 6;
        return;
      }
    });

    document.addEventListener("change", (e) => {
      const target = e.target;
      const action = target.getAttribute("data-a");
      const ex = target.getAttribute("data-ex");

      if (action === "sport-pos" && ex && state.logs[ex]) {
        state.logs[ex].position = target.value;
      }
    });
  }

  // Initial startup render
  render();

})();
