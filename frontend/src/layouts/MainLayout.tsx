import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  User as UserIcon, 
  LogOut, 
  Sparkles, 
  Menu, 
  X, 
  Wand2,
  ChevronRight,
  Bell
} from 'lucide-react';

export const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'New Campaign', path: '/campaign/new', icon: PlusCircle },
    { name: 'Campaign History', path: '/history', icon: History },
    { name: 'My Profile', path: '/profile', icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200/80 sticky top-0 h-screen z-30">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-slate-900">
                AI Content<span className="text-gradient">Studio</span>
              </span>
              <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider">SaaS Edition</span>
            </div>
          </Link>
        </div>

        {/* Quick Action Button */}
        <div className="p-4">
          <button
            onClick={() => navigate('/campaign/new')}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-brand text-white font-medium text-sm shadow-md shadow-brand-500/25 hover:opacity-95 hover:shadow-lg transition-all"
          >
            <Wand2 className="w-4 h-4" />
            Create Campaign
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* User Card at Bottom */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-900 truncate">{user?.name || 'Creator'}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Log out"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Breadcrumb indicator */}
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="font-semibold text-slate-900">Studio</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="capitalize text-slate-600">
                {location.pathname.replace('/', '').replace('-', ' ') || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              AI Engine Ready
            </span>

            {/* Quick Action Button for Mobile / Header */}
            <button
              onClick={() => navigate('/campaign/new')}
              className="sm:hidden p-2 rounded-lg bg-brand-600 text-white shadow-sm"
            >
              <PlusCircle className="w-5 h-5" />
            </button>

            {/* User Avatar Menu */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center text-white text-xs font-bold shadow-xs">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 animate-fade-in">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-900">{user?.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                    Account Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 p-4 space-y-2 animate-fade-in">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 font-semibold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </NavLink>
              );
            })}
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
