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
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    service: "",
    beforeImage: "",
    afterImage: "",
    beforeAlt: "",
    afterAlt: "",
  });

  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/gallery");
      const result = await response.json();
      if (result.success) setImages(result.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load gallery images",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (isOpen) fetchImages();
  }, [isOpen, fetchImages]);

  const handleFileUpload = async (file: File, type: "before" | "after") => {
    setIsUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      const result = await response.json();
      if (result.success) {
        setFormData((prev) => ({
          ...prev,
          [type === "before" ? "beforeImage" : "afterImage"]: result.data.url,
        }));
        toast({ title: "Success", description: `${type} image uploaded.` });
      }
    } catch (error) {
      toast({ title: "Upload Failed", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.beforeImage || !formData.afterImage) {
      toast({ title: "Required Fields", description: "Title and both images are required.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, order: images.length }),
      });

      if ((await response.json()).success) {
        toast({ title: "Published", description: "Image added to gallery." });
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
      const response = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if ((await response.json()).success) {
        toast({ title: "Deleted" });
        fetchImages();
      }
    } catch (error) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if ((await response.json()).success) fetchImages();
    } catch (error) {
      toast({ title: "Update failed", variant: "destructive" });
    }
  };

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const currentIndex = images.findIndex((img) => img.id === id);
    if ((direction === "up" && currentIndex === 0) || (direction === "down" && currentIndex === images.length - 1)) return;

    const newImages = [...images];
    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    [newImages[currentIndex], newImages[swapIndex]] = [newImages[swapIndex], newImages[currentIndex]];

    try {
      await Promise.all(newImages.map((img, index) =>
        fetch(`/api/gallery/${img.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: index }),
        })
      ));
      fetchImages();
    } catch (error) {
      toast({ title: "Reorder failed", variant: "destructive" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[92vh] p-0 overflow-hidden bg-white border-none shadow-2xl rounded-[2rem]">
        {/* Header Section */}
        <div className="bg-slate-900 p-8 text-white relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Layers size={120} />
          </div>
          <DialogHeader className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <DialogTitle className="text-3xl font-black tracking-tight">
                Gallery Manager
              </DialogTitle>
            </div>
            <p className="text-slate-400 text-sm font-medium">
              Manage transformations for Sokleen Nigeria Ltd.
            </p>
          </DialogHeader>
        </div>

        <div className="p-8 overflow-y-auto max-h-[calc(92vh-180px)]">
          <div className="space-y-8">
            {/* Action Bar */}
            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 rounded-full bg-blue-500 animate-pulse" />
                <h3 className="font-bold text-slate-800">
                  Current Assets <span className="text-slate-400 ml-1">({images.length})</span>
                </h3>
              </div>
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                className={`rounded-xl px-6 font-bold transition-all ${
                  showAddForm 
                    ? "bg-slate-200 text-slate-600 hover:bg-slate-300" 
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
                }`}
              >
                {showAddForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                {showAddForm ? "Close Form" : "Add New Entry"}
              </Button>
            </div>

            {/* Add Form */}
            <AnimatePresence>
              {showAddForm && (
                <motion.form
                  initial={{ opacity: 0, scale: 0.98, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -10 }}
                  onSubmit={handleSubmit}
                  className="bg-white rounded-3xl border-2 border-slate-100 p-8 shadow-xl space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-bold ml-1">Project Title</Label>
                        <Input
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="e.g., Luxury Penthouse Deep Clean"
                          className="h-12 rounded-xl border-slate-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-bold ml-1">Service Category</Label>
                        <Select value={formData.service} onValueChange={(v) => setFormData({ ...formData, service: v })}>
                          <SelectTrigger className="h-12 rounded-xl border-slate-200"><SelectValue placeholder="Select Service" /></SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {services.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-bold ml-1">Description</Label>
                        <Textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Explain the results..."
                          className="rounded-xl border-slate-200 min-h-[110px]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {["before", "after"].map((type) => (
                        <div key={type} className="space-y-2">
                          <Label className="text-slate-700 font-bold capitalize">{type}</Label>
                          <div className="relative group aspect-[4/5] rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50 flex items-center justify-center">
                            {formData[`${type}Image` as keyof typeof formData] ? (
                              <>
                                <img src={formData[`${type}Image` as keyof typeof formData]} className="absolute inset-0 w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Button size="icon" variant="destructive" className="rounded-full" onClick={() => setFormData({ ...formData, [`${type}Image`]: "" })}><X size={16}/></Button>
                                </div>
                              </>
                            ) : (
                              <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-4">
                                <Upload className="w-8 h-8 text-blue-500 mb-2" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Upload {type}</span>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleFileUpload(file, type as any);
                                }} />
                              </label>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button type="submit" disabled={isLoading || isUploading} className="w-full bg-slate-900 hover:bg-black text-white h-14 rounded-2xl font-black text-lg shadow-xl">
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "PUBLISH TO GALLERY"}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* List */}
            <div className="space-y-4 pb-10">
              {isLoading && images.length === 0 ? (
                <div className="py-20 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto text-blue-500" /></div>
              ) : (
                images.map((image, index) => (
                  <motion.div
                    key={image.id}
                    layout
                    className={`group flex items-center gap-6 p-5 bg-white rounded-3xl border-2 transition-all hover:shadow-xl ${image.isActive ? "border-slate-50" : "border-red-50 bg-red-50/20"}`}
                  >
                    <div className="relative flex-shrink-0 w-44 h-28 hidden sm:flex gap-1 bg-slate-200 p-1 rounded-2xl">
                      <img src={image.beforeImage} className="w-1/2 h-full object-cover rounded-l-xl" />
                      <img src={image.afterImage} className="w-1/2 h-full object-cover rounded-r-xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-md">{image.service}</span>
                      <h4 className="font-black text-slate-900 truncate text-lg uppercase italic">{image.title}</h4>
                      <p className="text-sm text-slate-500 truncate opacity-60 italic">{image.description || "No description."}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                      <div className="flex flex-col gap-1 border-r border-slate-200 pr-2 mr-2">
                        <button onClick={() => handleReorder(image.id, "up")} disabled={index === 0} className="hover:text-blue-600 disabled:opacity-20"><ArrowUp size={14} /></button>
                        <button onClick={() => handleReorder(image.id, "down")} disabled={index === images.length - 1} className="hover:text-blue-600 disabled:opacity-20"><ArrowDown size={14} /></button>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleToggleActive(image.id, image.isActive)} className={image.isActive ? "text-blue-600 bg-blue-50" : "text-slate-400"}>
                        {image.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(image.id)} className="text-slate-300 hover:text-red-600"><Trash2 size={18} /></Button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}