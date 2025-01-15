import React from "react";
import call from "./images/call1.jpg"
import { GridSmallBackgroundDemo } from "./components/ui/GridSmallBackgroundDemo";
import youtube from './images/youtube.svg'
import videoCamera from './images/videoCamera.svg';
import board from './images/board.svg';
import filmReel from './images/filmReel.svg';
import popcorn from './images/popcorn.svg';
import microphone from './images/microphone.svg';
import glasses from './images/glasses.svg';
import tickets from './images/tickets.svg';
import { Link } from "react-router-dom";


function Landing() {
  return (
    <>
      <div className="h-[100vh] w-full dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
        {/* Radial gradient for the container to give a faded look */}

        <div className=" w-[100vw]  absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

        <div className="flex font-bold absolute top-[6rem] z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 pb-3">
          <div className=" text-left flex flex-col justify-center items-center h-[60vh] w-[45vw]">

            <div className="text-5xl leading-[4rem] px-6 my-16">Watch YouTube  <img className="inline-block pb-2" src={youtube} alt="" srcset="" height="60px" width="60px" 
            style={{filter: 'invert(1)'}} />  With Friends, No Matter Where You Are!</div>

            <div className="text-base  leading-[2rem] px-6">
              
              Sync your favorite videos with friends in real-time. Create a room, share the link, and enjoy the show together – all in perfect harmony.
            </div>
            <div className="my-6 py-6">
                <Link to='/room'
              className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="inline-flex h-full w-[10rem] cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                GET STARTED
              </span>
            </Link>
            </div>
            
          </div>
          <div className=" h-[75vh] rounded-lg w-[35vw]" style={{backgroundImage: `url(${call})`,backgroundPosition:'center',backgroundSize:'cover',opacity:'0.9' }}></div>
          
          
          

        </div>
        
        {/* background  */}
          <img src={popcorn} className="absolute left-[-1rem] top-[8rem] rotate-[39deg]" style={{filter: 'invert(1)',opacity:'0.3'}} height="90px" width="90px" alt="" srcset="" />
          <img src={board} className="absolute  z-50 top-[1.5rem] left-[47.5rem] rotate-[-35deg]" style={{filter: 'invert(1)' , opacity:'0.3'}} height="70px" width="70px" alt="" srcset="" />
          <img src={filmReel} className="absolute right-[-1rem] top-[2rem] " style={{filter: 'invert(1)', transform: 'scale(-1, 1)',opacity:'0.3'}} height="90px" width="90px" alt="" srcset="" />
          <img src={tickets} className="absolute bottom-[5rem] left-[0rem] " style={{filter: 'invert(1)',opacity:'0.3'}} height="90px" width="90px" alt="" srcset="" />
          <img src={videoCamera} className="absolute top-[-1.5rem]  left-[23rem] " style={{filter: 'invert(1)',opacity:'0.3'}} height="90px" width="90px" alt="" srcset="" />
          <img src={glasses} className="absolute z-0  right-[4.5rem] top-[33rem]" style={{filter: 'invert(1)',transform:'scale(-1,1)',opacity:'0.3'}} height="90px" width="90px" alt="" srcset="" />
          <img src={microphone} className="absolute top-[40rem] left-[38rem]" style={{filter: 'invert(1)',opacity:'0.3',transform:'rotate(-25deg)'}} height="90px" width="90px" alt="" srcset="" />
      </div>
      
      
    </>
  );
}

export default Landing;
