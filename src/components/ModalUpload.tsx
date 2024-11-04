import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Box
} from '@chakra-ui/react';
import FileUpload from './FileUpload';
import { useEffect, useState } from 'react';
import { timeToSeconds } from '../utils/timeToSeconds';

interface Props {
    isOpen: boolean;
    onClickClose: () => void;
    startProject: () => void;
}

interface ErrorObject {
    sub: boolean;
    video: boolean;
}

const ModalUpload = ({ isOpen, onClickClose, startProject }: Props) => {
    
    const [errorObject, setErrorObject] = useState<ErrorObject>({ sub: false, video: false });

    useEffect(() => {
        setErrorObject({ sub: false, video: false });
    }, [isOpen]);
    
    const validateUpload = () => {
        
        const isSubUploaded = !!localStorage.getItem('subtitles');
        const isVideoUploaded = !!localStorage.getItem('video');

        const canStartProject = isSubUploaded && isVideoUploaded;
        console.log(canStartProject);
        if(!canStartProject) {
            setErrorObject({ sub: !isSubUploaded, video: !isVideoUploaded });
        } else {

            const subtitles = JSON.parse(localStorage.getItem('subtitles') as string);
            const endTimeLastSub = timeToSeconds(subtitles[subtitles.length - 1].end);
            const videoDuration = JSON.parse(localStorage.getItem('videoDuration') as string);

            const isDurationSubValid = endTimeLastSub <= videoDuration;
            if(isDurationSubValid) {
                setErrorObject({ sub: false, video: false });
                onClickClose();
                startProject();
            } else {

                setErrorObject({ sub: true, video: false });
            }
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClickClose}
            isCentered
        >
            <Box style={{ color: 'black' }} >

                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>New Project</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display='flex'
                        flexDirection='column'
                    >
                        <FileUpload
                            labelText='Upload your subtitle file in .srt format'
                            inputType='file'
                            acceptedFile='.srt'
                            errorMessage={errorObject.sub}
                        />
                        <FileUpload
                            labelText='Upload your video file'
                            inputType='file'
                            acceptedFile='video/*'
                            errorMessage={errorObject.video}
                        />

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='gray' mr={3} onClick={onClickClose}>
                            Close
                        </Button>
                    
                        <Button 
                            colorScheme='gray'
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