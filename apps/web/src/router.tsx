import {
  createRouter,
  createRoute,
  createRootRoute,
  redirect,
  Outlet,
} from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';
import { api, ApiClientError } from './lib/api-client';
import type { AuthUser } from './features/auth/hooks/use-auth';
import { LoginPage } from './features/auth/components/login-page';
import { RegisterPage } from './features/auth/components/register-page';
import { DashboardPage } from './features/auth/components/dashboard-page';

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: async ({ context }) => {
    const queryClient = (context as { queryClient: QueryClient }).queryClient;
    try {
      const user = await queryClient.ensureQueryData<AuthUser | null>({
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
      });
      if (!user) {
        throw redirect({ to: '/login' });
      }
    } catch (err) {
      if (err instanceof Error && 'to' in err) throw err;
      throw redirect({ to: '/login' });
    }
  },
  component: DashboardPage,
});

const routeTree = rootRoute.addChildren([loginRoute, registerRoute, indexRoute]);

export function createAppRouter(queryClient: QueryClient) {
  return createRouter({
    routeTree,
    context: { queryClient },
  });
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}
