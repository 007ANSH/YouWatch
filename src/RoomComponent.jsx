import React, { useState, useEffect } from "react";
import { useRef } from "react";
import io from "socket.io-client";
import { FaCopy } from "react-icons/fa";
const RoomComponent = (props) => {
  const magic = useRef(null);
  const [socket, setSocket] = useState(null);
  const setRoom = props.setRoom;
  // const [roomId, setRoomId] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [joinBtn, setjoinBtn] = useState(true);
  var roomId = props.id;
  console.log(props);
  useEffect(() => {
    const newSocket = io("http://localhost:8080");
    setSocket(newSocket);

    newSocket.on("roomCreated", (roomId) => {
      console.log(`Room created with ID: ${roomId}`);
      setRoom(roomId);
    });

    newSocket.on("roomJoined", (roomId) => {
      console.log(`Joined room with ID: ${roomId}`);
      setRoom(roomId);
    });

    newSocket.on("userJoined", (socketId) => {
      console.log(`A new user joined with socket ID: ${socketId}`);
    });

    newSocket.on("chatMessage", ({ message, senderId }) => {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { senderId, message },
      ]);
    });

    newSocket.on("error", (errorMessage) => {
      console.error(errorMessage);
      setErrorMessage(errorMessage);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Send chat message
  const sendMessage = () => {
    if (socket && roomId && message.trim() !== "") {
      socket.emit("chatMessage", roomId, message);
      setMessage("");
    }
  };

  const copytoclip = () => {
    navigator.clipboard.writeText(roomId);
    magic.current.style.display = "flex";
    setTimeout(() => {
      magic.current.style.display = "none";
    }, 1000);
  };

  return (
    <div>
      {/* {joinBtn && <button onClick={() => {socket.emit('createRoom');console.log('click') ;setjoinBtn(false)}}>Create Room</button>} */}
      {joinBtn && (
        <button
          onClick={() => {
            socket.emit("createRoom");
            console.log("click");
            setjoinBtn(false);
          }}
          className="m-6 relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            Create Room
          </span>
        </button>
      )}
      {roomId && !joinBtn && (
        <div className="flex items-center justify-center">
          <p className="mx-2  mb-7 text-white">
            <span className="text-xl mx-3">Room ID:</span> {roomId}{" "}
          </p>
          <FaCopy onClick={copytoclip} className="h-5 mb-7 text-white " />
        </div>
      )}

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {
        <div className="flex w-[30vw] items-center justify-evenly">
          {joinBtn && (
            <div className="px-3 py-2 border rounded  w-56 bg-[#e5e7eb] text-[black]">
            <input
              className="w-full bg-transparent text-ellipsis overflow-hidden whitespace-nowrap outline-none"
              type="text"
              placeholder="Enter Room ID"
              onChange={(e) => setRoom(e.target.value)}
            />
          </div>
          
          )}
          {joinBtn && (
            <button
              className="shadow-[0_0_0_3px_#000000_inset] px-6 py-2 bg-transparent border border-black dark:border-white dark:text-white text-black rounded-lg font-bold "
              onClick={() => {
                socket.emit("joinRoom", roomId);
                setjoinBtn(false);
              }}
            >
              Join Room
            </button>
          )}
        </div>
      }

      <div className="">
        <h2 className=" my-2">Chat</h2>
        <div
          style={{
            height: "300px",
            overflowY: "scroll",
            border: "1px solid #ccc",
            padding: "10px",
          }}
        >
          {chatMessages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.senderId}:</strong> {msg.message}
            </div>
          ))}
        </div>
        <div className="flex justify-evenly items-center my-6  ">
          <input
            className="px-3 py-2 border rounded text-white"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message"
          />

          <button
            className="shadow-[0_0_0_3px_#000000_inset] px-6 py-2 bg-transparent border border-black dark:border-white dark:text-white text-black rounded-lg font-bold"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>

      <div
        id="toast-success"
        ref={magic}
        className="hidden animate-pulse absolute top-3 right-4 items-center w-56 max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
        role="alert"
      >
        <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
          </svg>
          <span className="sr-only">Check icon</span>
        </div>
        <div className="ms-3 text-sm font-normal">Copied to Clipboard.</div>
      </div>
    </div>
  );
};

export default RoomComponent;
