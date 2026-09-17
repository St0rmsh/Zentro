export const uploadService = {
  validateImage: (file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return 'Cover must be an image file.';
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return 'File size must be less than 5MB.';
    }
    return null;
  },
  validateMedia: (file: File): string | null => {
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      return 'File must be an image or video.';
    }
    if (file.size > 50 * 1024 * 1024) {
      return 'Media must be smaller than 50MB.';
    }
    return null;
  },
};
