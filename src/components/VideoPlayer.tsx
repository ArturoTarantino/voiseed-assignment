import { Box } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { convertParsedSRTToVTT } from "../utils/parseSRT";
import { useSubtitles } from "../context/SubtitleContext";

const VideoPlayer = () => {

    const [videoSource, setVideoSource] = useState<string | null>(null);
    const [subVTTURL, setSubVTTURL] = useState<string | null>(null);
    const playerRef = useRef<ReactPlayer | null>(null);

    const { startTime } = useSubtitles();

    useEffect(() => {

        const subsVTT = convertParsedSRTToVTT(JSON.parse(localStorage.getItem('subtitles') as string));
        console.log(subsVTT);
        const blob = new Blob([subsVTT], { type: 'text/vtt' });
        const vttUrl = URL.createObjectURL(blob);
        setSubVTTURL(vttUrl);

        const videoFile = JSON.parse(localStorage.getItem('video') as string);
        if (!!videoFile) {
            setVideoSource(videoFile)
        }

        return () => URL.revokeObjectURL(vttUrl);
    }, []);

    useEffect(() => {
        if (startTime !== null && playerRef.current) {
            playerRef.current.seekTo(startTime);
        }
    }, [startTime]); 

    return (
        <Box
            className='project-box'
            style={{
                display: 'flex',
                alignItems: 'center'
            }}
        >
            {
                videoSource && subVTTURL ?
                <div style={{ position: 'relative', width: '100%' }} onClick={() => console.log('hello')}>
                    <ReactPlayer
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
                    />
                </div>
                    // <video style={{ flexGrow: 1 }} src={videoSource} controls width={'100%'}/>
                    : <p>Caricamento video ...</p>
            }
        </Box>
    )
}

export default VideoPlayer;