import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiClientError } from '../../../lib/api-client';

export interface AuthUser {
  id: string;
  email: string;
  username: string | null;
  displayName: string;
  avatarUrl: string | null;
  googleId: string | null;
  discordId: string | null;
  createdAt: string;
  updatedAt: string;
}

export function useAuth() {
  return useQuery<AuthUser | null>({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      try {
        return await api.get<AuthUser>('/api/auth/me');
      } catch (err) {
        if (err instanceof ApiClientError && err.status === 401) {
          return null;
        }
        throw err;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { username: string; password: string }) =>
      api.post<AuthUser>('/api/auth/login', data),
    onSuccess: (user) => {
      queryClient.setQueryData(['auth', 'me'], user);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      username: string;
      password: string;
      email: string;
      displayName: string;
    }) => api.post<AuthUser>('/api/auth/register', data),
    onSuccess: (user) => {
      queryClient.setQueryData(['auth', 'me'], user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.post<{ success: boolean }>('/api/auth/logout'),
    onSuccess: () => {
      queryClient.setQueryData(['auth', 'me'], null);
    },
  });
}

export function useAuthProviders() {
  return useQuery<string[]>({
    queryKey: ['auth', 'providers'],
    queryFn: () => api.get<string[]>('/api/auth/providers'),
    staleTime: 1000 * 60 * 30,
  });
}
