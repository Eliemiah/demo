import { useState, useEffect, useRef } from 'react'
import './Chat.css'
import io from "socket.io-client";
const URL = "http://localhost:5000";
const socket = io(URL, { autoConnect: false , cors: {origin: '*'}})

const Chat = props => {

    const [currentMessages, setCurrentMessages] = useState([
      {
        from: 'me',
        messages: [
            {content: 'Yes, Dovahkin?!', hour: '10:53', date: '2021-05-06', day: 'quarta-feira'},
            {content: 'Watch the skies, traveler?', hour: '10:54', date: '2021-05-06', day: 'quarta-feira'},
            {content: 'Let me guess...?', hour: '10:54', date: '2021-05-06', day: 'quarta-feira'},
        ]
    },
    {
      from: 'marianasWeeb',
      messages: [
          {content: 'Citizen!', hour: '10:53', date: '2021-05-06', day: 'quarta-feira'},
          {content: 'I used to be an adventurer like you', hour: '10:54', date: '2021-05-06', day: 'quarta-feira'},
          {content: 'No lollygaggin', hour: '10:54', date: '2021-05-06', day: 'quarta-feira'},
      ]
    }
    ])
  
    const messageComposer = useRef(null)

    let onMessage = content => {

      emitEvent('privateMessage', {
          from: 'me',
          content: content
      })
    }
    
    const getLastElement = (myTarget, isAstate) => {
  
      const lastElementIndex = myTarget => (myTarget.length - 1)
  
      return myTarget[lastElementIndex(myTarget)] || null
    }
    const updateState = (targetState, eventContent, isAbatch) => {
  
      const seters = {
        currentMessages: (content, isAbatch) => {
  
          let [...groupedMessages] = currentMessages
          let lastGroup = getLastElement(groupedMessages)
          let arr = []
  
          const updateGroupedMessages = message => {
              arr.push(message)
              if((lastGroup !== null && lastGroup.from) && lastGroup.from === message.from)
              { 
                lastGroup.messages.push(message)
              }else{
                groupedMessages.push({
                  from: content.from,
                  messages:[message]
                })
              }
            console.log('groupedMessages ', groupedMessages)
          }
  
  
          (isAbatch === true) ? content.forEach(updateGroupedMessages(content)) : updateGroupedMessages(content)
  
         // setCurrentMessages([...currentMessages], currentMessages.push({status:200}))
          setCurrentMessages([...groupedMessages])
  
        }
      }
  
      seters[`${targetState}`](eventContent, isAbatch)
  
    }
    const emitEvent = (eventType, eventContent) => {
      socket.emit(eventType, {content: eventContent})
      //socket.emit('regularMessage', 'eventContent')
      eventsActions[`${eventType}`](eventContent)
    }
  
    const eventsActions = {
      privateMessage: (eventContent, isAbatch) => {
        updateState('currentMessages', eventContent, isAbatch)
      }
    }
  
  
    useEffect(() => {
      /*
      socket.on("connect_error", (err) => {
        if(err.message === "invalid username"){
           console.log("Nome de usuario invalido.")
        }
      });
      */
      socket.prependAny((eventType, message) => {
  
        let hour = '15:21',
            date = '2021-07-09',
            day = 'quinta-feira'  
        
        let newMessage = {
            conversationID: message.conversationID,
            from: message.from,
            content: message.content,
            date,
            day,
            hour
        }
  
       eventsActions[`${eventType}`](newMessage)
      });
      
      socket.connect()
      
    },[])
    
//{currentMessages.map(group => {group.messages.map(message => (<p>{message.content}</p>))})}

  
  
    return (
      <div id='chat-body'>
        <div id='messages-box'>
          {currentMessages.map(group => {
            return(
              <div>
                <h5>{group.from}</h5>
                {group.messages.map(message => (<p>{message.content}</p>))}
              </div>
            )
          })}
        </div>
        <input type='text' placeholder='Digite algo...' ref={messageComposer}></input>
        <button onClick={() => onMessage(messageComposer.current.value)}>Enviar</button>
      </div>
    )
  }

export default Chat