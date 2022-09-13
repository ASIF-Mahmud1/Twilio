import React, {useState, useEffect} from "react";
import { Badge, Icon, Layout, Result, Spin, Typography } from "antd";
import { HeaderItem } from "../utils/HeaderItem";
import { ReactComponent as Logo } from "../.././assets/twilio-mark-red.svg";
const { Text } = Typography;
const {  Header } = Layout;

const TopBar = ({ selectedConversation, values, logOut }) => {
    return (
      <Header
        style={{ display: "flex", alignItems: "center", padding: 0 }}
      >
        <div
          style={{
            maxWidth: "250px",
            width: "100%",
            display: "flex",
            alignItems: "center"
          }}
        >
          <HeaderItem style={{ paddingRight: "0", display: "flex" }}>
            <Logo />
          </HeaderItem>
          <HeaderItem>
            <Text strong style={{ color: "white" }}>
              Conversations
            </Text>
          </HeaderItem>
        </div>
        <div style={{ display: "flex", width: "100%" }}>
          <HeaderItem>
            <Text strong style={{ color: "white" }}>
              {selectedConversation &&
                (selectedConversation.friendlyName || selectedConversation.sid)}
            </Text>
          </HeaderItem>
          <HeaderItem style={{ float: "right", marginLeft: "auto" }}>
            <span
              style={{ color: "white" }}
            >{` ${values.statusString}`}</span>
            <Badge
              dot={true}
              status={values.status}
              style={{ marginLeft: "1em" }}
            />
          </HeaderItem>
          <HeaderItem>
            <Icon
              type="poweroff"
              onClick={logOut}
              style={{
                color: "white",
                fontSize: "20px",
                marginLeft: "auto"
              }}
            />
          </HeaderItem>
        </div>
      </Header>
    )
  }
 
export default TopBar  
