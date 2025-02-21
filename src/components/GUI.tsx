// q@ts-nocheck
/* qeslint-disable */

import { useEffect } from "react";
import { useCustomEventListener } from "react-custom-events";

import "@esri/calcite-components/dist/components/calcite-action";
import "@esri/calcite-components/dist/components/calcite-action-bar";
import "@esri/calcite-components/dist/components/calcite-navigation";
import "@esri/calcite-components/dist/components/calcite-navigation-logo";
import "@esri/calcite-components/dist/components/calcite-navigation-user";
import "@esri/calcite-components/dist/components/calcite-panel";
import "@esri/calcite-components/dist/components/calcite-shell";
import "@esri/calcite-components/dist/components/calcite-shell-panel";
import "@esri/calcite-components/dist/components/calcite-tooltip";

import {
    CalciteActionBar,
    CalciteAction,
    CalciteNavigation,
    CalciteNavigationLogo,
    CalciteNavigationUser,
    CalcitePanel,
    CalciteShell,
    CalciteShellPanel,
    CalciteTooltip
} from "@esri/calcite-components-react";
import { Cesium3DTileset } from "cesium";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

import WeatherIconSvg from "../assets/side-nav-svgs/Weather.svg?react";
import CalendarIconSvg from "../assets/side-nav-svgs/Calendar.svg?react";
import EvacuationIconSvg from "../assets/side-nav-svgs/Evacuation.svg?react";
import BasemapIconSvg from "../assets/side-nav-svgs/Basemap.svg?react";

import { GeoTech } from "@core/GeoTech";
import { GeoTechEventsTypes } from "@core/Events";
import { DataActionIds } from "./data-action-ids";
import { GlobalStyles } from "./index.styles";
import BottomBar from "./bottombar/BottomBar";
import GeoTechViewerWrapper from "./GeoTechViewerWrapper";
import EntitiesLayout from "./sidebar-elements/entities/EntitiesLayout";
import FavoritesLayout from "./sidebar-elements/favorites/FavoritesLayout";
import EmissionLayout from "./sidebar-elements/emission/EmissionLayout";
import AccountMenu from "./account-menu/AccountMenu";
import MapControlBar from "./map-control-bar/MapControlBar";
import BasemapPicker from "./basemap-picker/BaseMapPicker";
import { getWeather } from "../redux";
import { useActions } from "../hooks/useActions";
// @ts-ignore
import mockData from "../../public/data/mock_data.json";

interface GUIProps {
    geoTech: GeoTech;
}

// eslint-disable-next-line arrow-body-style
const GUI = ({ geoTech }: GUIProps) => {
    const currentWeather = useSelector(getWeather);
    const { setWeatherData } = useActions();

    useEffect(() => {
        geoTech.uiManager.initialize();
        if (!import.meta.env.VITE_USE_MOCKDATA) {
            let response = null;
            const fetchWeatherData = async () => {
                response = await geoTech.apiInterface.fetchWeatherForAllCities();
                setWeatherData(response?.data);
            };
            fetchWeatherData();
        } else {
            setWeatherData({ current: mockData.data });
        }
    }, []);

    useEffect(() => {
        console.log("currentWeather", currentWeather);
    }, [currentWeather]);

    useCustomEventListener(GeoTechEventsTypes.BasemapChanged, (name: string) => {
        if (name === "Google 3d") {
            const googleAPIKey = import.meta.env.VITE_GOOGLE_API_KEY;
            const tilesetPromise = Cesium3DTileset.fromUrl(
                `https://tile.googleapis.com/v1/3dtiles/root.json?key=${googleAPIKey}`
            );

            tilesetPromise
                .then((tileset: Cesium3DTileset) => {
                    geoTech.mapViewer.customTimePrimitive = geoTech.viewer.scene.primitives.add(tileset);
                })
                .catch((error: any) => {
                    console.error(error);
                });
        }
    });

    const isMobile = geoTech.isMobile();

    return (
        <>
            <CalciteShell contentBehind>
                <CalciteNavigation slot="header">
                    <CalciteNavigationLogo
                        id="header-title"
                        heading="GGI"
                        heading-level="1"
                        slot="logo"
                    ></CalciteNavigationLogo>
                    <CalciteNavigationUser
                        slot="user"
                        full-name={import.meta.env.VITE_USER_EMAIL}
                        username={import.meta.env.VITE_USER_NAME}
                    ></CalciteNavigationUser>
                </CalciteNavigation>

                <CalciteShellPanel slot="panel-start" hidden={isMobile}>
                    <CalciteActionBar slot="action-bar" expanded className="calcite-mode-dark">
                        <CalciteAction
                            id="action-entities"
                            data-action-id={DataActionIds.Entities}
                            aria-expanded="false"
                            appearance="solid"
                            text="Current"
                        >
                            <WeatherIconSvg />
                            <CalciteTooltip reference-element="action-entities" closeOnClick={true}>
                                <span>Current Weather</span>
                            </CalciteTooltip>
                        </CalciteAction>
                        <CalciteAction id="action-favorite" data-action-id={DataActionIds.Favorite} text="Historical">
                            <CalendarIconSvg />
                            <CalciteTooltip reference-element="action-favorite" closeOnClick={true}>
                                <span>Historical Data</span>
                            </CalciteTooltip>
                        </CalciteAction>
                        <CalciteAction id="action-emission" data-action-id={DataActionIds.Emission} text="Evacuation">
                            <EvacuationIconSvg />
                            <CalciteTooltip reference-element="action-emission" closeOnClick={true}>
                                <span>Evacuation Routes</span>
                            </CalciteTooltip>
                        </CalciteAction>

                        <CalciteAction id="action-basemap" data-action-id={DataActionIds.Basemap} text="Basemap">
                            <BasemapIconSvg />
                            <CalciteTooltip reference-element="action-basemap" closeOnClick={true}>
                                <span>Basemap</span>
                            </CalciteTooltip>
                        </CalciteAction>
                    </CalciteActionBar>

                    <CalcitePanel heading="Entities" data-panel-id={DataActionIds.Entities} closable closed hidden>
                        <EntitiesLayout />
                    </CalcitePanel>

                    <CalcitePanel heading="Favorite" data-panel-id={DataActionIds.Favorite} closable closed hidden>
                        <FavoritesLayout />
                    </CalcitePanel>

                    <CalcitePanel heading="Emission" data-panel-id={DataActionIds.Emission} closable closed hidden>
                        <EmissionLayout />
                    </CalcitePanel>

                    <CalcitePanel heading="Basemap" data-panel-id={DataActionIds.Basemap} closable closed hidden>
                        <BasemapPicker />
                    </CalcitePanel>
                </CalciteShellPanel>

                <GeoTechViewerWrapper geoTech={geoTech} />

                <GlobalStyles />
                <BottomBar />
                <MapControlBar />
            </CalciteShell>

            <AccountMenu />
            <Toaster position="top-center" />
        </>
    );
};

export default GUI;
