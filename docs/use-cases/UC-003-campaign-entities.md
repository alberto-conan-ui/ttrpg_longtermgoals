# UC-003 — DM Sets Up Campaign Entities with @Mentions

**Status:** Draft
**Spec version:** v0.13
**Campaign:** Lost Mine of Phandelver (D&D 5e Starter Set)
**Continues from:** UC-002

## Summary

The DM — still in Prep — builds the narrative backbone of the campaign by creating Plots, NPCs, and Locations as Anchor nodes, and uses @mentions throughout to link them together. Many entities are auto-created simply by being @mentioned for the first time. By the end, the DM clicks through each entity page to verify that unallocated mentions have accumulated correctly — each Anchor page shows the raw mentions awaiting allocation into statements. UC-004 continues from here with the actual statement allocation workflow.

## Walkthrough

### Creating the first NPCs (some Anchors created explicitly, others auto-created by @mention)

1. The DM opens "Lost Mine of Phandelver." Campaign is **Prep**. Players have joined (UC-002). Session 1 "Goblin Arrows" is **Planned** (UC-001).
2. DM opens the **NPCs** Aggregation and explicitly creates the first NPC:

   **"Gundren Rockseeker"** (Anchor — NPC, Story/Public, from Session 1)
   - **Public Info** (Fragment): *"Dwarf prospector. Hired you for the escort job to Phandalin. Excitable, secretive about his discovery. Rode ahead with @Sildar Hallwinter."*
   - **Private Notes** (Fragment): *"Has the map to @Wave Echo Cave. Currently held captive by @King Grol at @Cragmaw Castle. His brothers Nundro and Tharden are at the mine — Nundro is alive, Tharden is dead."*

   > **What happens:** As the DM types `@Sildar Hallwinter` in Gundren's Public Info, Sildar doesn't exist yet. The system auto-creates an NPC Anchor called "Sildar Hallwinter" under the NPCs Aggregation (Story/Private by default, session anchor: Goblin Arrows). Same for `@Wave Echo Cave` (auto-creates a Location Anchor), `@King Grol` (auto-creates an NPC Anchor), and `@Cragmaw Castle` (auto-creates a Location Anchor). All with empty child Fragments.

3. The DM now clicks on the auto-created **Sildar Hallwinter** Anchor to flesh it out. They change visibility to Story/Public and write:
   - **Public Info**: *"Human warrior and agent of the Lords' Alliance. Travelling companion of @Gundren Rockseeker."*
   - **Private Notes**: *"Secretly investigating the disappearance of @Glasstaff. Will ask the party for help once rescued. Knows @Gundren Rockseeker was heading to @Phandalin."*

   > **What happens:** `@Glasstaff` and `@Phandalin` auto-create as NPC and Location Anchors respectively.

4. The DM continues with more NPCs, filling in some explicitly and letting others auto-create:

   **"Klarg"** — DM clicks the auto-created Anchor (or creates fresh), sets Story/Public, from Session 1
   - **Public Info**: *(empty — players will meet him in the cave)*
   - **Private Notes**: *"Bugbear. Commands the goblins at @Cragmaw Hideout. Reports to @King Grol. Has a wolf named Ripper. Stash includes stolen @Lionshield Coster supplies."*

   **"Yeemik"** — Story/Public, from Session 1
   - **Private Notes**: *"Goblin second-in-command at @Cragmaw Hideout. Hates @Klarg. Will betray him if the party offers to help. Holds @Sildar Hallwinter prisoner."*

   **"King Grol"** — DM clicks the auto-created Anchor, keeps Story/Private
   - **Private Notes**: *"Bugbear king of the Cragmaw tribe. Rules from @Cragmaw Castle. Holding @Gundren Rockseeker on orders from @Nezznar the Black Spider. Has the map to @Wave Echo Cave."*

   **"Nezznar the Black Spider"** — auto-created when King Grol mentioned him, DM keeps Story/Private
   - **Private Notes**: *"Drow wizard. The hidden villain. Wants the Forge of Spells inside @Wave Echo Cave. Has hired @King Grol and the Cragmaw goblins. Controls @Glasstaff and the @Redbrands in @Phandalin."*

   **"Glasstaff (Iarno Albrek)"** — auto-created when Sildar mentioned him, DM keeps Story/Private
   - **Private Notes**: *"Human wizard, formerly of the Lords' Alliance — @Sildar Hallwinter is looking for him. Leads the @Redbrands from @Tresendar Manor. Works for @Nezznar the Black Spider."*

   > **Note:** By now `@Redbrands` has been mentioned multiple times but auto-creates only once (the first time). Each subsequent mention just adds a new reference. The DM hasn't decided yet if Redbrands is an NPC, a Plot, or a custom entity type — the auto-creation needs a type. For now the DM picks Plot when the @mention picker asks.

