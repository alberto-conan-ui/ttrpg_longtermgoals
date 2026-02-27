# UC-005 — Full Session Prep (Stress Test)

**Status:** Draft
**Spec version:** v0.13
**Campaign:** Lost Mine of Phandelver (D&D 5e Starter Set)
**Continues from:** UC-004

## Summary

The DM — still in Prep — takes the skeleton session prep from UC-001 and expands it into a complete, runnable Session 1. Every scene, encounter, NPC interaction, branching path, treasure, and key piece of information is represented in the campaign tree. This use case stress-tests whether the Lore Node model (Aggregation, Anchor, Fragment + Statements) can adequately represent a real tabletop RPG session. The key deliverable is a full tree at the end that we can look at and be convinced it describes Session 1 of Lost Mine of Phandelver for real.

## Starting state

From previous use cases:
- **UC-001:** Session 1 "Goblin Arrows" exists (status: Planned). Has Session Notes with a high-level summary and basic nested scenes (The Goblin Ambush, Cragmaw Hideout with three branches).
- **UC-002:** Four players have joined. Three have backstories. Thorin @mentioned Gundren.
- **UC-003:** All entities created — NPCs, Locations, Plots with @mentions throughout.
- **UC-004:** All unallocated mentions processed into ordered statements on every entity.

The DM now expands Session 1 into a complete prep.

## Walkthrough

### Expanding the Session Summary (player-facing hook)

1. The DM opens Session 1 "Goblin Arrows" and clicks on the auto-created **Session Summary** (Story/Public). Since this is the first session, there are no track changes to auto-populate. The DM writes the player-facing hook:

   > *You've each found your way to Neverwinter for your own reasons, but one thing connects you — Gundren Rockseeker. The dwarf prospector has hired you to escort a wagon of mining supplies south along the High Road and then east along the Triboar Trail to the rough-and-tumble settlement of Phandalin. Gundren was clearly excited and more than a little secretive about his reasons for the trip, saying only that he and his brothers had found "something big." He paid you each 10 gold pieces and set out ahead of you on horseback, along with a warrior escort named Sildar Hallwinter, to "take care of business in town" before your arrival. You've been on the road for about half a day...*

   The DM @mentions **@Gundren Rockseeker**, **@Sildar Hallwinter**, and **@Phandalin** in the text. Since these Anchors already exist, the mentions link directly to them. New unallocated mentions appear on each Anchor.

### Expanding Session Notes (DM prep)

2. The DM opens **Session Notes** (Story/Private). The high-level summary from UC-001 is already there. Now the DM restructures it into a proper scene-by-scene guide. They edit the top-level rich text into a running order:

   > *Running order: Hook (wagon journey) → Ambush (dead horses, 4 goblins) → Investigation (trail to hideout) → Cragmaw Hideout (5-room dungeon). Key goals: rescue @Sildar Hallwinter, learn about @Cragmaw Castle, find @Lionshield Coster supplies. Fail-safe: if party is captured, Yeemik uses them against Klarg.*

### Scene 1: The Road to Phandalin

3. The DM already has "The Goblin Ambush" from UC-001 but wants a scene *before* the ambush — the quiet journey that sets the tone. Creates a new child Fragment under Session Notes:

   **Fragment — Story/Private, subtype: Travel** — **"The Road to Phandalin"**

   > *The wagon rumbles south along the High Road and then turns east onto the Triboar Trail. The trail is rougher — less travelled, flanked by forest. Describe the autumn scenery, the sounds of the forest, the creak of the wagon. Let the players chat in character and settle into their roles.*
   >
   > *Ask each player: "What is your character doing on the wagon?" This is a chance for backstory moments — @Thorin Ironforge might talk about Gundren, others might reveal their motivations.*
   >
   > *After 10–15 minutes of roleplay, describe: "As you come around a bend, you spot something in the road ahead..."*

   > **What happens:** The `@Thorin Ironforge` mention links to the player's Anchor. An unallocated mention appears there — the DM can later allocate it to a statement about Thorin's connection to the quest.

### Scene 2: The Goblin Ambush (expanded)

4. The DM clicks on the existing **"The Goblin Ambush"** scene from UC-001 and expands it significantly. Edits the rich text:

   > *Two dead horses sprawl about fifty feet ahead of the wagon, blocking the path. Each has several black-feathered arrows sticking out of it. The saddlebags have been looted.*
   >
   > *Investigation:*
   > - *DC 10 Nature/Survival: The horses are @Gundren Rockseeker's. They've been dead about a day.*
   > - *DC 13 Perception: An empty leather map case lies nearby. Whatever was inside is gone.*
   > - *DC 10 Perception (or passive): Goblin tracks lead northwest into the forest.*
   >
   > *As the party investigates, 4 goblins (MM p.166) attack from the bushes. Two from each side of the road.*

