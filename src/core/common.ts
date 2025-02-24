/* eslint-disable camelcase */
import { Cartesian3 } from "cesium";

export enum WeatherType {
    STATE_200 = "Thunderstorm with light rain",
    STATE_201 = "Thunderstorm with rain",
    STATE_202 = "Thunderstorm with heavy rain",
    STATE_230 = "Thunderstorm with light drizzle",
    STATE_231 = "Thunderstorm with drizzle",
    STATE_232 = "Thunderstorm with heavy drizzle",
    STATE_233 = "Thunderstorm with light rain",
    STATE_300 = "Light Drizzle",
    STATE_301 = "Drizzle",
    STATE_302 = "Heavy Drizzle",
    STATE_500 = "Light Rain",
    STATE_501 = "Moderate Rain",
    STATE_502 = "Heavy Rain",
    STATE_511 = "Freezing rain",
    STATE_520 = "Light shower rain",
    STATE_521 = "Shower rain",
    STATE_522 = "Heavy shower rain",
    STATE_600 = "Light snow",
    STATE_601 = "Snow",
    STATE_602 = "Heavy Snow",
    STATE_610 = "Mix snow/rain",
    STATE_611 = "Sleet",
    STATE_612 = "Heavy sleet",
    STATE_621 = "Snow shower",
    STATE_622 = "Heavy snow shower",
    STATE_623 = "Flurries",
    STATE_700 = "Mist",
    STATE_711 = "Smoke",
    STATE_721 = "Haze",
    STATE_731 = "Sand/dust",
    STATE_741 = "Fog",
    STATE_751 = "Freezing Fog",
    STATE_800 = "Clear sky",
    STATE_801 = "Few clouds",
    STATE_802 = "Scattered clouds",
    STATE_803 = "Broken clouds",
    STATE_804 = "Overcast clouds",
    STATE_900 = "Unknown Precipitation"
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
