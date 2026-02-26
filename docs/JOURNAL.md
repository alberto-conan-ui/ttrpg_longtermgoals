# TTRPG Long-Term Goals — Project Journal

> **How to use this file:** Upload this file (and the codebase) at the start of
> every new Claude chat. Claude should read this first to understand where we
> are and what to do next. Update this file at the end of every session.

---

## Current Status

**Phase:** Specification
**Last session:** 2026-02-26
**State:** Spec v0.12 drafted. Unified Lore Node model (Aggregation, Anchor, Fragment). @Mentions auto-create Anchors, References show full paragraphs, TODOs deferred. Use cases being built against Lost Mine of Phandelver — UC-001, UC-002, UC-003 drafted.

## Next Actions

1. Human reviews spec v0.7, especially:
   - Campaign Entities (§3.8) — are the default types right? What auto-created fragments should custom types get?
   - @Mentions (§3.9) — should comments support @mentions too, or just rich text in Lore Fragments?
   - TODOs (§3.10) — are Ignore and Create sufficient actions, or do we need more?
   - Inbox (§3.11) — what's the priority/grouping model?
   - Open questions §5 — now 16 questions, decide on as many as possible.
2. Iterate spec based on feedback.
3. Once spec is stable, move to implementation planning phase.

---

## Key Decisions

