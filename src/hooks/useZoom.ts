import { useState, useEffect } from 'react';

const useZoom = (): number => {
    const [zoomLevel, setZoomLevel] = useState<number>(0.65);

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (e.ctrlKey) {
                e.preventDefault();

                if (e.deltaY < 0) {
                    setZoomLevel(prev => Math.min(prev + 0.05, 1.5));
                } else {
                    setZoomLevel(prev => Math.max(prev - 0.05, 0.5));
                }
            }
        };

        document.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            document.removeEventListener('wheel', handleWheel);
        };
    }, []);

    return zoomLevel;
};

export default useZoom;