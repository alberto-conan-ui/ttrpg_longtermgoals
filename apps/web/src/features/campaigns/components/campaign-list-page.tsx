import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import {
  useCampaigns,
  useCreateCampaign,
  useJoinCampaign,
} from '../hooks/use-campaigns';

export function CampaignListPage() {
  const { data: campaigns, isLoading } = useCampaigns();
  const createCampaign = useCreateCampaign();
  const joinCampaign = useJoinCampaign();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createCampaign.mutate(
      { name, description: description || undefined },
      {
        onSuccess: () => {
          setName('');
          setDescription('');
          setShowCreate(false);
        },
      },
    );
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    joinCampaign.mutate(
      { inviteCode },
      {
        onSuccess: (data) => {
          setInviteCode('');
          setShowJoin(false);
          navigate({
            to: '/campaigns/$campaignId',
            params: { campaignId: data.campaignId },
          });
        },
      },
    );
  };

  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Campaigns</h1>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setShowJoin(!showJoin);
              setShowCreate(false);
            }}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
          >
            {showJoin ? 'Cancel' : 'Join Campaign'}
          </button>
          <button
            onClick={() => {
              setShowCreate(!showCreate);
              setShowJoin(false);
            }}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-violet-700 transition-colors"
          >
            {showCreate ? 'Cancel' : 'New Campaign'}
          </button>
        </div>
      </div>

      {showJoin && (
        <form
          onSubmit={handleJoin}
          className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4"
        >
          <div>
            <label
              htmlFor="invite-code"
              className="block text-sm font-medium text-gray-700"
            >
              Invite Code
            </label>
            <input
              id="invite-code"
              type="text"
              required
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="e.g. A1B2C3D4"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 font-mono uppercase tracking-widest shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>

          {joinCampaign.error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {joinCampaign.error.message}
            </div>
          )}

          <button
            type="submit"
            disabled={joinCampaign.isPending}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-violet-700 disabled:opacity-50 transition-colors"
          >
            {joinCampaign.isPending ? 'Joining...' : 'Join'}
          </button>
        </form>
      )}

      {showCreate && (
        <form
          onSubmit={handleCreate}
          className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4"
        >
          <div>
            <label
              htmlFor="campaign-name"
              className="block text-sm font-medium text-gray-700"
            >
              Campaign Name
            </label>
            <input
              id="campaign-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Curse of Strahd"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>
          <div>
            <label
              htmlFor="campaign-desc"
              className="block text-sm font-medium text-gray-700"
            >
              Description (optional)
            </label>
            <textarea
              id="campaign-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="A brief description of your campaign..."
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>

          {createCampaign.error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {createCampaign.error.message}
            </div>
          )}

          <button
            type="submit"
            disabled={createCampaign.isPending}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-violet-700 disabled:opacity-50 transition-colors"
          >
            {createCampaign.isPending ? 'Creating...' : 'Create Campaign'}
          </button>
        </form>
      )}

      {isLoading && (
        <div className="mt-8 text-center text-sm text-gray-500">
          Loading campaigns...
        </div>
      )}

      {campaigns && campaigns.length === 0 && (
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <p className="text-gray-500">
            You don&apos;t have any campaigns yet. Create one to get started!
          </p>
        </div>
      )}

      {campaigns && campaigns.length > 0 && (
        <div className="mt-6 space-y-4">
          {campaigns.map((campaign) => (
            <Link
              key={campaign.id}
              to="/campaigns/$campaignId"
              params={{ campaignId: campaign.id }}
              className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:border-violet-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {campaign.name}
                  </h2>
                  {campaign.description && (
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                      {campaign.description}
                    </p>
                  )}
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    campaign.role === 'dm'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {campaign.role === 'dm' ? 'DM' : 'Player'}
                </span>
              </div>
              <div className="mt-3 flex gap-4 text-xs text-gray-500">
                <span>DM: {campaign.dmDisplayName}</span>
                <span>
                  {campaign.memberCount}{' '}
                  {campaign.memberCount === 1 ? 'member' : 'members'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
