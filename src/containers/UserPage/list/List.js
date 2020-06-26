import React, { useState, useEffect } from "react";
import { List, Button, Tooltip } from "antd";
import Search from "antd/lib/input/Search";
import { useDispatch, useSelector } from "react-redux";
import actions from "../actions";
import selectors from "../selectors";
import contactActions from "../../ContactPage/actions";
import AvatarCus from "../../../components/AvatarCus";
import { getAllUserFromDatabase } from "../../../features/userSlice";

const UserList = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectors.selectUsers);
  const findLoading = useSelector(selectors.selectFindLoading);
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  // const users = useSelector((state)=>state.user.users);

  useEffect(() => {
    // console.log("user of selectors", users);
  });

  // const handleSearch = (event) => {
  //   // if (term.trim() === "") return;
    
  //   console.log("user of handle search", users);
  //   setSearchValue(term);
  //   console.log("setSearchValue", searchValue);
  // };

  const searchUsers = () => {
    if (users.length > 0) {
      console.log("users", users);
      console.log("searchValue", searchValue);
      let resultSearch = users.filter((item) => {
        if (searchValue) {
          return (
            item.lastname.toLowerCase().search(searchValue.toLowerCase()) !== -1 
          );
        }
        return "";
      });
      console.log("resultSearch", resultSearch);
      setSearchResult(resultSearch);
      console.log("searchResult", searchResult);
      
    }
  };

  const searchbar = (
    <div className="py-3 px-3" style={{ backgroundColor: "#fff" }}>
      <Search
        placeholder="Search contact"
        name="valueSearchUser"
        onChange={(event)=>setSearchValue(event.target.value)}
        loading={findLoading}
        onKeyPress={searchUsers}
      />
    </div>
  );

  const handleAddContactClick = (userInfo) => {
    dispatch(contactActions.doCreate(userInfo));
  };

  const handleRemoveContactClick = (userInfo) => {
    if (userInfo.type === "request") {
      dispatch(contactActions.doDestroyRequest(userInfo));
    } else if (userInfo.type === "requestSent") {
      dispatch(contactActions.doDestroyRequestSent(userInfo));
    } else if (userInfo.type === "contact") {
      dispatch(contactActions.doDestroyContact(userInfo));
    }
  };

  const handleConfirmContactClick = (userInfo) => {
    dispatch(contactActions.doUpdate(userInfo));
  };
  const renderFriendsList = () => {
    let listUsers = [];
    if(searchResult.length > 0){
      listUsers = searchResult;
    }
    else listUsers = users;
    return (
      <List
        className="scroll-y flex-1 bg-transparent"
        itemLayout="horizontal"
        dataSource={listUsers}
        renderItem={(item, index) => (
          <List.Item className={`"border-0" border-0 px-4 py-3`}>
            <List.Item.Meta
              avatar={
                // <Badge dot status="success"> </Badge>
                <AvatarCus record={item} />
              }
              title={
                <span
                  style={{
                    display: "flex",
                    width: "100%",
                  }}
                >
                  {item.firstname + " " + item.lastname}
                </span>
              }
              description={
                <>
                  {/* {!!item.type && item.type === "notContact" && ( */}
                  <Tooltip title="Add Contact">
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => handleAddContactClick(item)}
                    >
                      Add Contact
                    </Button>
                  </Tooltip>
                  {/* )} */}
                  {!!item.type && item.type === "request" && (
                    <>
                      <Tooltip title="Confirm request">
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => handleConfirmContactClick(item)}
                        >
                          Confirm
                        </Button>
                      </Tooltip>
                      <Tooltip title="Remove request">
                        <Button
                          size="small"
                          onClick={() => handleRemoveContactClick(item)}
                        >
                          Remove
                        </Button>
                      </Tooltip>
                    </>
                  )}
                  {!!item.type && item.type === "requestSent" && (
                    <Tooltip title="Cancel request">
                      <Button
                        size="small"
                        onClick={() => handleRemoveContactClick(item)}
                      >
                        Cancel Request
                      </Button>
                    </Tooltip>
                  )}
                  {!!item.type && item.type === "contact" && (
                    <>
                      <Tooltip title="Remove contact">
                        <Button
                          size="small"
                          onClick={() => handleRemoveContactClick(item)}
                        >
                          Remove Contact
                        </Button>
                      </Tooltip>
                    </>
                  )}
                  {!!item.type && item.type === "you" && <span>You</span>}
                </>
              }
            />
          </List.Item>
        )}
      />
    );
  };
  return (
    <>
      {searchbar}
      {renderFriendsList()}
    </>
  );
};
export default UserList;
