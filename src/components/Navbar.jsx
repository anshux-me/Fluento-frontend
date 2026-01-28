/**
 * Navigation Bar Component
 * Brutalist styled navigation with user info
 */

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="nav-brutal sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-2xl">🧠</span>
                        <span className="font-black text-xl tracking-tight">FLUENTO</span>
                    </Link>

                    {/* Navigation Links */}
                    {user && (
                        <div className="hidden md:flex items-center gap-1">
                            <Link
                                to="/"
                                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/pronunciation"
                                className={`nav-link ${isActive('/pronunciation') ? 'active' : ''}`}
                            >
                                Pronounce
                            </Link>
                            <Link
                                to="/spelling"
                                className={`nav-link ${isActive('/spelling') ? 'active' : ''}`}
                            >
                                Spelling
                            </Link>
                            <Link
                                to="/profile"
                                className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                            >
                                Profile
                            </Link>
                        </div>
                    )}

                    {/* User Info / Auth Buttons */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <span className="hidden sm:block font-mono text-sm">
                                    {user.displayName || user.email?.split('@')[0]}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="btn-brutal text-sm py-2 px-4"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="btn-brutal-primary text-sm py-2 px-4">
                                Login
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile Navigation */}
                {user && (
                    <div className="md:hidden flex border-t-2 border-brutal-black -mx-4 px-4 overflow-x-auto">
                        <Link
                            to="/"
                            className={`nav-link whitespace-nowrap ${isActive('/') ? 'active' : ''}`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/pronunciation"
                            className={`nav-link whitespace-nowrap ${isActive('/pronunciation') ? 'active' : ''}`}
                        >
                            Pronounce
                        </Link>
                        <Link
                            to="/spelling"
                            className={`nav-link whitespace-nowrap ${isActive('/spelling') ? 'active' : ''}`}
                        >
                            Spelling
                        </Link>
                        <Link
                            to="/profile"
                            className={`nav-link whitespace-nowrap ${isActive('/profile') ? 'active' : ''}`}
                        >
                            Profile
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
