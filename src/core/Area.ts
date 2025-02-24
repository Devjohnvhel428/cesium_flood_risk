import { Billboard, BillboardCollection, Cartesian2, Cartesian3, Event } from "cesium";
import { Point } from "geojson";
import { WeatherType, CapturedCameraProps } from "./common";

interface WeatherConstructorOptions {
    point: Point;
    properties: any;
    billboardCollection: BillboardCollection;
}

export const defaultHeight = 10;
export class Area {
    private _longitude: number; // in degree

    private _latitude: number;

    private _cameraProps: CapturedCameraProps;

    private _options: WeatherConstructorOptions;

    private _type: WeatherType;

    private readonly _billboard: Billboard;

    private _removeEvent: Event.RemoveCallback | undefined;

    private readonly _properties: any;

    constructor(options: WeatherConstructorOptions) {
        this._options = options;
        const point = options.point;

        const longitude = point.coordinates[0];
        const latitude = point.coordinates[1];

        this._longitude = longitude;
        this._latitude = latitude;

        this._cameraProps = null;

        const code = options.properties?.weather?.code;
        if (code) {
            const type_key = `STATE_${code}` as keyof typeof WeatherType;
            this._type = WeatherType[type_key];
        } else {
            this._type = WeatherType.STATE_900;
        }

        const icon = options.properties?.weather?.icon;

        let marker = "";
        if (icon) {
            marker = `https://cdn.weatherbit.io/static/img/icons/${icon}.png`;
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

    get billboard() {
        return this._billboard;
    }

    get cameraProps() {
        return this._cameraProps;
    }

    set cameraProps(props: CapturedCameraProps) {
        this._cameraProps = props;
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
    }

    getShow() {
        return this._billboard.show;
    }

    geWeatherStatus() {
        return this._properties?.weather?.description;
    }
}
