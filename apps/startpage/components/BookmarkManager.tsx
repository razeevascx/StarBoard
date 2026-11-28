import { Tabs, TabsContent, TabsList, TabsTrigger } from './hangry-ui/components/tabs';
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
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
}

const BookmarkManager = memo(function BookmarkManager({
  bookmarkLinks,
  folders,
  activeFolderId,
  onFolderSelect,
  layout,
  columns,
  folderNavigation,
  sidebarOpen,
  onSidebarToggle,
}: BookmarkManagerProps) {

  const visibleFolders = folders.filter((folder) => (folder.count ?? 0) > 0);
  const folderButtons = visibleFolders.map((folder) => (
    <TabsTrigger
      key={folder.id}
      value={folder.id}
      onKeyDown={(event) => {
        if (folderNavigation === 'sidebar' && event.key === 'Escape') {
          event.preventDefault();
          onSidebarToggle();
          document.getElementById('bookmark-sidebar-toggle')?.focus();
        }
      }}
      className="min-w-0 shrink-0 flex-none gap-2 px-3 py-2 text-xs font-black tracking-wide"
    >
      <Folder className="size-3.5 shrink-0" aria-hidden="true" />
      <span className="min-w-0 max-w-64 truncate" title={folder.title}>{folder.title}</span>
    </TabsTrigger>
  ));

  return (
    <Tabs
      value={activeFolderId ?? ''}
      onValueChange={onFolderSelect}
      orientation={folderNavigation === 'sidebar' ? 'vertical' : 'horizontal'}
      className={`mx-auto min-h-0 w-full max-w-6xl flex-1 ${folderNavigation === 'bottom' ? 'pb-12' : ''}`}
    >
      <div
        id="bookmark-scroll-container"
        role="region"
        aria-label="Bookmarks"
        tabIndex={0}
        className="min-h-0 min-w-0 w-full flex-1 overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-2 focus-visible:outline-ctp-mauve"
      >
        {visibleFolders.map((folder) => (
          <TabsContent key={folder.id} value={folder.id}>
            {activeFolderId === folder.id && <QuickLinks links={bookmarkLinks} layout={layout} columns={columns} />}
          </TabsContent>
        ))}
        {!visibleFolders.some((folder) => folder.id === activeFolderId) && <QuickLinks links={bookmarkLinks} layout={layout} columns={columns} />}
      </div>

      {folderNavigation === "sidebar" ? (
        <aside
          id="bookmark-sidebar"
          aria-label="Bookmark sidebar"
          hidden={!sidebarOpen}

          className="fixed top-16 left-0 z-60 flex h-[calc(100dvh-4rem)] min-h-0 w-44 flex-col overflow-hidden  backdrop-blur-xl hidden:hidden md:w-56"
        >

          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            <TabsList aria-label="Bookmark folders" className="w-full items-stretch justify-start gap-1 p-1">
              {folderButtons}
            </TabsList>
          </div>
        </aside>
      ) : (
        <div className="fixed bottom-0 left-0 z-50 w-full border-t border-ctp-surface1/30 bg-ctp-mantle/30 backdrop-blur-xl">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center justify-center">
              <TabsList aria-label="Bookmark folders" className="max-w-full justify-start overflow-x-auto no-scrollbar p-1">
                {folderButtons}
              </TabsList>
            </div>
          </div>
        </div>
      )}
    </Tabs>
  );
});

export default BookmarkManager;
