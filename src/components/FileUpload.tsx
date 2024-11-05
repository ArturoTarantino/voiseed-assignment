import {
    Input,
    Button,
    Box
} from '@chakra-ui/react';
import {
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState
} from 'react';
import { parseSRT } from '../utils/parseSRT';
import { saveVideoToIndexedDB } from '../utils/DBops';
import { ErrorObject, UploadError } from './ModalUpload';

interface Props {
    labelText: string;
    inputType: string;
    acceptedFile: string;
    errorMessage: UploadError;
    setError: Dispatch<SetStateAction<ErrorObject>>;
}

const FileUpload = ({ labelText, inputType, acceptedFile, errorMessage, setError }: Props) => {

    const [file, setFile] = useState<File | undefined>(undefined);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files?.[0]);
        if (!!e.target.files?.[0] && acceptedFile === '.srt') {
            setError((prev) => {
                return {
                    ...prev,
                    sub: {
                        value: false,
                        text: null
                    }
                }
            })
        } else if (!!e.target.files?.[0] && acceptedFile.includes('video/')) {

            setError((prev) => {
                return {
                    ...prev,
                    video: {
                        value: false,
                        text: null
                    }
                }
            })
        }
    }

    useEffect(() => {

        if (file) {
            const reader = new FileReader();

            if (file?.type === 'application/x-subrip') {
                reader.onload = (event) => {
                    if (event.target) localStorage.setItem("subtitles", JSON.stringify(parseSRT(event.target.result as string)));
                }
                reader.readAsText(file);
            } else if (file?.type.includes('video/')) {

                saveVideoToIndexedDB(file)
                    .then(() => {
                        const videoElement = document.createElement('video');
                        videoElement.src = URL.createObjectURL(file);
        
                        videoElement.onloadedmetadata = function () {
                            const videoDuration = videoElement.duration;
                            localStorage.setItem("videoDuration", JSON.stringify(videoDuration));
                            URL.revokeObjectURL(videoElement.src);
                            videoElement.remove();
                        };
                    }).catch(error => console.error('error upload video', error))
            }
        }
    }, [file]);

    return (
        <Box
            style={{
                margin: '20px 0'
            }}
        >
            <label>{labelText}</label>
            <Input
                variant='unstyled'
                type={inputType}
                accept={acceptedFile}
                ref={fileInputRef}
                onChange={handleChangeFile}
                display='none'
                required
            />
            <Box>
                <Button
                    width='150px'
                    marginTop='10px'
                    onClick={() => fileInputRef.current?.click()}
                    className='my-btn'
                >
                    Upload File
                </Button>
                {file && <span style={{ marginLeft: '15px', verticalAlign: 'text-top', whiteSpace: 'pre-wrap' }} >{file.name}</span>}
            </Box>
            {
                errorMessage.value && <div style={{ color: 'red', marginTop: '10px' }}>
                    {errorMessage.text}
                </div>
            }
        </Box>
    )
}

export default FileUpload;