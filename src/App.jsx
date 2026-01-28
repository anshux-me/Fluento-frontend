/**
 * Main App Component
 * Sets up routing and authentication context
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Pronunciation from './pages/Pronunciation';
import Spelling from './pages/Spelling';
import Profile from './pages/Profile';

function AppContent() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/pronunciation"
                        element={
                            <ProtectedRoute>
                                <Pronunciation />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/spelling"
                        element={
                            <ProtectedRoute>
                                <Spelling />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>

            {/* Footer */}
            <footer className="border-t-4 border-brutal-black bg-brutal-white p-4 text-center">
                <p className="font-mono text-sm text-gray-600">
                    🧠 Fluento — AI-Powered Language Learning
                </p>
            </footer>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
