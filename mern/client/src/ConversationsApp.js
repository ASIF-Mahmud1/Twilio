import React, {useState, useEffect} from "react";
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
import { list, addParticipant } from "./api/conversation.api";
import { signup } from "./api/user-api";
const { Content, Sider, Header } = Layout;
const { Text } = Typography;
let conversationsClient =null
const ConversationsApp =()=>{

  const email = localStorage.getItem("email") || "";
  const password = localStorage.getItem("password") || "";
  const loggedIn = email !== "";

  const [values,setValues] = useState({
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
  })

  useEffect(()=>{
    
    if ((values.loggedIn) || (values.email && values.password) ) 
    {
    
      getToken();
      setValues((prevState)=>({...prevState, statusString: "Fetching credentials…"}))
    }
  },[values.email, values.password])


  useEffect(()=>{
    if(values.loggedIn && values.token) 
    {
       initConversations()
    }
  },[values.loggedIn, values.token])



  const toggleSignUp = () => {
    setValues((prevState)=>({...prevState, signUp:!prevState.signUp }))

   
  };

  const logIn = (email, password) => {
  
   
    if (email !== "") {
      setValues((prevState)=>({...prevState, email,  password }))

    }
  };

  const signUp = async (name, email, password, admin) => {
    console.log("Make API call to Sign UP", {name, email, password, admin});
    const result= await signup({name, email, password, admin})
    
    if(!result.error)
    {
      alert("Signup is successful!")
    }
  };


  const logOut = (event) => {
    if (event) {
      event.preventDefault();
    }
    setValues((prevState)=>({...prevState, 
    email:"",
    loggedIn: false,
    token: "",
    conversationsReady: false,
    messages: [],
    newMessage: "",
    conversations: [],
    allConversations:[] 
  }))

 
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    conversationsClient.shutdown();
  };


  const getToken = async() => {
    // Paste your unique Chat token function
    
    const {twilioToken} = await  signin({email:values.email, password:values.password}) //"<Your token here>";
    console.log(twilioToken);
   if(twilioToken)
   {
     localStorage.setItem("email",values.email);
     localStorage.setItem("password", values.password);
     setValues((prevState)=>({...prevState,token: twilioToken , loggedIn: true }))

   
     const conversationsFromServer= await list()
   
     if(conversationsFromServer.conversation)
     {
      
      setValues((prevState)=>({...prevState, allConversations:conversationsFromServer.conversation}))

     }
  }
};



 const initConversations = async () => {
  
    conversationsClient = await ConversationsClient.create(values.token);
  
    setValues((prevState)=>({...prevState,  statusString: "Connecting to Twilio…"}))


     conversationsClient.on("connectionStateChanged", (state) => {
      if (state === "connecting")
      {
        setValues((prevState)=>({...prevState, 
          statusString: "Connecting to Twilio…",
          status: "default"}))
      }
    
      if (state === "connected") 
      {
        setValues((prevState)=>({...prevState, 
          statusString: `You are connected ( ${values.email} )`,
          status: "success"
        }))
      }
      if (state === "disconnecting")
      {
        setValues((prevState)=>({...prevState, 
          statusString: "Disconnecting from Twilio…",
          conversationsReady: false,
          status: "default"}))
      }
        
      if (state === "disconnected")
      {
        setValues((prevState)=>({...prevState, 
          statusString: "Disconnected.",
          conversationsReady: false,
          status: "warning"

        }))
      }
        
      if (state === "denied")
      {
        setValues((prevState)=>({...prevState, 
          statusString: "Failed to connect.",
          conversationsReady: false,
          status: "error"

        }))
      }
    });

    conversationsClient.on("conversationJoined", (conversation) => {
      setValues((prevState)=>({...prevState,
        conversations: [...values.conversations, conversation]
      }))
      
    });
    conversationsClient.on("conversationLeft", (thisConversation) => {
      setValues((prevState)=>({...prevState,
        conversations: [...values.conversations.filter((it) => it !== thisConversation)]
      }))
    });
  };

  const handleAddParticipant= async({sid})=>{
    const identity= values.email
    console.log({sid, identity});
    const result= await addParticipant({sid, identity})
    console.log(result);
    if(result.conversation)
    {
      //alert(result.message)
    }
  }


  
    const { conversations,allConversations, selectedConversationSid, status } = values;
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
          myIdentity={values.email}
        />
      );
    } else if (status !== "success") {
      conversationContent = "Loading your conversation!";
    } else {
      conversationContent = "";
    }

    if (values.loggedIn) {
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
            <Layout>
              <Sider theme={"light"} width={250}>
                <ConversationsList
                  header={"Open Conversation"}
                  added={true}
                  conversations={conversations}
                  selectedConversationSid={selectedConversationSid}
                  onConversationClick={(item) => {
                    setValues((prevState)=>({...prevState,
                      selectedConversationSid: item.sid 
                    }))
                   
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
                    handleAddParticipant(item)
                    setValues((prevState)=>({...prevState,
                      selectedConversationSid: item.sid
                    }))
                  }}
                />
              </Sider>
            </Layout>
          </Layout>
        </div>
      );
    }
    if((values.loggedIn ==false) && (values.signUp===true) )
    {
      return <SignUpPage  onSubmit={signUp} toggleSignUp={toggleSignUp}  />
    }
    return <LoginPage onSubmit={logIn} toggleSignUp={toggleSignUp} />;
  
}

export default ConversationsApp;
