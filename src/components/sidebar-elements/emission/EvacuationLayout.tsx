// q@ts-nocheck
/* qeslint-disable */
import { useState, useEffect } from "react";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";

import { EvacuationLayoutContainer } from "./evacuation-layout.styles";
import AlertDialog from "../../dialogs/alert/AlertDialog";

interface EvacuationLayoutProps {}

const EvacuationLayout = ({}: EvacuationLayoutProps) => {
    const geoTech = window.geoTech;
    const areaManager = geoTech.areaManager;
    const [alerts, setAlerts] = useState([]);
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
    const [dialogData, setDialogData] = useState(undefined);
    const [alertCity, setAlertCity] = useState("");

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

    useEffect(() => {
        if (areaManager.alerts) {
            setAlerts(areaManager.alerts);
        }
    });
    return (
        <EvacuationLayoutContainer id="emission-layout-container" $light={false}>
            <div className="evacuation-layout-particles">
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
            <AlertDialog open={isAlertDialogOpen} city={alertCity} data={dialogData} onClose={handleAlertClose} />
        </EvacuationLayoutContainer>
    );
};

export default EvacuationLayout;
