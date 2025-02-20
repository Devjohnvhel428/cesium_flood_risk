/* eslint-disable camelcase */
import { Cartesian3 } from "cesium";

export interface Site {
    city: string;
    entity_name: string;
    entity_number: string;
    state: string;
    zip_code: string;
}

export interface CapturedCameraProps {
    position: Cartesian3;
    heading: number;
    pitch: number;
    roll: number;
}

// errHeightOfGoogle3DTiles = (actual height) - (height of google 3d tiles)
export const errHeightOfGoogle3DTiles = 0;
