import { useState } from 'react';
import { Link, useParams } from '@tanstack/react-router';
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  Folder,
  Dice5,
  User,
  Circle,
  CircleDot,
  ArrowDownUp,
} from 'lucide-react';
import type { CampaignPart } from '../../campaigns/hooks/use-parts';
import type { CampaignDetail } from '../../campaigns/hooks/use-campaigns';

interface CampaignTreeSidebarProps {
  campaign: CampaignDetail;
  parts: CampaignPart[];
  players: { userId: string; displayName: string }[];
}

export function CampaignTreeSidebar({
  campaign,
  parts,
  players,
}: CampaignTreeSidebarProps) {
  const params = useParams({ strict: false }) as {
    campaignId?: string;
    partId?: string;
    sessionId?: string;
    userId?: string;
  };
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const part of parts) {
      init[part.id] = true;
    }
    return init;
  });

  const togglePart = (partId: string) => {
    setExpanded((prev) => ({ ...prev, [partId]: !prev[partId] }));
  };

  const markerSessionId = (campaign as CampaignDetail & { markerSessionId?: string | null }).markerSessionId ?? null;
  const markerBetween = (campaign as CampaignDetail & { markerBetween?: boolean }).markerBetween ?? false;

  // Find which session is the "upcoming" one (next after marker)
  let upcomingSessionId: string | null = null;
  if (markerSessionId && markerBetween) {
    const allSessions = parts.flatMap((p) =>
      p.sessions.map((s) => ({ ...s, partSortOrder: p.sortOrder })),
    );
    allSessions.sort(
      (a, b) => a.partSortOrder - b.partSortOrder || a.sortOrder - b.sortOrder,
    );
    const markerIdx = allSessions.findIndex((s) => s.id === markerSessionId);
    if (markerIdx !== -1 && markerIdx + 1 < allSessions.length) {
      upcomingSessionId = allSessions[markerIdx + 1].id;
    }
  }

  return (
    <aside className="w-64 shrink-0 border-r border-gray-200 bg-white overflow-y-auto">
      <div className="p-4">
        {/* Campaign root */}
        <Link
          to="/campaigns/$campaignId"
          params={{ campaignId: campaign.id }}
          className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold transition-colors ${
            !params.partId && !params.sessionId && !params.userId
              ? 'bg-violet-100 text-violet-800'
              : 'text-gray-900 hover:bg-gray-100'
          }`}
        >
          <BookOpen className="h-4 w-4 text-violet-600" />
          <span className="truncate">{campaign.name}</span>
        </Link>

        {/* Marker status */}
        {markerSessionId && (
          <div className="mt-2 flex items-center gap-1.5 px-2 text-xs">
            <ArrowDownUp className="h-3 w-3 text-emerald-600" />
            <span className="text-emerald-700 font-medium">
              {markerBetween ? 'Downtime' : 'Playing'}
            </span>
          </div>
        )}
        {!markerSessionId && (
          <div className="mt-2 flex items-center gap-1.5 px-2 text-xs">
            <Circle className="h-3 w-3 text-gray-400" />
            <span className="text-gray-500">Preparation</span>
          </div>
        )}

        {/* Parts & Sessions */}
        <div className="mt-4 space-y-0.5">
          {parts.map((part) => (
            <div key={part.id}>
              {/* Part node */}
              <div className="flex items-center">
                <button
                  onClick={() => togglePart(part.id)}
                  className="p-0.5 text-gray-500 hover:text-gray-700"
                >
                  {expanded[part.id] ? (
                    <ChevronDown className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5" />
                  )}
                </button>
                <Link
                  to="/campaigns/$campaignId/parts/$partId"
                  params={{ campaignId: campaign.id, partId: part.id }}
                  className={`flex flex-1 items-center gap-1.5 rounded-lg px-1.5 py-1 text-sm transition-colors ${
                    params.partId === part.id
                      ? 'bg-violet-100 text-violet-800 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Folder className="h-3.5 w-3.5 text-amber-600" />
                  <span className="truncate">{part.name}</span>
                </Link>
              </div>

              {/* Sessions */}
              {expanded[part.id] && (
                <div className="ml-5 space-y-0.5">
                  {part.sessions.map((session) => {
                    const isMarker = session.id === markerSessionId;
                    const isUpcoming = session.id === upcomingSessionId;

                    return (
                      <Link
                        key={session.id}
                        to="/campaigns/$campaignId/sessions/$sessionId"
                        params={{
                          campaignId: campaign.id,
                          sessionId: session.id,
                        }}
                        className={`flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-sm transition-colors ${
                          params.sessionId === session.id
                            ? 'bg-violet-100 text-violet-800 font-medium'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Dice5 className="h-3.5 w-3.5 text-blue-500" />
                        <span className="truncate flex-1">{session.name}</span>
                        <div className="flex items-center gap-1">
                          {session.status === 'played' && (
                            <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
                              played
                            </span>
                          )}
                          {isMarker && (
                            <CircleDot className="h-3.5 w-3.5 text-emerald-600" />
                          )}
                          {isUpcoming && (
                            <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                              next
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Player Profiles */}
        {players.length > 0 && (
          <div className="mt-4 border-t border-gray-100 pt-3">
            <div className="px-2 text-xs font-medium uppercase tracking-wider text-gray-400">
              Players
            </div>
            <div className="mt-1 space-y-0.5">
              {players.map((player) => (
                <Link
                  key={player.userId}
                  to="/campaigns/$campaignId/players/$userId"
                  params={{
                    campaignId: campaign.id,
                    userId: player.userId,
                  }}
                  className={`flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm transition-colors ${
                    params.userId === player.userId
                      ? 'bg-violet-100 text-violet-800 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <User className="h-3.5 w-3.5 text-indigo-500" />
                  <span className="truncate">{player.displayName}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
