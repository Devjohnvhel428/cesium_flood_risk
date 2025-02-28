// @ts-nocheck

import styled from "styled-components";

export const FullScreenLoaderContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999; /* Ensure it's on top of everything */

    img {
        width: auto;
        height: 100px; /* Set the height */
        aspect-ratio: 1 / 1; /* Maintain a width-to-height ratio of 2:1 */
    }
`;