### Creating Locations

5. Some Locations were already auto-created by @mentions (Wave Echo Cave, Cragmaw Castle, Phandalin, Cragmaw Hideout). The DM clicks into each to fill in details:

   **"Cragmaw Hideout"** — DM clicks auto-created Anchor, sets Story/Public, from Session 1
   - **Public Info**: *"A cave along the Triboar Trail. Goblin den."*
   - **Private Notes**: *"Home to @Klarg (bugbear leader), @Yeemik (second-in-command), and a dozen goblins. @Sildar Hallwinter is held prisoner here. Contains stolen supplies from the @Lionshield Coster. A trail from here eventually leads to @Cragmaw Castle."*

   **"Cragmaw Castle"** — already auto-created, DM keeps Story/Private, from Session 1
   - **Private Notes**: *"@King Grol's stronghold in Neverwinter Wood. @Gundren Rockseeker is held captive here with his map to @Wave Echo Cave. Players won't learn about it until they interrogate goblins or follow clues."*

   **"Phandalin"** — auto-created, DM sets Story/Public, from Session 2
   - **Public Info**: *"A small frontier town in the foothills. Once a prosperous mining settlement, recently resettled."*
   - **Private Notes**: *"Currently under the thumb of the @Redbrands. Key locations: @Stonehill Inn (rumours), Barthen's Provisions (quest hook), @Lionshield Coster (stolen goods link to @Cragmaw Hideout), Shrine of Luck, Townmaster's Hall."*

   Sub-locations under Phandalin (Anchor under Anchor):
   - **"Tresendar Manor"** — Story/Private, from Session 2: *"Ruined manor on the edge of town. The @Redbrands hideout is beneath it. @Glasstaff operates from here."*
   - **"Stonehill Inn"** — Story/Public, from Session 2: *"The main gathering place in @Phandalin. Run by Toblen Stonehill. Good place to hear rumours about the @Redbrands."*

   **"Wave Echo Cave"** — auto-created, DM keeps Story/Private, from Session 1
   - **Private Notes**: *"The legendary lost mine. Contains the Forge of Spells. @Gundren Rockseeker found the entrance. @Nezznar the Black Spider is racing to claim it. This is the endgame location."*

### Setting up Plots

6. DM opens the **Plots** Aggregation and creates:

   **Root plot: "The Lost Mine of Wave Echo Cave"** (Anchor — Plot, Story/Public, from Session 1)
   - **Public Statements** (Fragment): *"@Gundren Rockseeker hired you to escort a wagon of supplies to @Phandalin. He mentioned a 'discovery' but was secretive. He rode ahead with @Sildar Hallwinter."*
   - **Private Statements** (Fragment): *"@Gundren Rockseeker and his brothers found the entrance to @Wave Echo Cave. @Nezznar the Black Spider wants it. @Gundren Rockseeker has been captured by @King Grol at @Cragmaw Castle."*

   **Subplot: "The Black Spider"** — Story/Private, from Session 1
   - **Private Statements**: *"@Nezznar the Black Spider seeks the Forge of Spells within @Wave Echo Cave. He has hired @King Grol and the Cragmaw goblins to find @Gundren Rockseeker's map. He controls @Glasstaff and the @Redbrands to maintain power in @Phandalin."*

   **Subplot: "The Redbrands"** — already auto-created as a Plot, DM sets Story/Public, from Session 2
   - **Public Statements**: *"A gang of ruffians called the @Redbrands has been terrorising @Phandalin."*
   - **Private Statements**: *"Led by @Glasstaff from @Tresendar Manor. Works for @Nezznar the Black Spider. @Sildar Hallwinter is secretly investigating the disappearance of Glasstaff's true identity, Iarno Albrek."*

   **Subplot: "The Cragmaw Goblins"** — Story/Public, from Session 1
   - **Public Statements**: *"Goblins ambushed you on the Triboar Trail. Their trail leads to @Cragmaw Hideout."*
   - **Private Statements**: *"@King Grol leads the tribe from @Cragmaw Castle. @Klarg commands the outpost at @Cragmaw Hideout. They're working for @Nezznar the Black Spider."*

