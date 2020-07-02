import React, { useState, useEffect } from "react";
import { Icon, Spin, Tooltip } from "antd";
import { useSelector, useDispatch } from "react-redux";
import selectors from "./selectors";
import userSelectors from "../UserPage/selectors";
import AvatarCus from "../../components/AvatarCus";
import TypingIndicator from "../../components/TypingIndicator";
import Carousel, { Modal, ModalGateway } from "react-images";
import actions from "./actions";
import InfiniteScroll from "react-infinite-scroller";
import { loadMessage, getPrivateMessage } from "../../features/messageSlice";

function Conversation() {
  const dispatch = useDispatch();
  const record = useSelector(selectors.selectRecord);
  // const messages = useSelector(selectors.selectMessages);
  const messages = useSelector((state) => state.message.messages);
  const typing = useSelector(selectors.selectTyping);
  const hasMoreConversation = useSelector(selectors.selectHasMoreConversation);
  const sending = useSelector(selectors.selectSending);
  const findLoading = useSelector(selectors.selectFindLoading);
  const currentUser = useSelector(userSelectors.selectCurrentUser);
  const [imageViewModelVisible, setImageViewModelVisible] = useState(false);
  const [currentImageViewIndex, setCurrentImageViewIndex] = useState(0);
  const userLoginLocalStorage = JSON.parse(localStorage.getItem("userLogin"));
  let imagesList = [];
  const receiver = useSelector(selectors.selectReceiver);

  const loadMoreConversation = () => {
    // dispatch(actions.doFind(record.receiver.id, record.messages.length));
  };

  useEffect(() => {
    console.log("messages effect", messages);
    
    const data = {
      senderId: userLoginLocalStorage.id,
      receiverId: receiver.id,
    };
    console.log("data id", data);
    // dispatch(loadMessage(data));
    // dispatch(getPrivateMessage(data));
  }, [receiver.id]);

  const getFullName = (user) => {
    if (user) return user.firstname + " " + user.lastname;
    return "";
  };

  const renderConversation = (messages) => {
    // if (!currentUser) return <span></span>;
    return messages.map((chat, index) => {
      // if (chat.type === "notification") {
      //   return (
      //     <div key={index} className="notification-message">
      //       <span>{chat.message}</span>
      //     </div>
      //   );
      // }
      return (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <div style={{ width: 30, marginRight: "5px" }}>
            {chat.senderId !== userLoginLocalStorage.id && record && (
              <Tooltip title={getFullName(receiver)}>
                <AvatarCus
                  record={
                    // record.conversationType === "ChatGroup"
                    // ? chat.sender
                    userLoginLocalStorage
                    // receiver
                  }
                  size={30}
                />
              </Tooltip>
            )}
          </div>
          <div
            key={index}
            className={`conversation
                       						 ${
                                     chat.senderId === userLoginLocalStorage.id
                                       ? "conversation-sent"
                                       : "conversation-received"
                                   }`}
          >
            {chat.senderId === userLoginLocalStorage.id ? (
              // Nếu người gửi là user hiện tại
              <>
                {/* {chat.type === "text" ? ( */}
                <div className={`body body-sent`}>
                  <span color="inherit">{chat.message}</span>
                </div>
                {/* ) : chat.type === "image" && chat.images.length > 0 ? (
                  <div
                    className={`body-sent-no-backdround`}
                    style={{ maxWidth: "80%" }}
                  >
                    {chat.images.map((image, key) => (
                      <div
                        key={key}
                        style={{
                          backgroundImage: `url(${process.env.REACT_APP_STATIC_PHOTOS}/${image})`,
                        }}
                        className="photo"
                        onClick={() => {
                          setImageViewModelVisible(true);
                          setCurrentImageViewIndex(
                            imagesList
                              .map((e) => e.src)
                              .indexOf(
                                `${process.env.REACT_APP_STATIC_PHOTOS}/${image}`
                              )
                          );
                        }}
                      ></div>
                    ))}
                  </div>
                ) : chat.type === "file" ? (
                  <div className={`body body-sent`}>
                    {chat.files.map((file, key) => (
                      <div key={key}>
                        <a
                          key={key}
                          target="_blank"
                          style={{
                            textDecoration: "underline",
                            color: "white",
                          }}
                          href={`${process.env.REACT_APP_STATIC_FILES}/${file.path}`}
                        >
                          <Icon type="paper-clip" /> {file.name}
                        </a>
                      </div>
                    ))}
                  </div>
                ) : null} */}
              </>
            ) : (
              // Nếu người gửi không phải là user hiện tại
              <>
                <div className={`body body-received text-body`}>
                  {/* {record.conversationType === "group" && ( */}
                  <p
                    style={{
                      color: "#868686",
                      fontSize: "12px",
                    }}
                  >
                    {userLoginLocalStorage.firstname}
                  </p>
                  {/* )} */}
                  <p color="inherit">{chat.message}</p>
                </div>
              </>
            )}
          </div>
        </div>
      );
    });
  };

  const typIndicator = (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
      }}
    >
      <div style={{ width: 30, marginRight: "5px" }}>
        <AvatarCus
          record={typing && typing.info ? typing.info : null}
          size={30}
        />
      </div>
      <div className={`conversation conversation-received`}>
        <div>
          <TypingIndicator />
        </div>
      </div>
    </div>
  );

  if (record && record.messages) {
    let tempList = [];
    record.messages.forEach((message, index) => {
      if (message.images && message.images.length > 0) {
        tempList = tempList.concat(message.images);
      }
    });
    tempList = tempList.reverse();
    imagesList = tempList.map((image) => {
      return { src: `${process.env.REACT_APP_STATIC_PHOTOS}/${image}` };
    });
  }

  const handleInfiniteOnLoad = () => {
    loadMoreConversation();
  };

  return (
    <>
      <ModalGateway>
        {imageViewModelVisible ? (
          <Modal onClose={() => setImageViewModelVisible(false)}>
            <Carousel
              currentIndex={currentImageViewIndex}
              components={{ FooterCaption: () => null }}
              views={imagesList}
            />
          </Modal>
        ) : null}
      </ModalGateway>

      <InfiniteScroll
        initialLoad={false}
        pageStart={0}
        loadMore={handleInfiniteOnLoad}
        hasMore={!findLoading && hasMoreConversation}
        useWindow={false}
        isReverse={true}
      >
        <div style={{ textAlign: "center" }}>
          <Spin spinning={findLoading && hasMoreConversation}></Spin>
        </div>
        {renderConversation(messages)}
        {typing && typing.status && typIndicator}
        <div
          style={{
            textAlign: "right",
            color: "#8d8d8d",
            fontSize: "12px",
          }}
        >
          {sending && <span>Sending...</span>}
        </div>
      </InfiniteScroll>
    </>
  );
}

export default Conversation;
