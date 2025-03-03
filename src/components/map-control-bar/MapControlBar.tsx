import { useState } from "react";
import { MapControlBarContainer } from "./map-control-bar.styles";
import HelpPage from "../dialogs/help/HelpPage";
import HomeIconSvg from "../../assets/map-control-bar-svgs/Home.svg?react";
import ZoomInIconSvg from "../../assets/map-control-bar-svgs/ZoomIn.svg?react";
import ZoomOutIconSvg from "../../assets/map-control-bar-svgs/ZoomOut.svg?react";
import QuestionIconSvg from "../../assets/map-control-bar-svgs/Question.svg?react";

const MapControlBar = () => {
    const ggiTech = window.ggiTech;
    const [isHelperOpened, setIsHelperOpened] = useState(false);

    const handleZoomIn = () => {
        ggiTech.navigationHelper.zoom(0.5);
    };

    const handleZoomOut = () => {
        ggiTech.navigationHelper.zoom(2);
    };

    const handleHome = () => {
        ggiTech.navigationHelper.resetView();
    };

    const handleCloseHelper = () => {
        setIsHelperOpened(false);
    };

    return (
        <MapControlBarContainer id="map-control-bar-container" className="map-control-bar-container">
            <div className="btn-container">
                <button type="button" onClick={handleHome} className="icon-button">
                    <HomeIconSvg />
                </button>
            </div>
            <div className="btn-container">
                <button type="button" onClick={handleZoomIn} className="icon-button">
                    <ZoomInIconSvg />
                </button>
            </div>
            <div className="btn-container">
                <button type="button" onClick={handleZoomOut} className="icon-button">
                    <ZoomOutIconSvg />
                </button>
            </div>
            <div className="btn-container">
                <button
                    type="button"
                    onClick={() => {
                        setIsHelperOpened(true);
                    }}
                    className="icon-button"
                >
                    <QuestionIconSvg />
                </button>
            </div>
            <HelpPage open={isHelperOpened} onClose={handleCloseHelper} />
        </MapControlBarContainer>
    );
};

export default MapControlBar;
