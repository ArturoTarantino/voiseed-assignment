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
import { SubTitleToEdit } from './ModalEditSubtitle';
import { Subtitle } from './SubTitleBox';
import { useEffect, useState } from 'react';
import { calculateDuration } from '../utils/parseSRT';

interface Props {
    isOpen: boolean;
    onClickClose: () => void;
    subtitle: SubTitleToEdit | null;
    saveSubtitle: (subtitle: Subtitle, index: number, operation: string) => void;
}

const ModalMergeSubtitle = ({ isOpen, onClickClose, subtitle, saveSubtitle }: Props) => {

    if (!subtitle) {
        return null;
    }

    const [mergedSubtitle, setMergedSubtitle] = useState<Subtitle | null>(null);

    useEffect(() => {
        if(isOpen) {
            const nextSub = subtitle.subtitlesList[subtitle.index + 1];
            setMergedSubtitle({
                start: subtitle.start,
                end: nextSub.end,
                duration: calculateDuration(subtitle.start, nextSub.end),
                text: subtitle.text + ' ' + nextSub.text
            })
        }
    }, [subtitle]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClickClose}
            isCentered
        >
            <Box style={{ color: 'black' }} >

                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Merge sub #{subtitle.index + 1} & #{subtitle.index + 2}</ModalHeader>

                    <ModalBody
                        display='flex'
                        flexDirection='column'
                    >
                        {
                            mergedSubtitle &&
                            <>
                                <p>
                                    Text will be merged, durations
                                    will be summed, start time will be the first line’s start
                                    time, the end time will be the second line’s end time.

                                    Subtitle result:
                                </p>

                                <p
                                    style={{ marginTop: '10px' }}
                                >
                                    <b>Start:</b> {mergedSubtitle.start}
                                </p>
                                <p><b>End:</b> {mergedSubtitle.end}</p>
                                <p><b>Duration:</b> {mergedSubtitle.duration}</p>
                                <p><b>Text:</b> {mergedSubtitle.text}</p>
                            </>
                        }

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='gray' mr={3} onClick={onClickClose}>
                            Close
                        </Button>

                        <Button
                            colorScheme='gray'
                            onClick={() => {
                                if(mergedSubtitle) {
                                    saveSubtitle(mergedSubtitle, subtitle.index, 'merge')
                                }
                            }}
                        >
                            Start
                        </Button>
                    </ModalFooter>
                </ModalContent>

            </Box>
        </Modal>
    )
}

export default ModalMergeSubtitle;