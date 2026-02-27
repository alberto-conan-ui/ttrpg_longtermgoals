# TTRPG Long-Term Goals — Product Specification

> **Status:** DRAFT v0.13 — Statements model, allocation replaces References-as-flat-list and deferred TODOs.
> **Last updated:** 2026-02-27

---

## 1. Vision

A collaborative campaign companion for tabletop RPG groups. The DM structures and paces the campaign; players contribute lore, comment in-character, and help build the shared story. It sits between a DM's private prep tool and a campaign wiki — everyone is invited to participate in the storytelling.

Between sessions, the app comes alive: the DM offers Idle Goals for players to pursue during downtime, triggers Events that players respond to in-character, and the world advances whether the players act or not. By the time the next session starts, the narrative state has evolved — and everyone knows what changed.

### Core Principles

- **DM-controlled pacing.** The DM decides what is visible and when. Players never see ahead of where the story has reached.
- **The world moves.** Downtime isn't dead air. The DM can advance the world independently of player choices, and players can pursue goals between sessions.
- **Collaborative by default.** The app encourages players to contribute, not just consume.
- **In-character interaction.** Players comment on Fragments and respond to Events as their characters. The campaign becomes a living, asynchronous conversation.
- **Low friction.** Writing a lore note, leaving a comment, or declaring a downtime action should be as easy as sending a message.
- **Transparency.** Every action is attributed. When the DM acts on behalf of a player, it's clearly recorded.

---

## 2. Users & Roles

### Dungeon Master (DM)

- Creates and owns the campaign.
- Defines the structure: Aggregations (folders) and Anchors (sessions, entities). Folders are optional Aggregation nodes with DM-chosen labels.
- Controls the campaign marker — the "current point" in the story.
- Can see everything at all times (God view).
- Can prep content ahead of where the players are.
- Can **impersonate** any player to see their view or act on their behalf (see §3.6).
- Creates and manages Idle Goals and their tracks.
- Moves tokens on tracks — in response to player actions or to simulate the world.
- Triggers Events during downtime to provoke player interaction.
- Moderates all comments on Fragments.
- Creates **player slots** in the campaign tree and generates per-slot invite links (see §3.13).
- Can pre-seed Fragments on a player slot before the player joins.

### Player

- Joins a campaign via a per-slot invite link.
- Can only see content at or before the marker position.
- Experience is anchored to the current session — "what's happening now" is the default view.
- Can browse back through all previously revealed content.
- Can create Fragments and enrich collaborative content (e.g., recap scenes).
- Comments on Fragments, encouraged to do so in-character.
- Responds to Events during downtime.
- Declares intent to spend downtime on available Idle Goals.
- Has a player profile page within the campaign.

---

## 3. Core Concepts

### 3.1 Campaign Structure & the Lore Node Model

A campaign is a hierarchical tree. Every node in the tree is a **Lore Node**. There are three kinds of Lore Node:

- **Aggregation** — pure grouping. No content of its own, exists to organise other nodes. Examples: Folders, the Players container, the Plots root, the Locations root.
- **Anchor** — a named, @mentionable thing with identity. It can have child nodes. Examples: Sessions, Plots, NPCs, Locations, Player Profiles, Idle Goals, Events. Anchors are the "nouns" of the campaign — the things people reference and talk about.
- **Fragment** — written content. The actual prose, notes, and data. Examples: Session Notes, Session Summary, scene descriptions, plot statements, NPC info, backstories. Fragments are the only place where rich text content lives.

All three kinds share common properties (visibility, permissions, parent-child relationships) but differ in role. The `kind` field distinguishes them; the `type` field gives the specific flavor within that kind.

```
Campaign (Aggregation)
├── "Act I: Death House" (Aggregation — Folder, DM names it)
│   ├── Session 1: "Arrival at the Village" (Anchor — Session) [status: Played]
│   │   ├── Session Notes (Fragment — Story/Private, auto-created)
│   │   │   ├── Scene: Planned ambush at the gate (Fragment — Story/Private)
│   │   │   └── NPC notes: Rose and Thorn (Fragment — Story/Private)
│   │   ├── Session Summary (Fragment — Story/Public, auto-created)
│   │   │   └── (auto: track changes summary)
│   │   └── Recap (Fragment — Story/Public, auto-created when status → Played)
│   │       ├── Scene: The party enters the village (Fragment — Story/Public)
│   │       ├── Encounter: Meeting the @Vistani (Fragment, → link to NPC anchor)
│   │       └── Discovery: The letter from @Kolyan (Fragment, → link to NPC anchor)
│   └── Session 2: "Exploring Death House" (Anchor — Session) [status: Planned]
│       └── ...
├── Session 3: "Side Quest: The Werewolf Den" (Anchor — Session) [status: Planning]
│   └── (no folder — sessions can live at the campaign root)
├── "Act II: Vallaki" (Aggregation — Folder)
│   └── ...
├── Players (Aggregation)
│   ├── Player A (Anchor — Player Profile, filled slot)
│   │   ├── Backstory (Fragment — Story/Public, written by player)
│   │   └── DM's briefing (Fragment — Story/Private, pre-seeded by DM)
│   ├── Player B (Anchor — Player Profile, filled slot)
│   │   └── Backstory (Fragment — Story/Private, written by player)
│   └── [Empty slot] (invite link generated, awaiting player)
├── Idle Goals (Aggregation)
│   ├── Faction Reputation: The Silver Hand (Anchor — Idle Goal)
│   │   └── Track description (Fragment — Mechanics)
│   └── Research the Ancient Tome (Anchor — Idle Goal)
├── Events (Aggregation)
│   ├── "The Silver Hand sends an envoy" (Anchor — Event)
│   │   ├── [comment] Thorin: "I approach cautiously..."
│   │   ├── [comment] Elara: "I watch from the shadows..."
│   │   └── Scene: The negotiation (Fragment, DM adds based on comments)
│   └── "Fire in the market district" (Anchor — Event)
│       └── ...
├── Plots (Aggregation)
│   ├── "The Strahd Conspiracy" (Anchor — Plot, Story/Public, from Session 1)
│   │   ├── Public Statements (Fragment — Story/Public, auto-created)
│   │   │   ├── (rich text: narrative overview of the conspiracy)
│   │   │   └── Statements (ordered list):
│   │   │       ├── 1. "The party learned of Strahd's curse" (2 sources)
│   │   │       └── 2. "Kolyan's letter mentions a dark lord" (1 source)
│   │   ├── Private Statements (Fragment — Story/Private, auto-created)
│   │   │   ├── (rich text: DM's hidden notes)
│   │   │   └── Statements (ordered list):
│   │   │       └── 1. "Strahd is aware of the party's arrival" (1 source)
│   │   └── "The Tome of Strahd" (Anchor — Plot, Story/Private, from Session 2)
│   │       ├── Public Statements (Fragment) ...
│   │       └── Private Statements (Fragment) ...
│   └── "Silver Hand Civil War" (Anchor — Plot, Story/Public, from Session 3)
│       └── ...
├── NPCs (Aggregation)
│   ├── "Kolyan Indirovich" (Anchor — NPC, Story/Public, from Session 1)
│   │   ├── Public Info (Fragment — Story/Public, auto-created)
│   │   └── Private Notes (Fragment — Story/Private, auto-created)
│   └── "Strahd von Zarovich" (Anchor — NPC, Story/Private, from Session 1)
│       └── ...
└── Locations (Aggregation)
    ├── "Village of Barovia" (Anchor — Location, Story/Public, from Session 1)
    │   ├── Public Info (Fragment — Story/Public, auto-created)
    │   └── Private Notes (Fragment — Story/Private, auto-created)
    └── "Death House" (Anchor — Location, Story/Private, from Session 1)
        └── ...
```

