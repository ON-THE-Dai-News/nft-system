/*====================
    UPLOAD TO IPFS
====================*/
// js-integration/pages/api/upload.js

import formidable from 'formidable';
import pinataSDK from '@pinata/sdk';
import fs from 'fs';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: false,
  },
};

const pinata = new pinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_SECRET_API_KEY
);

// Helper function to convert Buffer to Stream
function bufferToStream(buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the multipart form data
    const form = formidable({
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const metadata = JSON.parse(fields.metadata);

    if (!file) {
      return res.status(400).json({ error: 'Missing file' });
    }

    // Create readable stream from file
    const fileStream = fs.createReadStream(file.filepath);

    // Prepare options for Pinata
    const pinataOptions = {
      pinataMetadata: {
        name: file.originalFilename || 'otdnews-nft-image',
        keyvalues: {
          title: metadata.name,
          type: 'OTDNews NFT'
        }
      },
      pinataOptions: {
        cidVersion: 1
      }
    };

    // Upload file to IPFS
    const fileResult = await pinata.pinFileToIPFS(fileStream, pinataOptions);
    const fileUrl = `https://ipfs.io/ipfs/${fileResult.IpfsHash}`;

    // Upload metadata to IPFS with options
    const metadataResult = await pinata.pinJSONToIPFS(
      {
        ...metadata,
        image: fileUrl,
      },
      {
        pinataMetadata: {
          name: `${metadata.name}-metadata`,
          keyvalues: {
            type: 'OTDNews NFT Metadata'
          }
        }
      }
    );
    const metadataUrl = `https://ipfs.io/ipfs/${metadataResult.IpfsHash}`;

    // Clean up temporary file
    fs.unlink(file.filepath, (err) => {
      if (err) console.error('Error deleting temp file:', err);
    });

    res.status(200).json({ fileUrl, metadataUrl });
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    res.status(500).json({ error: 'Failed to upload to IPFS: ' + error.message });
  }
}