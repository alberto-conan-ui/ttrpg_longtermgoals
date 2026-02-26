import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api-client';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LoreFragment {
  id: string;
  campaignId: string;
  ownerId: string;
  title: string;
  contentJson: unknown;
  scope: 'story' | 'private';
  visibility: 'private' | 'shared' | 'public';
  effectiveVisibility?: 'private' | 'shared' | 'public';
  partId: string | null;
  sessionId: string | null;
  playerId: string | null;
  createdAt: string;
  updatedAt: string;
  sharedWith?: string[];
}

// ---------------------------------------------------------------------------
// List lore fragments for a campaign (with optional attachment filter)
// ---------------------------------------------------------------------------

export function useLoreFragments(
  campaignId: string,
  attachedTo?: 'campaign' | 'part' | 'session' | 'player',
  attachedId?: string,
) {
  const params = new URLSearchParams();
  if (attachedTo) params.set('attachedTo', attachedTo);
  if (attachedId) params.set('attachedId', attachedId);
  const qs = params.toString();

  return useQuery<LoreFragment[]>({
    queryKey: ['campaigns', campaignId, 'lore', attachedTo ?? 'all', attachedId ?? ''],
    queryFn: () =>
      api.get<LoreFragment[]>(
        `/api/campaigns/${campaignId}/lore${qs ? `?${qs}` : ''}`,
      ),
    enabled: !!campaignId,
  });
}

// ---------------------------------------------------------------------------
// Get single lore fragment
// ---------------------------------------------------------------------------

export function useLoreFragment(fragmentId: string | undefined) {
  return useQuery<LoreFragment>({
    queryKey: ['lore', fragmentId],
    queryFn: () => api.get<LoreFragment>(`/api/lore/${fragmentId}`),
    enabled: !!fragmentId,
  });
}

// ---------------------------------------------------------------------------
// Create lore fragment
// ---------------------------------------------------------------------------

export function useCreateLore(campaignId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      title: string;
      contentJson?: unknown;
      scope?: 'story' | 'private';
      visibility?: 'private' | 'shared' | 'public';
      partId?: string;
      sessionId?: string;
      playerId?: string;
    }) => api.post<LoreFragment>(`/api/campaigns/${campaignId}/lore`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['campaigns', campaignId, 'lore'],
      });
    },
  });
}

// ---------------------------------------------------------------------------
// Update lore fragment
// ---------------------------------------------------------------------------

export function useUpdateLore(campaignId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      fragmentId,
      ...data
    }: {
      fragmentId: string;
      title?: string;
      contentJson?: unknown;
      scope?: 'story' | 'private';
      visibility?: 'private' | 'shared' | 'public';
    }) => api.patch<LoreFragment>(`/api/lore/${fragmentId}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['campaigns', campaignId, 'lore'],
      });
      queryClient.invalidateQueries({
        queryKey: ['lore', variables.fragmentId],
      });
    },
  });
}

// ---------------------------------------------------------------------------
// Delete lore fragment
// ---------------------------------------------------------------------------

export function useDeleteLore(campaignId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fragmentId: string) =>
      api.delete<{ id: string }>(`/api/lore/${fragmentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['campaigns', campaignId, 'lore'],
      });
    },
  });
}

// ---------------------------------------------------------------------------
// Share lore fragment
// ---------------------------------------------------------------------------

export function useShareLore(campaignId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      fragmentId,
      userIds,
    }: {
      fragmentId: string;
      userIds: string[];
    }) =>
      api.post<{ fragmentId: string; sharedWith: string[] }>(
        `/api/lore/${fragmentId}/share`,
        { userIds },
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['campaigns', campaignId, 'lore'],
      });
      queryClient.invalidateQueries({
        queryKey: ['lore', variables.fragmentId],
      });
    },
  });
}

// ---------------------------------------------------------------------------
// Revoke share
// ---------------------------------------------------------------------------

export function useRevokeLoreShare(campaignId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      fragmentId,
      userId,
    }: {
      fragmentId: string;
      userId: string;
    }) =>
      api.delete<{ fragmentId: string; sharedWith: string[] }>(
        `/api/lore/${fragmentId}/share/${userId}`,
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['campaigns', campaignId, 'lore'],
      });
      queryClient.invalidateQueries({
        queryKey: ['lore', variables.fragmentId],
      });
    },
  });
}
