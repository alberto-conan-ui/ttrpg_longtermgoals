import { useParams } from '@tanstack/react-router';
import { useCampaign } from '../../campaigns/hooks/use-campaigns';
import {
  useParts,
  useUpdateSessionShowcase,
} from '../../campaigns/hooks/use-parts';
import { useAuth } from '../../auth/hooks/use-auth';
import { ShowcasePage } from './showcase-page';
import { LoreFragmentList } from '../../lore/components/lore-fragment-list';

export function SessionShowcasePage() {
  const { campaignId, sessionId } = useParams({ strict: false }) as {
    campaignId: string;
    sessionId: string;
  };
  const { data: campaign } = useCampaign(campaignId);
  const { data: parts } = useParts(campaignId);
  const { data: user } = useAuth();
  const updateShowcase = useUpdateSessionShowcase(campaignId);

  if (!campaign || !parts || !user) return null;

  // Find session across all parts
  let session = null;
  let parentPart = null;
  for (const part of parts) {
    const found = part.sessions.find((s) => s.id === sessionId);
    if (found) {
      session = found;
      parentPart = part;
      break;
    }
  }

  if (!session || !parentPart) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-red-500">
        Session not found
      </div>
    );
  }

  const isDm = campaign.role === 'dm';
  const isOwner = session.showcaseOwnerId === user.id;
  const canEdit = isDm || isOwner || session.allowContributions;

  return (
    <ShowcasePage
      showcaseJson={session.showcaseJson}
      allowContributions={session.allowContributions}
      canEdit={canEdit}
      isDm={isDm}
      onSave={(data) => updateShowcase.mutate({ sessionId, ...data })}
      isSaving={updateShowcase.isPending}
    >
      <div className="mb-4">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
          {parentPart.name}
        </p>
        <h1 className="text-2xl font-bold text-gray-900">{session.name}</h1>
        <span
          className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
            session.status === 'played'
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {session.status}
        </span>
      </div>

      <LoreFragmentList
        campaignId={campaignId}
        attachedTo="session"
        attachedId={sessionId}
        members={campaign.members}
        currentUserId={user.id}
        isDm={isDm}
      />
    </ShowcasePage>
  );
}
