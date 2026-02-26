import { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Globe, Users, Lock } from 'lucide-react';
import { RichTextEditor } from './rich-text-editor';
import type { LoreFragment } from '../hooks/use-lore';
import type { CampaignMember } from '../../campaigns/hooks/use-campaigns';

interface LoreFragmentEditorProps {
  fragment?: LoreFragment | null;
  campaignId: string;
  members: CampaignMember[];
  currentUserId: string;
  isDm: boolean;
  // Which node is this attached to?
  attachedTo: 'campaign' | 'part' | 'session' | 'player';
  attachedId?: string;
  onSave: (data: {
    title: string;
    contentJson: unknown;
    scope: 'story' | 'private';
    visibility: 'private' | 'shared' | 'public';
    partId?: string;
    sessionId?: string;
    playerId?: string;
  }) => void;
  onUpdate?: (data: {
    fragmentId: string;
    title?: string;
    contentJson?: unknown;
    scope?: 'story' | 'private';
    visibility?: 'private' | 'shared' | 'public';
  }) => void;
  onDelete?: (fragmentId: string) => void;
  onShare?: (fragmentId: string, userIds: string[]) => void;
  onClose: () => void;
  isPending?: boolean;
}

export function LoreFragmentEditor({
  fragment,
  members,
  currentUserId,
  isDm,
  attachedTo,
  attachedId,
  onSave,
  onUpdate,
  onDelete,
  onShare,
  onClose,
  isPending,
}: LoreFragmentEditorProps) {
  const isEditing = !!fragment;
  const isOwner = fragment?.ownerId === currentUserId;
  const canEdit = isOwner || (!fragment && true);
  const canDelete = isOwner || isDm;
  const canSetScope = attachedTo === 'session' || attachedTo === 'part';

  const [title, setTitle] = useState(fragment?.title ?? '');
  const [contentJson, setContentJson] = useState<unknown>(
    fragment?.contentJson ?? null,
  );
  const [scope, setScope] = useState<'story' | 'private'>(
    fragment?.scope ?? 'private',
  );
  const [visibility, setVisibility] = useState<'private' | 'shared' | 'public'>(
    fragment?.visibility ?? 'private',
  );
  const [shareUserIds, setShareUserIds] = useState<string[]>(
    fragment?.sharedWith ?? [],
  );

  useEffect(() => {
    if (fragment) {
      setTitle(fragment.title);
      setContentJson(fragment.contentJson);
      setScope(fragment.scope);
      setVisibility(fragment.visibility);
      setShareUserIds(fragment.sharedWith ?? []);
    }
  }, [fragment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (isEditing && onUpdate && fragment) {
      onUpdate({
        fragmentId: fragment.id,
        title,
        contentJson,
        scope: canSetScope ? scope : undefined,
        visibility: scope === 'story' ? undefined : visibility,
      });
      // Handle shares
      if (onShare && shareUserIds.length > 0) {
        onShare(fragment.id, shareUserIds);
      }
    } else {
      onSave({
        title,
        contentJson,
        scope: canSetScope ? scope : 'private',
        visibility: scope === 'story' ? 'private' : visibility,
        partId: attachedTo === 'part' ? attachedId : undefined,
        sessionId: attachedTo === 'session' ? attachedId : undefined,
        playerId: attachedTo === 'player' ? attachedId : undefined,
      });
    }
  };

  const otherMembers = members.filter((m) => m.userId !== currentUserId);

  const toggleShareUser = (userId: string) => {
    setShareUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="mx-4 w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Edit Lore Fragment' : 'New Lore Fragment'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={!canEdit}
              placeholder="e.g. Session Recap, Character Backstory..."
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 disabled:bg-gray-100"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            {canEdit ? (
              <RichTextEditor content={contentJson} onChange={setContentJson} />
            ) : (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-500">
                You cannot edit this fragment.
              </div>
            )}
          </div>

          {/* Scope (only for session/part fragments) */}
          {canSetScope && canEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scope
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setScope('private')}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    scope === 'private'
                      ? 'bg-gray-800 text-white'
                      : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Lock className="h-3.5 w-3.5" />
                  Private scope
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setScope('story');
                    setVisibility('private');
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    scope === 'story'
                      ? 'bg-emerald-700 text-white'
                      : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" />
                  Story scope
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {scope === 'story'
                  ? 'Visibility auto-publishes when the marker reaches this node.'
                  : 'You control visibility manually.'}
              </p>
            </div>
          )}

          {/* Visibility (only when scope is private) */}
          {canEdit && scope === 'private' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Visibility
              </label>
              <div className="flex gap-2">
                <VisibilityChip
                  active={visibility === 'private'}
                  onClick={() => setVisibility('private')}
                  icon={<EyeOff className="h-3.5 w-3.5" />}
                  label="Private"
                />
                <VisibilityChip
                  active={visibility === 'shared'}
                  onClick={() => setVisibility('shared')}
                  icon={<Users className="h-3.5 w-3.5" />}
                  label="Shared"
                />
                <VisibilityChip
                  active={visibility === 'public'}
                  onClick={() => setVisibility('public')}
                  icon={<Globe className="h-3.5 w-3.5" />}
                  label="Public"
                />
              </div>
            </div>
          )}

          {/* Share with members (when visibility is shared) */}
          {canEdit && visibility === 'shared' && scope === 'private' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Share with
              </label>
              <div className="space-y-1">
                {otherMembers.map((member) => (
                  <label
                    key={member.userId}
                    className="flex items-center gap-2 rounded-lg px-2 py-1 text-sm hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={shareUserIds.includes(member.userId)}
                      onChange={() => toggleShareUser(member.userId)}
                      className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                    />
                    <span className="text-gray-700">{member.displayName}</span>
                    <span className="text-xs text-gray-400">
                      ({member.role === 'dm' ? 'DM' : 'Player'})
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Story scope info */}
          {scope === 'story' && (
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-700">
              Story-scope fragments are private until the campaign marker
              reaches this session/part, then they become public automatically.
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <div>
              {isEditing && canDelete && onDelete && fragment && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Delete this lore fragment?')) {
                      onDelete(fragment.id);
                    }
                  }}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              {canEdit && (
                <button
                  type="submit"
                  disabled={isPending || !title.trim()}
                  className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-violet-700 disabled:opacity-50 transition-colors"
                >
                  {isPending ? 'Saving...' : isEditing ? 'Update' : 'Create'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function VisibilityChip({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? 'bg-violet-600 text-white'
          : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
