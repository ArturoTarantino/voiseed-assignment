import {
    Box,
    SimpleGrid
} from "@chakra-ui/react";
import SubTitleBox from "./SubTitleBox";
import VideoPlayer from "./VideoPlayer";
import Waveform from "./Waveform";
import { useSubtitles } from "../context/SubtitleContext";
import { useEffect } from "react";

const Project = () => {

    const { setSubTitles } = useSubtitles();

    useEffect(() => {
        setSubTitles(JSON.parse(localStorage.getItem('subtitles') as string));
    }, []);

    return (
        <Box
            width='100%'
            height='100%'
            margin='auto'
            padding='50px'
            display='flex'
            flexDirection='column'
            justifyContent='space-between'
        >
                <SimpleGrid
                    columns={10}
                    spacing={5}
                    height={'70%'}
                    width={'100%'}
                >

                    <Box gridColumn='span 6' height='100%'>
                        <SubTitleBox />
                    </Box>

                    <Box gridColumn='span 4' height='100%'>
                        <VideoPlayer />
                    </Box>

                </SimpleGrid>

                <SimpleGrid
                    columns={1}
                    height={'25%'}
                >
                    <Waveform />

                </SimpleGrid>
        </Box>
    )
}

export default Project;