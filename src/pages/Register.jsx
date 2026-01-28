/**
 * Register Page
 * Brutalist styled registration with email/password
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Register() {
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState('');

    const { signUp, signInWithGoogle, error, clearError } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');
        clearError();

        // Validate passwords match
        if (password !== confirmPassword) {
            setLocalError('Passwords do not match');
            return;
        }

        // Validate password length
        if (password.length < 6) {
            setLocalError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await signUp(email, password, displayName);
            navigate('/', { replace: true });
        } catch (err) {
            // Error is handled by context
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        clearError();

        try {
            await signInWithGoogle();
            navigate('/', { replace: true });
        } catch (err) {
            // Error is handled by context
        } finally {
            setLoading(false);
        }
    };

    const displayError = localError || error;

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-brutal-white">
            <div className="w-full max-w-md animate-in">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black uppercase tracking-tight mb-2">
                        🧠 FLUENTO
                    </h1>
                    <p className="font-mono text-gray-600">
                        Start your language journey
                    </p>
                </div>

                {/* Register Card */}
                <div className="card-brutal">
                    <h2 className="text-2xl font-black uppercase mb-6 border-b-4 border-brutal-black pb-2">
                        Create Account
                    </h2>

                    {/* Error Message */}
                    {displayError && (
                        <div className="mb-4 p-3 border-4 border-brutal-red bg-brutal-red/10">
                            <p className="font-mono text-sm text-brutal-red">{displayError}</p>
                        </div>
                    )}

                    {/* Register Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block font-bold uppercase text-sm mb-2">
                                Display Name
                            </label>
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="input-brutal"
                                placeholder="Your name"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block font-bold uppercase text-sm mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-brutal"
                                placeholder="you@example.com"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block font-bold uppercase text-sm mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-brutal"
                                placeholder="••••••••"
                                required
                                disabled={loading}
                                minLength={6}
                            />
                        </div>

                        <div>
                            <label className="block font-bold uppercase text-sm mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="input-brutal"
                                placeholder="••••••••"
                                required
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-brutal-primary w-full text-lg"
                        >
                            {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center my-6">
                        <div className="flex-1 border-t-2 border-brutal-black" />
                        <span className="px-4 font-mono text-sm">OR</span>
                        <div className="flex-1 border-t-2 border-brutal-black" />
                    </div>

                    {/* Google Sign In */}
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="btn-brutal w-full flex items-center justify-center gap-3"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        CONTINUE WITH GOOGLE
                    </button>

                    {/* Login Link */}
                    <p className="mt-6 text-center font-mono text-sm">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="font-bold text-brutal-blue hover:underline"
                        >
                            SIGN IN
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
