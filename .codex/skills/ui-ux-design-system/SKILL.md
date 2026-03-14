---
name: ui-ux-design-system
description: Use this skill when creating UI components, pages, dashboards, forms, or layouts. Ensures clean, beautiful, consistent UI with strong UX principles.
---

# UI / UX Design System Skill

This skill ensures all generated UI follows modern design standards with emphasis on:

- clarity
- simplicity
- consistency
- accessibility
- responsive layouts
- excellent user experience

Use this skill whenever creating:
- UI components
- pages
- dashboards
- forms
- navigation systems
- modals
- cards
- tables
- settings panels

---

# Core Design Principles

1. **Clarity over decoration**
   - UI should communicate purpose instantly.
   - Avoid unnecessary visual noise.

2. **Consistency**
   - Use consistent spacing, typography, colors, and component behavior.

3. **Hierarchy**
   - Important elements must stand out visually.
   - Use size, weight, and spacing to guide attention.

4. **Simplicity**
   - Every element must serve a purpose.

5. **Accessibility**
   - Ensure readable contrast
   - Keyboard navigable components
   - Clear focus states

---

# Layout Rules

Follow a structured layout system.

Recommended layout:
Page
├ Header
├ Content
└ Footer / Actions



Guidelines:

- Use max width containers
- Avoid full width content unless necessary
- Maintain strong alignment
- Use whitespace generously

---

# Spacing System

Use a consistent spacing scale.


4px -> micro spacing
8px -> small spacing
12px -> tight UI spacing
16px -> standard spacing
24px -> section spacing
32px -> large spacing
48px -> page spacing


Rules:

- Maintain consistent vertical rhythm
- Avoid arbitrary spacing values

---

# Typography Rules

Typography hierarchy:
H1 → Page Title
H2 → Section Title
H3 → Sub Section
Body → Main content
Caption → Helper text


Guidelines:

- Maximum two font families
- Use clear contrast between heading and body
- Maintain consistent line height

---

# Color Usage

Use semantic colors rather than arbitrary colors.


Primary
Secondary
Success
Warning
Error
Neutral


Rules:

- Primary color for actions
- Error only for errors
- Avoid excessive color usage
- Prefer neutral UI with accent colors

---

# Component Design Rules

All components must follow:

1. Clear purpose
2. Predictable behavior
3. Minimal styling complexity
4. Consistent spacing
5. Proper hover and focus states

---

# Buttons

Button hierarchy:

Primary
Secondary
Ghost
Danger

Guidelines:

- Only one primary action per section
- Buttons must include hover state
- Buttons must include disabled state

---

# Forms

Forms should be:

- simple
- minimal
- easy to scan

Rules:

- Label above input
- Clear error messages
- Inline validation when possible
- Group related inputs

---

# Cards

Cards should contain:

Title
Description
Optional Actions
Optional Metadata


Guidelines:

- Avoid clutter
- Use subtle shadows
- Maintain padding consistency

---

# Tables

Tables should support:

- sorting
- filtering
- pagination

Guidelines:

- Avoid overcrowding
- Use zebra rows for readability
- Align numeric values to the right

---

# Navigation

Navigation should be:

- predictable
- easy to scan
- consistent across pages

Rules:

- Highlight active route
- Avoid deep nested navigation
- Use icons only when helpful

---

# Responsiveness

UI must work across:

- desktop
- tablet
- mobile

Guidelines:

- Stack elements vertically on mobile
- Avoid horizontal scrolling
- Touch friendly targets (44px minimum)

---

# Animations

Animations should be subtle and purposeful.

Guidelines:

- Use transitions for hover and modal appearance
- Avoid distracting motion
- Prefer 150ms–250ms transitions

---

# Loading States

Always include loading states.

Examples:

- skeleton loaders
- progress indicators
- disabled buttons during submission

---

# Error States

Errors should be:

- visible
- helpful
- actionable

Example message:

"Unable to upload file. Please try again."

---

# Empty States

Empty states should guide users.

Example:


No files uploaded yet.
Upload a file to get started.


Include a clear call-to-action.

---

# AI UI Generation Rules

When generating UI:

1. Prefer simple layouts over complex ones
2. Maintain consistent spacing
3. Avoid visual clutter
4. Prioritize readability
5. Ensure responsive behavior
6. Ensure accessible color contrast

