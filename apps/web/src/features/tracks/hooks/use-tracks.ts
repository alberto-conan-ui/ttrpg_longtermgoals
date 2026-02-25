import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api-client';

export interface PlayerProgress {
  playerId: string;
  progress: number;
  displayName: string;
  avatarUrl?: string | null;
  updatedAt?: string;
}

export interface TrackListItem {
  id: string;
  campaignId: string;
  name: string;
  description: string | null;
  createdAt: string;
  milestoneCount: number;
  maxThreshold: number;
  playerProgress: PlayerProgress[];
}

export interface TrackMilestone {
  id: string;
  trackId: string;
  title: string;
  threshold: number;
  description: string | null;
}

export interface TrackDetail {
  id: string;
  campaignId: string;
  name: string;
  description: string | null;
  createdAt: string;
  role: 'dm' | 'player';
  milestones: TrackMilestone[];
  playerProgress: PlayerProgress[];
}

export function useTracks(campaignId: string) {
  return useQuery<TrackListItem[]>({
    queryKey: ['campaigns', campaignId, 'tracks'],
    queryFn: () =>
      api.get<TrackListItem[]>(`/api/campaigns/${campaignId}/tracks`),
    enabled: !!campaignId,
  });
}

export function useTrack(trackId: string) {
  return useQuery<TrackDetail>({
    queryKey: ['tracks', trackId],
    queryFn: () => api.get<TrackDetail>(`/api/tracks/${trackId}`),
    enabled: !!trackId,
  });
}

export function useCreateTrack(campaignId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      description?: string;
      milestones?: { title: string; threshold: number; description?: string }[];
    }) => api.post(`/api/campaigns/${campaignId}/tracks`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['campaigns', campaignId, 'tracks'],
      });
    },
  });
}

export function useUpdateProgress(trackId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { playerId: string; progress: number }) =>
      api.post(`/api/tracks/${trackId}/progress`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracks', trackId] });
    },
  });
}