**Aggregation nodes** are optional grouping containers with a DM-chosen label (Folder, Arc, Chapter, or anything else). The root-level containers for Players, Idle Goals, Events, Plots, NPCs, and Locations are also Aggregations. They exist purely to organise — they have no content or identity of their own.

**Anchor nodes** are named things in the campaign. Sessions, Plots, NPCs, Locations, Player Profiles, Idle Goals, Events, and custom DM-defined entity types are all Anchors. They are @mentionable from anywhere, accumulate backlinks, and can have child Fragments and child Anchors (e.g., subplots under plots, sub-locations under locations).

**Fragment nodes** are where content lives. Every piece of writing — session notes, recaps, plot statements, NPC descriptions, backstories, scene descriptions — is a Fragment. Fragments are the only place rich text exists. They can nest (scenes under session notes, sub-scenes under scenes, to unlimited depth).

### 3.2 Campaign Status & The Marker

#### Campaign Status

Every campaign has a status that controls its overall state and what players experience.

- **Prep** — The campaign is being set up. The DM is creating structure, writing content, and inviting players. There is no marker. Players who have joined can see their Inbox and Player Profile, but no campaign content. This is the default state when a campaign is created.
- **Active** — The campaign is running. The marker exists and controls what players see. Players can interact with all visible content.
- **Paused** — The campaign is on hold. The marker is frozen. Players can still see everything that was previously revealed, but nothing new becomes visible and no new events or idle goals are actionable. The DM can still prep content behind the scenes. Useful for campaigns on hiatus or when the DM needs to reorganise without players seeing changes in real time.
- **Completed** — The campaign is finished. Everything is frozen and viewable as a historical record. No further editing or interaction. The campaign becomes a read-only archive.

Transitions: Prep → Active (DM places the first marker), Active ↔ Paused (DM toggles), Active → Completed (DM closes the campaign). A completed campaign cannot be reopened.

#### The Marker

The marker is the DM's tool for controlling campaign pacing. It represents "where the story currently is." The marker only exists when the campaign is **Active**.

- **On a session:** The marker is placed on a specific session. That session and everything before it is visible to players.
- **Between sessions (downtime):** The marker is "between" two sessions. The played session and the upcoming session are both visible. This represents downtime between adventures. Idle Goals become actionable. The DM can trigger Events.

When the marker moves forward, all sessions it passes over automatically transition to "Played" status.

**Session transition summary:** When the DM advances the marker from one session to the next, the app compiles a summary of what has changed since the previous session — Idle Track movements, Events that played out, new lore. This summary auto-populates the "Session Summary" fragment of the new session.

#### Session Status

Every session has an explicit status that tracks its lifecycle. This is a DM-side organisational tool, independent of the marker.

- **Planning** — The DM is actively prepping this session. It may be incomplete or in flux.
- **Planned** — Prep is done. The DM signals "this session is ready to be played." This is a manual transition.
- **Played** — The session has been played. This transition happens automatically when the marker advances past the session, but the DM can also set it manually.

