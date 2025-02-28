// q@ts-nocheck
/* qeslint-disable */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { WeatherState, Weather } from "../state";

export const weatherSlice = createSlice({
    name: "weather",
    initialState: {
        visibleCloud: false
    } as WeatherState,
    reducers: {
        setVisibleCloud: (state, { payload }: PayloadAction<boolean>) => {
            state.visibleCloud = payload;
        },
        setWeather: (state, { payload }: PayloadAction<Weather>) => {
            state.weather = payload;
        }
    }
});

export const { setVisibleCloud, setWeather } = weatherSlice.actions;

export const getWeatherVisibleCloud = (state: RootState) => state.weather.visibleCloud;
export const getWeather = (state: RootState) => state.weather.weather;

export default weatherSlice.reducer;
