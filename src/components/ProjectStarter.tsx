import {
  memo
} from 'react';
import Logo from '../assets/logo.png';
import {
  Box,
  Button
} from '@chakra-ui/react';

interface Props {
  onClickOpen: () => void;
}

const ProjectStarter = memo(({ onClickOpen }: Props) => {

  return (
    <>
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        height='inherit'
      >

        <img src={Logo} alt="logo" style={{ maxWidth: '600px', margin: '0 auto' }} />

        <p
          style={{
            fontSize: '25px',
            marginTop: '20px'
          }}
        >
          Virtual Studio for managing subtitles, video playback and waveform analysis
        </p>

        <Button
          size='lg'
          sx={{
            maxWidth: '200px',
            marginTop: '20px'
          }}
          className='my-btn'
          onClick={onClickOpen}
        >
          Create new project
        </Button>

      </Box>
    </>
  )
}
);

export default ProjectStarter;