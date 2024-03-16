import React, { useEffect, useRef } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/paraiso-dark.css'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/closebrackets'
import ACTIONS from '../actions';


const Editor = ({socketRef,roomId, onCodeChange}) => {
  const editorRef= useRef(null);
  useEffect(()=>{
    
    async function init(){
    
      editorRef.current=CodeMirror.fromTextArea(
        document.getElementById('realtimeEditor'),
        {

          mode:{name: 'javascript', json:'true'},
          theme:'paraiso-dark',
          autoClogeTags:'true',
          autoCloseBrackets:'true',
          lineNumbers:'true'

        }

      );

      editorRef.current.on('change',(instance, changes)=>{
        const {origin}=changes;
        const code=instance.getValue();
        onCodeChange(code);
        if(origin!== 'setValue'){
          socketRef.current.emit(ACTIONS.CODE_CHANGE,{
            roomId,
            code
          }
            );
        }
      });

    }
    init();
    /* eslint-disable-next-line*/
  },[]);


  useEffect(()=>{
    if(socketRef.current){
      socketRef.current.on(ACTIONS.CODE_CHANGE,({code})=>{
        if(code !== null){
          editorRef.current.setValue(code);
        }
      });
    }

    return ()=>{
      /* eslint-disable-next-line*/
      socketRef.current.off(ACTIONS.CODE_CHANGE)
    }
    /* eslint-disable-next-line*/
  },[socketRef.current]);

  return (
    <>
    <textarea id='realtimeEditor'></textarea>
    </>
  )
};

export default Editor