import { createSlice } from "@reduxjs/toolkit";

const contactSlice = createSlice({
  name: "layout",
  initialState: {
    initLoading: true,
    dataLoading: false,
    findLoading: false,
    saveLoading: false,
    destroyLoading: false,
    exportLoading: false,
    error: null,
    redirectTo: "/contact",
    selectedRowKeys: [],
    selectedRows: [],
    record: null,
    contactLoading: false,
    requestLoading: false,
    requestSentLoading: false,
    contacts: [],
    requests: [],
    requestsSent: [],
  },
  reducers: {
    // setInitLoading: (state, action) => {
    //   state.init = action.payload;
    // },
  },
  extraReducers: {},
});

export const { actions, reducer } = contactSlice;
export default reducer;
