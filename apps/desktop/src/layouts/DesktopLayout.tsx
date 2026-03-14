import { Outlet, NavLink } from 'react-router-dom';
import type { ElectronAPI } from '../../electron/preload';

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

const navItems = [
  { to: '/collect', label: 'Collect', icon: '🤖' },
  { to: '/episodes', label: 'Episodes', icon: '📹' },
  { to: '/sync', label: 'Sync', icon: '☁️' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

export function DesktopLayout() {
  const handleMinimize = () => window.electronAPI?.window.minimize();
  const handleMaximize = () => window.electronAPI?.window.maximize();
  const handleClose = () => window.electronAPI?.window.close();

  return (
    <div className="flex h-screen bg-surface text-slate-100 select-none">
      {/* Sidebar */}
      <aside className="w-56 flex flex-col bg-surface-elevated border-r border-surface-border">
        {/* Title bar (drag region) */}
        <div className="h-10 flex items-center px-4 gap-2" style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}>
          <span className="text-brand-blue font-bold text-sm tracking-wide">ROBOTFORGE</span>
          <span className="text-[10px] text-slate-500 font-mono">DESKTOP</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-brand-blue/20 text-brand-blue font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Connection Status */}
        <div className="px-4 py-3 border-t border-surface-border">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
            Ready
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar with window controls */}
        <header
          className="h-10 flex items-center justify-end px-2 bg-surface-elevated border-b border-surface-border gap-1"
          style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
        >
          <button onClick={handleMinimize} className="w-8 h-8 flex items-center justify-center rounded hover:bg-white/10 text-slate-400" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>─</button>
          <button onClick={handleMaximize} className="w-8 h-8 flex items-center justify-center rounded hover:bg-white/10 text-slate-400" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>□</button>
          <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded hover:bg-red-500/80 text-slate-400 hover:text-white" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>✕</button>
        </header>

        {/* Pages */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
