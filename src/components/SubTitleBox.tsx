import { Box, Tooltip } from "@chakra-ui/react";
import { memo, useEffect, useState } from "react";
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
} from '@chakra-ui/react'
import ModalEditSubtitle from "./ModalEditSubtitle";
import PencilIcon from '../assets/edit.svg';
import MergeIcon from '../assets/merge.svg';
import { calculateDuration } from "../utils/parseSRT";
import ModalMergeSubtitle from "./ModalMergeSubtitle";
import { timeToSeconds } from "../utils/timeToSeconds";
import { useSubtitles } from "../context/SubtitleContext";

export interface Subtitle {
    start: string;
    end: string;
    duration: string;
    text: string;
}

interface ModalContent extends Subtitle {
    index: number;
    subtitlesList: Subtitle[]
}

const SubTitleBox = memo(() => {

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isMerging, setIsMerging] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<ModalContent | null>(null);

    const { 
        setStartTime, 
        currentTime, 
        setIsUserEditing, 
        isVideoPlaying, 
        subTitles, 
        setSubTitles
    } = useSubtitles();

    const editSubtitle = (subtitle: Subtitle, index: number) => {

        const editingSub = {
            ...subtitle,
            index: index,
            subtitlesList: subTitles
        }
        setIsEditing(true);
        setModalContent(editingSub);
    }

    const mergeSubTitles = (subtitle: Subtitle, index: number) => {
        setModalContent({
            ...subtitle,
            index: index,
            subtitlesList: subTitles
        })
        setIsMerging(true);
    }

    const saveSubtitle = (subtitle: Subtitle, index: number, operation: string) => {

        if (operation === 'edit') {

            const subToSave = {
                ...subtitle,
                duration: calculateDuration(subtitle.start, subtitle.end)
            }
            const updateSubs = [...subTitles];
            updateSubs[index] = subToSave;
            localStorage.setItem('subtitles', JSON.stringify(updateSubs));
            setSubTitles(updateSubs);
            setIsEditing(false);
        } else if (operation === 'merge') {

            const updateSubs = [...subTitles]
                .map((sub: Subtitle, i) => {
                    if (i === index) sub = subtitle;
                    return sub;
                }).filter((_, i) => i !== index + 1);
            localStorage.setItem('subtitles', JSON.stringify(updateSubs));
            setSubTitles(updateSubs);
            setIsMerging(false);
        }

    }

    const handleSubtitleClick = (start: string) => {
        const startInSeconds = timeToSeconds(start);
        setStartTime(startInSeconds);
    }

    useEffect(() => {
        if((isEditing || isMerging) && isVideoPlaying) {
            setIsUserEditing(true);
        }
    }, [isEditing, isMerging]);

    return (
        <Box
            className='project-box'
            style={{ padding: 0, height: '100%' }}
        >
            <TableContainer
                height={'100%'}
                maxH={'600px'}
                overflowY="auto"
                overflowX="auto"
                padding={'20px 0'}
            >
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>#</Th>
                            <Th>Start</Th>
                            <Th>End</Th>
                            <Th>Duration</Th>
                            <Th>Text</Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            subTitles.map((subTitle: Subtitle, index: number) => {

                                const truncatedText = subTitle.text.length > 30 ?
                                    `${subTitle.text.substring(0, 30)}...` :
                                    null;

                                const isActive = currentTime >= timeToSeconds(subTitle.start) && currentTime < timeToSeconds(subTitle.end);

                                return (
                                    <Tr key={index} onClick={() => handleSubtitleClick(subTitle.start)} style={
                                        isActive ? {
                                            backgroundColor: '#3A6EA5'
                                        } : {}
                                    }>
                                        <Td>{index + 1}</Td>
                                        <Td>{subTitle.start}</Td>
                                        <Td>{subTitle.end}</Td>
                                        <Td>{subTitle.duration}</Td>
                                        <Td>
                                            {
                                                truncatedText ?
                                                    <Tooltip label={subTitle.text}>
                                                        <span>{truncatedText}</span>
                                                    </Tooltip>
                                                    :
                                                    subTitle.text
                                            }

                                        </Td>
                                        <Td>
                                            <Box
                                                display='flex'
                                                justifyContent='center'
                                                alignItems='center'
                                            >
                                                <Tooltip label='edit subtitle'>
                                                    <img
                                                        src={PencilIcon}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            editSubtitle(subTitle, index);
                                                        }}
                                                    />
                                                </Tooltip>

                                                {
                                                    index < subTitles.length - 1 &&
                                                    <Tooltip label='merge consecutive lines'>
                                                        <img
                                                            style={{ marginLeft: '20px' }}
                                                            src={MergeIcon}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                mergeSubTitles(subTitle, index)
                                                            }}
                                                        />
                                                    </Tooltip>
                                                }
                                            </Box>
                                        </Td>
                                    </Tr>
                                )
                            })
                        }
                    </Tbody>
                </Table>
            </TableContainer>

            <ModalEditSubtitle
                subtitle={modalContent}
                isOpen={isEditing}
                onClickClose={() => {
                    setIsEditing(false);
                    setIsUserEditing(false);
                    setModalContent(null);
                }}
                saveSubtitle={saveSubtitle}
            />

            <ModalMergeSubtitle
                subtitle={modalContent}
                isOpen={isMerging}
                onClickClose={() => {
                    setIsMerging(false);
                    setIsUserEditing(false);
                    setModalContent(null);
                }}
                saveSubtitle={saveSubtitle}
            />
        </Box>
    )
});

export default SubTitleBox;