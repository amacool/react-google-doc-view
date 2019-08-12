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
    //   documentId: '1-uOj6quBuvs7wWidJfHuBz4PgN6Hq2dmjl27H_BjWy0'
    // }).then(res => {
    //    console.log(res.result);
    //    data = getSectionBlocks(res.result);
    //    this.forceUpdate();
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
