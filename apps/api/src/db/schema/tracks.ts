import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { campaigns } from './campaigns';
import { users } from './users';

export const investigationTracks = pgTable('investigation_tracks', {
  id: uuid('id').defaultRandom().primaryKey(),
  campaignId: uuid('campaign_id')
    .notNull()
    .references(() => campaigns.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const investigationTracksRelations = relations(
  investigationTracks,
  ({ one, many }) => ({
    campaign: one(campaigns, {
      fields: [investigationTracks.campaignId],
      references: [campaigns.id],
    }),
    milestones: many(trackMilestones),
    progress: many(playerTrackProgress),
  }),
);

export const trackMilestones = pgTable('track_milestones', {
  id: uuid('id').defaultRandom().primaryKey(),
  trackId: uuid('track_id')
    .notNull()
    .references(() => investigationTracks.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  threshold: integer('threshold').notNull(),
  description: text('description'),
});

export const trackMilestonesRelations = relations(
  trackMilestones,
  ({ one }) => ({
    track: one(investigationTracks, {
      fields: [trackMilestones.trackId],
      references: [investigationTracks.id],
    }),
  }),
);

export const playerTrackProgress = pgTable(
  'player_track_progress',
  {
    playerId: uuid('player_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    trackId: uuid('track_id')
      .notNull()
      .references(() => investigationTracks.id, { onDelete: 'cascade' }),
    progress: integer('progress').notNull().default(0),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.playerId, t.trackId] })],
);

export const playerTrackProgressRelations = relations(
  playerTrackProgress,
  ({ one }) => ({
    player: one(users, {
      fields: [playerTrackProgress.playerId],
      references: [users.id],
    }),
    track: one(investigationTracks, {
      fields: [playerTrackProgress.trackId],
      references: [investigationTracks.id],
    }),
  }),
);

export type InvestigationTrack = typeof investigationTracks.$inferSelect;
export type NewInvestigationTrack = typeof investigationTracks.$inferInsert;
export type TrackMilestone = typeof trackMilestones.$inferSelect;
export type NewTrackMilestone = typeof trackMilestones.$inferInsert;
export type PlayerTrackProgress = typeof playerTrackProgress.$inferSelect;
