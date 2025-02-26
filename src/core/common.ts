/* eslint-disable camelcase */
import { Cartesian3 } from "cesium";

export enum WeatherType {
    STATE_000 = "All",
    STATE_200 = "Thunderstorm",
    STATE_300 = "Drizzle",
    STATE_500 = "Rain",
    STATE_600 = "Snow",
    STATE_700 = "Mist",
    STATE_800 = "Clear sky",
    STATE_801 = "Clouds",
    STATE_900 = "Unknown Precipitation"
}

export enum AlertType {
    ALERT_000 = "No Alert",
    ALERT_1000 = "Flood Alert"
}

export interface InlineWeatherModel {
    icon: string; // Icon code for forecast image display
    code: number; // Weather Condition code
    description: string; // Weather Condition description
}

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
