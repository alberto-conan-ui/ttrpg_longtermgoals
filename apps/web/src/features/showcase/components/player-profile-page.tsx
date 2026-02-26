import { useParams } from '@tanstack/react-router';
import { useCampaign } from '../../campaigns/hooks/use-campaigns';
import { useAuth } from '../../auth/hooks/use-auth';
import { LoreFragmentList } from '../../lore/components/lore-fragment-list';
import { User } from 'lucide-react';

export function PlayerProfilePage() {
  const { campaignId, userId } = useParams({ strict: false }) as {
    campaignId: string;
    userId: string;
  };
  const { data: campaign } = useCampaign(campaignId);
  const { data: user } = useAuth();

  if (!campaign || !user) return null;

  const player = campaign.members.find((m) => m.userId === userId);
  if (!player) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-red-500">
        Player not found
      </div>
    );
  }

  const isDm = campaign.role === 'dm';

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="flex items-center gap-4">
        {player.avatarUrl ? (
          <img
            src={player.avatarUrl}
            alt={player.displayName}
            className="h-16 w-16 rounded-full"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
            <User className="h-8 w-8 text-indigo-600" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {player.displayName}
          </h1>
          <span
            className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
              player.role === 'dm'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-blue-100 text-blue-700'
            }`}
          >
            {player.role === 'dm' ? 'Dungeon Master' : 'Player'}
          </span>
        </div>
      </div>

      <LoreFragmentList
        campaignId={campaignId}
        attachedTo="player"
        attachedId={userId}
        members={campaign.members}
        currentUserId={user.id}
        isDm={isDm}
      />
    </div>
  );
}
