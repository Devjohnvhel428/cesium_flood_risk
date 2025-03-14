// @ts-nocheck
/* eslint-disable */
import { useState } from "react";
import { GGITechEventsTypes } from "@core/Events";
import { emitCustomEvent } from "react-custom-events";

import { BasemapPickerContainer } from "./basemap-picker.style";

const BasemapPicker = () => {
    const [currentProviderViewModelIndex, setCurrentProviderViewModelIndex] = useState(0);
    const viewer = window.ggiTech.mapViewer.viewer;

    const imageryProviderViewModels = viewer.baseLayerPicker.viewModel.imageryProviderViewModels;

    return (
        <BasemapPickerContainer id="basemap-picker-container" $light={false}>
            <div className="base-map-picker">
                <div className="base-map-picker-layout">
                    <div className="base-map-picker-layout__content">
                        <div className="current-basemap">
                            <span>Current Basemap</span>
                            <span className="current-basemap__title">
                                {imageryProviderViewModels[currentProviderViewModelIndex].name}
                            </span>
                        </div>

                        <div className="basemap-gallery">
                            <ul className="basemap-gallery__list">
                                {imageryProviderViewModels.map((providerViewModel, index) => (
                                    <li
                                        key={providerViewModel.name}
                                        className={
                                            currentProviderViewModelIndex === index
                                                ? "basemap-gallery__list__item active"
                                                : "basemap-gallery__list__item"
                                        }
                                        onClick={() => {
                                            setCurrentProviderViewModelIndex(index);
                                            viewer.baseLayerPicker.viewModel.selectedImagery =
                                                imageryProviderViewModels[index];
                                            emitCustomEvent(
                                                GGITechEventsTypes.BasemapChanged,
                                                imageryProviderViewModels[index].name
                                            );
                                        }}
                                    >
                                        <img
                                            className="thumbnail"
                                            src={providerViewModel.iconUrl}
                                            alt={providerViewModel.name}
                                        />
                                        <div className="item-content">
                                            <div className="item-content__title">
                                                <span>{providerViewModel.name}</span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </BasemapPickerContainer>
    );
};

export default BasemapPicker;
