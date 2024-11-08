import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    Box,
    Text,
    Textarea
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import TimePicker from './TimePicker';
import { timeToSeconds } from '../utils/timeToSeconds';
import { Subtitle } from './SubTitleBox';

interface Props {
    isOpen: boolean;
    onClickClose: () => void;
    subtitle: SubTitleToEdit | null;
    saveSubtitle: (subtitle: Subtitle, index: number, operation: string) => void;
}

export interface SubTitleToEdit {
    start: string;
    end: string;
    duration: string;
    text: string;
    index: number;
    subtitlesList: any;
}

export interface ValidateTime {
    previousEndTime: string | undefined;
    nextStartTime: string | undefined;
}

const ModalEditSubtitle = ({ isOpen, onClickClose, subtitle, saveSubtitle }: Props) => {

    const [validateTimeObject, setValidateTimeObject] = useState<ValidateTime>({
        previousEndTime: undefined,
        nextStartTime: undefined
    });
    const [subtitleToUpdate, setSubtitleToUpdate] = useState<SubTitleToEdit | null>(subtitle);
    const [subTitleError, setSubTitleError] = useState<Record<string, boolean>>({
        start: false,
        end: false,
        text: false
    });

    useEffect(() => {
        if(subtitle) {
            setValidateTimeObject({
                previousEndTime: subtitle.index > 0 ? subtitle.subtitlesList[subtitle.index - 1]?.end : undefined,
                nextStartTime: subtitle.index + 1 < subtitle.subtitlesList.length ? subtitle.subtitlesList[subtitle.index + 1]?.start : undefined
            });
        }
    }, [subtitle]);

    useEffect(() => {
        if(subtitle) {
            setSubtitleToUpdate(subtitle);
        }
    }, [subtitle]);

    const validateTimeInput = (inputTime: {
        hours: number;
        minutes: number;
        seconds: number;
        type: string;
    }) => {
        if(subtitleToUpdate) {

            const timeInSeconds = inputTime.hours * 3600 + inputTime.minutes * 60 + inputTime.seconds;
            const previousEndTimeInSeconds = validateTimeObject.previousEndTime
                ? timeToSeconds(validateTimeObject.previousEndTime)
                : 0;
            const nextStartTimeInSeconds = validateTimeObject.nextStartTime
                ? timeToSeconds(validateTimeObject.nextStartTime)
                : Infinity;
    
            const durationInSeconds = JSON.parse(localStorage.getItem('videoDuration') as string);
    
            let newSubtitleTime = { ...subtitleToUpdate };
            let isValid = false;
    
            if (inputTime.type === 'start') {
    
                isValid = timeInSeconds >= 0 &&
                    timeInSeconds >= previousEndTimeInSeconds &&
                    timeInSeconds < timeToSeconds(subtitleToUpdate.end) && timeInSeconds < nextStartTimeInSeconds;
    
                setSubTitleError((prevErrors) => ({
                    ...prevErrors,
                    start: !isValid,
                }));
    
                newSubtitleTime.start = `${String(inputTime.hours).padStart(2, '0')}:${String(inputTime.minutes).padStart(2, '0')}:${String(inputTime.seconds).padStart(2, '0')}`;
    
            } else if (inputTime.type === 'end') {
    
                isValid = timeInSeconds > timeToSeconds(subtitleToUpdate.start) &&
                    timeInSeconds <= durationInSeconds &&
                    timeInSeconds <= nextStartTimeInSeconds;
    
                setSubTitleError((prevErrors) => ({
                    ...prevErrors,
                    end: !isValid,
                }));
    
                newSubtitleTime.end = `${String(inputTime.hours).padStart(2, '0')}:${String(inputTime.minutes).padStart(2, '0')}:${String(inputTime.seconds).padStart(2, '0')}`;
            }
    
            if (isValid) setSubtitleToUpdate(newSubtitleTime)
            // console.log("Validation Result:", isValid);
        }
    };

    const updateText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target?.value;
        if(subtitleToUpdate) {
            if (subtitleToUpdate.text.trim().length < 3) setSubTitleError((prevErrors) => ({
                ...prevErrors,
                text: true,
            }));
            setSubtitleToUpdate((prevSub: any) => ({
                ...prevSub,
                text: text
            }));
        }
    }

    if (!subtitle) {
        return null;
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClickClose}
            isCentered
        >
            <Box color={'#E0E0E0'} >

                <ModalOverlay />
                <ModalContent bg={"#333333"}>
                    <ModalHeader color={'#3A6EA5'}>Edit Subtitle #{subtitle.index + 1}</ModalHeader>

                    <ModalBody
                        display='flex'
                        flexDirection='column'
                    >
                        <Box
                            marginBottom='10px'
                        >
                            <Text
                                fontWeight={600}
                                fontSize={'lg'}
                                className='muted-blue-text'
                                mb={2}
                            >
                                Start time:
                            </Text>
                            <TimePicker
                                isError={subTitleError.start}
                                onTimeChange={(inputTime) => validateTimeInput(inputTime)}
                                time={{
                                    type: 'start',
                                    hours: Number(subtitle.start.split(':')[0]),
                                    minutes: Number(subtitle.start.split(':')[1]),
                                    seconds: Number(subtitle.start.split(':')[2]),
                                }}
                            />
                        </Box>

                        <Box
                            marginBottom='10px'
                        >
                            <Text
                                fontWeight={600}
                                fontSize={'lg'}
                                className='muted-blue-text'
                                mb={2}
                            >
                                End time:
                            </Text>
                            <TimePicker
                                isError={subTitleError.end}
                                onTimeChange={(inputTime) => validateTimeInput(inputTime)}
                                time={{
                                    type: 'end',
                                    hours: Number(subtitle.end.split(':')[0]),
                                    minutes: Number(subtitle.end.split(':')[1]),
                                    seconds: Number(subtitle.end.split(':')[2]),
                                }}
                            />
                        </Box>

                        <Box
                            marginBottom='10px'
                        >
                            <Text
                                fontWeight={600}
                                fontSize={'lg'}
                                className='muted-blue-text'
                                mb={2}
                            >
                                Text:
                            </Text>
                            <Textarea
                                value={subtitleToUpdate?.text}
                                onChange={updateText}
                                isInvalid={!!(subtitleToUpdate && subtitleToUpdate.text.trim().length < 3)}
                                maxH={'300px'}
                                focusBorderColor='#666666'
                                borderColor={'#666666'}
                                sx={{
                                    _hover: {
                                        borderColor: '#666666',
                                    }
                                }}
                            />
                        </Box>

                    </ModalBody>

                    <ModalFooter>
                        <Button
                            mr={3}
                            onClick={() => {
                                setSubTitleError({
                                    start: false,
                                    end: false,
                                    text: false
                                })
                                onClickClose()
                            }}
                            variant={'outline'}
                            sx={{
                                color: '#E0E0E0',
                                borderColor: '#666666',
                                '&:hover': {
                                    bg: '#333333',
                                    color: '#E0E0E0',
                                },
                            }}
                        >
                            Close
                        </Button>

                        <Button
                            onClick={() => {
                                if(subtitleToUpdate) {
                                    saveSubtitle({
                                        start: subtitleToUpdate.start,
                                        end: subtitleToUpdate.end,
                                        text: subtitleToUpdate.text,
                                        duration: subtitleToUpdate.duration,
                                    }, subtitleToUpdate.index, 'edit')
                                }
                            }}
                            disabled={subTitleError.start || subTitleError.end || subTitleError.text}
                            className='my-btn'
                        >
                            Save
                        </Button>
                    </ModalFooter>
                </ModalContent>

            </Box>
        </Modal>
    )
}

export default ModalEditSubtitle;