The marker does not depend on status — the DM can place the marker on a session regardless of its status (e.g., running a session that's still in "Planning"). Status is for the DM's own organisation and is not visible to players.

### 3.3 Fragments

Fragments are the content-bearing Lore Nodes. Everything written in the app lives in a Fragment — session recaps, character backstories, DM prep notes, track descriptions, scene details, plot statements. They are the only place rich text content exists and the only way written content is created and displayed.

#### Content

Every Fragment is a **rich text document** that supports:
- Headings, bold, italic, lists, links
- Inline images (via URL)
- Blockquotes (useful for in-character speech or flavour text)

There is no separate page builder or layout editor. The rich text editor is the single authoring tool.

#### Properties

Every Fragment has these properties (some are shared with all Lore Nodes, some are Fragment-specific):

| Property | Description |
|---|---|
| **Kind** | Always `fragment`. (Shared with all Lore Nodes — Anchors have `anchor`, Aggregations have `aggregation`.) |
| **Type** | What kind of content this is. Determines default behavior. See §3.3.1. |
| **Visibility** | Who can see it: private, shared, or public. Present on every Lore Node. The type sets the default, but the DM can always override. |
| **Edit permissions** | Who can modify the content. Set by the creator. Defaults vary by type. |
| **Author** | The user who created the fragment. If created via impersonation, records both the acting user and the "on behalf of" user. |
| **Parent** | The parent Lore Node. For top-level Fragments, this is an Anchor or Aggregation. For nested Fragments, this is another Fragment. Nesting is unlimited. |

#### Visibility

- **Private** — Only the author and the DM can see it.
- **Shared** — The author, the DM, and specific named members can see it.
- **Public** — Everyone in the campaign can see it.

Visibility is always an explicit field on every Lore Node (not just Fragments — Anchors like NPCs and Plots also have visibility). The type determines the *default* and any *automatic behavior* (e.g., Story/Public auto-flips from private to public when the marker arrives), but the field is always there and the DM can always override it.

#### Edit Permissions

Controls who can modify the fragment's content. Options:

- **Creator only** — Only the author can edit.
- **DM only** — Only the DM can edit (used for system-generated fragments the DM owns).
- **Everyone** — Any campaign member can edit (used for collaborative content like recap scenes).

The DM can always change edit permissions on any fragment. When the DM is impersonating a player, they have the same edit permissions as that player.

#### Comments

Every Fragment has a comment thread. Comments are the primary way players interact with campaign content.

- Anyone who can see a Fragment can read its comments.
- Anyone who can see a Fragment can post a comment.
- Players are encouraged to comment **in-character**, but this is a social convention, not a system constraint.
- The DM is the ultimate moderator — the DM can delete or edit any comment.
- Comments are simple text (not rich text). They include the author and timestamp.
- Comments posted via impersonation are attributed transparently (see §3.6).

Comments are particularly important on **Event** fragments, where they are the primary means of player participation during downtime.

#### Parent-Child Relationships

Fragments can have children. This creates a tree structure within a Fragment — for example, a Recap (parent) containing Scenes (children), or a DM planning branching encounters: a "Fighting the Ogre" scene with "If they win..." and "If they lose..." sub-scenes underneath.

- Any Fragment whose type supports children can be a parent.
- **Nesting is unlimited.** Fragments can be children of children, as deep as needed. A scene can contain sub-scenes, which can contain further sub-scenes.
- **Children belong to their parent Lore Node.** For top-level Fragments, the parent is an Anchor (e.g., a Session or NPC). For nested Fragments, the parent is another Fragment. Children inherit their context from the root of their node tree.
- Children have their own type, visibility, and edit permissions independent of the parent.

#### Statements

Statements are an ordered list of short, atomic knowledge units attached to a Fragment. While a Fragment's rich text provides narrative and atmosphere — world-building prose, scene descriptions, detailed notes — its Statements capture the key structured facts. Together, rich text and statements give every Fragment two complementary views: the story and the summary.

**What a Statement contains:**

| Property | Description |
|---|---|
| **Text** | A short, atomic fact or claim (e.g., "Has the map to Wave Echo Cave", "Hired the party to escort supplies to Phandalin"). |
| **Sort order** | Position in the list. Higher = more important. The DM (or anyone with edit access) drags statements to reorder them. |
| **Allocated sources** | A list of links to Lore Nodes that back this statement — @mention references, scene Fragments, event Fragments, or any other Lore Node. Sources provide provenance: where does this knowledge come from? |
| **Superseded children** | Optional. Other statements that this statement has superseded (rolled up). The old statements nest under the new one, preserving their text and sources as history. |

**Key properties:**

- **Statements inherit visibility** from their parent Fragment. A statement on a Story/Private Fragment is private. A statement on a Story/Public Fragment follows the same marker-based reveal rules.
- **Anyone with edit access** on the parent Anchor can create, allocate, reorder, and supersede statements. This follows the same permission model as Fragment editing.
- **Statements are per-Fragment**, not per-Anchor. An NPC Anchor with Public Info and Private Notes Fragments has two separate ordered statement lists — one public, one private. This maps naturally to "what players know" vs "what only the DM knows."

**Superseding (roll-up):**

Knowledge evolves during a campaign. A newer statement can supersede an older one by dragging the old statement under it. The superseded statement nests beneath its parent, preserving its text and all its allocated sources. This creates an auditable knowledge trail.

Example: An NPC Anchor has a statement "The bartender is lying about the missing shipment" (backed by 3 sources). Later, the party discovers the bartender was telling the truth. The DM creates a new statement "The bartender was telling the truth — the shipment was stolen by the Redbrands" and drags the old statement under it. Both statements and all their sources are preserved. The old one is visually nested, indicating it has been superseded.

#### 3.3.1 Fragment Types

Every Fragment has a **type** that describes what kind of content it is. The type sets defaults and determines automatic behavior.

| Type | Default Visibility | Default Edit | Auto Behavior | Children | Notifications |
|---|---|---|---|---|---|
| **Story/Public** | Private → auto-publishes when marker reaches parent | Creator only | Flips to public at marker | Yes | No |
| **Story/Private** | Private (always) | Creator only | Never visible to players | Yes | No |
| **Event** | Private (DM shares manually) | Creator only | None | Yes | Yes — notifies recipients when shared |
| **Mechanics** | Inherits from parent element | Creator only | Visible when parent element is visible | No | No |

**Story subtypes:**

Every Story fragment (Public or Private) has a **story subtype** that categorizes the kind of story beat. Subtypes are purely organizational — they provide a label and an icon in the UI. They do not affect behavior.

Default story subtypes (shipped with every campaign, DM can add custom ones per campaign):

- **General** *(catch-all default)*
- Scene
- Encounter
- Fight
- Escape
- Dialogue
- Discovery
- Travel
- Rest

**Note on backstories:** Player backstories are not a separate type. A backstory is a Story/Public or Story/Private fragment written by a player and attached to their player profile. The player chooses the visibility.

#### 3.3.2 Session Lifecycle & Auto-Created Fragments

The system automatically creates Fragment nodes as children of a Session Anchor at key lifecycle moments:

**When a Session Anchor is created:**
- **"Session Notes"** — Fragment, type: Story/Private. The DM's preparation and note-taking space. Supports child Fragments (the DM breaks down planned scenes, encounters, notes). Stays useful during and after play — the DM can jot down notes at any point.
- **"Session Summary"** — Fragment, type: Story/Public. What players will see when the marker arrives. Auto-populated with a summary of Idle Goal track changes since the previous session.

**When a session transitions to Played (marker advances past it, or DM sets manually):**
- **"Recap"** — Fragment, type: Story/Public. Edit permissions: everyone. The collaborative record of what actually happened. The DM adds child Fragments (scenes, encounters, etc.), players enrich them.

#### 3.3.3 How Content is Displayed

Since Fragments are the only content surface, each Anchor and Aggregation in the campaign tree is displayed as a collection of its visible child Fragments:

- **Campaign page:** Campaign-level Fragments (e.g., world overview, house rules).
- **Folder (Aggregation) page:** Fragments attached to the folder (e.g., arc-level overview).
- **Session (Anchor) page:** The auto-created Fragments (Session Notes for DM, Session Summary for players, Recap when played) plus any additional Fragments.
- **Player Profile (Anchor) page:** Fragments attached to that player (backstory, journal entries, etc.).
- **Entity (Anchor) page:** Auto-created Fragments (Public/Private Statements or Info/Notes) plus any additional Fragments. Each Fragment displays its rich text content followed by its ordered Statements list (if any). Below all Fragments, an **Unallocated Mentions** section shows @mention references that have not yet been allocated to any statement (see §3.9). This section is the DM's processing inbox — as mentions are allocated, they disappear from here and appear as sources on their assigned statements.

The UI renders Fragments as a vertical stream, each containing:
1. **Rich text** — the narrative/atmospheric content
2. **Statements** — an ordered list of key facts, each showing source count (expandable to see all sources). Superseded statements are visually nested under their parent statement.

At the bottom of Anchor pages, the **Unallocated Mentions** section shows incoming @mentions awaiting processing.

### 3.4 Idle Goals & Tracks

Idle Goals are the DM's tool for giving structure to downtime. Each goal is represented by an **Idle Track** — a row of boxes with a token showing the current position.

#### The Track

- A track is a sequence of **boxes** (stages), ordered left to right, created by the DM.
- Each box has a **label** (e.g., "Enemies", "Hostile", "Neutral", "Friendly", "Allies").
- Each box can have a **description** written by the DM — this is the narrative or mechanical effect of being at that position (e.g., "This faction will attack you on sight" or "You've gained access to their library").
- Box descriptions can be **visible or hidden** from players. The DM controls what players know about each position.
- The token starts at a DM-chosen box.
- The DM can attach a **Mechanics** type Fragment to a goal to provide flavor or rules text.

#### Availability

- The DM creates a goal and makes it **available starting from a named session**. Players cannot see or interact with it before that point.
- A goal can be assigned to a **specific player** or to the **whole party**.
- The DM can **retire/close** a goal at any time — it's no longer available for downtime investment, either because it resolved naturally or because events overtook it.
- Retired goals remain visible as history (with their final track position) but can no longer be acted on.

#### Player Interaction

- During downtime, players can see the tracks that are available to them.
- A player **declares intent** to spend time on a track. This is a signal to the DM, not a direct manipulation of the track.
- The player does not move the token. The DM decides if, when, and how far the token moves based on the player's declaration and whatever narrative logic applies.

#### DM as World Simulator

- The DM can move tokens on any track at any time — not just in response to player declarations.
- This represents the world acting independently: a faction's attitude shifts, a rival makes progress, an opportunity expires.
- Players may or may not be informed of DM-initiated moves immediately — the DM controls the reveal, just like with lore fragment visibility.

#### Track History

- Every token movement is recorded with a timestamp and the session it occurred during (or "between sessions").
- This history feeds into the session transition summary and auto-populates the "Public Session Information" fragment.

### 3.5 The Downtime Loop

Downtime — the period when the marker is "between" sessions — is when the app is most active. The DM and players interact asynchronously through three mechanisms:

1. **Idle Goals:** Players declare which tracks they want to pursue. The DM processes and moves tokens.
2. **Events:** The DM creates Event fragments and shares them with players. Players comment in-character. The DM evolves events into scene trees based on responses.
3. **Lore & Comments:** Players write Fragments (backstory additions, character journal entries) and comment on existing Fragments.

By the time the next session begins, the "Public Session Information" fragment summarizes everything that changed — track movements, event outcomes, new lore — giving the table a shared "previously on..." to start from.

### 3.6 DM Impersonation

The DM can impersonate any player in the campaign. This is a logical-layer feature — the DM switches their active perspective to a specific player.

#### What impersonation enables

- **See what they see.** The DM views the app exactly as that player would — same visibility filters, same campaign tree content, same session-anchored default view. This is essential for verifying that visibility rules are working correctly.
- **Act on their behalf.** The DM can create Fragments, post comments, declare downtime intent, and edit content as if they were the player. This is useful for helping less engaged players contribute, or for entering information a player communicated at the table.

#### How it works

- A dropdown in the DM's UI lists all campaign members. Selecting a player activates impersonation.
- While impersonating, the DM has the same permissions as the target player — including edit permissions on that player's fragments.
- The DM can switch back to their own God view at any time.

#### Transparency

- Every action taken while impersonating is recorded with both identities: the DM who performed the action and the player on whose behalf it was performed.
- The UI displays this clearly: "Created by DM on behalf of Player A" or "Comment by DM as Player A."
- This is visible to the DM at all times. Whether players see the "on behalf of" attribution or just see the player's name is a UX decision to be refined.

### 3.7 DM View vs Player View

The DM and players experience fundamentally different interfaces tailored to their roles.

#### DM View (God Mode)

- **Sees everything.** All Lore Nodes regardless of visibility, all sessions regardless of marker position, all track boxes including hidden descriptions.
- **Navigates by structure.** The full campaign tree is the primary navigation — Aggregations, Anchors, Fragments. The DM is managing and authoring.
- **Management tools.** Marker controls, track token movement, event creation, Fragment creation with full type/visibility/permissions controls.
- **Impersonation dropdown.** Switch to any player's view at any time.

#### Player View (Session-Anchored)

- **Sees only revealed content.** Visibility filters applied. Only content at or before the marker position is shown.
- **Anchored to "now."** When a player opens the app, they land on the current session (or the downtime state if between sessions). Active events, available idle goals, and recent activity are front and center.
- **Can browse history.** The campaign tree is available for navigating back through played sessions, past recaps, and earlier lore. But the default experience is the current moment.
- **Participation-focused.** The interface emphasizes actions the player can take: respond to events, comment on lore, declare downtime intent, contribute to recaps.

> **NOTE:** The exact layout and navigation patterns for each view will be refined during design. The key principle is that the DM's experience is management-oriented and the player's experience is participation-oriented.

### 3.8 Campaign Entities (Anchor Types)

Campaign Entities are the Anchor nodes that represent trackable elements of the campaign world — the people, places, storylines, and other things the DM and players want to keep track of over time. They are Lore Nodes of kind=Anchor, grouped under root-level Aggregation nodes by type (Plots, NPCs, Locations, etc.).

#### The Anchor Pattern

Every entity Anchor follows the same shape:

- It is a **named Anchor node** in the campaign tree, grouped under an Aggregation for its type.
- It has **Story/Public or Story/Private visibility**, following the same rules as all Lore Nodes. A Story/Public Anchor becomes visible to players when the marker reaches the session it was activated from. A Story/Private Anchor is DM-only.
- It is **anchored to a session** — the point in the campaign where it was introduced or became relevant.
- It has **auto-created child Fragments** on creation (the exact Fragments depend on the Anchor type — see below).
- It can have **additional child Fragments** added manually by the DM or players.
- It is **@mentionable** from any rich text in the campaign (see §3.9).
- It can **nest** — an Anchor can be a child of another Anchor of the same type (e.g., subplot under plot, district under city).

Note: Sessions, Player Profiles, Idle Goals, and Events are also Anchors (see §3.1). The "entity" label is a convenience for the DM-created world-building Anchors described below.

#### Default Entity Anchor Types

Three entity types ship with every campaign:

**Plots**

The narrative threads of the campaign. The root plot is the main story; subplots branch from it or from each other.

- Auto-created child Fragments: **Public Statements** (Story/Public) and **Private Statements** (Story/Private).
- Each Fragment contains rich text (narrative overview of the plot thread) AND an ordered Statements list (the key facts — things known or secret about this plot).
- Public Statements = what the players know. Private Statements = DM-only knowledge.
- As @mentions referencing the plot are allocated into statements, the plot page becomes a structured summary of its entire narrative history — with provenance links back to every source (see §3.9).
- Subplots nest under their parent plot (Anchor under Anchor).

**NPCs**

The characters of the campaign world.

- Auto-created child Fragments: **Public Info** (Story/Public) and **Private Notes** (Story/Private).
- Each Fragment contains rich text (character description, atmosphere) AND an ordered Statements list (key facts about this character).
- Public Info = what the players know about this character. Private Notes = the DM's secrets.

**Locations**

The places in the campaign world.

- Auto-created child Fragments: **Public Info** (Story/Public) and **Private Notes** (Story/Private).
- Each Fragment contains rich text (location description) AND an ordered Statements list (key facts about this place).
- Locations can nest (e.g., a room inside a building inside a city — Anchor under Anchor).

#### Custom Entity Types

The DM can create additional entity types for their campaign — Factions, Items, Organisations, Religions, or whatever the campaign needs. Custom types follow the same Anchor pattern: named node, visibility, session anchor, auto-created public/private child Fragments, @mentionable, nestable.

The system does not need to understand the semantics of a custom type. It only needs to know it is an Anchor with child Fragments that participates in the @mention and cross-referencing systems.

### 3.9 @Mentions

The @mention system is a universal cross-referencing tool. Anywhere a user is writing rich text in a Fragment, they can type `@` and reference any other Lore Node in the campaign tree — any Anchor (Plot, NPC, Location, Session, Player Profile, Idle Goal, Event, or custom), any Aggregation, or another Fragment.

#### What an @mention creates

1. **A visible link in the text.** The `@reference` renders as a clickable link to the target node. Readers can click through to navigate to it.
2. **A backlink on the target.** The target node records that it was mentioned, including the full paragraph where the mention appears and which Fragment/session it came from. When viewing the target node, the mention appears in the **Unallocated Mentions** section until it is allocated to a statement (see Allocation below). Over time, as mentions are allocated, the Anchor page builds up a structured, sourced summary of everything the campaign knows about it.

#### Auto-creation of Anchors

When a user types `@` and references a name that doesn't yet exist as an Anchor, the system **auto-creates a minimal Anchor** of the appropriate type:

- The new Anchor is created under the correct Aggregation (e.g., an NPC goes under the NPCs Aggregation).
- It gets the standard auto-created child Fragments (e.g., Public Info + Private Notes for an NPC), both initially empty.
- Its **session anchor** is set to the session where the @mention occurred.
- Its **visibility** defaults to Story/Private (the DM can change it later).
- The @mention link in the source Fragment immediately points to the new Anchor.

This means the DM never needs to pre-create entities. They write naturally — "@Klarg rules the upper cavern" — and Klarg exists as a navigable NPC from that moment. The DM fills in details whenever they choose, or never — the references section on the Anchor page already tells the story.

#### Unallocated Mentions

When an @mention creates a backlink on a target Anchor, the mention initially appears as an **unallocated mention** — an incoming reference that hasn't yet been processed into a statement. Unallocated mentions are computed, not stored — the system queries all Fragments containing @mentions pointing at this Anchor and filters out those that have already been allocated to a statement.

The **Unallocated Mentions** section appears at the **bottom of every Anchor page**, below all Fragments and their statements. It is the DM's processing inbox for this entity.

Each unallocated mention displays:
- The **full paragraph** from the source Fragment where the @mention appears
- The **origin label** in the format: `[TYPE] Anchor Name (visibility) →` followed by the paragraph
- Clickable @mention links within the paragraph (e.g., other NPCs, Locations mentioned in the same paragraph)

Unallocated mentions are **grouped by the source Anchor** they come from, making them easy to scan.

As the DM (or anyone with edit access) allocates mentions into statements, they disappear from this section. When all mentions have been allocated, the section is empty — the entity has been fully processed.

#### Allocation

Allocation is the mechanism that connects sources to statements. It is the core action that turns raw references into structured knowledge.

**How allocation works:**

1. The user sees an unallocated mention (or any Lore Node they want to link).
2. They either **create a new statement** from it, or **allocate it to an existing statement** on the Anchor.
3. Once allocated, the mention disappears from the Unallocated section and appears as a source on the statement.

**Sources are general-purpose.** Allocation is not limited to @mentions. Any Lore Node in the campaign tree can be a source for a statement:
- **@mention references** — the most common entry point. The DM writes naturally, mentions appear on entity pages, the DM processes them.
- **Scene Fragments** — the DM preps a session with scenes, then creates statements on relevant Anchors and allocates the scenes as sources. "This scene will reveal this fact about this NPC."
- **Event Fragments** — an event during downtime produces a new fact about an entity.
- **Other Fragments** — any written content that provides evidence for a statement.

**Multi-source statements.** A single statement can accumulate sources from across the campaign. "Gundren has the map to Wave Echo Cave" might be backed by mentions from King Grol's notes, the Lost Mine plot, and Cragmaw Castle's description. Each source adds provenance — the statement gets stronger as more evidence points to it.

**Cross-Anchor allocation.** A source can be allocated to statements on different Anchors. A single @mention paragraph that references both an NPC and a Location can be allocated to statements on both.

**Allocation direction.** Allocation is directional: source → statement. The source Fragment's content is never modified by the allocation — it remains the source of truth.

#### Superseding

Knowledge evolves. A newer statement can supersede older statements by dragging them under it. The superseded statement nests beneath its parent, preserving its text and all its allocated sources intact. The sources do not merge — they remain on the original statement they were allocated to.

This creates a visible knowledge evolution trail:
- "The bartender is lying about the missing shipment" (3 sources) → **superseded by** → "The bartender was telling the truth — the shipment was stolen by the Redbrands" (2 sources)

The old statement and its sources are always accessible (nested under the new one) but visually subordinated. The current understanding is what the DM and players see at the top level.

#### Bidirectional links

Links are always bidirectional. From the source, you can navigate to the target. From the target, you can see the source as either an allocated source on a statement (processed) or as an unallocated mention (awaiting processing). For entities like Plots, this means the Plot page naturally accumulates a structured history of everything the campaign knows about it — organized into ordered statements with full provenance, rather than a flat list of paragraphs.

#### Who can @mention

Anyone who can edit a Fragment can add @mentions to it. The DM can @mention anything. Players can @mention any node they can see (respecting visibility rules).

> **NOTE:** The exact UX for the @mention picker (how the dropdown appears, how users search/filter the tree, how it handles large campaigns) is a design question to be refined.

### 3.10 Statements & Allocation (Replaces TODOs)

> **Status:** Active. Statements and the allocation mechanism replace the previously deferred TODO system. Instead of a generic Ignore/Create processing queue, the DM builds structured knowledge on each entity by allocating @mentions (and other sources) into ordered, supersedable statements.

The full Statements model is defined in §3.3 (Fragments → Statements). The allocation mechanism is defined in §3.9 (@Mentions → Allocation). Together they provide:

- **A natural processing inbox:** Unallocated mentions on each Anchor page tell the DM "these references haven't been processed yet." As the DM allocates them, the inbox empties.
- **Structured knowledge building:** Instead of flat reference lists, entities accumulate ordered statements with full provenance — the DM can see what is known, how important it is, and where the knowledge came from.
- **Knowledge evolution:** Superseding lets the DM capture how understanding changes over time without losing the original evidence.

This is strictly more useful than the deferred TODO model (Ignore/Create) because allocation produces something the DM actually wants — a curated, prioritised summary of each entity.

### 3.11 Inbox

Every user (DM and players) has an **Inbox** — a consolidated view of everything the system wants them to act on. The Inbox is the default landing experience, especially for players.

#### What appears in the Inbox

- **Requests** from the DM (see §3.12).
- **New comments** on Fragments the user authored or is watching.
- **Events** shared with the user that they haven't responded to.
- **Idle Goal availability** during downtime — tracks the user can declare intent on.
- **New content** revealed by a marker advance — a summary of what became visible since the user last checked.
- **New unallocated @mention references** on Anchors the user owns — indicating that new mentions have arrived and need to be allocated into statements (see §3.10).

#### Role differences

- **DM Inbox:** All pending event responses from players, all comments, new @mention references across all entities. The DM's inbox reflects the full state of the campaign.
- **Player Inbox:** Comments on their Fragments, events directed at them, idle goals available to them, newly revealed content, new references on their Player Profile.

#### Design intent

The Inbox answers the question "what do I need to do?" without requiring the user to navigate the campaign tree. For players, it replaces the need to browse — the app tells them what's alive and what's waiting. For the DM, it's a management dashboard that surfaces everything requiring attention.

> **NOTE:** The exact Inbox UI (grouped by type? chronological? filterable?) is a design question to be refined.

### 3.12 Requests

Requests are the DM's tool for proactively asking players to do something. They are intentional — the DM explicitly asks a player to take an action.

#### What a Request contains

- **Description** — What the DM is asking. Free text (e.g., "Please write your character backstory", "Respond to the Silver Hand event", "Review the Session 3 recap and add anything I missed").
- **Target** — Who the request is for: a specific player, or the whole party.
- **Node (optional)** — A specific campaign node the request relates to (e.g., the player's Player Profile, a specific Event, a Recap fragment). If set, the request links to that node, making it easy for the player to navigate directly to where they need to act.
- **Status** — Pending or Completed. The player marks a request as completed when they've done what was asked. The DM can also mark it on their behalf.

#### When Requests are used

Requests are general-purpose. The DM can create them at any time for any reason. Common patterns include:

- **Onboarding:** When a player joins the campaign, the DM sends a request to write their backstory.
- **Post-session:** The DM asks players to review and enrich the recap.
- **Downtime:** The DM nudges a player to respond to an event or declare downtime intent.
- **Preparation:** The DM asks players to read new lore before the next session.

#### How Requests flow

1. DM creates a request, targeting a player (or the whole party).
2. The request appears in the target player's Inbox.
3. The player reads the request, navigates to the linked node (if any), and does what's asked.
4. The player marks the request as completed.
5. The DM sees the completed status in their own Inbox/dashboard.

Requests are deliberately lightweight — they are a nudge, not a workflow. The DM writes a sentence, the player sees it, acts on it, and marks it done.

### 3.13 Player Slots

Player slots are how the DM invites players to the campaign. They live under the **Players** node in the campaign tree.

#### How slots work

1. The DM opens the Players node in the campaign tree and clicks `+` to create a **player slot**.
2. When creating the slot, the DM can:
   - Check **"Require backstory"** — when a player fills this slot, a Request to write their backstory is automatically created in their Inbox, linked to their Player Profile.
   - **Pre-seed Fragments** on the slot — content the player will see when they join (e.g., "Here's what your character knows about the quest", character-specific briefings, house rules).
3. Each slot generates a **unique invite link**. The DM shares this link with a specific person.
4. When a player uses the invite link:
   - They fill the slot. Their **Player Profile** (an Anchor) is created.
   - Any pre-seeded Fragments are now attached to their profile.
   - If "Require backstory" was checked, a Request appears in their Inbox.
5. The DM can see in the campaign tree which slots are **filled** (player has joined) and which are **empty** (invite sent, waiting).

#### Why per-slot invites

Per-slot invites let the DM personalise the onboarding experience for each player. The DM can pre-write content specific to that character or player before they even join. This is particularly useful for:

- Character-specific briefings ("You know Gundren personally — here's your shared history")
- Pre-created character stubs that the player then fills in
- DM notes about what this character's role in the campaign will be (Story/Private, visible only to the DM)

---

## 4. Features

### 4.1 Authentication & Onboarding

- OAuth via Google and Discord.
- Local username/password auth for development.
- DM creates player slots in the campaign tree, each with a unique invite link (see §3.13).
- DM can pre-seed Fragments and check "Require backstory" on each slot.
- Players join campaigns via a per-slot invite link. Player Profile (Anchor) is created on join, pre-seeded content and Requests are applied automatically.

### 4.2 Campaign Management (DM)

- Create campaigns with a name and description. Campaign starts in **Prep** status.
- Transition campaign status: Prep → Active (by placing the first marker), Active ↔ Paused, Active → Completed.
- Create sessions directly under the campaign or inside folders.
- Create, name, and nest folders to organise sessions (optional — the DM chooses the label: Arc, Chapter, Stage, etc.).
- Add/reorder/delete folders and sessions.
- Set session status: Planning → Planned (manual), Planned → Played (automatic on marker advance, or manual).
- Generate and share invite codes.
- Move the marker to control what players see.
- Define custom story subtypes for the campaign.

### 4.3 Fragments (DM & Players)

- Create Fragments attached to any Anchor or Aggregation node.
- Rich text editing with inline images.
- Choose type (which sets sensible defaults for visibility and edit permissions).
- Override visibility and edit permissions as needed.
- Add child Fragments to Fragments that support them.
- Share Fragments with specific campaign members (visibility: shared).
- Comment on any visible Fragment.
- DM can delete any Fragment or comment; edit depends on edit permissions.
- System auto-creates Fragments at session lifecycle events (see §3.3.2).

### 4.4 Idle Goals & Tracks (DM & Players)

**DM capabilities:**
- Create an Idle Goal with a name and description.
- Attach a Mechanics Fragment for flavor/rules text.
- Define the track: add, reorder, and label boxes. Write descriptions for each box (visible or hidden).
- Set the starting position of the token.
- Assign the goal to a specific player or the whole party.
- Set the session from which the goal becomes available.
- Move the token at any time, for any reason.
- Reveal or hide box descriptions.
- Retire/close a goal.

**Player capabilities:**
- View available tracks and their current state (visible labels, visible descriptions, token position).
- Declare intent to spend downtime on a track.
- View track history for tracks they can see.

**Session transition:**
- When the marker advances, the app compiles a summary of all track changes since the previous session.
- This summary auto-populates the "Public Session Information" fragment of the new session.
- The DM can edit this auto-populated content before or after it becomes visible.

### 4.5 Events (DM)

- Create Event Anchors during downtime.
- Share events with the whole party or specific players.
- System notifies recipients, prompting them to respond.
- Players respond via comments (in-character encouraged).
- DM evolves events by adding child Scene Fragments based on player responses.
- Event outcomes feed into the session transition summary.

### 4.6 Comments (Everyone)

- Comment on any visible Fragment.
- Comments are plain text with author and timestamp.
- Players encouraged to comment in-character (social convention, not enforced).
- DM can delete or edit any comment (moderation).
- Comments posted via impersonation are transparently attributed.

### 4.7 DM Impersonation

- Dropdown in DM UI to select any campaign member.
- View the app as that player (visibility, navigation, permissions).
- Act on their behalf (create, edit, comment) with transparent attribution.
- Switch back to God view at any time.

### 4.8 Campaign Entities — Anchors (DM & Players)

**DM capabilities:**
- Create entity Anchors of any type (Plot, NPC, Location, or custom).
- Define custom entity types per campaign.
- Set visibility (Story/Public or Story/Private) and session anchor.
- Nest Anchors under others of the same type (subplots, sub-locations, etc.).
- Manage auto-created child Fragments (Public/Private Statements or Info/Notes).
- Add additional Fragments to any entity Anchor.

**Player capabilities:**
- View entity Anchors visible to them (Story/Public, marker has reached activation session).
- Read public statements/info Fragments on visible Anchors.
- @mention visible Anchors from any Fragment they can edit.

### 4.9 @Mentions & Allocation (Everyone)

- Type `@` in any Fragment's rich text editor to reference any Lore Node in the campaign tree.
- If the @mentioned name doesn't exist yet, the system auto-creates a minimal Anchor of the appropriate type (see §3.9).
- Mentions render as clickable links to the target node.
- Mentions create backlinks on the target — appearing as **unallocated mentions** on the target's Anchor page until processed.
- All links are bidirectional: source → target and target → source.
- Players can only @mention Lore Nodes they can see.
- Anyone with edit access on an Anchor can **allocate** unallocated mentions to statements — either creating a new statement or adding to an existing one.
- Allocation is general-purpose: any Lore Node (scene Fragment, event, etc.) can be manually allocated as a source to a statement on any Anchor.

### 4.10 Statements & Allocation (Everyone with Edit Access)

- View ordered statements on each Fragment of an Anchor page. Statements show source count, expandable to see all sources.
- Create new statements manually or from unallocated mentions.
- Allocate unallocated @mentions to existing statements (the mention disappears from unallocated, appears as a source).
- Allocate any Lore Node (scene, event, etc.) as a source to a statement on any Anchor.
- Reorder statements by dragging (position = importance).
- Supersede a statement by dragging an older statement under a newer one. Superseded statements are visually nested with their sources preserved.
- A single statement can accumulate sources from multiple Fragments across the campaign.
- A single source can be allocated to statements on multiple Anchors.

### 4.11 Inbox (Everyone)

- Per-user consolidated view of all pending actions.
- Aggregates: requests, new comments, new @mention references, unresponded events, idle goal availability, newly revealed content.
- Default landing experience for players.
- DM inbox reflects full campaign state.

### 4.12 Requests (DM)

- DM can create a request for a specific player or the whole party at any time.
- Request includes a description, a target, and an optional linked campaign node.
- Requests appear in the target player's Inbox.
- Player marks a request as completed when done. DM can also mark it on their behalf.
- DM sees request status (pending/completed) in their Inbox/dashboard.

---

## 5. Open Questions

| # | Question | Context |
|---|----------|---------|
| 1 | What happens to child Lore Nodes on deleted Anchors/Aggregations? | Currently cascading deletes. Should Fragments be preserved or orphaned? |
| 2 | Are player profiles per-campaign characters or per-user? | Current model is per-user-per-campaign. Should a player be able to have multiple characters? |
| 3 | Is there a notification system beyond Events? | Events notify recipients. Should other actions (new lore, track moves, comments) also notify? |
| 4 | What is the mobile experience? | Is this desktop-first? Responsive? Native app? |
| 5 | Can players see *that* a hidden track box exists, just not its description? Or is the box itself hidden? | Affects whether players know the full shape of a track. |
| 6 | Can a player declare intent on a track with a direction preference? | e.g., "I try to improve relations" vs. just "I spend time on this." |
| 7 | Should the DM be able to edit auto-populated session information before it becomes visible? | Or is it auto-published and editable after? |
| 8 | What is the full list of default story subtypes? | Current list: General, Scene, Encounter, Fight, Escape, Dialogue, Discovery, Travel, Rest. |
| 9 | Do players see "on behalf of" attribution on impersonated actions? | Or do they just see the player's name? UX decision. |
| 10 | What are the exact navigation patterns for DM view vs Player view? | Principles defined (§3.7), details to be refined during design. |
| 11 | What is the UX for the @mention picker? | How does the dropdown appear? How do users search/filter a potentially large campaign tree? Autocomplete? Categories? |
| 12 | Should comments support @mentions? | Currently comments are plain text. Should they support @mentions with the same cross-referencing behavior as Fragment rich text? |
| 13 | What are the default auto-created Fragments for custom entity Anchor types? | Default types (Plots, NPCs, Locations) have defined Fragments. Do custom types always get Public Info + Private Notes? |
| 14 | Can entity Anchors be re-anchored to a different session after creation? | If the DM realizes an NPC was actually introduced earlier, can they change the activation session? |
| 15 | ~~RESOLVED~~ | TODOs replaced by Statements & Allocation (§3.10). Unallocated mentions are the natural processing inbox; allocation builds structured knowledge on Anchors. |
| 16 | What does the Inbox UI look like? | Grouped by type? Chronological? Filterable? Badges/counts? |
| 17 | Can the DM set up auto-requests on player join? | e.g., "Every new player automatically receives a request to write their backstory." Or is this always manual? |
| 18 | Can a completed campaign be reopened? | Currently spec says no. Should the DM be able to revert to Active? |
| 19 | ~~RESOLVED~~ | @mentioning a name that doesn't exist auto-creates a minimal Anchor of the appropriate type (see §3.9). No forward reference problem. |
| 20 | Can statements be moved between Fragments on the same Anchor? | e.g., from Private Notes to Public Info when the DM decides to reveal a fact. Does the statement keep its sources? |
| 21 | Should the system suggest allocations based on keyword matching? | When a new @mention arrives, could the system suggest "this looks like it matches statement X"? Or is manual allocation always preferred? |
| 22 | What happens to statements when their parent Fragment is deleted? | Are they orphaned? Deleted? Moved to another Fragment on the same Anchor? |
| 23 | Can players see allocated sources on statements, or just the statement text? | Players see the statement, but should they see where the knowledge came from (the source links)? Or is provenance DM-only? |

---

## 6. Out of Scope (for now)

Things we're explicitly not building in the first version:

- Real-time collaboration (Google Docs-style concurrent editing)
- Dice rolling or game mechanics
- Character sheets or stat tracking
- Public/shareable campaign pages (outside the group)
- File/image uploads (images via URL reference only)
- Map tools or battle maps
- Automated track movement rules — movement is always a DM decision
- Showcase page builder / visual page editor (Puck) — replaced by rich text Fragments
- Per-comment visibility (whisper/private comments)

---

## 7. Existing Implementation

The current codebase already implements:

- ✅ Auth (Google OAuth, Discord OAuth, local dev auth)
- ✅ Campaign CRUD with invite codes
- ⚠️ Folders & sessions with ordering (Parts exist but need rework → Aggregation nodes with custom naming, Session Anchors need status field)
- ✅ Marker system with downtime/between states
- ⚠️ Lore Nodes (exist as lore fragments but need significant rework → unified Lore Node model with kind/type, parent-child, edit permissions, comments, rich text with images)
- ✅ Campaign tree sidebar navigation
- 🗑️ Puck showcase editor (to be removed)
- 🗑️ Showcase JSON fields on campaigns, folders, sessions (to be removed)
- 🗑️ `allowContributions` on showcase level (replaced by edit permissions on Fragments)
- 🗑️ Old scope/visibility model on lore (replaced by type-driven defaults)
- ❌ Event Anchors and notifications (not started)
- ❌ Comments on Fragments (not started)
- ❌ Idle Goals & Tracks (not started)
- ❌ Session lifecycle auto-Fragment creation (not started)
- ❌ Story subtypes (not started)
- ❌ Session transition summary (not started)
- ❌ DM impersonation (not started)
- ❌ DM view vs Player view (not started — current UI is one-size-fits-all)
- ❌ Entity Anchors — Plots, NPCs, Locations, custom types (not started)
- ❌ @Mentions with auto-creation, bidirectional links, unallocated mentions, and allocation (not started)
- ❌ Statements & Allocation — ordered statements on Fragments, allocation of @mentions and other sources, superseding (not started)
- ❌ Inbox (not started)
- ❌ Campaign status lifecycle — Prep/Active/Paused/Completed (not started)
- ❌ Requests system (not started)
- ❌ Player Slots with per-slot invites (not started — replaces old invite code model)
- ❌ Shared type contracts between frontend/backend
- ⚠️ Various minor bugs and performance issues (see audit)
