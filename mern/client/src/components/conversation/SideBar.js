import React, {useState, useEffect} from "react";
import { Badge, Icon, Layout, Result, Spin, Typography } from "antd";
import { HeaderItem } from "../utils/HeaderItem";
import { ReactComponent as Logo } from "../.././assets/twilio-mark-red.svg";
import { ConversationsList } from "./ConversationsList";
const { Text } = Typography;
const { Content, Sider, Header } = Layout;

const SideBar=({conversations, selectedConversationSid, handleParentState})=>{
    return (
      <Sider theme={"light"} width={250}>
      <ConversationsList
        header={"Open Conversation"}
        added={true}
        conversations={conversations}
        selectedConversationSid={selectedConversationSid}
        onConversationClick={(item) => {
          handleParentState(item)   
        }}
      />
    </Sider>
    )
  }

  export default SideBar
  