import {
    Box,
    Button,
    SimpleGrid
} from "@chakra-ui/react";
import SubTitleBox from "./SubTitleBox";
import VideoPlayer from "./VideoPlayer";
import Waveform from "./Waveform";
import { useSubtitles } from "../context/SubtitleContext";
import { useEffect } from "react";
import { clearAllData } from "../utils/DBops";

interface Props {
    clearProject: () => void;
}

const Project = ({ clearProject }: Props) => {

    const { setSubTitles } = useSubtitles();

    useEffect(() => {
        setSubTitles(JSON.parse(localStorage.getItem('subtitles') as string));
    }, []);

    const discardProject = async () => {
        await clearAllData();
        clearProject();
    }

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
            <Button
                variant={'outline'}
                size={'xs'}
                width={'150px'}
                sx={{
                    color: '#E0E0E0',
                    borderColor: '#666666',
                    '&:hover': {
                        bg: '#333333',
                        color: '#E0E0E0',
                    },
                    position: 'absolute',
                    top: '10px',
                    left: '50px'
                }}
                onClick={discardProject}
            >
                Discard project
            </Button>
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