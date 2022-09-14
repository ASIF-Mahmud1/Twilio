import React from 'react';
import { List, Typography, Button, Icon } from "antd";

import conversationsListStyles from "./assets/ConversationsList.module.css";
import conversationsItemStyles from "./assets/ConversationsItem.module.css";

import { joinClassNames } from "./utils/class-name";

const { Text } = Typography;

export class ConversationsList extends React.Component {
    render() {
        const { conversations, selectedConversationSid, onConversationClick, header, added } = this.props;

        return (
            <List
                header={header}
                className={conversationsListStyles['conversations-list']}
                bordered={true}
                loading={conversations.length === 0}
                dataSource={conversations}
                renderItem={item => {
                    const activeChannel = item.sid === selectedConversationSid;
                    const conversationItemClassName = joinClassNames([
                        conversationsItemStyles['conversation-item'],
                        activeChannel && conversationsItemStyles['conversation-item--active']
                    ]);

                    return (
                        <List.Item
                            key={item.sid}
                            className={conversationItemClassName}
                            style={activeChannel? {backgroundColor:'grey' } : {backgroundColor:'transparent'}}
                        >
                            <Text
                                strong
                                className={conversationsItemStyles['conversation-item-text']}
                                style={activeChannel? {color:'white' } : {color:'black'}}
                            >
    
                            {

                                item.uniqueName===localStorage.getItem("email") ?  "Customer Service" :  item.friendlyName || item.sid
                            }
                            </Text>
                            <Button   onClick={() => onConversationClick(item)}>
                                {
                                    added ?  <Icon type={"right"} />: <Icon type={"plus"} />
                                }
                               
                            </Button>
                        </List.Item>
                    )
                }}
            />
        )
    }
}
