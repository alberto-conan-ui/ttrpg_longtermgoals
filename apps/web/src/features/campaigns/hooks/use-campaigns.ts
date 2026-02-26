import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api-client';

export interface CampaignListItem {
  id: string;
  name: string;
  description: string | null;
  dmId: string;
  inviteCode: string | null;
  createdAt: string;
  updatedAt: string;
  role: 'dm' | 'player';
  memberCount: number;
  dmDisplayName: string;
}

export interface CampaignMember {
  userId: string;
  role: 'dm' | 'player';
  joinedAt: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface CampaignDetail {
  id: string;
  name: string;
  description: string | null;
  dmId: string;
  inviteCode: string | null;
  markerSessionId: string | null;
  markerBetween: boolean;
  showcaseJson: unknown;
  allowContributions: boolean;
  createdAt: string;
  updatedAt: string;
  role: 'dm' | 'player';
  members: CampaignMember[];
}

export function useCampaigns() {
  return useQuery<CampaignListItem[]>({
    queryKey: ['campaigns'],
    queryFn: () => api.get<CampaignListItem[]>('/api/campaigns'),
  });
}

export function useCampaign(id: string) {
  return useQuery<CampaignDetail>({
    queryKey: ['campaigns', id],
    queryFn: () => api.get<CampaignDetail>(`/api/campaigns/${id}`),
    enabled: !!id,
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      api.post<CampaignListItem>('/api/campaigns', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
}

export function useGenerateInvite(campaignId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      api.post<{ inviteCode: string }>(`/api/campaigns/${campaignId}/invite`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', campaignId] });
    },
  });
}

export function useJoinCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { inviteCode: string }) =>
      api.post<{ campaignId: string; campaignName: string; role: string }>(
        '/api/campaigns/join',
        data,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
}
