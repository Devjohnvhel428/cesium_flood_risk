import { GGITech } from "../core/GGITech";

declare global {
    interface Window {
        ggiTech: GGITech;
    }
}

export default global;
