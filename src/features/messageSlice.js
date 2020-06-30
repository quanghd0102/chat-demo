import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { database, db } from "../services/firebase";

const ref = database.ref("general/");
export const getGeneralMessage = createAsyncThunk("general/", async () => {
  try {
    const message = [];
    await ref.once("value").then((snap) => {
      snap.forEach((data) => {
        let mess = data.val();
        message.push(mess);
      });
    });
    console.log("message log", message);
    return message;
  } catch (ex) {
    console.log(ex);
  }
});

const messageSlice = createSlice({
  name: "message",
  initialState: {
    initLoading: true,
    messageListLoading: true,
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
    generalMessage: [],
  },
  reducers: {
    doFind: (state, action) => {
      console.log("vàoooooooooooo", state.record.messages);
      // state.record.messages = action.payload.messages.concat(
      //   state.record.messages
      // );
    },
  },
  extraReducers: {
    [getGeneralMessage.fullfilled]: (state, action) => {
      state.generalMessage = action.payload;
    },
  },
});

export const { actions, reducer } = messageSlice;
export default reducer;
