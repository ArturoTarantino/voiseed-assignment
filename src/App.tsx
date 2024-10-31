import { useState } from 'react';
import './App.scss';
import ProjectStarter from './components/ProjectStarter';
import ModalUpload from './components/ModalUpload';
import Project from './components/Project';

const App = () => {
  
  const alreadyOpenProject = !!localStorage.getItem('subtitles') && !!localStorage.getItem('video');
  const [openProjectModal, setOpenProjectModal] = useState<boolean>(false);
  const [startProject, setStartProject] = useState<boolean>(alreadyOpenProject ?? false);

  return (
    <>
      <div className='App'>
        {
          startProject ?
            <Project />
            :
            <ProjectStarter
              onClickOpen={() => setOpenProjectModal(true)}
            />
        }
      </div>

      <ModalUpload
        isOpen={openProjectModal}
        onClickClose={() => setOpenProjectModal(false)}
        startProject={() => setStartProject(true)}
      />
    </>
  )
}

export default App;