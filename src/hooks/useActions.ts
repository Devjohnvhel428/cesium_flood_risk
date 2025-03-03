// q@ts-nocheck
/* qeslint-disable */
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../redux";

export const useActions = () => {
    const dispatch = useDispatch();

    return bindActionCreators(actionCreators, dispatch);
};