### DM verifies the unallocated mentions — clicking through every entity

7. The DM has finished writing. Now they click through each entity to verify that unallocated mentions have accumulated correctly. This is the key validation of the @mention system. All mentions are currently **unallocated** — the DM will process them into statements in UC-004.

   **DM clicks on "Gundren Rockseeker":**

   The page shows:
   - **Public Info**: the text the DM wrote (escort job, rode ahead with Sildar). No statements yet.
   - **Private Notes**: the text the DM wrote (map, captive, brothers). No statements yet.
   - **Unallocated Mentions** (7 incoming mentions, grouped by source Anchor):

   > **[PLOT] The Lost Mine of Wave Echo Cave (public)**
   >
   > *Public Statements →* "@Gundren Rockseeker hired you to escort a wagon of supplies to @Phandalin. He mentioned a 'discovery' but was secretive. He rode ahead with @Sildar Hallwinter."
   >
   > *Private Statements →* "@Gundren Rockseeker and his brothers found the entrance to @Wave Echo Cave. @Nezznar the Black Spider wants it. @Gundren Rockseeker has been captured by @King Grol at @Cragmaw Castle."

   > **[NPC] Sildar Hallwinter (public)**
   >
   > *Public Info →* "Human warrior and agent of the Lords' Alliance. Travelling companion of @Gundren Rockseeker."
   >
   > *Private Notes →* "Secretly investigating the disappearance of @Glasstaff. Will ask the party for help once rescued. Knows @Gundren Rockseeker was heading to @Phandalin."

   > **[NPC] King Grol (private)**
   >
   > *Private Notes →* "Bugbear king of the Cragmaw tribe. Rules from @Cragmaw Castle. Holding @Gundren Rockseeker on orders from @Nezznar the Black Spider. Has the map to @Wave Echo Cave."

   > **[LOCATION] Cragmaw Castle (private)**
   >
   > *Private Notes →* "@King Grol's stronghold in Neverwinter Wood. @Gundren Rockseeker is held captive here with his map to @Wave Echo Cave. Players won't learn about it until they interrogate goblins or follow clues."

   > **[PLOT] The Black Spider (private)**
   >
   > *Private Statements →* "@Nezznar the Black Spider seeks the Forge of Spells within @Wave Echo Cave. He has hired @King Grol and the Cragmaw goblins to find @Gundren Rockseeker's map. He controls @Glasstaff and the @Redbrands to maintain power in @Phandalin."

   The DM can see Gundren's entire unprocessed mention footprint, grouped by where the information comes from. These will become structured statements in UC-004.

8. **DM clicks on "Klarg":**

   - **Public Info**: *(empty)*
   - **Private Notes**: the text about commanding goblins at Cragmaw Hideout. No statements yet.
   - **Unallocated Mentions** (3 incoming mentions, grouped by source):

   > **[NPC] Yeemik (public)**
   >
   > *Private Notes →* "Goblin second-in-command at @Cragmaw Hideout. Hates @Klarg. Will betray him if the party offers to help. Holds @Sildar Hallwinter prisoner."

   > **[LOCATION] Cragmaw Hideout (public)**
   >
   > *Private Notes →* "Home to @Klarg (bugbear leader), @Yeemik (second-in-command), and a dozen goblins. @Sildar Hallwinter is held prisoner here. Contains stolen supplies from the @Lionshield Coster. A trail from here eventually leads to @Cragmaw Castle."

   > **[PLOT] The Cragmaw Goblins (public)**
   >
   > *Private Statements →* "@King Grol leads the tribe from @Cragmaw Castle. @Klarg commands the outpost at @Cragmaw Hideout. They're working for @Nezznar the Black Spider."

   Even though Klarg's own Public Info is empty, the unallocated mentions already tell the DM everything about him in context — ready to be distilled into statements.

