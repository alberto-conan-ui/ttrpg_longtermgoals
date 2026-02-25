import { useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { useCampaign, useGenerateInvite } from '../hooks/use-campaigns';
import {
  useTracks,
  useCreateTrack,
} from '../../tracks/hooks/use-tracks';

export function CampaignDetailPage() {
  const { campaignId } = useParams({ strict: false }) as {
    campaignId: string;
  };
  const { data: campaign, isLoading } = useCampaign(campaignId);
  const generateInvite = useGenerateInvite(campaignId);
  const { data: tracks } = useTracks(campaignId);
  const createTrack = useCreateTrack(campaignId);
  const [copied, setCopied] = useState(false);
  const [showCreateTrack, setShowCreateTrack] = useState(false);
  const [trackName, setTrackName] = useState('');
  const [trackDesc, setTrackDesc] = useState('');
  const [milestones, setMilestones] = useState<
    { title: string; threshold: number; description: string }[]
  >([]);

  const handleCreateTrack = (e: React.FormEvent) => {
    e.preventDefault();
    createTrack.mutate(
      {
        name: trackName,
        description: trackDesc || undefined,
        milestones: milestones.length > 0
          ? milestones.map((m) => ({
              ...m,
              description: m.description || undefined,
            }))
          : undefined,
      },
      {
        onSuccess: () => {
          setTrackName('');
          setTrackDesc('');
          setMilestones([]);
          setShowCreateTrack(false);
        },
      },
    );
  };

  const addMilestone = () => {
    setMilestones([...milestones, { title: '', threshold: 0, description: '' }]);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const updateMilestone = (
    index: number,
    field: 'title' | 'threshold' | 'description',
    value: string | number,
  ) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
  };

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

      {/* Investigation Tracks */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Investigation Tracks
          </h2>
          {campaign.role === 'dm' && (
            <button
              onClick={() => setShowCreateTrack(!showCreateTrack)}
              className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-violet-700 transition-colors"
            >
              {showCreateTrack ? 'Cancel' : 'New Track'}
            </button>
          )}
        </div>

        {showCreateTrack && campaign.role === 'dm' && (
          <form onSubmit={handleCreateTrack} className="mt-4 space-y-3 border-t border-gray-100 pt-4">
            <div>
              <label htmlFor="track-name" className="block text-sm font-medium text-gray-700">
                Track Name
              </label>
              <input
                id="track-name"
                type="text"
                required
                value={trackName}
                onChange={(e) => setTrackName(e.target.value)}
                placeholder="e.g. The Missing Merchant"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>
            <div>
              <label htmlFor="track-desc" className="block text-sm font-medium text-gray-700">
                Description (optional)
              </label>
              <textarea
                id="track-desc"
                value={trackDesc}
                onChange={(e) => setTrackDesc(e.target.value)}
                rows={2}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>

            {/* Milestones */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Milestones</span>
                <button
                  type="button"
                  onClick={addMilestone}
                  className="text-xs text-violet-600 hover:text-violet-500"
                >
                  + Add milestone
                </button>
              </div>
              {milestones.map((m, i) => (
                <div key={i} className="mt-2 flex items-start gap-2">
                  <input
                    type="text"
                    required
                    value={m.title}
                    onChange={(e) => updateMilestone(i, 'title', e.target.value)}
                    placeholder="Milestone title"
                    className="flex-1 rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
                  />
                  <input
                    type="number"
                    required
                    min={1}
                    value={m.threshold || ''}
                    onChange={(e) => updateMilestone(i, 'threshold', parseInt(e.target.value) || 0)}
                    placeholder="Pts"
                    className="w-20 rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeMilestone(i)}
                    className="text-xs text-red-500 hover:text-red-700 py-1.5"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {createTrack.error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {createTrack.error.message}
              </div>
            )}

            <button
              type="submit"
              disabled={createTrack.isPending}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-violet-700 disabled:opacity-50 transition-colors"
            >
              {createTrack.isPending ? 'Creating...' : 'Create Track'}
            </button>
          </form>
        )}

        {/* Track list */}
        <div className="mt-4 space-y-3">
          {tracks && tracks.length === 0 && (
            <p className="text-sm text-gray-500">
              No investigation tracks yet.
              {campaign.role === 'dm' && ' Create one to get started.'}
            </p>
          )}
          {tracks?.map((track) => (
            <Link
              key={track.id}
              to="/tracks/$trackId"
              params={{ trackId: track.id }}
              className="block rounded-lg border border-gray-100 p-4 hover:border-violet-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {track.name}
                  </h3>
                  {track.description && (
                    <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">
                      {track.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 text-xs text-gray-400">
                  <span>{track.milestoneCount} milestones</span>
                  <span>{track.playerProgress.length} tracking</span>
                </div>
              </div>
              {track.playerProgress.length > 0 && track.maxThreshold > 0 && (
                <div className="mt-2 space-y-1">
                  {track.playerProgress.map((pp) => (
                    <div key={pp.playerId} className="flex items-center gap-2">
                      <span className="w-20 truncate text-xs text-gray-500">
                        {pp.displayName}
                      </span>
                      <div className="flex-1 h-1.5 rounded-full bg-gray-100">
                        <div
                          className="h-1.5 rounded-full bg-violet-400"
                          style={{
                            width: `${Math.min((pp.progress / track.maxThreshold) * 100, 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">
                        {pp.progress}/{track.maxThreshold}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Placeholder for future stages */}
      <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <p className="text-sm text-gray-500">
          Downtime phases coming in Stage 6
        </p>
      </div>
    </div>
  );
}
