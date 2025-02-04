/*=========================
    IPFS STORAGE UTILS
=========================*/
// js-integration/utils/ipfsStorage.js

import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const IPFS_STORAGE_FILE = join(__dirname, '../../data/ipfs_urls.json');

// Ensure the data directory exists
const ensureDirectoryExists = async () => {
    const dir = dirname(IPFS_STORAGE_FILE);
    if (!existsSync(dir)) {
        await mkdir(dir, { recursive: true });
    }
};

// Initialize storage file if it doesn't exist
const initializeStorageFile = async () => {
    await ensureDirectoryExists();
    if (!existsSync(IPFS_STORAGE_FILE)) {
        await writeFile(IPFS_STORAGE_FILE, JSON.stringify({}, null, 2));
    }
};

// Save IPFS URLs for a news item
export const saveIPFSUrls = async (newsItem, ipfsImageUrl, ipfsMetadataUrl) => {
    try {
        await initializeStorageFile();

        // Read existing data
        const data = JSON.parse(await readFile(IPFS_STORAGE_FILE, 'utf8'));

        // Add new entry
        data[newsItem.page_id] = {
            page_id: newsItem.page_id,
            title: newsItem.title,
            date: newsItem.date,
            ipfs_image_url: ipfsImageUrl,
            ipfs_metadata_url: ipfsMetadataUrl,
            timestamp: new Date().toISOString()
        };

        // Write back to file
        await writeFile(IPFS_STORAGE_FILE, JSON.stringify(data, null, 2));

        console.log(`Saved IPFS URLs for page_id ${newsItem.page_id}`);
        return true;
    } catch (error) {
        console.error('Error saving IPFS URLs:', error);
        return false;
    }
};

// Get IPFS URLs for a specific page_id
export const getIPFSUrls = async (pageId) => {
    try {
        await initializeStorageFile();
        const data = JSON.parse(await readFile(IPFS_STORAGE_FILE, 'utf8'));
        return data[pageId] || null;
    } catch (error) {
        console.error('Error getting IPFS URLs:', error);
        return null;
    }
};

// Get all stored IPFS URLs
export const getAllIPFSUrls = async () => {
    try {
        await initializeStorageFile();
        return JSON.parse(await readFile(IPFS_STORAGE_FILE, 'utf8'));
    } catch (error) {
        console.error('Error getting all IPFS URLs:', error);
        return {};
    }
};