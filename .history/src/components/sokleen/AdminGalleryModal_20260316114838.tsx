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
  GripVertical,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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
      const res = await fetch("/api/gallery");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      if (result.success) {
        setImages(result.data ?? []);
      } else {
        throw new Error(result.error || "Failed to load gallery");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      toast({
        title: "Error",
        description: "Could not load gallery images",
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
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please select an image", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: data });
      if (!res.ok) throw new Error("Upload request failed");

      const result = await res.json();
      if (result.success && result.data?.url) {
        setFormData((prev) => ({
          ...prev,
          [type === "before" ? "beforeImage" : "afterImage"]: result.data.url,
        }));
        toast({
          title: "Success",
          description: `${type.charAt(0).toUpperCase() + type.slice(1)} image uploaded`,
        });
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.beforeImage || !formData.afterImage) {
      toast({
        title: "Missing information",
        description: "Title and both images are required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, order: images.length }),
      });

      if (!res.ok) throw new Error("Save failed");

      const result = await res.json();
      if (result.success) {
        toast({ title: "Success", description: "New gallery item added" });
        setFormData({
          title: "",
          description: "",
          service: "",
          beforeImage: "",
          afterImage: "",
          beforeAlt: "",
          afterAlt: "",
        });
        setShowAddForm(false);
        fetchImages();
      } else {
        throw new Error(result.error || "Unknown error");
      }
    } catch (err) {
      console.error("Submit error:", err);
      toast({
        title: "Error",
        description: "Could not save the new item",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");

      const result = await res.json();
      if (result.success) {
        toast({ title: "Success", description: "Item deleted" });
        fetchImages();
      } else {
        throw new Error(result.error || "Delete failed");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast({ title: "Error", description: "Could not delete item", variant: "destructive" });
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!res.ok) throw new Error("Update failed");

      const result = await res.json();
      if (result.success) {
        toast({
          title: "Success",
          description: `Item ${!currentStatus ? "shown" : "hidden"}`,
        });
        fetchImages();
      } else {
        throw new Error(result.error || "Update failed");
      }
    } catch (err) {
      console.error("Toggle error:", err);
      toast({ title: "Error", description: "Could not update visibility", variant: "destructive" });
    }
  };

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const currentIndex = images.findIndex((img) => img.id === id);
    if (
      (direction === "up" && currentIndex <= 0) ||
      (direction === "down" && currentIndex >= images.length - 1)
    ) {
      return;
    }

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
      toast({ title: "Order updated" });
    } catch (err) {
      console.error("Reorder error:", err);
      toast({ title: "Error", description: "Could not reorder items", variant: "destructive" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={cn(
          "max-w-6xl lg:max-w-7xl",
          "max-h-[92vh] overflow-y-auto",
          "p-0 gap-0",
          "bg-white border border-gray-200 shadow-2xl rounded-xl"
        )}
      >
        {/* Header with close button */}
        

        <div className="px-6 py-8 space-y-10">
          {/* Add New Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg text-gray-800">Add New Transformation</h3>
              <p className="text-sm text-gray-500">Create a new before/after comparison</p>
            </div>
            <Button
              variant={showAddForm ? "outline" : "default"}
              onClick={() => setShowAddForm(!showAddForm)}
              className={cn(
                "min-w-36",
                showAddForm
                  ? "border-red-500 text-red-600 hover:bg-red-50"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              )}
            >
              {showAddForm ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New
                </>
              )}
            </Button>
          </div>

          {/* Add Form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <form
                  onSubmit={handleSubmit}
                  className="bg-gray-50 border rounded-xl p-6 space-y-6 shadow-sm"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-base">
                        Title <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., Kitchen Deep Clean Transformation"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base">Service</Label>
                      <Select
                        value={formData.service ?? ""}
                        onValueChange={(value) => setFormData({ ...formData, service: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select service category" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service.value} value={service.value}>
                              {service.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-base">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description ?? ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the transformation, challenges, or results..."
                      rows={3}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {(["before", "after"] as const).map((type) => (
                      <div key={type} className="space-y-2">
                        <Label className="text-base capitalize">
                          {type} Image <span className="text-red-500">*</span>
                        </Label>

                        {formData[`${type}Image` as keyof typeof formData] ? (
                          <div className="relative rounded-xl overflow-hidden border shadow-sm group">
                            <img
                              src={formData[`${type}Image` as keyof typeof formData] as string}
                              alt={`${type} preview`}
                              className="w-full aspect-video object-cover"
                            />
                            <Button
                              size="icon"
                              variant="destructive"
                              className="absolute top-3 right-3 opacity-90 hover:opacity-100"
                              onClick={() =>
                                setFormData((prev) => ({ ...prev, [`${type}Image`]: "" }))
                              }
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition-colors">
                            <Upload className="w-10 h-10 mb-3 text-gray-400" />
                            <span className="font-medium text-gray-700">Click or drag {type} image here</span>
                            <span className="text-xs text-gray-500 mt-1">PNG, JPG, max 5MB recommended</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(file, type);
                              }}
                            />
                          </label>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      disabled={isLoading || isUploading}
                      className="min-w-44 bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isLoading || isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Transformation"
                      )}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Gallery List */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
              Current Gallery
              <span className="text-gray-500 font-normal text-base">({images.length})</span>
            </h3>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-600">Loading gallery items...</p>
              </div>
            ) : images.length === 0 ? (
              <div className="border border-dashed rounded-xl p-12 text-center bg-gray-50">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h4 className="font-medium text-lg text-gray-700 mb-2">No items yet</h4>
                <p className="text-gray-600">Click "Add New" to start building your gallery</p>
              </div>
            ) : (
              <div className="space-y-3">
                {images.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "group flex items-center gap-4 p-4 bg-white border rounded-xl shadow-sm hover:shadow-md transition-all",
                      !image.isActive && "opacity-70 bg-gray-50 border-gray-200"
                    )}
                  >
                    <GripVertical className="w-5 h-5 text-gray-400 cursor-grab active:cursor-grabbing flex-shrink-0" />

                    <div className="flex gap-3 flex-shrink-0">
                      <div className="w-24 h-16 rounded-lg overflow-hidden border shadow-sm">
                        <img
                          src={image.beforeImage}
                          alt="Before"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-24 h-16 rounded-lg overflow-hidden border shadow-sm">
                        <img
                          src={image.afterImage}
                          alt="After"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900 truncate">{image.title}</h4>
                        {!image.isActive && (
                          <span className="text-xs px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full font-medium">
                            Hidden
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-1 mt-0.5">
                        {image.description || "No description"}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={index === 0}
                        onClick={() => handleReorder(image.id, "up")}
                        className="h-9 w-9"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={index === images.length - 1}
                        onClick={() => handleReorder(image.id, "down")}
                        className="h-9 w-9"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleActive(image.id, image.isActive)}
                        className={cn(
                          "h-9 w-9",
                          image.isActive ? "text-green-600 hover:text-green-700" : "text-gray-500 hover:text-gray-700"
                        )}
                      >
                        {image.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(image.id)}
                        className="h-9 w-9 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}