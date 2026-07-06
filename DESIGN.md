```markdown
# Design System Specification: The Kinetic Luminescence

## 1. Overview & Creative North Star
**Creative North Star: "The Digital Architect’s Atelier"**

This design system moves beyond the static portfolio. It is an immersive, high-end digital environment that mirrors the precision of a Tesla cockpit and the editorial elegance of a luxury tech journal. We are not building "pages"; we are crafting "volumes" of work held within a fluid, 3D space.

The system breaks the "template" look by utilizing **intentional asymmetry** and **kinetic depth**. While the underlying 8px grid provides the structural rigor of a Full Stack Developer, the visual layer uses overlapping glass modules and shifting gradients to suggest a living, breathing machine. This is "Luxury Futurism"—it is quiet, confident, and technologically superior.

---

## 2. Colors & Surface Philosophy
The palette is rooted in a "Near Black" void, allowing the vibrant primary accents to feel like light emitted from a screen rather than ink on a page.

### Color Tokens
- **Background:** `#0e0e0e` (The base canvas)
- **Primary Gradient:** `primary` (`#a3a6ff`) to `secondary` (`#c180ff`)
- **Accent Highlighting:** `tertiary` (`#47c4ff`) for interactive data points.
- **Error/Alert:** `error` (`#ff6e84`) – used sparingly like a warning light in a cockpit.

### The "No-Line" Rule
Traditional 1px borders are strictly prohibited for sectioning. Structural definition must be achieved through:
1.  **Tonal Shifts:** Moving from `surface` to `surface_container_low`.
2.  **Luminescent Shadows:** Using the `surface_tint` to create a glow rather than a dark shadow.
3.  **Negative Space:** Using generous 64px–128px gaps to define content blocks.

### Surface Hierarchy & Nesting
Treat the UI as stacked sheets of obsidian and frosted glass.
*   **Level 0 (Base):** `background` (#0e0e0e).
*   **Level 1 (Section):** `surface_container_low` (#131313) for large content areas.
*   **Level 2 (Cards):** `surface_container` (#1a1919) with a 20% opacity `outline_variant` "Ghost Border."
*   **Level 3 (Floating UI):** Glassmorphism modules using `surface_bright` at 40% opacity with a `backdrop-filter: blur(20px)`.

---

## 3. Typography
We utilize a dual-sans-serif approach to balance technical precision with editorial authority.

*   **Display & Headlines (Manrope):** Chosen for its geometric modernity. Use `display-lg` for hero statements with tight letter-spacing (-0.04em) to create a "block" of text impact.
*   **UI & Body (Inter):** Chosen for its legendary legibility. Used for technical descriptions and navigational elements.

**Hierarchy as Identity:**
*   **Display Large (3.5rem):** Reserved for name and primary tech stack.
*   **Headline Medium (1.75rem):** For project titles—always paired with a `primary` color "01" index number to emphasize order and precision.
*   **Label Medium (0.75rem):** All-caps with 0.1em tracking for category tags (e.g., "BACKEND", "SYSTEM DESIGN").

---

## 4. Elevation & Depth
Depth in this system is a product of light, not physics.

### The Layering Principle
Instead of shadows, use **Surface Nesting**. A code snippet card (`surface_container_highest`) should sit inside a project container (`surface_container`), creating a natural "lift" through increasing brightness.

### Ambient Glows
For active states, replace traditional drop shadows with an **Ambient Light Leak**. Use the `primary_dim` color with a 40px blur at 10% opacity, positioned slightly behind the element. This simulates a neon glow reflecting off a matte black surface.

### The "Ghost Border" Fallback
If a boundary is required for accessibility, use a 1px stroke of `outline_variant` at 15% opacity. It should be felt, not seen.

---

## 5. Components

### Buttons: The Interactive Trigger
*   **Primary:** A linear gradient from `primary` to `secondary`. On hover, the button scales by 1.05x and triggers a `primary_fixed` outer glow.
*   **Secondary:** Glassmorphic base (`surface_variant` at 30%) with a `primary` text label.
*   **Tertiary:** Text only (`on_surface_variant`), transitioning to `on_surface` with a subtle `primary` underline on hover.

### Cards: The Parallax Module
*   **Style:** `xl` (1.5rem) rounded corners.
*   **Interaction:** Implement a subtle 3D tilt effect (5 degrees) on hover.
*   **Content:** No dividers. Use `title-md` for headers and `body-sm` for descriptions, separated by 16px of vertical space.

### Form Elements: Sleek Inputs
*   **Input Field:** A simple bottom-border of `outline_variant`. On focus, the border animates into a `primary` to `secondary` gradient line, and the background shifts to `surface_container_high`.
*   **Selection Chips:** Use `secondary_container` for the active state with `on_secondary_container` text. Corners should be `full`.

### Tooltips & Overlays
*   **Material:** Semi-transparent `surface_bright` with 32px backdrop blur.
*   **Animation:** Scale-in from 95% with a 200ms "Spring" easing.

---

## 6. Do's and Don'ts

### Do:
*   **Use Asymmetry:** Place a `display-lg` headline on the left and a small `body-md` technical spec on the far right to create "High-End Editorial" tension.
*   **Embrace the Void:** Use the `background` color to let the content breathe. High density is the enemy of luxury.
*   **Animate Transitions:** Every route change or hover should feel "weighted" (use `cubic-bezier(0.16, 1, 0.3, 1)` for all transitions).

### Don't:
*   **No Hard Outlines:** Never use a 100% opaque border. It breaks the "3D light" illusion.
*   **No Pure White:** Use `on_surface_variant` (`#adaaaa`) for long-form body text to reduce eye strain and maintain the dark-mode premium feel. Pure white (`#ffffff`) is reserved for `display` and `headline` tokens only.
*   **No Standard Grids:** Avoid perfectly centered, symmetrical "3-column" project rows. Offset them by 40-80px to create a custom, hand-crafted feel.

---

## 7. Signature Texture: The "Glass-on-Vantablack"
To achieve the Tesla-inspired aesthetic, ensure that all floating modules use `backdrop-filter: blur(20px) saturate(180%)`. This creates a "liquid glass" effect where the underlying `background` is distorted but remains deep and sophisticated.```