import React, { 
    createContext, 
    useContext, 
    useState 
} from 'react';

interface SubtitleContextType {
    startTime: number | null;
    setStartTime: (time: number) => void;
}


const SubtitleContext = createContext<SubtitleContextType | undefined>(undefined);

export const SubtitleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [startTime, setStartTime] = useState<number | null>(null);

    return (
        <SubtitleContext.Provider value={{ startTime, setStartTime }}>
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
