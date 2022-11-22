import { combineReducers } from "redux";
import auth from './auth';
import vendor from "./vendor";
import checkout from './checkout';
import search from './search';

const rootReducer = combineReducers({
auth: auth,
vendor : vendor,
checkout: checkout,
search :search,

})

export default rootReducer;