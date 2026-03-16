"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, LogOut, Loader2, ShieldCheck, Image as ImageIcon, LayoutDashboard, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AdminGalleryModal from "@/components/sokleen/AdminGalleryModal";

const ADMIN_PASSWORD = "Sokleen@Admin2024!";

export default function AdminGalleryPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // ← starts closed

  useEffect(() => {
    const checkAuth = () => {
      const auth = sessionStorage.getItem("sokleen_admin_auth");
      if (auth === "true") setIsAuthenticated(true);
      setIsLoading(false);
    };
    const timer = setTimeout(checkAuth, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("sokleen_admin_auth", "true");
      setError("");
    } else {
      setError("Invalid credentials. Access denied.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("sokleen_admin_auth");
    setPassword("");
    setShowModal(false); // also close modal on logout
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Loader2 className="w-10 h-10 text-blue-600" />
        </motion.div>
        <p className="mt-4 text-slate-500 font-medium animate-pulse">Securing environment...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#0a192f]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md p-1"
        >
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-2xl overflow-hidden">
            <div className="p-8 pt-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20 rotate-3"
              >
                <Lock className="w-10 h-10 text-white" />
              </motion.div>

              <h1 className="text-3xl font-extrabold text-white tracking-tight">Access Gate</h1>
              <p className="text-slate-400 mt-3 text-sm">
                Sokleen Nigeria Ltd Gallery Management System
              </p>
            </div>

            <form onSubmit={handleLogin} className="p-8 pt-0 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300 ml-1">Administrator Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-14 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all"
                  autoFocus
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-400 text-sm font-medium bg-red-400/10 p-3 rounded-lg border border-red-400/20"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white h-14 rounded-xl font-bold text-lg shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Enter Dashboard
              </Button>
            </form>

            <div className="bg-white/5 p-4 text-center border-t border-white/5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">
                Authorized Personnel Only
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      {/* Header / Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 leading-none">SOKLEEN ADMIN</h1>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">System Active</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowModal(true)}
              className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Manage Gallery
            </Button>

            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl px-4 font-semibold transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar / Stats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200">
              <h3 className="text-slate-900 font-bold mb-4 flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4 text-blue-600" /> Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-xs text-slate-500 font-bold uppercase">Gallery Status</p>
                  <p className="text-xl font-black text-slate-900">Live</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-xs text-slate-500 font-bold uppercase">Storage</p>
                  <p className="text-xl font-black text-slate-900">Optimal</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Action Area */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Asset Management</h2>
                  <p className="text-slate-500 text-sm mt-1">Upload and organize your company gallery</p>
                </div>
                <ImageIcon className="w-12 h-12 text-slate-200" />
              </div>

              <div className="p-8">
                {!showModal ? (
                  <div className="py-20 text-center">
                    <ImageIcon className="w-24 h-24 mx-auto mb-8 text-slate-300" />
                    <h3 className="text-3xl font-bold text-slate-700 mb-4">
                      Gallery Management
                    </h3>
                    <p className="text-slate-500 text-lg mb-10 max-w-2xl mx-auto">
                      Add, reorder, hide/show or delete before & after transformation photos
                    </p>
                    <Button
                      size="lg"
                      onClick={() => setShowModal(true)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-7 text-xl rounded-xl shadow-lg"
                    >
                      <Plus className="mr-3 h-6 w-6" />
                      Open Gallery Manager
                    </Button>
                  </div>
                ) : (
                  <div className="min-h-[60vh] flex items-center justify-center">
                    <p className="text-slate-400 italic">
                      Gallery manager is open in the modal above
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* The modal is always mounted – visibility controlled by isOpen */}
      <AdminGalleryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}