import React, { useState, useEffect, Component } from 'react';
import './assets/Conversation.css';
import Dropzone from 'react-dropzone';
import styles from './assets/Conversation.module.css'
import {Button, Form, Icon, Input} from "antd";
import ConversationsMessages from "./ConversationsMessages";
import PropTypes from "prop-types";
import{usePrevious} from './hooks/hooks'
const Conversation =(props)=>  {
  const [values, setValues]= useState({
    newMessage: '',
        conversationProxy: props.conversationProxy,
        messages: [],
        loadingState: 'initializing',
        boundConversations: new Set()
  })
  const oldState = usePrevious(values)


  const loadMessagesFor = (thisConversation) => {
    if (values.conversationProxy === thisConversation) {
        thisConversation.getMessages()
            .then(messagePaginator => {
                if (values.conversationProxy === thisConversation) {
                  setValues((prevState)=>({...prevState,
                    messages: messagePaginator.items, loadingState: 'ready'
                  }))
                    
                }
            })
            .catch(err => {
                console.error("Couldn't fetch messages IMPLEMENT RETRY", err);
               
                setValues((prevState)=>({...prevState,
                  loadingState: "failed"
                }))
            });
    }
  };



  useEffect(()=>{
    if (values.conversationProxy) {
      loadMessagesFor(values.conversationProxy);

      if (!values.boundConversations.has(values.conversationProxy)) {
          let newConversation = values.conversationProxy;
          newConversation.on('messageAdded', m => messageAdded(m, newConversation));
          setValues((prevState)=>({...prevState,
            boundConversations: new Set([...values.boundConversations, newConversation])
          }))
        
      }
    }
  },[])



  useEffect(()=>{
    if (values.conversationProxy !== oldState.conversationProxy) {
      this.loadMessagesFor(values.conversationProxy);

      if (!values.boundConversations.has(values.conversationProxy)) {
          let newConversation = values.conversationProxy;
          newConversation.on('messageAdded', m => messageAdded(m, newConversation));
          setValues((prevState)=>({...prevState,
            boundConversations: new Set([...values.boundConversations, newConversation])
          }))
         
      }
  }

  },[values.conversationProxy])

  // static getDerivedStateFromProps(newProps, oldState) {
  //   let logic = (oldState.loadingState === 'initializing') || oldState.conversationProxy !== newProps.conversationProxy;
  //   if (logic) {
  //     return { loadingState: 'loading messages', conversationProxy: newProps.conversationProxy };
  //   } else {
  //     return null;
  //   }
  // }

  const messageAdded = (message, targetConversation) => {
    if (targetConversation === values.conversationProxy)
    {
      setValues((prevState)=>({...prevState,
        messages: [...prevState.messages, message]
      }))
    }
      
  };

  onMessageChanged = event => {
    setValues((prevState)=>({...prevState,
      newMessage: event.target.value 
    }))

  };

  sendMessage = event => {
    event.preventDefault();
    const message = values.newMessage;
    setValues((prevState)=>({...prevState,
      newMessage: '' 
    }))
    values.conversationProxy.sendMessage(message);
  };

  onDrop = acceptedFiles => {
    values.conversationProxy.sendMessage({contentType: acceptedFiles[0].type, media: acceptedFiles[0]});
  };


    return (
        <Dropzone
            onDrop={this.onDrop}
            accept="image/*">
          {({getRootProps, getInputProps, isDragActive}) => (
              <div
                  {...getRootProps()}
                  onClick={() => {
                  }}
                  id="OpenChannel"
                  style={{position: "relative", top: 0}}>

                {isDragActive &&
                <div className={styles.drop}>
                  <Icon type={"cloud-upload"}
                        style={{fontSize: "5em", color: "#fefefe"}}/>
                  <h3 style={{color: "#fefefe"}}>Release to Upload</h3>
                </div>
                }
                <div
                    className={styles.messages}
                    style={{
                      filter: `blur(${isDragActive ? 4 : 0}px)`,
                    }}
                >
                  <input id="files" {...getInputProps()} />
                  <div style={{flexBasis: "100%", flexGrow: 2, flexShrink: 1, overflowY: "scroll"}}>
                    <ConversationsMessages
                        identity={this.props.myIdentity}
                        messages={values.messages}/>
                  </div>
                  <div>
                    <Form onSubmit={this.sendMessage}>
                      <Input.Group compact={true} style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row"
                      }}>
                        <Input
                            style={{flexBasis: "100%"}}
                            placeholder={"Type your message here..."}
                            type={"text"}
                            name={"message"}
                            id={styles['type-a-message']}
                            autoComplete={"off"}
                            disabled={values.loadingState !== 'ready'}
                            onChange={this.onMessageChanged}
                            value={values.newMessage}
                        />
                        <Button icon="enter" htmlType="submit" type={"submit"}/>
                      </Input.Group>
                    </Form>
                  </div>
                </div>
              </div>
          )}

        </Dropzone>
    );
  
}

Conversation.propTypes = {
  myIdentity: PropTypes.string.isRequired
};

export default Conversation;