import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
  jsonb,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { campaigns } from './campaigns';
import { users } from './users';

// ---------------------------------------------------------------------------
// Campaign Parts
// ---------------------------------------------------------------------------
export const campaignParts = pgTable('campaign_parts', {
  id: uuid('id').defaultRandom().primaryKey(),
  campaignId: uuid('campaign_id')
    .notNull()
    .references(() => campaigns.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  sortOrder: integer('sort_order').notNull(),
  showcaseJson: jsonb('showcase_json'),
  showcaseOwnerId: uuid('showcase_owner_id').references(() => users.id),
  allowContributions: boolean('allow_contributions').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const campaignPartsRelations = relations(
  campaignParts,
  ({ one, many }) => ({
    campaign: one(campaigns, {
      fields: [campaignParts.campaignId],
      references: [campaigns.id],
    }),
    showcaseOwner: one(users, {
      fields: [campaignParts.showcaseOwnerId],
      references: [users.id],
    }),
    sessions: many(campaignSessions),
  }),
);

// ---------------------------------------------------------------------------
// Session Status Enum
// ---------------------------------------------------------------------------
export const sessionStatusEnum = pgEnum('session_status', [
  'planned',
  'played',
]);

// ---------------------------------------------------------------------------
// Campaign Sessions
// ---------------------------------------------------------------------------
export const campaignSessions = pgTable('campaign_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  partId: uuid('part_id')
    .notNull()
    .references(() => campaignParts.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  status: sessionStatusEnum('status').default('planned').notNull(),
  sortOrder: integer('sort_order').notNull(),
  showcaseJson: jsonb('showcase_json'),
  showcaseOwnerId: uuid('showcase_owner_id').references(() => users.id),
  allowContributions: boolean('allow_contributions').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const campaignSessionsRelations = relations(
  campaignSessions,
  ({ one }) => ({
    part: one(campaignParts, {
      fields: [campaignSessions.partId],
      references: [campaignParts.id],
    }),
    showcaseOwner: one(users, {
      fields: [campaignSessions.showcaseOwnerId],
      references: [users.id],
    }),
  }),
);

export type CampaignPart = typeof campaignParts.$inferSelect;
export type NewCampaignPart = typeof campaignParts.$inferInsert;
export type CampaignSession = typeof campaignSessions.$inferSelect;
export type NewCampaignSession = typeof campaignSessions.$inferInsert;
