// q@ts-nocheck
/* qeslint-disable */
import styled from "styled-components";

import { iconColorLightTheme, lmColorWhiteOne, dmColorGreyOne, dmColorGreyFive } from "../../gui-variables.styles";

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

        .tree-panel {
            max-height: 500px;
            overflow-y: auto;
            border: 1px solid ${dmColorGreyOne};
        }

        .btn-panel {
            margin-top: 1rem;
            display: flex;
            flex-direction: row;
            justify-content: center;
        }
    }
`;
