import React, {useState, useEffect} from "react";
import { Badge, Icon, Layout, Result, Spin, Typography } from "antd";
import { Client as ConversationsClient } from "@twilio/conversations";

import ".././assets/Conversation.css";
import ".././assets/ConversationSection.css";

import Conversation from "../components/conversation/Conversation";
import LoginPage from "../components/auth/LoginPage";
import SignUpPage from "../components/users/SignUp";
import { getTwilioToken, signin } from "../api/auth.api";
import { list, addParticipant } from "../api/conversation.api";
import { signup } from "../api/user-api";
import TopBar from "../components/conversation/TopBar";
import SideBar from "../components/conversation/SideBar";

const { Content } = Layout;

let conversationsClient =null
const ConversationsApp =()=>{

  const email = localStorage.getItem("email") || "";
  const password = localStorage.getItem("password") || "";
  const loggedIn = email !== "";

  const [values,setValues] = useState({
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
    admin:false,
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
    localStorage.removeItem("admin");
    conversationsClient.shutdown();
  };


  const getToken = async() => {
    // Paste your unique Chat token function
    
    const {twilioToken, user} = await  signin({email:values.email, password:values.password}) //"<Your token here>";
   if(twilioToken)
   {
     const{admin}= user
     localStorage.setItem("email",values.email);
     localStorage.setItem("password", values.password);
     localStorage.setItem("admin", admin);
     setValues((prevState)=>({...prevState,token: twilioToken , admin, loggedIn: true }))

   
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
        conversations: [...prevState.conversations, conversation]
      }))
      
    });
    conversationsClient.on("conversationLeft", (thisConversation) => {
      setValues((prevState)=>({...prevState,
        conversations: [...prevState.conversations.filter((it) => it !== thisConversation)]
      }))
    });
  };

  const handleAddParticipant= async({sid})=>{
    const identity= values.email
    const result= await addParticipant({sid, identity})
    if(result.conversation)
    {
      //alert(result.message)
    }
  }


  
    const { conversations,allConversations, selectedConversationSid, status, admin} = values;
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
            <TopBar  selectedConversation={selectedConversation} values={values} logOut={logOut} />
            <Layout>
               <SideBar conversations= {conversations} selectedConversationSid={selectedConversationSid} handleParentState={ (item)=> setValues((prevState)=>({...prevState, selectedConversationSid: item.sid  }))}  />
            
              <Content className="conversation-section">
                <div id="SelectedConversation">{conversationContent}</div>
              </Content>
            
            {
               admin== true && 
            
              <SideBar conversations= {unSubscribedConversations} selectedConversationSid={selectedConversationSid} handleParentState={(item)=>{
                  handleAddParticipant(item)
                  setValues((prevState)=>({...prevState,
                    selectedConversationSid: item.sid
                  }))
              }} />
            }
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
