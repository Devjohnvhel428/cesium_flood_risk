// qts-nocheck
/* qeslint-disable */
import {
    Billboard,
    BlendOption,
    Camera,
    Cartesian2,
    Cartesian3,
    defined,
    DeveloperError,
    HeadingPitchRoll,
    HorizontalOrigin,
    Ion,
    Math as CesiumMath,
    Matrix4,
    Label,
    LabelCollection,
    LabelStyle,
    Rectangle,
    // @ts-ignore
    subscribeAndEvaluate,
    // @ts-ignore
    createDefaultImageryProviderViewModels,
    ProviderViewModel,
    Primitive,
    ScreenSpaceEventHandler,
    ScreenSpaceEventType,
    VerticalOrigin,
    Viewer,
    Color
} from "cesium";
import viewerCesiumNavigationMixin from "./cesium-navigation-es6/viewerCesiumNavigationMixin";
import { GeoTech } from "./GeoTech";
import { defaultHeight } from "./Area";
import { CapturedCameraProps } from "./common";

export class GeoTechMapViewer {
    private readonly _geoTech: GeoTech;

    private readonly _viewer: Viewer;

    private _customTimePrimitive: Primitive | null = null;

    private _currentCameraProps: CapturedCameraProps | null = null;

    private _baseImageryProviders: any;

    private _hoverLabel: Label;

    constructor(container: HTMLElement, geoTech: GeoTech) {
        // >>includeStart('debug', pragmas.debug);
        if (!defined(container)) {
            throw new DeveloperError("container is required.");
        }

        Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN;

        const extent = Rectangle.fromDegrees(115.0, 5.0, 130.0, 20.0);
        Camera.DEFAULT_VIEW_RECTANGLE = extent;
        Camera.DEFAULT_VIEW_FACTOR = 0.03;

        this._geoTech = geoTech;

        this._baseImageryProviders = createDefaultImageryProviderViewModels();
        const selectedImageryProviderIndex = 0;

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
        const scene = viewer.scene;

        scene.globe.show = true;
        scene.skyAtmosphere.show = true;
        scene.highDynamicRange = true;

        // make sure user shows blue sky
        scene.globe.enableLighting = false;
        scene.globe.atmosphereLightIntensity = 20.0;

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

        camera.moveStart.addEventListener(() => {
            if (this._hoverLabel) {
                this._hoverLabel.show = false;
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

        const labelCollection = new LabelCollection({
            blendOption: BlendOption.OPAQUE_AND_TRANSLUCENT
        });

        scene.primitives.add(labelCollection);

        this._hoverLabel = labelCollection.add({
            show: false,
            text: "",
            horizontalOrigin: HorizontalOrigin.CENTER,
            verticalOrigin: VerticalOrigin.BOTTOM,
            position: Cartesian3.fromDegrees(0, 0, 0),
            eyeOffset: new Cartesian3(0, 0, 0),
            scale: 0.8,
            fillColor: Color.YELLOW,
            outlineColor: Color.BLACK,
            outlineWidth: 2,
            style: LabelStyle.FILL_AND_OUTLINE,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
        });

        const handler = new ScreenSpaceEventHandler(scene.canvas);

        handler.setInputAction((movement: { endPosition: Cartesian2 }) => {
            const pickedObject = scene.pick(movement.endPosition);

            if (!pickedObject) {
                this._hoverLabel.show = false;
                return;
            }

            if (!pickedObject.primitive) {
                this._hoverLabel.show = false;
                return;
            }

            const primitive = pickedObject.primitive;

            if (!(primitive instanceof Billboard)) {
                this._hoverLabel.show = false;
                return;
            }

            const id = primitive.id;

            const area = this._geoTech.areaManager.getAreaByCityName(id);

            const longitude = area.longitude;
            const latitude = area.latitude;
            const height = defaultHeight;

            this._hoverLabel.position = Cartesian3.fromDegrees(longitude, latitude, height);
            this._hoverLabel.text = `${area.name} : ${area.geWeatherStatus()}`;
            this._hoverLabel.show = true;
        }, ScreenSpaceEventType.MOUSE_MOVE);
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
