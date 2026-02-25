import { pgTable, text, timestamp, uuid, pgEnum, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { investigationTracks } from './tracks';

export const campaigns = pgTable('campaigns', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  dmId: uuid('dm_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  inviteCode: text('invite_code').unique(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  dm: one(users, {
    fields: [campaigns.dmId],
    references: [users.id],
  }),
  members: many(campaignMembers),
  tracks: many(investigationTracks),
}));

export const campaignRoleEnum = pgEnum('campaign_role', ['dm', 'player']);

export const campaignMembers = pgTable(
  'campaign_members',
  {
    campaignId: uuid('campaign_id')
      .notNull()
      .references(() => campaigns.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: campaignRoleEnum('role').notNull(),
    joinedAt: timestamp('joined_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.campaignId, t.userId] })],
);

export const campaignMembersRelations = relations(
  campaignMembers,
  ({ one }) => ({
    campaign: one(campaigns, {
      fields: [campaignMembers.campaignId],
      references: [campaigns.id],
    }),
    user: one(users, {
      fields: [campaignMembers.userId],
      references: [users.id],
    }),
  }),
);

export type Campaign = typeof campaigns.$inferSelect;
export type NewCampaign = typeof campaigns.$inferInsert;
export type CampaignMember = typeof campaignMembers.$inferSelect;
export type NewCampaignMember = typeof campaignMembers.$inferInsert;
