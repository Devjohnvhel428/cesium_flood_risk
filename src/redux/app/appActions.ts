// q@ts-nocheck
/* qeslint-disable */
import { Dispatch } from "react";
import { setErrorData, clearErrorData } from "./appReducer";

export const sendError = (error: string) => async (dispatch: Dispatch<any>) => dispatch(setErrorData(error));

export const clearError = () => async (dispatch: Dispatch<any>) => dispatch(clearErrorData());
