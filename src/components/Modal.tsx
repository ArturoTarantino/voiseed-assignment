import {
    Button,
    Modal as ChakraModel,
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

interface Props {
    isOpen: boolean;
    onClickClose: () => void;
    startProject: () => void;
}

interface ErrorObject {
    sub: boolean;
    video: boolean;
}

const Modal = ({ isOpen, onClickClose, startProject }: Props) => {
    
    const [errorObject, setErrorObject] = useState<ErrorObject>({ sub: false, video: false });

    // TODO 
    // implement remove function to clean storage and update of single file
    // can move validation inside file upload ?

    useEffect(() => {
        setErrorObject({ sub: false, video: false });
    }, []);

    const validateUpload = () => {

        const isSubUploaded = !!localStorage.getItem('sub-text');
        const isVideoUploaded = !!localStorage.getItem('video');

        const canStartProject = isSubUploaded && isVideoUploaded;
        console.log(canStartProject);
        if(!canStartProject) {
            setErrorObject({ sub: !isSubUploaded, video: !isVideoUploaded });
        } else {
            setErrorObject({ sub: false, video: false });
            onClickClose();
            // CAN ADD A FAKE LOADING or a SKELETON in state 0 upload
            startProject();
        }
    }

    return (
        <ChakraModel
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
        </ChakraModel>
    )
}

export default Modal;