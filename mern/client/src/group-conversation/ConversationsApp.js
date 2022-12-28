import React from "react";
import { Badge, Button, Icon, Layout, Result, Spin, Typography } from "antd";
import { Client as ConversationsClient } from "@twilio/conversations";

import "./assets/Conversation.css";
import "./assets/ConversationSection.css";
import { ReactComponent as Logo } from "./assets/twilio-mark-red.svg";

import Conversation from "./Conversation";
import ParticipantList from "./ParticipantList";
import LoginPage from "./LoginPage";
import SignUpPage from "./SignUp";
import { ConversationsList } from "./ConversationsList";
import { HeaderItem } from "./HeaderItem";
import {  signin } from "../api/auth.api";

import {list, addParticipant, getParticipantByConversationSID, deleteConversationBySID} from '../api/group-conversation.api'
import { signupGroupChat } from "../api/user-api";
const { Content, Sider, Header } = Layout;
const { Text } = Typography;

class ConversationsApp extends React.Component {
  constructor(props) {
    super(props);

    const email = localStorage.getItem("email") || "";
    const password = localStorage.getItem("password") || "";
    const loggedIn = email !== "";

    this.state = {

      email,
      password,
      admin:false,
      loggedIn,
      signUp:false,
      token: null,
      statusString: null,
      conversationsReady: false,
      conversations: [],
      allConversations:[],
      selectedConversationSid: null,
      newMessage: "",
      participantList:[]
    };
  }

  componentDidMount = () => {
    if (this.state.loggedIn) {
      this.getToken();
      this.setState({ statusString: "Fetching credentials…" });
    }
  };

  toggleSignUp = () => {
    
    this.setState({signUp:!this.state.signUp})
  };

  logIn = (email, password) => {
  
   
    if (email !== "") {
    
      this.setState({ email, password }, this.getToken);
    }
  };

  signUp = async (name, email, password, admin) => {
    const room_id= "room:"+ Date.now()
    console.log("Make API call to Sign UP For Group Chat", {name, email, password, admin,room_id});
    const result= await signupGroupChat({name, email, password, admin, room_id: room_id })
    
    if(!result.error)
    {
      alert("Signup is successful!")
    }
  };


  logOut = (event) => {
    if (event) {
      event.preventDefault();
    }

    this.setState({
     
      email:"",
      admin:false,
      loggedIn: false,
      token: "",
      conversationsReady: false,
      messages: [],
      newMessage: "",
      conversations: [],
      allConversations:[]
    });

    localStorage.removeItem("email");
    localStorage.removeItem("password");
    localStorage.removeItem("admin");
    this.conversationsClient.shutdown();
  };

  getToken = async() => {
    // Paste your unique Chat token function
    
    const {twilioToken ,user } = await  signin({email:this.state.email, password: this.state.password}) //"<Your token here>";
   if(twilioToken)
   {
     const{admin}= user
     localStorage.setItem("email", this.state.email);
     localStorage.setItem("password", this.state.password);
     localStorage.setItem("admin", admin);


     this.setState({ token: twilioToken , admin, loggedIn: true}, this.initConversations);
     const conversationsFromServer= await list()
     console.log("more ", conversationsFromServer);
     if(conversationsFromServer.conversation)
     {
      console.log("Here ", conversationsFromServer);
      this.setState(({allConversations:conversationsFromServer.conversation}))
     }
  }
};

  initConversations = async () => {
    window.conversationsClient = ConversationsClient;
    this.conversationsClient = await ConversationsClient.create(this.state.token);
    this.setState({ statusString: "Connecting to Twilio…" });

    this.conversationsClient.on("connectionStateChanged", (state) => {
      if (state === "connecting")
        this.setState({
          statusString: "Connecting to Twilio…",
          status: "default"
        });
      if (state === "connected") {
        this.setState({
          statusString: `You are connected ( ${this.state.email} )`,
          status: "success"
        });
      }
      if (state === "disconnecting")
        this.setState({
          statusString: "Disconnecting from Twilio…",
          conversationsReady: false,
          status: "default"
        });
      if (state === "disconnected")
        this.setState({
          statusString: "Disconnected.",
          conversationsReady: false,
          status: "warning"
        });
      if (state === "denied")
        this.setState({
          statusString: "Failed to connect.",
          conversationsReady: false,
          status: "error"
        });
    });
    this.conversationsClient.on("conversationJoined", (conversation) => {
      this.setState({ conversations: [...this.state.conversations, conversation] });
    });
    this.conversationsClient.on("conversationLeft", (thisConversation) => {
      this.setState({
        conversations: [...this.state.conversations.filter((it) => it !== thisConversation)]
      });
    });
  };

