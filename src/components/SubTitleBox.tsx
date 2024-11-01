import { Box, Tooltip } from "@chakra-ui/react";
import { useEffect, useState } from "react";
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

interface Props {
    start: string;
    end: string;
    duration: string;
    text: string;
}

interface ModalContent extends Props {
    index: number;
    subtitlesList: Props[]
}

const SubTitleBox = () => {

    const [subTitles, setSubTitles] = useState<Props[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<ModalContent | null>(null);

    useEffect(() => {
        setSubTitles(JSON.parse(localStorage.getItem('subtitles') as string));
    }, []);

    const editSubtitle = (subtitle: Props, index: number) => {

        setIsEditing(true);
        const editingSub = {
            ...subtitle,
            index: index,
            subtitlesList: subTitles
        }
        setModalContent(editingSub);
    }

    const saveSubtitle = (subtitle: Props, index: number) => {

        const subToSave = {
            ...subtitle,
            duration: calculateDuration(subtitle.start, subtitle.end)
        }
        const updateSubs  = [...subTitles];
        updateSubs[index] = subToSave;
        localStorage.setItem('subtitles', JSON.stringify(updateSubs));
        setSubTitles(updateSubs);
        setIsEditing(false);
    }

    return (
        <Box
            className='project-box'
            style={{ padding: 0 }}
        >
            <TableContainer
                overflow={'hidden'}
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
                            subTitles.map((subTitle: Props, index: number) => {

                                const truncatedText = subTitle.text.length > 30 ?
                                    `${subTitle.text.substring(0, 30)}...` :
                                    null;

                                return (
                                    <Tr key={index} onClick={() => console.log('clicked')}>
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
                                                
                                                <Tooltip label='merge consecutive lines'>
                                                    <img
                                                        style={{ marginLeft: '20px' }}
                                                        src={MergeIcon}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            console.log('merging...')
                                                        }}
                                                    />
                                                </Tooltip>
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
                onClickClose={() => setIsEditing(false)}
                saveSubtitle={saveSubtitle}
            />
        </Box>
    )
}

export default SubTitleBox;