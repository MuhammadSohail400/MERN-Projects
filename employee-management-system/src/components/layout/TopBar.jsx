import { useState } from "react";

export default function TopBar({
  userName = "Alex Rivera",
  userRole = "HR ADMINISTRATOR",
  userInitials = "AR",
}) {
  // useState — search ki value store karo
  const [searchVal, setSearchVal] = useState("");

  // useState — notification dot dikhao ya chhupao
  const [hasNotif, setHasNotif] = useState(true);

  return (
    <header className="topbar">

      {/* Search bar */}
      <div className="search-bar">
        <svg
          width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search employees, reports, actions…"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
        />
      </div>

      {/* Right side */}
      <div className="topbar-right">

        {/* Bell button — click karo toh dot gayab */}
        <button
          className="notif-btn"
          onClick={() => setHasNotif(false)}
        >
          <svg
            width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {/* Conditional rendering — hasNotif true ho tabhi dot dikhao */}
          {hasNotif && <span className="notif-dot" />}
        </button>

        {/* User pill */}
        <div className="user-pill">
          <div className="user-avatar">{userInitials}</div>
          <div>
            <div className="user-name">{userName}</div>
            <div className="user-role">{userRole}</div>
          </div>
        </div>

      </div>
    </header>
  );
}