// q@ts-nocheck
/* qeslint-disable */

export interface AppState {
    loading: boolean;
    error: string | null;
}

export interface Weather {
    current: any[];
    alerts: any[];
}

export interface WeatherState {
    visibleCloud: boolean;
    weather: Weather;
}
