// q@ts-nocheck
/* qeslint-disable */
import styled from "styled-components";

import {
    iconColorLightTheme,
    lmColorWhiteOne,
    dmColorGreyOne,
    dmColorGreyTwo,
    dmColorGreyFive
} from "../../gui-variables.styles";

interface CurrentWeatherLayoutExpandedExpandedProps {
    $light?: boolean;
}

export const CurrentWeatherLayoutContainer = styled.div<CurrentWeatherLayoutExpandedExpandedProps>`
    background-color: ${dmColorGreyFive};
    ${(props) => props.$light && `background-color: ${lmColorWhiteOne};`}
    color: ${(props) => (props.$light ? iconColorLightTheme : dmColorGreyOne)};
    height: 100%;
    overflow: hidden;

    .extended-weather-layout {
        position: static;
        height: 100%;
        width: auto;
        background-color: ${(props) => (props.$light ? lmColorWhiteOne : dmColorGreyFive)};

        padding: 0.2rem;

        .weather-layout {
            height: 100%;

            &__radio {
                font-size: 15px;
                display: flex;
            }

            &__filter {
                border: 1px solid ${dmColorGreyTwo};
                font-size: 12px;
                padding: 10px;

                .checkbox_container {
                    margin-top: 15px;

                    &__disabled {
                        pointer-events: none;
                        opacity: 0.7;
                    }
                }

                &__main {
                    display: flex;
                    flex-direction: column;

                    &__radios {
                        .filter-radio {
                            span:first-child {
                                padding: 3px !important;
                            }
                        }
                    }

                    &__search {
                        margin-top: 1rem;
                        padding: 10px;

                        .react-select {
                            &__control {
                                background-color: ${dmColorGreyFive};
                                &__value {
                                    &-container {
                                        color: red;
                                    }
                                }
                            }
                            &__input {
                                color: ${dmColorGreyOne}!important;
                            }
                            &__single {
                                &-value {
                                    color: ${dmColorGreyOne}!important;
                                }
                            }
                            &__menu {
                                &-list {
                                    background-color: ${dmColorGreyFive}!important;
                                    color: ${dmColorGreyOne}!important;

                                    &__option {
                                        background-color: ${dmColorGreyFive}!important;
                                        color: ${dmColorGreyOne}!important;
                                    }
                                }
                            }
                        }

                        &__input-content {
                            width: 250px;
                        }

                        &__empty {
                            width: 100%;
                            height: 52px;
                        }
                    }
                }
            }
        }
    }
`;