| # | Date | Decision | Rationale |
|---|------|----------|-----------|
| 1 | 2026-02-26 | Write a non-technical spec before any further development | Prevents drift when building with AI agents (Windsurf). Forces explicit decisions. |
| 2 | 2026-02-26 | Spec lives in `docs/SPEC.md`, journal in `docs/JOURNAL.md`, both in the repo | Travels with codebase, version-controlled, available to both Claude and Windsurf. |
| 3 | 2026-02-26 | Iterate spec in Claude chats, implement via Windsurf | Claude for thinking/planning, Windsurf for code generation. |
| 4 | 2026-02-26 | Downtime feature is called "Idle Goals" with "Idle Tracks" | Tracks are DM-authored rows of boxes with a token. Players declare intent; DM moves the token. |
| 5 | 2026-02-26 | DM can move track tokens independently of player actions | The world simulates alongside player choices. DM is the world simulator. |
| 6 | 2026-02-26 | Track box descriptions can be hidden from players | DM controls reveal of consequences, consistent with the story-scope visibility pattern. |
| 7 | 2026-02-26 | Tracks have a lifecycle: available from a session, can be retired | Goals aren't permanent — they open and close as the story demands. |
| 8 | 2026-02-26 | Session transitions include a summary of track changes | Auto-populates "Public Session Information" fragment. |
| 9 | 2026-02-26 | Lore Fragments are the universal content unit | Everything is a Lore Fragment. No separate page builder, showcase pages, or content types. |
| 10 | 2026-02-26 | Lore Fragment type system replaces old scope/visibility | Types: Story/Public, Story/Private, Event, Mechanics. Type sets defaults; visibility and edit permissions are independent overridable fields. |
| 11 | 2026-02-26 | Story fragments have organizational subtypes | Default set: General, Scene, Encounter, Fight, Escape, Dialogue, Discovery, Travel, Rest. DM can add custom subtypes per campaign. Purely organizational. |
| 12 | 2026-02-26 | Lore Fragments support parent-child relationships | General capability, not limited to recaps. Story/Public, Story/Private, and Event types support children. |
| 13 | 2026-02-26 | Session lifecycle auto-creates fragments | On creation: "Prep" (Story/Private) + "Public Session Information" (Story/Public). On session end: "Recap" (Story/Public, edit: everyone). |
| 14 | 2026-02-26 | Showcase Pages (Puck editor) removed | Replaced entirely by rich text Lore Fragments with inline images. Simpler, better fit for the audience. |
| 15 | 2026-02-26 | Player/Backstory type removed | Backstories are just Story/Public or Story/Private fragments on a player profile. Player chooses visibility. |
| 16 | 2026-02-26 | Every Lore Fragment has a comment thread | Comments are the in-character interaction model. Plain text, visible to anyone who can see the parent fragment. DM moderates. |
| 17 | 2026-02-26 | Events are a Lore Fragment type | Created by DM during downtime, shared with party or specific players. Triggers notifications. Players respond via comments. DM evolves events by adding child scenes. |
| 18 | 2026-02-26 | In-character interaction = Comments + Events | No separate chat system needed. Comments on fragments + Event-driven downtime interaction. Resolved §4.5. |
| 19 | 2026-02-26 | DM can impersonate any player | See their view, act on their behalf. Full permissions of target player. Transparent attribution on all actions. |
| 20 | 2026-02-26 | DM and players have distinct app experiences | DM: God view, navigates by structure, management-oriented. Player: session-anchored, sees only revealed content, participation-oriented. Both have access to campaign tree. |
| 21 | 2026-02-26 | Default story subtype renamed from "Event" to "General" | Avoids naming collision with the Event Lore Fragment type. |
| 22 | 2026-02-26 | Campaign Entities are a general pattern, not special-cased features | Plots, NPCs, Locations are instances of the same pattern. DM can create custom entity types. All are structural nodes with child Lore Fragments, @mentionable. |
| 23 | 2026-02-26 | Plots are aggregation nodes with auto-created Statement fragments | Public Statements (Story/Public) and Private Statements (Story/Private). No special Plot content model — it's all Lore Fragments. |
| 24 | 2026-02-26 | @Mentions are a universal cross-referencing system | Type @ in any rich text to reference any campaign tree node. Creates bidirectional links and generates TODOs. |
| 25 | 2026-02-26 | @Mentions create bidirectional links | Source links to target, target links back to source. Entities become cross-referenced indexes of their own narrative history. |
| 26 | 2026-02-26 | TODOs are owned by the node owner, DM can always help | The person responsible for a node processes its TODOs. DM has universal access. |
| 27 | 2026-02-26 | Inbox is a per-user consolidated action view | Aggregates TODOs, comments, events, idle goals, new content. Default landing for players. |
| 28 | 2026-02-26 | Parts replaced by optional Folders with DM-chosen labels | DM names folders whatever they want (Arc, Chapter, Stage, etc.). Sessions can also live directly under the campaign with no folder. |
| 29 | 2026-02-26 | Sessions have explicit statuses: Planning, Planned, Played | Planning → Planned is manual. Planned → Played is automatic on marker advance (or manual). Status is DM-side only, independent of the marker. |
| 30 | 2026-02-26 | Auto-created fragments renamed: Session Notes + Session Summary | "Prep" → "Session Notes" (more natural, useful beyond just prep). "Public Session Information" → "Session Summary" (clearer for players). |
| 31 | 2026-02-26 | Three-phase development model: POC → Spec/Use Cases → E2E Layers | POC is done (stages 1–5c). Currently in Phase 2: spec + use case walkthroughs. Phase 3 will build horizontal E2E layers using use cases as acceptance criteria. |
| 32 | 2026-02-26 | Use case walkthroughs validate and refine the spec | Each walkthrough tests the spec against a real scenario. Gaps found → spec updated. Use cases become Phase 3 acceptance criteria. |
| 33 | 2026-02-26 | Campaign has explicit status: Prep → Active → Paused → Completed | Prep = no marker, DM setting up. Active = marker exists, campaign running. Paused = frozen, DM can prep. Completed = read-only archive. |
| 34 | 2026-02-26 | Requests are a general-purpose DM → player nudge system | DM creates a request (description + target + optional linked node). Appears in player's Inbox. Player marks as completed. Lightweight and flexible. |
| 35 | 2026-02-26 | Use cases built against Lost Mine of Phandelver | Concrete, well-known campaign makes walkthroughs vivid and testable. |
| 36 | 2026-02-26 | Player Slots replace invite codes | DM creates slots in the campaign tree under Players node. Each slot gets a unique invite link. DM can pre-seed Lore Fragments and check "Require backstory." |
| 37 | 2026-02-26 | Per-slot invites, not per-campaign | Each player gets a personalised invite link. DM controls who fills which slot and can pre-write character-specific content before the player joins. |
| 38 | 2026-02-27 | Unified Lore Node model: Aggregation, Anchor, Fragment | Everything in the campaign tree is a Lore Node. Three kinds: Aggregation (pure grouping — folders, container nodes), Anchor (named @mentionable things — sessions, NPCs, plots, locations), Fragment (written content — the only place rich text lives). Eliminates the implicit "third node type" problem where entities were neither folders nor fragments. |
| 39 | 2026-02-27 | "Lore Fragment" narrowed to "Fragment" | The term "Fragment" now specifically means content-bearing Lore Nodes (kind=fragment). The umbrella term is "Lore Node." Anchors are named things; Fragments are written things. |
| 40 | 2026-02-27 | Folders are Aggregation Lore Nodes | No special "folder" type — folders are Lore Nodes with kind=aggregation. Root-level containers (Players, Plots, NPCs, Locations, Idle Goals, Events) are also Aggregations. |
| 41 | 2026-02-27 | @Mentions auto-create Anchors | When a user @mentions a name that doesn't exist, the system auto-creates a minimal Anchor of the appropriate type. No forward reference problem — entities spring into existence when first referenced. DM fills in details later (or never). |
| 42 | 2026-02-27 | References show full paragraphs | When viewing an Anchor page, the References section shows the full paragraph from each source where the Anchor was @mentioned, plus origin info. This makes the Anchor page a self-assembling dossier — the DM sees everything the campaign knows about an entity just from references. |
| 43 | 2026-02-27 | TODOs deferred — References are enough | The TODO processing queue (Ignore/Create) is overkill for the current model. @mention References with full-paragraph context provide the cross-referencing value without requiring the DM to process a queue. TODOs may be added later if curated content on entity pages proves necessary. |
| 44 | 2026-02-27 | References are computed, not stored | References are not a property of the Anchor. They are a computed view — the system queries all Fragments containing @mentions pointing at an Anchor and assembles them on the fly. Source of truth is always the @mention links in Fragments. |
| 45 | 2026-02-27 | References appear at the bottom of every Anchor page | Regardless of which child Fragment the user is viewing (Public Info, Private Notes, etc.), the References section is always visible at the bottom. They belong to the Anchor, not to any individual Fragment. |
| 46 | 2026-02-27 | References grouped by source Anchor | Format: `[TYPE] Anchor Name (visibility)` as group header, then `Fragment Name →` paragraph. Multiple references from the same source Anchor are clustered together for easy scanning. |

