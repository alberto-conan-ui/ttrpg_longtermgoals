import { useAuth, useLogout } from '../hooks/use-auth';

export function DashboardPage() {
  const { data: user } = useAuth();
  const logout = useLogout();

  if (!user) return null;

  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Welcome back, {user.displayName}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {user.avatarUrl && (
            <img
              src={user.avatarUrl}
              alt={user.displayName}
              className="h-10 w-10 rounded-full"
            />
          )}
          <button
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {logout.isPending ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Your Profile</h2>
        <dl className="mt-4 space-y-3">
          <div className="flex gap-2">
            <dt className="text-sm font-medium text-gray-500 w-32">Email:</dt>
            <dd className="text-sm text-gray-900">{user.email}</dd>
          </div>
          {user.username && (
            <div className="flex gap-2">
              <dt className="text-sm font-medium text-gray-500 w-32">
                Username:
              </dt>
              <dd className="text-sm text-gray-900">{user.username}</dd>
            </div>
          )}
          <div className="flex gap-2">
            <dt className="text-sm font-medium text-gray-500 w-32">
              Providers:
            </dt>
            <dd className="flex gap-2 text-sm text-gray-900">
              {user.googleId && (
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                  Google
                </span>
              )}
              {user.discordId && (
                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700">
                  Discord
                </span>
              )}
              {user.username && (
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                  Local
                </span>
              )}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <p className="text-sm text-gray-500">
          Campaign management coming in Stage 3
        </p>
      </div>
    </div>
  );
}
