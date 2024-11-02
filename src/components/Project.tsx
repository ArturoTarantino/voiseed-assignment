import {
    Box,
    SimpleGrid
} from "@chakra-ui/react";
import SubTitleBox from "./SubTitleBox";
import VideoPlayer from "./VideoPlayer";
import Waveform from "./Waveform";
import { SubtitleProvider } from "../context/SubtitleContext";

const Project = () => {

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
                spacing={10}
                height={'70%'}
                width={'100%'}
            >
                <SubtitleProvider>
                    <Box gridColumn='span 6' height='100%'>
                        <SubTitleBox />
                    </Box>

                    <Box gridColumn='span 4' height='100%'>
                        <VideoPlayer />
                    </Box>
                </SubtitleProvider>

            </SimpleGrid>

            <SimpleGrid
                column={1}
                height={'20%'}
            >

                <Waveform />

            </SimpleGrid>
        </Box>
    )
}

export default Project;