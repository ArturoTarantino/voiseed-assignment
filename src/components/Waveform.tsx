import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js'
import { useSubtitles } from "../context/SubtitleContext";

interface Props {
    onReady?: (waveSurfer: WaveSurfer) => void;
}

const Waveform = ({ onReady }: Props) => {

    const waveSurferRef = useRef<WaveSurfer | null>(null);
    const waveformContainerRef = useRef<HTMLDivElement | null>(null);
    const timeLineContainerRef = useRef<HTMLDivElement | null>(null);

    const { currentTime, isVideoPlaying, setCurrentTime, setStartTime } = useSubtitles();

    useEffect(() => {

        const videoFileUrl = JSON.parse(localStorage.getItem('video') as string);

        if (waveformContainerRef.current && timeLineContainerRef.current) {

            const bottomTimeline = TimelinePlugin.create({
                container: timeLineContainerRef.current,
                height: 50,
                timeInterval: 0.1,
                primaryLabelInterval: 1,
                style: {
                    fontSize: '15px',
                    color: '#6A3274',
                },
            })
            waveSurferRef.current = WaveSurfer.create({
                container: waveformContainerRef.current,
                waveColor: '#007bff',
                progressColor: '#ff4d4f',
                cursorColor: '#000000',
                height: 150,
                barWidth: 0,
                hideScrollbar: true,
                normalize: true,
                plugins: [bottomTimeline]
            });

            waveSurferRef.current.load(videoFileUrl);
            waveSurferRef.current.setMuted(true);

            waveSurferRef.current.on('ready', () => {
                if (onReady && waveSurferRef.current) onReady(waveSurferRef.current);
            });

            waveSurferRef.current.on('click', (progress) => {
                if (waveSurferRef.current) {
                    setCurrentTime(progress * waveSurferRef.current.getDuration());
                    setStartTime(progress * waveSurferRef.current.getDuration());
                }
            });
        }

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
        <div>
            <div ref={waveformContainerRef} style={{ width: '100%', backgroundColor: 'white', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }} />
            <div ref={timeLineContainerRef} style={{ width: '100%', backgroundColor: 'white'}} />
        </div>
    )
}

export default Waveform;