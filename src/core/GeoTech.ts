/* qeslint-disable*/
import { HeadingPitchRange, Event } from "cesium";
import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
import { GeoTechViewer } from "./GeoTechViewer";
import { Site } from "./common";
import { CanvasEventHandler } from "./CanvasEventHandler";
import { MapTool } from "./MapTool";
import APIInterface from "./APIInterface";
import UIManager from "./UIManager";
import NavigationHelper from "./NavigationHelper";

const USER_SETTINGS_TABLE = "user_settings";

export class GeoTech {
    readonly rootElementId = "root";
    readonly mainViewer = new GeoTechViewer(this);
    readonly apiInterface = new APIInterface();
    private _mapTool: MapTool | undefined;
    private _canvasEventHandler: CanvasEventHandler | undefined;

    protected readonly _mapToolDeactivated: Event = new Event();

    private _currentUser: User | undefined;
    private readonly _supabase: SupabaseClient;
    public uiManager = new UIManager();
    private _navigationHelper: NavigationHelper | undefined;

    constructor() {
        this._supabase = createClient(
            "https://csjlfktyrihyyhyxmpku.supabase.co",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzamxma3R5cmloeXloeXhtcGt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY4MzQ0NzAsImV4cCI6MjA0MjQxMDQ3MH0.jrRGYW_abfS9vZHmxEbhF57ef1RvdROcNRUvtuLXoLQ"
        );

        this._canvasEventHandler = undefined;

        this.mainViewer.mapViewerCreated.addEventListener(() => {
            this.onMapViewerCreated();
        });
    }

    get currentUser() {
        return this._currentUser;
    }

    set currentUser(user: User | undefined) {
        this._currentUser = user;
    }

    get supabase() {
        return this._supabase;
    }

    get viewer() {
        return this.mainViewer.geoTechMapViewer!.viewer;
    }

    get mapViewer() {
        return this.mainViewer.geoTechMapViewer!;
    }

    get scene() {
        return this.viewer.scene;
    }

    get mapToolDeactivated() {
        return this._mapToolDeactivated;
    }

    isMobile() {
        return "ontouchstart" in document.documentElement && navigator.userAgent.match(/Mobi/) !== null;
    }

    // eslint-disable-next-line class-methods-use-this
    start() {
        console.info("start");
    }

    get mapTool() {
        return this._mapTool;
    }

    get navigationHelper() {
        return this._navigationHelper!;
    }

    setMapTool(mapTool: MapTool | undefined, activateOptions: any = undefined) {
        if (this._mapTool && !Object.is(this._mapTool, mapTool)) {
            this._mapTool.deactivate();
        }

        if (this._mapTool && Object.is(this._mapTool, mapTool)) {
            // already activated;
            return;
        }

        this._mapTool = mapTool;

        if (mapTool) {
            mapTool.activate(activateOptions);
        }
    }

    deactivateCurrentMapTool(deactivateOptions: any = undefined) {
        if (!this._mapTool) {
            return;
        }

        this._mapTool.deactivate(deactivateOptions);

        this._mapTool = undefined;
        this._mapToolDeactivated.raiseEvent();
    }

    onMapViewerCreated() {
        this._canvasEventHandler = new CanvasEventHandler({
            parent: this,
            scene: this.scene
        });

        this._canvasEventHandler.activate();

        const viewer = this.viewer;

        this._navigationHelper = new NavigationHelper({
            viewer: viewer
        });
    }

    zoomToSite(site: Site) {
        const viewer = this.viewer;

        viewer.entities.values.forEach((entity) => {
            if (entity.properties && entity.properties.name && entity.properties.name.getValue() === site.entity_name) {
                viewer.zoomTo(entity, new HeadingPitchRange(viewer.scene.camera.heading, -0.1, 1000));
            }
        });
    }

    getUserSettings() {
        const settings = {};

        return settings;
    }

    async fetchUserSettings() {
        if (!this.currentUser) {
            throw new Error("currentUser is required");
        }

        const { data: userSettings, error } = await this._supabase
            .from(USER_SETTINGS_TABLE)
            .select("settings")
            .eq("user_id", this.currentUser.id);

        if (error) {
            console.error(error);
            return;
        }

        if (!userSettings) {
            return;
        }

        if (userSettings.length === 0) {
            return;
        }

        return userSettings[0].settings;
    }

    async saveUserSettings() {
        if (!this.currentUser) {
            throw new Error("currentUser is required");
        }

        const fetchedUserSettings = await this.fetchUserSettings();

        const settings = this.getUserSettings();

        if (fetchedUserSettings) {
            // need to update

            const { data, error } = await this._supabase
                .from(USER_SETTINGS_TABLE)
                .update({ settings: settings })
                .eq("user_id", this.currentUser.id);

            if (error) {
                console.error(error);
                return false;
            }

            if (!data) {
                return false;
            }

            return true;
        }

        // insert
        const { data, error } = await this._supabase
            .from(USER_SETTINGS_TABLE)
            .insert([{ user_id: this.currentUser.id, settings: settings }]);

        if (error) {
            console.error(error);
            return false;
        }

        if (!data) {
            return false;
        }

        return true;
    }

    async logout() {
        try {
            const { error } = await this._supabase.auth.signOut();

            if (error) {
                console.error("soemthing went wrong");
                return;
            }

            this._currentUser = undefined;
        } catch (error) {
            console.error(error);
        }
    }
}