9. **DM clicks on "Cragmaw Hideout" (Location):**

   - **Public Info**: "A cave along the Triboar Trail. Goblin den."
   - **Private Notes**: the text about Klarg, Yeemik, Sildar, stolen supplies. No statements yet.
   - **Unallocated Mentions** (5 incoming mentions, grouped by source):

   > **[NPC] Klarg (public)**
   >
   > *Private Notes →* "Bugbear. Commands the goblins at @Cragmaw Hideout. Reports to @King Grol. Has a wolf named Ripper. Stash includes stolen @Lionshield Coster supplies."

   > **[NPC] Yeemik (public)**
   >
   > *Private Notes →* "Goblin second-in-command at @Cragmaw Hideout. Hates @Klarg. Will betray him if the party offers to help. Holds @Sildar Hallwinter prisoner."

   > **[LOCATION] Phandalin (public)**
   >
   > *Private Notes →* "Currently under the thumb of the @Redbrands. Key locations: @Stonehill Inn (rumours), Barthen's Provisions (quest hook), @Lionshield Coster (stolen goods link to @Cragmaw Hideout), Shrine of Luck, Townmaster's Hall."

   > **[PLOT] The Cragmaw Goblins (public)**
   >
   > *Public Statements →* "Goblins ambushed you on the Triboar Trail. Their trail leads to @Cragmaw Hideout."
   >
   > *Private Statements →* "@King Grol leads the tribe from @Cragmaw Castle. @Klarg commands the outpost at @Cragmaw Hideout. They're working for @Nezznar the Black Spider."

   The location page shows who's there, what's happening, and how it connects to the broader plot — all from unallocated mentions awaiting processing.

10. **DM clicks on "The Lost Mine of Wave Echo Cave" (Plot):**

    - **Public Statements**: the text about the escort job. No statements yet.
    - **Private Statements**: the text about Gundren's capture. No statements yet.
    - **Unallocated Mentions** — this is the root plot, so it may not have many incoming mentions since other entities reference it less often than it references them. The DM can see the full text of both Fragments, and every child subplot is visible in the tree.

11. **DM clicks on "Nezznar the Black Spider" (NPC):**

    - **Private Notes**: the text about being the hidden villain. No statements yet.
    - **Unallocated Mentions** (6 incoming mentions, grouped by source):

    > **[NPC] King Grol (private)**
    >
    > *Private Notes →* "Bugbear king of the Cragmaw tribe. Rules from @Cragmaw Castle. Holding @Gundren Rockseeker on orders from @Nezznar the Black Spider. Has the map to @Wave Echo Cave."

    > **[NPC] Glasstaff (private)**
    >
    > *Private Notes →* "Human wizard, formerly of the Lords' Alliance — @Sildar Hallwinter is looking for him. Leads the @Redbrands from @Tresendar Manor. Works for @Nezznar the Black Spider."

    > **[LOCATION] Wave Echo Cave (private)**
    >
    > *Private Notes →* "The legendary lost mine. Contains the Forge of Spells. @Gundren Rockseeker found the entrance. @Nezznar the Black Spider is racing to claim it. This is the endgame location."

    > **[PLOT] The Lost Mine of Wave Echo Cave (public)**
    >
    > *Private Statements →* "@Gundren Rockseeker and his brothers found the entrance to @Wave Echo Cave. @Nezznar the Black Spider wants it. @Gundren Rockseeker has been captured by @King Grol at @Cragmaw Castle."

    > **[PLOT] The Black Spider (private)**
    >
    > *Private Statements →* "@Nezznar the Black Spider seeks the Forge of Spells within @Wave Echo Cave. He has hired @King Grol and the Cragmaw goblins to find @Gundren Rockseeker's map. He controls @Glasstaff and the @Redbrands to maintain power in @Phandalin."

    > **[PLOT] The Cragmaw Goblins (public)**
    >
    > *Private Statements →* "@King Grol leads the tribe from @Cragmaw Castle. @Klarg commands the outpost at @Cragmaw Hideout. They're working for @Nezznar the Black Spider."

    Every thread leads back to Nezznar. The unallocated mentions make the conspiracy visible — grouped by source, the DM can see that three different plots and two NPCs all point at him. In UC-004, these will be distilled into ordered statements that capture the key facts about Nezznar.

