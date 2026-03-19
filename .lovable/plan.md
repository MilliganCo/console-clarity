

# BUDGET CONSOLE v1.0 — Frontend Presentation Plan

## Overview
Mobile-first budget management web app with dark TUI/terminal aesthetic. Full interactive prototype with 10 screens, mock data, and state transitions.

## Design System Setup
- **Colors**: Deep green-black backgrounds (#050806, #0A0F0B), terminal green accents (#8BFFB0), warning (#F2C94C), danger (#FF6B6B)
- **Typography**: IBM Plex Sans (UI), IBM Plex Mono (numbers/labels), tabular-nums everywhere
- **Components**: Dark cards with subtle green borders, progress bars, status pills (OK/LOW/OVER), terminal-style breadcrumb headers
- **Spacing**: 4px base grid, 16px gutters, 16px card radius, 12px button radius

## Screens to Build

### 1. Splash Screen
Black screen, "BUDGET CONSOLE" wordmark, blinking cursor loading indicator, 1.5s auto-transition to Dashboard.

### 2. Login Screen
Terminal-styled auth card with email/password inputs, LOG IN button, SIGN UP / RESET links. Green focus states and caret.

### 3. Dashboard (Main Hub)
- Command-line breadcrumb header: `CONSOLE > DASHBOARD`
- Month display (MARCH 2026) + sync status
- 2×2 summary grid: IN FUNDS, UNALLOCATED, ADJUSTED, DAYS TO PAYDAY
- Next Payday hero card with DISTRIBUTE CTA
- Alerts section (LOW balance warnings)
- Top 5 categories preview with progress bars
- 2×2 quick actions: +INCOME, ADJUST, TRANSFER, NEW CATEGORY

### 4. Categories List
Search input, filter chips (ALL/ACTIVE/LOW/EXTRA), scrollable category cards with name, balance, limit, progress bar, status pill. Visual states: normal, LOW (warning), OVER (danger).

### 5. Category Details
Hero balance block, KPI row (LIMIT/ALLOCATED/CARRYOVER/LEFT), allocation rule card, action buttons (ADJUST/TRANSFER/EDIT), transactions timeline.

### 6. Salary Distribution
Income input card (date, type, amount), RECEIVED/ASSIGNED/LEFT summary strip, editable allocation rows per category with before→after preview, sticky bottom confirm bar. Real-time LEFT counter updates as user edits amounts.

### 7. Transfer
Clean form: From/To category selectors, amount input, note field. Live preview showing balance changes for both categories. Validation + confirm.

### 8. Adjust Balance
Category selector, CURRENT value display, NEW balance input, DELTA preview (color-coded ±), note, confirm. Delta updates in real-time.

### 9. History
Month/category/type filters, transactions grouped by day. Dense log-style layout with type label, category, amount, time, direction color.

### 10. Settings
Sectioned list: GENERAL, INCOME SCHEDULE, CATEGORIES, BUDGET RULES, DATA, ACCOUNT. Each row with label, current value, chevron.

## Navigation & Transitions
- Fixed bottom tab bar (5 tabs) with glass blur effect, active state green top border
- Tab switches: instant fade
- List → detail: slide-left push
- Actions: bottom sheet modals
- Confirmations: dialog overlay
- Framer Motion for all transitions (150ms micro, 300ms layout)

## Mock Data (Russian category names)
8 categories with varied states: Аренда (stable, high balance), Еда (low warning), Аптека (surplus), Ребёнок (normal), Кредиты (stable), Транспорт (near zero), Интернет (normal), Другое (overdrawn). Realistic ruble amounts.

## Interactive State Demos
- Distribution flow: edit amounts → LEFT hits 0 → confirm → success overlay → dashboard updates
- Transfer flow: fill form → live preview → confirm → updated balances
- Dashboard: default, post-distribution, low-balance alerts
- Categories: filter switching with animated list updates

## Technical Approach
- React + TypeScript + Tailwind CSS + Framer Motion
- React Router for screen navigation
- Local state with React context for mock data mutations
- IBM Plex Sans + IBM Plex Mono from Google Fonts
- Mobile viewport constrained (max-w-md centered)

