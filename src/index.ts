import "./index.scss";
import { GGITech } from "@core/GGITech";
import { setAssetPath } from "@esri/calcite-components/dist/components";
import render from "./render";

import "@esri/calcite-components/dist/calcite/calcite.css";

setAssetPath("https://js.arcgis.com/calcite-components/2.13.2/assets");

const ggiTech = new GGITech();
window.ggiTech = ggiTech;

ggiTech.start();

render(ggiTech);
