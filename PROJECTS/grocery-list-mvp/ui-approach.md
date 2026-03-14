# UI/UX Approach

## Design Philosophy

**"Calm Clarity"** - A grocery list shouldn't stress you out. The interface should fade away, letting the task (shopping) remain clear and simple.

### Core Principles

1. **Thumb-friendly** - One-handed use at the store
2. **Scan-optimized** - Large text, clear contrast, category headers
3. **Family-aware** - Visual cues showing who's on the list
4. **Forgiving** - Undo everything, easy recovery

---

## Color Scheme Proposal

### Primary Palette

| Color | Hex | Usage |
|-------|-----|-------|
| **Fresh Green** | `#22C55E` | Primary actions, checkmarks, success |
| **Soft Sage** | `#86EFAC` | Secondary accents, backgrounds |
| **Warm White** | `#FAFAFA` | Main background |
| **Charcoal** | `#1F2937` | Primary text |
| **Subtle Gray** | `#9CA3AF` | Secondary text, hints |

### Accent Colors (for categories)

| Category | Color | Hex |
|----------|-------|-----|
| Produce | `#84CC16` | Lime green |
| Dairy | `#3B82F6` | Blue |
| Meat | `#EF4444` | Red |
| Bakery | `#F59E0B` | Amber |
| Frozen | `#06B6D4` | Cyan |
| Pantry | `#8B5CF6` | Purple |
| Household | `#6B7280` | Gray |

### Dark Mode

| Color | Hex | Usage |
|-------|-----|-------|
| **Deep Navy** | `#0F172A` | Background |
| **Soft White** | `#E2E8F0` | Text |
| **Muted Green** | `#10B981` | Accents |

---

## Key Screen Descriptions

### 1. Home Screen - My Lists

```
┌─────────────────────────────────────┐
│  🏠 My Household          👨‍👩‍👧‍👦 2  │
├─────────────────────────────────────┤
│  📝 This Week's Groceries          │
│  🛒 8 items · Updated 5m ago       │
│  ✓ 3 done                         │
├─────────────────────────────────────┤
│  📝 Weekend Trip                   │
│  🛒 15 items · Updated yesterday   │
│  ✓ 8 done                         │
├─────────────────────────────────────┤
│  + Create New List                 │
└─────────────────────────────────────┘
```

**UX Decisions:**
- Shows all household lists at a glance
- Avatar ring shows who's actively using
- Unread indicators for remote family edits
- FAB (floating action button) for quick add

---

### 2. List Detail Screen

```
┌─────────────────────────────────────┐
│  ← Back        This Week's     ✏️   │
│  🛒 Store: Whole Foods        📍   │
├─────────────────────────────────────┤
│  🔍 Search items...                 │
├─────────────────────────────────────┤
│  🍎 PRODUCE                         │
│  [✓] 2 Bananas          👨 Dad     │
│  [ ] 1 Bunch cilantro   👩 Mom     │
├─────────────────────────────────────┤
│  🥛 DAIRY                           │
│  [ ] 1 Gallon milk       👧 Emma    │
│  [✓] 2 Butter            👨 Dad     │
│  [ ] Greek yogurt (2)                │
├─────────────────────────────────────┤
│  [+] Add item...                    │
└─────────────────────────────────────┘
```

**UX Decisions:**
- Categories as sticky headers
- Avatar shows who added or completed
- Swipe left to delete, swipe right to complete
- FAB for quick add (appears on scroll)
- Pull-to-refresh for sync

---

### 3. Add Item Modal

```
┌─────────────────────────────────────┐
│  Add Item                           │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐    │
│  │ Milk                        │    │
│  └─────────────────────────────┘    │
│                                     │
│  Quantity:  [ 1 ]  [-] [+]          │
│  Unit:      Gallon ▼                │
│  Category:  Dairy ▼                 │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ Add to list                 │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ Cancel                      │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

**UX Decisions:**
- Auto-suggest as user types
- Category auto-filled based on item name
- Recent items shown for quick selection
- Large tap targets

---

### 4. Share Household Screen

```
┌─────────────────────────────────────┐
│  ← Back        Share List           │
├─────────────────────────────────────┤
│  👨‍👩‍👧‍👦 Members (3)                       │
│  ┌─────────────────────────────┐    │
│  │ 👨 Dad (You)               ✕   │    │
│  │ 👩 Mom - Mom@email.com     ✕   │    │
│  │ 👧 Emma - emma@email.com   ✕   │    │
│  └─────────────────────────────┘    │
│                                     │
│  + Invite via Email                 │
│  + Generate Share Link              │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ Copy invite link            │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

**UX Decisions:**
- Simple member management
- Link expires after 7 days
- Permission levels: Can edit / Can view

---

## Engagement Hooks

### 1. First Run Experience

```
Welcome! 👋
Let's set up your household grocery list.

Step 1: Create your household
Step 2: Invite family members (optional)
Step 3: Start shopping!

[Get Started →]
```

**Key:**
- Skip invite step (don't block onboarding)
- Show value immediately with sample list

---

### 2. Micro-interactions

| Interaction | Animation |
|-------------|-----------|
| Check item | Smooth strikethrow + green flash |
| Add item | Slide in from bottom + haptic |
| Sync change | Subtle badge pulse |
| Complete list | Confetti + "All done!" message |

---

### 3. Notifications (Optional, Permission-based)

- "Dad added 3 items to the list"
- "You're near [Store] - open your list?"
- "Weekly meal planning reminder"

---

## Accessibility

- **VoiceOver** support for all interactive elements
- **Dynamic Type** scales up to 2x
- **High Contrast** mode support
- **Haptic feedback** for confirmations

---

## Design Assets Needed

| Asset | Format | Quantity |
|-------|--------|----------|
| App icon | SVG, PNG (various sizes) | 1 |
| Category icons | SVG | 15 |
| Avatar placeholders | Vector | 6 |
| Empty states | SVG | 3 |
| Success illustrations | Vector | 2 |

---

*Design approach completed: February 2026*