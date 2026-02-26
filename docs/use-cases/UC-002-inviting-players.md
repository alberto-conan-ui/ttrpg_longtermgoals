# UC-002 — Inviting Players & Player Onboarding

**Status:** Draft
**Spec version:** v0.10
**Campaign:** Lost Mine of Phandelver (D&D 5e Starter Set)
**Continues from:** UC-001

## Summary

The DM creates player slots in the campaign tree, pre-seeds character-specific content, and sends personalised invite links. Players register, join via their invite link, find pre-seeded content and a backstory request on their profile, and write their characters. The campaign remains in Prep throughout.

## Walkthrough

### DM creates player slots

1. The DM opens "Lost Mine of Phandelver." Campaign status is **Prep**. Session 1 "Goblin Arrows" is **Planned** from UC-001.
2. DM opens the **Players** node in the campaign tree. It's empty.
3. DM clicks `+` to create the first player slot:
   - Checks **"Require backstory"**
   - Adds a pre-seeded Lore Fragment (Story/Private, visible to both the DM and the player who fills this slot): **"Character briefing"** —
     > *You are a close friend of Gundren Rockseeker. He has hired you to escort a wagon of mining supplies from Neverwinter to Phandalin. Gundren has gone ahead with a warrior named Sildar Hallwinter, mentioning that he's made a discovery of great importance. He was excited but secretive. The pay is 10 gold pieces each.*
4. DM creates three more slots, all with "Require backstory" checked and the same briefing fragment pre-seeded. (In a more varied campaign, each slot might have different briefings.)
5. The campaign tree now shows:
   ```
   (Players)
   ├── [Empty slot 1] — invite link generated
   ├── [Empty slot 2] — invite link generated
   ├── [Empty slot 3] — invite link generated
   └── [Empty slot 4] — invite link generated
   ```
6. DM copies each invite link and sends them to four friends on Discord.

### First player joins

7. **Player 1** receives the invite link. They register with Google OAuth and use the link to join.
8. Player 1 fills slot 1. Their **Player Profile** is created. The pre-seeded briefing fragment is now attached to their profile.
9. Player 1 lands on their **Inbox**. They see:
   - A **Request**: "Write your character backstory on your Player Profile" — linked to their profile.
10. Player 1 clicks through to their Player Profile. They see the DM's briefing: the details about Gundren, the wagon job, the 10 gold payment.
11. Player 1 creates a Lore Fragment on their profile — **Story/Public, subtype: General** — titled **"Thorin Ironforge"**:
    > *Dwarf fighter. Former soldier from Neverwinter. Gundren and I fought together in the orc raids ten years ago. When he asked me to escort his wagon, I couldn't say no — I owe him my life. He mentioned a "discovery" but wouldn't say more. Knowing Gundren, it's either a gold mine or trouble. Probably both.*
12. Player 1 marks the backstory request as **completed**.

### More players join

13. **Player 2** joins via their invite link, sees the briefing and request. Creates their backstory: **"Elara Moonwhisper"** — *half-elf rogue, hired in Neverwinter for the escort job, drawn by the promise of opportunities in Phandalin.*
14. **Player 3** joins. Creates: **"Brother Aldric"** — *human cleric of Lathander, received a vision of darkness in the east, the road to Phandalin calls him.*
15. **Player 4** joins but doesn't write a backstory yet. The request stays **pending** in their Inbox.

### DM checks progress

16. DM opens the Players node. The tree now shows:
    ```
    (Players)
    ├── Thorin Ironforge (Player 1) ✓ backstory
    │   ├── "Character briefing" (Story/Private, pre-seeded)
    │   └── "Thorin Ironforge" (Story/Public, written by player)
    ├── Elara Moonwhisper (Player 2) ✓ backstory
    │   ├── "Character briefing" (Story/Private, pre-seeded)
    │   └── "Elara Moonwhisper" (Story/Public, written by player)
    ├── Brother Aldric (Player 3) ✓ backstory
    │   ├── "Character briefing" (Story/Private, pre-seeded)
    │   └── "Brother Aldric" (Story/Public, written by player)
    └── Player 4 — backstory pending
        └── "Character briefing" (Story/Private, pre-seeded)
    ```
17. DM reads the backstories. Notes that Thorin has a personal connection to Gundren — useful for roleplay hooks.
18. DM's Inbox shows: 3 backstory requests completed, 1 still pending.

### What players see during Prep

19. While the campaign is in **Prep**, players can see:
    - Their own Inbox (with requests)
    - Their own Player Profile (with pre-seeded content and their own backstory)
    - Other players' **public** backstories (Story/Public fragments on other profiles)
    - **Nothing else** — no sessions, no campaign tree structure beyond the Players node

## Done when

- [ ] DM can create player slots under the Players node in the campaign tree
- [ ] Each slot generates a unique invite link
- [ ] DM can check "Require backstory" when creating a slot
- [ ] DM can pre-seed Lore Fragments on a slot before a player joins
- [ ] Player can register and join via a per-slot invite link
- [ ] Player Profile is auto-created when the player fills a slot
- [ ] Pre-seeded Lore Fragments are attached to the Player Profile on join
- [ ] "Require backstory" triggers an auto-Request in the player's Inbox, linked to their profile
- [ ] Player can create a Lore Fragment on their Player Profile (Story/Public, with subtype)
- [ ] Player can mark a request as completed
- [ ] DM can see filled vs empty slots in the campaign tree
- [ ] DM can see request status (pending/completed) in their Inbox
- [ ] Campaign in Prep status: players see only Inbox, Players node, and profiles — no sessions or other campaign structure
- [ ] Automated test suite covers all of the above

## Test suite

Tests should cover:
- **Player Slots:** Creation, invite link generation, uniqueness of links, slot state (empty/filled).
- **Pre-seeded content:** DM creates Lore Fragments on a slot → player joins → fragments are attached to profile. Visibility rules respected (Story/Private pre-seeds visible only to DM and the owning player).
- **Invite flow:** Valid link → join succeeds. Invalid/used link → join fails. Duplicate join prevention.
- **Backstory request:** "Require backstory" checked → Request auto-created on join → appears in Inbox → player marks complete → DM sees status.
- **Campaign Prep visibility:** Players cannot see sessions, folders, entities, or any campaign tree nodes beyond the Players area. Verify with visibility-filtered API calls.
- **Integration:** Full flow — DM creates slot with briefing + backstory requirement → shares link → Player registers → joins → sees briefing → writes backstory → marks request complete → DM verifies.

## Spec sections tested

§4.1, §3.13 (Player Slots), §3.12 (Requests), §3.11 (Inbox), §3.2 (Campaign Status — Prep), §3.3 (Lore Fragments on Player Profiles)

## Spec changes triggered

- Player Slots replace the old invite code model (§3.13). Slots live in the campaign tree under the Players node.
- Per-slot invite links. DM controls who fills which slot.
- DM can pre-seed Lore Fragments on a slot before the player joins.
- "Require backstory" checkbox auto-generates a Request on join.
