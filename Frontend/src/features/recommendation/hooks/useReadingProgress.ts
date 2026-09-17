import { useEffect, useState } from 'react';
import { ReadingProgressData } from '../types';

export const useReadingProgress = () => {
  const [progressData, setProgressData] = useState<ReadingProgressData[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('reading_progress');
    if (saved) {
      try {
        setProgressData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse reading progress', e);
      }
    }
  }, []);

  const updateProgress = (data: Omit<ReadingProgressData, 'lastReadAt'>) => {
    const newData: ReadingProgressData = {
      ...data,
      lastReadAt: new Date().toISOString()
    };

    setProgressData(prev => {
      const existing = prev.findIndex(p => p.postId === data.postId);
      let updated = [...prev];
      if (existing !== -1) {
        updated[existing] = newData;
      } else {
        updated.unshift(newData);
      }
      
      // Keep only last 10
      if (updated.length > 10) {
        updated = updated.slice(0, 10);
      }

      localStorage.setItem('reading_progress', JSON.stringify(updated));
      return updated;
    });
  };

  return { progressData, updateProgress };
};
