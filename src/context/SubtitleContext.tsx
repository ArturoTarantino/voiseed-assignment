import React, {
    createContext,
    useContext,
    useState
} from 'react';
import { Subtitle } from '../components/SubTitleBox';

interface SubtitleContextType {
    startTime: number | null;
    setStartTime: (time: number) => void;
    currentTime: number;
    setCurrentTime: (time: number) => void;
    isVideoPlaying: boolean;
    setIsVideoPlaying: (playing: boolean) => void;
    isUserEditing: boolean;
    setIsUserEditing: (isEditing: boolean) => void;
    subTitles: Subtitle[]
    setSubTitles: (list: Subtitle[]) => void;
}


const SubtitleContext = createContext<SubtitleContextType | undefined>(undefined);

export const SubtitleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [startTime, setStartTime] = useState<number | null>(null);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
    const [isUserEditing, setIsUserEditing] = useState<boolean>(false);
    const [subTitles, setSubTitles] = useState<Subtitle[]>([]);

    return (
        <SubtitleContext.Provider
            value={{
                startTime,
                setStartTime,
                currentTime,
                setCurrentTime,
                isVideoPlaying,
                setIsVideoPlaying,
                isUserEditing,
                setIsUserEditing,
                subTitles,
                setSubTitles
            }}
        >
            {children}
        </SubtitleContext.Provider>
    );
};

export const useSubtitles = () => {
    const context = useContext(SubtitleContext);
    if (!context) {
        throw new Error('useSubtitles must be used within a SubtitleProvider');
    }
    return context;
};
