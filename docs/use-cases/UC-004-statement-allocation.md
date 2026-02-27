# UC-004 — Statement Allocation & Knowledge Building

**Status:** Draft
**Spec version:** v0.13
**Campaign:** Lost Mine of Phandelver (D&D 5e Starter Set)
**Continues from:** UC-003

## Summary

The DM — still in Prep — processes the unallocated @mentions accumulated in UC-003 into structured statements on each entity Anchor. They create statements, allocate mentions as sources, reorder by importance, allocate non-@mention sources (session prep scenes), and demonstrate the superseding mechanism. By the end, every entity has an ordered, sourced summary of what the campaign knows about it.

## Walkthrough

### DM processes Gundren Rockseeker

1. The DM opens "Lost Mine of Phandelver." Campaign is **Prep**. All entities from UC-003 have unallocated mentions.

2. DM clicks on **"Gundren Rockseeker"** (NPC Anchor). The page shows:
   - **Public Info** — rich text: "Dwarf prospector. Hired you for the escort job to Phandalin..."
   - **Private Notes** — rich text: "Has the map to @Wave Echo Cave. Currently held captive..."
   - **Unallocated Mentions** — 7 incoming mentions grouped by source (from UC-003)

3. **DM creates a statement from a mention.** Clicks on the unallocated mention from the Lost Mine plot's Public Statements: *"@Gundren Rockseeker hired you to escort a wagon of supplies to @Phandalin..."* The DM creates a new statement on the **Public Info** Fragment:

   > **"Hired the party to escort supplies from Neverwinter to Phandalin"**

   The mention is allocated as a source. It disappears from Unallocated. The statement now shows `(1 source)`.

4. **DM allocates another mention to the same statement.** Sees the mention from Sildar's Public Info: *"Travelling companion of @Gundren Rockseeker."* This confirms the escort job relationship. DM allocates it to the same statement. Now: `(2 sources)`.

5. **DM allocates the player backstory mention.** From UC-002, Thorin's backstory @mentioned Gundren: *"@Gundren Rockseeker and I fought together in the orc raids..."* DM allocates it to the same statement — Thorin's connection is part of the escort job story. Now: `(3 sources)`.

6. **DM creates a second public statement.** From Sildar's Private Notes: *"Knows @Gundren Rockseeker was heading to @Phandalin."* DM creates:

   > **"Rode ahead to Phandalin with Sildar Hallwinter"**

   Allocates the mention. `(1 source)`.

7. **DM creates private statements.** From the Lost Mine plot's Private Statements: *"@Gundren Rockseeker and his brothers found the entrance to @Wave Echo Cave... has been captured by @King Grol at @Cragmaw Castle."* DM creates two statements on the **Private Notes** Fragment:

   > **"Captured by King Grol at Cragmaw Castle"** `(1 source)`
   > **"Found the entrance to Wave Echo Cave with his brothers"** `(1 source)`

8. **DM allocates remaining mentions to private statements.** King Grol's notes (*"Holding @Gundren Rockseeker on orders from @Nezznar..."*) and Cragmaw Castle's notes (*"@Gundren Rockseeker is held captive here..."*) both confirm the captivity. DM allocates both to "Captured by King Grol at Cragmaw Castle." Now: `(3 sources)`.

   The Black Spider plot mention (*"...find @Gundren Rockseeker's map..."*) confirms the map discovery. Allocated to "Found the entrance to Wave Echo Cave." Now: `(2 sources)`.

9. **DM reorders statements.** On Private Notes, drags "Captured by King Grol" to position 1 (top — most urgent). "Found the entrance to Wave Echo Cave" moves to position 2.

10. **DM reviews Gundren's page.** The Unallocated section is now empty. The page shows:

    **Public Info:**
    - (rich text: character description)
    - Statements:
      1. "Hired the party to escort supplies from Neverwinter to Phandalin" `(3 sources)`
      2. "Rode ahead to Phandalin with Sildar Hallwinter" `(1 source)`

    **Private Notes:**
    - (rich text: DM secrets)
    - Statements:
      1. "Captured by King Grol at Cragmaw Castle" `(3 sources)`
      2. "Found the entrance to Wave Echo Cave with his brothers" `(2 sources)`

    **Unallocated Mentions:** *(empty)*

### DM processes Klarg — including a scene allocation

11. DM clicks on **"Klarg"** (NPC Anchor). 3 unallocated mentions.

12. DM creates statements on **Private Notes**:

    > **"Commands the goblins at Cragmaw Hideout"** — allocates the Cragmaw Hideout mention and the Cragmaw Goblins plot mention. `(2 sources)`
    > **"Reports to King Grol"** — allocates the Cragmaw Hideout mention. `(1 source)`
    > **"Yeemik is his disloyal second-in-command"** — allocates the Yeemik mention. `(1 source)`

