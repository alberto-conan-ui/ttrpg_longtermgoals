import * as arctic from 'arctic';
import { env } from '../../../config/env';

let discord: arctic.Discord | null = null;

export function getDiscordProvider(): arctic.Discord | null {
  if (discord) return discord;
  if (!env.DISCORD_CLIENT_ID || !env.DISCORD_CLIENT_SECRET) return null;

  discord = new arctic.Discord(
    env.DISCORD_CLIENT_ID,
    env.DISCORD_CLIENT_SECRET,
    `${env.API_URL}/api/auth/discord/callback`,
  );
  return discord;
}

export interface DiscordUserProfile {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  global_name: string | null;
}

export async function getDiscordUserProfile(
  accessToken: string,
): Promise<DiscordUserProfile> {
  const response = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    throw new Error(`Discord user request failed: ${response.status}`);
  }
  return response.json() as Promise<DiscordUserProfile>;
}
