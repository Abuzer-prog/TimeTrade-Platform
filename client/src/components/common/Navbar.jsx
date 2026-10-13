import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Clock,
  PlusCircle,
  LayoutDashboard,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Compass,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(true);
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
      isActive
        ? 'text-indigo-600 bg-indigo-50/70'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Clock className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Time<span className="text-indigo-600">Trade</span>
                </span>
                <span className="hidden sm:block text-[10px] font-semibold tracking-wider text-slate-500 uppercase -mt-1">
                  Student Time-Exchange
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <NavLink to="/marketplace" className={navLinkClass}>
                <Compass className="h-4 w-4" />
                Marketplace
              </NavLink>
              {isAuthenticated && (
                <>
                  <NavLink to="/sessions/new" className={navLinkClass}>
                    <PlusCircle className="h-4 w-4" />
                    Offer Session
                  </NavLink>
                  <NavLink to="/dashboard" className={navLinkClass}>
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </NavLink>
                </>
              )}
            </nav>
          </div>

          {/* Right Action / Auth Area */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-3 p-1.5 rounded-full hover:bg-slate-100 transition-colors focus:outline-hidden"
                >
                  <img
                    src={user?.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${user?.email}`}
                    alt={user?.name}
                    className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                  />
                  <div className="text-left hidden lg:block pr-1">
                    <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium truncate max-w-[120px]">
                      {user?.department || 'Student'}
                    </p>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-2 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-800 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      <LayoutDashboard className="h-4 w-4 text-slate-400" />
                      Student Dashboard
                    </Link>

                    <Link
                      to="/sessions/new"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      <PlusCircle className="h-4 w-4 text-slate-400" />
                      Post a Session
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      <UserIcon className="h-4 w-4 text-slate-400" />
                      My Profile
                    </Link>

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-medium transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-600/30 transition-all hover:shadow-md"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/marketplace"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            <Compass className="h-4 w-4" />
            Marketplace
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/sessions/new"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <PlusCircle className="h-4 w-4" />
                Offer Session
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <UserIcon className="h-4 w-4" />
                Profile
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
