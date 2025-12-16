import React, { useRef } from 'react';
import { ImageItem } from '../types';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface PhotoUploadProps {
  images: ImageItem[];
  setImages: React.Dispatch<React.SetStateAction<ImageItem[]>>;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ images, setImages }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages: ImageItem[] = Array.from(e.target.files).map((file) => {
        const fileObj = file as File;
        return {
          id: Math.random().toString(36).substring(7),
          file: fileObj,
          previewUrl: URL.createObjectURL(fileObj),
          description: ''
        };
      });
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const updateDescription = (id: string, description: string) => {
    setImages(prev => prev.map(img => 
      img.id === id ? { ...img, description } : img
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center">
          <span className="bg-blue-100 text-blue-600 w-8 h-8 flex items-center justify-center rounded-full mr-3 text-sm">2</span>
          Foto's & Bewijs
        </h2>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Upload className="w-4 h-4 mr-2" />
          Foto's Toevoegen
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
          accept="image/*"
        />
      </div>

      {images.length === 0 ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-4">
            <ImageIcon className="h-6 w-6 text-slate-600" />
          </div>
          <h3 className="text-sm font-medium text-slate-900">Geen foto's geüpload</h3>
          <p className="mt-1 text-sm text-slate-500">Klik om foto's van de lekkage te uploaden</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {images.map((image, index) => (
            <div key={image.id} className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 group">
              <div className="relative h-48 bg-slate-200">
                <img 
                  src={image.previewUrl} 
                  alt={`Upload ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeImage(image.id)}
                  className="absolute top-2 right-2 p-1 bg-white/90 rounded-full text-slate-600 hover:text-red-600 hover:bg-white shadow-sm transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  Foto {index + 1}
                </div>
              </div>
              <div className="p-3">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Beschrijving van de foto (optioneel)
                </label>
                <input
                  type="text"
                  value={image.description}
                  onChange={(e) => updateDescription(image.id, e.target.value)}
                  placeholder="Bijv. Vochtkring plafond badkamer..."
                  className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;