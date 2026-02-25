import * as arctic from 'arctic';
import { env } from '../../../config/env';

let google: arctic.Google | null = null;

export function getGoogleProvider(): arctic.Google | null {
  if (google) return google;
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) return null;

  google = new arctic.Google(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    `${env.API_URL}/api/auth/google/callback`,
  );
  return google;
}

export interface GoogleUserProfile {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

export async function getGoogleUserProfile(
  accessToken: string,
): Promise<GoogleUserProfile> {
  const response = await fetch(
    'https://openidconnect.googleapis.com/v1/userinfo',
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  if (!response.ok) {
    throw new Error(`Google userinfo request failed: ${response.status}`);
  }
  return response.json() as Promise<GoogleUserProfile>;
}
