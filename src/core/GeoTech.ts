/* qeslint-disable*/
import { HeadingPitchRange, Event } from "cesium";
import { GeoTechViewer } from "./GeoTechViewer";
import { Site } from "./common";
import { CanvasEventHandler } from "./CanvasEventHandler";
import { MapTool } from "./MapTool";
import APIInterface from "./APIInterface";
import UIManager from "./UIManager";
import NavigationHelper from "./NavigationHelper";

export class GeoTech {
    readonly rootElementId = "root";
    readonly mainViewer = new GeoTechViewer(this);
    readonly apiInterface = new APIInterface();
    private _mapTool: MapTool | undefined;
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
    }

    zoomToSite(site: Site) {
        const viewer = this.viewer;

        viewer.entities.values.forEach((entity) => {
            if (entity.properties && entity.properties.name && entity.properties.name.getValue() === site.entity_name) {
                viewer.zoomTo(entity, new HeadingPitchRange(viewer.scene.camera.heading, -0.1, 1000));
            }
        });
    }
}
