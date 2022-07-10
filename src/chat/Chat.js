import React, { useEffect, useState } from 'react';
import  "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Avatar,
  Conversation,
  ConversationHeader,
  InfoButton,
  ConversationList,
  TypingIndicator,
  Sidebar,
  Search,
  ExpansionPanel,
  
} from "@chatscope/chat-ui-kit-react";


//Socket Imports
import socketClient from "socket.io-client";
const SERVER = "http://localhost:8000";
//const socket = socketClient(SERVER);

const avatarIco = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAZlBMVEUOHCyclYufmI0AECZvbGkAACCjm5AIGCoxOUIAEycAFSgLGisNHCwEFykDFyljY2N9enUlLjkACCKWkIc+Q0lmZmWIhH0bJjN/e3YVIjGSjYRAREpbXF0tND54dXGEgHpKTVFTVVcfARIMAAADVklEQVR4nO3ciXaiMABA0ZA4lhBEcV+r/v9PTtA6FUVGLXOyzLtf4DtktVghAAAAAAAAAAAAAAAAAAAAAABAuIwej9XAuP4Y/4xR5XY+6U11pI1GL4ZrmSQyGaXZIHf9cTqXa7Gt+ipSfqZ64PoTdcuoYjj56js3jtJxRM/RqMUwueo7Ny6nqohjPtr1Zbi+6Ts1JqNpFsGak2eLxr5z4zItAp+PRtfn313jaT66/pTvM2p1N//uGvv7YOdjNf/ant/VWJ3qABsv+/szzmtOWHtHrldP950a7XwM6QxglJk9Mz7rjcvpOJCxWs2/v60vzY37qc78b7R9s1fGZ60xWW58PwMYu7+/Oj5vGr0+A9yer99qrM4AheuSZnZ/n8kf9p0a7RnAyzVHly+vnw8bq/no3faYbd5dX5obe749xNy8s0G0NW6166a6bNttYJJMxq6b6lSv68L+L9dNdRRSSKF7FFJIoXsUUkihexRSSKF7FFJIoXsUUkihexRSSKF7FFJIoXsUUkihexRSSKF7FL5Oxl4oR8p1U13XhXJdevb6ZbeFUo5K396E7rJQyvlBfLguutVdoUyWB+PfO9BdFUopZztV+NfXUaHs749KebbCXHTwFrScfKbGs5e7r5iy/7M8uR7ulNe/0Bt//uTHQNXq6evwvMjz+buJMumlYw9Xz1sfi7cS7ePbikB+XJntXk+Uk9FmpT0fnt+K3frFxzeZpdrLze+RbPdKX39+XKmPkPqsLJ0825d82tUlmOH5LZs+k2gf37DMwlhd7mSbJx7f/mBXl8CG5x+5PvzlcCP3UxXi8Pymju17xjys1bOJaj2Ey6O/h+tnGT1s+38taaArzLU8m7Ukpt59P/GGvO0+HEWhMC13qTgKRV48TIykUBgxepAYS6Ew+b45MZpCu2k0XxfjKRRm1ZgYUaEoyqbEmArtjbjhv4FEVdh46Y+rsCkxskKhN7eX/tgKhTrEXmgTZeSFuap/rxFf4e33GjEW1i/9MRbWL/1RFopc9/pxF15/rxFpoR2ol0t/rIX2Rvx16Y+20F4Xz5f+eAvtUzxdFyMuFKaw10Xp2zuHnRqU8/5chf53mVaDxSHqRyiqgRp5IAAAAAAAAAAAAAAAAAAAAAAA/4Hf0gU2cK/EibwAAAAASUVORK5CYII=";



