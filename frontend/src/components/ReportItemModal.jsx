import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import api from '../api/axiosInstance';

const CATEGORIES = [
  { value: 'ELECTRONICS', label: 'Electronics (Phones, Laptops, Chargers)' },
  { value: 'ACCESSORIES', label: 'Accessories (Bags, Wallets, Keys, Clothing)' },
  { value: 'IDS_CARDS', label: 'IDs, Cards & Official Documents' },
  { value: 'BOOKS', label: 'Books, Notebooks & Stationery' },
  { value: 'OTHER', label: 'Other Items' },
];

export default function ReportItemModal({ isOpen, onClose, onItemCreated, onToast }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('ELECTRONICS');
  const [locationFound, setLocationFound] = useState('');
  const [dateFound, setDateFound] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      onToast('Please upload a valid image file (PNG, JPG, WEBP).', 'error');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !locationFound.trim() || !dateFound) {
      onToast('Please fill out all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('category', category);
      formData.append('locationFound', locationFound.trim());
      formData.append('dateFound', dateFound);
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const response = await api.post('/items', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onToast('Item reported successfully!', 'success');
      onItemCreated(response.data);
      onClose();
      // Reset form
      setTitle('');
      setDescription('');
      setLocationFound('');
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err) {
      onToast(err.response?.data?.message || 'Failed to submit item report.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-slate-100">Report Found / Lost Item</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Submit accurate details to help locate or return this item.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Item Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Black HP Laptop 15.6 inch"
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-slate-100 placeholder-slate-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl glass-input text-sm text-slate-100 outline-none bg-slate-900"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Date Found *
              </label>
              <input
                type="date"
                required
                value={dateFound}
                onChange={(e) => setDateFound(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl glass-input text-sm text-slate-100 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Location Found *
            </label>
            <input
              type="text"
              required
              value={locationFound}
              onChange={(e) => setLocationFound(e.target.value)}
              placeholder="e.g., Central Library, Table 14 / Engineering Quad"
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-slate-100 placeholder-slate-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Public Description *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="General visual description (leave out sensitive verification details like passwords or exact cash amount so the owner can prove ownership)..."
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-slate-100 placeholder-slate-500 outline-none resize-none"
            />
          </div>

          {/* Drag & Drop Photo Upload */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Photo Upload (Optional)
            </label>
            
            {previewUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-white/10 group aspect-video max-h-44 bg-slate-900 flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-red-400 hover:text-red-300 border border-red-500/30"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
                  dragActive
                    ? 'border-sky-400 bg-sky-500/10'
                    : 'border-white/10 hover:border-sky-500/40 bg-slate-900/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                />
                <div className="flex flex-col items-center justify-center space-y-1.5 text-slate-400">
                  <div className="p-2.5 rounded-xl bg-slate-800 text-sky-400">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-slate-200">
                    Click to browse or drag and drop image
                  </span>
                  <span className="text-[11px] text-slate-500">
                    PNG, JPG, or WEBP (Max 50MB)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Footer CTAs */}
          <div className="pt-2 flex items-center justify-end space-x-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-sky-500/20 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Publish Report</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
