# TTRPG Long-Term Goals — Product Specification

> **Status:** DRAFT v0.8 — Folders replace Parts, session statuses, renamed auto-created fragments.
> **Last updated:** 2026-02-26

---

## 1. Vision

A collaborative campaign companion for tabletop RPG groups. The DM structures and paces the campaign; players contribute lore, comment in-character, and help build the shared story. It sits between a DM's private prep tool and a campaign wiki — everyone is invited to participate in the storytelling.

Between sessions, the app comes alive: the DM offers Idle Goals for players to pursue during downtime, triggers Events that players respond to in-character, and the world advances whether the players act or not. By the time the next session starts, the narrative state has evolved — and everyone knows what changed.

### Core Principles

- **DM-controlled pacing.** The DM decides what is visible and when. Players never see ahead of where the story has reached.
- **The world moves.** Downtime isn't dead air. The DM can advance the world independently of player choices, and players can pursue goals between sessions.
- **Collaborative by default.** The app encourages players to contribute, not just consume.
- **In-character interaction.** Players comment on Lore Fragments and respond to Events as their characters. The campaign becomes a living, asynchronous conversation.
- **Low friction.** Writing a lore note, leaving a comment, or declaring a downtime action should be as easy as sending a message.
- **Transparency.** Every action is attributed. When the DM acts on behalf of a player, it's clearly recorded.

---

## 2. Users & Roles

### Dungeon Master (DM)

- Creates and owns the campaign.
- Defines the structure: folders and sessions. Folders are optional organisational groups with DM-chosen labels.
- Controls the campaign marker — the "current point" in the story.
- Can see everything at all times (God view).
- Can prep content ahead of where the players are.
- Can **impersonate** any player to see their view or act on their behalf (see §3.6).
- Creates and manages Idle Goals and their tracks.
- Moves tokens on tracks — in response to player actions or to simulate the world.
- Triggers Events during downtime to provoke player interaction.
- Moderates all comments on Lore Fragments.
- Invites players via invite code.

### Player

- Joins a campaign via invite code.
- Can only see content at or before the marker position.
- Experience is anchored to the current session — "what's happening now" is the default view.
- Can browse back through all previously revealed content.
- Can create Lore Fragments and enrich collaborative content (e.g., recap scenes).
- Comments on Lore Fragments, encouraged to do so in-character.
- Responds to Events during downtime.
- Declares intent to spend downtime on available Idle Goals.
- Has a player profile page within the campaign.

---

## 3. Core Concepts

### 3.1 Campaign Structure

A campaign is a hierarchical tree. Lore Fragments are part of the tree — they appear inline under the nodes they're attached to.

```
Campaign
├── Folder: "Act I: Death House" (DM names it — could be Arc, Chapter, Stage, etc.)
│   ├── Session 1: "Arrival at the Village" [status: Played]
│   │   ├── Session Notes (Story/Private, auto-created)
│   │   │   ├── Scene: Planned ambush at the gate
│   │   │   └── NPC notes: Rose and Thorn
│   │   ├── Session Summary (Story/Public, auto-created)
│   │   │   └── (auto: track changes summary)
│   │   └── Recap (Story/Public, auto-created when status → Played)
│   │       ├── Scene: The party enters the village
│   │       ├── Encounter: Meeting the @Vistani (→ link to NPC entity)
│   │       └── Discovery: The letter from @Kolyan (→ link to NPC entity)
│   └── Session 2: "Exploring Death House" [status: Planned]
│       └── ...
├── Session 3: "Side Quest: The Werewolf Den" [status: Planning]
│   └── (no folder — sessions can live at the campaign root)
├── Folder: "Act II: Vallaki"
│   └── ...
├── (Player Profiles)
│   ├── Player A
│   │   └── Backstory (Story/Public, written by player)
│   └── Player B
│       └── Backstory (Story/Private, written by player)
├── (Idle Goals)
│   ├── Faction Reputation: The Silver Hand
│   │   └── Track description (Mechanics)
│   └── Research the Ancient Tome
├── (Events — during downtime)
│   ├── Event: "The Silver Hand sends an envoy"
│   │   ├── [comment] Thorin: "I approach cautiously..."
│   │   ├── [comment] Elara: "I watch from the shadows..."
│   │   └── Scene: The negotiation (DM adds based on comments)
│   └── Event: "Fire in the market district"
│       └── ...
├── (Entities — Plots)
│   ├── Plot: "The Strahd Conspiracy" (root plot, Story/Public, from Session 1)
│   │   ├── Public Statements (Story/Public, auto-created)
│   │   │   ├── "The party learned of Strahd's curse" ← from Session 1 Recap
│   │   │   └── "Kolyan's letter mentions a dark lord" ← from Session 1 Recap
│   │   ├── Private Statements (Story/Private, auto-created)
│   │   │   └── "Strahd is aware of the party's arrival" (DM only)
│   │   └── Subplot: "The Tome of Strahd" (Story/Private, from Session 2)
│   │       ├── Public Statements ...
│   │       └── Private Statements ...
│   └── Plot: "Silver Hand Civil War" (Story/Public, from Session 3)
│       └── ...
├── (Entities — NPCs)
│   ├── NPC: "Kolyan Indirovich" (Story/Public, from Session 1)
│   │   ├── Public Info (Story/Public, auto-created)
│   │   └── Private Notes (Story/Private, auto-created)
│   └── NPC: "Strahd von Zarovich" (Story/Private, from Session 1)
│       └── ...
└── (Entities — Locations)
    ├── Location: "Village of Barovia" (Story/Public, from Session 1)
    │   ├── Public Info (Story/Public, auto-created)
    │   └── Private Notes (Story/Private, auto-created)
    └── Location: "Death House" (Story/Private, from Session 1)
        └── ...
```

