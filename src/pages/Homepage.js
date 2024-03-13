import React,{useState} from 'react'
import {v4 as uuidV4} from "uuid";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
    const navigate=useNavigate();
    const [roomId,setRoomId]= useState('');
    const[username, setUsername]= useState('');

    const createNewRoom= (e) =>{
        e.preventDefault();//prevent reloading of page on clicking the join button
        console.log("first")
        const id=uuidV4();
        setRoomId(id);
        toast.success('Created new room');
    };

    const joinRoom=()=>{
        if(!roomId || !username){
            toast.error('ROOM ID & username is required');
            return;
        }

        navigate(`/editor/${roomId}`,{
            //this will help to pass parameters to get pass on from one router to another
            state:{      
                username,
            }
        })
    };

    const handleInputEnter=(e)=>{
        console.log(e.code)
        if(e.code === 'Enter'){
            console.log("ssss")
            joinRoom();
        }
    };

  return (<div className='homePageWrapper'>
        <div className='formWrapper'>
             <img className='homePageLogo' src='/code-sync.png' alt='code-sync-logo'></img>
             <h4 className='mainLabel'>Enter invitation ROOM ID</h4>

             <div className='inputGroup'>
                <input 
                type='text' 
                className='inputBox' 
                placeholder='ROOM ID' 
                onChange={(e)=> setRoomId(e.target.value)} 
                value={roomId}
                onKeyUp={handleInputEnter}
                />

                <input 
                type='text' 
                className='inputBox' 
                placeholder='USERNAME' 
                onChange={(e)=> setUsername(e.target.value)} 
                value={username}
                onKeyUp={handleInputEnter}
                />

                <button className='btn joinBtn' onClick={joinRoom}>JOIN</button>
                <span className='createInfo'>
                    If you don't have an invite then create &nbsp;
                    <a onClick={createNewRoom} href='' className='createNewBtn'>new room</a>
                </span>
             </div>

        </div>

        <footer>
        <h4>Built with ❤️ by <a href='https://github.com/radhikavarshney'>Radhika-Varshney</a></h4>
        </footer>
  
    </div>)

}

export default Homepage