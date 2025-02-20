import { MapControlBarContainer } from "./map-control-bar.styles";
import HomeIconSvg from "../../assets/map-control-bar-svgs/Home.svg?react";
import ZoomInIconSvg from "../../assets/map-control-bar-svgs/ZoomIn.svg?react";
import ZoomOutIconSvg from "../../assets/map-control-bar-svgs/ZoomOut.svg?react";

const MapControlBar = () => {
    const geoTech = window.geoTech;

    const handleZoomIn = () => {
        geoTech.navigationHelper.zoom(0.5);
    };

    const handleZoomOut = () => {
        geoTech.navigationHelper.zoom(2);
    };

    const handleHome = () => {
        geoTech.navigationHelper.resetView();
    };

    return (
        <MapControlBarContainer id="map-control-bar-container" className="map-control-bar-container">
            <div className="btn-container">
                <button onClick={handleHome} className="icon-button">
                    <HomeIconSvg />
                </button>
            </div>
            <div className="btn-container">
                <button onClick={handleZoomIn} className="icon-button">
                    <ZoomInIconSvg />
                </button>
            </div>
            <div className="btn-container">
                <button onClick={handleZoomOut} className="icon-button">
                    <ZoomOutIconSvg />
                </button>
            </div>
        </MapControlBarContainer>
    );
};

export default MapControlBar;
