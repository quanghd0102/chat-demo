import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { database, db } from "../services/firebase";
import { act } from "@testing-library/react";

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
    return message;
  } catch (ex) {
    console.log(ex);
  }
});

export const getPrivateMessage = createAsyncThunk(
  `privateChat/`,
  async (data) => {
    try {
      console.log(
        "${loginId}${receiverId}",
        `${data.senderId}-${data.receiverId}/`
      );
      const ref = database.ref(`messages/${data.senderId}-${data.receiverId}/`);
      console.log("ref", ref);
      const message = [];
      await ref.on("value", (snap) => {
        console.log("vao day");
        snap.forEach((data) => {
          let mess = data.val();
          console.log("mess", mess);
          message.push(mess);
          console.log("message", message);
        });
        console.log("message private", message);
        return message;
      });
    } catch (ex) {
      console.log(ex);
    }
  }
);

export const loadMessage = (data) => {
  return (dispatch, getState) => {
    const arrMess = [];
    database
      .ref(`messages/${data.senderId}-${data.receiverId}/`)
      .once("value", (snapshot) => {
        if (snapshot.exists()) {
          console.log("có rồi");
          const ref = database.ref(
            `messages/${data.senderId}-${data.receiverId}/`
          );
          ref.on("child_added", (snapshot) => {
            console.log("loadmessages", snapshot.val());
            dispatch(actions.addMessage(snapshot.val()));
          });
        }
      });
    database
      .ref(`messages/${data.receiverId}-${data.senderId}/`)
      .once("value", (snapshot) => {
        if (snapshot.exists()) {
          console.log("có rồi");
          const ref = database.ref(
            `messages/${data.receiverId}-${data.senderId}/`
          );
          ref.on("child_added", (snapshot) => {
            console.log("loadmessages", snapshot.val());
            dispatch(actions.addMessage(snapshot.val()));
          });
        }
      });
  };
};

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
    record: {
      // khởi tạo giá trị ban đầu đối tượng
      messages: "",
      receiver: {},
      conversationType: "",
    },
    receiver: {},
    messages: [],
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
      state.record = action.payload;
    },
    doSetReciver: (state, action) => {
      state.receiver = action.payload;
    },
    doChangeMessage: (state, action) => {
      state.inputMesage.text = action.payload;
    },
    doCreateConversation: (state, action) => {},
    addMessage: (state, action) => {
      // state.messages.push(action.payload);
      // action.payload.sort(function (a, b) { return a.timestamp - b.timestamp })
      console.log("meejt roofi", state.messages);

      state.messages = [...state.messages, action.payload];
    },
  },
  extraReducers: {
    [getGeneralMessage.fullfilled]: (state, action) => {
      state.generalMessage = action.payload;
    },
    [getPrivateMessage.fullfilled]: (state, action) => {
      // action.payload.sort(function (a, b) { return a.timestamp - b.timestamp })
      console.log("tired", action.payload);

      state.messages = action.payload;
      console.log("getPrivateMessage", state.messages);
    },
    [getPrivateMessage.rejected]: (state, action) => {
      console.log("lỗi", action.payload);
    },
  },
});

export const { actions, reducer } = messageSlice;
export default reducer;