13. **DM allocates a scene Fragment as a source.** The DM navigates to Session 1's prep and finds the scene Fragment **"Confronting Klarg"** from UC-001 (the branching encounter planned in Session Notes). This scene is directly about Klarg. The DM allocates it as a source to the "Commands the goblins at Cragmaw Hideout" statement. Now: `(3 sources)`.

    > **Note:** This is not an @mention — it's a direct allocation of a scene Fragment. The scene was written in UC-001 as session prep, and now it's linked to Klarg's statement as evidence. Any Lore Node can be a source.

14. DM reviews Klarg's page. Unallocated is empty. Statements are ordered by importance.

### DM processes Nezznar — the conspiracy hub

15. DM clicks on **"Nezznar the Black Spider"** (NPC Anchor). 6 unallocated mentions.

16. DM creates statements on **Private Notes** (Nezznar is fully private):

    > 1. **"The hidden villain — seeks the Forge of Spells in Wave Echo Cave"** — allocates the Black Spider plot mention and the Wave Echo Cave mention. `(2 sources)`
    > 2. **"Controls Glasstaff and the Redbrands in Phandalin"** — allocates the Glasstaff mention and the Black Spider plot mention. `(2 sources)`
    > 3. **"Hired King Grol and the Cragmaw goblins"** — allocates the King Grol mention and the Cragmaw Goblins plot mention. `(2 sources)`

17. DM verifies: every mention from three different plots and two NPCs has been allocated. Nezznar's page now shows 3 ordered statements with 6 total sources across them. The conspiracy is structured and traceable.

### DM allocates on Cragmaw Hideout — location with mixed sources

18. DM clicks on **"Cragmaw Hideout"** (Location Anchor). 5 unallocated mentions.

19. DM creates statements:

    On **Public Info**:
    > 1. **"Goblin den on the Triboar Trail"** — allocates the Cragmaw Goblins plot's public mention. `(1 source)`

    On **Private Notes**:
    > 1. **"Klarg commands from here; Yeemik is his second"** — allocates Klarg and Yeemik mentions. `(2 sources)`
    > 2. **"Sildar Hallwinter held prisoner"** — allocates Yeemik's mention about holding Sildar. `(1 source)`
    > 3. **"Contains stolen Lionshield Coster supplies"** — allocates Klarg's mention. `(1 source)`

20. **DM allocates the "Goblin Ambush" scene.** From UC-001 session prep, the scene "The Goblin Ambush" describes finding dead horses on the Triboar Trail leading to Cragmaw Hideout. DM allocates it to the "Goblin den on the Triboar Trail" statement. `(2 sources)`.

    DM also allocates the Phandalin mention (about stolen goods linking back) to "Contains stolen Lionshield Coster supplies." `(2 sources)`.

### Superseding example — knowledge evolution

21. *(Fast-forwarding to a later point in the campaign.)* The party has played Session 1 and is now exploring Phandalin. A player writes a recap Fragment after talking to the bartender at Stonehill Inn:

    > *"The bartender says the @Redbrands have been threatening people. He claims @Glasstaff controls them from the manor on the hill."*

    This creates unallocated mentions on both Redbrands and Glasstaff Anchors.

22. DM opens **Glasstaff's** Anchor. There's an existing statement from UC-003:

    > **"Leader of the Redbrands, operating from Tresendar Manor"** `(2 sources)`

    The new unallocated mention from the bartender confirms this. DM allocates it to the existing statement. `(3 sources)`.

23. Later still, Sildar reveals Glasstaff's true identity. DM writes a Fragment:

    > *"@Sildar Hallwinter reveals that @Glasstaff is actually Iarno Albrek — a former member of the Lords' Alliance who went rogue."*

24. DM opens Glasstaff's Anchor. New unallocated mention. DM creates a **new statement**:

    > **"True identity: Iarno Albrek, former Lords' Alliance agent"** `(1 source)`

25. **DM supersedes.** There's an older statement: *"Identity unknown to the party."* (This was created earlier when the DM noted the party didn't know who Glasstaff really was.) The DM drags the old statement under the new one. The page now shows:

    > 1. **"True identity: Iarno Albrek, former Lords' Alliance agent"** `(1 source)`
    >    └── ~~"Identity unknown to the party"~~ `(1 source)` *(superseded)*
    > 2. **"Leader of the Redbrands, operating from Tresendar Manor"** `(3 sources)`

    The old statement and its source are preserved as nested history. The current understanding is at the top.

### DM reviews the campaign knowledge state

