import { useState } from 'react';
import {
  ScrollText,
  Plus,
  Eye,
  EyeOff,
  Globe,
  Users,
  Lock,
  BookOpen,
} from 'lucide-react';
import { RichTextViewer } from './rich-text-viewer';
import { LoreFragmentEditor } from './lore-fragment-editor';
import {
  useLoreFragments,
  useCreateLore,
  useUpdateLore,
  useDeleteLore,
  useShareLore,
} from '../hooks/use-lore';
import type { LoreFragment } from '../hooks/use-lore';
import type { CampaignMember } from '../../campaigns/hooks/use-campaigns';

interface LoreFragmentListProps {
  campaignId: string;
  attachedTo: 'campaign' | 'part' | 'session' | 'player';
  attachedId?: string;
  members: CampaignMember[];
  currentUserId: string;
  isDm: boolean;
}

export function LoreFragmentList({
  campaignId,
  attachedTo,
  attachedId,
  members,
  currentUserId,
  isDm,
}: LoreFragmentListProps) {
  const { data: fragments, isLoading } = useLoreFragments(
    campaignId,
    attachedTo,
    attachedId,
  );
  const createLore = useCreateLore(campaignId);
  const updateLore = useUpdateLore(campaignId);
  const deleteLore = useDeleteLore(campaignId);
  const shareLore = useShareLore(campaignId);

  const [showEditor, setShowEditor] = useState(false);
  const [editingFragment, setEditingFragment] = useState<LoreFragment | null>(
    null,
  );
  const [expandedFragments, setExpandedFragments] = useState<
    Record<string, boolean>
  >({});

  const toggleExpand = (id: string) => {
    setExpandedFragments((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreate = () => {
    setEditingFragment(null);
    setShowEditor(true);
  };

  const handleEdit = (fragment: LoreFragment) => {
    setEditingFragment(fragment);
    setShowEditor(true);
  };

  const visibilityIcon = (fragment: LoreFragment) => {
    const eff = fragment.effectiveVisibility ?? fragment.visibility;
    if (eff === 'public') return <Globe className="h-3 w-3 text-emerald-600" />;
    if (eff === 'shared') return <Users className="h-3 w-3 text-blue-600" />;
    return <EyeOff className="h-3 w-3 text-gray-400" />;
  };

  const scopeIcon = (fragment: LoreFragment) => {
    if (fragment.scope === 'story')
      return <Eye className="h-3 w-3 text-emerald-600" />;
    return <Lock className="h-3 w-3 text-gray-400" />;
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <ScrollText className="h-4 w-4 text-violet-600" />
          Lore Fragments
        </h3>
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-1 rounded-lg bg-violet-600 px-2.5 py-1 text-xs font-medium text-white shadow-sm hover:bg-violet-700 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Lore
        </button>
      </div>

      {isLoading && (
        <p className="mt-3 text-xs text-gray-500">Loading lore...</p>
      )}

      {fragments && fragments.length === 0 && (
        <div className="mt-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-sm text-gray-500">
          No lore fragments yet. Add one!
        </div>
      )}

      {fragments && fragments.length > 0 && (
        <div className="mt-3 space-y-2">
          {fragments.map((fragment) => (
            <div
              key={fragment.id}
              className="rounded-lg border border-gray-200 bg-white shadow-sm"
            >
              <button
                onClick={() => toggleExpand(fragment.id)}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left"
              >
                <BookOpen className="h-3.5 w-3.5 text-violet-500 shrink-0" />
                <span className="flex-1 truncate text-sm font-medium text-gray-900">
                  {fragment.title}
                </span>
                <div className="flex items-center gap-1.5">
                  {scopeIcon(fragment)}
                  {visibilityIcon(fragment)}
                  {(fragment.ownerId === currentUserId || isDm) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(fragment);
                      }}
                      className="rounded px-1.5 py-0.5 text-[10px] font-medium text-violet-600 hover:bg-violet-50"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </button>
              {expandedFragments[fragment.id] && (
                <div className="border-t border-gray-100 px-3 py-3">
                  {fragment.contentJson ? (
                    <RichTextViewer content={fragment.contentJson} />
                  ) : (
                    <p className="text-sm text-gray-400 italic">
                      No content yet.
                    </p>
                  )}
                  <div className="mt-2 flex gap-2 text-[10px] text-gray-400">
                    <span>
                      Scope: {fragment.scope}
                    </span>
                    <span>
                      Visibility:{' '}
                      {fragment.effectiveVisibility ?? fragment.visibility}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {showEditor && (
        <LoreFragmentEditor
          fragment={editingFragment}
          campaignId={campaignId}
          members={members}
          currentUserId={currentUserId}
          isDm={isDm}
          attachedTo={attachedTo}
          attachedId={attachedId}
          onSave={(data) => {
            createLore.mutate(data, {
              onSuccess: () => setShowEditor(false),
            });
          }}
          onUpdate={(data) => {
            updateLore.mutate(data, {
              onSuccess: () => setShowEditor(false),
            });
          }}
          onDelete={(fragmentId) => {
            deleteLore.mutate(fragmentId, {
              onSuccess: () => setShowEditor(false),
            });
          }}
          onShare={(fragmentId, userIds) => {
            shareLore.mutate({ fragmentId, userIds });
          }}
          onClose={() => setShowEditor(false)}
          isPending={
            createLore.isPending ||
            updateLore.isPending ||
            deleteLore.isPending
          }
        />
      )}
    </div>
  );
}
