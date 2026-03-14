# Demo Script - MVP Presentation

## Presentation Overview

**Length:** 15 minutes (including Q&A)
**Audience:** Side Quest Studios stakeholders
**Goal:** Get approval for MVP development

---

## Demo Flow

### 1. Hook (30 seconds)

**Speaker:** "Every week, the same conversation happens in households across America..."

*"Did you get the milk?"*
*"I thought YOU were buying the milk."*
*"The list said you were getting it."*

**Speaker:** "We're building an app that ends that conversation."

---

### 2. Problem Statement (1 minute)

**Three problems existing apps ignore:**

1. **Coordination failure** - "OurGroceries shares lists, but doesn't tell you WHO is shopping RIGHT NOW"

2. **Context loss** - "You add 'milk' but forget you're out of milk at home AND at your parent's house"

3. **Budget blindness** - "Every app makes it easy to add items. None tell you you're about to spend $150."

---

### 3. Solution Demo (8 minutes)

#### Demo Scenario: The Johnson Family

**Characters:**
- Mom (Sarah) - primary list manager
- Dad (Mike) - shopping at store
- Emma (teen) - noticed they need eggs

---

#### Demo Scene 1: Mom Creates List at Home

*[Open app, tap + create new list]*

**Speaker:** "Sarah is making dinner and realizes they're low on ingredients."

1. Tap "+" → Quick add "eggs" → Auto-categorized as Dairy
2. Add "chicken breast" → Auto-categorized as Meat
3. Add "broccoli" → Auto-categorized as Produce
4. Notice item suggestions based on purchase history
5. See category headers auto-organize items

**Key Features Shown:**
- ✅ Auto-categorization
- ✅ Quick add
- ✅ Smart suggestions

---

#### Demo Scene 2: Emma Adds from School

*[Switch to different device, simulate Emma adding]*

**Speaker:** "Emma is at school and realizes they're out of snacks."

1. Open shared household list
2. Add "granola bars" + "apple juice"
3. Mom's phone shows "Emma added 2 items" with avatar

**Key Features Shown:**
- ✅ Real-time family sync
- ✅ Avatar attribution
- ✅ Seamless cross-device

---

#### Demo Scene 3: Dad Goes Shopping

*[Switch to Dad's phone, show in-store view]*

**Speaker:** "Mike is at the store. Notice how the list is organized."

1. List auto-sorted by aisle (Produce → Dairy → Meat)
2. Mike taps items as he shops
3. Checkmarks animate, item dims
4. Running total shows $47.82 spent so far
5. Dad adds "ice cream" - running total updates

**Key Features Shown:**
- ✅ Store-optimized organization
- ✅ One-tap checkoff
- ✅ Budget awareness (running total)

---

#### Demo Scene 4: Quick Voice Add

*[Hold phone, demonstrate voice]*

**Speaker:** "Mike's hands are full. He uses voice."

1. Tap microphone → "Add milk"
2. "2% milk, one gallon" → Auto-parsed
3. Appears instantly on Mom's list

**Key Features Shown:**
- ✅ Voice input
- ✅ Instant sync

---

#### Demo Scene 5: In-Store Communication

*[Simulate scenario]*

**Speaker:** "Here's where we differ from every other app."

1. Mom texts "Did you get the chicken?"
2. Mike taps "chicken" on list → shows "✓ Mike completed"
3. Or Mike adds note: "Out of boneless, got bone-in"

**Key Features Shown:**
- ✅ Item completion attribution
- ✅ Optional notes

---

### 4. Market Opportunity (2 minutes)

**Slide: Competitor Analysis**

| App | Strength | Gap We Fill |
|-----|----------|-------------|
| AnyList | Recipe ecosystem | No family coordination focus |
| OurGroceries | Simple family sharing | No budget, no smart features |
| Apple Reminders | Free, native | No recipes, manual organization |
| Paprika | Recipe-to-list | No sharing, dated UI |

**Speaker:** "We're positioned at the intersection of OurGroceries' simplicity and AnyList' intelligence—with a feature no one has: budget awareness."

**Market Size:** 40M US households share grocery duties
**Average willingness:** $2-5/month for better coordination

---

### 5. MVP Scope (2 minutes)

**Slide: What's in V1**

✅ Create/edit/delete lists
✅ Add items with auto-categorization
✅ Check off items
✅ Real-time family sharing
✅ Cross-device sync
✅ Quick add + voice input
✅ Offline support

**Slide: What's V2**

🔜 Recipe import → auto-list
🔜 Shopping route optimization
🔜 Pantry inventory
🔜 Store-specific layouts

**Speaker:** "V1 delivers core value in 7 weeks. V2 adds differentiation."

---

### 6. Technical Stack (30 seconds)

**Slide: Technology**

- **Frontend:** React Native (cross-platform iOS/Android)
- **Backend:** Firebase (auth, realtime database, functions)
- **Sync:** Offline-first with conflict resolution
- **Hosting:** Vercel for web components

**Speaker:** "Proven stack, fast development, scalable."

---

### 7. Call to Action (30 seconds)

**Speaker:** "We're asking for:

1. Approval to proceed with 7-week MVP sprint
2. $X budget for development
3. Beta access for 5 families for user testing"

**Questions?"

---

## Backup Slides (if asked)

### Detailed Feature List

[Full table from mvp-spec.md]

### Competitive Pricing Models

- AnyList: $11.99/year
- OurGroceries: Free + Premium
- Paprika: $4.99-9.99 per platform

**Our model:** Free tier + $2.99/month or $24.99/year
**Household pricing:** One subscription, unlimited family members

### Technical Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| Firebase pricing | Start free tier, optimize queries |
| Sync conflicts | CRDT-based conflict resolution |
| App store approval | Pre-review compliance check |

---

## Demo Checklist (Before Presentation)

- [ ] Demo accounts created on Firebase
- [ ] Test devices charged (iPhone + Android)
- [ ] Screen recording backup ready
- [ ] WiFi hotspot available (offline demo backup)
- [ ] Mock data loaded (Johnson family list)
- [ ] Voice input tested in demo environment
- [ ] Timer for each section ready

---

*Demo script completed: February 2026*