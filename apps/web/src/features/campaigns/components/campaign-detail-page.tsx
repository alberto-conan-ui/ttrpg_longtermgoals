import { useState } from 'react';
import { useParams } from '@tanstack/react-router';
import { useCampaign, useGenerateInvite } from '../hooks/use-campaigns';

export function CampaignDetailPage() {
  const { campaignId } = useParams({ strict: false }) as {
    campaignId: string;
  };
  const { data: campaign, isLoading } = useCampaign(campaignId);
  const generateInvite = useGenerateInvite(campaignId);
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl p-8 text-center text-sm text-gray-500">
        Loading campaign...
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="mx-auto max-w-4xl p-8 text-center text-sm text-red-500">
        Campaign not found
      </div>
    );
  }

  const dm = campaign.members.find((m) => m.role === 'dm');
  const players = campaign.members.filter((m) => m.role === 'player');

  const handleCopyCode = () => {
    if (campaign.inviteCode) {
      navigator.clipboard.writeText(campaign.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>
          {campaign.description && (
            <p className="mt-2 text-gray-600">{campaign.description}</p>
          )}
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            campaign.role === 'dm'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-blue-100 text-blue-700'
          }`}
        >
          {campaign.role === 'dm' ? 'Dungeon Master' : 'Player'}
        </span>
      </div>

      {/* Invite Code — DM only */}
      {campaign.role === 'dm' && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Invite Players</h2>
          <p className="mt-1 text-sm text-gray-500">
            Share this code with players so they can join your campaign.
          </p>
          <div className="mt-4 flex items-center gap-3">
            {campaign.inviteCode ? (
              <>
                <code className="rounded-lg bg-gray-100 px-4 py-2 text-lg font-mono font-bold tracking-widest text-violet-700">
                  {campaign.inviteCode}
                </code>
                <button
                  onClick={handleCopyCode}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={() => generateInvite.mutate()}
                  disabled={generateInvite.isPending}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  {generateInvite.isPending ? 'Generating...' : 'Regenerate'}
                </button>
              </>
            ) : (
              <button
                onClick={() => generateInvite.mutate()}
                disabled={generateInvite.isPending}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-violet-700 disabled:opacity-50 transition-colors"
              >
                {generateInvite.isPending
                  ? 'Generating...'
                  : 'Generate Invite Code'}
              </button>
            )}
          </div>
          {generateInvite.error && (
            <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {generateInvite.error.message}
            </div>
          )}
        </div>
      )}

      {/* Members */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Members</h2>
        <div className="mt-4 space-y-3">
          {dm && (
            <div className="flex items-center gap-3">
              {dm.avatarUrl ? (
                <img
                  src={dm.avatarUrl}
                  alt={dm.displayName}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                  {dm.displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <span className="text-sm font-medium text-gray-900">
                  {dm.displayName}
                </span>
                <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                  DM
                </span>
              </div>
            </div>
          )}
          {players.length > 0 && (
            <>
              <div className="border-t border-gray-100 pt-3">
                <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Players ({players.length})
                </span>
              </div>
              {players.map((player) => (
                <div key={player.userId} className="flex items-center gap-3">
                  {player.avatarUrl ? (
                    <img
                      src={player.avatarUrl}
                      alt={player.displayName}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                      {player.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm text-gray-900">
                    {player.displayName}
                  </span>
                </div>
              ))}
            </>
          )}
          {players.length === 0 && (
            <p className="text-sm text-gray-500">
              No players have joined yet. Share the invite code to invite
              players.
            </p>
          )}
        </div>
      </div>

      {/* Placeholder for future stages */}
      <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <p className="text-sm text-gray-500">
          Investigation tracks &amp; downtime phases coming in later stages
        </p>
      </div>
    </div>
  );
}