- **Folders** are optional grouping nodes with a DM-chosen label (Arc, Chapter, Stage, or anything else). They exist to organise sessions. Sessions can also live directly under the campaign with no folder.
- **Sessions** are individual play sessions. They are the atomic unit of progression. Each has a status: Planning, Planned, or Played.
- **Player profiles** are per-campaign pages for each player/character.
- **Idle Goals** are pursuits available during downtime, tracked via Idle Tracks.
- **Entities** are trackable campaign elements — Plots, NPCs, Locations, and custom DM-defined types. They are structural nodes with child Lore Fragments and are @mentionable from anywhere in the campaign.
- **Lore Fragments** appear throughout the tree. They are the only content surface in the app.

### 3.2 The Marker

The marker is the DM's tool for controlling campaign pacing. It represents "where the story currently is."

- **Preparation mode:** No marker set. Players see nothing (or a landing page). The DM is still setting up.
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

### 3.3 Lore Fragments

Lore Fragments are the universal content unit. Everything written in the app is a Lore Fragment — session recaps, character backstories, DM prep notes, track descriptions, scene details, events. They are the building blocks of the campaign and the only way content is created and displayed.

#### Content

Every Lore Fragment is a **rich text document** that supports:
- Headings, bold, italic, lists, links
- Inline images (via URL)
- Blockquotes (useful for in-character speech or flavour text)

There is no separate page builder or layout editor. The rich text editor is the single authoring tool.

#### Properties

Every Lore Fragment has:

| Property | Description |
|---|---|
| **Type** | What kind of content this is. Determines default behavior. See §3.3.1. |
| **Visibility** | Who can see it: private, shared, or public. Present on every fragment. The type sets the default, but the DM can always override. |
| **Edit permissions** | Who can modify the content. Set by the creator. Defaults vary by type. |
| **Author** | The user who created the fragment. If created via impersonation, records both the acting user and the "on behalf of" user. |
| **Parent** | Optional. If set, this fragment is a child of another fragment (not of the session/campaign node). Nesting is unlimited. |
| **Attachment** | Which campaign node this fragment belongs to (campaign, folder, session, player profile, or entity). For child fragments, this is inherited from the root of their fragment tree. |

#### Visibility

- **Private** — Only the author and the DM can see it.
- **Shared** — The author, the DM, and specific named members can see it.
- **Public** — Everyone in the campaign can see it.

Visibility is always an explicit field on the fragment. The type determines the *default* and any *automatic behavior* (e.g., Story/Public auto-flips from private to public when the marker arrives), but the field is always there and the DM can always override it.

#### Edit Permissions

Controls who can modify the fragment's content. Options:

- **Creator only** — Only the author can edit.
- **DM only** — Only the DM can edit (used for system-generated fragments the DM owns).
- **Everyone** — Any campaign member can edit (used for collaborative content like recap scenes).

The DM can always change edit permissions on any fragment. When the DM is impersonating a player, they have the same edit permissions as that player.

#### Comments

Every Lore Fragment has a comment thread. Comments are the primary way players interact with campaign content.

