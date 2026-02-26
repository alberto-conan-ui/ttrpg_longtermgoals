# UC-001 — DM Onboarding & First Session Prep

**Status:** In progress
**Spec version:** v0.8
**Campaign:** Lost Mine of Phandelver (D&D 5e Starter Set)

## Summary

A new DM registers, creates the Lost Mine of Phandelver campaign, and preps their first session — the goblin ambush on the Triboar Trail and the Cragmaw Hideout. They use Session Notes, child fragments, and deep nesting to plan a branching encounter.

## Walkthrough

### Registration & Campaign Setup

1. DM visits the app and registers with Google OAuth. Lands on an empty campaign list.
2. DM creates a new campaign: **"Lost Mine of Phandelver"**, description: *"A group of adventurers escorts a wagon of supplies to the frontier town of Phandalin, but trouble finds them on the road."*

### First Session Setup

3. DM creates a session directly under the campaign (no folder yet — they'll organise into arcs later). Names it: **"Goblin Arrows"**.
4. Session is created with status **Planning**. Two auto-created Lore Fragments appear:
   - **Session Notes** (Story/Private) — the DM's prep space
   - **Session Summary** (Story/Public) — what players will eventually see

### Prepping the Session

5. DM opens **Session Notes** and writes a high-level summary:

   > *The party is hired by Gundren Rockseeker to escort a wagon of supplies from Neverwinter to Phandalin. On the Triboar Trail, they find Gundren's horses slaughtered and are ambushed by goblins. The trail leads to Cragmaw Hideout where Gundren's companion Sildar Hallwinter is held captive.*

6. DM creates a child Lore Fragment under Session Notes — **Story/Private, subtype: Scene** — named **"The Goblin Ambush"**. Writes:

   > *About half a day's travel along the Triboar Trail, the party spots two dead horses blocking the road. As they investigate, four goblins attack from the bushes on either side of the road. The horses belong to Gundren Rockseeker and Sildar Hallwinter.*

7. DM creates another child under Session Notes — **Story/Private, subtype: Scene** — named **"Cragmaw Hideout"**. Writes the description of the cave: the stream entrance, the goblin lookouts, the layout.

8. Under **"Cragmaw Hideout"**, the DM plans the branching encounter with the bugbear Klarg. Creates three children (grandchildren of Session Notes):

   - **Story/Private, subtype: Scene** — **"Negotiating with Yeemik"**: *Yeemik, Klarg's second-in-command, offers to release Sildar if the party kills Klarg. The party can play the goblins against each other.*
   - **Story/Private, subtype: Scene** — **"Confronting Klarg"**: *The party fights Klarg and his wolf Ripper in the main cave. If they win, they free Sildar and find a stash of stolen supplies marked with the Lionshield Coster symbol.*
   - **Story/Private, subtype: Scene** — **"If the party is captured..."**: *If the party is overwhelmed, Yeemik takes them prisoner and demands they kill Klarg in exchange for their freedom. This loops back to the negotiation path.*

9. DM reviews the tree:

   ```
   Lost Mine of Phandelver
   └── Session 1: "Goblin Arrows" [Planning]
       ├── Session Notes (Story/Private, auto-created)
       │   ├── (rich text: high-level summary — the hook, the road, the ambush)
       │   ├── Scene: "The Goblin Ambush" (Story/Private)
       │   ├── Scene: "Cragmaw Hideout" (Story/Private)
       │   │   ├── Scene: "Negotiating with Yeemik" (Story/Private)
       │   │   ├── Scene: "Confronting Klarg" (Story/Private)
       │   │   └── Scene: "If the party is captured..." (Story/Private)
       │   └── ...
       └── Session Summary (Story/Public, auto-created)
   ```

10. DM is satisfied with the prep and transitions the session status from **Planning** → **Planned**.

## Done when

- [ ] User can register via Google OAuth and land on a campaign list
- [ ] User can create a campaign with name and description
- [ ] User can create a session at the campaign root (no folder required)
- [ ] Session shows status: Planning
- [ ] Two auto-created Lore Fragments appear (Session Notes, Session Summary)
- [ ] DM can write rich text content in Session Notes (headings, bold, italic, lists, links, blockquotes, inline images)
- [ ] DM can create child Lore Fragments under Session Notes with type Story/Private and subtype Scene
- [ ] DM can nest fragments at least 3 levels deep (Session Notes → Cragmaw Hideout → Confronting Klarg)
- [ ] Child fragments are children of their parent fragment (not of the session node)
- [ ] DM can transition session status from Planning → Planned
- [ ] Automated test suite covers all of the above

## Test suite

Each use case must include an automated test suite that proves the flow works end-to-end. Tests are the objective definition of "done" — if the tests pass, the use case is complete.

Tests should cover:
- **API layer:** Each endpoint involved in the walkthrough is tested (happy path + key error cases).
- **Business logic:** Auto-creation of Lore Fragments on session creation, status transitions, visibility rules, parent-child relationships.
- **Fragment nesting:** Creating children of children (3+ levels deep). Verifying parent references are to the fragment, not the session.
- **Rich text:** Content can include headings, bold, italic, blockquotes, lists, links.
- **Integration:** The full walkthrough as a sequence — register → create campaign → create session → verify auto-created fragments → write content in Session Notes → create nested Scene fragments → transition status to Planned.

## Spec sections tested

§4.1, §4.2, §3.1, §3.2 (Session Status), §3.3 (Lore Fragments — rich text, parent-child, types, subtypes), §3.3.2

## Spec changes triggered

- Parts → optional Folders with DM-chosen labels (§3.1)
- Sessions gain explicit statuses: Planning, Planned, Played (§3.2)
- Auto-created fragments renamed: Session Notes + Session Summary (§3.3.2)
- Lore Fragment nesting is unlimited depth (§3.3 — Parent-Child Relationships)
- Child fragments are children of their parent fragment, not of the session node (§3.3 — Parent-Child Relationships)
