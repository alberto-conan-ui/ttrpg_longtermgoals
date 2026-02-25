import { useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { useTrack, useUpdateProgress } from '../hooks/use-tracks';

export function TrackDetailPage() {
  const { trackId } = useParams({ strict: false }) as { trackId: string };
  const { data: track, isLoading } = useTrack(trackId);
  const updateProgress = useUpdateProgress(trackId);
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null);
  const [progressValue, setProgressValue] = useState(0);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl p-8 text-center text-sm text-gray-500">
        Loading track...
      </div>
    );
  }

  if (!track) {
    return (
      <div className="mx-auto max-w-4xl p-8 text-center text-sm text-red-500">
        Track not found
      </div>
    );
  }

  const maxThreshold =
    track.milestones.length > 0
      ? Math.max(...track.milestones.map((m) => m.threshold))
      : 100;

  const handleSaveProgress = (playerId: string) => {
    updateProgress.mutate(
      { playerId, progress: progressValue },
      {
        onSuccess: () => setEditingPlayer(null),
      },
    );
  };

  return (
    <div className="mx-auto max-w-4xl p-8">
      <Link
        to="/campaigns/$campaignId"
        params={{ campaignId: track.campaignId }}
        className="text-sm text-violet-600 hover:text-violet-500"
      >
        &larr; Back to campaign
      </Link>

      <div className="mt-4">
        <h1 className="text-2xl font-bold text-gray-900">{track.name}</h1>
        {track.description && (
          <p className="mt-2 text-gray-600">{track.description}</p>
        )}
      </div>

      {/* Milestones */}
      {track.milestones.length > 0 && (
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Milestones</h2>
          <div className="mt-4 space-y-3">
            {track.milestones.map((milestone) => (
              <div
                key={milestone.id}
                className="flex items-start gap-3 rounded-lg border border-gray-100 p-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                  {milestone.threshold}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {milestone.title}
                  </p>
                  {milestone.description && (
                    <p className="mt-0.5 text-xs text-gray-500">
                      {milestone.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Player Progress */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Player Progress
        </h2>
        {track.playerProgress.length === 0 && (
          <p className="mt-4 text-sm text-gray-500">
            No progress recorded yet.
            {track.role === 'dm' &&
              ' Use the controls below to set player progress.'}
          </p>
        )}
        <div className="mt-4 space-y-4">
          {track.playerProgress.map((pp) => {
            const pct = maxThreshold > 0
              ? Math.min((pp.progress / maxThreshold) * 100, 100)
              : 0;
            const reachedMilestones = track.milestones.filter(
              (m) => pp.progress >= m.threshold,
            );

            return (
              <div key={pp.playerId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {pp.avatarUrl ? (
                      <img
                        src={pp.avatarUrl}
                        alt={pp.displayName}
                        className="h-6 w-6 rounded-full"
                      />
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                        {pp.displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-900">
                      {pp.displayName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {pp.progress} / {maxThreshold}
                    </span>
                    {track.role === 'dm' && editingPlayer !== pp.playerId && (
                      <button
                        onClick={() => {
                          setEditingPlayer(pp.playerId);
                          setProgressValue(pp.progress);
                        }}
                        className="text-xs text-violet-600 hover:text-violet-500"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div
                    className="h-2 rounded-full bg-violet-500 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Reached milestones */}
                {reachedMilestones.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {reachedMilestones.map((m) => (
                      <span
                        key={m.id}
                        className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700"
                      >
                        {m.title}
                      </span>
                    ))}
                  </div>
                )}

                {/* Inline edit */}
                {track.role === 'dm' && editingPlayer === pp.playerId && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      value={progressValue}
                      onChange={(e) =>
                        setProgressValue(parseInt(e.target.value) || 0)
                      }
                      className="w-24 rounded-lg border border-gray-300 px-2 py-1 text-sm"
                    />
                    <button
                      onClick={() => handleSaveProgress(pp.playerId)}
                      disabled={updateProgress.isPending}
                      className="rounded-lg bg-violet-600 px-3 py-1 text-xs font-medium text-white hover:bg-violet-700 disabled:opacity-50"
                    >
                      {updateProgress.isPending ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => setEditingPlayer(null)}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* DM: Add progress for players not yet tracked */}
        {track.role === 'dm' && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-400">
              Progress for new players will appear once you set it via the
              &quot;Edit&quot; button or by allocating downtime in a future
              stage.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
