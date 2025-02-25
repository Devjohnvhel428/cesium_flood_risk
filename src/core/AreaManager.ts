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

        this._filters.push(WeatherType.STATE_000);
        this._filters.push(WeatherType.STATE_200);
        this._filters.push(WeatherType.STATE_300);
        this._filters.push(WeatherType.STATE_500);
        this._filters.push(WeatherType.STATE_600);
        this._filters.push(WeatherType.STATE_700);
        this._filters.push(WeatherType.STATE_800);
        this._filters.push(WeatherType.STATE_801);
        this._filters.push(WeatherType.STATE_900);
    }

    get currentArea() {
        return this._currentArea;
    }

    set currentArea(area: Area | undefined) {
        this._currentArea = area;
    }

    get filters() {
        return this._filters;
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

    setFilterWithCondition(type: WeatherType) {
        for (let i = 0; i < this._areaList.length; i++) {
            this._areaList[i].showHide(true);
        }

        if (type === WeatherType.STATE_000) {
            return;
        }

        if (type === WeatherType.STATE_200) {
            for (let i = 0; i < this._areaList.length; i++) {
                const area = this._areaList[i];
                const code = Number(area.properties?.weather?.code) | 0;
                if (code >= 200 && code < 300) {
                    continue;
                } else {
                    area.showHide(false);
                }
            }
            return;
        }

        if (type === WeatherType.STATE_300) {
            for (let i = 0; i < this._areaList.length; i++) {
                const area = this._areaList[i];
                const code = Number(area.properties?.weather?.code) | 0;
                if (code >= 300 && code < 400) {
                    continue;
                } else {
                    area.showHide(false);
                }
            }
            return;
        }

        if (type === WeatherType.STATE_500) {
            for (let i = 0; i < this._areaList.length; i++) {
                const area = this._areaList[i];
                const code = Number(area.properties?.weather?.code) | 0;
                if (code >= 500 && code < 600) {
                    continue;
                } else {
                    area.showHide(false);
                }
            }
            return;
        }

        if (type === WeatherType.STATE_600) {
            for (let i = 0; i < this._areaList.length; i++) {
                const area = this._areaList[i];
                const code = Number(area.properties?.weather?.code) | 0;
                if (code >= 600 && code < 700) {
                    continue;
                } else {
                    area.showHide(false);
                }
            }
            return;
        }

        if (type === WeatherType.STATE_700) {
            for (let i = 0; i < this._areaList.length; i++) {
                const area = this._areaList[i];
                const code = Number(area.properties?.weather?.code) | 0;
                if (code >= 700 && code < 800) {
                    continue;
                } else {
                    area.showHide(false);
                }
            }
            return;
        }

        if (type === WeatherType.STATE_800) {
            for (let i = 0; i < this._areaList.length; i++) {
                const area = this._areaList[i];
                const code = Number(area.properties?.weather?.code) | 0;
                if (code !== 800) {
                    area.showHide(false);
                }
            }
            return;
        }

        if (type === WeatherType.STATE_801) {
            for (let i = 0; i < this._areaList.length; i++) {
                const area = this._areaList[i];
                const code = Number(area.properties?.weather?.code) | 0;
                if (code >= 801 && code < 900) {
                    continue;
                } else {
                    area.showHide(false);
                }
            }
            return;
        }

        if (type === WeatherType.STATE_900) {
            for (let i = 0; i < this._areaList.length; i++) {
                const area = this._areaList[i];
                const code = Number(area.properties?.weather?.code) | 0;
                if (code !== 900) {
                    area.showHide(false);
                }
            }
            return;
        }
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

    dehighlightAll() {
        for (let i = 0; i < this._areaList.length; i++) {
            const area = this._areaList[i];
            area.dehighlight();
        }
    }
}
