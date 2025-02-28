// @ts-nocheck
/* qeslint-disable */
import React from "react";
import { FullScreenLoaderContainer } from "./full-screen-loader.styles";
import loader from "../../assets/images/loader.gif";

interface FullScreenLoaderProps {
    isLoading: boolean;
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({ isLoading }) => {
    if (!isLoading) {
        return null;
    }

    return (
        <FullScreenLoaderContainer>
            <img src={loader} alt="Loading..." />
        </FullScreenLoaderContainer>
    );
};

export default FullScreenLoader;