const Chat = ({user,setUser}) => {
  
  const [channels,setChannels] = useState(null);
  const [currChannel,setChannel] = useState(null);
  const [socket,setSocket] = useState(null);
  const [messageInputValue, setMessageInputValue] = useState("");
  const [currentChannelID, setCurrID] = useState(0);



  
  useEffect(() =>{
    if(socket === null){
      setSocket(socketClient(SERVER));

    }
    else{
      socket.emit('newLogin',user);
      socket.on('message',message =>{
        setChannels(message.message);
        setCurrID( prevID =>{
          let channelTemp = message.message.find(c => {
            return c.id === prevID;
          });
          
          if(prevID === message.currId){
            setChannel(channelTemp );
          }
          return prevID;
        })
        
        
      })
    }
    
  },[socket,user])

  useEffect(() => {

    const callAPI = () =>{
      
      fetch('http://localhost:8000/getChannels')
      .then(res => res.json())
      .then(data => {
          setChannel(data.channels[0]);
          setCurrID(0);
          setChannels(data.channels);
      })
      .catch((err) => {
        console.log(err);
      })
    } 
    
    callAPI();
    
    return() =>{
      
    }
  },[]);

  

  

  const handleChannelSelect = id => {
     
     let channelTemp = channels.find(c => {
      return c.id === id;
    });
    setCurrID(id);
    setChannel(channelTemp );
    socket.emit('channel-join', id);
  }    

  const handleSendMessage = (channel_id,text) => {
    const newMessage = { channel_id, text, senderName: user, id: Date.now() };
    socket.emit('send-message', newMessage);
  }    

  const handleLogout = () =>{
    setUser(null);
    socket.emit('kill-conversation', user);
  }

  return (
        <div
          style={{
            height: "100%",
            position: "relative"
          }}
        >
          <MainContainer responsive>
            <Sidebar position="left" scrollable={false}>
            <ConversationHeader>
                <ConversationHeader.Back title="Logout" onClick={handleLogout}/>
                <Avatar src={avatarIco} name="Zoe" />
                <ConversationHeader.Content
                  userName={user? user : ""}
                  
                />
                
              </ConversationHeader>
              <Search placeholder="Search..." />
              <ConversationList>
                {channels && channels.map((c) => 
                  <Conversation
                    onClick={() => handleChannelSelect(c.id)}
                    key={c.id}
                    name={c.name}
                    lastSenderName={ c.messages.length > 0 ? c.messages.slice(-1)[0].senderName : null}
                    info={c.messages.length > 0 ? c.messages.slice(-1)[0].text : null}
                    active={c.id === currentChannelID ? true : false}
                  >
                    <Avatar src={avatarIco} name="Lilly" status="available" />
                  </Conversation>
                )}
                

              </ConversationList>
            </Sidebar>

            <ChatContainer>
              <ConversationHeader>
                <ConversationHeader.Back />
                <Avatar src={avatarIco} name="Zoe" />
                <ConversationHeader.Content
                  userName={currChannel? currChannel.name : ""}
                  
                />
                <ConversationHeader.Actions>
                  
                  
                  <InfoButton />
                </ConversationHeader.Actions>
              </ConversationHeader>
              <MessageList
                typingIndicator={messageInputValue.length > 0 && user? <TypingIndicator content={user} /> : null}
              >

                {currChannel && currChannel.messages.length > 0 ?  currChannel.messages.map(({text,senderName,id})=>{

                  var stat = senderName === user ? "outgoing" : "incoming";
                  return(<Message
                    key={id}
                    model={{
                      message: text,
                      sentTime: "15 mins ago",
                      sender: senderName,
                      direction: stat,
                      position: "single"
                      }}
                    >
                    <Avatar src={avatarIco} name={senderName} />
                  </Message>)
                }
                  
                  ) : null}
                   
                  

                
              </MessageList>
              <MessageInput
                placeholder="Type message here"
                value={messageInputValue}
                onChange={(val) => setMessageInputValue(val)}
                onSend={() => {handleSendMessage(currChannel.id,messageInputValue);setMessageInputValue("");}}
                attachButton={false}
              />
            </ChatContainer>

            <Sidebar position="right">
              
              <ExpansionPanel title="OPTIONS">
                <p>Edit</p>
                <p>Settings</p>
              </ExpansionPanel>
            </Sidebar>
          </MainContainer>
        </div>
  );
}

export default Chat;