- Anyone who can see a fragment can read its comments.
- Anyone who can see a fragment can post a comment.
- Players are encouraged to comment **in-character**, but this is a social convention, not a system constraint.
- The DM is the ultimate moderator — the DM can delete or edit any comment.
- Comments are simple text (not rich text). They include the author and timestamp.
- Comments posted via impersonation are attributed transparently (see §3.6).

Comments are particularly important on **Event** fragments, where they are the primary means of player participation during downtime.

#### Parent-Child Relationships

Lore Fragments can have children. This creates a tree structure within a fragment — for example, a Recap (parent) containing Scenes (children), or an Event (parent) that grows into a series of Scenes based on player responses. A DM might use this to plan branching encounters: a "Fighting the Ogre" scene with "If they win..." and "If they lose..." sub-scenes underneath.

- Any fragment whose type supports children can be a parent.
- **Nesting is unlimited.** Fragments can be children of children, as deep as needed. A scene can contain sub-scenes, which can contain further sub-scenes.
- **Children belong to their parent fragment**, not to the session or campaign node directly. The parent fragment is the structural anchor. Children inherit their attachment context (which session/folder/entity they belong to) from the root of their fragment tree.
- Children have their own type, visibility, and edit permissions independent of the parent.

#### 3.3.1 Types

Every Lore Fragment has a **type** that describes what it is. The type sets defaults and determines automatic behavior.

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

The system automatically creates Lore Fragments at key moments in a session's lifecycle:

**When a session is created:**
- **"Session Notes"** — Type: Story/Private. The DM's preparation and note-taking space. Supports children (the DM breaks down planned scenes, encounters, notes). Stays useful during and after play — the DM can jot down notes at any point.
- **"Session Summary"** — Type: Story/Public. What players will see when the marker arrives. Auto-populated with a summary of Idle Goal track changes since the previous session.

**When a session transitions to Played (marker advances past it, or DM sets manually):**
- **"Recap"** — Type: Story/Public. Edit permissions: everyone. The collaborative record of what actually happened. The DM adds children (scenes, encounters, etc.), players enrich them.

#### 3.3.3 How Content is Displayed

Since Lore Fragments are the only content surface, each node in the campaign tree is displayed as a collection of its visible Lore Fragments:

- **Campaign page:** Campaign-level lore fragments (e.g., world overview, house rules).
- **Folder page:** Lore fragments attached to the folder (e.g., arc-level overview).
- **Session page:** The auto-created fragments (Session Notes for DM, Session Summary for players, Recap when played) plus any additional fragments attached to the session.
- **Player profile page:** Lore fragments attached to that player (backstory, journal entries, etc.).
- **Entity page:** Auto-created fragments (Public/Private Statements or Info/Notes) plus any additional fragments, plus all backlinks from @mentions.

The UI renders these as a vertical stream of rich text documents, grouped and labeled by type.

### 3.4 Idle Goals & Tracks

Idle Goals are the DM's tool for giving structure to downtime. Each goal is represented by an **Idle Track** — a row of boxes with a token showing the current position.

#### The Track

- A track is a sequence of **boxes** (stages), ordered left to right, created by the DM.
- Each box has a **label** (e.g., "Enemies", "Hostile", "Neutral", "Friendly", "Allies").
- Each box can have a **description** written by the DM — this is the narrative or mechanical effect of being at that position (e.g., "This faction will attack you on sight" or "You've gained access to their library").
- Box descriptions can be **visible or hidden** from players. The DM controls what players know about each position.
- The token starts at a DM-chosen box.
- The DM can attach a **Mechanics** type Lore Fragment to a goal to provide flavor or rules text.

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
3. **Lore & Comments:** Players write lore (backstory additions, character journal entries) and comment on existing fragments.

By the time the next session begins, the "Public Session Information" fragment summarizes everything that changed — track movements, event outcomes, new lore — giving the table a shared "previously on..." to start from.

### 3.6 DM Impersonation

The DM can impersonate any player in the campaign. This is a logical-layer feature — the DM switches their active perspective to a specific player.

#### What impersonation enables

- **See what they see.** The DM views the app exactly as that player would — same visibility filters, same campaign tree content, same session-anchored default view. This is essential for verifying that visibility rules are working correctly.
- **Act on their behalf.** The DM can create lore fragments, post comments, declare downtime intent, and edit content as if they were the player. This is useful for helping less engaged players contribute, or for entering information a player communicated at the table.

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

- **Sees everything.** All fragments regardless of visibility, all sessions regardless of marker position, all track boxes including hidden descriptions.
- **Navigates by structure.** The full campaign tree is the primary navigation — folders, sessions, idle goals, entities, player profiles. The DM is managing and authoring.
- **Management tools.** Marker controls, track token movement, event creation, fragment creation with full type/visibility/permissions controls.
- **Impersonation dropdown.** Switch to any player's view at any time.

