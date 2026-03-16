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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminGalleryModal({ isOpen, onClose }: AdminGalleryModalProps) {
  const { toast } = useToast();
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", service: "", beforeImage: "", afterImage: "" });

  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/gallery");
      const result = await response.json();
      if (result.success) setImages(result.data);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => {
    if (isOpen) fetchImages();
  }, [isOpen, fetchImages]);

  // Handle manual close
  const handleClose = () => {
    setShowAddForm(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent 
        // Force the width to 1000px and override internal Shadcn defaults
        className="p-0 border-none bg-white overflow-hidden shadow-2xl rounded-[2rem]"
        style={{ maxWidth: "1000px", width: "95vw", height: "auto", maxH: "90vh" }}
      >
        {/* MODAL HEADER */}
        <div className="bg-slate-900 p-8 text-white relative">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-2xl shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black uppercase italic tracking-tight">
                  Gallery Management
                </DialogTitle>
                <p className="text-slate-400 text-sm">Control your portfolio visibility</p>
              </div>
            </div>

            {/* THE FIX: Explicit Close Button with onClick */}
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleClose();
              }}
              className="p-3 bg-white/10 hover:bg-red-500/20 rounded-full transition-all border border-white/10"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="p-8 overflow-y-auto max-h-[70vh]">
          <div className="space-y-6">
            
            {/* ACTION BAR */}
            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-800 uppercase text-sm tracking-widest">
                Portfolio Items ({images.length})
              </h3>
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                className={`rounded-xl px-6 font-black h-10 ${showAddForm ? "bg-slate-200 text-slate-600" : "bg-blue-600 text-white"}`}
              >
                {showAddForm ? "CANCEL" : "ADD NEW PROJECT"}
              </Button>
            </div>

            {/* TWO-COLUMN FORM */}
            <AnimatePresence>
              {showAddForm && (
                <motion.form
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white border-2 border-slate-100 p-6 rounded-[2rem] shadow-sm"
                >
                  {/* Left Column: Text Inputs */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="font-bold text-xs uppercase text-slate-500">Project Title</Label>
                      <Input placeholder="Enter title..." className="h-12 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold text-xs uppercase text-slate-500">Service Category</Label>
                      <Select>
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue placeholder="Choose Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="deep">Deep Cleaning</SelectItem>
                          <SelectItem value="comm">Commercial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold text-xs uppercase text-slate-500">Summary</Label>
                      <Textarea placeholder="Job details..." className="rounded-xl min-h-[100px]" />
                    </div>
                    <Button className="w-full h-12 bg-slate-900 text-white font-black rounded-xl hover:bg-black">
                      PUBLISH PROJECT
                    </Button>
                  </div>

                  {/* Right Column: Image Previews */}
                  <div className="grid grid-cols-2 gap-4">
                    {['Before', 'After'].map((type) => (
                      <div key={type} className="space-y-2">
                        <Label className="font-bold text-xs uppercase text-slate-500">{type} Photo</Label>
                        <div className="aspect-[3/4] rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center hover:border-blue-400 transition-colors cursor-pointer">
                          <Upload className="w-6 h-6 text-blue-500 mb-1" />
                          <span className="text-[10px] font-bold text-slate-400">UPLOAD</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* SIMPLE LIST VIEW */}
            <div className="space-y-3 pb-6">
              {images.map((img) => (
                <div key={img.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-12 bg-slate-100 rounded-lg overflow-hidden">
                       <img src={img.afterImage} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 leading-none">{img.title}</h4>
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{img.service}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-slate-300 hover:text-red-600"><Trash2 size={18} /></Button>
                </div>
              ))}
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}