---

## Vision Summary

*(Captured from conversation — this is the informal version. The spec is the formal one.)*

This is a collaborative campaign companion for tabletop RPG groups. Both DMs and players use it. The DM tracks campaign structure (parts, sessions) and controls story pacing via a marker system that determines what players can see.

**Lore Nodes** are the universal building block — everything in the campaign tree is a Lore Node. There are three kinds: **Aggregation** (pure grouping — folders, containers), **Anchor** (named things — sessions, NPCs, plots, locations), and **Fragment** (written content — the only place rich text lives). The type system (Story/Public, Story/Private, Event, Mechanics for Fragments; NPC, Plot, Location, Session, etc. for Anchors) drives default behavior while keeping visibility and permissions as independent, overridable controls.

**Idle Goals** give structure to downtime between sessions. The DM offers goals with tracks (rows of labeled boxes), players declare what they want to pursue, and the DM moves tokens. The world doesn't wait — the DM can advance tracks independently.

**Events** are DM-triggered moments during downtime that notify players and invite in-character responses via comments. The DM can evolve events into scene trees based on player reactions.

**Comments** on any Lore Fragment are the in-character interaction layer. Players are encouraged to respond as their characters. The DM moderates.

**DM Impersonation** lets the DM see and act as any player, with transparent attribution.

**DM and Player views** are fundamentally different experiences — the DM manages and sees everything; the player participates and is anchored to the current moment.

---

## Session Log

### Session 1 — 2026-02-26

**Context:** First session. Human uploaded the full codebase.

**What happened:**
- Full code audit completed (see `docs/AUDIT.md`).
- Discussed approach: specification-first, then Windsurf implementation.
- Created collaboration model: spec + journal in repo, new chats per session.
- Spec evolved from v0.1 to v0.6 through iterative discussion:
  - v0.1: Initial skeleton from codebase.
  - v0.2: Added Idle Goals & Tracks system.
  - v0.3: Redesigned Lore Fragment model with type system, session lifecycle, parent-child.
  - v0.4: Removed Showcase Pages (Puck). Lore Fragments are the only content surface.
  - v0.5: Added Events, comments on all fragments, removed Player/Backstory type, resolved in-character interaction.
  - v0.6: Added DM impersonation, distinct DM/Player views, renamed default story subtype to "General."

**Key design breakthroughs:**
- Everything is a Lore Fragment (unified content model).
- Comments + Events = in-character interaction (no separate system needed).
- Session lifecycle auto-creates fragments (Prep, Public Info, Recap).
- DM impersonation for transparency and assistance.
- DM vs Player are genuinely different experiences, not just permission filters.

**What's next:**
- Human reviews spec v0.6.
- Resolve remaining open questions (§5).
- Refine DM/Player view details.
- Move to implementation planning.

### Session 2 — 2026-02-26

**Context:** Second session. Human wanted to add core features to the spec.

