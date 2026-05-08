# Master Prompt - HairLab Project Development

## Project Overview
HairLab is a Next.js 15 landing page for a hair restoration course. Built with TypeScript, Tailwind CSS v4, and Framer Motion.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Animations**: Framer Motion
- **Fonts**: Manrope (primary), Inter (body), Playfair Display (display - unused, kept for legacy)

## Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with fonts and LoadingScreen
│   ├── page.tsx           # Landing page
│   ├── globals.css        # Global styles with design tokens
│   ├── offer/             # Offer page
│   ├── lesson/            # Lesson page
│   ├── quiz/              # Quiz page
│   └── result/            # Quiz result page
├── components/
│   ├── LoadingScreen.tsx  # Loading screen with HAIRLAB logo
│   ├── WelcomePopup.tsx   # Welcome popup for new users
│   ├── PaymentModal.tsx   # Payment modal
│   ├── shared/            # Shared components (CTA, etc.)
│   ├── landing/           # Landing page components
│   │   ├── landing-page.tsx    # Main landing page component
│   │   ├── sections/           # Landing page sections
│   │   └── icons.tsx           # Icon components
│   ├── quiz/              # Quiz components
│   ├── offer/             # Offer page components
│   └── sections/          # General sections (hero, faq, etc.)
├── config/
│   ├── landing-content.ts # Centralized content for landing page
│   ├── payments.ts        # Payment URL configuration
│   └── feature-flags.ts  # Feature flags
└── lib/
    └── animations.ts      # Shared animation utilities (fadeUp, ease, viewport)
```

## Design System

### Colors (OKLCH)
- `--background`: oklch(0.965 0.012 70) - Cream background
- `--foreground`: oklch(0.235 0.018 35) - Dark text
- `--accent`: oklch(0.84 0.045 22) - Rose accent
- `--cocoa`: oklch(0.32 0.025 35) - Dark brown
- `--sand`: oklch(0.905 0.022 65) - Sand color
- `--primary`: oklch(0.235 0.018 35) - Primary dark

### Typography
- **Primary font**: Manrope (all text, including headings)
- **Font weights**: 400, 500, 600, 700
- **Letter spacing**: Negative for headings (-0.02em), normal for body

### Custom CSS Classes (km- prefix)
These are design system utilities defined in globals.css:
- `.km-container` - Container with max-width and padding
- `.km-section` - Section padding
- `.km-cta` - CTA button with variants (km-cta--dark, km-cta--light)
- `.km-hero-title` - Hero title styling
- `.km-section-title` - Section title styling
- `.km-lead` - Lead paragraph
- `.km-copy` - Body copy
- `.km-card` - Card component
- `.km-eyebrow` - Eyebrow text (uppercase, small)

## Code Conventions

### Component Structure
1. Use `"use client"` directive for client components
2. Import dependencies at the top
3. Type all props with TypeScript interfaces
4. Use named exports for components
5. Keep components focused and single-responsibility

### Styling
- **Primary approach**: Tailwind CSS classes
- **Secondary**: Custom CSS classes (km- prefix) for complex/reusable patterns
- **Avoid**: Inline styles (except for dynamic values)
- **Avoid**: `<style jsx>` blocks

### Data Management
- **Content**: Store in `src/config/landing-content.ts`
- **Configuration**: Store in appropriate config files (payments.ts, feature-flags.ts)
- **Avoid**: Hardcoding data in components

### Images
- Use `next/image` component
- **Above-the-fold**: Add `priority` prop
- **Below-the-fold**: Add `loading="lazy"` prop
- **Responsive**: Use `sizes` prop for optimal loading
- **Quality**: Use `quality={90-92}` for balance

### Animations
- Import from `@/lib/animations`: `fadeUp`, `ease`, `viewport`
- Use Framer Motion for scroll-triggered animations
- Keep animations subtle and performant

### Responsive Design
- Mobile-first approach
- Use Tailwind responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`
- Test on all breakpoints
- Use `touch-pan-x` for horizontal scroll carousels to prevent vertical scrolling

## SOLID Principles

### Single Responsibility
- Each component should have one reason to change
- Separate concerns: UI, data fetching, business logic

### Open/Closed
- Use composition over inheritance
- Make components extensible via props

### Liskov Substitution
- Ensure components can be substituted with their variants
- Maintain consistent prop interfaces

### Interface Segregation
- Keep component props minimal and focused
- Use optional props for flexibility

### Dependency Inversion
- Depend on abstractions (config, services) not concrete implementations
- Use dependency injection for testability

## Common Patterns

### Section Component
```tsx
"use client"

import { motion } from "framer-motion"
import { fadeUp } from "@/lib/animations"

export function SectionName() {
  return (
    <section className="km-section">
      <motion.div {...fadeUp()}>
        {/* Content */}
      </motion.div>
    </section>
  )
}
```

### Data from Config
```tsx
import { dataName } from "@/config/landing-content"

// Use dataName.map() instead of hardcoding
```

### CTA Button
```tsx
import { CTA } from "@/components/shared/CTA"

<CTA variant="dark">Button Text</CTA>
```

## Guidelines for New Features

1. **Check existing patterns first** - Look for similar components and follow the pattern
2. **Use centralized data** - Store content in config files
3. **Follow naming conventions** - Use descriptive names, kebab-case for files
4. **Type everything** - No `any` types
5. **Keep it simple** - Avoid over-engineering
6. **Test responsive** - Ensure works on mobile, tablet, desktop
7. **Performance first** - Lazy load images, optimize bundles
8. **Accessibility** - Use semantic HTML, proper ARIA labels

## File Naming
- Components: PascalCase (e.g., `HeroSection.tsx`)
- Utilities: camelCase (e.g., `animations.ts`)
- Config: kebab-case (e.g., `landing-content.ts`)
- Pages: lowercase (e.g., `page.tsx`)

## Git Workflow
- Commit frequently with descriptive messages
- Use conventional commits: `feat:`, `fix:`, `refactor:`, `style:`
- Test locally before pushing
- Review changes before committing

## Important Notes
- **Font**: Manrope is used everywhere (no Georgia)
- **Loading Screen**: Already integrated in layout.tsx
- **Payment URLs**: Use `getPaymentLink()` from payments.ts
- **Instagram Section**: Uses `instagramReels` from landing-content.ts
- **Header/Nav**: Different components for different pages (Header for offer/lesson, NavSection for landing)
- **Footer/FooterSection**: Different components (Footer for offer, FooterSection for landing)

## Testing Checklist
- [ ] Component renders without errors
- [ ] Responsive on mobile, tablet, desktop
- [ ] Images load correctly (priority/lazy)
- [ ] Animations work smoothly
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] Accessibility (screen readers, keyboard nav)
