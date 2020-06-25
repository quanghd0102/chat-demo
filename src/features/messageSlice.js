import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    initLoading: true,
    messageListLoading: false,
    hasMoreMessageList: true,
    sending: false,
    scrollToBottom: false,
    findLoading: false,
    hasMoreConversation: true,
    getImageListLoading: false,
    getFileListLoading: false,
    error: null,
    record: null,
    messages: null,
    inputMesage: {
      images: [],
      text: "",
      files: [],
    },
    typing: {},
    imageList: [],
    fileList: [],
  },
  reducers: {
    // setInitLoading: (state, action) => {
    //   state.init = action.payload;
    // },
  },
  extraReducers: {},
});

export const { actions, reducer } = messageSlice;
export default reducer;
