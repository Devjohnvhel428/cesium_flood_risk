// q@ts-nocheck
/* qeslint-disable */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "../state";

export const appSlice = createSlice({
    name: "app",
    initialState: {
        loading: false,
        user: undefined,
        error: null
    } as AppState,
    reducers: {
        setErrorData: (state, { payload }: PayloadAction<string>) => {
            state.error = payload;
        },
        clearErrorData: (state) => {
            state.error = null;
        }
    }
});

export const { setErrorData, clearErrorData } = appSlice.actions;

export default appSlice.reducer;
