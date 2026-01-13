# Workout Program Import Guide

## Overview
Schwarzy now supports importing custom workout programs in JSON format. This allows you to schedule specific exercises for each day and the app will automatically rotate through your program.

## Available Exercise IDs

Here are all the exercise IDs you can use in your programs:

### Phase 1: Rehab & Machines
- `leg-press` - Leg Press (Machine)
- `chest-press-machine` - Chest Press (Machine)
- `seated-cable-row` - Seated Cable Row
- `lat-pulldown` - Lat Pulldown
- `face-pulls` - Cable Face Pulls
- `bicep-curl-machine` - Bicep Curl (Machine)
- `tricep-pushdown-rope` - Tricep Pushdown (Rope)
- `shoulder-press-machine` - Shoulder Press (Machine)
- `lateral-raise-machine` - Lateral Raise (Machine)
- `tricep-press-machine` - Tricep Press (Machine)
- `pec-fly-machine` - Pec Fly (Machine)
- `rear-delt-fly-machine` - Rear Delt Fly (Machine)
- `assisted-dip` - Dip (Assisted)
- `assisted-chin-up` - Chin-Up (Assisted)
- `glute-bridge-machine` - Glute Bridge (Machine)

### Phase 2: Free Weights & Stability
- `goblet-squat` - Goblet Squat
- `db-floor-press-neutral` - DB Floor Press (Neutral Grip)
- `db-hammer-curl` - DB Hammer Curls
- `single-arm-db-row` - Single Arm DB Row
- `walking-lunges` - Walking Lunges
- `plank` - Plank

### Phase 3: Hypertrophy & Strength
- `incline-db-press` - Incline DB Press
- `romanian-deadlift-db` - Romanian Deadlift (Dumbbells)
- `assisted-pull-up` - Assisted Pull-Up
- `pullup-bar` - Pull-Up (Unassisted)
- `cable-chest-fly` - Cable Chest Fly
- `overhead-press-seated-db` - Seated DB Overhead Press
- `leg-extension` - Leg Extension
- `leg-curl` - Leg Curl (Seated/Lying)

## Program JSON Format

### Basic Structure
```json
{
  "version": "1.0.0",
  "program": {
    "name": "Your Program Name",
    "description": "Brief description of your program",
    "days": [
      {
        "dayNumber": 1,
        "name": "Day Name (e.g., Push Day)",
        "exerciseIds": ["exercise-id-1", "exercise-id-2", "exercise-id-3"]
      }
    ]
  }
}
```

### Required Fields
- `version`: Must be "1.0.0"
- `program.name`: Name of your workout program
- `program.description`: Description (can be empty string)
- `program.days`: Array of day objects
  - `dayNumber`: Sequential number (1, 2, 3, etc.)
  - `name`: Name for this day
  - `exerciseIds`: Array of exercise IDs (must match IDs from the list above)

### Optional: Adding Custom Exercises

If you want to add exercises that aren't in the default list, include an `exercises` array:

```json
{
  "version": "1.0.0",
  "program": {
    "name": "Custom Program",
    "description": "Program with custom exercises",
    "days": [
      {
        "dayNumber": 1,
        "name": "Full Body",
        "exerciseIds": ["leg-press", "custom-exercise-id"]
      }
    ],
    "exercises": [
      {
        "id": "custom-exercise-id",
        "name": "My Custom Exercise",
        "defaultCue": "Form cues and instructions",
        "phase": "hypertrophy",
        "repRangeMin": 8,
        "repRangeMax": 12,
        "imageSearchQuery": "custom exercise name gym"
      }
    ]
  }
}
```

## How It Works

1. **Import Your Program**: Go to Settings → Import Program and select your JSON file
2. **Auto-Rotation**: The app will show only the exercises for the current day
3. **After Completing a Workout**: When you finish a workout, the app automatically advances to the next day
4. **Cycling**: After the last day, it cycles back to Day 1
5. **Manual Override**: You can manually select which day to do in Settings

## Sample Programs

Four sample programs are included in the `sample-programs/` directory:

### 1. Upper/Lower 4-Day Split (`upper-lower-split.json`)
- Day 1: Upper A (6 exercises)
- Day 2: Lower A (4 exercises)
- Day 3: Upper B (5 exercises)
- Day 4: Lower B (4 exercises)

### 2. Push/Pull/Legs 6-Day Split (`push-pull-legs.json`)
- Day 1: Push A (5 exercises)
- Day 2: Pull A (5 exercises)
- Day 3: Legs A (4 exercises)
- Day 4: Push B (4 exercises)
- Day 5: Pull B (4 exercises)
- Day 6: Legs B (4 exercises)

### 3. Machine-Focused 4-Day Split (`machine-focused-split.json`)
- Day 1: Push A - Chest, Shoulders, Triceps (7 exercises)
- Day 2: Pull A - Back, Biceps (7 exercises)
- Day 3: Legs A - Quads, Hamstrings, Glutes (6 exercises)
- Day 4: Push B - Strength Focus (6 exercises)
- Day 5: Pull B - Volume Focus (6 exercises)
- Day 6: Legs B - Hamstring & Glute Focus (6 exercises)

### 4. Machine-Only 3-Day Full Body (`machine-only-3day.json`)
- Day 1: Full Body A (7 exercises)
- Day 2: Full Body B (7 exercises)
- Day 3: Full Body C (7 exercises)

## Creating Your Own Program

1. Copy one of the sample programs as a template
2. Modify the `name` and `description`
3. Adjust the number of days
4. For each day:
   - Set the `dayNumber` (1, 2, 3, etc.)
   - Set the `name` (e.g., "Upper Body", "Leg Day")
   - Add exercise IDs from the list above
5. Save as a `.json` file
6. Import via Settings in the app

## Tips

- Keep exercise IDs exactly as listed (case-sensitive)
- You can repeat exercises across multiple days
- Days will auto-rotate, so plan accordingly (Day 6 → Day 1)
- All your workout history is preserved when importing a program
- You can clear the program anytime to return to free mode (all exercises visible)

## Returning to Free Mode

If you want to stop using a program and see all exercises organized by phase again:
1. Go to Settings
2. Scroll to Workout Programs section
3. Click "Clear Program"

Your workout history will remain intact.