  handleAddParticipant= async({sid})=>{
    const identity= this.state.email
    console.log({sid, identity});
    const result= await addParticipant({sid, identity})
    console.log(result);
    if(result.conversation)
    {
      //alert(result.message)
    }
  }


  createGroupChat=()=>{

  }

  joinGroupChat=()=>{
    
  }

  getParticpantList= async (sid)=>{
    try {
      const result = await getParticipantByConversationSID({sid:sid})
      if(result?.participants)
      {
        this.setState({participantList: result?.participants})
      }
    } catch (error) {
      alert("Something Worng in Line"+202)
    }

  }

  handleDeleteConversation  = async (sid)=>{
    try {
      const result = await deleteConversationBySID({sid:sid})
      if(! result?.error)
      {
        console.log("Before ",this.state.allConversations.length);
        const updatedList= this.state.allConversations.filter((item)=>item.sid !== sid)
        this.setState({allConversations:updatedList})
        console.log("After ",updatedList.length);

        console.log(result)
      }
    } catch (error) {
      alert("Something Worng in Line"+202)
    }

  }

  render() {
    console.log("Particiapnet List ", this.state.participantList); 
    const { conversations,allConversations, selectedConversationSid, status, admin } = this.state;
    /////////////////////////////////////////////////////////////////

   const unSubscribedConversations= allConversations.filter((item)=>{
      const found=conversations.find((ele)=> ele.sid==item.sid)
      if(found)
      {
          return false
      }
      else
      {
          return true
      }
    })

    console.log("UnSubcribed Conversations: ", unSubscribedConversations.length);
    ///////////////////////////////////////////////////////////////
    const selectedConversation = conversations.find(
      (it) => it.sid === selectedConversationSid
    );

    let conversationContent;
    if (selectedConversation) {
      conversationContent = (
        <>
        <Conversation
          conversationProxy={selectedConversation}
          myIdentity={this.state.email}
          />
          <ParticipantList  participantList={this.state.participantList} />
        </>
      );
    } else if (status !== "success") {
      conversationContent = "Loading your conversation!";
    } else {
      conversationContent = "";
    }

    if (this.state.loggedIn) {
      return (
        <div className="conversations-window-wrapper">
          <Layout className="conversations-window-container">
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
                  >{` ${this.state.statusString}`}</span>
                  <Badge
                    dot={true}
                    status={this.state.status}
                    style={{ marginLeft: "1em" }}
                  />
                </HeaderItem>
                <HeaderItem>
                  <Icon
                    type="poweroff"
                    onClick={this.logOut}
                    style={{
                      color: "white",
                      fontSize: "20px",
                      marginLeft: "auto"
                    }}
                  />
                </HeaderItem>
              </div>
            </Header>
            <Layout>
              <Sider theme={"light"} width={250}>
                <ConversationsList
                  header={"Open Conversation"}
                  added={true}
                  conversations={conversations}
                  selectedConversationSid={selectedConversationSid}
                  onConversationClick={(item) => {
                    this.setState({ selectedConversationSid: item.sid });
                    this.getParticpantList(item.sid)
                  }}
                />
              </Sider>
            
              <Content className="conversation-section">
                <div id="SelectedConversation">{conversationContent}</div>
              </Content>
                <Sider theme={"light"} width={250}>
                    <ConversationsList
                      header={"Not Added with You"}
                      added={false}
                      conversations={unSubscribedConversations}
                      selectedConversationSid={selectedConversationSid}
                      onConversationClick={(item) => {
                        this.setState({ selectedConversationSid: item.sid }, () => {
                          this.handleAddParticipant(item)
                        });
                      }}

                      onConversationDelete={(item) => {
                        this.handleDeleteConversation( item.sid)
                      }}

                      
                    />

                </Sider>

        
            </Layout>
            
          </Layout>
        </div>
      );
    }
    if((this.state.loggedIn ==false) && (this.state.signUp===true) )
    {
      return <SignUpPage  onSubmit={this.signUp} toggleSignUp={this.toggleSignUp}  />
    }
    return <LoginPage onSubmit={this.logIn} toggleSignUp={this.toggleSignUp} />;
  }
}

export default ConversationsApp;
