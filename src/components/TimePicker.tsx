import { useState } from 'react';
import { Select, HStack, Text } from '@chakra-ui/react';

interface Props {
    time: Time;
    onTimeChange: (time: Time) => void;
    isError: boolean;
}

interface Time {
    type: string;
    hours: number;
    minutes: number;
    seconds: number;
}

const selectStyles =  {
    color: '#F5F5F5',
    border: '1px solid #666666',
    borderRadius: '4px',
    padding: '8px',
    fontSize: '16px',
    outline: 'none',
    boxShadow: 'none',
    '&:hover': {
        borderColor: '#666666',
        color: '#FFFFFF',
    },
    '& option': {
        backgroundColor: '#2E2E2E',
        color: '#F5F5F5',
        '&:hover': {
            color: '#FFFFFF',
        },
    },
}

const TimePicker = ({ time, onTimeChange, isError }: Props) => {

    const [timeInput, setTimeInput] = useState<Time>(time ?? {
        type: undefined,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    const handleTimeChange = (key: 'hours' | 'minutes' | 'seconds', value: number) => {

        const newTime = {
            ...timeInput,
            [key]: value
        };
        setTimeInput(newTime);
        onTimeChange(newTime);
    };

    return (
        <>
            <HStack spacing={2}>

                <Select
                    value={timeInput?.hours}
                    onChange={(e) => handleTimeChange('hours', Number(e.target.value))}
                    focusBorderColor='#666666'
                    sx={selectStyles}
                >
                    {
                        [...Array(2)].map((_, i) => (
                            <option key={i} value={i}>
                                {
                                    String(i).padStart(2, '0')
                                }
                            </option>
                        ))
                    }
                </Select>

                <Text>:</Text>

                <Select
                    value={timeInput?.minutes}
                    onChange={(e) => handleTimeChange('minutes', Number(e.target.value))}
                    focusBorderColor='#666666'
                    sx={selectStyles}
                >
                    {
                        [...Array(60)].map((_, i) => (
                            <option key={i} value={i}>
                                {
                                    String(i).padStart(2, '0')
                                }
                            </option>
                        ))
                    }
                </Select>

                <Text>:</Text>

                <Select
                    value={timeInput?.seconds}
                    onChange={(e) => handleTimeChange('seconds', Number(e.target.value))}
                    focusBorderColor='#666666'
                    sx={selectStyles}
                >
                    {
                        [...Array(60)].map((_, i) => (
                            <option key={i} value={i}>
                                {
                                    String(i).padStart(2, '0')
                                }
                            </option>
                        ))
                    }
                </Select>

            </HStack>

            {
                isError && <div style={{color: 'red'}}>Verify your input</div>
            }
        </>
    );
};

export default TimePicker;