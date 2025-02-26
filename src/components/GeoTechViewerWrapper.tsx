// q@ts-nocheck
/* qeslint-disable */
import { useEffect, useRef } from "react";
import { GeoTech } from "@core/GeoTech";

type GeoTechViewerWrapperProps = {
    geoTech: GeoTech;
};

const GeoTechViewerWrapper = ({ geoTech }: GeoTechViewerWrapperProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const geoTechViewer = geoTech.mainViewer;

        if (containerRef.current) {
            geoTechViewer.attach(containerRef.current);
        }

        return () => {
            if (geoTechViewer.attached) {
                geoTechViewer.detach();
            }
        };
    }, [geoTech]);

    return <div id="geo-tech-viewer-wrapper" ref={containerRef} style={{ width: "100%", height: "100%" }} />;
};

export default GeoTechViewerWrapper;
