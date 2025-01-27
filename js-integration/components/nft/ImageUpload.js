/*====================
     IMAGE UPLOAD
====================*/
// js-integration/components/nft/ImageUpload.js

"use client";

import { useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { uploadToIPFS } from '@/utils/ipfs';

const ImageUpload = ({ onImageSelect }) => {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setError('');

    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    try {
      // Upload image to IPFS
      const ipfsUrl = uploadToIPFS(file);
      // Send IPFS URL to parent component
      onImageSelect(ipfsUrl);
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      console.error('IPFS upload error:', err);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageSelect(null);
  };

  return (
    <div className="image-upload">
      {error && <div className="upload-error">{error}</div>}
      
      {!preview ? (
        <label className="upload-area">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
          <div className="upload-content">
            <Upload size={24} />
            <span>Click to upload image</span>
            <span className="upload-hint">PNG, JPG, GIF (max 5MB)</span>
          </div>
        </label>
      ) : (
        <div className="preview-area">
          <img src={preview} alt="Preview" className="image-preview" />
          <button 
            type="button" 
            onClick={handleRemoveImage}
            className="remove-button"
          >
            <X size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;