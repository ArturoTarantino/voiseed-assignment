export const parseSRT = (srtContent: string): {
    start: string,
    end: string,
    duration: string,
    text: string
}[] | null => {
    
    if (!srtContent) return null;
    const entries = srtContent.split("\n\n");
    return entries.map((entry) => {
        const lines = entry.split("\n");
        const timecodes = lines[1].split(" --> ");

        // discard ms 
        const start = timecodes[0].trim().split(',')[0];
        const end = timecodes[1].trim().split(',')[0];
        const duration = calculateDuration(start, end);

        return {
            start,
            end,
            duration,
            text: lines.slice(2).join("\n").trim(),
        };
    });
}

export const calculateDuration = (start: string, end: string): string => {
    const startParts = start.split(':').map(Number);
    const endParts = end.split(':').map(Number);

    const startTotalSeconds = startParts[0] * 3600 + startParts[1] * 60 + startParts[2];
    const endTotalSeconds = endParts[0] * 3600 + endParts[1] * 60 + endParts[2];

    const durationSeconds = endTotalSeconds - startTotalSeconds;

    const hours = Math.floor(durationSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((durationSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (durationSeconds % 60).toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
};

export const convertParsedSRTToVTT = (parsedSRT: {
    start: string;
    end: string;
    text: string;
}[]) => {
    let vtt = 'WEBVTT\n\n';
    
    parsedSRT.forEach((subtitle: {
        start: string;
        end: string;
        text: string;
    }) => {
        const start = `${subtitle.start}.000`;
        const end = `${subtitle.end}.000`;

        vtt += `${start} --> ${end}\n`;
        vtt += `${subtitle.text}\n\n`;
    });

    return vtt.trim();
};