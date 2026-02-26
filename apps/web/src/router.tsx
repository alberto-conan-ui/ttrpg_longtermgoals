import {
  createRouter,
  createRoute,
  createRootRoute,
  redirect,
  Outlet,
  Link,
} from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';
import { api, ApiClientError } from './lib/api-client';
import type { AuthUser } from './features/auth/hooks/use-auth';
import { LoginPage } from './features/auth/components/login-page';
import { RegisterPage } from './features/auth/components/register-page';
import { CampaignListPage } from './features/campaigns/components/campaign-list-page';
import { CampaignLayout } from './features/showcase/components/campaign-layout';
import { CampaignShowcasePage } from './features/showcase/components/campaign-showcase-page';
import { PartShowcasePage } from './features/showcase/components/part-showcase-page';
import { SessionShowcasePage } from './features/showcase/components/session-showcase-page';
import { PlayerProfilePage } from './features/showcase/components/player-profile-page';
import { useAuth, useLogout } from './features/auth/hooks/use-auth';

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// ---------------------------------------------------------------------------
// Public routes
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Auth guard helper
// ---------------------------------------------------------------------------
async function ensureAuthenticated(queryClient: QueryClient) {
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
    if (!user) throw redirect({ to: '/login' });
  } catch (err) {
    if (err instanceof Error && 'to' in err) throw err;
    throw redirect({ to: '/login' });
  }
}

// ---------------------------------------------------------------------------
// Authenticated layout with navbar
// ---------------------------------------------------------------------------
function AuthenticatedLayout() {
  const { data: user } = useAuth();
  const logout = useLogout();

  return (
    <div className="min-h-screen">
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-6">
            <Link to="/campaigns" className="text-lg font-bold text-violet-600">
              TTRPG Goals
            </Link>
            <Link
              to="/campaigns"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Campaigns
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {user?.avatarUrl && (
              <img
                src={user.avatarUrl}
                alt={user.displayName}
                className="h-8 w-8 rounded-full"
              />
            )}
            <span className="text-sm text-gray-700">
              {user?.displayName}
            </span>
            <button
              onClick={() => logout.mutate()}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Authenticated routes
// ---------------------------------------------------------------------------
const authenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'authenticated',
  beforeLoad: async ({ context }) => {
    const queryClient = (context as { queryClient: QueryClient }).queryClient;
    await ensureAuthenticated(queryClient);
  },
  component: AuthenticatedLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/campaigns' });
  },
});

const campaignsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/campaigns',
  component: CampaignListPage,
});

const campaignLayoutRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/campaigns/$campaignId',
  component: CampaignLayout,
});

const campaignShowcaseRoute = createRoute({
  getParentRoute: () => campaignLayoutRoute,
  path: '/',
  component: CampaignShowcasePage,
});

const partShowcaseRoute = createRoute({
  getParentRoute: () => campaignLayoutRoute,
  path: '/parts/$partId',
  component: PartShowcasePage,
});

const sessionShowcaseRoute = createRoute({
  getParentRoute: () => campaignLayoutRoute,
  path: '/sessions/$sessionId',
  component: SessionShowcasePage,
});

const playerProfileRoute = createRoute({
  getParentRoute: () => campaignLayoutRoute,
  path: '/players/$userId',
  component: PlayerProfilePage,
});

// ---------------------------------------------------------------------------
// Route tree
// ---------------------------------------------------------------------------
const routeTree = rootRoute.addChildren([
  loginRoute,
  registerRoute,
  authenticatedRoute.addChildren([
    indexRoute,
    campaignsRoute,
    campaignLayoutRoute.addChildren([
      campaignShowcaseRoute,
      partShowcaseRoute,
      sessionShowcaseRoute,
      playerProfileRoute,
    ]),
  ]),
]);

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
