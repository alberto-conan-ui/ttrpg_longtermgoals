import { useParams } from '@tanstack/react-router';
import { useCampaign } from '../hooks/use-campaigns';

export function CampaignDetailPage() {
  const { campaignId } = useParams({ strict: false }) as {
    campaignId: string;
  };
  const { data: campaign, isLoading } = useCampaign(campaignId);

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

      {/* Members */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
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
