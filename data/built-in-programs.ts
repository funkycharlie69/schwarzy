import type { WorkoutProgram } from '~/types'

// Built-in workout programs
export const BUILT_IN_PROGRAMS: WorkoutProgram[] = [
  {
    id: 'upper-lower-4day',
    name: 'Upper/Lower 4-Day Split',
    description: 'Beginner-friendly split for consistent progress',
    days: [
      {
        dayNumber: 1,
        name: 'Upper A',
        exerciseIds: [
          'chest-press-machine',
          'lat-pulldown',
          'overhead-press-seated-db',
          'seated-cable-row',
          'bicep-curl-machine',
          'tricep-pushdown-rope'
        ]
      },
      {
        dayNumber: 2,
        name: 'Lower A',
        exerciseIds: [
          'leg-press',
          'leg-curl',
          'leg-extension',
          'walking-lunges'
        ]
      },
      {
        dayNumber: 3,
        name: 'Upper B',
        exerciseIds: [
          'incline-db-press',
          'single-arm-db-row',
          'cable-chest-fly',
          'face-pulls',
          'db-hammer-curl'
        ]
      },
      {
        dayNumber: 4,
        name: 'Lower B',
        exerciseIds: [
          'goblet-squat',
          'romanian-deadlift-db',
          'leg-extension',
          'leg-curl'
        ]
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'push-pull-legs-6day',
    name: 'Push/Pull/Legs 6-Day Split',
    description: 'Intermediate program focusing on progressive overload',
    days: [
      {
        dayNumber: 1,
        name: 'Push A',
        exerciseIds: [
          'incline-db-press',
          'chest-press-machine',
          'overhead-press-seated-db',
          'tricep-pushdown-rope',
          'cable-chest-fly'
        ]
      },
      {
        dayNumber: 2,
        name: 'Pull A',
        exerciseIds: [
          'assisted-pull-up',
          'lat-pulldown',
          'seated-cable-row',
          'face-pulls',
          'bicep-curl-machine'
        ]
      },
      {
        dayNumber: 3,
        name: 'Legs A',
        exerciseIds: [
          'leg-press',
          'leg-extension',
          'leg-curl',
          'walking-lunges'
        ]
      },
      {
        dayNumber: 4,
        name: 'Push B',
        exerciseIds: [
          'chest-press-machine',
          'cable-chest-fly',
          'overhead-press-seated-db',
          'tricep-pushdown-rope'
        ]
      },
      {
        dayNumber: 5,
        name: 'Pull B',
        exerciseIds: [
          'lat-pulldown',
          'single-arm-db-row',
          'seated-cable-row',
          'db-hammer-curl'
        ]
      },
      {
        dayNumber: 6,
        name: 'Legs B',
        exerciseIds: [
          'leg-press',
          'romanian-deadlift-db',
          'leg-curl',
          'leg-extension'
        ]
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'full-body-3day',
    name: 'Full Body 3-Day Split',
    description: 'Perfect for beginners or busy schedules',
    days: [
      {
        dayNumber: 1,
        name: 'Full Body A',
        exerciseIds: [
          'leg-press',
          'chest-press-machine',
          'lat-pulldown',
          'overhead-press-seated-db',
          'bicep-curl-machine',
          'tricep-pushdown-rope'
        ]
      },
      {
        dayNumber: 2,
        name: 'Full Body B',
        exerciseIds: [
          'goblet-squat',
          'incline-db-press',
          'seated-cable-row',
          'leg-extension',
          'face-pulls',
          'db-hammer-curl'
        ]
      },
      {
        dayNumber: 3,
        name: 'Full Body C',
        exerciseIds: [
          'romanian-deadlift-db',
          'cable-chest-fly',
          'assisted-pull-up',
          'leg-curl',
          'walking-lunges',
          'single-arm-db-row'
        ]
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    "id": "iron-will-rehab-rebuild",
    "name": "The Iron Will: Rehab & Rebuild Cycle",
    "description": "A 2-week rotation cycle (3 days/week) designed for mass building while protecting the left shoulder and elbow. Heavy emphasis on machines and stabilizers.",
    "days": [
      {
        "dayNumber": 1,
        "name": "Day 1: Foundation Push & Pull",
        "exerciseIds": [
          "leg-press",
          "chest-press-machine",
          "seated-cable-row",
          "face-pulls",
          "bicep-curl-machine"
        ]
      },
      {
        "dayNumber": 2,
        "name": "Day 2: Posterior Chain & Arms",
        "exerciseIds": [
          "leg-curl",
          "lat-pulldown",
          "tricep-pushdown-rope",
          "db-hammer-curl",
          "leg-extension"
        ]
      },
      {
        "dayNumber": 3,
        "name": "Day 3: Stability & Core",
        "exerciseIds": [
          "goblet-squat",
          "chest-press-machine",
          "assisted-pull-up",
          "face-pulls",
          "plank-hold"
        ]
      },
      {
        "dayNumber": 4,
        "name": "Day 4: Volume Legs & Chest",
        "exerciseIds": [
          "leg-press",
          "chest-press-machine",
          "seated-cable-row",
          "tricep-pushdown-rope",
          "calf-raises-machine"
        ]
      },
      {
        "dayNumber": 5,
        "name": "Day 5: Vertical Pull & Hinge",
        "exerciseIds": [
          "romanian-deadlift-db",
          "lat-pulldown",
          "incline-db-press",
          "bicep-curl-machine",
          "face-pulls"
        ]
      },
      {
        "dayNumber": 6,
        "name": "Day 6: Full Body Flush",
        "exerciseIds": [
          "leg-extension",
          "leg-curl",
          "assisted-pull-up",
          "db-hammer-curl",
          "cable-rope-crunch"
        ]
      }
    ],
    "createdAt": "2025-12-18T19:50:00.000Z"
  }
]
