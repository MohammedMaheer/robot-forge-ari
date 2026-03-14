import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';
import { cn } from '@robotforge/ui';
import { GlobalSearch } from '@/components/GlobalSearch';
import { ThemeToggle } from '@/components/ThemeToggle';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/collect', label: 'Collect', icon: '🤖' },
  { to: '/episodes', label: 'Episodes', icon: '🎬' },
  { to: '/marketplace', label: 'Marketplace', icon: '🏪' },
  { to: '/datasets', label: 'My Datasets', icon: '📦' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

export function AppLayout() {
  const { user, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUiStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          'flex flex-col bg-surface-elevated border-r border-surface-border transition-all duration-200',
          sidebarOpen ? 'w-56' : 'w-16'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 h-14 border-b border-surface-border shrink-0">
          <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center text-white font-bold text-sm">
            RF
          </div>
          {sidebarOpen && (
            <span className="text-sm font-semibold text-text-primary tracking-tight">ROBOTFORGE</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                  isActive
                    ? 'bg-mid-blue/10 text-mid-blue font-medium'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                )
              }
            >
              <span className="text-base shrink-0">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}

          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                  isActive
                    ? 'bg-mid-blue/10 text-mid-blue font-medium'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                )
              }
            >
              <span className="text-base shrink-0">🛡️</span>
              {sidebarOpen && <span>Admin</span>}
            </NavLink>
          )}
        </nav>

        {/* User section */}
        <div className="px-3 py-3 border-t border-surface-border">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-mid-blue/20 flex items-center justify-center text-mid-blue text-xs font-medium">
                {user?.name?.charAt(0).toUpperCase() ?? 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-text-primary truncate">{user?.name}</p>
                <p className="text-[10px] text-text-secondary capitalize">{user?.role}</p>
              </div>
              <button onClick={handleLogout} className="text-text-secondary hover:text-error text-xs" title="Logout">
                ↪
              </button>
            </div>
          ) : (
            <button onClick={handleLogout} className="w-full flex justify-center text-text-secondary hover:text-error" title="Logout">
              ↪
            </button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 h-14 border-b border-surface-border bg-surface shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={toggleSidebar} className="text-text-secondary hover:text-text-primary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <GlobalSearch />
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span className="text-xs text-text-secondary bg-surface-elevated px-2 py-1 rounded capitalize">
              {user?.tier} tier
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
