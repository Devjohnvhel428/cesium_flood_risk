/* eslint-disable class-methods-use-this */

/* eslint-disable no-continue */
/* eslint-disable import/no-cycle */
import {
    BillboardCollection,
    BlendOption,
    Cartesian2,
    Event,
    Scene,
    ScreenSpaceEventHandler,
    ScreenSpaceEventType
} from "cesium";
import { GeoJsonGeometryTypes, Point } from "geojson";

import { GeoTech } from "./GeoTech";
import { WeatherType } from "./common";
import { Area, defaultHeight } from "./Area";

interface ConstructorOptions {
    geoTech: GeoTech;
    scene: Scene;
}

export class AreaManager {
    readonly _geoTech: GeoTech;

    readonly _scene: Scene;

    private _areaList: Area[];

    private _billboardCollection: BillboardCollection;

    private _filters: WeatherType[];

    private _currentArea: Area;

    readonly _weather: Event = new Event();

    constructor(options: ConstructorOptions) {
        this._geoTech = options.geoTech;
        this._areaList = [];
        this._scene = options.scene;

        const handler = new ScreenSpaceEventHandler(this._scene.canvas);

        handler.setInputAction((movement: { position: Cartesian2 }) => {
            // this.selectPOI(movement.position);
        }, ScreenSpaceEventType.LEFT_CLICK);

        this._billboardCollection = new BillboardCollection({
            blendOption: BlendOption.OPAQUE_AND_TRANSLUCENT
        });

        options.scene.primitives.add(this._billboardCollection);

        this._filters = [];

        this._filters.push(WeatherType.STATE_200);
    }

    get currentArea() {
        return this._currentArea;
    }

    set currentArea(area: Area | undefined) {
        this._currentArea = area;
    }

    addNewAreaWithProperties(properties: any) {
        const lng = Number(properties?.lon);
        const lat = Number(properties?.lat);

        const point = {
            type: "Point" as GeoJsonGeometryTypes,
            coordinates: [lng, lat, Number(defaultHeight)]
        };

        const area = new Area({
            point: point as Point,
            properties: properties,
            billboardCollection: this._billboardCollection
        });

        this._areaList.unshift(area);
        return area;
    }

    unsetCurrentArea() {
        if (this._currentArea) {
            this._currentArea.dehighlight();
        }

        this._currentArea = undefined;
    }

    cleanAreaList() {
        this._areaList.forEach((poiList) => {
            // poiList.clearPrimitives();
        });
        this._areaList = [];
        this._areaList = [];
        this._areaList = undefined;
        this._areaList = undefined;
    }

    getAreaByCityName(name: string) {
        for (let i = 0; i < this._areaList.length; i++) {
            const area = this._areaList[i];
            const properties = area.properties;
            if (!properties) {
                continue;
            }
            if (properties.city_name && properties.city_name === name) {
                return area;
            }
        }
        return undefined;
    }

    get filters() {
        return this._filters;
    }

    getClonedFilters() {
        const filters = [];

        for (let i = 0; i < this._filters.length; i++) {
            filters.push(this._filters[i]);
        }

        return filters;
    }

    allPois() {
        return this._areaList;
    }
}
