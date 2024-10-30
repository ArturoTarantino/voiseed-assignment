import {
  memo,
  useEffect
} from 'react';
import Logo from '../assets/revoiceitlogo_600.gif';
import {
  Box,
  Button
} from '@chakra-ui/react';

interface Props {
  onClickOpen: () => void;
}

const Intro = memo(({ onClickOpen }: Props) => {

  useEffect(() => {
    console.log('render Intro');
  }, [])

  return (
    <>
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        height='inherit'
      >

        <img src={Logo} alt="revoiceit logo" style={{ maxWidth: '600px', margin: '0 auto' }} />

        <p
          style={{
            fontSize: '25px',
            marginTop: '20px'
          }}
        >
          The professional virtual studio for expressive AI voices
        </p>

        <Button
          size='lg'
          sx={{
            maxWidth: '200px',
            marginTop: '20px'
          }}
          onClick={onClickOpen}
        >
          Create new project
        </Button>

      </Box>
    </>
  )
}
);

export default Intro;