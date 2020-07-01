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

export const getPrivateMessage = createAsyncThunk(`privateChat/`, async (data) => {
  try {
    console.log("${loginId}${receiverId}", `${data.senderId}-${data.receiverId}/`);
    const ref = database.ref(`${data.senderId}-${data.receiverId}/`);
    console.log("ref", ref);
    const message = [];
    await ref.once("value").then((snap) => {
      snap.forEach((data) => {
        let mess = data.val();
        message.push(mess);
      });
    });
    console.log("message private", message);
    return message;
  } catch (ex) {
    console.log(ex);
  }
});

export const loadMessage = (data) => {
  return (dispatch, getState) => {
    const ref = database.ref(`${data.senderId}-${data.receiverId}/`);
    ref.on("child_added", (snapshot) => {
      console.log("snapshot", snapshot.val());
      
      dispatch(actions.addMessage(snapshot.val()));
    });
    // ref.on("child_removed", (snapshot) => {
    //   dispatch(actions.removeUser(snapshot.val().id))
    // });
    // ref.on("child_changed", (snapshot) => {
    //   let users = getState().user.userRealtime;
    //   const arrAfterUpdate = users.map((item) => {
    //     if (item.id === snapshot.val().id) {
    //       return { ...item, ...snapshot.val() };
    //     }
    //     return item;
    //   });
    //   console.log("arrAfterUpdate", arrAfterUpdate);
    //   dispatch(actions.storeUser(arrAfterUpdate));
    // });
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
    receiver:{},
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
  // if (payload && payload.skip && payload.data) {
  //   // Nếu cuộc trò chuyện là 0 => hết data
  //   if (payload.data.messages.length === 0) {
  //     draft.hasMoreConversation = false;
  //   } else {
  //     draft.record.messages = payload.data.messages.concat(
  //       state.record.messages
  //     );
  //   }
  // } else {
  //   if (payload && payload.data) {
  //     draft.record = payload.data;
  //   }
  // }
  // draft.error = null;
  reducers: {
    doFind: (state, action) => {
      state.record = action.payload;
    },
    doSetReciver: (state, action) => {
      state.receiver = action.payload; 
    },
    doChangeMessage: (state, action) =>{
      state.inputMesage.text = action.payload;
    },
    doCreateConversation : (state, action) => {
    },
    addMessage: (state, action)=>{
      // state.messages.push(action.payload);
      state.messages = [...state.messages, action.payload]
      console.log("meejt roofi", state.messages);
      
    }
  },
  extraReducers: {
    [getGeneralMessage.fullfilled]: (state, action) => {      
      state.generalMessage = action.payload;
      
    },
    [getPrivateMessage.fullfilled]: (state, action) => {
      console.log("vào", action.payload);
      state.messages = action.payload;
      console.log("state.messages", state.messages);
    },
    [getPrivateMessage.rejected]: (state, action) => {
      console.log("lỗi", action.payload);
      
      }
    ,
  },
});

export const { actions, reducer } = messageSlice;
export default reducer;
