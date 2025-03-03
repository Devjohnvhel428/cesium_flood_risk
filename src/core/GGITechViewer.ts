/* eslint-disable import/no-cycle */
import { defined, DeveloperError, Event } from "cesium";
import { GGITech } from "./GGITech";
import { GGITechMapViewer } from "./GGITechMapViewer";

export class GGITechViewer {
    readonly ggiTech: GGITech;

    mapContainer: HTMLElement | undefined;

    ggiTechMapViewer: GGITechMapViewer | undefined;

    readonly mapViewerCreated = new Event();

    readonly mapViewerDestroyed = new Event();

    destroyingGGITechMapViewer: boolean = false;

    constructor(ggiTech: GGITech) {
        this.ggiTech = ggiTech;
    }

    get attached(): boolean {
        return this.mapContainer !== undefined;
    }

    createGGITechMapViewer() {
        console.info("createGGITechMapViewer");

        // preConditionStart
        if (defined(this.ggiTechMapViewer)) {
            throw new DeveloperError("ggiTechMapViewer already created!");
        }
        // preConditionEnd

        const root = document.getElementById(this.ggiTech.rootElementId);

        const cesiumContainer = document.createElement("div");

        cesiumContainer.style.width = "100%";
        cesiumContainer.style.height = "100%";

        root!.append(cesiumContainer);
        const ggiTechMapViewer = new GGITechMapViewer(cesiumContainer, this.ggiTech);

        this.ggiTechMapViewer = ggiTechMapViewer;

        this.mapViewerCreated.raiseEvent();

        return ggiTechMapViewer;
    }

    attach(mapContainer: HTMLElement) {
        // preConditionStart
        if (!defined(this.ggiTechMapViewer)) {
            throw new DeveloperError("ggiTechMapViewer required!");
        }
        // preConditionEnd

        this.mapContainer = mapContainer;

        // move from root to this.mapContainer
        this.mapContainer.append(this.ggiTechMapViewer!.viewer.container);
    }

    detach() {
        if (!this.mapContainer) {
            return;
        }

        // Detach from a container
        if (this.mapContainer.contains(this.ggiTechMapViewer!.viewer.container)) {
            this.mapContainer?.removeChild(this.ggiTechMapViewer!.viewer.container);
        }

        this.destroyMapViewer();

        this.mapContainer = undefined;
    }

    private destroyMapViewer() {
        if (this.destroyingGGITechMapViewer) {
            return;
        }

        this.destroyingGGITechMapViewer = true;

        const cesiumViewer = this.ggiTechMapViewer?.viewer;

        cesiumViewer?.destroy();
        this.mapViewerDestroyed.raiseEvent();

        this.ggiTechMapViewer = undefined;
        this.destroyingGGITechMapViewer = false;
    }
}
