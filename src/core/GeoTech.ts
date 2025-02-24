/* qeslint-disable*/
import { BoundingSphere, Cartesian3, HeadingPitchRange, Event, Math as CesiumMath } from "cesium";
import { GeoTechViewer } from "./GeoTechViewer";
import { Site } from "./common";
import { CanvasEventHandler } from "./CanvasEventHandler";
import { MapTool } from "./MapTool";
import { Area } from "./Area";
import { AreaManager } from "./AreaManager";
import APIInterface from "./APIInterface";
import UIManager from "./UIManager";
import NavigationHelper from "./NavigationHelper";

export class GeoTech {
    readonly rootElementId = "root";

    readonly mainViewer = new GeoTechViewer(this);

    readonly apiInterface = new APIInterface();

    private _mapTool: MapTool | undefined;

    private _areaManager: AreaManager | undefined;

    private _canvasEventHandler: CanvasEventHandler | undefined;

    protected readonly _mapToolDeactivated: Event = new Event();

    public uiManager = new UIManager();

    private _navigationHelper: NavigationHelper | undefined;

    constructor() {
        this._canvasEventHandler = undefined;

        this.mainViewer.mapViewerCreated.addEventListener(() => {
            this.onMapViewerCreated();
        });
    }

    get viewer() {
        return this.mainViewer.geoTechMapViewer!.viewer;
    }

    get mapViewer() {
        return this.mainViewer.geoTechMapViewer!;
    }

    get areaManager() {
        return this._areaManager as AreaManager;
    }

    get scene() {
        return this.viewer.scene;
    }

    get mapToolDeactivated() {
        return this._mapToolDeactivated;
    }

    isMobile() {
        return "ontouchstart" in document.documentElement && navigator.userAgent.match(/Mobi/) !== null;
    }

    // eslint-disable-next-line class-methods-use-this
    start() {
        console.info("start");
    }

    get mapTool() {
        return this._mapTool;
    }

    get navigationHelper() {
        return this._navigationHelper!;
    }

    setMapTool(mapTool: MapTool | undefined, activateOptions: any = undefined) {
        if (this._mapTool && !Object.is(this._mapTool, mapTool)) {
            this._mapTool.deactivate();
        }

        if (this._mapTool && Object.is(this._mapTool, mapTool)) {
            // already activated;
            return;
        }

        this._mapTool = mapTool;

        if (mapTool) {
            mapTool.activate(activateOptions);
        }
    }

    deactivateCurrentMapTool(deactivateOptions: any = undefined) {
        if (!this._mapTool) {
            return;
        }

        this._mapTool.deactivate(deactivateOptions);

        this._mapTool = undefined;
        this._mapToolDeactivated.raiseEvent();
    }

    onMapViewerCreated() {
        this._canvasEventHandler = new CanvasEventHandler({
            parent: this,
            scene: this.scene
        });

        this._canvasEventHandler.activate();

        const viewer = this.viewer;

        this._navigationHelper = new NavigationHelper({
            viewer: viewer
        });

        this._areaManager = new AreaManager({
            geoTech: this,
            scene: this.scene
        });
    }

    zoomToSite(site: Site) {
        const viewer = this.viewer;

        viewer.entities.values.forEach((entity) => {
            if (entity.properties && entity.properties.name && entity.properties.name.getValue() === site.entity_name) {
                viewer.zoomTo(entity, new HeadingPitchRange(viewer.scene.camera.heading, -0.1, 1000));
            }
        });
    }

    zoomToArea(area: Area) {
        const viewer = this.viewer;
        area.showHide(true);

        // Set the default pitch to 0 degrees
        const pitch = CesiumMath.toRadians(0);

        // Calculate the range to achieve an elevation of 109
        const targetElevation = 50; // Desired elevation
        const poiPosition = area.getPosition(new Cartesian3());
        const range = targetElevation; // Adjust range based on POI's elevation

        viewer.camera.flyToBoundingSphere(new BoundingSphere(poiPosition, 2), {
            offset: new HeadingPitchRange(0, pitch, range) // Heading: 0, Pitch: 0, Range: calculated
        });
    }
}
