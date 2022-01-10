import React from "react";
import ReactDOM from "react-dom";

export default function App()
{
  return (
  
     <div style="  
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      overflow: auto;
      " >
        <iframe
        src="https://hubs.mozilla.com/wB2AKzv?embed_token=1a8ce2213486db56432220f80ebdab8a"
        style=" 
        height: 100%;
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        overflow: auto;
        background: black;
        "        
        allow="microphone; camera; vr; speaker; xr-spatial-tracking"
      ></iframe>
      </div> 	
    
  );
}


