import React, { useEffect, useRef } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/paraiso-dark.css'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/closebrackets'
import ACTIONS from '../actions';


const Editor = ({socketRef}) => {
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
        // console.log("changes",changes);
        const {origin}=changes;
        const code=instance.getValue();
        if(origin!== 'setValue'){
          socketRef.current.emit(ACTIONS.CODE_CHANGE);
        }
        console.log(code);
      })
    }
    init();
  },[0]);
  return (
    <>
    <textarea id='realtimeEditor'></textarea>
    </>
  )
}

export default Editor