import { Play, Pause, SkipForward } from 'lucide-react';
import { useUpdateMarker } from '../../campaigns/hooks/use-parts';
import type { CampaignPart } from '../../campaigns/hooks/use-parts';

interface MarkerControlsProps {
  campaignId: string;
  parts: CampaignPart[];
  markerSessionId: string | null;
  markerBetween: boolean;
  isDm: boolean;
}

export function MarkerControls({
  campaignId,
  parts,
  markerSessionId,
  markerBetween,
  isDm,
}: MarkerControlsProps) {
  const updateMarker = useUpdateMarker(campaignId);

  if (!isDm) return null;

  // Build the global ordered list of sessions
  const allSessions = parts.flatMap((p) =>
    p.sessions.map((s) => ({ ...s, partSortOrder: p.sortOrder })),
  );
  allSessions.sort(
    (a, b) => a.partSortOrder - b.partSortOrder || a.sortOrder - b.sortOrder,
  );

  if (allSessions.length === 0) return null;

  const markerIdx = markerSessionId
    ? allSessions.findIndex((s) => s.id === markerSessionId)
    : -1;

  // Determine next unplayed session
  const nextUnplayed = allSessions.find((s) => s.status === 'planned');

  // Figure out available actions
  const canMarkAsPlayed = !!nextUnplayed;
  const canStartDowntime =
    markerSessionId &&
    !markerBetween &&
    markerIdx !== -1 &&
    markerIdx + 1 < allSessions.length;

  const handleMarkAsPlayed = () => {
    if (!nextUnplayed) return;
    updateMarker.mutate({ sessionId: nextUnplayed.id, between: false });
  };

  const handleStartDowntime = () => {
    if (!markerSessionId) return;
    updateMarker.mutate({ sessionId: markerSessionId, between: true });
  };

  const handleClearMarker = () => {
    updateMarker.mutate({ sessionId: null, between: false });
  };

  // Status text
  let statusText = 'Preparation — no sessions played yet';
  if (markerSessionId && markerIdx !== -1) {
    const markerSession = allSessions[markerIdx];
    if (markerBetween) {
      const upcomingSession =
        markerIdx + 1 < allSessions.length
          ? allSessions[markerIdx + 1]
          : null;
      statusText = `Downtime — between "${markerSession.name}"${upcomingSession ? ` and "${upcomingSession.name}"` : ''}`;
    } else {
      statusText = `Marker on "${markerSession.name}"`;
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900">Campaign Marker</h3>
      <p className="mt-1 text-xs text-gray-500">{statusText}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {canMarkAsPlayed && (
          <button
            onClick={handleMarkAsPlayed}
            disabled={updateMarker.isPending}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            <Play className="h-3.5 w-3.5" />
            Mark "{nextUnplayed?.name}" as played
          </button>
        )}
        {canStartDowntime && (
          <button
            onClick={handleStartDowntime}
            disabled={updateMarker.isPending}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-amber-700 disabled:opacity-50 transition-colors"
          >
            <Pause className="h-3.5 w-3.5" />
            Start downtime
          </button>
        )}
        {markerBetween && canMarkAsPlayed && (
          <button
            onClick={handleMarkAsPlayed}
            disabled={updateMarker.isPending}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <SkipForward className="h-3.5 w-3.5" />
            End downtime — play next
          </button>
        )}
        {markerSessionId && (
          <button
            onClick={handleClearMarker}
            disabled={updateMarker.isPending}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Reset marker
          </button>
        )}
      </div>
      {updateMarker.error && (
        <div className="mt-2 rounded-lg bg-red-50 p-2 text-xs text-red-700">
          {updateMarker.error.message}
        </div>
      )}
    </div>
  );
}
