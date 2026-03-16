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
      if (result.success) {
        // Sort by order before setting state
        const sortedImages = (result.data as GalleryImage[]).sort((a, b) => a.order - b.order);
        setImages(sortedImages);
      }
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
    if (isOpen) {
      fetchImages();
    }
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
        toast({ 
            title: "Upload Successful", 
            description: `${type.charAt(0).toUpperCase() + type.slice(1)} image is ready.` 
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({ 
          title: "Upload Failed", 
          description: "Check your connection and try again.",
          variant: "destructive" 
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.beforeImage || !formData.afterImage) {
      toast({ 
          title: "Missing Fields", 
          description: "Please provide a title and upload both images.", 
          variant: "destructive" 
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            ...formData, 
            order: images.length 
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast({ title: "Success", description: "Project added to your gallery." });
        setFormData({ title: "", description: "", service: "", beforeImage: "", afterImage: "", beforeAlt: "", afterAlt: "" });
        setShowAddForm(false);
        fetchImages();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({ title: "Save Error", description: "Could not save entry.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transformation?")) return;
    try {
      const response = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      const result = await response.json();
      if (result.success) {
        toast({ title: "Deleted Successfully" });
        fetchImages();
      }
    } catch (error) {
      toast({ title: "Delete Failed", variant: "destructive" });
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      const result = await response.json();
      if (result.success) {
        toast({ title: `Project ${!currentStatus ? 'Visible' : 'Hidden'}` });
        fetchImages();
      }
    } catch (error) {
      toast({ title: "Status Update Failed", variant: "destructive" });
    }
  };

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const currentIndex = images.findIndex((img) => img.id === id);
    if ((direction === "up" && currentIndex === 0) || (direction === "down" && currentIndex === images.length - 1)) return;

    const newImages = [...images];
    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    [newImages[currentIndex], newImages[swapIndex]] = [newImages[swapIndex], newImages[currentIndex]];

    // Optimistically update UI
    setImages(newImages);

    try {
      await Promise.all(newImages.map((img, index) =>
        fetch(`/api/gallery/${img.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: index }),
        })
      ));
      // Refresh to ensure server state is captured
      fetchImages();
    } catch (error) {
      toast({ title: "Reordering failed", variant: "destructive" });
      fetchImages(); // Revert on failure
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if(!open) onClose(); }}>
      <DialogContent className="max-w-5xl max-h-[92vh] p-0 overflow-hidden bg-white border-none shadow-2xl rounded-[2rem]">
        {/* Header Section */}
        <div className="bg-slate-900 p-8 text-white relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Layers size={120} />
          </div>
          <DialogHeader className="relative z-10">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <DialogTitle className="text-3xl font-black tracking-tight">
                        Gallery Manager
                    </DialogTitle>
                </div>
                {/* Manual Close Button since we have a custom header */}
                <button 
                    onClick={onClose} 
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                >
                    <X size={24} />
                </button>
            </div>
            <p className="text-slate-400 text-sm font-medium mt-2">
              Manage your before & after showcase for the public website.
            </p>
          </DialogHeader>
        </div>

        <div className="p-8 overflow-y-auto max-h-[calc(92vh-180px)]">
          <div className="space-y-8">
            {/* Top Action Bar */}
            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 rounded-full bg-blue-500 animate-pulse" />
                <h3 className="font-bold text-slate-800">
                  Total Projects <span className="text-slate-400 ml-1">({images.length})</span>
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
                {showAddForm ? "Cancel" : "Add Transformation"}
              </Button>
            </div>

            {/* Add New Entry Form */}
            <AnimatePresence>
              {showAddForm && (
                <motion.form
                  initial={{ opacity: 0, scale: 0.98, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -10 }}
                  onSubmit={handleSubmit}
                  className="bg-white rounded-3xl border-2 border-slate-100 p-8 shadow-xl space-y-6 relative"
                >
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Side: Info */}
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-bold ml-1">Project Title *</Label>
                        <Input
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="e.g., Post-Construction Kitchen Clean"
                          className="h-12 rounded-xl border-slate-200 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-bold ml-1">Service Type</Label>
                        <Select 
                            value={formData.service} 
                            onValueChange={(v) => setFormData({ ...formData, service: v })}
                        >
                          <SelectTrigger className="h-12 rounded-xl border-slate-200">
                            <SelectValue placeholder="Which service was this?" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {services.map((s) => (
                                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-bold ml-1">Transformation Details</Label>
                        <Textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Describe the challenges or specific work done..."
                          className="rounded-xl border-slate-200 min-h-[110px]"
                        />
                      </div>
                    </div>

                    {/* Right Side: Media */}
                    <div className="grid grid-cols-2 gap-4">
                      {["before", "after"].map((type) => (
                        <div key={type} className="space-y-2">
                          <Label className="text-slate-700 font-bold capitalize">{type} Snapshot *</Label>
                          <div className="relative group aspect-[4/5] rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50 transition-all flex items-center justify-center">
                            {formData[`${type}Image` as keyof typeof formData] ? (
                              <>
                                <img 
                                    src={formData[`${type}Image` as keyof typeof formData]} 
                                    className="absolute inset-0 w-full h-full object-cover" 
                                    alt={type}
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Button 
                                    type="button"
                                    size="icon" 
                                    variant="destructive" 
                                    className="rounded-full" 
                                    onClick={() => setFormData({ ...formData, [`${type}Image`]: "" })}
                                  >
                                    <X size={16}/>
                                  </Button>
                                </div>
                              </>
                            ) : (
                              <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-4">
                                {isUploading ? (
                                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                                ) : (
                                    <>
                                        <Upload className="w-8 h-8 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                                            Upload {type}
                                        </span>
                                    </>
                                )}
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*" 
                                    disabled={isUploading}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleFileUpload(file, type as any);
                                    }} 
                                />
                              </label>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isLoading || isUploading} 
                    className="w-full bg-slate-900 hover:bg-black text-white h-14 rounded-2xl font-black text-lg shadow-xl active:scale-[0.98] transition-transform"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "PUBLISH TO GALLERY"}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Gallery List */}
            <div className="space-y-4 pb-12">
              <h3 className="font-bold text-slate-900 text-lg ml-1">Portfolio Entries</h3>
              {isLoading && images.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                    <p className="text-slate-400 font-medium tracking-tight">Syncing with database...</p>
                </div>
              ) : images.length === 0 ? (
                <div className="text-center py-24 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center">
                   <ImageIcon className="w-16 h-16 text-slate-200 mb-4" />
                   <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No entries found. Add your first cleaning success!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {images.map((image, index) => (
                    <motion.div
                      key={image.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`group flex items-center gap-6 p-5 bg-white rounded-3xl border-2 transition-all hover:shadow-xl ${
                          image.isActive ? "border-slate-50 shadow-sm" : "border-red-50 bg-red-50/20 grayscale"
                      }`}
                    >
                      {/* Before/After Split Preview */}
                      <div className="relative flex-shrink-0 w-44 h-28 hidden sm:flex gap-1 bg-slate-100 p-1 rounded-2xl overflow-hidden shadow-inner">
                        <img src={image.beforeImage} className="w-1/2 h-full object-cover rounded-l-xl" alt="Before" />
                        <img src={image.afterImage} className="w-1/2 h-full object-cover rounded-r-xl" alt="After" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                      </div>

                      {/* Info & Metadata */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-black uppercase rounded-md tracking-wider">
                                {image.service?.replace('-', ' ') || 'General Cleaning'}
                            </span>
                            {!image.isActive && (
                                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[9px] font-black uppercase rounded-md tracking-wider">
                                    Hidden
                                </span>
                            )}
                        </div>
                        <h4 className="font-black text-slate-900 truncate text-lg uppercase italic tracking-tight">
                            {image.title}
                        </h4>
                        <p className="text-sm text-slate-500 truncate opacity-70 italic font-medium">
                            {image.description || "No project notes available."}
                        </p>
                      </div>

                      {/* Controls Area */}
                      <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                        {/* Order Controls */}
                        <div className="flex flex-col gap-1 border-r border-slate-200 pr-2 mr-2">
                          <button 
                            onClick={() => handleReorder(image.id, "up")} 
                            disabled={index === 0} 
                            className="p-1 hover:text-blue-600 disabled:opacity-20 transition-colors"
                            title="Move Up"
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button 
                            onClick={() => handleReorder(image.id, "down")} 
                            disabled={index === images.length - 1} 
                            className="p-1 hover:text-blue-600 disabled:opacity-20 transition-colors"
                            title="Move Down"
                          >
                            <ArrowDown size={16} />
                          </button>
                        </div>

                        {/* Visibility Toggle */}
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleToggleActive(image.id, image.isActive)} 
                            className={`rounded-xl h-10 w-10 transition-all ${
                                image.isActive ? "text-blue-600 bg-blue-100/50 hover:bg-blue-100" : "text-slate-400 bg-slate-100 hover:bg-slate-200"
                            }`}
                            title={image.isActive ? "Hide Project" : "Show Project"}
                        >
                          {image.isActive ? <Eye size={20} /> : <EyeOff size={20} />}
                        </Button>

                        {/* Delete Button */}
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(image.id)} 
                            className="rounded-xl h-10 w-10 text-slate-300 hover:text-red-600 hover:bg-red-50 transition-all"
                            title="Delete Permanently"
                        >
                          <Trash2 size={20} />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}