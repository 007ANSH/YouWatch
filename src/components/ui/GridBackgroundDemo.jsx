import React from "react";
import RoomComponent from "../../RoomComponent.jsx";
import YouTubePlayer from "../../YoutubePlayer.jsx";
import { useState } from "react";
import videoCamera from '../.././images/videoCamera.svg';
import board from '../.././images/board.svg';
import filmReel from '../.././images/filmReel.svg';
import popcorn from '../.././images/popcorn.svg';
import microphone from '../.././images/microphone.svg';
import glasses from '../.././images/glasses.svg';
import tickets from '../.././images/tickets.svg';

export function GridBackgroundDemo() {
  const [count, setCount] = useState(0);
  const [id, setid] = useState("dQw4w9WgXcQ");
  const [roomId, setRoomId] = useState(null);
  const setRoom = (data) => {
    setRoomId(data);
  };
  return (
    <>
    
    <div className="h-[100vh] w-full dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
    {/* Radial gradient for the container to give a faded look */}
      
      <div className=" absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      
      <div className=" font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 pb-3">
      <div> <h1 className=" pl-14 pb-16  text-center" >Video Room</h1> </div> 
        <div className="flex justify-center items-center  h-[60vh] w-[100vw]">
          <div className=" mx-5">{roomId && <YouTubePlayer videoId={id} roomId={roomId} />}</div>
          <div>
            <RoomComponent id={roomId} setRoom={setRoom} />
          </div>
        </div>
      </div>
    </div>
      <img src={popcorn} className="absolute left-[-1rem] top-[8rem] rotate-[39deg]" style={{filter: 'invert(1)',opacity:'0.3'}} height="90px" width="90px" alt="" srcset="" />
      <img src={board} className="absolute  z-50 top-[1.5rem] left-[47.5rem] rotate-[-35deg]" style={{filter: 'invert(1)' , opacity:'0.3'}} height="70px" width="70px" alt="" srcset="" />
      <img src={filmReel} className="absolute right-[-1rem] top-[2rem] " style={{filter: 'invert(1)', transform: 'scale(-1, 1)',opacity:'0.3'}} height="90px" width="90px" alt="" srcset="" />
      <img src={tickets} className="absolute bottom-[5rem] left-[0rem] " style={{filter: 'invert(1)',opacity:'0.3'}} height="90px" width="90px" alt="" srcset="" />
      <img src={videoCamera} className="absolute top-[-1.5rem]  left-[23rem] " style={{filter: 'invert(1)',opacity:'0.3'}} height="90px" width="90px" alt="" srcset="" />
      <img src={glasses} className="absolute z-0  right-[4.5rem] top-[33rem]" style={{filter: 'invert(1)',transform:'scale(-1,1)',opacity:'0.3'}} height="90px" width="90px" alt="" srcset="" />
      <img src={microphone} className="absolute top-[40rem] left-[30rem]" style={{filter: 'invert(1)',opacity:'0.3',transform:'rotate(-25deg)'}} height="90px" width="90px" alt="" srcset="" />
    </>
  );
}
