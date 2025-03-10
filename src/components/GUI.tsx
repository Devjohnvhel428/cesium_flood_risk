// q@ts-nocheck
/* qeslint-disable */

import { useState, useEffect } from "react";

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
    CalcitePanel,
    CalciteShell,
    CalciteShellPanel,
    CalciteTooltip
} from "@esri/calcite-components-react";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
import { emitCustomEvent } from "react-custom-events";

import { GGITech } from "@core/GGITech";
import { GGITechEventsTypes } from "@core/Events";
import WeatherIconSvg from "../assets/side-nav-svgs/Weather.svg?react";
import EvacuationIconSvg from "../assets/side-nav-svgs/Evacuation.svg?react";
import BasemapIconSvg from "../assets/side-nav-svgs/Basemap.svg?react";

import { DataActionIds } from "./data-action-ids";
import { GlobalStyles } from "./index.styles";
import BottomBar from "./bottombar/BottomBar";
import GGITechViewerWrapper from "./GGITechViewerWrapper";
import CurrentWeatherLayout from "./sidebar-elements/current/CurrentWeatherLayout";
import EvacuationLayout from "./sidebar-elements/evacuation/EvacuationLayout";
import MapControlBar from "./map-control-bar/MapControlBar";
import BasemapPicker from "./basemap-picker/BaseMapPicker";
import { getWeather } from "../redux";
import { useActions } from "../hooks/useActions";
import FullScreenLoader from "./FullScreenLoader/FullScreenLoader";
// @ts-ignore
import mockData from "../data/mockData_1.json";
// @ts-ignore
import mockAlertData from "../data/mockAlertData_1.json";

interface GUIProps {
    ggiTech: GGITech;
}

const GUI = ({ ggiTech }: GUIProps) => {
    const currentWeather = useSelector(getWeather);
    const { setWeatherData } = useActions();
    const areaManager = ggiTech.areaManager;
    const [alertSounded, setAlertSounded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        ggiTech.uiManager.initialize();
        if (import.meta.env.VITE_USE_MOCKDATA === "false") {
            let response = null;
            const fetchWeatherData = async () => {
                response = await ggiTech.apiInterface.fetchWeatherForAllCities();
                setWeatherData(response?.data);
            };
            fetchWeatherData();
        } else {
            setWeatherData({ current: mockData.data, alerts: [] });
            areaManager.cleanAreaList();
            mockData.data?.forEach((property) => {
                areaManager.addNewAreaWithProperties(property);
            });
        }
    }, []);

    useEffect(() => {
        if (currentWeather !== undefined) {
            setIsLoading(true);
            if (currentWeather?.alerts?.length === 0) {
                if (import.meta.env.VITE_USE_MOCKDATA === "true") {
                    setWeatherData({ current: mockData.data, alerts: mockAlertData });
                }
            } else {
                const alerts = [];
                let i = 0;
                const fetchCityInformation = async () => {
                    for (i = 0; i < currentWeather?.alerts?.length; i++) {
                        const alert = currentWeather?.alerts[i];
                        if (alert?.alerts?.length > 0) {
                            const area = areaManager.getAreaByCityName(alert.city_name);
                            area.setAlert(alert);
                            alerts.push(alert);
                            /* eslint-disable-next-line  no-await-in-loop */
                            const cityData = await ggiTech.apiInterface.fetchCityData(
                                alert.city_name,
                                area.latitude,
                                area.longitude
                            );
                            if (cityData) {
                                area.minLatitude = Number(cityData.boundingbox[0]);
                                area.maxLatitude = Number(cityData.boundingbox[1]);
                                area.minLongitude = Number(cityData.boundingbox[2]);
                                area.maxLongitude = Number(cityData.boundingbox[3]);
                                area.drawCityRange();
                            }
                        }
                    }
                    if (alerts.length > 0) {
                        areaManager.cleanAlerts();
                        areaManager.alerts = alerts;
                        emitCustomEvent(GGITechEventsTypes.AlertSounded, alerts);
                        setAlertSounded(true);
                        setIsLoading(false);
                        toast.error(`The ${alerts.length} flood alerts are sounded!`);
                    }
                };
                fetchCityInformation();
            }
        }
    }, [currentWeather]);

    const isMobile = ggiTech.isMobile();

    return (
        <>
            <FullScreenLoader isLoading={isLoading} />
            <CalciteShell contentBehind>
                <CalciteShellPanel slot="panel-start" hidden={isMobile}>
                    <CalciteActionBar slot="action-bar" expanded className="calcite-mode-dark">
                        <CalciteAction
                            id="action-current"
                            data-action-id={DataActionIds.Current}
                            aria-expanded="false"
                            appearance="solid"
                            text="Current"
                        >
                            <WeatherIconSvg />
                            <CalciteTooltip reference-element="action-current" closeOnClick>
                                <span>Current Weather</span>
                            </CalciteTooltip>
                        </CalciteAction>
                        <CalciteAction
                            className={alertSounded ? "flood-evacuation" : ""}
                            id="action-emission"
                            data-action-id={DataActionIds.Evacuation}
                            text="Evacuation"
                        >
                            <EvacuationIconSvg />
                            <CalciteTooltip reference-element="action-emission" closeOnClick>
                                <span>Evacuation Routes</span>
                            </CalciteTooltip>
                        </CalciteAction>

                        <CalciteAction id="action-basemap" data-action-id={DataActionIds.Basemap} text="Imagery Layers">
                            <BasemapIconSvg />
                            <CalciteTooltip reference-element="action-basemap" closeOnClick>
                                <span>Imagery Layers</span>
                            </CalciteTooltip>
                        </CalciteAction>
                    </CalciteActionBar>

                    <CalcitePanel
                        heading="Current Weather"
                        data-panel-id={DataActionIds.Current}
                        closable
                        closed
                        hidden
                    >
                        <CurrentWeatherLayout />
                    </CalcitePanel>

                    <CalcitePanel heading="Evacuation" data-panel-id={DataActionIds.Evacuation} closable closed hidden>
                        <EvacuationLayout />
                    </CalcitePanel>

                    <CalcitePanel heading="Imagery Layers" data-panel-id={DataActionIds.Basemap} closable closed hidden>
                        <BasemapPicker />
                    </CalcitePanel>
                </CalciteShellPanel>

                <GGITechViewerWrapper ggiTech={ggiTech} />

                <GlobalStyles />
                <BottomBar />
                <MapControlBar />
            </CalciteShell>
            <ToastContainer position="top-right" style={{ fontSize: "12pt" }} />
        </>
    );
};

export default GUI;
