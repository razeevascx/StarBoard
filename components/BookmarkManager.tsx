import { cn } from '../lib/cn';
import { memo } from 'react';
import QuickLinks from './QuickLinks';
import type { FolderItem, BookmarkLink } from '../lib/bookmark';

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
      <div className="flex items-center justify-center border-b border-ctp-surface1/30">
        <div className="flex space-x-1 overflow-x-auto no-scrollbar pb-px">
          {folders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => onFolderSelect(folder.id)}
              className={cn(
                "p-4 text-md  transition-all relative whitespace-nowrap",
                activeFolderId === folder.id
                  ? "text-ctp-mauve"
                  : "text-ctp-subtext0 hover:text-ctp-text"
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

      {/* Content Area */}
      <div className="min-h-100">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
           <QuickLinks links={bookmarkLinks} />
        </div>
      </div>
    </div>
  );
});

export default BookmarkManager;
