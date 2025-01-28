/*========================
     NFT CREATION FORM
========================*/
// js-integration/components/nft/NFTCreationForm.js

"use client";

import { useState } from 'react';
import ImageUpload from './ImageUpload';
import { mintNFT } from '@/utils/contract';

const NFTCreationForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    headline: '',
    author: '',
    category: '',
    tags: '',
    description: '',
    imageFile: null,
  });
  const [uploadState, setUploadState] = useState({
    isSubmitting: false,
    error: '',
    ipfsImageUrl: '',
    ipfsMetadataUrl: '',
    mintingStatus: '', // 'uploading', 'minting', 'success', 'error'
  });

  const handleImageSelect = (file) => {
    setFormData((prev) => ({
      ...prev,
      imageFile: file,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadState(prev => ({
      ...prev,
      isSubmitting: true,
      error: '',
      mintingStatus: 'uploading'
    }));

    try {
      // Create form data for upload
      const formDataForUpload = new FormData();
      formDataForUpload.append('file', formData.imageFile);
      
      // Prepare metadata
      const metadata = {
        name: formData.title,
        description: formData.description,
        attributes: [
          { trait_type: 'Headline', value: formData.headline },
          { trait_type: 'Author', value: formData.author },
          { trait_type: 'Category', value: formData.category },
          { trait_type: 'Tags', value: formData.tags },
        ],
      };

      formDataForUpload.append('metadata', JSON.stringify(metadata));

      // Upload image and metadata to IPFS via API route
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataForUpload,
      });

      if (!response.ok) {
        throw new Error('Failed to upload to IPFS');
      }

      const { fileUrl, metadataUrl } = await response.json();

      setUploadState(prev => ({
        ...prev,
        ipfsImageUrl: fileUrl,
        ipfsMetadataUrl: metadataUrl,
        mintingStatus: 'minting'
      }));

      // Mint the NFT using the metadata URL
      const txHash = await mintNFT(metadataUrl);
      
      setUploadState(prev => ({
        ...prev,
        mintingStatus: 'success',
        error: '',
      }));

      // Optional: You might want to store the transaction hash or redirect
      console.log('Transaction Hash:', txHash);
    } catch (err) {
      setUploadState(prev => ({
        ...prev,
        error: 'Failed to create NFT. Please try again.',
        mintingStatus: 'error',
      }));
      console.error('NFT creation error:', err);
    } finally {
      setUploadState(prev => ({
        ...prev,
        isSubmitting: false,
      }));
    }
  };

  return (
    <div className="nft-creation">
      <h2>Create New NFT</h2>
      <ImageUpload onImageSelect={handleImageSelect} />
      
      {uploadState.error && (
        <div className="error-message">
          {uploadState.error}
        </div>
      )}

      {uploadState.mintingStatus === 'success' && (
        <div className="success-message">
          NFT minted successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="nft-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter NFT title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="headline">Headline</label>
          <input
            type="text"
            id="headline"
            name="headline"
            value={formData.headline}
            onChange={handleChange}
            required
            placeholder="Enter headline"
          />
        </div>

        <div className="form-group">
          <label htmlFor="author">Author</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            placeholder="Enter author name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            placeholder="Enter categories (comma-separated)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Enter tags (comma-separated)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Enter NFT description"
          />
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={uploadState.isSubmitting}
        >
          {uploadState.mintingStatus === 'uploading' ? 'Uploading to IPFS...' :
           uploadState.mintingStatus === 'minting' ? 'Minting NFT...' :
           uploadState.isSubmitting ? 'Creating...' : 'Create NFT'}
        </button>

        {(uploadState.ipfsImageUrl || uploadState.ipfsMetadataUrl) && (
          <div className="ipfs-info">
            <h3>IPFS URLs:</h3>
            {uploadState.ipfsImageUrl && (
              <p>Image: <a href={uploadState.ipfsImageUrl} target="_blank" rel="noopener noreferrer">
                {uploadState.ipfsImageUrl}
              </a></p>
            )}
            {uploadState.ipfsMetadataUrl && (
              <p>Metadata: <a href={uploadState.ipfsMetadataUrl} target="_blank" rel="noopener noreferrer">
                {uploadState.ipfsMetadataUrl}
              </a></p>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default NFTCreationForm;