
import { UserButton, useUser } from "@clerk/nextjs";

export function UserMenu({ expanded = false }: { expanded?: boolean }) {
  const { user } = useUser();

  return (
    <div className={expanded ? "relative w-full  transition-colors hover:bg-ctp-surface0/50 focus-within:bg-ctp-surface0/50" : undefined}>
    <UserButton appearance={{ elements: {
      userButtonAvatarBox: "size-9",
      ...(expanded ? {
        rootBox: { width: "100%" },
        userButtonBox: { width: "100%" },
        userButtonTrigger: { width: "100%", minHeight: "64px", justifyContent: "flex-start", padding: "12px" },
      } : {}),
    } }}>
      <UserButton.MenuItems>
        <UserButton.Link
          label="Dashboard"
          href="/dashboard"
          labelIcon={
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          }
        />

        <UserButton.Action label="manageAccount" />
        <UserButton.Action label="signOut" />
      </UserButton.MenuItems>
    </UserButton>
    {expanded ? (
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-3 left-15 flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ctp-text">{user?.fullName || user?.username || "Your account"}</p>
          <p className="truncate text-xs text-ctp-subtext0">{user?.primaryEmailAddress?.emailAddress}</p>
        </div>

      </div>
    ) : null}
    </div>
  );
}
