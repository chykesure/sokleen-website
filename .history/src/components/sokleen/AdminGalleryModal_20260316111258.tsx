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
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Sparkles,
  Layers,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [isUploading, setIsUploading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    service: "",
    beforeImage: "",
    afterImage: "",
  });

  // --- Logic: Fetching ---
  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/gallery");
      const result = await response.json();
      if (result.success) {
        setImages(result.data.sort((a: any, b: any) => a.order - b.order));
      }
    } catch (error) {
      toast({ title: "Fetch Error", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (isOpen) fetchImages();
  }, [isOpen, fetchImages]);

  // --- Logic: Uploading ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, side: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const result = await res.json();
      if (result.success) {
        setFormData(prev => ({ ...prev, [`${side}Image`]: result.data.url }));
        toast({ title: `${side.toUpperCase()} image uploaded` });
      }
    } catch (error) {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  // --- Logic: Saving ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.beforeImage || !formData.afterImage) {
      toast({ title: "Images Required", description: "Upload both photos.", variant: "destructive" });
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
        toast({ title: "Published!" });
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

  // --- Logic: Delete/Toggle ---
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    try {
      await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      fetchImages();
    } catch (error) {
      toast({ title: "Delete failed" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* max-w-5xl prevents the "shrunken" look. 
         w-[95vw] ensures it fits mobile screens too.
      */}
      <DialogContent className="max-w-5xl w-[95vw] max-h-[92vh] p-0 overflow-hidden bg-white border-none shadow-2xl rounded-[2rem]">
        
        {/* PREMIUM DARK HEADER */}
        <div className="bg-slate-900 p-8 text-white relative shrink-0">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Layers size={140} />
          </div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-3xl font-black tracking-tight uppercase italic">
                  Gallery Control
                </DialogTitle>
                <p className="text-slate-400 text-sm font-medium">Sokleen Transformation Manager</p>
              </div>
            </div>

            {/* EFFECTIVE CLOSE BUTTON */}
            <button 
              onClick={onClose}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/10"
            >
              <X className="w-6 h-6 text-slate-300" />
            </button>
          </div>
        </div>

        {/* CONTENT SECTION */}
        <div className="p-8 overflow-y-auto max-h-[calc(92vh-150px)]">
          <div className="space-y-8">
            
            {/* ACTION BAR */}
            <div className="flex justify-between items-center bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 uppercase tracking-tighter">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                Live Items ({images.length})
              </h3>
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                className={`rounded-xl px-6 font-black ${showAddForm ? "bg-slate-200 text-slate-600" : "bg-blue-600 text-white"}`}
              >
                {showAddForm ? "CANCEL" : "ADD NEW"}
              </Button>
            </div>

            {/* FORM SECTION */}
            <AnimatePresence>
              {showAddForm && (
                <motion.form
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onSubmit={handleSubmit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white border-2 border-slate-100 p-8 rounded-[2rem] shadow-xl"
                >
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className="font-bold ml-1">Project Title</Label>
                      <Input 
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        placeholder="e.g. Commercial Floor Scrubbing" 
                        className="h-12 rounded-xl"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold ml-1">Service Type</Label>
                      <Select onValueChange={v => setFormData({...formData, service: v})}>
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="deep-cleaning">Deep Cleaning</SelectItem>
                          <SelectItem value="fumigation">Fumigation</SelectItem>
                          <SelectItem value="post-construction">Post-Construction</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold ml-1">Summary</Label>
                      <Textarea 
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        placeholder="Details of the job..." 
                        className="rounded-xl min-h-[100px]"
                      />
                    </div>
                    <Button disabled={isLoading || isUploading} className="w-full h-14 bg-slate-900 text-white font-black rounded-xl">
                      {isLoading ? <Loader2 className="animate-spin" /> : "SAVE WORK"}
                    </Button>
                  </div>

                  {/* IMAGE UPLOADS */}
                  <div className="grid grid-cols-2 gap-4">
                    {['before', 'after'].map((side) => (
                      <div key={side} className="space-y-2">
                        <Label className="font-bold capitalize">{side} Photo</Label>
                        <div className="relative aspect-[3/4] rounded-2xl border-2 border-dashed bg-slate-50 flex items-center justify-center overflow-hidden">
                          {formData[`${side}Image` as keyof typeof formData] ? (
                            <img src={formData[`${side}Image` as keyof typeof formData]} className="w-full h-full object-cover" />
                          ) : (
                            <label className="cursor-pointer flex flex-col items-center p-4">
                              <Upload className="text-blue-500 mb-2" />
                              <span className="text-[10px] font-black text-slate-400">UPLOAD</span>
                              <input type="file" className="hidden" onChange={e => handleImageUpload(e, side as any)} />
                            </label>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* LIST SECTION */}
            <div className="grid grid-cols-1 gap-4 pb-10">
              {images.map((img) => (
                <div key={img.id} className="flex items-center gap-6 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex gap-1 w-32 h-20 bg-slate-100 p-1 rounded-xl flex-shrink-0">
                    <img src={img.beforeImage} className="w-1/2 h-full object-cover rounded-l-lg" />
                    <img src={img.afterImage} className="w-1/2 h-full object-cover rounded-r-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-slate-900 truncate uppercase italic leading-none mb-1">{img.title}</h4>
                    <p className="text-xs text-slate-500 font-bold uppercase opacity-50">{img.service}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="text-slate-300 hover:text-red-500" onClick={() => handleDelete(img.id)}>
                      <Trash2 size={20} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}