'use client';

import { useState, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  Film,
  Check,
  Copy,
  X,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import Image from 'next/image';

export default function MediaUploader({
  value = '',
  onChange,
  folder = 'vitasta/products',
  resourceType = 'auto', // 'image' | 'video' | 'auto'
  label = 'Upload Media Asset',
  description = 'Drag & drop image or loom inspection video, or click to browse',
  compact = false,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(value || '');
  const fileInputRef = useRef(null);

  // Sync if outer value changes
  if (value && value !== previewUrl && !uploading) {
    setPreviewUrl(value);
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    // Validate size (e.g. max 50MB for video, 10MB for image)
    const isVideo = file.type.startsWith('video/');
    const maxSize = isVideo ? 60 * 1024 * 1024 : 15 * 1024 * 1024;

    if (file.size > maxSize) {
      setError(`File size exceeds limit (${isVideo ? '60MB for videos' : '15MB for images'}).`);
      return;
    }

    setError(null);
    setUploading(true);
    setProgress(5);
    setStatusText('Requesting signed upload signature...');

    // Temporary local preview
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    try {
      // 1. Get signed parameters from our server endpoint
      const signRes = await fetch('/api/admin/cloudinary-sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder }),
      });

      const signData = await signRes.json();

      if (!signData.success) {
        throw new Error(signData.error || 'Failed to authorize Cloudinary signature.');
      }

      setProgress(25);
      setStatusText('Directly uploading to Sovereign Cloudinary CDN...');

      // 2. Perform signed direct upload to Cloudinary Edge using XMLHttpRequest to track progress
      const targetResourceType = isVideo ? 'video' : 'image';
      const uploadEndpoint = `https://api.cloudinary.com/v1_1/${signData.cloudName}/${targetResourceType}/upload`;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', signData.apiKey);
      formData.append('timestamp', signData.timestamp);
      formData.append('signature', signData.signature);
      formData.append('folder', signData.folder);

      const xhr = new XMLHttpRequest();

      const uploadPromise = new Promise((resolve, reject) => {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round(25 + (event.loaded / event.total) * 65);
            setProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const res = JSON.parse(xhr.responseText);
              resolve(res);
            } catch (err) {
              reject(new Error('Invalid Cloudinary response JSON.'));
            }
          } else {
            // Fallback: If direct client-to-Cloudinary upload failed (e.g. CORS/network), try direct server route
            console.warn('Direct upload failed, attempting server proxy fallback...', xhr.statusText);
            resolve(null);
          }
        };

        xhr.onerror = () => {
          console.warn('XHR network error, trying server proxy fallback...');
          resolve(null);
        };

        xhr.open('POST', uploadEndpoint);
        xhr.send(formData);
      });

      let cloudResult = await uploadPromise;

      // 3. If direct client upload had an issue, fallback to /api/admin/upload
      if (!cloudResult) {
        setStatusText('Falling back to Atelier Server Pipeline...');
        const fallbackForm = new FormData();
        fallbackForm.append('file', file);
        fallbackForm.append('folder', folder);
        fallbackForm.append('resourceType', targetResourceType);

        const serverRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: fallbackForm,
        });

        const serverData = await serverRes.json();
        if (!serverData.success) {
          throw new Error(serverData.error || 'Server upload failed.');
        }
        cloudResult = serverData;
      }

      setProgress(100);
      setStatusText('Asset successfully secured on CDN!');

      const cdnUrl = cloudResult.secure_url;
      setPreviewUrl(cdnUrl);

      if (onChange) {
        onChange(cdnUrl, cloudResult);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed. Please try again or paste URL manually.');
    } finally {
      setUploading(false);
    }
  };

  const handleCopyUrl = () => {
    if (!previewUrl) return;
    navigator.clipboard.writeText(previewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setPreviewUrl('');
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onChange) onChange('');
  };

  const isCurrentVideo =
    previewUrl &&
    (previewUrl.endsWith('.mp4') ||
      previewUrl.endsWith('.webm') ||
      previewUrl.includes('/video/upload/') ||
      previewUrl.startsWith('data:video'));

  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <label className="text-neutral-800 font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowManualInput(!showManualInput)}
          className="text-[11px] text-[#0B3B60] hover:underline font-medium"
        >
          {showManualInput ? 'Switch to Drag & Drop' : 'Enter CDN URL Manually'}
        </button>
      </div>

      {showManualInput ? (
        <div className="space-y-1.5">
          <div className="relative">
            <input
              type="text"
              value={previewUrl}
              onChange={(e) => {
                setPreviewUrl(e.target.value);
                if (onChange) onChange(e.target.value);
              }}
              placeholder="https://res.cloudinary.com/sjl1rfvu/image/upload/..."
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-[#0B3B60]"
            />
            {previewUrl && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div>
          {/* Active Preview View */}
          {previewUrl && !uploading ? (
            <div className="relative rounded-2xl border border-neutral-200 bg-neutral-900 overflow-hidden shadow-sm group">
              <div className={`relative ${compact ? 'h-36' : 'h-52'} w-full flex items-center justify-center bg-neutral-950`}>
                {isCurrentVideo ? (
                  <video
                    src={previewUrl}
                    controls
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <img
                    src={previewUrl}
                    alt="Uploaded Saree Asset"
                    className="h-full w-full object-contain"
                  />
                )}

                {/* Hover Overlay Controls */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-xs">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white text-neutral-900 font-bold text-xs flex items-center gap-1.5 shadow-md"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Replace
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyUrl}
                    className="px-3 py-1.5 rounded-lg bg-[#0B3B60] hover:bg-[#07243b] text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy CDN URL'}
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="p-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-700 text-white shadow-md"
                    title="Remove Image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status footer banner */}
              <div className="px-3.5 py-2 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-2 truncate text-[11px] text-neutral-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="truncate font-mono">{previewUrl}</span>
                </div>
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-[#0B3B60] hover:underline font-semibold flex items-center gap-1 ml-2 shrink-0"
                >
                  Inspect <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ) : (
            /* Drag & Drop Zone */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-[#0B3B60] bg-[#0B3B60]/5 scale-[1.01]'
                  : 'border-neutral-300 hover:border-[#0B3B60]/60 bg-neutral-50/50 hover:bg-neutral-50'
              } ${uploading ? 'pointer-events-none opacity-90' : ''}`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm,video/quicktime"
                onChange={handleFileChange}
                className="hidden"
              />

              {uploading ? (
                <div className="space-y-3 py-4 max-w-xs mx-auto">
                  <div className="w-10 h-10 rounded-full bg-[#0B3B60]/10 border border-[#0B3B60]/20 flex items-center justify-center mx-auto text-[#0B3B60]">
                    <UploadCloud className="w-5 h-5 animate-bounce" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900 text-xs">{statusText}</p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">{progress}% completed</p>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden shadow-inner">
                    <div
                      className="bg-[#0B3B60] h-full transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5 py-2">
                  <div className="w-12 h-12 rounded-full bg-[#0B3B60]/10 border border-[#0B3B60]/20 flex items-center justify-center mx-auto text-[#0B3B60] group-hover:scale-110 transition-transform">
                    {resourceType === 'video' ? (
                      <Film className="w-6 h-6 text-[#C1272D]" />
                    ) : (
                      <UploadCloud className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <p className="font-serif font-bold text-[#0B3B60] text-sm">
                      {isDragging ? 'Drop file to upload to Cloudinary' : 'Click or Drag & Drop Asset Here'}
                    </p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">{description}</p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                    <span>JPEG, PNG, WEBP</span>
                    <span>•</span>
                    <span>MP4, MOV (Videos)</span>
                    <span>•</span>
                    <span>Fast Edge Signed CDN</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
