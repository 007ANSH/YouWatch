import React, { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";

const YouTubePlayer = ({ videoId: initialVideoId, roomId }) => {
  const playerRef = useRef(null);
  const [videoId, setVideoId] = useState(initialVideoId);
  const [inputValue, setInputValue] = useState("");
  const socket = useRef(null);
  const lastSeekTime = useRef(0);
  const lastEmitTime = useRef(0);
  const isLocalChange = useRef(false);
  const syncInterval = useRef(null);
  const processingRemoteEvent = useRef(false);

  // Constants
  const SEEK_THRESHOLD = 3;
  const SYNC_INTERVAL = 2000;
  const SYNC_THRESHOLD = 2;
  const DEBOUNCE_TIME = 50; // Debounce time for play/pause events

  useEffect(() => {
    socket.current = io("http://localhost:8080");
    socket.current.emit("joinRoom", roomId);

    socket.current.on("videoEvent", handleVideoEvent);
    socket.current.on("requestSync", handleSyncRequest);

    return () => {
      if (syncInterval.current) {
        clearInterval(syncInterval.current);
      }
      socket.current.disconnect();
    };
  }, [roomId]);

  const handleSyncRequest = useCallback(
    ({ senderId }) => {
      if (!playerRef.current) return;

      const currentTime = playerRef.current.getCurrentTime();
      const isPlaying =
        playerRef.current.getPlayerState() === window.YT.PlayerState.PLAYING;

      socket.current.emit("syncResponse", {
        senderId,
        currentTime,
        isPlaying,
        videoId,
        roomId,
      });
    },
    [roomId, videoId]
  );

  const handleVideoEvent = useCallback(
    ({ type, time, videoId: newVideoId, isSync }) => {
      if (!playerRef.current || isLocalChange.current) return;

      processingRemoteEvent.current = true;
      const player = playerRef.current;

      try {
        switch (type) {
          case "play":
            const currentState = player.getPlayerState();
            if (currentState !== window.YT.PlayerState.PLAYING) {
              const timeDiff = Math.abs(player.getCurrentTime() - time);
              if (timeDiff > SYNC_THRESHOLD) {
                player.seekTo(time, true);
              }
              player.playVideo();
            }
            break;
          case "pause":
            if (player.getPlayerState() === window.YT.PlayerState.PLAYING) {
              player.pauseVideo();
            }
            break;
          case "seek":
            const seekDiff = Math.abs(player.getCurrentTime() - time);
            if (seekDiff > SEEK_THRESHOLD) {
              player.seekTo(time, true);
            }
            break;
          case "loadVideo":
            if (newVideoId !== videoId) {
              setVideoId(newVideoId);
            }
            break;
        }
      } finally {
        // Reset the processing flag after a short delay
        setTimeout(() => {
          processingRemoteEvent.current = false;
        }, DEBOUNCE_TIME);
      }
    },
    [videoId]
  );

  const startPeriodicSync = useCallback(() => {
    if (syncInterval.current) {
      clearInterval(syncInterval.current);
    }

    syncInterval.current = setInterval(() => {
      if (
        !playerRef.current ||
        playerRef.current.getPlayerState() !== window.YT.PlayerState.PLAYING
      )
        return;

      socket.current.emit("videoEvent", {
        type: "sync",
        time: playerRef.current.getCurrentTime(),
        roomId,
        videoId,
        isSync: true,
      });
    }, SYNC_INTERVAL);
  }, [roomId, videoId]);

  useEffect(() => {
    if (!window.YT) {
      const scriptTag = document.createElement("script");
      scriptTag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag);
      window.onYouTubeIframeAPIReady = createPlayer;
    } else {
      createPlayer();
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      if (syncInterval.current) {
        clearInterval(syncInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    if (playerRef.current && playerRef.current.loadVideoById) {
      playerRef.current.loadVideoById(videoId);
    }
  }, [videoId]);

  const createPlayer = () => {
    playerRef.current = new window.YT.Player("youtube-player", {
      height: "390",
      width: "640",
      videoId,
      playerVars: {
        enablejsapi: 1,
        origin: window.location.origin,
        playsinline: 1,
      },
      events: {
        onReady: () => {
          console.log("Player is ready");
          socket.current.emit("requestSync", { roomId });
        },
        onStateChange: handlePlayerStateChange,
      },
    });
  };

  const handlePlayerStateChange = (event) => {
    if (!playerRef.current || processingRemoteEvent.current) return;

    const player = playerRef.current;
    const currentTime = player.getCurrentTime();

    // Don't emit if we're still in debounce period
    if (Date.now() - lastEmitTime.current < DEBOUNCE_TIME) return;

    isLocalChange.current = true;

    try {
      switch (event.data) {
        case window.YT.PlayerState.PLAYING:
          emitVideoEvent("play", currentTime);
          startPeriodicSync();
          break;
        case window.YT.PlayerState.PAUSED:
          emitVideoEvent("pause", currentTime);
          if (syncInterval.current) {
            clearInterval(syncInterval.current);
          }
          break;
        case window.YT.PlayerState.BUFFERING:
          const timeDiff = Math.abs(currentTime - lastSeekTime.current);
          if (timeDiff > SEEK_THRESHOLD) {
            emitVideoEvent("seek", currentTime);
            lastSeekTime.current = currentTime;
          }
          break;
      }
    } finally {
      // Reset the local change flag after debounce period
      setTimeout(() => {
        isLocalChange.current = false;
      }, DEBOUNCE_TIME);
    }
  };

  const emitVideoEvent = (type, time) => {
    if (!playerRef.current) return;

    socket.current.emit("videoEvent", {
      type,
      time,
      roomId,
      videoId,
    });

    lastEmitTime.current = Date.now();
  };

  const handleLoadVideo = () => {
    if (!inputValue) return;
    setVideoId(inputValue);
    socket.current.emit("videoEvent", {
      type: "loadVideo",
      videoId: inputValue,
      roomId,
    });
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <div id="youtube-player"></div>
        <div className="flex gap-2 justify-center items-center  ">
          <input
            type="text"
            className="px-3 py-2  h-10 border rounded text-white"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter YouTube video ID"
          />
          {/* <button
            className="shadow-[0_0_0_3px_#000000_inset] px-6 py-2 bg-transparent border border-black dark:border-white dark:text-white text-black rounded-lg font-bold "
            onClick={handleLoadVideo}
          >
            Load Video
          </button> */}
          <button
            onClick={handleLoadVideo}
            className="m-6 relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            Load Video
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default YouTubePlayer;