---

# Preferred Modern UI Patterns

Use modern patterns such as:

- cards
- modular dashboards
- clean sidebars
- minimal navigation bars
- contextual actions
- progressive disclosure

---

# Example Use Cases

This skill should activate for prompts like:

- "Create a dashboard UI"
- "Build a settings page"
- "Create a form"
- "Design a file manager interface"
- "Create a clean admin panel"

Nice. Let’s upgrade your **UI skill** so Codex also creates **smooth, modern animations** without turning the interface into a disco ball 🎭✨. The goal is **subtle motion that improves UX**, not random spinning buttons.

You can extend your skill or create a new one like:

```
.codex/skills/ui-ux-motion-design/SKILL.md
```

---

# SKILL.md (UI + Animation + UX)

```md
---
name: ui-ux-motion-design
description: Use when generating UI components or pages to ensure clean design, consistent layout, and smooth UX-focused animations.
---

# UI / UX Motion Design Skill

This skill ensures UI is:
- clean
- visually consistent
- easy to navigate
- enhanced with smooth animations

Animations must improve usability, feedback, and flow.

---

# Core Motion Principles

Animations must follow these rules:

1. **Purposeful**
Animations should provide feedback or guide user attention.

2. **Fast**
Animations should feel responsive.

3. **Subtle**
Avoid flashy or distracting effects.

4. **Consistent**
Use the same animation patterns across the app.

---

# Animation Timing

Recommended durations:

```

micro interaction → 100ms–150ms
hover animation → 150ms
dropdown / tooltip → 150ms–200ms
modal / drawer → 200ms–300ms
page transition → 250ms–350ms

```

Easing:

```

ease-out for entrances
ease-in for exits
ease-in-out for UI transitions

````

---

# Hover Interactions

Interactive elements must provide feedback.

Examples:

- button lift
- color change
- subtle scale
- shadow increase

Example:

```css
transition: all 0.2s ease;
````

Hover pattern:

```
scale: 1 → 1.03
shadow: small → medium
```

---

# Button Animations

Buttons should feel interactive.

Recommended effects:

* hover elevation
* ripple effect
* slight scale

Example:

```
transform: scale(1.02)
box-shadow increase
```

---

# Page Transitions

Avoid abrupt page changes.

Use:

* fade in
* slide up
* subtle scale

Example transition:

```
opacity: 0 → 1
transform: translateY(10px) → translateY(0)
```

Duration:

```
250ms
```

---

# Modal / Drawer Animations

Modals should:

* fade background
* slide or scale in

Example:

```
opacity: 0 → 1
scale: 0.95 → 1
```

Drawer example:

```
translateX(100%) → translateX(0)
```

---

# List Animations

When lists update:

Use stagger animations.

Example:

```
item delay: 40ms
```

Benefits:

* smoother perception
* clearer hierarchy

---

# Loading Animations

Use modern loading indicators.

Preferred patterns:

* skeleton loaders
* shimmer effect
* progress bars

Avoid:

* infinite spinners when possible

---

# Microinteractions

Microinteractions improve UX.

Examples:

* checkbox toggle animation
* like button animation
* upload progress animation
* notification slide-in

---

# Motion Guidelines

Avoid:

* long animations
* bounce effects
* excessive rotation
* animation on every element

Use motion **sparingly and intentionally**.

---

# Preferred Animation Libraries

When generating code prefer:

React / Next.js:

* framer-motion
* motion
* tailwind transitions

Avoid heavy animation libraries.

---

# Framer Motion Example

Use framer-motion for complex animations.

Example pattern:

```tsx
<motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.25 }}
>
```

---

# Staggered List Example

```tsx
<motion.div
 initial="hidden"
 animate="visible"
 variants={{
   visible: {
     transition: { staggerChildren: 0.05 }
   }
 }}
>
```

---

# Accessibility for Motion

Respect reduced motion settings.

If user prefers reduced motion:

* disable large animations
* keep only essential transitions

---

# AI UI Generation Rules

When generating UI:

1. Include subtle motion
2. Ensure animations are fast
3. Avoid animation overload
4. Maintain consistent transitions
5. Use framer-motion for advanced effects
6. Prefer smooth fade + slide patterns
