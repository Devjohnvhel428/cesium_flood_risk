// q@ts-nocheck
/* qeslint-disable */
import { useEffect, useState } from "react";
import "cesium/Build/Cesium/Widgets/widgets.css";
import GUI from "./components/GUI";
import { GGITech } from "./core/GGITech";

interface MainProps {
    ggiTech: GGITech;
}

const Main = ({ ggiTech }: MainProps) => {
    const [mapViewerCreated, setMapViewerCreated] = useState(ggiTech.mainViewer.ggiTechMapViewer !== undefined);

    useEffect(() => {
        const onMapViewerCreated = () => {
            if (!mapViewerCreated) {
                setMapViewerCreated(true);
            }
        };

        ggiTech.mainViewer.mapViewerCreated.addEventListener(onMapViewerCreated);

        return function () {
            ggiTech.mainViewer.mapViewerCreated.removeEventListener(onMapViewerCreated);
        };
    }, []);

    return mapViewerCreated ? <GUI ggiTech={ggiTech} /> : null;
};

export default Main;
