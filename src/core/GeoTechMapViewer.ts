// qts-nocheck
/* qeslint-disable */
import {
    Camera,
    Cartesian3,
    Cesium3DTileset,
    defined,
    DeveloperError,
    Ion,
    Math as CesiumMath,
    Matrix4,
    HeadingPitchRoll,
    Rectangle,
    Viewer,
    // @ts-ignore
    subscribeAndEvaluate,
    // @ts-ignore
    createDefaultImageryProviderViewModels,
    ProviderViewModel,
    Primitive
} from "cesium";
import viewerCesiumNavigationMixin from "./cesium-navigation-es6/viewerCesiumNavigationMixin";
import { GeoTech } from "./GeoTech";
import { CapturedCameraProps } from "./common";

export class GeoTechMapViewer {
    private readonly _geoTech: GeoTech;
    private readonly _viewer: Viewer;
    private _customTimePrimitive: Primitive | null = null;
    private _currentCameraProps: CapturedCameraProps | null = null;
    private _baseImageryProviders: any;

    constructor(container: HTMLElement, geoTech: GeoTech) {
        // >>includeStart('debug', pragmas.debug);
        if (!defined(container)) {
            throw new DeveloperError("container is required.");
        }

        Ion.defaultAccessToken =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjYWYyMmUwNS01OGQ0LTQ1ZGUtYjNmZS02Yjg3ZDU2ODE5NjgiLCJpZCI6MjUzNTAxLCJpYXQiOjE3MzA5NjE3NTZ9.oqprAFaWJxd4fhrWHNGkwoLGpNXLe4DkxoKx9YJXxUQ";

        const extent = Rectangle.fromDegrees(115.0, 5.0, 130.0, 20.0);
        Camera.DEFAULT_VIEW_RECTANGLE = extent;
        Camera.DEFAULT_VIEW_FACTOR = 0;

        this._geoTech = geoTech;

        this._baseImageryProviders = createDefaultImageryProviderViewModels();
        const selectedImageryProviderIndex = 1;

        this._viewer = new Viewer(container, {
            timeline: false,
            fullscreenButton: false,
            sceneModePicker: false,
            navigationHelpButton: true,
            geocoder: false,
            homeButton: false,
            animation: false,
            baseLayerPicker: true,
            selectionIndicator: false,
            requestRenderMode: true,
            shouldAnimate: true,
            scene3DOnly: true,
            // @ts-ignore
            selectedImageryProviderViewModel: this._baseImageryProviders
                ? this._baseImageryProviders[selectedImageryProviderIndex]
                : undefined,
            // @ts-ignore
            imageryProviderViewModels: this._baseImageryProviders
        });

        const viewer = this._viewer;

        const providerViewModels: ProviderViewModel[] = [];

        const removeMapsList = [
            "Blue Marble",
            "Earth at night",
            "ArcGIS World Hillshade",
            "Esri World Ocean",
            "Stamen Watercolor",
            "Stamen Toner"
        ];

        viewer.baseLayerPicker.viewModel.imageryProviderViewModels.forEach((viewModel) => {
            if (!removeMapsList.includes(viewModel.name)) {
                if (viewModel.name === "Bing Maps Aerial") {
                    viewModel.name = "Google 3d";
                }

                providerViewModels.push(viewModel);
            }
        });

        viewer.baseLayerPicker.viewModel.imageryProviderViewModels = providerViewModels;

        subscribeAndEvaluate(viewer.baseLayerPicker.viewModel, "selectedImagery", (newValue: ProviderViewModel) => {
            if (newValue.name !== "Google 3d") {
                this._currentCameraProps = this.getCurrentCameraProps();

                if (this._customTimePrimitive) {
                    this._customTimePrimitive.show = false;
                }
            } else if (this._customTimePrimitive) {
                this._customTimePrimitive.show = true;
            }
        });

        /**
         * we can hide the globe but if we do so, user can not show blue sky
         */
        viewer.scene.globe.show = true;
        viewer.scene.skyAtmosphere.show = true;
        viewer.scene.highDynamicRange = true;

        // make sure user shows blue sky
        viewer.scene.globe.enableLighting = false;
        viewer.scene.globe.atmosphereLightIntensity = 20.0;

        const camera = viewer.camera;
        camera.percentageChanged = 0.01; // default

        camera.changed.addEventListener(() => {
            const pitch = CesiumMath.toDegrees(viewer.camera.pitch);

            if (pitch > -15) {
                camera.setView({
                    destination: camera.positionWC,
                    orientation: new HeadingPitchRoll(camera.heading, CesiumMath.toRadians(-15), camera.roll),
                    endTransform: Matrix4.IDENTITY
                });
            }
        });

        if (viewerCesiumNavigationMixin) {
            const options = {
                enableCompass: true,
                enableZoomControls: false,
                enableDistanceLegend: false,
                enableCompassOuterRing: true,
                defaultResetView: extent
            };

            viewerCesiumNavigationMixin(viewer, options);
        }
    }

    get viewer() {
        return this._viewer;
    }

    get customTimePrimitive() {
        return this._customTimePrimitive;
    }

    set customTimePrimitive(val: Primitive) {
        this._customTimePrimitive = val;
    }

    getCurrentCameraProps() {
        const camera = this._viewer.scene.camera;
        const position = Cartesian3.clone(camera.positionWC);
        const heading = camera.heading;
        const pitch = camera.pitch;
        const roll = camera.roll;

        const item: CapturedCameraProps = {
            position: position,
            heading: heading,
            pitch: pitch,
            roll: roll
        };

        return item;
    }
}
