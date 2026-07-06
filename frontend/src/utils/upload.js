import api from '../services/api';
import axios from 'axios';

const MAX_SIZE_MB = 10;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

const validateImageFile = (file) => {
    if (!file) {
        throw new Error('No file selected');
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error('Invalid file type. Please upload JPG, PNG, GIF, WebP, or SVG.');
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        throw new Error(`File too large. Maximum size is ${MAX_SIZE_MB}MB.`);
    }
};

const resolveImgBBKey = async () => {
    const viteKey = import.meta.env.VITE_IMGBB_API_KEY;
    if (viteKey) return viteKey;

    const configResponse = await api.get('/config/imgbb-key');
    return configResponse.data?.key;
};

const uploadToImgBB = async (file, apiKey) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
    });

    if (!response.data?.success) {
        const msg = response.data?.error?.message || response.data?.status_txt || 'ImgBB upload failed';
        throw new Error(msg);
    }

    const url = response.data?.data?.url || response.data?.data?.display_url;
    if (!url) {
        throw new Error('ImgBB did not return an image URL');
    }

    return url;
};

const uploadToServer = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
    });

    if (!response.data?.url) {
        throw new Error('Server upload did not return an image URL');
    }

    return response.data.url;
};

export const uploadImage = async (file) => {
    validateImageFile(file);

    let imgbbError = null;

    try {
        const apiKey = await resolveImgBBKey();
        if (apiKey) {
            return await uploadToImgBB(file, apiKey);
        }
    } catch (error) {
        imgbbError = error;
    }

    try {
        return await uploadToServer(file);
    } catch (serverError) {
        const serverMsg = serverError.response?.data?.message
            || serverError.response?.data?.errors?.image?.[0]
            || serverError.message;

        if (imgbbError) {
            throw new Error(`Upload failed. ImgBB: ${imgbbError.message}. Server: ${serverMsg}`);
        }

        throw new Error(serverMsg || 'Failed to upload image. Please log in and try again.');
    }
};

/** @deprecated Use uploadImage instead */
export const uploadImageToImgBB = uploadImage;
