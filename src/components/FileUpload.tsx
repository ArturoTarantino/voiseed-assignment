import {
    Input,
    Button,
    Box
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';

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

        if(file) {
            const reader = new FileReader();
            if(file?.type === 'application/x-subrip') {
                reader.onload = (event) => {
                    if(event.target) localStorage.setItem("sub-text", JSON.stringify(event.target.result));
                }
            } else if(file?.type.includes('video/')) {
                reader.onload = (event) => {
                    if(event.target) localStorage.setItem("video", JSON.stringify(event.target.result));
                }
            }
            reader.readAsText(file);
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
                    width='50%'
                    marginTop='10px'
                    onClick={() => fileInputRef.current?.click()}
                >
                    Upload File
                </Button>
                { file && <span style={{ marginLeft: '15px', verticalAlign: 'text-top' }} >{file.name}</span> }
            </Box>
            { 
                errorMessage && <div style={{ color:'red' }}>
                   { acceptedFile === '.srt' ? 'You need to upload an .srt file' : 'You need to upload a video file' }
                </div> 
            }
        </Box>
    )
}

export default FileUpload;