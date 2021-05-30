import { useState, useEffect, useRef } from 'react'
import './Chat.css'
import io from "socket.io-client";
const URL = "http://localhost:5000";
const socket = io(URL, { autoConnect: false , cors: {origin: '*'}})

const Chat = props => {


    const [currentMessages, setCurrentMessages] = useState([
      {
        groupID: 'gp0',
        from: 'me',
        messages: [
            {content: 'Yes, Dovahkin?!', id: 'gp0m0', hour: '10:53', date: '2021-05-06', day: 'quarta-feira'},
            {content: 'Watch the skies, traveler?',id: 'gp0m1', hour: '10:54', date: '2021-05-06', day: 'quarta-feira'},
            {content: 'Let me guess...?', id: 'gp0m2', hour: '10:54', date: '2021-05-06', day: 'quarta-feira'},
        ]
    },
    {
      groupID: 'gp1',
      from: 'marianasWeeb',
      messages: [
          {content: 'Citizen!', id: 'gp1m0' , hour: '10:53', date: '2021-05-06', day: 'quarta-feira'},
          {content: 'I used to be an adventurer like you', id: 'gp1m1' , hour: '10:54', date: '2021-05-06', day: 'quarta-feira'},
          {content: 'No lollygaggin', id: 'gp1m2' , hour: '10:54', date: '2021-05-06', day: 'quarta-feira'},
      ]
    }
    ])


  
    //const [currentMessages, setCurrentMessages] = useState([])
  
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
  
          const updateGroupedMessages = message => {
            if((lastGroup !== null && lastGroup.from) && lastGroup.from === message.from)
            { 
              message.id = lastGroup.groupID +'m' + lastGroup.messages.length
              
              lastGroup.messages.push(message)
            }else{
              message.id = 'gp' + groupedMessages.length +'m' + lastGroup.messages.length

              groupedMessages.push({
                groupID: `gp${groupedMessages.length}`,
                from: content.from,
                messages:[message]
              })
            }
            console.log('groupedMessages ', groupedMessages)
          }
  
  
          (isAbatch === true) ? content.forEach(updateGroupedMessages(content)) : updateGroupedMessages(content)
  
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
     
  
    return (
      <div id='chat-body'>
        <div id='messages-box'>
          {currentMessages.map(group => {
            return(
              <div key={group.groupID} data={group.groupID}>
                <h5>{group.from}</h5>
                {group.messages.map(message => (<p key={message.id}>{message.content}</p>))}
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