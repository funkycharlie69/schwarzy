# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Schwarzy** is a PWA (Progressive Web App) gym workout tracker built with Nuxt 3, optimized for mobile devices (especially iOS). It's a client-side only app (`ssr: false`) that uses localStorage for all data persistence via VueUse's `useStorage`. The app focuses on tracking workout progression, providing form cues, and intelligent weight suggestions based on pain/performance ratings.

## Core Architecture

### State Management (Pinia)

The entire app state is managed by a single Pinia store at `stores/workout.ts`:

- **Single source of truth**: All data (exercises, logs, settings, programs) stored in localStorage via `useStorage('schwarzy-workout-data', {...})`
- **No backend**: 100% client-side persistence
- **Migration system**: The store includes `migrateExercises()` to handle schema updates when adding new properties

### Data Model (types/index.ts)

Key concepts:
- **Exercise**: Hardcoded list with phases (`rehab`, `free-weights`, `hypertrophy`), rep ranges, default weights, and form cues
- **WorkoutLog**: Date-based logs with sets (weight, reps, completed) and a `PainRating` ('flawless', 'strong', 'compromised', 'danger')
- **WorkoutProgram**: Optional structured programs that rotate through specific exercises per day
- **PainRating system**: Core feature that drives the "Iron Audit" weight suggestions

### Intelligent Features

1. **Ghost Sessions** (`getGhost`): Shows previous session data (sets, rating, volume) for the same exercise
2. **Iron Audit** (`getIronAudit`): Analyzes previous `PainRating` to suggest weight changes:
   - `flawless` → suggest +5kg
   - `strong` → suggest +2.5kg
   - `compromised` → maintain weight
   - `danger` → reduce 10%
3. **Program Auto-Rotation**: When using a program, completing a workout auto-advances to next day

### Page Flow

```
index.vue (context entry)
  ↓
gatekeeper.vue (warm-up reminder)
  ↓
workout.vue (main workout interface)
  ↓
exercise/[id].vue (individual exercise tracking)
  ↓
summary.vue (workout completion summary)
```

### Mobile Optimizations

This app is **heavily optimized for mobile touch interactions**:

- **Wake Lock API** (`composables/useWakeLock.ts`): Keeps screen on during workouts
- **Haptic Feedback** (`composables/useHaptic.ts`): Vibration patterns for user actions
- **Touch-specific CSS**:
  - `.touch-manipulation` class prevents iOS scrolling/zooming on button taps
  - `@click.prevent` on stepper buttons to prevent default iOS behaviors
  - Tailwind config includes `minHeight/minWidth: 'touch'` (44px) for touch targets
- **Viewport meta**: `maximum-scale=1, user-scalable=no` to prevent zoom
- **Apple PWA meta**: `apple-mobile-web-app-capable: yes`

### Design System (Tailwind)

Dark mode only (`darkMode: 'class'`, root div has class `dark`):
- Background: `#09090b` (zinc-950)
- Foreground: `#fafafa` (zinc-50)
- Accent colors: green, yellow, red, blue, purple
- Custom animations: `fade-in`, `slide-up`, `scale-in`

### Program Import System

See `PROGRAM_FORMAT.md` for full specification. Key points:
- JSON format with `version`, `program.name`, `program.description`, `program.days[]`
- Each day has `exerciseIds[]` that must match existing exercise IDs
- Optional `exercises[]` array to add custom exercises during import
- Import via Settings page using file input

## Development Patterns

### Component Structure

- `components/ui/`: Reusable base components (BaseButton, BaseInput, BaseSlider, etc.)
- `components/workout/`: Workout-specific components (SetInput, PainToggle, RestTimer, etc.)
- `components/charts/`: Chart components (WeightProgressChart)

### iOS-Specific Touch Handling

When adding buttons or interactive elements that use click handlers:
1. Add `@click.prevent` instead of `@click` to prevent iOS default behaviors
2. Add `touch-manipulation` class to prevent scrolling/zooming
3. Ensure minimum 44px touch target size

### Data Persistence

All data is automatically persisted via `useStorage` in the Pinia store. When modifying state:
- Changes are reactive and auto-saved to localStorage
- No need for manual save operations
- Consider migration logic when adding new properties to state

### TypeScript

- `typeCheck: false` and `strict: false` in nuxt.config.ts
- Types are defined but not strictly enforced during build
- Keep type definitions in `types/index.ts` for IDE support

## Key Files to Know

- `stores/workout.ts`: All business logic, state management, and computed values
- `types/index.ts`: Complete type definitions
- `nuxt.config.ts`: SSR disabled, modules configured, viewport meta
- `tailwind.config.js`: Dark mode colors, touch sizing, animations
- `app/app.vue`: Root component with wake lock initialization
- `PROGRAM_FORMAT.md`: Complete spec for program JSON format
