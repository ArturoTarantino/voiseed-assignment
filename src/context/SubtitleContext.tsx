import React, { 
    createContext, 
    useContext, 
    useState 
} from 'react';

interface SubtitleContextType {
    startTime: number | null;
    setStartTime: (time: number) => void;
    currentTime: number;
    setCurrentTime: (time: number) => void;
}


const SubtitleContext = createContext<SubtitleContextType | undefined>(undefined);

export const SubtitleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [startTime, setStartTime] = useState<number | null>(null);
    const [currentTime, setCurrentTime] = useState<number>(0);

    return (
        <SubtitleContext.Provider value={{ startTime, setStartTime, currentTime, setCurrentTime }}>
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
