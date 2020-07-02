import { configureStore, combineReducers } from "@reduxjs/toolkit";
// import { combineReducers } from "redux";
import userReducer from "./features/userSlice";
import authReducer from "./features/authSlice";
import layoutReducer from "./features/layoutSlice";
import messageReducer from "./features/messageSlice";
import contactReducer from "./features/contactSlice";
import callReducer from "./features/callSlice";
import { createBrowserHistory } from "history";
import { connectRouter } from "connected-react-router";

const history = createBrowserHistory();

export function getHistory() {
  return history;
}

const createRootReducer = () =>
  combineReducers({
    router: connectRouter(history),
    user: userReducer,
    auth: authReducer,
    layout: layoutReducer,
    message: messageReducer,
    contact: contactReducer,
    call: callReducer
  });

const store = configureStore({
  reducer: createRootReducer(history),
});

export default store;

// const store = createStore(
//     createRootReducer(history), // root reducer with router state
//     preloadedState,
//     compose(
//       applyMiddleware(
//         routerMiddleware(history), // for dispatching history actions
//         // ... other middlewares ...
//       ),
//     ),
//   )
