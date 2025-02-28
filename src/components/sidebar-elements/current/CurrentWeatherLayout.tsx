// q@ts-nocheck
/* qeslint-disable */
import { useState, useEffect } from "react";
import { Radio } from "@mui/material";
import Select from "react-select";
import { useSelector } from "react-redux";

import { WeatherType } from "@core";
import { getWeather } from "../../../redux";
import { dmColorGreyOne, dmColorBlueOne } from "../../gui-variables.styles";
import { CurrentWeatherLayoutContainer } from "./current-weather-layout.styles";

interface SelectWeatherShowTypeProps {
    active: boolean;
    type: WeatherType;
}

interface SelectOption {
    value: string;
    label: string;
}

const CurrentWeatherLayout = () => {
    const ggiTech = window.ggiTech;
    const areaManager = ggiTech.areaManager;
    const [weatherShowTypes, setWeatherShowTypes] = useState<SelectWeatherShowTypeProps[]>([
        {
            active: true,
            type: WeatherType.STATE_000
        },
        {
            active: false,
            type: WeatherType.STATE_200
        },
        {
            active: false,
            type: WeatherType.STATE_300
        },
        {
            active: false,
            type: WeatherType.STATE_500
        },
        {
            active: false,
            type: WeatherType.STATE_600
        },
        {
            active: false,
            type: WeatherType.STATE_700
        },
        {
            active: false,
            type: WeatherType.STATE_800
        },
        {
            active: false,
            type: WeatherType.STATE_801
        },
        {
            active: false,
            type: WeatherType.STATE_900
        }
    ]);
    const [selectOptions, setSelectOptions] = useState<SelectOption[]>([]);
    const [selectedOption, setSelectedOption] = useState<SelectOption>(undefined);

    const currentWeather = useSelector(getWeather);

    const handleChangeWeatherShowType = (checked: boolean, unitType: WeatherType, index: number) => {
        weatherShowTypes.forEach((item) => {
            item.active = false;
        });
        weatherShowTypes[index].active = checked;
        setWeatherShowTypes([...weatherShowTypes]);

        areaManager.setFilterWithCondition(unitType);
    };

    const handleSelectCity = (value: SelectOption) => {
        setSelectedOption(value);
        const selectedArea = areaManager.getAreaByCityName(value.value);
        if (selectedArea) {
            ggiTech.zoomToArea(selectedArea);
        }
    };

    useEffect(() => {
        const allOptions = [];
        if (currentWeather !== undefined) {
            currentWeather?.current?.forEach((property) => {
                const newSelectOption = {
                    value: property?.city_name,
                    label: property?.city_name
                } as SelectOption;
                allOptions.push(newSelectOption);
            });
        }
        setSelectOptions(allOptions);
    }, [currentWeather]);

    return (
        <CurrentWeatherLayoutContainer $light={false} id="CurrentWeather-layout-container">
            <div className="extended-weather-layout">
                <div className="weather-layout__filter__main">
                    <div className="weather-layout__filter__main__search">
                        <Select
                            options={selectOptions}
                            placeholder="Select and Search city name"
                            value={selectedOption}
                            onChange={handleSelectCity}
                            className="react-select-container"
                            classNamePrefix="react-select"
                        />
                    </div>
                    <div className="weather-layout__filter__main__radios">
                        {weatherShowTypes.map((item, index) => (
                            <div className="filter-radio" key={item.type}>
                                <Radio
                                    checked={item.active}
                                    onChange={(e) => handleChangeWeatherShowType(e.target.checked, item.type, index)}
                                    value={item.type}
                                    name="Show Type"
                                    size="small"
                                    sx={{
                                        color: dmColorGreyOne,
                                        "&.Mui-checked": {
                                            color: dmColorBlueOne
                                        }
                                    }}
                                />
                                <span>{item.type}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </CurrentWeatherLayoutContainer>
    );
};

export default CurrentWeatherLayout;
