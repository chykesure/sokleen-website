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

  // Form state
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
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Upload error:", error);
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
        description: "Please fill in all required fields and upload both images",
        variant: "destructive",
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
          order: images.length,
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: "Success",
          description: "Gallery image added successfully",
        });
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
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Error",
        description: "Failed to add gallery image",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: "Success",
          description: "Image deleted successfully",
        });
        fetchImages();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
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
        toast({
          title: "Success",
          description: `Image ${!currentStatus ? "activated" : "deactivated"}`,
        });
        fetchImages();
      }
    } catch (error) {
      console.error("Toggle error:", error);
      toast({
        title: "Error",
        description: "Failed to update image status",
        variant: "destructive",
      });
    }
  };

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const currentIndex = images.findIndex((img) => img.id === id);
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === images.length - 1)
    ) {
      return;
    }

    const newImages = [...images];
    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    [newImages[currentIndex], newImages[swapIndex]] = [
      newImages[swapIndex],
      newImages[currentIndex],
    ];

    // Update order in database
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
      console.error("Reorder error:", error);
      toast({
        title: "Error",
        description: "Failed to reorder images",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Gallery Management
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add New Button */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Manage your before & after gallery images
            </p>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-sokleen-dark-blue hover:bg-sokleen-deep-blue"
            >
              {showAddForm ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Image
                </>
              )}
            </Button>
          </div>

          {/* Add Form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleSubmit}
                className="bg-gray-50 rounded-xl p-6 space-y-4"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="e.g., Living Room Transformation"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="service">Service</Label>
                    <Select
                      value={formData.service}
                      onValueChange={(value) =>
                        setFormData({ ...formData, service: value })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a service" />
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

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe the transformation..."
                    className="mt-1"
                    rows={2}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Before Image Upload */}
                  <div>
                    <Label>Before Image *</Label>
                    <div className="mt-1">
                      {formData.beforeImage ? (
                        <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200">
                          <img
                            src={formData.beforeImage}
                            alt="Before"
                            className="w-full h-full object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() =>
                              setFormData({ ...formData, beforeImage: "" })
                            }
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-sokleen-dark-blue transition-colors">
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">
                            Click to upload before image
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(file, "before");
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* After Image Upload */}
                  <div>
                    <Label>After Image *</Label>
                    <div className="mt-1">
                      {formData.afterImage ? (
                        <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200">
                          <img
                            src={formData.afterImage}
                            alt="After"
                            className="w-full h-full object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() =>
                              setFormData({ ...formData, afterImage: "" })
                            }
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-sokleen-dark-blue transition-colors">
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">
                            Click to upload after image
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(file, "after");
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || isUploading}
                  className="w-full bg-sokleen-yellow hover:bg-sokleen-yellow/90 text-gray-900 font-semibold"
                >
                  {isLoading || isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Image"
                  )}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Images List */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">
              Current Images ({images.length})
            </h3>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-sokleen-dark-blue" />
              </div>
            ) : images.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No images yet. Add your first one!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {images.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center gap-4 p-4 bg-gray-50 rounded-xl border ${
                      image.isActive ? "border-gray-200" : "border-red-200 bg-red-50/50"
                    }`}
                  >
                    {/* Thumbnails */}
                    <div className="flex gap-2 flex-shrink-0">
                      <div className="w-20 h-14 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={image.beforeImage}
                          alt="Before"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-20 h-14 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={image.afterImage}
                          alt="After"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {image.title}
                      </h4>
                      <p className="text-sm text-gray-500 truncate">
                        {image.description || "No description"}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleReorder(image.id, "up")}
                        disabled={index === 0}
                        className="h-8 w-8"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleReorder(image.id, "down")}
                        disabled={index === images.length - 1}
                        className="h-8 w-8"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleToggleActive(image.id, image.isActive)}
                        className={`h-8 w-8 ${
                          image.isActive
                            ? "text-green-600 hover:text-green-700"
                            : "text-red-600 hover:text-red-700"
                        }`}
                      >
                        {image.isActive ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(image.id)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="w-4 h-4" />
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