#### Player View (Session-Anchored)

- **Sees only revealed content.** Visibility filters applied. Only content at or before the marker position is shown.
- **Anchored to "now."** When a player opens the app, they land on the current session (or the downtime state if between sessions). Active events, available idle goals, and recent activity are front and center.
- **Can browse history.** The campaign tree is available for navigating back through played sessions, past recaps, and earlier lore. But the default experience is the current moment.
- **Participation-focused.** The interface emphasizes actions the player can take: respond to events, comment on lore, declare downtime intent, contribute to recaps.

> **NOTE:** The exact layout and navigation patterns for each view will be refined during design. The key principle is that the DM's experience is management-oriented and the player's experience is participation-oriented.

### 3.8 Campaign Entities

Campaign Entities are trackable elements of the campaign world — the people, places, storylines, and other things the DM and players want to keep track of over time. They are structural nodes in the campaign tree, sitting at the root level alongside Parts, Player Profiles, Idle Goals, and Events.

#### The Pattern

Every entity follows the same shape:

- It is a **named node** in the campaign tree, grouped under its entity type.
- It has **Story/Public or Story/Private visibility**, following the same rules as Lore Fragments. A Story/Public entity becomes visible to players when the marker reaches the session it was activated from. A Story/Private entity is DM-only.
- It is **anchored to a session** — the point in the campaign where it was introduced or became relevant.
- It has **auto-created child Lore Fragments** on creation (the exact fragments depend on the entity type — see below).
- It can have **additional child Lore Fragments** added manually by the DM or players.
- It is **@mentionable** from any rich text in the campaign (see §3.9).
- It can **nest** — an entity can be a child of another entity of the same type (e.g., subplot under plot, district under city).

#### Default Entity Types

Three entity types ship with every campaign:

**Plots**

The narrative threads of the campaign. The root plot is the main story; subplots branch from it or from each other.

- Auto-created children: **Public Statements** (Story/Public) and **Private Statements** (Story/Private).
- Public Statements are things the players know about this plot thread. Private Statements are things only the DM knows.
- When a TODO from an @mention is processed into a new statement, it is added as content to the appropriate Statements fragment, and it retains a link back to the source (see §3.9, §3.10).
- Subplots nest under their parent plot.

**NPCs**

The characters of the campaign world.

- Auto-created children: **Public Info** (Story/Public) and **Private Notes** (Story/Private).
- Public Info is what the players know about this character. Private Notes are the DM's secrets.

**Locations**

The places in the campaign world.

- Auto-created children: **Public Info** (Story/Public) and **Private Notes** (Story/Private).
- Locations can nest (e.g., a room inside a building inside a city).

#### Custom Entity Types

The DM can create additional entity types for their campaign — Factions, Items, Organisations, Religions, or whatever the campaign needs. Custom types follow the same pattern: named node, visibility, session anchor, auto-created public/private child Lore Fragments, @mentionable, nestable.

The system does not need to understand the semantics of a custom type. It only needs to know it is a node with Lore Fragments that participates in the @mention and TODO systems.

### 3.9 @Mentions

The @mention system is a universal cross-referencing tool. Anywhere a user is writing rich text in a Lore Fragment, they can type `@` and reference any node in the campaign tree — an Entity (Plot, NPC, Location, or custom), a Session, a Folder, a Player Profile, an Idle Goal, or another Lore Fragment.

#### What an @mention creates

1. **A visible link in the text.** The `@reference` renders as a clickable link to the target node. Readers can click through to navigate to it.
2. **A backlink on the target.** The target node records that it was mentioned, including where (which fragment, which session). When viewing the target node, all incoming references are visible — the node becomes a cross-referenced index of everywhere it appears in the campaign.
3. **A TODO on the target node.** The mention signals "something just pointed at you" and needs to be processed by the node's owner (see §3.10).

#### Bidirectional links

Links are always bidirectional. From the source, you can navigate to the target. From the target, you can navigate back to every source that references it. For entities like Plots, this means the Plot page naturally accumulates a history of every moment in the campaign where it was relevant — every recap scene, every event, every comment that mentioned it — all linked and traceable.

#### Who can @mention

Anyone who can edit a Lore Fragment can add @mentions to it. The DM can @mention anything. Players can @mention any node they can see (respecting visibility rules).

