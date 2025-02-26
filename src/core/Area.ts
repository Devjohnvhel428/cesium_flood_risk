import {
    Billboard,
    BillboardCollection,
    Cartesian2,
    Cartesian3,
    Color,
    DistanceDisplayCondition,
    Entity,
    EntityCollection,
    Event,
    Math as CesiumMath,
    PolygonHierarchy
} from "cesium";
import { Point } from "geojson";
import { AlertType, WeatherType, CapturedCameraProps } from "./common";
import markerAlert from "../assets/images/flood_alert.png";

interface WeatherConstructorOptions {
    point: Point;
    properties: any;
    billboardCollection: BillboardCollection;
}

export const defaultHeight = 10;
export class Area {
    private _longitude: number; // in degree

    private _latitude: number;

    private _minLongitude: number;

    private _minLatitude: number;

    private _maxLongitude: number;

    private _maxLatitude: number;

    private _cameraProps: CapturedCameraProps;

    private _options: WeatherConstructorOptions;

    private _type: WeatherType;

    private _alertType: AlertType;

    private _alert: any;

    private readonly _billboard: Billboard;

    private cityRange: Entity | undefined;

    private _removeEvent: Event.RemoveCallback | undefined;

    private readonly _properties: any;

    constructor(options: WeatherConstructorOptions) {
        this._options = options;
        const point = options.point;

        const longitude = point.coordinates[0];
        const latitude = point.coordinates[1];

        this._longitude = longitude;
        this._latitude = latitude;
        this._minLatitude = this._maxLatitude = latitude;
        this._minLongitude = this._maxLongitude = longitude;

        this._cameraProps = null;

        const code = options.properties?.weather?.code;
        if (code) {
            const type_key = `STATE_${code}` as keyof typeof WeatherType;
            this._type = WeatherType[type_key];
        } else {
            this._type = WeatherType.STATE_900;
        }

        this._alertType = AlertType.ALERT_000;

        const icon = options.properties?.weather?.icon;

        let marker = "";
        if (icon) {
            if (icon === "c01d") {
                marker = `https://img.icons8.com/?size=48&id=8EUmYhfLPTCF&format=png`;
            } else if (icon === "c01n") {
                marker = `https://img.icons8.com/?size=48&id=6DXM8bs2tFSU&format=png`;
            } else {
                marker = `https://cdn.weatherbit.io/static/img/icons/${icon}.png`;
            }
        } else {
            marker = `https://cdn.weatherbit.io/static/img/icons/u00d.png`;
        }

        this._billboard = options.billboardCollection.add({
            id: options.properties.city_name,
            position: Cartesian3.fromDegrees(longitude, latitude, 10),
            image: marker,
            pixelOffset: new Cartesian2(0, -20),
            width: 50,
            height: 50,
            scale: 0.8
        });
        this._properties = options.properties;
    }

    get properties() {
        return this._properties;
    }

    get longitude() {
        return this._longitude;
    }

    get latitude() {
        return this._latitude;
    }

    get minLongitude() {
        return this._minLongitude;
    }

    set minLongitude(val: number) {
        this._minLongitude = val;
    }

    get maxLongitude() {
        return this._maxLongitude;
    }

    set maxLongitude(val: number) {
        this._maxLongitude = val;
    }

    get minLatitude() {
        return this._minLatitude;
    }

    set minLatitude(val: number) {
        this._minLatitude = val;
    }

    get maxLatitude() {
        return this._maxLatitude;
    }

    set maxLatitude(val: number) {
        this._maxLatitude = val;
    }

    get billboard() {
        return this._billboard;
    }

    get cameraProps() {
        return this._cameraProps;
    }

    set cameraProps(props: CapturedCameraProps) {
        this._cameraProps = props;
    }

    get alertType() {
        return this._alertType;
    }

    get alert() {
        return this._alert;
    }

    set alert(val: any) {
        this._alert = val;
    }

    highlight() {
        this._billboard.scale = 1;
    }

    dehighlight() {
        this._billboard.scale = 0.8;
    }

    get name() {
        return this._properties!.city_name;
    }

    getPosition(result: Cartesian3) {
        Cartesian3.clone(this._billboard.position, result);

        return result;
    }

    getType() {
        return this._properties!.Marker!;
    }

    showHide(show: boolean) {
        this._billboard.show = show;
        if (this.cityRange) {
            this.cityRange.show = show;
        }
    }

    getShow() {
        return this._billboard.show;
    }

    getWeatherStatus() {
        return this._properties?.weather?.description;
    }

    setAlert(alert: any) {
        this._alertType = AlertType.ALERT_1000;
        this._alert = alert;
        this._billboard.image = markerAlert;
    }

    drawCityRange() {
        const radius = this.getRadius(this._minLongitude, this._minLatitude, this._maxLongitude, this._maxLatitude, 0);
        const circlePositions = Cartesian3.fromDegreesArray(
            this.generateCirclePoints(this._longitude, this._latitude, radius)
        );
        const geoTech = window.geoTech;
        this.cityRange = geoTech.viewer.entities.add({
            polygon: {
                hierarchy: new PolygonHierarchy(circlePositions),
                material: Color.RED.withAlpha(0.1), // Semi-transparent red
                outline: true,
                outlineColor: Color.RED,
                distanceDisplayCondition: new DistanceDisplayCondition(0, 1e6)
            }
        });
    }

    generateCirclePoints(centerLon, centerLat, radius) {
        const positions = [];
        const numPoints = 360; // Number of points to approximate the circle
        for (let i = 0; i < numPoints; i++) {
            const angle = CesiumMath.toRadians(i); // Convert degrees to radians
            const lon = centerLon + (radius / 111319) * Math.cos(angle); // Adjust longitude
            const lat = centerLat + (radius / 111319) * Math.sin(angle); // Adjust latitude
            positions.push(lon, lat);
        }
        return positions;
    }

    getRadius(minX, minY, maxX, maxY, height = 0) {
        const minCartesian = Cartesian3.fromDegrees(minX, minY, height);
        const maxCartesian = Cartesian3.fromDegrees(maxX, maxY, height);

        // Calculate the center and radius
        const centerCartesian = Cartesian3.midpoint(minCartesian, maxCartesian, new Cartesian3());
        const radius = Cartesian3.distance(centerCartesian, maxCartesian);
        return radius;
    }
}
