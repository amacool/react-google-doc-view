import React from 'react';
import './index.css';

const DocView = ({ docContent }) => {
  docContent.errors.forEach(item => item.action === 'hard' && alert(item.message));
  return (
    <div className='doc-view-container'>
      <div className='page-container'>
        <div className='doc-view-frame' style={docContent.docFrameStyle}>
          <div className='warning-message'>
            {docContent.errors.map((item, key) => <div key={key}>
              <span className='error-type'>{item.type} [{item.context}]</span>
              <span> : {item.message}</span>
            </div>)}
          </div>
          {docContent.docSections.map(block => block.content)}
        </div>
      </div>
    </div>
  )
};
export default DocView;