> **NOTE:** The exact UX for the @mention picker (how the dropdown appears, how users search/filter the tree, how it handles large campaigns) is a design question to be refined.

### 3.10 TODOs

Every @mention generates a **TODO** on the target node. TODOs are a lightweight processing queue — they tell the node's owner "something referenced you, decide what to do about it."

#### Ownership

- The TODO appears for the **owner of the target node**. For entities (Plots, NPCs, etc.), the owner is the DM. For Player Profiles, the owner is the player. For other nodes, ownership follows existing rules.
- The **DM can always process any TODO**, regardless of ownership — consistent with the DM's God view and impersonation capabilities.

#### Processing actions

When processing a TODO, the owner can:

- **Ignore** — Acknowledge the mention, no further action. The mention link remains, but nothing is added to the target node. Cleared from the queue.
- **Create a new statement / entry** — The mention is significant enough to become new content on the target node. For Plots, this means adding a new statement to the Public or Private Statements fragment. For NPCs or Locations, adding to their Public Info or Private Notes. The new content retains a provenance link back to the source mention.

> **NOTE:** Additional processing actions may be added later. The system should be designed to support extensible actions.

#### TODO state

- **Pending** — Unprocessed. Appears in the owner's Inbox (see §3.11).
- **Processed** — The owner took an action (ignore or create). Cleared from the active queue but the @mention link and any created content remain.

### 3.11 Inbox

Every user (DM and players) has an **Inbox** — a consolidated view of everything the system wants them to act on. The Inbox is the default landing experience, especially for players.

#### What appears in the Inbox

- **Unprocessed TODOs** from @mentions on nodes the user owns.
- **New comments** on Lore Fragments the user authored or is watching.
- **Events** shared with the user that they haven't responded to.
- **Idle Goal availability** during downtime — tracks the user can declare intent on.
- **New content** revealed by a marker advance — a summary of what became visible since the user last checked.

#### Role differences

- **DM Inbox:** All TODOs across all entities, all unprocessed mentions, all pending event responses from players, all comments. The DM's inbox reflects the full state of the campaign.
- **Player Inbox:** TODOs on their own nodes (player profile), comments on their fragments, events directed at them, idle goals available to them, newly revealed content.

#### Design intent

The Inbox answers the question "what do I need to do?" without requiring the user to navigate the campaign tree. For players, it replaces the need to browse — the app tells them what's alive and what's waiting. For the DM, it's a management dashboard that surfaces everything requiring attention.

> **NOTE:** The exact Inbox UI (grouped by type? chronological? filterable?) is a design question to be refined.

---

## 4. Features

### 4.1 Authentication & Onboarding

- OAuth via Google and Discord.
- Local username/password auth for development.
- Players join campaigns via an invite code generated by the DM.

### 4.2 Campaign Management (DM)

- Create campaigns with a name and description.
- Create sessions directly under the campaign or inside folders.
- Create, name, and nest folders to organise sessions (optional — the DM chooses the label: Arc, Chapter, Stage, etc.).
- Add/reorder/delete folders and sessions.
- Set session status: Planning → Planned (manual), Planned → Played (automatic on marker advance, or manual).
- Generate and share invite codes.
- Move the marker to control what players see.
- Define custom story subtypes for the campaign.

### 4.3 Lore Fragments (DM & Players)

- Create lore fragments attached to any campaign node.
- Rich text editing with inline images.
- Choose type (which sets sensible defaults for visibility and edit permissions).
- Override visibility and edit permissions as needed.
- Add children to fragments that support them.
- Share fragments with specific campaign members (visibility: shared).
- Comment on any visible fragment.
- DM can delete any fragment or comment; edit depends on edit permissions.
- System auto-creates fragments at session lifecycle events (see §3.3.2).

### 4.4 Idle Goals & Tracks (DM & Players)

**DM capabilities:**
- Create an Idle Goal with a name and description.
- Attach a Mechanics lore fragment for flavor/rules text.
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

- Create Event fragments during downtime.
- Share events with the whole party or specific players.
- System notifies recipients, prompting them to respond.
- Players respond via comments (in-character encouraged).
- DM evolves events by adding child Scene fragments based on player responses.
- Event outcomes feed into the session transition summary.

### 4.6 Comments (Everyone)

- Comment on any visible Lore Fragment.
- Comments are plain text with author and timestamp.
- Players encouraged to comment in-character (social convention, not enforced).
- DM can delete or edit any comment (moderation).
- Comments posted via impersonation are transparently attributed.

### 4.7 DM Impersonation

