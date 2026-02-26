import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api-client';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CampaignSession {
  id: string;
  partId: string;
  name: string;
  status: 'planned' | 'played';
  sortOrder: number;
  showcaseJson: unknown;
  showcaseOwnerId: string | null;
  allowContributions: boolean;
  createdAt: string;
}

export interface CampaignPart {
  id: string;
  campaignId: string;
  name: string;
  sortOrder: number;
  showcaseJson: unknown;
  showcaseOwnerId: string | null;
  allowContributions: boolean;
  createdAt: string;
  sessions: CampaignSession[];
}

// ---------------------------------------------------------------------------
// Parts & Sessions queries
// ---------------------------------------------------------------------------

export function useParts(campaignId: string) {
  return useQuery<CampaignPart[]>({
    queryKey: ['campaigns', campaignId, 'parts'],
    queryFn: () =>
      api.get<CampaignPart[]>(`/api/campaigns/${campaignId}/parts`),
    enabled: !!campaignId,
  });
}

export function useCreatePart(campaignId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; sortOrder: number }) =>
      api.post<CampaignPart>(`/api/campaigns/${campaignId}/parts`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['campaigns', campaignId, 'parts'],
      });
    },
  });
}

export function useUpdatePart(campaignId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      partId,
      ...data
    }: {
      partId: string;
      name?: string;
      sortOrder?: number;
    }) => api.patch<CampaignPart>(`/api/parts/${partId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['campaigns', campaignId, 'parts'],
      });
    },
  });
}

export function useDeletePart(campaignId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (partId: string) =>
      api.delete<{ id: string }>(`/api/parts/${partId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['campaigns', campaignId, 'parts'],
      });
    },
  });
}

export function useCreateSession(campaignId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      partId,
      ...data
    }: {
      partId: string;
      name: string;
      sortOrder: number;
    }) => api.post<CampaignSession>(`/api/parts/${partId}/sessions`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['campaigns', campaignId, 'parts'],
      });
    },
  });
}

export function useUpdateSession(campaignId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      sessionId,
      ...data
    }: {
      sessionId: string;
      name?: string;
      sortOrder?: number;
      status?: 'planned' | 'played';
    }) => api.patch<CampaignSession>(`/api/sessions/${sessionId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['campaigns', campaignId, 'parts'],
      });
    },
  });
}

export function useDeleteSession(campaignId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) =>
      api.delete<{ id: string }>(`/api/sessions/${sessionId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['campaigns', campaignId, 'parts'],
      });
    },
  });
}

// ---------------------------------------------------------------------------
// Marker
// ---------------------------------------------------------------------------

export function useUpdateMarker(campaignId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { sessionId: string | null; between: boolean }) =>
      api.patch(`/api/campaigns/${campaignId}/marker`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['campaigns', campaignId],
      });
      queryClient.invalidateQueries({
        queryKey: ['campaigns', campaignId, 'parts'],
      });
    },
  });
}

// ---------------------------------------------------------------------------
// Showcase
// ---------------------------------------------------------------------------

export function useUpdateCampaignShowcase(campaignId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      showcaseJson?: unknown;
      allowContributions?: boolean;
    }) => api.patch(`/api/campaigns/${campaignId}/showcase`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['campaigns', campaignId],
      });
    },
  });
}

export function useUpdatePartShowcase(campaignId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      partId,
      ...data
    }: {
      partId: string;
      showcaseJson?: unknown;
      allowContributions?: boolean;
    }) => api.patch(`/api/parts/${partId}/showcase`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['campaigns', campaignId, 'parts'],
      });
    },
  });
}

export function useUpdateSessionShowcase(campaignId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      sessionId,
      ...data
    }: {
      sessionId: string;
      showcaseJson?: unknown;
      allowContributions?: boolean;
    }) => api.patch(`/api/sessions/${sessionId}/showcase`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['campaigns', campaignId, 'parts'],
      });
    },
  });
}
