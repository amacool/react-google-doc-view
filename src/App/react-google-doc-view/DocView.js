import React, { useState, useEffect } from 'react';
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";
import './index.css';

const DocView = ({ docContent }) => {
  const { docSectionList, totalElementCount } = docContent;
  const [curNodeId, setCurNodeId] = useState(docSectionList.sections[0].id);
  const [curNodeContent, setCurNodeContent] = useState(docSectionList.sections[0]);
  const [openState, setOpenState] = useState(false);
  const [showNavigationList, setShowNavigationList] = useState(false);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    setReadProgress();
  }, [curNodeId]);
  
  const findInSection = (nodeId, section) => {
    if (section.id === nodeId) {
      return section;
    } else if (!section.slides) {
      return false;
    }
    let searchedNode = null;
    for (let i = 0; i < section.slides.length; i++) {
      searchedNode = findInSection(nodeId, section.slides[i]);
      if (searchedNode) {
        break;
      }
    }
    return searchedNode;
  };
  
  const findInList = (nodeId) => {
    let searchResult = '';
    for (let i = 0; i < docSectionList.sections.length; i++) {
      const res = findInSection(nodeId, docSectionList.sections[i]);
      if (res) {
        searchResult = res;
        break;
      }
    }
    return searchResult;
  };
  
  const findParent = (curNodeId, curNodeLevel) => {
    let nodeId = curNodeId;
    let nodeContent = {};
    do {
      nodeId--;
      nodeContent = findInList(nodeId);
    } while ((!nodeContent || !nodeContent.level || nodeContent.level >= curNodeLevel) && nodeId >= 0);
    if (nodeContent && nodeId >= 0) {
      return nodeContent;
    } else {
      return false;
    }
  };
  
  const findParents = (node) => {
    let parents = [];
    let child = node;
    if (node.level === 1) {
      parents.push(node);
    } else {
      while (child.level > 1) {
        const parent = findParent(child.id, child.level);
        if (parent) {
          parents.push(parent);
          child = parent;
        } else {
          break;
        }
      }
    }
    return parents;
  };
  
  const setReadProgress = () => {
    let parents = findParents(curNodeContent);
    let section = parents.find(item => item.level === 1);
    let nthSection = docSectionList.sections.findIndex(item => section.id === item.id) + 1;
    setProgress((nthSection - 1)/docSectionList.sections.length*100);
  };
  
  const navigateToPrev = () => {
    let nodeId = curNodeId;
    let nodeContent = {};
    do {
      nodeId--;
      nodeContent = findInList(nodeId);
    } while ((!nodeContent || !nodeContent.level) && nodeId >= 0);
    if (nodeContent && nodeId >= 0) {
      setCurNodeContent(nodeContent);
      setCurNodeId(nodeId);
    }
  };
  
  const navigateToNext = () => {
    let nodeId = curNodeId;
    let nodeContent = {};
    do {
      nodeId++;
      nodeContent = findInList(nodeId);
    } while ((!nodeContent || !nodeContent.level) && nodeId < totalElementCount);
    if (nodeContent && nodeId < totalElementCount) {
      setCurNodeContent(nodeContent);
      setCurNodeId(nodeId);
    }
  };
  
  const renderTitle = (nodeContent, key) => {
    let nodeTitle = '';
    let level = nodeContent.level;
    let title = nodeContent.title;
    // render title
    switch (level) {
      case 1:
        nodeTitle = <h1 key={key} style={{fontSize: '32px'}}>{title}</h1>;
        break;
      case 2:
        nodeTitle = <h2 key={key} style={{fontSize: '24px'}}>{title}</h2>;
        break;
      case 3:
        nodeTitle = <h3 key={key} style={{fontSize: '16px'}}>{title}</h3>;
        break;
      case 4:
        nodeTitle = <h4 key={key} style={{fontSize: '15px'}}>{title}</h4>;
        break;
      case 5:
        nodeTitle = <h5 key={key} style={{fontSize: '14px'}}>{title}</h5>;
        break;
      case 6:
        nodeTitle = <h6 key={key} style={{fontSize: '13px'}}>{title}</h6>;
        break;
    
      default:
        nodeTitle = '';
        break;
    }
    return nodeTitle;
  };
  
  const renderNode = (nodeContent) => {
    let level = nodeContent.level;
    let nodeBody = [];
    
    // render title
    let nodeTitle = renderTitle(nodeContent, nodeContent.id);
    if (level > 1) {
      nodeBody = findParents(nodeContent).map(item => item.html);
      nodeBody.reverse();
    }
    if (nodeTitle) nodeBody.push(nodeTitle);
    
    // render content
    if (nodeContent.slides) {
      const tNodes = nodeContent.slides.map(slide => renderNode(slide));
      nodeBody = [...nodeBody, ...tNodes];
    } else {
      nodeBody.push(nodeContent.html);
    }
    return nodeBody;
  };
  
  const renderNavigationList = (node, pIndex, cIndex) => {
    if (!node.slides) {
      return (
        <li
          key={cIndex}
          className='nav-item'
          onClick={() => {
            setCurNodeContent(node);
            setCurNodeId(node.id);
          }}
        >
          {node.title}
        </li>
      );
    }
    let levelStr = pIndex ? `${pIndex}.${cIndex}` : cIndex;
    let childIndex = 0;
    let parents = findParents(curNodeContent);
    let curSection = parents.find(item => item.level === 1);
    
    return (
      <React.Fragment key={cIndex}>
        <React.Fragment>
          <li
            className={`nav-item ${ (curSection && curSection.id === node.id) || curNodeId === node.id ? 'active' : ''}`}
            onClick={(e) => {
              node.isOpen = !node.isOpen;
              setCurNodeContent(node);
              setCurNodeId(node.id);
              setOpenState(node.isOpen);
              if (parents) {
                const sectionLevel = levelStr.toString().split('.')[0];
                setProgress((sectionLevel - 1)/docSectionList.sections.length*100);
              }
              e.stopPropagation();
            }}
          >
            {levelStr}. {node.title}
          </li>
          <div>
            {node.isOpen && node.slides && node.slides.length > 0 &&
            <ul>
              {node.slides.map((slide) => {
                if (slide.title) {
                  childIndex++;
                  return renderNavigationList(slide, levelStr, childIndex);
                }
                return null;
              })}
            </ul>
            }
          </div>
        </React.Fragment>
      </React.Fragment>
    );
  };
  
  return (
    <div className='doc-view-container'>
      <div className='page-container'>
        <div className='doc-view-frame-container'>
          <div className='doc-view-frame-header'>
            <div className='doc-view-progress'>
              <Progress percent={progress} status="warning" />
              <div> {progress/100*docSectionList.sections.length}/{docSectionList.sections.length}</div>
            </div>
            <div className='btn-show-list' onClick={() => setShowNavigationList(!showNavigationList)}>
              <svg width="20" height="16" viewBox="0 0 20 18" fill="white" xmlns="http://www.w3.org/2000/svg"><rect width="20" height="1" fill="black"></rect><rect y="8" width="20" height="1" fill="black"></rect><rect y="16" width="20" height="1" fill="black"></rect></svg>
            </div>
          </div>
          <div className='doc-view-frame'>
            {curNodeContent && renderNode(curNodeContent).map(item => item)}
          </div>
          <div className='doc-view-frame-controller'>
            <div onClick={() => navigateToPrev()}>Previous</div>
            <div onClick={() => navigateToNext()}>Next</div>
          </div>
        </div>
      </div>
      {showNavigationList &&
      <div className='navigation-container'>
        <ul>
          {docSectionList.sections.map((section, index) => renderNavigationList(section, null, index + 1))}
        </ul>
      </div>}
    </div>
  )
};
export default DocView;