5. The DM creates child Fragments under "The Goblin Ambush" for the encounter details:

   **Fragment — Story/Private, subtype: Fight** — **"Ambush Encounter"**

   > *4 Goblins (AC 15, HP 7, +4 to hit, 1d6+2 damage)*
   > *Stealth +6 vs party's passive Perception*
   > *Terrain: road flanked by dense bushes (difficult terrain off-road), trees provide half cover*
   > *Tactics: Goblins use Nimble Escape to hide as bonus action. They flee toward the hideout trail if 2 are killed.*

   **Fragment — Mechanics** — **"Goblin Stat Block"**

   > *Goblin — Small humanoid, AC 15 (leather + shield), HP 7 (2d6), Speed 30 ft.*
   > *STR 8 DEX 14 CON 10 INT 10 WIS 8 CHA 8*
   > *Scimitar: +4, 1d6+2 slashing. Shortbow: +4, range 80/320, 1d6+2 piercing.*
   > *Nimble Escape: Disengage or Hide as bonus action.*

   **Fragment — Story/Private, subtype: Discovery** — **"After the Ambush"**

   > *If the party searches the dead horses carefully:*
   > - *The horses belong to @Gundren Rockseeker and @Sildar Hallwinter.*
   > - *The empty map case: @Gundren Rockseeker was carrying a map — it's gone. (This is the map to @Wave Echo Cave, taken by the goblins to @King Grol.)*
   > - *The goblin trail leads northwest. DC 10 Survival to follow without getting lost.*
   > - *If the party follows the trail, they find two snare traps (DC 12 Perception to spot, DC 10 DEX save or restrained) and eventually reach @Cragmaw Hideout.*

### Scene 3: The Goblin Trail

6. The DM creates a new scene between the ambush and the hideout:

   **Fragment — Story/Private, subtype: Travel** — **"The Goblin Trail"**

   > *A narrow trail leads northwest through the forest. Broken branches, muddy goblin footprints. About 10 minutes in...*
   >
   > ***Trap 1 — Snare:*** *DC 12 Perception to spot a crude snare hidden among the undergrowth. On failure: DC 10 DEX save or be yanked upside down, restrained, hanging from a tree. Takes an action to cut down.*
   >
   > ***Trap 2 — Pit:*** *DC 15 Perception. A covered pit, 10 feet deep (1d6 fall damage). Goblins covered it with branches and leaves.*
   >
   > *After about 15 minutes of travel, the trail opens up at the mouth of a cave — the stream entrance to @Cragmaw Hideout. A stream flows out of the cave mouth. Two goblin sentries hide in the brush (passive Perception to spot, or they attack with surprise).*

### Scene 4: Cragmaw Hideout (expanded dungeon)

