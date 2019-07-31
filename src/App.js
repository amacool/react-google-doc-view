import React, {Component} from 'react';
import ReactGoogleDocView from './react-google-doc-view';
import './App.css';

// credentials
let clientId = '443792400890-10euqlru0cmiat2f3vblrei3olp32g4j.apps.googleusercontent.com';
let apiKey = 'AIzaSyC01VeeK9JfUExHR1bPi37RdpoSptDg-3U';
let documentId = '1OqkILmweYQR2AYd2D0_BVcFOz-Y7gpiNJeaovTcbZR0';

class App extends Component {
  state = {
    isDocLoaded: false,
    sectionBlocks: [],
    docFrameStyle: {}
  };
  
  getSectionBlock = ({sectionBlocks, docFrameStyle}) => {
    this.setState({sectionBlocks, docFrameStyle, isDocLoaded: true});
  };
  
  render() {
    const {isDocLoaded, sectionBlocks, docFrameStyle} = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h1>Using React Google Doc</h1>
        </header>
        <ReactGoogleDocView
          clientId={clientId}
          apiKey={apiKey}
          documentId={documentId}
          getSections={this.getSectionBlock}
          afterLoading={() => this.setState({isDocLoaded: true})}
        />
        {isDocLoaded ?
        <div className='doc-view-container'>
          <div className='page-container'>
            <div className='doc-view-frame' style={docFrameStyle}>
              {sectionBlocks.map(block => block.content)}
            </div>
          </div>
        </div>: null}
      </div>
    );
  }
}

export default App;
