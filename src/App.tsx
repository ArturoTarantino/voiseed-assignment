import { useEffect, useState } from 'react';
import './App.scss';
import ProjectStarter from './components/ProjectStarter';
import ModalUpload from './components/ModalUpload';
import Project from './components/Project';
import { getVideoFromIndexedDB } from './utils/DBops';

const App = () => {
  
  const [openProjectModal, setOpenProjectModal] = useState<boolean>(false);
  const [startProject, setStartProject] = useState<boolean>(false);
  
  useEffect(() => {

    getVideoFromIndexedDB().then(videoBlob => {

      const videoExist = !!videoBlob;
      const subtitlesExist = !!localStorage.getItem('subtitles');

      if (videoExist && subtitlesExist) {
        setStartProject(true);
      }

    }).catch(error => {
      console.error("error checking project data", error);
    });

  }, []);

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