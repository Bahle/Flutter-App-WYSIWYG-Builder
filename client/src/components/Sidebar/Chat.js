import React, { Component } from 'react';
import {
    MessageBox,
    ChatItem,
    ChatList,
    SystemMessage,
    MessageList,
    Input,
    Button,
    Avatar,
    Navbar,
    SideBar,
    Dropdown,
    Popup,
} from 'react-chat-elements';
import './Chat.css'
import 'react-chat-elements/dist/main.css';

export class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            show: true,
            messageList: [{
                position: (Math.random() > 0.5 ? 'right' : 'left'),
                forwarded: true,
                replyButton: true,
                reply: null,
                type: 'text',
                theme: 'white',
                view: 'list',
                title: 'Tongue twister',
                text: `She sells sea shells on the sea shore`,
                status: 'read',
                date: +new Date(),
                onReplyMessageClick: () => {
                    console.log('onReplyMessageClick');
                },
                avatar: '/images/black faces/XzAyNDUxMDAuanBn.jpg'
            }],
        };
    }

    random(type) {
        switch (type) {
            case 'message':
                var type = -1;
                var status = 'waiting';
                type = 'text';
                status = 'read';
                
                return {
                    position: (Math.random() > 0.5 ? 'right' : 'left'),
                    forwarded: true,
                    replyButton: true,
                    reply: null,
                    type: type,
                    theme: 'white',
                    view: 'list',
                    title: 'Lorem ipsum dolor sit amet',
                    text: `Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure`,
                    status: 'read',
                    date: +new Date(),
                    onReplyMessageClick: () => {
                        console.log('onReplyMessageClick');
                    },
                    avatar: '/images/black faces/XzAyNDUxMDAuanBn.jpg'
                };
        }
    }

    addMessage() {
        var list = this.state.messageList;
        list.push(this.random('message'));
        this.setState({
            messageList: list,
        });
    }

    render() {
        return (
            <div className='container'>
                <div
                    className='right-panel'>
                    <MessageList
                        className='message-list'
                        lockable={true}
                        downButtonBadge={10}
                        dataSource={this.state.messageList} />

                    <Input
                        placeholder="Type a message"
                        defaultValue=""
                        ref='input'
                        multiline={true}
                        onKeyPress={(e) => {
                            if (e.shiftKey && e.charCode === 13) {
                                return true;
                            }
                            if (e.charCode === 13) {
                                this.refs.input.clear();
                                this.addMessage();
                                e.preventDefault();
                                return false;
                            }
                        }}
                        rightButtons={
                            <Button
                                text='Send'
                                onClick={this.addMessage.bind(this)} />
                        } />
                </div>
            </div>
        );
    }
}

export default App;
