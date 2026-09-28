import { cn } from '../lib/cn';
import { Folder } from 'lucide-react';
import { memo } from 'react';
import type { FolderItem, BookmarkLink } from '../lib/bookmark';
import QuickLinks from './QuickLinks';

interface BookmarkManagerProps {
  bookmarkLinks: BookmarkLink[];
  folders: FolderItem[];
  activeFolderId: string | null;
  onFolderSelect: (id: string) => void;
  layout: "cards" | "list";
  columns: 2 | 3 | 4;
  folderNavigation: "bottom" | "sidebar";
}

const BookmarkManager = memo(function BookmarkManager({
  bookmarkLinks,
  folders,
  activeFolderId,
  onFolderSelect,
  layout,
  columns,
  folderNavigation,
}: BookmarkManagerProps) {

  const folderButtons = folders
    .filter((folder) => (folder.count ?? 0) > 0)
    .map((folder) => (
      <button
        key={folder.id}
        onClick={() => onFolderSelect(folder.id)}
        aria-pressed={activeFolderId === folder.id}
        className={cn(
          "flex items-center gap-2 border border-transparent px-4 py-2 text-xs font-black tracking-wide transition-all whitespace-nowrap hover:scale-110 hover:border-ctp-mauve/50 hover:shadow-2xl",
          activeFolderId === folder.id
            ? "bg-ctp-mauve text-ctp-base"
            : "text-ctp-subtext0 hover:bg-ctp-surface0/40 hover:text-ctp-text",
        )}
      >
        <Folder className="size-3.5 shrink-0" aria-hidden="true" />
        {folder.title}
      </button>
    ));

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12">
      {/* Navigation Tabs */}

      {/* Content Area */}
      <div className="min-h-100">
          <QuickLinks links={bookmarkLinks} layout={layout} columns={columns} />
      </div>

      {folderNavigation === "sidebar" ? (
        <aside className="fixed inset-y-0 left-0 z-60 flex w-44 flex-col border-r border-ctp-surface1/30 bg-ctp-mantle/80 backdrop-blur-xl md:w-56">
          <div className="flex h-16 shrink-0 items-center border-b border-ctp-surface1/30 px-5">
            <img
              src="favicon.svg"
              alt="Starboard"
              className="size-9"
            />
          </div>
          <div className="m-3 flex flex-1 flex-col gap-1 overflow-y-auto no-scrollbar bg-ctp-surface0/50 p-1">
            {folderButtons}
          </div>
        </aside>
      ) : (
        <div className="fixed bottom-0 left-0 z-50 w-full border-t border-ctp-surface1/30 bg-ctp-mantle/30 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-center">
              <div className="flex overflow-x-auto no-scrollbar bg-ctp-surface0/50 p-1 text-md">
                {folderButtons}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default BookmarkManager;
