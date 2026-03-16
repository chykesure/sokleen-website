"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  X,
  Trash2,
  Loader2,
  Plus,
  Sparkles,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// --- Interfaces ---
interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  service: string | null;
  beforeImage: string;
  afterImage: string;
  order: number;
  isActive: boolean;
}

interface AdminGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminGalleryModal({ isOpen, onClose }: AdminGalleryModalProps) {
  const { toast } = useToast();
  
  // States
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState<string | null>(null); // 'before' or 'after'
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    service: "",
    beforeImage: "",
    afterImage: "",
  });

  // --- 1. Fetch Data ---
  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/gallery");
      const result = await response.json();
      if (result.success) {
        setImages(result.data.sort((a: any, b: any) => a.order - b.order));
      }
    } catch (error) {
      toast({ title: "Fetch Error", description: "Could not sync with database.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (isOpen) fetchImages();
  }, [isOpen, fetchImages]);

  // --- 2. Handle Image Uploads ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, side: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(side);
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const result = await res.json();
      if (result.success) {
        setFormData(prev => ({ ...prev, [`${side}Image`]: result.data.url }));
        toast({ title: `${side.toUpperCase()} photo ready.` });
      }
    } catch (error) {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setIsUploading(null);
    }
  };

  // --- 3. Save New Project ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.beforeImage || !formData.afterImage) {
      toast({ title: "Missing Photos", description: "Please upload both before and after images.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, order: images.length }),
      });
      const result = await res.json();
      if (result.success) {
        toast({ title: "Project Published Successfully" });
        setFormData({ title: "", description: "", service: "", beforeImage: "", afterImage: "" });
        setShowAddForm(false);
        fetchImages();
      }
    } catch (error) {
      toast({ title: "Save Error", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // --- 4. Delete Entry ---
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        toast({ title: "Deleted" });
        fetchImages();
      }
    } catch (error) {
      toast({ title: "Delete failed" });
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => { if (!open) onClose(); }}
    >
      <DialogContent 
        // FIXED: The maxWidth here ensures the modal stays wide and doesn't shrink.
        className="p-0 border-none bg-white overflow-hidden shadow-2xl rounded-[2.5rem] flex flex-col"
        style={{ maxWidth: "1100px", width: "95vw", height: "90vh" }}
      >
        
        {/* PREMIUM HEADER */}
        <div className="bg-slate-900 p-8 text-white relative shrink-0">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Layers size={180} />
          </div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-blue-600 rounded-3xl shadow-xl shadow-blue-500/20">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter">
                  Sokleen Gallery Admin
                </DialogTitle>
                <p className="text-slate-400 font-medium">Manage your transformation portfolio</p>
              </div>
            </div>

            {/* FIXED CLOSE BUTTON: Directly triggers onClose prop */}
            <button 
              onClick={onClose}
              className="p-3 bg-white/10 hover:bg-red-500/30 rounded-full transition-all border border-white/10 hover:border-red-500/50"
            >
              <X className="w-7 h-7 text-white" />
            </button>
          </div>
        </div>

        {/* BODY AREA (SCROLLABLE) */}
        <div className="flex-1 p-8 overflow-y-auto bg-[#f8fafc]">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* ACTION BAR */}
            <div className="flex justify-between items-center bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-3 w-3 rounded-full bg-blue-500 animate-pulse" />
                <h3 className="font-bold text-slate-700 uppercase text-xs tracking-[0.2em]">
                  Active Transformations ({images.length})
                </h3>
              </div>
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                className={`rounded-2xl px-8 font-black transition-all ${
                  showAddForm ? "bg-slate-100 text-slate-500 hover:bg-slate-200" : "bg-blue-600 text-white shadow-lg hover:bg-blue-700"
                }`}
              >
                {showAddForm ? "CLOSE FORM" : "ADD NEW ENTRY"}
              </Button>
            </div>

            {/* TWO-COLUMN FORM */}
            <AnimatePresence>
              {showAddForm && (
                <motion.form
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  onSubmit={handleSubmit}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white border border-slate-200 p-10 rounded-[3rem] shadow-xl"
                >
                  {/* Left Column: Metadata */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="font-bold text-slate-600 ml-1">Project Title</Label>
                      <Input 
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        placeholder="e.g. Luxury Apartment Post-Construction" 
                        className="h-14 rounded-2xl bg-slate-50 border-slate-200 focus:bg-white transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold text-slate-600 ml-1">Service Provided</Label>
                      <Select value={formData.service} onValueChange={v => setFormData({...formData, service: v})}>
                        <SelectTrigger className="h-14 rounded-2xl bg-slate-50">
                          <SelectValue placeholder="Select Service Type" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                          <SelectItem value="deep-cleaning">Deep Cleaning</SelectItem>
                          <SelectItem value="commercial-cleaning">Commercial</SelectItem>
                          <SelectItem value="fumigation">Fumigation</SelectItem>
                          <SelectItem value="post-construction">Post-Construction</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold text-slate-600 ml-1">Description</Label>
                      <Textarea 
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        placeholder="Briefly describe the results..." 
                        className="rounded-2xl bg-slate-50 min-h-[120px]"
                      />
                    </div>
                    <Button 
                      disabled={isLoading || !!isUploading} 
                      className="w-full h-16 bg-slate-900 text-white font-black rounded-2xl text-lg hover:bg-black active:scale-[0.98] transition-all"
                    >
                      {isLoading ? <Loader2 className="animate-spin mr-2" /> : "PUBLISH TO SITE"}
                    </Button>
                  </div>

                  {/* Right Column: Image Management */}
                  <div className="grid grid-cols-2 gap-4">
                    {['before', 'after'].map((side) => (
                      <div key={side} className="space-y-3">
                        <Label className="font-bold text-slate-600 capitalize">{side} Image</Label>
                        <div className="relative aspect-[3/4] rounded-[2rem] border-4 border-dashed border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden group hover:border-blue-200 transition-all">
                          {formData[`${side}Image` as keyof typeof formData] ? (
                            <>
                              <img src={formData[`${side}Image` as keyof typeof formData]} className="w-full h-full object-cover" />
                              <button 
                                type="button"
                                onClick={() => setFormData({...formData, [`${side}Image`]: ""})}
                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={14} />
                              </button>
                            </>
                          ) : (
                            <label className="cursor-pointer flex flex-col items-center p-6 text-center">
                              {isUploading === side ? (
                                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                              ) : (
                                <>
                                  <div className="p-4 bg-white rounded-2xl shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                    <Upload className="text-blue-500 w-6 h-6" />
                                  </div>
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select File</span>
                                </>
                              )}
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={e => handleImageUpload(e, side as any)} 
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* LIVE DATA LIST */}
            <div className="space-y-4 pb-12">
              <h4 className="font-black text-slate-400 text-[10px] tracking-[0.3em] uppercase ml-1">Live Portfolio</h4>
              {images.length === 0 ? (
                <div className="text-center py-20 bg-slate-100/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold italic">No projects added yet.</p>
                </div>
              ) : (
                images.map((img) => (
                  <div key={img.id} className="group flex items-center gap-6 p-5 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all">
                    <div className="flex gap-1 w-36 h-24 bg-slate-100 p-1 rounded-2xl overflow-hidden shrink-0">
                      <img src={img.beforeImage} className="w-1/2 h-full object-cover rounded-l-xl" />
                      <img src={img.afterImage} className="w-1/2 h-full object-cover rounded-r-xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                          {img.service || "General"}
                        </span>
                        <CheckCircle2 size={12} className="text-green-500" />
                      </div>
                      <h4 className="font-black text-slate-900 truncate uppercase italic tracking-tight text-lg">{img.title}</h4>
                      <p className="text-xs text-slate-400 truncate font-medium">{img.description}</p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-xl text-slate-300 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(img.id)}
                      >
                        <Trash2 size={20} />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}