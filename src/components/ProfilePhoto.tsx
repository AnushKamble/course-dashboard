"use client";

import { useState, useRef, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Camera, X, Check, Loader2 } from "lucide-react";

interface Props {
  avatarUrl: string | null;
  username: string;
  size?: number;
  onUpdate?: (url: string) => void;
}

export default function ProfilePhoto({ avatarUrl, username, size = 40, onUpdate }: Props) {
  const [open, setOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const initials = username.slice(0, 2).toUpperCase();

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const getCroppedBlob = useCallback(
    async (imageSrc: string, pixelCrop: Area): Promise<Blob> => {
      const image = await createImage(imageSrc);
      const canvas = document.createElement("canvas");
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );
      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), "image/png");
      });
    },
    []
  );

  function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = url;
    });
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setUploading(true);
    try {
      const croppedBlob = await getCroppedBlob(imageSrc, croppedAreaPixels);
      const formData = new FormData();
      formData.append("file", croppedBlob, "avatar.png");

      const res = await fetch("/api/avatar", { method: "POST", body: formData });
      const data = await res.json();
      if (data.avatar_url) {
        onUpdate?.(data.avatar_url);
        setOpen(false);
        setImageSrc(null);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative group shrink-0"
        style={{ width: size, height: size }}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={username}
            className="w-full h-full rounded-full object-cover ring-2 ring-white/30 group-hover:ring-emerald-400 transition-all"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white font-extrabold text-sm ring-2 ring-white/30 group-hover:ring-emerald-400 transition-all">
            {initials}
          </div>
        )}
        <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Camera size={size * 0.35} className="text-white" />
        </div>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => !uploading && setOpen(false)}>
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-extrabold text-gray-800">Edit Photo</h3>
              <button onClick={() => { setOpen(false); setImageSrc(null); }} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            {!imageSrc ? (
              <div className="p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Camera size={32} className="text-emerald-500" />
                </div>
                <p className="text-sm text-gray-500 mb-5">Click below to upload a profile photo</p>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="gradient-primary text-white px-6 py-2.5 rounded-full font-bold text-sm hover:shadow-lg transition-all active:scale-95"
                >
                  Choose Photo
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>
            ) : (
              <div>
                <div className="relative w-full h-72 bg-gray-900">
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    showGrid={false}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>
                <div className="px-5 py-3">
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Zoom</label>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
                <div className="flex items-center gap-3 px-5 py-4 border-t border-gray-100">
                  <button
                    onClick={() => { setImageSrc(null); fileRef.current?.click(); }}
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-full text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    Re-choose
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={uploading}
                    className="flex-1 gradient-primary text-white px-4 py-2.5 rounded-full font-bold text-sm hover:shadow-lg transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {uploading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                    {uploading ? "Saving..." : "Save"}
                  </button>
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