### DM reviews the campaign tree

12. The DM steps back. The campaign tree now shows:
    ```
    Lost Mine of Phandelver [Prep]
    ├── Session 1: "Goblin Arrows" (Anchor — Session) [Planned]
    │   ├── Session Notes (with nested scenes from UC-001)
    │   └── Session Summary
    ├── Players (Aggregation)
    │   ├── Thorin Ironforge ✓ backstory
    │   ├── Elara Moonwhisper ✓ backstory
    │   ├── Brother Aldric ✓ backstory
    │   └── Player 4 — backstory pending
    ├── Plots (Aggregation)
    │   └── "The Lost Mine of Wave Echo Cave" (Anchor — Plot)
    │       ├── "The Black Spider" (Anchor — Plot, private)
    │       ├── "The Redbrands" (Anchor — Plot, from Session 2)
    │       └── "The Cragmaw Goblins" (Anchor — Plot)
    ├── NPCs (Aggregation)
    │   ├── Gundren Rockseeker (7 unallocated)
    │   ├── Sildar Hallwinter (4 unallocated)
    │   ├── Klarg (3 unallocated)
    │   ├── Yeemik (2 unallocated)
    │   ├── King Grol (private, 5 unallocated)
    │   ├── Nezznar the Black Spider (private, 6 unallocated)
    │   ├── Glasstaff (private, 4 unallocated)
    │   └── Lionshield Coster (2 unallocated)
    └── Locations (Aggregation)
        ├── Cragmaw Hideout (5 unallocated)
        ├── Cragmaw Castle (private, 4 unallocated)
        ├── Phandalin (from Session 2, 5 unallocated)
        │   ├── Tresendar Manor (private)
        │   └── Stonehill Inn
        └── Wave Echo Cave (private, 4 unallocated)
    ```

13. The DM has built the campaign's entity web. Every Anchor has unallocated mentions waiting to be processed. UC-004 continues from here — the DM allocates these mentions into ordered statements, building structured knowledge on each entity.

## Done when

