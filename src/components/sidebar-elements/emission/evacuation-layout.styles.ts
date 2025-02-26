// q@ts-nocheck
/* qeslint-disable */
import styled from "styled-components";

import {
    iconColorLightTheme,
    lmColorWhiteOne,
    dmColorGreyOne,
    dmColorGreyTwo,
    dmColorGreyFour,
    dmColorGreyFive,
    dmColorBlueOne,
    panelHeaderFontSize,
    panelHeaderFontWeight
} from "../../gui-variables.styles";

interface EvacuationLayoutExpandedProps {
    $light?: boolean;
}

export const EvacuationLayoutContainer = styled.div<EvacuationLayoutExpandedProps>`
    background-color: ${dmColorGreyFive};
    color: ${(props) => (props.$light ? iconColorLightTheme : dmColorGreyOne)};
    height: 100%;
    overflow: hidden;
    padding: 0.2rem;

    .evacuation-layout-particles {
        position: static;
        height: 100%;
        width: auto;
        background-color: ${(props) => (props.$light ? lmColorWhiteOne : dmColorGreyFive)};

        padding: 0.2rem;
    }
`;
