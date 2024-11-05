import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    Box
} from '@chakra-ui/react';
import FileUpload from './FileUpload';
import { useEffect, useState } from 'react';
import { timeToSeconds } from '../utils/timeToSeconds';
import { getVideoFromIndexedDB } from '../utils/DBops';

interface Props {
    isOpen: boolean;
    onClickClose: () => void;
    startProject: () => void;
}

export interface ErrorObject {
    sub: UploadError;
    video: UploadError;
}

export interface UploadError {
    value: boolean;
    text: string | null;
}

const ModalUpload = ({ isOpen, onClickClose, startProject }: Props) => {

    const intitalError: ErrorObject = {
        sub: {
            value: false,
            text: null
        },
        video: {
            value: false,
            text: null
        }
    }
    const [errorObject, setErrorObject] = useState<ErrorObject>(intitalError);

    useEffect(() => {
        setErrorObject(intitalError);
    }, [isOpen]);

    const validateUpload = async () => {

        const isSubUploaded = !!localStorage.getItem('subtitles');
        const isVideoUploaded = !!await getVideoFromIndexedDB();

        const canStartProject = isSubUploaded && isVideoUploaded;

        if (!canStartProject) {
            
            const cantStartError: ErrorObject = {
                sub: {
                    value: !isSubUploaded,
                    text: "Need to upload file!"
                },
                video: {
                    value: !isVideoUploaded,
                    text: "Need to upload file!"
                }
            }
            setErrorObject(cantStartError);
        } else {

            const subtitles = JSON.parse(localStorage.getItem('subtitles') as string);
            const endTimeLastSub = timeToSeconds(subtitles[subtitles.length - 1].end);
            const videoDuration = JSON.parse(localStorage.getItem('videoDuration') as string);

            const isDurationSubValid = endTimeLastSub <= videoDuration;
            if (isDurationSubValid) {
                setErrorObject(intitalError);
                onClickClose();
                startProject();
            } else {

                setErrorObject((prev) => {
                    return {
                        ...prev,
                        sub: {
                            value: true,
                            text: "Your subtitle file duration is longer than video duration!"
                        }
                    }
                });
            }
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClickClose}
            isCentered
        >
            <Box color={'#E0E0E0'}>

                <ModalOverlay />
                <ModalContent
                    bg={"#333333"}
                >
                    <ModalHeader color={'#3A6EA5'} >New Project</ModalHeader>
                    <ModalBody
                        display='flex'
                        flexDirection='column'
                    >
                        <FileUpload
                            labelText='Upload your subtitle file in .srt format'
                            inputType='file'
                            acceptedFile='.srt'
                            errorMessage={errorObject.sub}
                            setError={setErrorObject}
                        />
                        <FileUpload
                            labelText='Upload your video file'
                            inputType='file'
                            acceptedFile='video/*'
                            errorMessage={errorObject.video}
                            setError={setErrorObject}
                        />

                    </ModalBody>

                    <ModalFooter>

                        <Button
                            mr={3}
                            onClick={onClickClose}
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
                            className='my-btn'
                            onClick={validateUpload}
                        >
                            Start
                        </Button>
                    </ModalFooter>
                </ModalContent>

            </Box>
        </Modal>
    )
}

export default ModalUpload;