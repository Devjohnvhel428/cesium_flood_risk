// q@ts-nocheck
/* qeslint-disable */
import { useEffect, useRef } from "react";
import { GGITech } from "@core/GGITech";

type GGITechViewerWrapperProps = {
    ggiTech: GGITech;
};

const GGITechViewerWrapper = ({ ggiTech }: GGITechViewerWrapperProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const ggiTechViewer = ggiTech.mainViewer;

        if (containerRef.current) {
            ggiTechViewer.attach(containerRef.current);
        }

        return () => {
            if (ggiTechViewer.attached) {
                ggiTechViewer.detach();
            }
        };
    }, [ggiTech]);

    return <div id="ggi-tech-viewer-wrapper" ref={containerRef} style={{ width: "100%", height: "100%" }} />;
};

export default GGITechViewerWrapper;
