import { DataActionIds } from "src/components/data-action-ids";
import { Event } from "cesium";

class UIManager {
    private _prevActionId = "";

    constructor() {}

    initialize() {
        this._setupActionClickedListener();

        const panelStart = document.querySelector("calcite-shell-panel");
        const style = document.createElement("style");

        style.innerHTML = ".content { background: none!important; min-inline-size: 0!important; }";
        panelStart.shadowRoot.appendChild(style);

        const panels = document.querySelectorAll("calcite-panel");

        panels.forEach((panel) => {
            if (panel.hasAttribute("data-panel-id")) {
                panel?.addEventListener("calcitePanelClose", function (event) {
                    panel.hidden = true;
                });
            }
        });
    }

    get navigationHeight() {
        const navigation = document.querySelector("calcite-navigation");

        if (!navigation) {
            return 0;
        }

        return navigation.offsetHeight;
    }

    _setupActionClickedListener() {
        const actionBars = document.querySelectorAll("calcite-action-bar");

        actionBars.forEach((actionBar) => {
            actionBar.addEventListener("click", (event) => {
                const currentActionId = event.target["data-action-id"];

                const prevActionId = this._prevActionId;

                if (prevActionId) {
                    const prevAction = document.querySelector(`[data-action-id=${prevActionId}]`);

                    prevAction.active = false;

                    const prevPanel = document.querySelector(`[data-panel-id=${prevActionId}]`);

                    if (prevPanel) {
                        prevPanel.closed = true;
                        prevPanel.hidden = true;
                    }
                }

                if (currentActionId !== prevActionId) {
                    const action = document.querySelector(`[data-action-id=${currentActionId}]`);

                    if (currentActionId) {
                        action.active = true;
                    }

                    const panel = document.querySelector(`[data-panel-id=${currentActionId}]`);

                    if (panel) {
                        panel.closed = false;
                        panel.hidden = false;
                    }

                    this._prevActionId = currentActionId;
                } else {
                    this._prevActionId = "";
                }
            });
        });
    }

    getNavigationHeight() {
        const navigation = document.querySelector("calcite-navigation");

        if (!navigation) {
            console.warn("failed to get navigation");
            return 0;
        }

        return navigation.offsetHeight;
    }
}

export default UIManager;
