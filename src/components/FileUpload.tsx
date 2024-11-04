import {
    Input,
    Button,
    Box
} from '@chakra-ui/react';
import {
    useEffect,
    useRef,
    useState
} from 'react';
import { parseSRT } from '../utils/parseSRT';
import { saveVideoToIndexedDB } from '../utils/DBops';

interface Props {
    labelText: string;
    inputType: string;
    acceptedFile: string;
    errorMessage: boolean;
}

const FileUpload = ({ labelText, inputType, acceptedFile, errorMessage }: Props) => {

    const [file, setFile] = useState<File | undefined>(undefined);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files?.[0]);
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

                reader.onload = async (event) => {

                    const result = event.target?.result;
                    if (result) {
                        await saveVideoToIndexedDB(file);
                    }
                };
                reader.readAsDataURL(file);

                const videoElement = document.createElement('video');
                videoElement.src = URL.createObjectURL(file);

                videoElement.onloadedmetadata = function () {

                    const videoDuration = videoElement.duration;
                    localStorage.setItem("videoDuration", JSON.stringify(videoDuration));
                    URL.revokeObjectURL(videoElement.src);
                    videoElement.remove();
                };
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
                errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>
                    {acceptedFile === '.srt' ? 'You need to upload an .srt file' : 'You need to upload a video file'}
                </div>
            }
        </Box>
    )
}

export default FileUpload;