import { combineReducers } from 'redux';
import fetchAPI from '../reducers/fetchAPI';
import SlidePop from "./slidePop";
import {reducer as form} from "redux-form"
import editOperator from "./editOperator";

const allReducers = combineReducers({
    editOperator,
    fetchAPI,
    SlidePop,
    form
});
export default allReducers;