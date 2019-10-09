// Imports
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// Operations
import { doStartLoading, doStopLoading } from '../App/operations';

// Presentation Components
import DocViewer from '../../components/DocViewer';

// Viewer Helpers
import {
    closeNodes,
    getDocSlideList,
    getNodeId,
    getParents,
    getReadProgress,
    renderNode,
} from './viewer';

// Main Component
const ViewerContainer = props => {
    /**
     *
     */
    const { fetching, content } = props;
    const { docFrameStyle, docSectionStructure } = content;
    const [curNodeId, setCurNodeId] = useState(0);
    const [curNode, setCurNode] = useState({});
    const [showNavigationList, setShowNavigationList] = useState(false);
    const [progress, setProgress] = useState(0);
    const [docSlideList, setDocSlideList] = useState([]);
    const [menuList, setMenuList] = useState([]);
    
    const navigateToPrev = () => {
        let nodeId = 0;
        for (let i = curNodeId - 1;; i -= 1) {
            if (i < 0) {
                i = docSlideList.length - 1;
            }
            if (docSlideList[i].content) {
                nodeId = i;
                break;
            }
        }
        closeNodes(getParents(docSlideList, curNode));
        getParents(docSlideList, docSlideList[nodeId]).forEach(item => (item.isOpen = true));
        setCurNodeId(nodeId);
        setCurNode(docSlideList[nodeId]);
    };
    
    const navigateToNext = () => {
        let nodeId = 0;
        for (let i = curNodeId + 1;; i += 1) {
            if (i >= docSlideList.length) {
                i = 0;
            }
            if (docSlideList[i].content) {
                nodeId = i;
                break;
            }
        }
        closeNodes(getParents(docSlideList, curNode));
        getParents(docSlideList, docSlideList[nodeId]).forEach(item => (item.isOpen = true));
        setCurNodeId(nodeId);
        setCurNode(docSlideList[nodeId]);
    };

    const renderNavigationList = (item, key) => {
        return (
            <React.Fragment key={key}>
                <li
                    className={`nav-item ${
                        curNode.nodeId === item.nodeId
                            ? 'active focus'
                            : curNode.nodeId.indexOf(item.nodeId) === 0
                            ? 'active'
                            : ''
                    }`}
                    onClick={e => {
                        const prevNode = docSlideList.find(
                            listItem => listItem.nodeId === curNode.nodeId,
                        );
                        if (item.nodeId !== prevNode.nodeId) {
                            prevNode.isOpen = false;
                        }
                        // find non-empty slide
                        let targetNodeId = getNodeId(docSlideList, item);
                        for (let i = targetNodeId;; i += 1) {
                            if (i >= docSlideList.length) {
                                break;
                            }
                            if (docSlideList[i].content) {
                                targetNodeId = i;
                                break;
                            }
                        }
                        let targetItem = docSlideList[targetNodeId];
                        let parents = getParents(docSlideList, targetItem);
                        item.isOpen = !item.isOpen;
                        if (item.isOpen) {
                            closeNodes(getParents(docSlideList, curNode));
                            parents.forEach(parent => (parent.isOpen = true));
                        }
    
                        setCurNodeId(targetNodeId);
                        setCurNode({ ...targetItem, isOpen: item.isOpen });
                        e.stopPropagation();
                    }}
                    style={{ paddingLeft: `${10 * (item.level - 1)}px` }}
                >
                    {item.nodeId}. {item.title}
                </li>
                {item.slides && item.isOpen && (
                    <div>
                        <ul>
                            {item.slides.map((slide, index) => {
                                return renderNavigationList(slide, index);
                            })}
                        </ul>
                    </div>
                )}
            </React.Fragment>
        );
    };

    // Set current progress
    useEffect(() => {
        setProgress(getReadProgress(curNodeId, docSlideList.length));
    }, [setProgress, getReadProgress, curNodeId, docSlideList]);

    // Generate slide list
    useEffect(() => {
        const { slideList, menuList: updatedMenuList } = getDocSlideList(
            docSectionStructure.sections,
        );
        setDocSlideList(slideList);
        setCurNode(slideList[0]);
        setMenuList(updatedMenuList);
    }, [getDocSlideList, setDocSlideList, setCurNode, setMenuList]);

    return (
        <DocViewer
            {...props}
            docSlideList={docSlideList}
            loading={fetching}
            style={docFrameStyle}
            nextSlide={navigateToNext}
            prevSlide={navigateToPrev}
            progress={progress}
            curNodeId={curNodeId}
            showTOC={showNavigationList}
            setShowTOC={setShowNavigationList}
            renderTOC={renderNavigationList}
            menuList={menuList}
        >
            {docSlideList.length > 0 && renderNode(docSlideList, docSlideList[curNodeId], curNodeId)}
        </DocViewer>
    );
};

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            doStartLoading,
            doStopLoading,
        },
        dispatch,
    );

// Property Types
ViewerContainer.propTypes = {
    doStartLoading: PropTypes.func,
    doStopLoading: PropTypes.func,
    fetching: PropTypes.bool,
    content: PropTypes.object,
};

// Export view container (for LMS viewer)
export default connect(mapDispatchToProps)(ViewerContainer);

// Export raw data (for populating tables)
export { getSectionBlocks } from './GetSectionBlocks';
