// q@ts-nocheck
/* qeslint-disable */
import { Dispatch } from "react";
import { Weather } from "../state";
import { setVisibleCloud, setWeather } from "./weatherReducer";

export const setSettingsVisibleCloud = (value: boolean) => async (dispatch: Dispatch<any>) =>
    dispatch(setVisibleCloud(value));

export const setWeatherData = (value: Weather) => async (dispatch: Dispatch<any>) => dispatch(setWeather(value));
