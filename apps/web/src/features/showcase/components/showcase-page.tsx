import { useState, useCallback } from 'react';
import { Puck, Render, type Data } from '@puckeditor/core';
import '@puckeditor/core/puck.css';
import { Pencil, Eye, Settings } from 'lucide-react';
import { puckConfig, emptyPuckData } from '../puck-config';

interface ShowcasePageProps {
  showcaseJson: unknown;
  allowContributions: boolean;
  canEdit: boolean;
  isDm: boolean;
  onSave: (data: { showcaseJson: unknown; allowContributions?: boolean }) => void;
  isSaving: boolean;
  children?: React.ReactNode;
}

export function ShowcasePage({
  showcaseJson,
  allowContributions,
  canEdit,
  isDm,
  onSave,
  isSaving,
  children,
}: ShowcasePageProps) {
  const [editing, setEditing] = useState(false);
  const [contribToggle, setContribToggle] = useState(allowContributions);
  const [showSettings, setShowSettings] = useState(false);

  const puckData: Data = (showcaseJson as Data) ?? emptyPuckData;

  const handlePuckPublish = useCallback(
    (data: Data) => {
      onSave({
        showcaseJson: data,
        ...(isDm ? { allowContributions: contribToggle } : {}),
      });
      setEditing(false);
    },
    [onSave, isDm, contribToggle],
  );

  // Edit mode: full Puck editor
  if (editing && canEdit) {
    return (
      <div className="flex h-full flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setEditing(false)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Eye className="h-3.5 w-3.5" />
              View mode
            </button>
            {isDm && (
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Settings className="h-3.5 w-3.5" />
                Settings
              </button>
            )}
          </div>
          {isSaving && (
            <span className="text-xs text-gray-500">Saving...</span>
          )}
        </div>

        {/* Settings panel */}
        {showSettings && isDm && (
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={contribToggle}
                onChange={(e) => setContribToggle(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
              />
              <span className="text-gray-700">
                Allow contributions (other members can edit this showcase)
              </span>
            </label>
          </div>
        )}

        {/* Puck Editor */}
        <div className="flex-1 overflow-hidden">
          <Puck
            config={puckConfig}
            data={puckData}
            onPublish={handlePuckPublish}
          />
        </div>
      </div>
    );
  }

  // View mode: rendered showcase + lore + children
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Edit button */}
      {canEdit && (
        <div className="flex items-center justify-end px-6 py-3">
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-violet-700 transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit showcase
          </button>
        </div>
      )}

      {/* Rendered Puck content */}
      <div className="px-6 pb-6">
        {puckData.content && puckData.content.length > 0 ? (
          <Render config={puckConfig} data={puckData} />
        ) : (
          !canEdit && (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500">
              No showcase content yet.
            </div>
          )
        )}

        {/* Extra content (lore fragments, marker controls, etc.) */}
        {children}
      </div>
    </div>
  );
}
