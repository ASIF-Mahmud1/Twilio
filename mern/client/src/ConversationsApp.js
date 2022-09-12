import React from "react";
import { Badge, Icon, Layout, Result, Spin, Typography } from "antd";
import { Client as ConversationsClient } from "@twilio/conversations";

import "./assets/Conversation.css";
import "./assets/ConversationSection.css";
import { ReactComponent as Logo } from "./assets/twilio-mark-red.svg";

import Conversation from "./Conversation";
import LoginPage from "./LoginPage";
import SignUpPage from "./SignUp";
import { ConversationsList } from "./ConversationsList";
import { HeaderItem } from "./HeaderItem";
import { getTwilioToken, signin } from "./api/auth.api";
import { list } from "./api/conversation.api";
import { signup } from "./api/user-api";
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
      loggedIn,
      signUp:false,
      token: null,
      statusString: null,
      conversationsReady: false,
      conversations: [],
      allConversations:[],
      selectedConversationSid: null,
      newMessage: ""
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
    console.log("Make API call to Sign UP", {name, email, password, admin});
    const result= await signup({name, email, password, admin})
    
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
    this.conversationsClient.shutdown();
  };

  getToken = async() => {
    // Paste your unique Chat token function
    
    const {twilioToken} = await  signin({email:this.state.email, password: this.state.password}) //"<Your token here>";
   if(twilioToken)
   {
     localStorage.setItem("email", this.state.email);
     localStorage.setItem("password", this.state.password);
     this.setState({ token: twilioToken , loggedIn: true}, this.initConversations);
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

  

  render() {
  
    const { conversations,allConversations, selectedConversationSid, status } = this.state;
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
        <Conversation
          conversationProxy={selectedConversation}
          myIdentity={this.state.email}
        />
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
                  conversations={conversations}
                  selectedConversationSid={selectedConversationSid}
                  onConversationClick={(item) => {
                    this.setState({ selectedConversationSid: item.sid });
                  }}
                />
              </Sider>
            
              <Content className="conversation-section">
                <div id="SelectedConversation">{conversationContent}</div>
              </Content>
              <Sider theme={"light"} width={250}>

                <ConversationsList
                  conversations={unSubscribedConversations}
                  selectedConversationSid={selectedConversationSid}
                  onConversationClick={(item) => {
                    this.setState({ selectedConversationSid: item.sid });
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
