// q@ts-nocheck
/* qeslint-disable */
import { useState, useEffect } from "react";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import ReplayCircleFilledIcon from "@mui/icons-material/ReplayCircleFilled";
import Tooltip from "@mui/material/Tooltip";
import { createGooglePhotorealistic3DTileset, Cartesian3 } from "cesium";

import { EvacuationLayoutContainer } from "./evacuation-layout.styles";
import AlertDialog from "../../dialogs/alert/AlertDialog";

interface EvacuationLayoutProps {}

const EvacuationLayout = ({}: EvacuationLayoutProps) => {
    const geoTech = window.geoTech;
    const areaManager = geoTech.areaManager;
    const viewer = geoTech.viewer;
    const [alerts, setAlerts] = useState([]);
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
    const [dialogData, setDialogData] = useState(undefined);
    const [alertCity, setAlertCity] = useState("");
    let isFlying = false;
    let isPlayPaused = false;
    let currentIndex = 0;
    let pausedHeading;
    let pausedPosition;

    const handleAlertItemClicked = (city: string, alert: any) => {
        const area = areaManager.getAreaByCityName(city);
        geoTech.zoomToArea(area);
        setDialogData(alert);
        setIsAlertDialogOpen(true);
        setAlertCity(city);
    };

    const handleAlertClose = () => {
        setIsAlertDialogOpen(false);
        setDialogData(undefined);
    };

    const flyOverAlerts = async () => {
        try {
            async function flyOverCities() {
                if (currentIndex < alerts.length) {
                    const alert = alerts[currentIndex];
                    const area = areaManager.getAreaByCityName(alert.city_name);
                    const destination = Cartesian3.fromDegrees(area.longitude, area.latitude, 5000);
                    viewer.camera.flyTo({
                        destination: destination,
                        duration: 7,
                        complete: async function () {
                            if (!isPlayPaused) {
                                currentIndex++;
                                await new Promise((resolve) => setTimeout(resolve, 500)); // Delay before next city
                                flyOverCities();
                            }
                        }
                    });
                } else {
                    isFlying = false;
                }
            }
            flyOverCities();
        } catch (error) {
            console.log(`Failed to load tileset: ${error}`);
        }
    };

    const pauseFlyOver = () => {
        isPlayPaused = true;
        pausedHeading = viewer.camera.heading;
        pausedPosition = viewer.camera.position.clone();
    };

    const restartFlyOver = async () => {
        isPlayPaused = false;
        isFlying = false;
        currentIndex = 0;
        const area = areaManager.getAreaByCityName(alerts[0].city_name);
        viewer.camera.flyTo({
            duration: 7,
            destination: Cartesian3.fromDegrees(area.longitude, area.latitude, 5000),
            complete: async function () {
                await flyOverAlerts();
            }
        });
    };

    useEffect(() => {
        if (areaManager.alerts) {
            setAlerts(areaManager.alerts);
        }
    });
    return (
        <EvacuationLayoutContainer id="emission-layout-container" $light={false}>
            <div className="evacuation-layout-particles">
                <div className="tree-panel">
                    <SimpleTreeView aria-label="alert-treeview" className="entities-layout__content__tree">
                        {alerts &&
                            alerts?.map((alert) => {
                                return (
                                    <TreeItem
                                        key={`${alert.city_name}-alert`}
                                        itemId={`${alert.city_name}-alert`}
                                        label={`Alert in ${alert.city_name} (${alert.alerts.length})`}
                                    >
                                        {alert?.alerts &&
                                            alert?.alerts?.map((item, index) => {
                                                return (
                                                    <TreeItem
                                                        key={`${alert.city_name}-alert-${index}`}
                                                        itemId={`${alert.city_name}-alert-${index}`}
                                                        label={item.type}
                                                        onClick={() => {
                                                            handleAlertItemClicked(alert.city_name, item);
                                                        }}
                                                    />
                                                );
                                            })}
                                    </TreeItem>
                                );
                            })}
                    </SimpleTreeView>
                </div>
                <div className="btn-panel">
                    <Stack direction="row" spacing={1}>
                        <Tooltip title="Start Flyover">
                            <IconButton
                                aria-label="primary"
                                color="primary"
                                onClick={async () => {
                                    await flyOverAlerts();
                                }}
                            >
                                <PlayCircleIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="stop Flyover">
                            <IconButton aria-label="add an alarm" color="primary" onClick={pauseFlyOver}>
                                <StopCircleIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Resume Flyover">
                            <IconButton
                                color="primary"
                                aria-label="add to shopping cart"
                                onClick={async () => {
                                    await restartFlyOver();
                                }}
                            >
                                <ReplayCircleFilledIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </div>
            </div>
            <AlertDialog open={isAlertDialogOpen} city={alertCity} data={dialogData} onClose={handleAlertClose} />
        </EvacuationLayoutContainer>
    );
};

export default EvacuationLayout;
