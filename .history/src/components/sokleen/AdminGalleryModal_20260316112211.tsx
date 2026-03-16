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
  Image as ImageIcon,
  Loader2,
  Plus,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  service: string | null;
  beforeImage: string;
  afterImage: string;
  beforeAlt: string | null;
  afterAlt: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
}

const services = [
  { value: "deep-cleaning", label: "Deep Cleaning" },
  { value: "commercial-cleaning", label: "Commercial Cleaning" },
  { value: "residential-cleaning", label: "Residential Cleaning" },
  { value: "upholstery-cleaning", label: "Upholstery Cleaning" },
  { value: "fumigation", label: "Fumigation" },
  { value: "post-construction", label: "Post-Construction" },
];

interface AdminGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminGalleryModal({ isOpen, onClose }: AdminGalleryModalProps) {
  const { toast } = useToast();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState<"before" | "after" | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    service: "",
    beforeImage: "",
    afterImage: "",
    beforeAlt: "",
    afterAlt: "",
  });

  // --- LOGIC: FETCHING ---
  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/gallery");
      const result = await response.json();
      if (result.success) {
        setImages(result.data.sort((a: any, b: any) => a.order - b.order));
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to load gallery", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (isOpen) fetchImages();
  }, [isOpen, fetchImages]);

  // --- LOGIC: UPLOADING ---
  const handleFileUpload = async (file: File, type: "before" | "after") => {
    setIsUploading(type);
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      const response = await fetch("/api/upload", { method: "POST", body: uploadData });
      const result = await response.json();
      if (result.success) {
        setFormData(prev => ({ ...prev, [type === "before" ? "beforeImage" : "afterImage"]: result.data.url }));
        toast({ title: "Success", description: `${type} image ready.` });
      }
    } catch (error) {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setIsUploading(null);
    }
  };

  // --- LOGIC: CRUD ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.beforeImage || !formData.afterImage) {
      toast({ title: "Required Fields", description: "Title and both images are required.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, order: images.length }),
      });
      if ((await res.json()).success) {
        toast({ title: "Success", description: "Gallery entry added." });
        setFormData({ title: "", description: "", service: "", beforeImage: "", afterImage: "", beforeAlt: "", afterAlt: "" });
        setShowAddForm(false);
        fetchImages();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this transformation?")) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if ((await res.json()).success) {
        toast({ title: "Deleted" });
        fetchImages();
      }
    } catch (error) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if ((await res.json()).success) {
        fetchImages();
        toast({ title: "Status Updated" });
      }
    } catch (error) { console.error(error); }
  };

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const currentIndex = images.findIndex((img) => img.id === id);
    const newImages = [...images];
    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (swapIndex < 0 || swapIndex >= images.length) return;

    [newImages[currentIndex], newImages[swapIndex]] = [newImages[swapIndex], newImages[currentIndex]];

    try {
      await Promise.all(newImages.map((img, idx) => 
        fetch(`/api/gallery/${img.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: idx }),
        })
      ));
      fetchImages();
    } catch (error) { toast({ title: "Reorder failed" }); }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => { if (!val) onClose(); }}>
      {/* FIXED WIDTH: max-w-5xl (approx 1024px) 
        FIXED CLOSING: Handled by onOpenChange + Manual Button
      */}
      <DialogContent 
        className="max-w-5xl w-[95vw] h-[90vh] p-0 overflow-hidden bg-white border-none shadow-2xl flex flex-col rounded-[2rem]"
      >
        {/* HEADER */}
        <div className="bg-slate-900 p-6 text-white shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="p-2 bg-blue-600 rounded-xl">
                <Sparkles size={24} />
             </div>
             <div>
                <DialogTitle className="text-xl font-bold uppercase tracking-tight italic">Gallery Admin</DialogTitle>
                <p className="text-xs text-slate-400">Manage Sokleen Transformations</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors border border-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8 bg-[#fcfcfc]">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div>
              <h3 className="font-black text-slate-800 text-sm uppercase">Live Items ({images.length})</h3>
              <p className="text-xs text-slate-400">Reorder or toggle visibility below</p>
            </div>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className={`rounded-xl px-6 font-bold h-11 ${showAddForm ? "bg-slate-200 text-slate-600" : "bg-blue-600 text-white"}`}
            >
              {showAddForm ? "CANCEL" : "ADD NEW IMAGE"}
            </Button>
          </div>

          <AnimatePresence>
            {showAddForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                onSubmit={handleSubmit}
                className="bg-white border border-slate-200 rounded-[2rem] p-6 lg:p-8 shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label className="text-xs font-bold uppercase text-slate-500">Project Title *</Label>
                    <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="h-12 rounded-xl" placeholder="Living Room Deep Clean" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-bold uppercase text-slate-500">Service Category</Label>
                    <Select value={formData.service} onValueChange={v => setFormData({...formData, service: v})}>
                      <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Select service" /></SelectTrigger>
                      <SelectContent>
                        {services.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-bold uppercase text-slate-500">Description</Label>
                    <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="rounded-xl min-h-[100px]" placeholder="Summary of work..." />
                  </div>
                  <Button disabled={isLoading || isUploading !== null} className="w-full h-12 bg-slate-900 text-white font-bold rounded-xl">
                    {isLoading ? <Loader2 className="animate-spin" /> : "SAVE TRANSFORMATION"}
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {["before", "after"].map((type) => (
                    <div key={type} className="space-y-2">
                      <Label className="text-xs font-bold uppercase text-slate-500 capitalize">{type} Photo *</Label>
                      <div className="aspect-[3/4] rounded-2xl border-2 border-dashed bg-slate-50 flex items-center justify-center relative overflow-hidden group">
                        {formData[`${type}Image` as keyof typeof formData] ? (
                          <>
                            <img src={formData[`${type}Image` as keyof typeof formData]} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                               <Button type="button" variant="destructive" size="icon" onClick={() => setFormData({...formData, [`${type}Image`]: ""})}><X size={16} /></Button>
                            </div>
                          </>
                        ) : (
                          <label className="cursor-pointer flex flex-col items-center p-4 text-center">
                            {isUploading === type ? <Loader2 className="animate-spin text-blue-500" /> : <Upload className="text-slate-300" />}
                            <span className="text-[10px] font-bold text-slate-400 mt-2 uppercase">UPLOAD</span>
                            <input type="file" className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], type as any)} />
                          </label>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="space-y-3 pb-10">
            {images.map((image, index) => (
              <div key={image.id} className={`flex items-center gap-4 p-4 bg-white rounded-2xl border transition-all ${image.isActive ? "border-slate-100 shadow-sm" : "border-red-100 bg-red-50/20"}`}>
                <div className="flex gap-1 shrink-0">
                  <img src={image.beforeImage} className="w-16 h-12 object-cover rounded-lg border border-slate-200" />
                  <img src={image.afterImage} className="w-16 h-12 object-cover rounded-lg border border-slate-200" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 truncate text-sm uppercase italic leading-none mb-1">{image.title}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{image.service?.replace('-', ' ')}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600" onClick={() => handleReorder(image.id, "up")} disabled={index === 0}><ArrowUp size={16} /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600" onClick={() => handleReorder(image.id, "down")} disabled={index === images.length - 1}><ArrowDown size={16} /></Button>
                  <Button variant="ghost" size="icon" className={`h-8 w-8 ${image.isActive ? "text-green-500" : "text-slate-300"}`} onClick={() => handleToggleActive(image.id, image.isActive)}>{image.isActive ? <Eye size={16} /> : <EyeOff size={16} />}</Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-red-500" onClick={() => handleDelete(image.id)}><Trash2 size={16} /></Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}