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
        setImages(result.data);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
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
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        setFormData((prev) => ({
          ...prev,
          [type === "before" ? "beforeImage" : "afterImage"]: result.data.url,
        }));
        toast({
          title: "Success",
          description: `${type === "before" ? "Before" : "After"} image uploaded successfully`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.beforeImage || !formData.afterImage) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, order: images.length }),
      });

      const result = await response.json();
      if (result.success) {
        toast({ title: "Success", description: "Gallery image added" });
        setFormData({
          title: "", description: "", service: "",
          beforeImage: "", afterImage: "", beforeAlt: "", afterAlt: ""
        });
        setShowAddForm(false);
        fetchImages();
      }
    } catch (error) {
      toast({ title: "Error", description: "Save failed", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const response = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if ((await response.json()).success) {
        toast({ title: "Deleted", description: "Image removed" });
        fetchImages();
      }
    } catch (error) {
      toast({ title: "Error", description: "Delete failed", variant: "destructive" });
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/gallery/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      fetchImages();
    } catch (error) {
      toast({ title: "Error", description: "Update failed", variant: "destructive" });
    }
  };

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const currentIndex = images.findIndex((img) => img.id === id);
    if ((direction === "up" && currentIndex === 0) || (direction === "down" && currentIndex === images.length - 1)) return;

    const newImages = [...images];
    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    [newImages[currentIndex], newImages[swapIndex]] = [newImages[swapIndex], newImages[currentIndex]];

    try {
      await Promise.all(
        newImages.map((img, index) =>
          fetch(`/api/gallery/${img.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order: index }),
          })
        )
      );
      fetchImages();
    } catch (error) {
      toast({ title: "Error", description: "Reorder failed", variant: "destructive" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-white p-0">
        {/* CUSTOM HEADER WITH WORKING CLOSE BUTTON */}
        <div className="flex items-center justify-between p-6 border-b">
          <DialogHeader className="p-0">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Gallery Management
            </DialogTitle>
          </DialogHeader>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Manage your before & after gallery images
            </p>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-900 hover:bg-blue-950 text-white"
            >
              {showAddForm ? <><X className="w-4 h-4 mr-2" /> Cancel</> : <><Plus className="w-4 h-4 mr-2" /> Add New</>}
            </Button>
          </div>

          <AnimatePresence>
            {showAddForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleSubmit}
                className="bg-gray-50 rounded-xl p-6 space-y-4 border border-gray-200"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="bg-white" />
                  </div>
                  <div>
                    <Label htmlFor="service">Service</Label>
                    <Select value={formData.service} onValueChange={(v) => setFormData({ ...formData, service: v })}>
                      <SelectTrigger className="bg-white"><SelectValue placeholder="Select service" /></SelectTrigger>
                      <SelectContent>
                        {services.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                   {/* Before Upload */}
                   <div className="space-y-2">
                    <Label>Before Image *</Label>
                    {formData.beforeImage ? (
                      <div className="relative aspect-video rounded-lg overflow-hidden border">
                        <img src={formData.beforeImage} className="w-full h-full object-cover" alt="Before" />
                        <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => setFormData({ ...formData, beforeImage: "" })}><X className="w-3 h-3" /></Button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100">
                        <Upload className="w-8 h-8 text-gray-400" />
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "before")} />
                      </label>
                    )}
                   </div>
                   {/* After Upload */}
                   <div className="space-y-2">
                    <Label>After Image *</Label>
                    {formData.afterImage ? (
                      <div className="relative aspect-video rounded-lg overflow-hidden border">
                        <img src={formData.afterImage} className="w-full h-full object-cover" alt="After" />
                        <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => setFormData({ ...formData, afterImage: "" })}><X className="w-3 h-3" /></Button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100">
                        <Upload className="w-8 h-8 text-gray-400" />
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "after")} />
                      </label>
                    )}
                   </div>
                </div>

                <Button type="submit" disabled={isLoading || isUploading} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold">
                  {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Save Gallery Entry"}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Current Images ({images.length})</h3>
            {isLoading && !images.length ? (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>
            ) : (
              <div className="space-y-3 pb-6">
                {images.map((image, index) => (
                  <div key={image.id} className="flex items-center gap-4 p-3 bg-white border rounded-xl shadow-sm">
                    <div className="flex gap-1">
                      <img src={image.beforeImage} className="w-16 h-12 object-cover rounded border" alt="B" />
                      <img src={image.afterImage} className="w-16 h-12 object-cover rounded border" alt="A" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{image.title}</p>
                      <p className="text-xs text-gray-500 capitalize">{image.service?.replace('-', ' ')}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleReorder(image.id, "up")} disabled={index === 0}><ArrowUp className="w-4 h-4" /></Button>
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleReorder(image.id, "down")} disabled={index === images.length - 1}><ArrowDown className="w-4 h-4" /></Button>
                      <Button variant="outline" size="icon" className={`h-8 w-8 ${image.isActive ? "text-green-600" : "text-gray-400"}`} onClick={() => handleToggleActive(image.id, image.isActive)}>{image.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}</Button>
                      <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(image.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}