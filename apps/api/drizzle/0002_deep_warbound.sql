CREATE TABLE "investigation_tracks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "player_track_progress" (
	"player_id" uuid NOT NULL,
	"track_id" uuid NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "player_track_progress_player_id_track_id_pk" PRIMARY KEY("player_id","track_id")
);
--> statement-breakpoint
CREATE TABLE "track_milestones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"track_id" uuid NOT NULL,
	"title" text NOT NULL,
	"threshold" integer NOT NULL,
	"description" text
);
--> statement-breakpoint
ALTER TABLE "investigation_tracks" ADD CONSTRAINT "investigation_tracks_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_track_progress" ADD CONSTRAINT "player_track_progress_player_id_users_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_track_progress" ADD CONSTRAINT "player_track_progress_track_id_investigation_tracks_id_fk" FOREIGN KEY ("track_id") REFERENCES "public"."investigation_tracks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "track_milestones" ADD CONSTRAINT "track_milestones_track_id_investigation_tracks_id_fk" FOREIGN KEY ("track_id") REFERENCES "public"."investigation_tracks"("id") ON DELETE cascade ON UPDATE no action;