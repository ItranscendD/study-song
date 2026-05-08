# StudySong — Design System
**Version:** 1.0  
**Platform:** Mobile-first (iOS + Android)  
**Audience:** Students aged 13–30  
**Tone:** Fast · Musical · Energetic · Clear  
**Design language:** Kinetic Minimalism

---

## 1. Design Principles

| Principle | What it means in practice |
|-----------|--------------------------|
| **Instant clarity** | Every screen answers: What do I do? How long? What do I get? |
| **Music-first feel** | UI breathes — rhythm, motion, and sound cues are native to every interaction |
| **Zero friction** | Max 2 primary actions per screen. No dead ends. Always a next step. |
| **Accessible by default** | WCAG AA contrast. 44px touch targets. Screen reader labels. Motion toggle. |
| **Young-first** | Visual energy of TikTok, simplicity of Duolingo, confidence of Spotify |

---

## 2. Color System

### 2.1 Core Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#7C4DFF` | CTAs, active states, key accents |
| `--color-primary-light` | `#A07BFF` | Hover states, gradient ends |
| `--color-primary-dim` | `#3D1FAB` | Pressed states, deep accents |
| `--color-accent` | `#FFB347` | Genre/era tags, secondary highlights |
| `--color-accent-dim` | `#CC8A2E` | Amber pressed state |
| `--color-success` | `#00E5A0` | Generation complete, saves confirmed |
| `--color-success-dim` | `#007A56` | Success text on light backgrounds |
| `--color-error` | `#FF6B6B` | Errors, warnings, destructive actions |
| `--color-error-dim` | `#B33030` | Error text on light backgrounds |

### 2.2 Surface Palette — Dark Mode (Default)

| Token | Hex | Usage |
|-------|-----|-------|
| `--surface-bg` | `#0E0E12` | Page background |
| `--surface-card` | `#1C1C24` | Cards, sheets, containers |
| `--surface-elevated` | `#252530` | Modals, popovers, elevated cards |
| `--surface-input` | `#14141A` | Input fields, text areas |
| `--surface-overlay` | `rgba(14,14,18,0.85)` | Backdrop for modals |

### 2.3 Text Palette

| Token | Dark mode | Usage |
|-------|-----------|-------|
| `--text-primary` | `#F1F0FF` | Headings, main body |
| `--text-secondary` | `#9E9BB8` | Labels, subtitles, hints |
| `--text-muted` | `#5A5870` | Placeholders, disabled |
| `--text-on-primary` | `#FFFFFF` | Text on violet buttons |
| `--text-on-accent` | `#1A0A00` | Text on amber surfaces |

### 2.4 Subject Color Map

| Subject | Pill bg | Pill text | Folder accent |
|---------|---------|-----------|---------------|
| Biology | `#D4F5E3` | `#1A5C3A` | `#2ECC71` |
| Chemistry | `#D4EAF5` | `#1A3E5C` | `#3498DB` |
| History | `#F5ECD4` | `#5C3E1A` | `#E67E22` |
| Law | `#EDD4F5` | `#4A1A5C` | `#9B59B6` |
| Mathematics | `#D4F5F5` | `#1A5C5C` | `#1ABC9C` |
| Languages | `#F5D4D4` | `#5C1A1A` | `#E74C3C` |
| Geography | `#D4F5EA` | `#1A5C45` | `#27AE60` |
| Music | `#F5D4F0` | `#5C1A52` | `#E91E8C` |

---

## 3. Typography

### Font Stack

```
Display / Headings: "Syne", sans-serif
Body / UI:          "DM Sans", sans-serif
Lyrics editor:      "DM Mono", monospace
```

### Type Scale

| Role | Font | Size | Weight | Line height |
|------|------|------|--------|-------------|
| `display-xl` | Syne | 32px | 800 | 1.1 |
| `display-lg` | Syne | 26px | 700 | 1.2 |
| `display-md` | Syne | 22px | 700 | 1.25 |
| `heading` | Syne | 18px | 700 | 1.3 |
| `subheading` | DM Sans | 16px | 600 | 1.4 |
| `body-lg` | DM Sans | 16px | 400 | 1.6 |
| `body-md` | DM Sans | 14px | 400 | 1.6 |
| `label` | DM Sans | 13px | 500 | 1.4 |
| `caption` | DM Sans | 12px | 400 | 1.5 |
| `lyric-display` | Syne | 28px | 700 | 1.3 |
| `lyric-body` | DM Sans | 16px | 400 | 1.7 |
| `code` | DM Mono | 14px | 400 | 1.6 |

---

## 4. Spacing System (base 4px)

| Token | Value |
|-------|-------|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-10` | 40px |
| `--space-12` | 48px |

---

## 5. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 6px | Tags, chips, small badges |
| `--radius-md` | 10px | Input fields, small cards |
| `--radius-lg` | 16px | Cards, sheets, modals |
| `--radius-xl` | 24px | Full-width CTA buttons |
| `--radius-pill` | 999px | Pills |
| `--radius-circle` | 50% | Avatars, play buttons |

---

## 6. Shadows & Elevation

| Level | CSS value |
|-------|-----------|
| `elevation-0` | none |
| `elevation-1` | `0 2px 12px rgba(124,77,255,0.08)` |
| `elevation-2` | `0 4px 24px rgba(124,77,255,0.16)` |
| `elevation-glow` | `0 0 32px rgba(124,77,255,0.30)` |

---

## 7. Motion Tokens

| Token | Duration | Easing |
|-------|----------|--------|
| `motion-instant` | 100ms | ease |
| `motion-fast` | 200ms | ease-out |
| `motion-base` | 280ms | cubic-bezier(0.4,0,0.2,1) |
| `motion-enter` | 340ms | cubic-bezier(0.34,1.56,0.64,1) |
| `motion-slow` | 500ms | ease-in-out |

---

## 8. Screen Inventory

| ID | Screen | File |
|----|--------|------|
| S01 | Splash | `index.html` |
| S03–06 | Onboarding | `onboarding.html` |
| S07 | Home | `home.html` |
| S08 | Note input | `input.html` |
| S10–12 | Customisation | `customize.html` |
| S13 | Generation loading | `export.html` |
| S14 | Player | `player.html` |
| S16 | Study mode | `study.html` |
| S18 | Library | `library.html` |
| S20 | Search | `search.html` |
| S23 | Achievements | `achievements.html` |
| S24 | Settings | `settings.html` |
| S25 | Paywall | `paywall.html` |
| S26 | Empty library | `empty-library.html` |
| S27 | Empty home | `empty-home.html` |
| S28 | Error: generation | `error-generation.html` |
| S29 | Error: upload | `error-upload.html` |
| S30 | Regenerate dialog | `modal-regenerate.html` |
