import { configureStore, combineReducers } from "@reduxjs/toolkit";
// import { combineReducers } from "redux";
import userReducer from "../src/features/userSlice";
import authReducer from "../src/features/authSlice";
import layoutReducer from "../src/features/layoutSlice";
import messageReducer from "../src/features/messageSlice";
import contactReducer from "../src/features/contactSlice";
import callReducer from "../src/features/callSlice";
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
