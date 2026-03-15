"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AdminGalleryModal from "@/components/sokleen/AdminGalleryModal";

// Admin password (in production, this should be in environment variables)
const ADMIN_PASSWORD = "Sokleen@Admin2024!";

export default function AdminGalleryPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(true);

  // Check if already authenticated (from sessionStorage)
  useEffect(() => {
    const checkAuth = () => {
      const auth = sessionStorage.getItem("sokleen_admin_auth");
      if (auth === "true") {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };
    
    // Small delay to prevent synchronous setState warning
    const timer = setTimeout(checkAuth, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("sokleen_admin_auth", "true");
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("sokleen_admin_auth");
    setPassword("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-sokleen-dark-blue" />
      </div>
    );
  }

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sokleen-dark-blue to-sokleen-deep-blue p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-sokleen-dark-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-sokleen-dark-blue" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Access</h1>
            <p className="text-gray-500 mt-2">
              Enter your password to manage gallery images
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="mt-1 h-12"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-sokleen-dark-blue hover:bg-sokleen-deep-blue text-white h-12 font-semibold"
            >
              Login
            </Button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-6">
            SOKLEEN NIGERIA LTD - Admin Panel
          </p>
        </motion.div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">SOKLEEN Admin</h1>
            <p className="text-sm text-gray-500">Gallery Management</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <AdminGalleryModal isOpen={showModal} onClose={() => {}} />
        </div>
      </main>
    </div>
  );
}
