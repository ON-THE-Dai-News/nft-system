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
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('metadata', JSON.stringify(testMetadata));

      // Upload to API route
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
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">NFT Upload Test</h2>
      
      <div className="mb-6">
        <label className="block p-6 border-2 border-dashed rounded-lg hover:border-gray-400 cursor-pointer">
          <input
            type="file"
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <div className="flex flex-col items-center">
            <Upload className="w-12 h-12 mb-2" />
            <span className="text-sm">Upload test image</span>
          </div>
        </label>
      </div>

      {uploadState.error && (
        <div className="flex items-center p-4 mb-4 text-red-800 border border-red-300 rounded-lg bg-red-50">
          <AlertCircle className="h-4 w-4 mr-2" />
          <p>{uploadState.error}</p>
        </div>
      )}

      {uploadState.imageStatus === 'success' && (
        <div className="space-y-4">
          <div className="flex items-center p-4 mb-4 text-green-800 border border-green-300 rounded-lg bg-green-50">
            <Check className="h-4 w-4 mr-2" />
            <p>Upload successful!</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded border">
            <h3 className="font-semibold mb-2">IPFS URLs:</h3>
            <div className="text-sm break-all">
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