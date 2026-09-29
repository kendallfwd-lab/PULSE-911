---
name: Civic Pulse
colors:
  surface: '#10131a'
  surface-dim: '#10131a'
  surface-bright: '#363940'
  surface-container-lowest: '#0b0e14'
  surface-container-low: '#191c22'
  surface-container: '#1d2026'
  surface-container-high: '#272a31'
  surface-container-highest: '#32353c'
  on-surface: '#e1e2eb'
  on-surface-variant: '#e6bcbc'
  inverse-surface: '#e1e2eb'
  inverse-on-surface: '#2e3037'
  outline: '#ad8887'
  outline-variant: '#5d3f3f'
  surface-tint: '#ffb3b3'
  primary: '#ffb3b3'
  on-primary: '#680015'
  primary-container: '#ff5261'
  on-primary-container: '#5b0011'
  inverse-primary: '#bf002f'
  secondary: '#4cd6fb'
  on-secondary: '#003642'
  secondary-container: '#00b2d6'
  on-secondary-container: '#003f4e'
  tertiary: '#ffba27'
  on-tertiary: '#422c00'
  tertiary-container: '#bd8700'
  on-tertiary-container: '#392600'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad9'
  primary-fixed-dim: '#ffb3b3'
  on-primary-fixed: '#400009'
  on-primary-fixed-variant: '#920022'
  secondary-fixed: '#b3ebff'
  secondary-fixed-dim: '#4cd6fb'
  on-secondary-fixed: '#001f27'
  on-secondary-fixed-variant: '#004e5f'
  tertiary-fixed: '#ffdea9'
  tertiary-fixed-dim: '#ffba27'
  on-tertiary-fixed: '#271900'
  on-tertiary-fixed-variant: '#5e4100'
  background: '#10131a'
  on-background: '#e1e2eb'
  surface-variant: '#32353c'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Space Grotesk
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.04em
  label-md:
    fontFamily: Space Grotesk
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.06em
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system merges the editorial fluency and engagement dynamics of modern social media with the mission-critical clarity of emergency dispatch. It serves civic leaders, first responders, community watch members, and everyday urbanites. The interface elicits calm authority, hyper-situational awareness, civic solidarity, and rapid legibility under stress. 

The aesthetic is a hybrid of **Curated Social Minimalism** and **Technical Glassmorphism**:
- Ultra-deep, atmospheric dark mode as the default baseline to reduce glare during nighttime incidents and focus optical energy on vital data.
- High-fidelity visual cards and live media carousels inspired by mobile-first social networks, overlaid with telemetry indicators and crisp geospatial metadata.
- Pervasive tactile refinement: hairline glass borders, controlled chromatic backdrops, and luminous indicators that prioritize critical life-safety information over decorative noise.

## Colors

The palette balances urgent civic triggers with neutral social containment:

- **Emergency Crimson (`#FF2E4D`)**: Primary action token. Reserved for severe incident reporting, SOS panic triggers, active hazard states, and critical broadcast badges. Used decisively to prevent alert fatigue.
- **Technical Azure (`#00B4D8`)**: Secondary token. Denotes verified responder updates, live telemetry, interactive routing, telemetry maps, and municipal validation checkmarks.
- **Civic Amber (`#FFB703`)**: Tertiary token. Reserved for moderate cautions, developing situation statuses, and community advisory notices.
- **Obsidian Core (`#0B0E14`)**: Root neutral baseline. Surfaces scale upwards across subtle alpha steps (`#121721`, `#1A202C`, `#242C3D`) to create atmospheric depth without relying on stark solid borders.
- **Optic White (`#F8FAFC`) & Slate Muted (`#94A3B8`)**: High-contrast, clean typographic hierarchy ensuring legibility under variable lighting conditions.

## Typography

Typographic scale is structured around dual character profiles:
- **Plus Jakarta Sans** provides a contemporary, friendly, yet razor-sharp voice for narrative social feeds, public comments, incident descriptions, and major headers. Its sculpted geometric curves feel human and immediate.
- **Space Grotesk** is deployed across telemetry labels, timestamps, emergency badges, incident codes, and coordinate metadata. Its monospaced-adjacent, technical structure reinforces precision, real-time speed, and civic authority.

## Layout & Spacing

The layout is built on a responsive 12-column adaptive grid that shifts dynamically between handheld operations and desktop command views:

