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
    Entity,
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
import { Area, defaultHeight } from "./Area";
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
                this._geoTech.areaManager.dehighlightAll();
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
            area.highlight();
        }, ScreenSpaceEventType.MOUSE_MOVE);

        //Mouse Click for detailed
        handler.setInputAction((movement: ScreenSpaceEventHandler.PositionedEvent) => {
            const pickedObject = scene.pick(movement.position);
            const selectedEntity = new Entity();

            if (!pickedObject) {
                this._geoTech.areaManager.dehighlightAll();
                return;
            }

            if (!pickedObject.primitive) {
                return;
            }

            const primitive = pickedObject.primitive;

            if (!(primitive instanceof Billboard)) {
                return;
            }

            const id = primitive.id;
            const area = this._geoTech.areaManager.getAreaByCityName(id);
            this.showPropertyTable(area);
        }, ScreenSpaceEventType.LEFT_CLICK);
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

    getPropertyTable(properties: any) {
        const propertyTable =
            `${
                '<table class="cesium-infoBox-defaultTable"><tbody>' + "<tr><th>City name</th><td>"
            }${properties?.city_name}</td></tr>` +
            `<tr><th>Latitude</th><td>${properties?.lat}</td></tr>` +
            `<tr><th>Longitude</th><td>${properties?.lon}</td></tr>` +
            `<tr><th>Weather</th><td>${properties?.weather?.description}</td></tr>` +
            `<tr><th>Visibility - default (M)</th><td>${properties?.vis}</td></tr>` +
            `<tr><th>Relative humidity</th><td>${properties?.rh}</td></tr>` +
            `<tr><th>Dew point temperature - default (C)</th><td>${properties?.dewpt}</td></tr>` +
            `<tr><th>Wind direction (degrees)</th><td>${properties?.wind_dir}</td></tr>` +
            `<tr><th>Cardinal wind direction</th><td>${properties?.wind_cdir}</td></tr>` +
            `<tr><th>Cardinal wind direction(text)</th><td>${properties?.wind_cdir_full}</td></tr>` +
            `<tr><th>Wind speed - Default (m/s)</th><td>${properties?.wind_speed}</td></tr>` +
            `<tr><th>Wind gust speed - Default (m/s)</th><td>${properties?.gust}</td></tr>` +
            `<tr><th>Temperature - Default (C)</th><td>${properties?.temp}</td></tr>` +
            `<tr><th>Apparent temperature - Default (C)</th><td>${properties?.app_temp}</td></tr>` +
            `<tr><th>Cloud cover (%)</th><td>${properties?.clouds}</td></tr>` +
            `<tr><th>Full time (UTC) of observation</th><td>${properties?.ob_time}</td></tr>` +
            `<tr><th>Mean sea level pressure in millibars (mb)</th><td>${properties?.slp}</td></tr>` +
            `<tr><th>Pressure (mb)</th><td>${properties?.pres}</td></tr>` +
            `<tr><th>Air quality index (US EPA standard 0 to +500)</th><td>${properties?.aqi}</td></tr>` +
            `<tr><th>Estimated solar radiation (W/m^2)</th><td>${properties?.solar_rad}</td></tr>` +
            `<tr><th>Global horizontal irradiance (W/m^2)</th><td>${properties?.ghi}</td></tr>` +
            `<tr><th>Direct normal irradiance (W/m^2)</th><td>${properties?.dni}</td></tr>` +
            `<tr><th>Diffuse horizontal irradiance (W/m^2)</th><td>${properties?.dhi}</td></tr>` +
            `<tr><th>Current solar elevation angle (Degrees)</th><td>${properties?.elev_angle}</td></tr>` +
            `<tr><th>Current solar hour angle (Degrees)</th><td>${properties?.hour_angle}</td></tr>` +
            `<tr><th>Part of the day</th><td>${properties?.pod}</td></tr>` +
            `<tr><th>Precipitation in last hour - Default (mm)</th><td>${properties?.precip}</td></tr>` +
            `<tr><th>Snowfall in last hour - Default (mm)</th><td>${properties?.snow}</td></tr>` +
            `</tbody></table>`;
        return propertyTable;
    }

    showPropertyTable(area: Area) {
        const selectedEntity = new Entity();
        this._viewer.selectedEntity = selectedEntity;
        /* @ts-ignore */
        selectedEntity.description = this.getPropertyTable(area.properties);
    }
}