7. The DM clicks on the existing **"Cragmaw Hideout"** scene and completely overhauls it into a full dungeon. Edits the rich text into an overview:

   > *A large cave in a hillside, five minutes from the Triboar Trail. A shallow stream flows out of the cave mouth. Inside: a network of caverns connected by tunnels. Key areas: the stream entrance (sentries), kennel (wolves), steep passage, goblin bridge over the stream, twin pools (Yeemik + Sildar), and Klarg's cave (boss). Total: ~12 goblins, 3 wolves, 1 bugbear, 1 wolf (Ripper).*

   The DM then creates child Fragments for each room/area of the dungeon:

   **Fragment — Story/Private, subtype: Scene** — **"Cave Mouth (Area 1)"**

   > *The stream flows out of the cave mouth, about 5 feet wide and 1 foot deep. Dense brush on either side. Two goblin sentries hide in the thicket (Stealth +6).*
   > *If the party is noisy or carrying light, the sentries spot them at 100 feet and one runs inside to warn @Klarg.*
   > *If the party is stealthy, DC 12 Perception spots the sentries first.*

   **Fragment — Story/Private, subtype: Scene** — **"Kennel (Area 2)"**

   > *Just inside the cave, a side passage leads to a small chamber where @Klarg keeps three wolves chained to an iron rod. The wolves snarl and bark at intruders.*
   > *Wolves (AC 13, HP 11, +4 bite for 2d4+2). Chained — 10 ft reach only.*
   > *A character who speaks to the wolves or succeeds on a DC 15 Animal Handling check can calm them. A calm wolf won't attack and might even be befriended.*
   > *Fissure: A narrow opening in the east wall leads up to Area 5 (@Klarg's cave) — too narrow for most creatures, but a Small character or someone who squeezes can use it as a back entrance. DC 10 Athletics to climb.*

   **Fragment — Story/Private, subtype: Scene** — **"Steep Passage (Area 3)"**

   > *The main passage ascends steeply. The stream runs down the middle. Every 10 minutes, goblins in Area 4 release a flood down the passage.*
   > ***Flood:*** *DC 10 DEX save or be swept back to the cave entrance and knocked prone. 1d4 bludgeoning.*
   > *The passage is 15 feet high. Midway up, a rickety bridge (Area 4) crosses overhead.*

   **Fragment — Story/Private, subtype: Scene** — **"Goblin Bridge (Area 4)"**

   > *A rickety bridge of wood and rope spans the passage, 20 feet up. One goblin stands guard. There's a pool of dammed-up water behind a makeshift dam of branches and mud.*
   > *The guard can release the dam as an action, sending a flood down the passage (see Area 3).*
   > *If the party fights here, the bridge is unstable. Any creature that takes damage on the bridge must succeed on a DC 10 DEX save or fall 20 feet (2d6 damage).*

   **Fragment — Story/Private, subtype: Scene** — **"Twin Pools (Area 5) — Yeemik's Lair"**

   > *A large cavern with two pools fed by a waterfall from the back wall. @Yeemik holds @Sildar Hallwinter prisoner here. Sildar is bound and beaten (1 HP). Six goblins lounge around.*
   >
   > *@Yeemik sees the party and immediately uses Sildar as a bargaining chip:*
   > *"I'll trade this human for @Klarg's head. Bring it to me and you can have your friend."*
   >
   > *If the party attacks: Yeemik orders a goblin to push Sildar off the ledge (DC 10 DEX save by a party member to catch him, or Sildar takes 1d6 fall damage — which kills him at 1 HP unless stabilised).*
   >
   > *If the party negotiates: Yeemik genuinely wants Klarg dead. He'll keep his word — sort of. He'll release Sildar but may try to renegotiate for more (treasure, weapons). He's a schemer, not honourable.*

   **Fragment — Story/Private, subtype: Dialogue** — **"Sildar's Information (if rescued)"**

   > *Once rescued, @Sildar Hallwinter shares:*
   > - *@Gundren Rockseeker and his brothers discovered the entrance to @Wave Echo Cave (Sildar doesn't know where it is).*
   > - *Gundren had a map. The goblins took it and sent it to someone called @King Grol at @Cragmaw Castle.*
   > - *Sildar was heading to @Phandalin to meet with someone named @Glasstaff, a fellow member of the Lords' Alliance who hasn't been heard from in months.*
   > - *Sildar asks the party to help him get to @Phandalin. He'll pay 50 gp for an escort.*

   > **What happens:** This scene is dense with @mentions. Some link to existing Anchors (Sildar, Gundren, Wave Echo Cave, King Grol, Cragmaw Castle, Phandalin, Glasstaff). This scene will be a major source for statement allocation — once played, the DM can allocate these as sources to existing statements or create new ones.

8. The DM now expands the three branching scenes under Cragmaw Hideout from UC-001:

   **"Confronting Klarg" (existing, expanded)** — **Story/Private, subtype: Fight**

   > *The largest cave. A natural chimney in the ceiling lets in dim light. @Klarg (bugbear) stands by a fire with his wolf Ripper and two goblins.*
   >
   > ***Klarg:*** *Bugbear — AC 16 (hide + shield), HP 27, Morningstar +4 (2d8+2). Surprise Attack: +2d6 on first hit if target is surprised.*
   > ***Ripper:*** *Wolf — AC 13, HP 11, +4 bite (2d4+2, DC 11 STR or prone).*
   > ***2 Goblins*** *(standard)*
   >
   > *Klarg fights to the death. He's arrogant and refers to himself in the third person: "Klarg will crush you!"*
   >
   > ***Treasure:*** *A chest with 600 cp, 110 sp, two potions of healing, a jade statuette of a frog (40 gp). Also: crates of stolen supplies stamped with the @Lionshield Coster mark.*
   >
   > *The back entrance via the fissure from Area 2 opens here. A stealthy party could surprise Klarg from behind.*

   **"Negotiating with Yeemik" (existing, expanded)** — **Story/Private, subtype: Dialogue**

   > *@Yeemik's deal: "Bring me Klarg's head." If the party brings proof:*
   > - *Yeemik releases @Sildar Hallwinter (see "Sildar's Information").*
   > - *Yeemik declares himself the new boss. He'll let the party leave with Sildar.*
   > - *But: Yeemik tries to squeeze more out of the deal — "Also leave your weapons. And that shiny ring." DC 15 Insight to realise he's bluffing. DC 12 Intimidation to shut him down.*
   > - *If the party refuses to give more, Yeemik grudgingly honours the original deal. He's a coward.*

   **"If the party is captured..." (existing, expanded)** — **Story/Private, subtype: Scene**

   > *If the entire party drops to 0 HP, the goblins don't kill them. @Yeemik takes them prisoner and strips their gear. He makes the same offer: "Kill @Klarg for me and I'll let you go."*
   > *This is the fail-safe — the party gets a second chance to experience the hideout, but from a position of weakness. They need to be clever.*
   > *Their gear is in a pile in Yeemik's chamber. If they agree to the deal, Yeemik returns their weapons but keeps their gold.*

### Adding DM reference notes

9. The DM creates a few utility Fragments directly under Session Notes for quick reference during play:

   **Fragment — Mechanics** — **"Quick Reference: DCs and Checks"**

   > *Ambush: Goblin Stealth +6 vs party Passive Perception*
   > *Dead horses: DC 10 Nature (identify horses), DC 13 Perception (map case), DC 10 Perception (trail)*
   > *Goblin trail: DC 12 Perception (snare), DC 15 Perception (pit), DC 10 Survival (follow trail)*
   > *Cragmaw Hideout: DC 12 Perception (sentries), DC 15 Animal Handling (wolves), DC 10 Athletics (fissure climb)*
   > *Yeemik negotiation: DC 15 Insight (bluffing), DC 12 Intimidation (shut him down)*
   > *Flood: DC 10 DEX save or swept to entrance + prone*
   > *Bridge: DC 10 DEX save or fall 20 ft*

   **Fragment — Mechanics** — **"Treasure & Rewards"**

   > *Klarg's chest: 600 cp, 110 sp, 2 potions of healing, jade frog statuette (40 gp)*
   > *Stolen @Lionshield Coster supplies (crates — returnable to Phandalin for 50 gp reward)*
   > *Sildar's escort offer: 50 gp to get to @Phandalin*
   > *XP: 4 goblins (ambush) = 200, 2 sentries = 100, 3 wolves = 150, ~8 goblins (hideout) = 400, Klarg + Ripper = 300. Total ~1150, or ~290 per player.*

   **Fragment — Story/Private, subtype: General** — **"Session 1 Objectives Checklist"**

   > *Must happen:*
   > - *Party encounters the ambush and discovers Gundren is missing*
   > - *Party finds the trail to Cragmaw Hideout (or learns about it)*
   >
   > *Should happen:*
   > - *Party rescues Sildar Hallwinter*
   > - *Sildar reveals info about Gundren, the map, Cragmaw Castle, Wave Echo Cave*
   > - *Party defeats or deals with Klarg*
   >
   > *Could happen:*
   > - *Party finds the Lionshield Coster supplies*
   > - *Party negotiates with Yeemik*
   > - *Party uses the fissure back entrance to surprise Klarg*
   > - *Party befriends the wolves*
   >
   > *If things go badly:*
   > - *Party is captured → Yeemik's deal is the fail-safe*
   > - *Sildar dies → party learns about Cragmaw Castle from goblin interrogation instead*

### Writing the Session Summary (player-facing)

10. The DM opens the **Session Summary** (Story/Public) and writes the hook that players will see when the campaign goes Active:

    > *@Gundren Rockseeker, dwarf prospector and old friend, has hired you to escort a wagon of mining supplies from Neverwinter to the frontier town of @Phandalin. He's offered 10 gold pieces each — not a fortune, but honest work. Gundren was excited about some discovery but refused to share details, saying only: "Big things are happening. I'll fill you in when I see you in Phandalin."*
    >
    > *He rode ahead with @Sildar Hallwinter, a human warrior, to "take care of business" before your arrival. You've been on the road for about half a day, following the Triboar Trail east through autumn forest. The wagon creaks. The road is quiet. Too quiet.*

### DM creates statements from session prep

11. The DM uses the session prep content to create statements on entity Anchors. These are facts the DM wants tracked — things that the session is designed to reveal or confirm.

    From **"Sildar's Information"**, the DM allocates to existing statements and creates new ones:

    On **Gundren Rockseeker** (Private Notes):
    - Allocates "Sildar's Information" scene to existing statement: "Found the entrance to Wave Echo Cave with his brothers" — now `(3 sources)`.
    - Allocates scene to existing statement: "Captured by King Grol at Cragmaw Castle" — now `(4 sources)`.

    On **Cragmaw Castle** (Private Notes):
    - Creates new statement: **"Location of Gundren and the map — party will learn from Sildar or goblin interrogation"** — allocates "Sildar's Information" as source. `(1 source)`.

    On **Glasstaff** (Private Notes):
    - Allocates "Sildar's Information" to existing statement about Glasstaff's identity — Sildar is looking for him. `(source count increases)`.

    From **"Confronting Klarg"**, the DM allocates:

    On **Lionshield Coster** (Public Info):
    - Creates new statement: **"Stolen supplies found in Cragmaw Hideout — returnable for reward"** — allocates the Klarg fight scene. `(1 source)`.

### DM reviews the complete session tree

12. The DM steps back and reviews the entire Session 1 tree. This is the moment of truth — does this tree represent a complete, runnable session?

---

## The Complete Session 1 Tree

```
Lost Mine of Phandelver [Prep]
│
├── Session 1: "Goblin Arrows" (Anchor — Session) [Planned]
│   │
│   ├── Session Summary (Fragment — Story/Public, auto-created)
│   │   └── (rich text: player-facing hook — hired by Gundren, wagon to Phandalin,
│   │        road is quiet... @Gundren Rockseeker, @Sildar Hallwinter, @Phandalin)
│   │
│   ├── Session Notes (Fragment — Story/Private, auto-created)
│   │   │   (rich text: running order — Hook → Ambush → Trail → Hideout.
│   │   │    Key goals: rescue Sildar, learn about Cragmaw Castle, find supplies.)
│   │   │
│   │   ├── "The Road to Phandalin" (Fragment — Story/Private, subtype: Travel)
│   │   │       (rich text: wagon journey, autumn forest, roleplay prompts,
│   │   │        ask each player what they're doing, @Thorin Ironforge callback,
│   │   │        transition: "you spot something in the road ahead...")
│   │   │
│   │   ├── "The Goblin Ambush" (Fragment — Story/Private, subtype: Scene)
│   │   │   │   (rich text: dead horses, black-feathered arrows, investigation DCs,
│   │   │   │    4 goblins attack from bushes, @Gundren Rockseeker's horses)
│   │   │   │
│   │   │   ├── "Ambush Encounter" (Fragment — Story/Private, subtype: Fight)
│   │   │   │       (rich text: 4 goblins, AC/HP/attacks, terrain, tactics,
│   │   │   │        flee toward hideout if 2 killed)
│   │   │   │
│   │   │   ├── "Goblin Stat Block" (Fragment — Mechanics)
│   │   │   │       (rich text: full stat block — AC 15, HP 7, abilities,
│   │   │   │        Nimble Escape)
│   │   │   │
│   │   │   └── "After the Ambush" (Fragment — Story/Private, subtype: Discovery)
│   │   │           (rich text: search results — horses belong to Gundren/Sildar,
│   │   │            empty map case → map to @Wave Echo Cave taken to @King Grol,
│   │   │            goblin trail leads NW, snare traps, leads to @Cragmaw Hideout)
│   │   │
│   │   ├── "The Goblin Trail" (Fragment — Story/Private, subtype: Travel)
│   │   │       (rich text: narrow forest trail, muddy footprints,
│   │   │        Trap 1: snare DC 12/DC 10 DEX,
│   │   │        Trap 2: pit DC 15, 10ft deep 1d6,
│   │   │        trail opens at @Cragmaw Hideout stream entrance,
│   │   │        2 goblin sentries in brush)
│   │   │
│   │   ├── "Cragmaw Hideout" (Fragment — Story/Private, subtype: Scene)
│   │   │   │   (rich text: dungeon overview — cave in hillside, stream,
│   │   │   │    ~12 goblins, 3 wolves, 1 bugbear, key areas listed)
│   │   │   │
│   │   │   ├── "Cave Mouth (Area 1)" (Fragment — Story/Private, subtype: Scene)
│   │   │   │       (rich text: stream exit, brush, 2 sentries Stealth +6,
│   │   │   │        noisy party → sentry warns @Klarg,
│   │   │   │        stealthy party → DC 12 Perception spots them)
│   │   │   │
│   │   │   ├── "Kennel (Area 2)" (Fragment — Story/Private, subtype: Scene)
│   │   │   │       (rich text: 3 wolves chained, AC 13 HP 11,
│   │   │   │        DC 15 Animal Handling to calm, fissure to Area 5
│   │   │   │        — back entrance to @Klarg's cave, DC 10 Athletics)
│   │   │   │
│   │   │   ├── "Steep Passage (Area 3)" (Fragment — Story/Private, subtype: Scene)
│   │   │   │       (rich text: ascending passage, stream,
│   │   │   │        flood trap every 10 min from Area 4,
│   │   │   │        DC 10 DEX save or swept back, 1d4 dmg,
│   │   │   │        bridge 20ft overhead)
│   │   │   │
│   │   │   ├── "Goblin Bridge (Area 4)" (Fragment — Story/Private, subtype: Scene)
│   │   │   │       (rich text: rickety bridge 20ft up, 1 goblin guard,
│   │   │   │        dam → releases flood down passage,
│   │   │   │        unstable: DC 10 DEX or fall 20ft for 2d6)
│   │   │   │
│   │   │   ├── "Twin Pools — Yeemik's Lair (Area 5)"
│   │   │   │   │   (Fragment — Story/Private, subtype: Scene)
│   │   │   │   │   (rich text: waterfall cavern, @Yeemik holds @Sildar Hallwinter,
│   │   │   │   │    Sildar at 1 HP, 6 goblins, Yeemik's bargain:
│   │   │   │   │    "Bring me @Klarg's head", threatens to push Sildar off ledge)
│   │   │   │   │
│   │   │   │   ├── "Sildar's Information (if rescued)"
│   │   │   │   │       (Fragment — Story/Private, subtype: Dialogue)
│   │   │   │   │       (rich text: what Sildar reveals — @Gundren found @Wave Echo Cave,
│   │   │   │   │        map taken to @King Grol at @Cragmaw Castle,
│   │   │   │   │        Sildar looking for @Glasstaff in @Phandalin,
│   │   │   │   │        offers 50 gp escort)
│   │   │   │   │
│   │   │   │   └── "Negotiating with Yeemik"
│   │   │   │           (Fragment — Story/Private, subtype: Dialogue)
│   │   │   │           (rich text: Yeemik's deal details, releases Sildar if Klarg killed,
│   │   │   │            tries to squeeze more, DC 15 Insight / DC 12 Intimidation,
│   │   │   │            coward — honours deal grudgingly)
│   │   │   │
│   │   │   ├── "Confronting Klarg (Area 6)"
│   │   │   │       (Fragment — Story/Private, subtype: Fight)
│   │   │   │       (rich text: largest cave, @Klarg + wolf Ripper + 2 goblins,
│   │   │   │        Klarg stats: AC 16 HP 27, Morningstar +4 2d8+2, Surprise Attack,
│   │   │   │        fights to death, "Klarg will crush you!",
│   │   │   │        treasure chest: 600cp/110sp/2 potions/jade frog,
│   │   │   │        @Lionshield Coster crates, fissure back entrance from Area 2)
│   │   │   │
│   │   │   └── "If the party is captured..."
│   │   │           (Fragment — Story/Private, subtype: Scene)
│   │   │           (rich text: fail-safe — @Yeemik captures party, strips gear,
│   │   │            same deal: kill @Klarg, second chance at hideout,
│   │   │            gear in pile, weapons returned but gold kept)
│   │   │
│   │   ├── "Quick Reference: DCs and Checks" (Fragment — Mechanics)
│   │   │       (rich text: all DCs in one place — ambush, trail, hideout,
│   │   │        negotiation, traps, floods, bridge)
│   │   │
│   │   ├── "Treasure & Rewards" (Fragment — Mechanics)
│   │   │       (rich text: Klarg's chest contents, Lionshield supplies reward,
│   │   │        Sildar's 50 gp offer, XP breakdown: ~1150 total / ~290 per player)
│   │   │
│   │   └── "Session 1 Objectives Checklist" (Fragment — Story/Private, subtype: General)
│   │           (rich text: Must/Should/Could/If-things-go-badly objectives,
│   │            structured as a DM reference card)
│   │
│   └── [Recap] — (does not exist yet — auto-created when session transitions to Played)
│
├── Players (Aggregation)
│   ├── Thorin Ironforge ✓ backstory (1 unallocated from Session Summary)
│   ├── Elara Moonwhisper ✓ backstory
│   ├── Brother Aldric ✓ backstory
│   └── Player 4 — backstory pending
│
├── Plots (Aggregation)
│   └── "The Lost Mine of Wave Echo Cave" (Anchor — Plot)
│       │   Public Statements: (rich text + 2 statements)
│       │   Private Statements: (rich text + 2 statements)
│       ├── "The Black Spider" (Anchor — Plot, private)
│       │       Private Statements: (rich text + 1 statement)
│       ├── "The Redbrands" (Anchor — Plot, from Session 2)
│       │       Public Statements + Private Statements
│       └── "The Cragmaw Goblins" (Anchor — Plot)
│               Public Statements + Private Statements
│
├── NPCs (Aggregation)
│   ├── Gundren Rockseeker
│   │   │   Public Info: (rich text + 2 statements, 1 new unallocated from Session Summary)
│   │   │   Private Notes: (rich text + 2 statements, sources updated from session prep)
│   │   └── [No children — all info is in statements + rich text]
│   ├── Sildar Hallwinter
│   │       Public Info + Private Notes (1 new unallocated from Session Summary)
│   ├── Klarg
│   │       Public Info + Private Notes (3 statements)
│   ├── Yeemik
│   │       Public Info + Private Notes (2 statements)
│   ├── King Grol (private)
│   │       Private Notes (2 statements)
│   ├── Nezznar the Black Spider (private)
│   │       Private Notes (3 statements)
│   ├── Glasstaff (private)
│   │       Private Notes (3 statements, incl. 1 superseded; source updated from session prep)
│   └── Lionshield Coster
│           Public Info (1 statement) + Private Notes (1 new statement from session prep)
│
├── Locations (Aggregation)
│   ├── Cragmaw Hideout
│   │       Public Info + Private Notes (statements from UC-004 + new from session prep)
│   ├── Cragmaw Castle (private)
│   │       Private Notes (1 new statement from session prep)
│   ├── Phandalin (from Session 2)
│   │   │   Public Info + Private Notes (1 new unallocated from Session Summary)
│   │   ├── Tresendar Manor (private)
│   │   └── Stonehill Inn
│   └── Wave Echo Cave (private)
│           Private Notes (statements)
│
├── Idle Goals (Aggregation) — empty (no goals until campaign is Active and between sessions)
│
└── Events (Aggregation) — empty (no events until downtime)
```

---

## Analysis: Does the Tree Work?

### What this tree proves

**The session is navigable as a story.** Session Notes reads top-to-bottom as a running order: Road → Ambush → Trail → Hideout. Each scene has all the information the DM needs: descriptions, DCs, stat blocks, dialogue, branching outcomes. The DM can click through the tree during play.

**Branching is natural.** The hideout's branching outcomes (negotiate with Yeemik, fight Klarg, get captured) are sibling Fragments under the parent scene. The DM can jump to whichever branch the players choose.

**Mechanics live alongside narrative.** Stat blocks and DC reference cards are Mechanics Fragments nested where they're needed. The "Quick Reference" and "Treasure" Fragments at the Session Notes level give the DM a quick lookup without scrolling through scenes.

**@mentions connect everything.** Every NPC, Location, and Plot mentioned in the session prep is clickable, linking to the entity's Anchor page. During play, the DM can click @Klarg to see Klarg's statements and all sources. After play, the DM can allocate the session's scenes as sources to entity statements.

**Statements accumulate.** Session prep scenes (like "Sildar's Information") are allocated to existing entity statements, strengthening the knowledge graph. New statements are created where session prep reveals new facts.

**The Session Summary works as a player hook.** When the campaign goes Active and the marker lands on Session 1, players see the Summary — the "previously on" that sets the scene. Everything in Session Notes stays private.

### What this tree surfaces as potential issues

**Depth.** The tree goes 5 levels deep in places (Session 1 → Session Notes → Cragmaw Hideout → Twin Pools → Sildar's Information). The UI needs to handle this without becoming unwieldy. Collapsible tree nodes are essential.

**Scene count.** Session 1 has 15 Fragment children under Session Notes (including nested ones). A more complex session could have 30+. The DM needs a way to navigate quickly — perhaps a mini-map or outline view within a session.

**Mechanics vs narrative friction.** Stat blocks (Mechanics Fragments) sit alongside scenes. During play, the DM might want to see the encounter description AND the stat block side-by-side, not as sequential tree nodes. The UI should consider a split or tabbed view for Mechanics Fragments.

**Dungeon map gap.** The dungeon is described room-by-room in text, but there's no map. The spec explicitly excludes map tools (§6), but a DM running Cragmaw Hideout would probably have a physical map or VTT alongside. The tree is the narrative layer, not the spatial one. This is fine — it's a companion tool, not a VTT replacement — but worth noting.

**Duplicate information risk.** Some information appears in multiple places — Klarg is described in both the NPC Anchor and in the "Confronting Klarg" scene. Statements + allocation mitigate this (the scene is a *source* for the NPC statement, not a copy), but the DM might still feel like they're writing things twice. The @mention + allocation model helps because the DM writes naturally in scenes and then allocates facts to entities — the scenes are the source of truth.

**No player visibility during Prep.** Everything in this tree is Story/Private (under Session Notes) or not yet visible (Session Summary is Story/Public but the campaign isn't Active). Players see nothing. This is correct per the spec, but it means the Session Summary is the only thing players will see from all this prep work. The real player-facing content will come from the Recap (auto-created when session transitions to Played). This is a design choice — prep is private, play creates the shared record.

## Done when

- [ ] Session Notes can contain 15+ nested Fragments without UI degradation
- [ ] Tree depth of 5+ levels is navigable (collapsible nodes)
- [ ] Mixed Fragment types (Scene, Fight, Dialogue, Discovery, Travel, Mechanics, General) coexist naturally under one parent
- [ ] Mechanics Fragments are visually distinct from narrative Fragments
- [ ] @mentions in session prep Fragments link to existing entity Anchors
- [ ] New @mentions from session prep (e.g., in Session Summary) create unallocated mentions on target Anchors
- [ ] DM can allocate session prep scenes as sources to entity statements (non-@mention allocation)
- [ ] Session Summary is Story/Public and will be visible to players when campaign goes Active
- [ ] Session Notes and all children remain Story/Private regardless of marker position
- [ ] DM can add utility Fragments (Mechanics, checklists) at the Session Notes level for quick reference
- [ ] The full tree (as shown above) can be created and navigated within the tool
- [ ] Automated test suite covers all of the above

## Test suite

Tests should cover:

- **Deep nesting:** Create 5+ levels of nested Fragments under Session Notes. Verify parent-child relationships, tree rendering, navigation.
- **Fragment type mixing:** Scene, Fight, Dialogue, Discovery, Travel, Mechanics, General Fragments all coexist under one Session Notes parent. Verify each renders with correct type label/icon.
- **Scale:** 15+ Fragments under Session Notes. Verify performance, scrolling, collapsibility.
- **@mention linking from session prep:** Mentions in Session Summary and Session Notes Fragments link to existing Anchors. Verify navigation works.
- **Unallocated mentions from session prep:** @mentions in newly written Fragments (Session Summary, expanded scenes) create unallocated mentions on target Anchors.
- **Non-@mention allocation:** Allocate a scene Fragment (e.g., "Sildar's Information") as a source to a statement on an entity Anchor. Verify the source appears, is navigable, and the statement source count updates.
- **Visibility rules:** Session Notes + all children = Story/Private, invisible to players. Session Summary = Story/Public, visible when campaign Active and marker on Session 1. Recap = not yet created.
- **Integration:** Full flow — expand UC-001 skeleton into complete session prep → write Session Summary → allocate session prep scenes to entity statements → verify full tree matches expected structure → verify player sees nothing during Prep.

## Spec sections tested

§3.1 (Lore Node model at scale), §3.2 (Campaign Status — Prep, Session Status — Planned), §3.3 (Fragments — all types, deep nesting, Mechanics), §3.3.1 (Fragment Types — all subtypes exercised), §3.3.2 (Session Lifecycle — Session Notes, Session Summary), §3.3.3 (Content Display), §3.8 (Campaign Entities — @mentions from session prep), §3.9 (@Mentions — linking to existing Anchors, allocation from non-@mention sources), §3.10 (Statements — allocation from session prep)

## Spec changes triggered

- **Mechanics Fragment visibility:** The spec says Mechanics Fragments "inherit from parent element." When the parent is Session Notes (Story/Private), Mechanics children are also private. But if the DM wants a player-visible stat reference (e.g., posted after play), they'd need to move or recreate it. Consider: should Mechanics Fragments have independently settable visibility? New open question.
- **UI considerations surfaced:** Deep nesting (5+ levels), scene count (15+ per session), side-by-side Mechanics view, mini-map/outline within sessions. These are design questions, not spec changes, but should inform Phase 3 UI planning.
- **Session objectives pattern:** The "objectives checklist" Fragment is a natural DM pattern. Could this become a first-class feature — a checklist type with checkable items — or is a Story/Private Fragment sufficient? New open question.