- Dropdown in DM UI to select any campaign member.
- View the app as that player (visibility, navigation, permissions).
- Act on their behalf (create, edit, comment) with transparent attribution.
- Switch back to God view at any time.

### 4.8 Campaign Entities (DM & Players)

**DM capabilities:**
- Create entities of any type (Plot, NPC, Location, or custom).
- Define custom entity types per campaign.
- Set visibility (Story/Public or Story/Private) and session anchor.
- Nest entities under others of the same type (subplots, sub-locations, etc.).
- Manage auto-created child Lore Fragments (Public/Private Statements or Info/Notes).
- Add additional Lore Fragments to any entity.

**Player capabilities:**
- View entities visible to them (Story/Public, marker has reached activation session).
- Read public statements/info on visible entities.
- @mention visible entities from any Lore Fragment they can edit.

### 4.9 @Mentions (Everyone)

- Type `@` in any rich text editor to reference any campaign tree node.
- Mentions render as clickable links to the target node.
- Mentions create backlinks on the target — visible when viewing that node.
- All links are bidirectional: source → target and target → source.
- A TODO is generated on the target node for every new mention (see §4.10).
- Players can only @mention nodes they can see.

### 4.10 TODOs (DM & Players)

- Every @mention creates a pending TODO on the target node.
- TODOs appear in the node owner's Inbox.
- Processing actions: **Ignore** (acknowledge and clear) or **Create new statement/entry** (adds content to the target node with a provenance link back to the source mention).
- The DM can process any TODO in the campaign.
- Players can process TODOs on nodes they own (e.g., their player profile).

### 4.11 Inbox (Everyone)

- Per-user consolidated view of all pending actions.
- Aggregates: unprocessed TODOs, new comments, unresponded events, idle goal availability, newly revealed content.
- Default landing experience for players.
- DM inbox reflects full campaign state.

---

## 5. Open Questions

| # | Question | Context |
|---|----------|---------|
| 1 | What happens to lore on deleted sessions/folders? | Currently cascading deletes. Should lore be preserved or orphaned? |
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
| 12 | Should @mentions in comments also generate TODOs? | Currently specified for Lore Fragment rich text only. Comments are plain text — do they support @mentions too? |
| 13 | What are the default auto-created Lore Fragments for custom entity types? | Default types (Plots, NPCs, Locations) have defined fragments. Do custom types always get Public Info + Private Notes? |
| 14 | Can entities be re-anchored to a different session after creation? | If the DM realizes an NPC was actually introduced earlier, can they change the activation session? |
| 15 | Should the TODO system support additional processing actions beyond Ignore and Create? | e.g., Link to existing statement, Mark as duplicate, Assign to another user. |
| 16 | What does the Inbox UI look like? | Grouped by type? Chronological? Filterable? Badges/counts? |

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
- Showcase page builder / visual page editor (Puck) — replaced by rich text Lore Fragments
- Per-comment visibility (whisper/private comments)

---

## 7. Existing Implementation

The current codebase already implements:

- ✅ Auth (Google OAuth, Discord OAuth, local dev auth)
- ✅ Campaign CRUD with invite codes
- ⚠️ Folders & sessions with ordering (Parts exist but need rework → Folders with custom naming, sessions need status field)
- ✅ Marker system with downtime/between states
- ⚠️ Lore fragments (exist but need significant rework — type system, parent-child, edit permissions, comments, rich text with images)
- ✅ Campaign tree sidebar navigation
- 🗑️ Puck showcase editor (to be removed)
- 🗑️ Showcase JSON fields on campaigns, folders, sessions (to be removed)
- 🗑️ `allowContributions` on showcase level (replaced by edit permissions on Lore Fragments)
- 🗑️ Old scope/visibility model on lore (replaced by type-driven defaults)
- ❌ Event type and notifications (not started)
- ❌ Comments on Lore Fragments (not started)
- ❌ Idle Goals & Tracks (not started)
- ❌ Session lifecycle auto-fragment creation (not started)
- ❌ Story subtypes (not started)
- ❌ Session transition summary (not started)
- ❌ DM impersonation (not started)
- ❌ DM view vs Player view (not started — current UI is one-size-fits-all)
- ❌ Campaign Entities — Plots, NPCs, Locations, custom types (not started)
- ❌ @Mentions and bidirectional links (not started)
- ❌ TODO processing queue (not started)
- ❌ Inbox (not started)
- ❌ Shared type contracts between frontend/backend
- ⚠️ Various minor bugs and performance issues (see audit)
