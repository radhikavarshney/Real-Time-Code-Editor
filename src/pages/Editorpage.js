import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';

import Client from '../componenets/Client.js'
import Editor from '../componenets/Editor.js'
import { initSocket } from '../socket.js';
import ACTIONS from '../actions.js';
import {useLocation, useNavigate, Navigate, useParams} from 'react-router-dom';

const Editorpage = () => {
  const socketRef =useRef(null);
  const location = useLocation();
  const reactNavigator= useNavigate();
  const {roomId}=useParams();
  const [clients, setClients]= useState([]);

 

  useEffect(()=>{
    const init= async ()=>{
      socketRef.current= await initSocket();
      socketRef.current.on('connect_error',(err)=> handleErrors(err));
      socketRef.current.on('connect_failed',(err)=> handleErrors(err));

function handleErrors(e){
  console.log('socket error', e);
  toast.error('Socket connection failed, try again later!');
  reactNavigator('/');
}

      socketRef.current.emit(ACTIONS.JOIN,{ 
        roomId,
        username:location.state?.username
      });

      //Listening for joined event
      socketRef.current.on(ACTIONS.JOINED,({clients, username,socketId})=>{
          if(username!== location.state.username){
            toast.success(`${username} joined the room!!`);
            console.log(`${username} joined`);
          }
          setClients(clients);
      });

      //Listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED,({socketId,username})=>{
        toast.success(`${username} left the room.`);
        setClients((prev)=>{
            return prev.filter(client => client.socketId !== socketId)
        });
      });

      }; 
    init();

    return ()=>{
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED)
      socketRef.current.off(ACTIONS.DISCONNECTED);
    }
  },[]);

  if(!location.state){
    <Navigate  to='/' />
  }

  return <div className='mainWrap'>
    <div className='aside'>
      <div className='asideInner'>
        <div className='logo'>
          <img className='logoImg' src='/code-sync.png' alt='logo'></img>
        </div>
        <h3>Connected</h3>
        <div className='clientList'>
          {clients.map((client)=>(
            <Client key={client.socketID} username={client.username}/>
          ))}
        </div>
      </div>
      <button className='btn copyBtn'>Copy ROOM ID</button>
      <button className='btn leaveBtn'>Leave</button>
    </div>
    <div className='editorWrap'>
      <Editor socketRef={socketRef} />
    </div>
  </div>
}

export default Editorpage