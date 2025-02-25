/* qeslint-disable*/
import { BoundingSphere, Cartesian3, HeadingPitchRange, Event, Math as CesiumMath } from "cesium";
import { GeoTechViewer } from "./GeoTechViewer";
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

    zoomToArea(area: Area) {
        const viewer = this.viewer;
        area.showHide(true);

        // Set the pitch to 90 degrees for a vertical (top-down) view
        const pitch = CesiumMath.toRadians(-90);

        // Calculate a higher range for a city-wide view
        const targetElevation = 2000; // Adjust this value for a higher elevation suitable for a city
        const poiPosition = area.getPosition(new Cartesian3());
        const range = targetElevation; // Use a larger range for a wider view

        // Fly the camera to the area with a vertical view
        viewer.camera.flyToBoundingSphere(new BoundingSphere(poiPosition, 2000), {
            offset: new HeadingPitchRange(0, pitch, range), // Heading: 0, Pitch: -90 (vertical), Range: calculated
            duration: 2.0, // Optional: Adjust the duration of the camera animation
            complete: () => {
                this.mapViewer.showPropertyTable(area);
            }
        });
    }
}
