import { useState, useEffect } from 'react';
import { WindowSizeObject } from '../_interfaces';

/**
 * Adapted from https://usehooks.com/useWindowSize/
 */
export const useWindowSize = (): WindowSizeObject => {
    const isClient: boolean = typeof window === 'object';

    const getSize = (): WindowSizeObject => {
        return {
            width: isClient ? window.innerWidth : undefined,
            height: isClient ? window.innerHeight : undefined
        };
    };

    const [windowSize, setWindowSize] = useState(getSize);

    useEffect(() => {
        if (!isClient) {
            return;
        }

        const handleResize = () => {
            setWindowSize(getSize());
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []); // Empty array ensures that effect is only run on mount and unmount

    return windowSize;
};
