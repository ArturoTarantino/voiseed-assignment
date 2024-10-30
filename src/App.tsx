import { useState } from 'react';
import './App.scss';
import Intro from './components/Intro';
import Modal from './components/Modal';

const App = () => {
  
  const alreadyOpenProject = !!localStorage.getItem('sub-text') && !!localStorage.getItem('video');
  const [openProjectModal, setOpenProjectModal] = useState<boolean>(false);
  const [startProject, setStartProject] = useState<boolean>(alreadyOpenProject ?? false);

  console.log(openProjectModal)
  return (
    <>
      <div className='App'>
        {
          startProject ?
            <>hello boys</>
            :
            <Intro
              onClickOpen={() => setOpenProjectModal(true)}
            />
        }
      </div>

      <Modal
        isOpen={openProjectModal}
        onClickClose={() => setOpenProjectModal(false)}
        startProject={() => setStartProject(true)}
      />
    </>
  )
}

export default App;