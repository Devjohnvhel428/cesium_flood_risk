import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import { GGITech } from "@core/GGITech";
import App from "./App";
import store from "./redux/store";

export default function render(ggiTech: GGITech) {
    const root = ReactDOM.createRoot(document.getElementById(ggiTech.rootElementId) as HTMLElement);

    root.render(
        <Provider store={store}>
            <App ggiTech={ggiTech} />
        </Provider>
    );
}
