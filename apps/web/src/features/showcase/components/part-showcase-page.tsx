import { useParams } from '@tanstack/react-router';
import { useCampaign } from '../../campaigns/hooks/use-campaigns';
import { useParts, useUpdatePartShowcase } from '../../campaigns/hooks/use-parts';
import { useAuth } from '../../auth/hooks/use-auth';
import { ShowcasePage } from './showcase-page';
import { LoreFragmentList } from '../../lore/components/lore-fragment-list';

export function PartShowcasePage() {
  const { campaignId, partId } = useParams({ strict: false }) as {
    campaignId: string;
    partId: string;
  };
  const { data: campaign } = useCampaign(campaignId);
  const { data: parts } = useParts(campaignId);
  const { data: user } = useAuth();
  const updateShowcase = useUpdatePartShowcase(campaignId);

  if (!campaign || !parts || !user) return null;

  const part = parts.find((p) => p.id === partId);
  if (!part) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-red-500">
        Part not found
      </div>
    );
  }

  const isDm = campaign.role === 'dm';
  const isOwner = part.showcaseOwnerId === user.id;
  const canEdit = isDm || isOwner || part.allowContributions;

  return (
    <ShowcasePage
      showcaseJson={part.showcaseJson}
      allowContributions={part.allowContributions}
      canEdit={canEdit}
      isDm={isDm}
      onSave={(data) => updateShowcase.mutate({ partId, ...data })}
      isSaving={updateShowcase.isPending}
    >
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">{part.name}</h1>
        <p className="text-sm text-gray-500">
          {part.sessions.length} session{part.sessions.length !== 1 ? 's' : ''}
        </p>
      </div>

      <LoreFragmentList
        campaignId={campaignId}
        attachedTo="part"
        attachedId={partId}
        members={campaign.members}
        currentUserId={user.id}
        isDm={isDm}
      />
    </ShowcasePage>
  );
}
