import React from 'react';
import { Layout, Button, Form, Row, Col, Card } from 'antd';
import { ReactComponent as Logo } from './conversation/assets/twilio-logo-red.svg';
import ChatRoot from './conversation/App';
import VideoRoot from './video/App'

const { Content } = Layout;

export class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showConversation: false,
            showVideoCall: false,
        };
    }

    show = (component) => {
        if (component === 'chat') {
            this.setState({ showConversation: true })
        }
        if (component === 'video') {
            this.setState({ showVideoCall: true })
        }

    }

    render() {
        if (this.state.showConversation === false && this.state.showVideoCall === false) {
            return <ChooseApplication show={this.show} />
        }

        if (this.state.showConversation) {
            return <ChatRoot />
        }

        if (this.state.showVideoCall) {
            return <VideoRoot />
        }

    }
}

const ChooseApplication = ({ show }) => {
    return (
        <Layout>
            <Content style={{ height: '100vh' }}>
                <Row type="flex" justify="space-around" align="middle" style={{ height: '100%' }}>
                    <Col span={12} offset={6}>
                        <Card style={{ maxWidth: '404px' }}>
                            <Row type="flex" justify="center" align="middle" style={{ marginBottom: '30px' }}>
                                <Logo />
                            </Row>
                            <Row>
                                <p style={{ fontSize: 20, textAlign: 'center' }}>Choose Application</p>
                            </Row>

                            <Form.Item>
                                <Button block type="primary" onClick={() => { show("chat") }} >
                                    Conversation
                                </Button>
                            </Form.Item>
                            <Form.Item>
                                <Button block type="secondary" onClick={() => { show("video") }}>
                                    Video Call
                                </Button>
                            </Form.Item>

                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    )
}

export default Home
