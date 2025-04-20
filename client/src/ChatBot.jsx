// import React from "react";

// const ChatBot = () => {
//   return (
//     <iframe
//       title="ChatBot"
//       style={{
//         position: "fixed",
//         bottom: "20px",
//         right: "20px",
//         height: "500px",
//         width: "370px",
//         border: "none",
//         zIndex: 9999,
//       }}
//       srcDoc={`
//         <!DOCTYPE html>
//         <html>
//           <head>
//             <script src="https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1"></script>
//           </head>
//           <body>
//             <df-messenger
//               intent="WELCOME"
//               chat-title="NGO_EdTech-ChatBot"
//               agent-id="692d0042-a9c5-45ec-833f-a547a80d1ed4"
//               language-code="en"
//             ></df-messenger>
//           </body>
//         </html>
//       `}
//     />
//   );
// };

// export default ChatBot;

//-----======>>>>>>    please install this --     npm install react-responsive    -----------=========


import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";

const ChatBot = () => {
  const isMobile = useMediaQuery({ maxWidth: 600 });
  const [panelOpen, setPanelOpen] = useState(false);
  const [rightPosition, setRightPosition] = useState("20px");
  const [bottomPosition, setBottomPosition] = useState("20px");

  useEffect(() => {
    const handlePanelToggle = () => {
      // Adjust these values based on your panel's actual width
      const panelWidth = 300; // Estimated panel width in pixels
      const newRight = document.documentElement.offsetWidth - window.innerWidth > 0 ? 
        `${panelWidth + 20}px` : "20px";
      
      setRightPosition(newRight);
      setPanelOpen(document.documentElement.offsetWidth !== window.innerWidth);
    };

    // Add event listeners for your panel toggle events
    window.addEventListener('resize', handlePanelToggle);
    
    // Initialize position
    handlePanelToggle();

    return () => window.removeEventListener('resize', handlePanelToggle);
  }, []);

  return (
    <iframe
      title="ChatBot"
      style={{
        position: "fixed",
        bottom: isMobile ? "10px" : bottomPosition,
        right: isMobile ? "10px" : rightPosition,
        width: isMobile ? "calc(100% - 20px)" : panelOpen ? "300px" : "370px",
        height: isMobile ? "50vh" : "500px",
        maxWidth: "90vw",
        maxHeight: "80vh",
        border: "none",
        zIndex: 9999,
        borderRadius: "8px",
        transition: "all 0.3s ease-in-out",
      }}
      srcDoc={`<!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <style>
              html, body {
                margin: 0;
                padding: 0;
                height: 100%;
                width: 100%;
                background: transparent;
              }

              df-messenger {
                width: 100% !important;
                height: 100% !important;
              }

              @media (max-width: 600px) {
                df-messenger {
                  height: 85vh !important;
                }
              }
            </style>
            <script src="https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1"></script>
          </head>
          <body>
            <df-messenger
              intent="WELCOME"
              chat-title="NGO_EdTech-ChatBot"
              agent-id="692d0042-a9c5-45ec-833f-a547a80d1ed4"
              language-code="en"
            ></df-messenger>
          </body>
        </html>`}
    />
  );
};

export default ChatBot;
