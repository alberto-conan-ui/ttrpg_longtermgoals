import { useParams } from '@tanstack/react-router';
import { useCampaign } from '../../campaigns/hooks/use-campaigns';
import {
  useParts,
  useUpdateCampaignShowcase,
  useCreatePart,
  useCreateSession,
} from '../../campaigns/hooks/use-parts';
import { useAuth } from '../../auth/hooks/use-auth';
import { ShowcasePage } from './showcase-page';
import { LoreFragmentList } from '../../lore/components/lore-fragment-list';
import { MarkerControls } from './marker-controls';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export function CampaignShowcasePage() {
  const { campaignId } = useParams({ strict: false }) as {
    campaignId: string;
  };
  const { data: campaign } = useCampaign(campaignId);
  const { data: parts } = useParts(campaignId);
  const { data: user } = useAuth();
  const updateShowcase = useUpdateCampaignShowcase(campaignId);

  if (!campaign || !user) return null;

  const isDm = campaign.role === 'dm';
  const canEdit = isDm || campaign.allowContributions;

  return (
    <ShowcasePage
      showcaseJson={campaign.showcaseJson ?? null}
      allowContributions={campaign.allowContributions ?? false}
      canEdit={canEdit}
      isDm={isDm}
      onSave={(data) => updateShowcase.mutate(data)}
      isSaving={updateShowcase.isPending}
    >
      {/* Marker Controls (DM only) */}
      {isDm && parts && (
        <MarkerControls
          campaignId={campaignId}
          parts={parts}
          markerSessionId={campaign.markerSessionId ?? null}
          markerBetween={campaign.markerBetween ?? false}
          isDm={isDm}
        />
      )}

      {/* DM Management: Create parts & sessions */}
      {isDm && <DmManagement campaignId={campaignId} parts={parts ?? []} />}

      {/* Campaign-level lore */}
      <LoreFragmentList
        campaignId={campaignId}
        attachedTo="campaign"
        members={campaign.members}
        currentUserId={user.id}
        isDm={isDm}
      />
    </ShowcasePage>
  );
}

// ---------------------------------------------------------------------------
// DM Management: inline forms for creating parts & sessions
// ---------------------------------------------------------------------------
function DmManagement({
  campaignId,
  parts,
}: {
  campaignId: string;
  parts: { id: string; name: string; sortOrder: number; sessions: { sortOrder: number }[] }[];
}) {
  const createPart = useCreatePart(campaignId);
  const createSession = useCreateSession(campaignId);
  const [newPartName, setNewPartName] = useState('');
  const [addSessionTo, setAddSessionTo] = useState<string | null>(null);
  const [newSessionName, setNewSessionName] = useState('');

  const handleCreatePart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartName.trim()) return;
    const maxSort = parts.reduce((m, p) => Math.max(m, p.sortOrder), 0);
    createPart.mutate(
      { name: newPartName.trim(), sortOrder: maxSort + 1 },
      { onSuccess: () => setNewPartName('') },
    );
  };

  const handleCreateSession = (e: React.FormEvent, partId: string) => {
    e.preventDefault();
    if (!newSessionName.trim()) return;
    const part = parts.find((p) => p.id === partId);
    const maxSort = (part?.sessions ?? []).reduce(
      (m, s) => Math.max(m, s.sortOrder),
      0,
    );
    createSession.mutate(
      { partId, name: newSessionName.trim(), sortOrder: maxSort + 1 },
      {
        onSuccess: () => {
          setNewSessionName('');
          setAddSessionTo(null);
        },
      },
    );
  };

  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900">
        Campaign Structure
      </h3>

      {/* Existing parts with "add session" */}
      <div className="mt-3 space-y-2">
        {parts.map((part) => (
          <div
            key={part.id}
            className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm"
          >
            <span className="text-gray-700">{part.name}</span>
            <button
              onClick={() =>
                setAddSessionTo(addSessionTo === part.id ? null : part.id)
              }
              className="text-xs text-violet-600 hover:text-violet-700"
            >
              <Plus className="inline h-3.5 w-3.5" /> Session
            </button>
          </div>
        ))}

        {/* Inline add session form */}
        {addSessionTo && (
          <form
            onSubmit={(e) => handleCreateSession(e, addSessionTo)}
            className="flex items-center gap-2 pl-4"
          >
            <input
              type="text"
              value={newSessionName}
              onChange={(e) => setNewSessionName(e.target.value)}
              placeholder="Session name..."
              className="flex-1 rounded-lg border border-gray-300 px-2 py-1 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
            <button
              type="submit"
              disabled={createSession.isPending}
              className="rounded-lg bg-violet-600 px-3 py-1 text-xs font-medium text-white hover:bg-violet-700 disabled:opacity-50"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setAddSessionTo(null)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </form>
        )}
      </div>

      {/* Add Part */}
      <form onSubmit={handleCreatePart} className="mt-3 flex items-center gap-2">
        <input
          type="text"
          value={newPartName}
          onChange={(e) => setNewPartName(e.target.value)}
          placeholder="New part name..."
          className="flex-1 rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
        />
        <button
          type="submit"
          disabled={createPart.isPending}
          className="inline-flex items-center gap-1 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-700 disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Part
        </button>
      </form>
    </div>
  );
}