**What happened:**
- Spec evolved from v0.6 to v0.7 through iterative discussion.
- Added four interconnected concepts:
  1. **Campaign Entities** — Plots, NPCs, Locations as structural nodes following a general pattern. DM can define custom entity types. Each gets auto-created child Lore Fragments (public/private). Entities nest.
  2. **@Mentions** — Universal cross-referencing in any rich text. Bidirectional links between source and target. Every mention generates a TODO.
  3. **TODOs** — Processing queue on each node. Owned by node owner, DM can always help. Actions: Ignore or Create new statement/entry with provenance link.
  4. **Inbox** — Per-user consolidated view of everything needing attention. Default landing for players.

**Key design breakthroughs:**
- Entities are a general pattern, not three separate features. Custom types follow the same shape.
- Plots don't have special content — they have Lore Fragments (Public/Private Statements). Consistent with "everything is a Lore Fragment."
- @Mentions are the connective tissue. They keep entities alive without manual maintenance. The DM writes naturally and tags things; the system does the bookkeeping.
- Bidirectional links turn entities into self-building indexes — a Plot page shows everywhere it was mentioned across the campaign.
- The Inbox closes the engagement loop — players always know what needs their attention.

**What's next:**
- Human reviews spec v0.8.
- Resolve open questions (§5, now 16 questions).
- Refine @mention UX, TODO actions, Inbox design.
- Move to implementation planning.

**Addendum — v0.8 changes (same session):**
- Walkthrough exercise: simulated DM onboarding flow, exposed three gaps.
- Parts → optional Folders with DM-chosen labels. Sessions can live at campaign root.
- Sessions gain explicit statuses: Planning → Planned → Played.
- Auto-created fragments renamed: "Prep" → "Session Notes", "Public Session Information" → "Session Summary".
- Established three-phase development model: POC (done) → Spec/Use Cases (current) → E2E Layers (next).
- Reworked `docs/stages.md` to reflect all three phases. POC stages preserved as history. Use Case 1 (DM onboarding) captured.
- Use cases serve dual purpose: they validate the spec now and become acceptance criteria for implementation later.

### Session 3 — 2026-02-27

**Context:** Continued from Session 2 (context compacted). Working on UC-003 and data model refinements.

**What happened:**
- UC-003 (Campaign Entities with @Mentions) was reviewed — user confirmed heavy @mention usage throughout.
- User questioned the data model: "NPCs are Lore Fragments, but they are of type NPC, correct?" This surfaced a fundamental problem — the spec had an implicit third node type (entities were neither folders nor fragments).
- Through discussion, unified the entire data model into a single concept: **Lore Node**.
- Three kinds of Lore Node: **Aggregation** (pure grouping), **Anchor** (named, @mentionable things), **Fragment** (written content).
- "Lore Fragment" narrowed to just "Fragment" — now specifically means the content-bearing nodes.
- Folders became Aggregation Lore Nodes rather than a separate concept.
- Spec updated to v0.11 with unified terminology throughout all sections.
- @Mentions now auto-create Anchors when referencing a name that doesn't exist. No forward reference problem.
- References defined as computed views (not stored data), showing full paragraphs, grouped by source Anchor, always at the bottom of every Anchor page.
- TODOs deferred — References provide enough cross-referencing value without a processing queue.
- UC-003 fully rewritten with: auto-creation flow, new reference format (`[TYPE] Name (visibility)` grouped headers), and DM verification walkthrough (clicking through Gundren, Klarg, Cragmaw Hideout, Lost Mine plot, and Nezznar to verify References).
- Spec updated to v0.12.

**Key design breakthroughs:**
- The unified Lore Node model eliminates conceptual ambiguity. Before: "What is an NPC? It's not a folder, it's not a fragment..." Now: "It's a Lore Node with kind=anchor and type=NPC." One concept, three kinds, clean.
- @Mentions auto-create Anchors — no forward reference problem. The DM writes naturally and entities spring into existence.
- References are computed, not stored — the @mention links in Fragments are the source of truth, References are just a view.
- References show full paragraphs, grouped by source Anchor, making Anchor pages self-assembling dossiers. An NPC page shows everything the campaign knows about that character without the DM ever writing on the NPC page directly.
- TODOs deferred — the References system provides the cross-referencing value without a processing queue. Simpler, less overhead for the DM.
- Open questions #15 (TODO actions) and #19 (forward references) resolved.
- New open questions surfaced: @mention type picker UX for auto-creation, deletion of Anchors with incoming References, Reference visibility filtering for players.

**What's next:**
- Build UC-004 (DM activates campaign, places marker, runs first session with players).
- Continue validating the Lore Node model and References through walkthroughs.
