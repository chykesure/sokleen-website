"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Button,
  Input,
  Textarea,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui"; // ← keep your shadcn inputs etc.
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

// ────────────────────────────────────────────────

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

// ────────────────────────────────────────────────

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

  // Close on Esc
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/gallery");
      const result = await res.json();
      if (result.success) setImages(result.data ?? []);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Could not load images", variant: "destructive" });
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
      const result = await res.json();

      if (result.success) {
        setFormData((prev) => ({
          ...prev,
          [type === "before" ? "beforeImage" : "afterImage"]: result.data.url,
        }));
        toast({ title: "Uploaded", description: `${type} image ready` });
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (err) {
      toast({ title: "Upload failed", description: String(err), variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.beforeImage || !formData.afterImage) {
      toast({
        title: "Missing fields",
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
      const result = await res.json();

      if (result.success) {
        toast({ title: "Added", description: "New gallery item saved" });
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
      } else throw new Error();
    } catch {
      toast({ title: "Error", description: "Could not save image", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this before/after item?")) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        toast({ title: "Deleted" });
        fetchImages();
      }
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !current }),
      });
      if ((await res.json()).success) {
        toast({ title: `Now ${!current ? "visible" : "hidden"}` });
        fetchImages();
      }
    } catch {
      toast({ title: "Update failed", variant: "destructive" });
    }
  };

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const idx = images.findIndex((i) => i.id === id);
    if ((direction === "up" && idx === 0) || (direction === "down" && idx === images.length - 1)) return;

    const newOrder = [...images];
    const target = direction === "up" ? idx - 1 : idx + 1;
    [newOrder[idx], newOrder[target]] = [newOrder[target], newOrder[idx]];

    try {
      await Promise.all(
        newOrder.map((img, i) =>
          fetch(`/api/gallery/${img.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order: i }),
          })
        )
      );
      fetchImages();
    } catch {
      toast({ title: "Reorder failed", variant: "destructive" });
    }
  };

  if (!isOpen) return null;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose} // ← click outside closes
    >
      {/* Modal content */}
      <div
        className={cn(
          "relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl",
          "max-h-[94vh] overflow-y-auto",
          "border border-gray-200"
        )}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Before & After Gallery</h2>
            <p className="text-sm text-gray-500 mt-1">Manage your transformation showcase</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close modal"
          >
            <X className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        {/* Main content */}
        <div className="p-6 space-y-8">
          {/* ADD TOGGLE */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">Add New Entry</h3>
              <p className="text-sm text-gray-500">Create a new before/after comparison</p>
            </div>
            <Button
              variant={showAddForm ? "outline" : "default"}
              onClick={() => setShowAddForm(!showAddForm)}
              className={cn(
                "min-w-32",
                showAddForm
                  ? "border-red-500 text-red-600 hover:bg-red-50"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              )}
            >
              {showAddForm ? (
                <>
                  <X className="w-4 h-4 mr-2" /> Cancel
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" /> New Item
                </>
              )}
            </Button>
          </div>

          {/* ADD FORM */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <form
                  onSubmit={handleSubmit}
                  className="bg-gray-50 border rounded-xl p-6 space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-base">Title *</Label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Kitchen Deep Clean Transformation"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base">Service</Label>
                      <Select
                        value={formData.service ?? ""}
                        onValueChange={(v) => setFormData({ ...formData, service: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose category" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base">Description</Label>
                    <Textarea
                      value={formData.description ?? ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="What was the challenge and result?..."
                      rows={3}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {(["before", "after"] as const).map((type) => (
                      <div key={type} className="space-y-2">
                        <Label className="text-base capitalize">{type} Image *</Label>

                        {formData[`${type}Image` as keyof typeof formData] ? (
                          <div className="relative rounded-xl overflow-hidden border shadow-sm group">
                            <img
                              src={formData[`${type}Image` as keyof typeof formData] as string}
                              alt={type}
                              className="aspect-video w-full object-cover"
                            />
                            <Button
                              size="icon"
                              variant="destructive"
                              className="absolute top-3 right-3"
                              onClick={() =>
                                setFormData((prev) => ({ ...prev, [`${type}Image`]: "" }))
                              }
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all">
                            <div className="flex flex-col items-center py-8 text-gray-500">
                              <Upload className="w-10 h-10 mb-3 text-gray-400" />
                              <span className="font-medium">Click or drag {type} image here</span>
                              <span className="text-xs mt-1">PNG, JPG • max 5MB recommended</span>
                            </div>
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
                      className="min-w-40 bg-green-600 hover:bg-green-700"
                    >
                      {isLoading || isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving…
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

          {/* GALLERY LIST */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
              Your Gallery
              <span className="text-gray-500 font-normal text-base">({images.length})</span>
            </h3>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-600" />
                <p>Loading gallery items...</p>
              </div>
            ) : images.length === 0 ? (
              <div className="border border-dashed rounded-xl p-12 text-center text-gray-500 bg-gray-50">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h4 className="font-medium text-lg text-gray-700 mb-1">No transformations yet</h4>
                <p className="text-sm">Click "New Item" to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {images.map((img, idx) => (
                  <motion.div
                    key={img.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className={cn(
                      "group flex items-center gap-4 p-4 bg-white border rounded-xl shadow-sm hover:shadow-md transition-all",
                      !img.isActive && "opacity-70 bg-gray-50 border-gray-200"
                    )}
                  >
                    <GripVertical className="w-5 h-5 text-gray-400 cursor-grab active:cursor-grabbing" />

                    <div className="flex gap-3 flex-shrink-0">
                      <div className="w-24 h-16 rounded-lg overflow-hidden border shadow-sm">
                        <img src={img.beforeImage} alt="before" className="w-full h-full object-cover" />
                      </div>
                      <div className="w-24 h-16 rounded-lg overflow-hidden border shadow-sm">
                        <img src={img.afterImage} alt="after" className="w-full h-full object-cover" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900 truncate">{img.title}</h4>
                        {!img.isActive && (
                          <span className="text-xs px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full font-medium">
                            Hidden
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-1 mt-0.5">
                        {img.description || "—"}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={idx === 0}
                        onClick={() => handleReorder(img.id, "up")}
                        className="h-9 w-9"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={idx === images.length - 1}
                        onClick={() => handleReorder(img.id, "down")}
                        className="h-9 w-9"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleActive(img.id, img.isActive)}
                        className={cn(
                          "h-9 w-9",
                          img.isActive ? "text-green-600 hover:text-green-700" : "text-gray-500 hover:text-gray-700"
                        )}
                      >
                        {img.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(img.id)}
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
      </div>
    </div>
  );
}