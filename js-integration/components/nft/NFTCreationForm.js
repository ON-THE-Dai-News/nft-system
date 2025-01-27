/*========================
     NFT CREATION FORM
========================*/
// js-integration/components/nft/NFTCreationForm.js

"use client";

import { useState } from 'react';
import ImageUpload from './ImageUpload';
import { uploadToIPFS } from '@/utils/ipfs';

const NFTCreationForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        headline: '',
        author: '',
        category: '',
        tags: '',
        description: '',
        imageUrl: ''
      });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleImageSelect = (ipfsUrl) => {
    setFormData(prev => ({
      ...prev,
      imageUrl: ipfsUrl
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Prepare metadata
      const metadata = {
        name: formData.title,
        description: formData.description,
        image: formData.imageUrl,
        attributes: [
          { trait_type: 'Headline', value: formData.headline },
          { trait_type: 'Author', value: formData.author },
          { trait_type: 'Category', value: formData.category },
          { trait_type: 'Tags', value: formData.tags }
        ]
      };

      // Upload metadata to IPFS
      const metadataUrl = await uploadMetadataToIPFS(metadata);
      console.log('Metadata URL:', metadataUrl);

      // TODO: Add NFT minting logic here
    } catch (err) {
      setError('Failed to create NFT. Please try again.');
      console.error('NFT creation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="nft-creation">
      <h2>Create New NFT</h2>
      <ImageUpload onImageSelect={handleImageSelect} />
      
      {error && (
        <div className="error-message">
          {error}
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
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create NFT'}
        </button>
      </form>
    </div>
  );
};

export default NFTCreationForm;