import { cn } from '../lib/cn';
import { memo } from 'react';
import type { FolderItem, BookmarkLink } from '../lib/bookmark';
import QuickLinks from './QuickLinks';

interface BookmarkManagerProps {
  bookmarkLinks: BookmarkLink[];
  folders: FolderItem[];
  activeFolderId: string | null;
  onFolderSelect: (id: string) => void;
}

const BookmarkManager = memo(function BookmarkManager({
  bookmarkLinks,
  folders,
  activeFolderId,
  onFolderSelect,
}: BookmarkManagerProps) {

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12">
      {/* Navigation Tabs */}

      {/* Content Area */}
      <div className="min-h-100">
          <QuickLinks links={bookmarkLinks} />
      </div>

      {/* Folder tabs (fixed bottom) */}
      <div
        className="fixed bottom-0 left-0 w-full z-50 border-t  bg-ctp-mantle/30 backdrop-blur-xl border-b border-ctp-surface1/30
"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center">
            <div className="flex space-x-1 overflow-x-auto no-scrollbar pb-px px-4 text-md">
              {folders
                .filter((f) => (f.count ?? 0) > 0)
                .map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => onFolderSelect(folder.id)}
                    className={cn(
                      "p-6 text-md  transition-all relative whitespace-nowrap",
                      activeFolderId === folder.id
                        ? "text-ctp-mauve"
                        : "text-ctp-subtext0 hover:text-ctp-text",
                    )}
                  >
                    {folder.title}
                    {activeFolderId === folder.id && (
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-ctp-mauve shadow-[0_0_10px_rgba(203,166,247,0.5)]" />
                    )}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default BookmarkManager;
