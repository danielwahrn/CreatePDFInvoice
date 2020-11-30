import { combineReducers } from 'redux';
import {authentication, registration} from '../container/Auth/reducers';

const rootReducer = combineReducers({
    authentication,
    registration,
});

export default rootReducer;