26. The DM steps back and reviews. Every entity Anchor now has:
    - Rich text Fragments (narrative/atmosphere)
    - Ordered statements per Fragment (key facts, ranked by importance)
    - Source counts on each statement (expandable provenance)
    - Superseded statements nested under their replacements
    - Empty Unallocated sections (all mentions processed)

    The campaign tree shows statement counts alongside unallocated counts:

    ```
    NPCs (Aggregation)
    ├── Gundren Rockseeker (4 statements, 0 unallocated)
    ├── Sildar Hallwinter (3 statements, 0 unallocated)
    ├── Klarg (3 statements, 0 unallocated)
    ├── Yeemik (2 statements, 0 unallocated)
    ├── King Grol (private, 2 statements, 0 unallocated)
    ├── Nezznar the Black Spider (private, 3 statements, 0 unallocated)
    ├── Glasstaff (private, 3 statements incl. 1 superseded, 0 unallocated)
    └── Lionshield Coster (1 statement, 0 unallocated)
    ```

## Done when

- [ ] Anchor pages show an ordered Statements list per Fragment (below the Fragment's rich text)
- [ ] DM can create a new statement from an unallocated mention (mention becomes a source on the statement)
- [ ] DM can allocate an unallocated mention to an existing statement (the mention disappears from Unallocated)
- [ ] Statements show source count, expandable to see all sources with origin labels
- [ ] Each source links back to its origin (clickable navigation to the source Fragment)
- [ ] DM can reorder statements by dragging (position = importance)
- [ ] DM can allocate non-@mention sources to statements (e.g., scene Fragments from session prep)
- [ ] A single statement can have multiple sources from different Fragments
- [ ] A single source can be allocated to statements on multiple Anchors
- [ ] DM can supersede a statement by dragging an older statement under a newer one
- [ ] Superseded statements are visually nested under their parent statement, with their text and sources preserved
- [ ] Anyone with edit access on the Anchor can create, allocate, reorder, and supersede statements
- [ ] Statements inherit visibility from their parent Fragment
- [ ] Campaign tree shows both statement count and unallocated mention count per entity
- [ ] Automated test suite covers all of the above

## Test suite

Tests should cover:

- **Statement CRUD:** Create a statement (manually and from an unallocated mention), read statements list, update statement text, delete a statement (what happens to its sources?).
- **Allocation from @mentions:** @mention entity A in entity B → unallocated mention appears on A → allocate to statement → mention disappears from unallocated → appears as source on statement. Verify: source count, paragraph context preserved, origin label correct.
- **Multi-source statements:** Allocate multiple mentions from different Fragments to the same statement. Verify: source count increments, all sources visible on expand, each links to its origin.
- **Non-@mention allocation:** Allocate a scene Fragment (from session prep) to a statement on an entity Anchor. Verify: the scene appears as a source, navigable back to the session's prep tree.
- **Cross-Anchor allocation:** A single @mention paragraph references both NPC and Location. Allocate to a statement on the NPC, and separately to a statement on the Location. Verify: both statements show the same source paragraph.
- **Statement ordering:** Create 3 statements, reorder by dragging. Verify: order persists, position reflects importance (1 = top = most important).
- **Superseding:** Create statement A, then statement B. Supersede A under B. Verify: A nests under B visually, A's sources remain attached to A (not merged into B), B is at top level.
- **Superseding chain:** Supersede A under B, then create C and supersede B under C. Verify: C → B → A nesting, all sources intact at each level.
- **Visibility inheritance:** Statement on a Story/Private Fragment is not visible to players. Statement on a Story/Public Fragment follows marker-based reveal rules.
- **Edit permissions:** Only users with edit access on the Anchor can create/allocate/reorder/supersede statements. Players without edit access see statements but cannot modify them.
- **Unallocated count:** Campaign tree shows correct unallocated count. As mentions are allocated, count decreases. When all are allocated, count is 0 (or section hidden).
- **Integration flow:** UC-003 creates entities with @mentions → all mentions are unallocated → DM allocates mentions into ordered statements across multiple entities → scene Fragments from UC-001 are allocated as sources → a superseding scenario plays out → final state: all entities have ordered statements, all mentions allocated, superseded statements nested correctly.

## Spec sections tested

§3.3 (Fragments — Statements sub-section), §3.9 (@Mentions — Unallocated Mentions, Allocation, Superseding), §3.10 (Statements & Allocation), §4.9 (@Mentions & Allocation), §4.10 (Statements & Allocation feature)

## Spec changes triggered

- Statements model added to §3.3 as a Fragment property (v0.13)
- Allocation mechanism added to §3.9 (v0.13)
- Superseding mechanism added to §3.9 (v0.13)
- §3.10 (TODOs) replaced entirely with Statements & Allocation (v0.13)
- References-as-flat-list replaced by Unallocated Mentions + Statements (v0.13)
