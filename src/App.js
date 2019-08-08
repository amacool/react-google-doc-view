import React, { Component } from 'react';
import ReactGoogleDocView, { getSectionBlocks } from './react-google-doc-view';
import { dummyData } from './react-google-doc-view/dummyData';
// import { googleDocConnect } from './react-google-doc-view/GoogleDocConnect';
import './App.css';

// let docContent = {
//   docSections: [],
//   docFrameStyle: {}
// };

class App extends Component {
  componentDidMount() {
    // googleDocConnect({
    //   clientId: '443792400890-10euqlru0cmiat2f3vblrei3olp32g4j.apps.googleusercontent.com',
    //   apiKey: 'AIzaSyC01VeeK9JfUExHR1bPi37RdpoSptDg-3U',
    //   documentId: '1OqkILmweYQR2AYd2D0_BVcFOz-Y7gpiNJeaovTcbZR0'
    // }).then(res => {
    //    getSectionBlocks(res);
    // });
    // console.log(getSectionBlocks(dummyData));
    
  }
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Using React Google Doc</h1>
        </header>
        <ReactGoogleDocView
          docContent={getSectionBlocks(dummyData)}
        />
      </div>
    );
  }
}

export default App;
