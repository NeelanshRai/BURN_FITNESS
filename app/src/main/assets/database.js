// =========================================================
// BURN - Exercise Database & Routine Templates
// =========================================================
(function() {
  "use strict";

  window.BURN_DB = {
    // Built-in movements with instructions, primary and secondary muscle groups
    EXERCISES: [
      // Chest
      {
        name: "Barbell Bench Press",
        category: "CHEST",
        primary: "Pectoralis Major",
        secondary: ["Anterior Deltoids", "Triceps Brachii"],
        trackingType: "WEIGHT_REPS",
        instructions: "Lie flat on the bench with eyes under the bar. Grip slightly wider than shoulder width. Retract scapulae, lower the bar smoothly to mid-chest, and press explosively while maintaining heel drive."
      },
      {
        name: "Incline Dumbbell Bench Press",
        category: "CHEST",
        primary: "Clavicular Head (Upper Chest)",
        secondary: ["Anterior Deltoids", "Triceps"],
        trackingType: "WEIGHT_REPS",
        instructions: "Set bench to 30-45 degrees. Press dumbbells upward in a slight arc, bringing them together at the top without touching. Control the eccentric lowering phase."
      },
      {
        name: "Incline Barbell Bench Press",
        category: "CHEST",
        primary: "Clavicular Head (Upper Chest)",
        secondary: ["Anterior Deltoids", "Triceps"],
        trackingType: "WEIGHT_REPS",
        instructions: "Set incline bench to 30 degrees. Unrack bar, lower under control to upper chest beneath clavicles, press up keeping elbows at ~45 degrees."
      },
      {
        name: "Dumbbell Bench Press",
        category: "CHEST",
        primary: "Pectoralis Major",
        secondary: ["Anterior Deltoids", "Triceps"],
        trackingType: "WEIGHT_REPS",
        instructions: "Press dumbbells vertically over chest, maintaining neutral wrists. Full range of motion at bottom for maximum pectoral stretch."
      },
      {
        name: "Cable Fly",
        category: "CHEST",
        primary: "Pectoralis Major",
        secondary: ["Anterior Deltoids"],
        trackingType: "WEIGHT_REPS",
        instructions: "Position pulleys at chest height. Step forward, maintain a slight elbow bend, and bring hands together in a hugging motion. Squeeze chest for 1 second at peak contraction."
      },
      {
        name: "Pec Deck Fly",
        category: "CHEST",
        primary: "Pectoralis Major (Sternal)",
        secondary: ["Anterior Deltoids"],
        trackingType: "WEIGHT_REPS",
        instructions: "Adjust seat so handles align with mid-chest. Keep elbows slightly bent and press pads together smoothly, focusing on inner chest contraction."
      },
      {
        name: "Push-Up",
        category: "CHEST",
        primary: "Pectoralis Major",
        secondary: ["Triceps Brachii", "Core Stabilizers"],
        trackingType: "BODYWEIGHT_REPS",
        instructions: "Plank position with hands shoulder-width apart. Lower chest until 1 inch from floor while keeping core braced, then push back up."
      },
      {
        name: "Parallel Bar Dip",
        category: "CHEST",
        primary: "Lower Pectoralis",
        secondary: ["Triceps Brachii", "Anterior Deltoids"],
        trackingType: "WEIGHT_REPS",
        instructions: "Lean torso forward 30 degrees for chest focus. Lower until elbows reach 90 degrees, then press back up without locking out elbows aggressively."
      },

      // Back
      {
        name: "Deadlift",
        category: "BACK",
        primary: "Erector Spinae & Posterior Chain",
        secondary: ["Gluteus Maximus", "Hamstrings", "Latissimus Dorsi", "Traps"],
        trackingType: "WEIGHT_REPS",
        instructions: "Stand with mid-foot under bar. Grip outside shins, drop hips, engage lats, push through the floor, and lock hips and knees simultaneously."
      },
      {
        name: "Pull-Up",
        category: "BACK",
        primary: "Latissimus Dorsi",
        secondary: ["Biceps Brachii", "Teres Major", "Rhomboids"],
        trackingType: "BODYWEIGHT_REPS",
        instructions: "Pronated grip slightly wider than shoulders. Pull chest up to bar by driving elbows down into your ribs. Control descent to dead hang."
      },
      {
        name: "Barbell Bent-Over Row",
        category: "BACK",
        primary: "Latissimus Dorsi & Rhomboids",
        secondary: ["Biceps", "Middle Trapezius", "Erectors"],
        trackingType: "WEIGHT_REPS",
        instructions: "Hinge hips back to 45 degrees with flat spine. Pull bar toward lower sternum/belly button, retracting shoulder blades at the top."
      },
      {
        name: "Lat Pulldown",
        category: "BACK",
        primary: "Latissimus Dorsi",
        secondary: ["Biceps", "Teres Major"],
        trackingType: "WEIGHT_REPS",
        instructions: "Slight torso lean back (10-15 degrees). Pull wide bar to upper chest, leading with elbows. Control the weight stack up on the release."
      },
      {
        name: "Seated Cable Row",
        category: "BACK",
        primary: "Rhomboids & Mid-Lats",
        secondary: ["Biceps", "Trapezius"],
        trackingType: "WEIGHT_REPS",
        instructions: "Sit upright with knees slightly flexed. Pull handle into navel, squeezing shoulder blades together without excessive torso momentum."
      },
      {
        name: "Dumbbell Row",
        category: "BACK",
        primary: "Latissimus Dorsi",
        secondary: ["Rhomboids", "Biceps"],
        trackingType: "WEIGHT_REPS",
        instructions: "Support one knee and hand on flat bench. Pull dumbbell with working arm upward in an arc toward hip pocket."
      },
      {
        name: "Pendlay Row",
        category: "BACK",
        primary: "Upper Back & Latissimus",
        secondary: ["Rhomboids", "Erectors", "Biceps"],
        trackingType: "WEIGHT_REPS",
        instructions: "Torso strictly parallel to the floor. Pull bar explosively from the floor to lower chest, then return completely to the floor on each rep."
      },

      // Shoulders
      {
        name: "Overhead Barbell Press",
        category: "SHOULDERS",
        primary: "Anterior & Lateral Deltoids",
        secondary: ["Triceps Brachii", "Upper Trapezius", "Core"],
        trackingType: "WEIGHT_REPS",
        instructions: "Stand tall with bar racked on clavicles. Press straight overhead, clearing face by tucking chin, and lock out overhead with head pushed forward."
      },
      {
        name: "Dumbbell Lateral Raise",
        category: "SHOULDERS",
        primary: "Lateral Deltoids (Side Delts)",
        secondary: ["Supraspinatus"],
        trackingType: "WEIGHT_REPS",
        instructions: "Raise dumbbells outwards with slight forward lean (scapular plane) until arms are parallel to floor. Pour slightly with pinky up."
      },
      {
        name: "Dumbbell Shoulder Press",
        category: "SHOULDERS",
        primary: "Anterior Deltoids",
        secondary: ["Lateral Deltoids", "Triceps"],
        trackingType: "WEIGHT_REPS",
        instructions: "Sit on bench with vertical back support. Press dumbbells upward together over head, locking out smoothly."
      },
      {
        name: "Face Pull",
        category: "SHOULDERS",
        primary: "Posterior Deltoids & Rotator Cuff",
        secondary: ["Rhomboids", "Middle Traps"],
        trackingType: "WEIGHT_REPS",
        instructions: "Rope attachment set at eye height. Pull rope towards bridge of nose while externally rotating hands back past ears."
      },
      {
        name: "Rear Delt Fly",
        category: "SHOULDERS",
        primary: "Posterior Deltoids",
        secondary: ["Infraspinatus", "Rhomboids"],
        trackingType: "WEIGHT_REPS",
        instructions: "Hinge over or use reverse pec deck. Sweep arms wide in horizontal plane, focusing on back of shoulder contraction."
      },

      // Legs
      {
        name: "Back Squat",
        category: "LEGS",
        primary: "Quadriceps & Gluteus Maximus",
        secondary: ["Hamstrings", "Erectors", "Core"],
        trackingType: "WEIGHT_REPS",
        instructions: "Bar rested across upper traps. Unrack, brace core 360 degrees, sit hips down and back to at least parallel depth, push knees out, and drive upwards."
      },
      {
        name: "Romanian Deadlift",
        category: "LEGS",
        primary: "Hamstrings & Gluteus Maximus",
        secondary: ["Erectors", "Lats"],
        trackingType: "WEIGHT_REPS",
        instructions: "Unlock knees slightly. Push hips back as far as possible while lowering barbell down shins with flat back. Feel deep hamstring stretch, then drive hips forward."
      },
      {
        name: "Leg Press",
        category: "LEGS",
        primary: "Quadriceps Femoris",
        secondary: ["Glutes", "Hamstrings"],
        trackingType: "WEIGHT_REPS",
        instructions: "Position feet shoulder-width on carriage. Lower sled until knees reach 90 degrees without rounding lower back off pad. Press back up without hyperextending knees."
      },
      {
        name: "Bulgarian Split Squat",
        category: "LEGS",
        primary: "Quadriceps & Gluteus Medius",
        secondary: ["Hamstrings", "Calves"],
        trackingType: "WEIGHT_REPS",
        instructions: "Rear foot elevated on bench behind you. Lower front thigh parallel to floor, keeping torso upright or slight forward lean for glute emphasis."
      },
      {
        name: "Walking Lunge",
        category: "LEGS",
        primary: "Quadriceps & Glutes",
        secondary: ["Calves", "Core"],
        trackingType: "WEIGHT_REPS",
        instructions: "Step forward, lowering back knee towards floor. Push through front heel to step directly into next forward stride."
      },
      {
        name: "Lying Leg Curl",
        category: "LEGS",
        primary: "Hamstrings",
        secondary: ["Gastrocnemius"],
        trackingType: "WEIGHT_REPS",
        instructions: "Pad secured against back of lower calves. Curl legs upward towards glutes, hold peak squeeze for 1s, lower slowly."
      },
      {
        name: "Standing Calf Raise",
        category: "LEGS",
        primary: "Gastrocnemius",
        secondary: ["Soleus"],
        trackingType: "WEIGHT_REPS",
        instructions: "Balls of feet on edge of block. Full deep stretch at bottom, drive up onto big toes for 2-second peak contraction."
      },

      // Arms (Biceps & Triceps)
      {
        name: "Barbell Curl",
        category: "ARMS",
        primary: "Biceps Brachii",
        secondary: ["Brachialis", "Forearm Flexors"],
        trackingType: "WEIGHT_REPS",
        instructions: "Grip straight bar shoulder-width. Keep elbows pinned to sides, curl bar upward in smooth arc, squeeze biceps at top, and control eccentric descent."
      },
      {
        name: "Hammer Curl",
        category: "ARMS",
        primary: "Brachialis & Brachioradialis",
        secondary: ["Biceps Brachii"],
        trackingType: "WEIGHT_REPS",
        instructions: "Neutral palms-facing grip with dumbbells. Curl upward without twisting wrists to target the outer arm thickness and forearm."
      },
      {
        name: "Incline Dumbbell Curl",
        category: "ARMS",
        primary: "Biceps Brachii (Long Head)",
        secondary: ["Brachialis"],
        trackingType: "WEIGHT_REPS",
        instructions: "Set incline bench to 45-60 degrees. Allow arms to hang straight down for maximum long-head stretch before curling."
      },
      {
        name: "Skull Crusher",
        category: "ARMS",
        primary: "Triceps Brachii (Long & Medial Heads)",
        secondary: ["Anterior Deltoids"],
        trackingType: "WEIGHT_REPS",
        instructions: "Lie flat holding EZ-bar over chest. Keeping elbows fixed, lower bar towards forehead or crown of head, then extend forearms."
      },
      {
        name: "Cable Pushdown",
        category: "ARMS",
        primary: "Triceps Brachii (Lateral Head)",
        secondary: ["Medial Head"],
        trackingType: "WEIGHT_REPS",
        instructions: "Overhand grip on straight or V-bar. Lock elbows beside ribs and push straight down until full lockout."
      },
      {
        name: "Rope Pushdown",
        category: "ARMS",
        primary: "Triceps Brachii (Lateral Head)",
        secondary: ["Medial Head"],
        trackingType: "WEIGHT_REPS",
        instructions: "Spread rope ends outward at bottom of movement for peak lateral tricep squeeze."
      },
      {
        name: "Close-Grip Bench Press",
        category: "ARMS",
        primary: "Triceps Brachii",
        secondary: ["Pectoralis Major", "Anterior Deltoids"],
        trackingType: "WEIGHT_REPS",
        instructions: "Grip bar shoulder-width apart. Keep elbows tucked close to ribs as you lower to lower chest and press up."
      },

      // Core & Abs
      {
        name: "Hanging Leg Raise",
        category: "CORE",
        primary: "Rectus Abdominis (Lower)",
        secondary: ["Hip Flexors", "Obliques"],
        trackingType: "BODYWEIGHT_REPS",
        instructions: "Hang from pull-up bar. Without swinging, lift legs straight out to 90 degrees or up to bar, curling pelvis inward."
      },
      {
        name: "Plank",
        category: "CORE",
        primary: "Transverse Abdominis",
        secondary: ["Rectus Abdominis", "Glutes", "Shoulders"],
        trackingType: "DURATION",
        instructions: "Rest on forearms and toes. Maintain a straight line from heels to crown of head, squeeze glutes, and brace core."
      },
      {
        name: "Russian Twist",
        category: "CORE",
        primary: "Internal & External Obliques",
        secondary: ["Rectus Abdominis"],
        trackingType: "WEIGHT_REPS",
        instructions: "Sit on floor with knees bent and feet elevated. Rotate torso from side to side touching weight or hands to floor."
      },
      {
        name: "Dragon Flags",
        category: "CORE",
        primary: "Full Anterior Core",
        secondary: ["Hip Flexors", "Lats"],
        trackingType: "BODYWEIGHT_REPS",
        instructions: "Lie on bench holding edge behind head. Lift entire body up supported only on upper back/shoulders, and lower slowly with straight torso."
      }
    ],

    DEFAULT_ROUTINES: [
      {
        id: "routine_pull",
        name: "PULL DAY (Back & Biceps)",
        split: "PULL",
        exercises: [
          "Pull-Up",
          "Barbell Bent-Over Row",
          "Lat Pulldown",
          "Seated Cable Row",
          "Dumbbell Row",
          "Deadlift",
          "Barbell Curl",
          "Hammer Curl",
          "Face Pull",
          "Rear Delt Fly"
        ]
      },
      {
        id: "routine_push",
        name: "PUSH DAY (Chest, Shoulders, Triceps)",
        split: "PUSH",
        exercises: [
          "Barbell Bench Press",
          "Incline Dumbbell Bench Press",
          "Overhead Barbell Press",
          "Dumbbell Lateral Raise",
          "Parallel Bar Dip",
          "Cable Pushdown",
          "Rope Pushdown",
          "Hanging Leg Raise"
        ]
      },
      {
        id: "routine_legs",
        name: "LEG DAY (Quads, Hams, Calves)",
        split: "LEGS",
        exercises: [
          "Back Squat",
          "Romanian Deadlift",
          "Leg Press",
          "Bulgarian Split Squat",
          "Walking Lunge",
          "Lying Leg Curl",
          "Standing Calf Raise",
          "Plank"
        ]
      },
      {
        id: "routine_arms",
        name: "ARMS HYPERTROPHY (Biceps & Triceps)",
        split: "ARMS",
        exercises: [
          "Close-Grip Bench Press",
          "Skull Crusher",
          "Barbell Curl",
          "Incline Dumbbell Curl",
          "Rope Pushdown",
          "Hammer Curl"
        ]
      },
      {
        id: "routine_chest_back",
        name: "CHEST & BACK SPLIT",
        split: "UPPER",
        exercises: [
          "Incline Barbell Bench Press",
          "Dumbbell Bench Press",
          "Cable Fly",
          "Pendlay Row",
          "Lat Pulldown",
          "Push-Up",
          "Dragon Flags"
        ]
      }
    ]
  };
})();
