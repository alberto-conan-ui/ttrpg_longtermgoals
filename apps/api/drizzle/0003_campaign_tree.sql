CREATE TYPE "public"."session_status" AS ENUM('planned', 'played');--> statement-breakpoint
CREATE TYPE "public"."lore_scope" AS ENUM('story', 'private');--> statement-breakpoint
CREATE TYPE "public"."lore_visibility" AS ENUM('private', 'shared', 'public');--> statement-breakpoint
CREATE TABLE "campaign_parts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" uuid NOT NULL,
	"name" text NOT NULL,
	"sort_order" integer NOT NULL,
	"showcase_json" jsonb,
	"showcase_owner_id" uuid,
	"allow_contributions" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaign_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"part_id" uuid NOT NULL,
	"name" text NOT NULL,
	"status" "session_status" DEFAULT 'planned' NOT NULL,
	"sort_order" integer NOT NULL,
	"showcase_json" jsonb,
	"showcase_owner_id" uuid,
	"allow_contributions" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lore_fragment_shares" (
	"fragment_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	CONSTRAINT "lore_fragment_shares_fragment_id_user_id_pk" PRIMARY KEY("fragment_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "lore_fragments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" uuid NOT NULL,
	"owner_id" uuid NOT NULL,
	"title" text NOT NULL,
	"content_json" jsonb,
	"scope" "lore_scope" DEFAULT 'private' NOT NULL,
	"visibility" "lore_visibility" DEFAULT 'private' NOT NULL,
	"part_id" uuid,
	"session_id" uuid,
	"player_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "investigation_tracks" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "player_track_progress" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "track_milestones" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "investigation_tracks" CASCADE;--> statement-breakpoint
DROP TABLE "player_track_progress" CASCADE;--> statement-breakpoint
DROP TABLE "track_milestones" CASCADE;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "marker_session_id" uuid;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "marker_between" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "showcase_json" jsonb;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "allow_contributions" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "campaign_parts" ADD CONSTRAINT "campaign_parts_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign_parts" ADD CONSTRAINT "campaign_parts_showcase_owner_id_users_id_fk" FOREIGN KEY ("showcase_owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign_sessions" ADD CONSTRAINT "campaign_sessions_part_id_campaign_parts_id_fk" FOREIGN KEY ("part_id") REFERENCES "public"."campaign_parts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign_sessions" ADD CONSTRAINT "campaign_sessions_showcase_owner_id_users_id_fk" FOREIGN KEY ("showcase_owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lore_fragment_shares" ADD CONSTRAINT "lore_fragment_shares_fragment_id_lore_fragments_id_fk" FOREIGN KEY ("fragment_id") REFERENCES "public"."lore_fragments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lore_fragment_shares" ADD CONSTRAINT "lore_fragment_shares_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lore_fragments" ADD CONSTRAINT "lore_fragments_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lore_fragments" ADD CONSTRAINT "lore_fragments_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lore_fragments" ADD CONSTRAINT "lore_fragments_part_id_campaign_parts_id_fk" FOREIGN KEY ("part_id") REFERENCES "public"."campaign_parts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lore_fragments" ADD CONSTRAINT "lore_fragments_session_id_campaign_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."campaign_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lore_fragments" ADD CONSTRAINT "lore_fragments_player_id_users_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_marker_session_id_campaign_sessions_id_fk" FOREIGN KEY ("marker_session_id") REFERENCES "public"."campaign_sessions"("id") ON DELETE set null ON UPDATE no action;