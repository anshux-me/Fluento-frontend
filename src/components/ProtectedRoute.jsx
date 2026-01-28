/**
 * Protected Route Component
 * Redirects unauthenticated users to login page
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brutal-white">
                <div className="card-brutal p-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        {[0, 1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="waveform-bar"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            />
                        ))}
                    </div>
                    <p className="font-mono text-lg">LOADING...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        // Redirect to login, preserving the intended destination
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}

export default ProtectedRoute;
