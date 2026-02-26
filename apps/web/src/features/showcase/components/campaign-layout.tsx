import { Outlet, useParams } from '@tanstack/react-router';
import { useCampaign } from '../../campaigns/hooks/use-campaigns';
import { useParts } from '../../campaigns/hooks/use-parts';
import { CampaignTreeSidebar } from './campaign-tree-sidebar';

export function CampaignLayout() {
  const { campaignId } = useParams({ strict: false }) as {
    campaignId: string;
  };
  const { data: campaign, isLoading: loadingCampaign } =
    useCampaign(campaignId);
  const { data: parts, isLoading: loadingParts } = useParts(campaignId);

  if (loadingCampaign || loadingParts) {
    return (
      <div className="flex h-[calc(100vh-49px)] items-center justify-center text-sm text-gray-500">
        Loading campaign...
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex h-[calc(100vh-49px)] items-center justify-center text-sm text-red-500">
        Campaign not found
      </div>
    );
  }

  const players = campaign.members.filter((m) => m.role === 'player');

  return (
    <div className="flex h-[calc(100vh-49px)]">
      <CampaignTreeSidebar
        campaign={campaign}
        parts={parts ?? []}
        players={players}
      />
      <main className="flex flex-1 flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
