import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import RoomComponent from './RoomComponent.jsx'
import YouTubePlayer from './YoutubePlayer.jsx'
import { GridBackgroundDemo } from './components/ui/GridBackgroundDemo.jsx'
import Landing from './Landing.jsx'
import { BackgroundBeams } from './components/ui/BackgroundBeams.jsx'
// import { GridSmallBackgroundDemo } from './components/ui/GridSmallBackgroundDemo.jsx'
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
function App() {
  const [count, setCount] = useState(0)
  const [id, setid] = useState("dQw4w9WgXcQ")
  const [roomId, setRoomId] = useState(null);
  const setRoom = (data)=>{
    setRoomId(data);
  }
  
  // console.log(`from main ${roomId}`)
  return (
    <>
      {/* <Landing/> */}
      {/* <BackgroundBeams/> */}
      <Router>
        <Routes>
          <Route path='/' element={<Landing/>} ></Route>
          <Route path='/room' element={<GridBackgroundDemo/>} ></Route>
          
        </Routes>
      </Router>
      
      {/* {roomId && <YouTubePlayer videoId={id} roomId={roomId} />}
      
      <RoomComponent id = {roomId} setRoom = {setRoom} /> */}
      
      {/* <GridSmallBackgroundDemo/> */}

    </>
  )
}

export default App