- [ ] DM can create entity Anchors (Plot, NPC, Location) with name, visibility, and session anchor
- [ ] Anchor creation auto-generates the correct child Fragments (Public Statements + Private Statements for Plots; Public Info + Private Notes for NPCs and Locations)
- [ ] DM can nest Anchors under Anchors of the same type (subplots, sub-locations)
- [ ] DM can write rich text content in all entity Fragments
- [ ] DM can type `@` in any Fragment to @mention another Lore Node
- [ ] @mentioning a name that doesn't exist auto-creates a minimal Anchor of the appropriate type under the correct Aggregation
- [ ] Auto-created Anchors default to Story/Private visibility and inherit the session anchor from where the @mention occurred
- [ ] DM can click into an auto-created Anchor and edit its visibility, session anchor, and child Fragments
- [ ] @mentions render as clickable links in the text
- [ ] Clicking an @mention link navigates to the target Anchor page
- [ ] Anchor pages show an **Unallocated Mentions** section with all incoming @mentions that have not been allocated to statements
- [ ] Each unallocated mention displays the **full paragraph** from the source Fragment, plus the source's origin (Fragment name, parent Anchor/session)
- [ ] Unallocated mentions update live as new @mentions are added across the campaign
- [ ] Other @mention links within an unallocated mention paragraph are themselves clickable (e.g., clicking @King Grol in Gundren's mention navigates to King Grol)
- [ ] Entities with Story/Private visibility are not visible to players
- [ ] Entities with Story/Public visibility are not visible during Prep (no marker)
- [ ] Entities appear in the campaign tree grouped by type under Aggregation nodes
- [ ] Unallocated mention counts are shown next to each entity in the campaign tree
- [ ] Automated test suite covers all of the above

## Test suite

Tests should cover:
- **Entity Anchor CRUD:** Create, read, update, delete for each default entity type (Plot, NPC, Location).
- **Auto-created Fragments:** Creating an entity Anchor generates the correct child Fragments with correct types and visibility.
- **Nesting:** Subplot Anchor under plot Anchor, sub-location Anchor under location Anchor.
- **@Mentions — explicit targets:** Typing `@` followed by an existing Anchor name creates a link to the target.
- **@Mentions — auto-creation:** Typing `@` followed by a non-existent name auto-creates a minimal Anchor. Verify: created under correct Aggregation, correct type, Story/Private default, empty child Fragments, correct session anchor.
- **@Mentions — multiple mentions to same target:** Mentioning the same Anchor in multiple Fragments creates multiple unallocated mentions on the target, each with its own paragraph context. Verify no duplicate Anchors created.
- **Unallocated mentions display:** When entity A mentions entity B, entity B's page shows an unallocated mention with the full paragraph from entity A. Verify: paragraph text is correct, source origin label is correct (Fragment name + parent info), @mentions within the paragraph are clickable.
- **Unallocated count:** Campaign tree shows unallocated mention count per entity. Verify count matches actual incoming unallocated mentions.
- **Editing propagation:** If the DM edits a paragraph that contains @mentions, the unallocated mentions on the target update to reflect the new text.
- **Deletion handling:** If a Fragment containing @mentions is deleted, the unallocated mentions on the target are removed. If an Anchor is deleted, @mentions pointing to it become... (open question — broken links? tombstones?).
- **Visibility:** Private Anchors not visible to players. Public Anchors not visible during Prep. Unallocated mentions from private sources not shown to players who can't see the source.
- **Mention visibility filtering:** Players only see unallocated mentions from Fragments they have visibility to. The DM sees all mentions.
- **Navigation round-trip:** Click @mention link from source → land on target's page → click an unallocated mention origin link → land back at the source Fragment. Verify full bidirectional navigation.
- **Integration flow:** Create NPCs → @mention Locations and Plots (some auto-created) → fill in Locations with @NPC mentions → fill in Plots with @NPC and @Location mentions → click through every entity page → verify unallocated mentions show correct full paragraphs → verify from player perspective nothing is visible during Prep.

## Spec sections tested

§3.1 (Lore Node model — Aggregation, Anchor, Fragment), §3.8 (Campaign Entities — Anchor types, auto-created Fragments), §3.9 (@Mentions — auto-creation, unallocated mentions, bidirectional links), §3.3 (Fragments), §3.2 (Campaign Status — Prep), §4.8, §4.9. Unallocated mentions set up UC-004 (§3.10 Statements & Allocation).

## Spec changes triggered

- **@mention type picker for auto-creation:** When the DM @mentions a name that doesn't exist, the system needs to know what type of Anchor to create (NPC, Plot, Location, custom). The spec (§3.9) says "of the appropriate type" but doesn't specify how the system determines this. Options: the DM picks from a dropdown when the auto-create happens, or the system infers from context (e.g., mentioning from the Plots section defaults to Plot). New open question.
- **Deletion of Anchors with incoming mentions:** What happens to @mention links when the target Anchor is deleted? Broken links? Tombstones? The source text still has the mention. New open question.
- **Mention visibility filtering:** When a player views an Anchor, they should only see unallocated mentions (and statement sources) from Fragments they have permission to see. This is implied by the visibility model but not explicitly stated in §3.9. Should be added.
