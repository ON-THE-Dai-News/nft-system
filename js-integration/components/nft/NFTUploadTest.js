import React, { useState } from 'react';
import { Upload, Check, AlertCircle } from 'lucide-react';

const NFTUploadTest = () => {
  const [uploadState, setUploadState] = useState({
    imageStatus: null,
    metadataStatus: null,
    error: null,
    ipfsImageUrl: null,
    ipfsMetadataUrl: null
  });

  const testMetadata = {
    name: "Test NFT",
    description: "This is a test NFT for OTDNews",
    attributes: [
      { trait_type: 'Headline', value: 'Test Headline' },
      { trait_type: 'Author', value: 'Test Author' },
      { trait_type: 'Category', value: 'Test' },
      { trait_type: 'Tags', value: 'test, demo' },
    ]
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadState(prev => ({ ...prev, error: null, imageStatus: 'uploading' }));

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('metadata', JSON.stringify(testMetadata));

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { fileUrl, metadataUrl } = await response.json();

      setUploadState(prev => ({
        ...prev,
        imageStatus: 'success',
        metadataStatus: 'success',
        ipfsImageUrl: fileUrl,
        ipfsMetadataUrl: metadataUrl
      }));
    } catch (error) {
      setUploadState(prev => ({
        ...prev,
        error: error.message,
        imageStatus: 'error',
        metadataStatus: 'error'
      }));
    }
  };

  return (
    <div className="upload-container">
      <h2 className="upload-title">NFT Upload Test</h2>
      
      <div className="upload-box-wrapper">
        <label className="upload-box">
          <input
            type="file"
            onChange={handleFileUpload}
            accept="image/*"
            className="file-input"
          />
          <div className="upload-box-content">
            <Upload className="upload-icon" />
            <span className="upload-text">Upload test image</span>
          </div>
        </label>
      </div>

      {uploadState.error && (
        <div className="error-message">
          <AlertCircle className="message-icon" />
          <p>{uploadState.error}</p>
        </div>
      )}

      {uploadState.imageStatus === 'success' && (
        <div className="success-container">
          <div className="success-message">
            <Check className="message-icon" />
            <p>Upload successful!</p>
          </div>
          
          <div className="ipfs-info">
            <h3 className="ipfs-title">IPFS URLs:</h3>
            <div className="ipfs-urls">
              <p><strong>Image:</strong> {uploadState.ipfsImageUrl}</p>
              <p><strong>Metadata:</strong> {uploadState.ipfsMetadataUrl}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NFTUploadTest;