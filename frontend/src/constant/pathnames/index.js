const USER_PATH = "/user";
const CUSTOMER_PATH = "/customer";
const PROJECT_PATH = "/project";
const PROJECT_TYPES_PATH = "/project-types";
const EVENT_TYPES_PATH = "/event-types";
const EVENT_PATH = "/event";
const REMAIND_PATH = "/remainder";
const PAYMENT_PATH = "/payment";

export const PATHS = {
    // Authentication
    LOGIN: "/login",
    HOME: "/",

    // User Management
    USER: USER_PATH,
    ADD_USER: `${USER_PATH}/addUser`,
    EDIT_USER: `${USER_PATH}/editUser`,
    

    // Customer Management
    CUSTOMER: CUSTOMER_PATH,
    ADD_CUSTOMER: `${CUSTOMER_PATH}/addCustomer`,
    EDIT_CUSTOMER: `${CUSTOMER_PATH}/editCustomer`,


    // Project Management
    PROJECT: PROJECT_PATH,
    ADD_PROJECT: `${PROJECT_PATH}/addProject`,
    EDIT_PROJECT: `${PROJECT_PATH}/editProject`,


    // Project Type
    PROJECT_TYPES: PROJECT_TYPES_PATH,
    ADD_PROJECT_TYPE: `${PROJECT_PATH}/addTypes`,
    EDIT_PROJECT_TYPE: `${PROJECT_PATH}/editTypes`,



    // Event Management
    EVENT: EVENT_PATH,
    EVENT_DETAIL: `${EVENT_PATH}/detail`,
    EVENT_DETAIL: "/EventDetails",


    // Event Types
    EVENT_TYPES: EVENT_TYPES_PATH,


    // Reminder Management (Thông Báo )
    REMAIND: REMAIND_PATH,
    REMAIND_SEND: "/Remaid_Send",


    // Payment Management
    PAYMENT: PAYMENT_PATH,
    PAYMENT_LIST: `${PAYMENT_PATH}/PaymentList`,
    ADD_PAYMENT: `${PAYMENT_PATH}/addPayment`,
    EDIT_PAYMENT: `${PAYMENT_PATH}/editPayment`,


};
