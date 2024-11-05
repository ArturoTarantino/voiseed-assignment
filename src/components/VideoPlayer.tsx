import { Box } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { convertParsedSRTToVTT } from "../utils/parseSRT";
import { useSubtitles } from "../context/SubtitleContext";
import { getVideoFromIndexedDB } from "../utils/DBops";

const VideoPlayer = () => {

    const [videoSource, setVideoSource] = useState<string | null>(null);
    const [subVTTURL, setSubVTTURL] = useState<string | null>(null);
    const playerRef = useRef<ReactPlayer | null>(null);

    const { 
        startTime, 
        setCurrentTime, 
        setIsVideoPlaying, 
        isUserEditing,
        subTitles
    } = useSubtitles();

    useEffect(() => {
        if(subTitles) {

            getVideoFromIndexedDB().then(videoBlob => {
                if (videoBlob) {
                    const videoUrl = URL.createObjectURL(videoBlob);
                    setVideoSource(videoUrl);

                    const subsVTT = convertParsedSRTToVTT(subTitles);
                    const blob = new Blob([subsVTT], { type: 'text/vtt' });
                    const vttUrl = URL.createObjectURL(blob);
                    setSubVTTURL(vttUrl);

                }
            }).catch(error => {
                console.error("video not found", error);
            });

            return () => {
                if(subVTTURL) URL.revokeObjectURL(subVTTURL);
                if (videoSource) URL.revokeObjectURL(videoSource);
            }
        }
    }, [subTitles]);

    useEffect(() => {
        if (startTime !== null && playerRef.current) {
            playerRef.current.seekTo(startTime);
        }
    }, [startTime]);

    const handleProgress = (progress: { playedSeconds: number }) => {
        setCurrentTime(progress.playedSeconds)
    }

    useEffect(() => {
        if(isUserEditing && playerRef.current) {
            playerRef.current.getInternalPlayer().pause();
        }
    }, [isUserEditing]);

    return (
        <Box
            className='project-box'
            style={{
                display: 'flex',
                alignItems: 'center',
                height: '100%'
            }}
        >
            {
                videoSource && subVTTURL ?
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <ReactPlayer
                        key={subVTTURL}
                        className='react-player'
                        url={videoSource}
                        controls={true}
                        width={'100%'}
                        height={'100%'}
                        config={{
                            file: {
                                tracks: [
                                    {
                                        kind: 'subtitles',
                                        src: subVTTURL,
                                        srcLang: 'en',
                                        default: true,
                                        label: 'English'
                                    }
                                ]
                            }
                        }}
                        ref={playerRef}
                        onProgress={handleProgress}
                        onPlay={() => setIsVideoPlaying(true)}
                        onPause={() => setIsVideoPlaying(false)}
                    />
                </div>
                    : <p>Caricamento video ...</p>
            }
        </Box>
    )
}

export default VideoPlayer;