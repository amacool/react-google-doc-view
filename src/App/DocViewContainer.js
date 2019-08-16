import React from 'react';
import ReactGoogleDocView from './react-google-doc-view';
import { documentId } from "./react-google-doc-view/config";

const DocViewContainer = () => {
  return (
    <div>
      <header className="App-header">
        <h1>Using React Google Doc</h1>
      </header>
      <div className="App-body">
        <ReactGoogleDocView documentId={documentId} />
      </div>
    </div>
  );
};

export default DocViewContainer;