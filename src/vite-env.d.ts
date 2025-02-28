interface ImportMetaEnv {
    readonly VITE_USER_EMAIL: string;
    readonly VITE_USER_NAME: string;
    readonly VITE_CESIUM_TOKEN: string;
    readonly VITE_NODE_ENV: string;
    readonly VITE_WEATHER_API_KEY: string;
    readonly VITE_USE_MOCKDATA: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