- **Mobile Viewport (360px – 767px)**: Single central stream (max-width 560px) optimized for one-thumb scrolling. Stories and live emergency pings run horizontally along the top edge. Feed cards edge out with `space-sm` margins to maximize real estate for high-resolution imagery and mini-maps.
- **Desktop Viewport (1024px+)**: A three-pane modular cockpit:
  - *Left Column (260px)*: Persistent civic navigation, alert triggers, profile settings.
  - *Center Column (580px - 680px)*: High-fidelity social incident stream, community discussion threads, real-time story carousel.
  - *Right Column (Remaining)*: Persistent live situational map with active emergency heat zones, filterable responder channels, and localized SOS feeds.
- **Vertical Rhythm**: Spacing scales strictly along a 4px/8px module. Micro-elements leverage `space-xs` and `space-sm`, while media content blocks isolate with `space-lg` and `space-xl` intervals to eliminate visual clutter during high-stress usage.

## Elevation & Depth

Visual depth is achieved through layered glassmorphism combined with subtle ambient chromatic blooms rather than dense opaque drop-shadows:

- **Surface Base (Level 0)**: Background `#0B0E14` void.
- **Card Substrates (Level 1)**: Translucent obsidian `#121721` tinted at 80% opacity with a `16px` backdrop-filter blur. Encased in a `1px` stroke of `rgba(255, 255, 255, 0.08)` to define crisp boundaries over dynamic feeds and maps.
- **Floating Overlays & Live Alerts (Level 2)**: Elevated modals, bottom sheets, and sticky header bars leverage `#1A202C` at 88% opacity, `24px` backdrop blur, and diffused ambient glows:
  - *Emergency State Glow*: `0 8px 32px -4px rgba(255, 46, 77, 0.22)`
  - *Verified State Glow*: `0 8px 32px -4px rgba(0, 180, 216, 0.20)`
- **Interactive States**: Hover and active compressions trigger subtle inner glows (`inset 0 1px 0 rgba(255, 255, 255, 0.15)`) rather than physical displacement, maintaining a clean glass-tactile feel.

## Shapes

The geometric signature uses rounded silhouettes that balance modern social interface conventions with quick-tap field utility:

- Standard buttons, text inputs, and feed media containers use an 8px (`0.5rem`) radius to preserve structural precision.
- Incident cards, story containers, dynamic sheets, and embedded map modules adopt a softened 16px (`1rem`) corner radius.
- Story rings, verified badges, live broadcasting pings, and action pills utilize full circular/pill geometries (`9999px`) to evoke quick social glanceability.

## Components

### Live Incident Stories (Top Carousel)
- Circular visual avatars with interactive outer status rings: pulsing crimson gradient (`#FF2E4D` to `#FF6B8B`) for uncontained emergencies; neon technical blue (`#00B4D8`) for verified authority briefings; muted slate for closed reports.
- Includes a bottom-anchored micro-pill in `Space Grotesk` indicating distance (e.g., `0.4 km`) or timestamp (e.g., `LIVE`).

### Social Incident Cards
- **Header**: Community reporter avatar, verified badge (azure checkmark), incident tag pill (`[CODE RED]`, `[TRAFFIC]`, `[MEDICAL]`), relative timestamp, and overflow action icon.
- **Media Body**: High-resolution civic visual (aspect-ratio 4:5 or 16:9) with interactive split-toggle to instantly flip the card view into an embedded interactive live map tile.
- **Engagement Bar**: Instagram-style social reactions adapted for civic validation: "Verify/Witness" button, localized comment drawer, instant resharing to emergency networks, and upvote/situation confirmed counter.

### Emergency SOS Trigger
- Dedicated persistent floating action module with high-contrast crimson fill (`#FF2E4D`), white typography, and subtle rhythmic outward pulse ring animation. Requires a hold-to-confirm gesture (1.5s press) to prevent false dispatches.

### Status Badges & Chips
- Semitransparent fill (`15%` alpha of base tone) paired with solid `1px` perimeter stroke and solid dot indicator.
- Typography strictly uppercase in `Space Grotesk` (`label-sm`).
- Categorized into: **CRITICAL** (Crimson), **ACTIVE RESPONDER** (Azure), **ADVISORY** (Amber), and **RESOLVED** (Emerald/Muted).

### Input Fields & Search Bars
- Glass-backed input surfaces (`#121721`) with `1px` subtle boundary (`rgba(255, 255, 255, 0.12)`).
- Prefix icons for geolocation pin, media attachment, and voice reporting.
- Focus transition smoothly activates an Azure border glow with `0 0 0 3px rgba(0, 180, 216, 0.25)`.