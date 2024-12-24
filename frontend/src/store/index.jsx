import { combineReducers } from "redux";
import userReducer from "./reducers/userReducer";
import customerReducer from "./reducers/customerReducer";
import projectReducer from "./reducers/projectReducer";
import paymentReducer from "./reducers/paymentReducer";
import eventReducer from "./reducers/eventReducer";

export default combineReducers({
    user: userReducer,
    customer: customerReducer,
    project: projectReducer,
    payment: paymentReducer,
    event: eventReducer,
});
