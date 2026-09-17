import { useState, useEffect } from 'react';

export const useCapsLock = () => {
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.getModifierState) {
        setIsCapsLockOn(event.getModifierState('CapsLock'));
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.getModifierState) {
        setIsCapsLockOn(event.getModifierState('CapsLock'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return isCapsLockOn;
};
