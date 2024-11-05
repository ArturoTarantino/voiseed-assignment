import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'; 
import { useSubtitles } from "../context/SubtitleContext";
import { getVideoFromIndexedDB } from "../utils/DBops";
import { Subtitle } from "./SubTitleBox";
import { timeToSeconds } from "../utils/timeToSeconds";

interface Props {
    onReady?: (waveSurfer: WaveSurfer) => void;
}

const Waveform = ({ onReady }: Props) => {
    const waveSurferRef = useRef<WaveSurfer | null>(null);
    const waveformContainerRef = useRef<HTMLDivElement | null>(null);

    const { currentTime, isVideoPlaying, setCurrentTime, setStartTime } = useSubtitles();

    useEffect(() => {
        getVideoFromIndexedDB().then(videoBlob => {
            if (videoBlob && waveformContainerRef.current) {
                const url = URL.createObjectURL(videoBlob);
                
                const videoDuration = JSON.parse(localStorage.getItem('videoDuration') as string);

                let timeInterval;
                let primaryLabelInterval;
                let fontsize = '18px';
                
                if (videoDuration <= 30) {
                    timeInterval = 0.1;
                    primaryLabelInterval = 1;
                } else if(videoDuration > 30 && videoDuration <= 60) {
                    timeInterval = 1;
                    primaryLabelInterval =  5;
                } else if (videoDuration >= 60 && videoDuration <= 120) {
                    timeInterval = 5;
                    primaryLabelInterval =  20;
                    fontsize = '10px';
                } else if (videoDuration > 120) {
                    timeInterval = 10;
                    primaryLabelInterval = 30;
                    fontsize = '10px';
                }

                const bottomTimeline = TimelinePlugin.create({
                    height: 30,
                    timeInterval: timeInterval,
                    primaryLabelInterval: primaryLabelInterval,
                    style: {
                        fontSize: fontsize,
                        color: 'white',
                    },
                });

                const regions = RegionsPlugin.create();

                waveSurferRef.current = WaveSurfer.create({
                    container: waveformContainerRef.current,
                    waveColor: '#3a6ea5',
                    progressColor: '#004e98',
                    cursorColor: '#C2B280',
                    height: 180,
                    barWidth: 0,
                    hideScrollbar: true,
                    normalize: true,
                    plugins: [bottomTimeline, regions]
                });

                waveSurferRef.current.load(url);
                waveSurferRef.current.setMuted(true);

                waveSurferRef.current.on('ready', () => {
                    if (onReady && waveSurferRef.current) onReady(waveSurferRef.current);
                });

                waveSurferRef.current.on('click', (progress) => {
                    if (waveSurferRef.current) {
                        const newTime = progress * waveSurferRef.current.getDuration();
                        setCurrentTime(newTime);
                        setStartTime(newTime);
                    }
                });

                waveSurferRef.current.on('decode', () => {
                    const subtitles = JSON.parse(localStorage.getItem('subtitles') as string);
                    subtitles.forEach((subtitle: Subtitle, index: number) => {
                        regions.addRegion({
                            start: timeToSeconds(subtitle.start),
                            end: timeToSeconds(subtitle.end),
                            content: `sub #${index + 1}`,
                            color: 'rgba(200, 200, 200, 0.2)',
                            drag: false,
                            resize: false
                        });
                        regions.addRegion({
                            start: timeToSeconds(subtitle.end),
                            content: ``,
                            color: 'rgba(200, 200, 200, 0.2)',
                            drag: false,
                            resize: false
                        });
                    });
                });

                return () => {
                    waveSurferRef.current?.destroy();
                    URL.revokeObjectURL(url);
                };
            }
        }).catch(error => {
            console.error("error loading file", error);
        });

        return () => {
            waveSurferRef.current?.destroy();
        };
    }, [onReady, setCurrentTime]);

    useEffect(() => {
        if (waveSurferRef.current) {
            if (isVideoPlaying) {
                waveSurferRef.current.play();
            } else {
                waveSurferRef.current.pause();
            }
        }
    }, [isVideoPlaying]);

    useEffect(() => {
        if (waveSurferRef.current) {
            const waveCurrentTime = waveSurferRef.current.getCurrentTime();
            const threshold = 0.5;

            if (Math.abs(currentTime - waveCurrentTime) > threshold) {
                waveSurferRef.current.seekTo(currentTime / waveSurferRef.current.getDuration());
            }
        }
    }, [currentTime]);

    return (
        <div
            ref={waveformContainerRef}
            style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#2B2B2B'
            }}
        />
    );
};

export default Waveform;