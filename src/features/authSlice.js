import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getHistory } from "../store";
import { auth, addNewUser } from "../services/firebase";
import { firebase } from "../services/firebase";
import action from "containers/AuthPage/actions";
import { act } from "react-dom/test-utils";
import { formatRelativeWithOptions } from "date-fns/esm/fp";

export const doSignin = createAsyncThunk("userLogin", async (userInfo) => {
  try {
    console.log("vào login", userInfo);
    await auth
      .signInWithEmailAndPassword(userInfo.email, userInfo.password)
      .then((res) => {
        console.log("res register", res);
        const userLoginLocalStorage = JSON.stringify(userInfo);
        localStorage.setItem('userLogin', userLoginLocalStorage);
        getHistory().push("/");
      });
    return userInfo;
  } catch (error) {
    console.log("lỗi login nè", error);
  }
});

export const doSignup = createAsyncThunk("userRegister", async (userInfo) => {
  try {
    console.log("action", userInfo);
    let response = await auth
      .createUserWithEmailAndPassword(userInfo.email, userInfo.password)
      .then((res) => {
        addNewUser({
          id: res.user.uid,
          firstname: userInfo.firstname,
          lastname: userInfo.lastname,
          email: userInfo.email,
          password: userInfo.password,
        });
        console.log("res", res);
      });
    console.log("response register", response);
    getHistory().push("/signin");
    return response;
  } catch (error) {
    console.log("errror register", error);
  }
});

export const doInitLoadingDone = () => {
  return (dispatch) => {
    return dispatch(actions.signinInitLoadingDone);
  };
};

export const doSignout = () => {
  return (dispatch) => {
    getHistory().push("/signin");
    console.log("vafo logout");
    const user = JSON.parse(localStorage.getItem('userLogin'));
    console.log("userLoginLocalStorage", JSON.parse(localStorage.getItem('userLogin')));

    return dispatch(actions.logout(user));
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    initLoading: false,
    signinLoading: false,
    signupLoading: false,
    sendResetPasswordLoading: false,
    sendResetPasswordError: null,
    changePasswordLoading: false,
    changePasswordError: null,
    signinError: null,
    sigupError: null,
    userLogin: {
      email: "",
      password: "",
    },
  },
  reducers: {
    signinInitLoadingDone: (state, action) => {
      state.initLoading = false;
      console.log("state.initLoading", state.initLoading);
    },
    logout: (state, action) => {
      state.initLoading = false;
      state.signinLoading = false;
      state.userLogin = action.payload
    },
  },
  extraReducers: {
    [doSignin.pending]: (state, action) => {
      state.initLoading = true;
      state.signinLoading = true;
      state.signinError = null;
    },
    [doSignin.fulfilled]: (state, action) => {
      if (state.signinLoading === true) {
        console.log("vao do sign in action.payload", action, action.payload);
        state.userLogin = action.payload;
        console.log("state.userLogin", state.userLogin);
      }
    },
    [doSignin.rejected]: (state, action) => {
      state.signinLoading = false;
      state.sigupError = action || null;
    },
    [doSignup.pending]: (state, action) => {
      state.signupLoading = true;
      state.signinError = null;
    },
    [doSignup.fulfilled]: (state, action) => {
      state.signupLoading = true;
    },
  },
});

export const { actions, reducer } = authSlice;
export default reducer;
