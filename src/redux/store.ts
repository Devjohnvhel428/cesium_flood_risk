// q@ts-nocheck
/* qeslint-disable */
import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import appReducer from "./app/appReducer";
import weatherReducer from "./weather/weatherReducer";

let loggerEnabled = false;

document.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.altKey && event.key.toLowerCase() === "l") {
        loggerEnabled = !loggerEnabled;
    }
});

const logger = createLogger({ predicate: () => loggerEnabled });

const store = configureStore({
    reducer: {
        app: appReducer,
        weather: weatherReducer
    },
    middleware: (getDefaultMiddleware) => {
        const defaultMiddlewares = getDefaultMiddleware({
            serializableCheck: false
        });

        if (import.meta.env.VITE_NODE_ENV === "development") {
            // @ts-ignore
            return defaultMiddlewares.concat(logger);
        }

        return defaultMiddlewares;
    }
});

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;

export default store;
