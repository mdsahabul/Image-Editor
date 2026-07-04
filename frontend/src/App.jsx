/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/custom.css';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute   from './components/common/ProtectedRoute';
import AdminRoute       from './components/common/AdminRoute';

import LoginPage          from './pages/LoginPage';
import RegisterPage       from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage      from './pages/DashboardPage';
import EditorPage         from './pages/EditorPage';
import AdminPage          from './pages/AdminPage';
import NotFoundPage       from './pages/NotFoundPage';

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public */}
                    <Route path="/login"           element={<LoginPage />} />
                    <Route path="/register"        element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                    {/* Protected */}
                    <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                    <Route path="/editor/:id" element={<ProtectedRoute><EditorPage /></ProtectedRoute>} />

                    {/* Admin */}
                    <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />

                    {/* Redirects */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </BrowserRouter>

            <ToastContainer
                position="bottom-right"
                theme="dark"
                autoClose={3000}
                pauseOnHover
            />
        </AuthProvider>
    );
}
