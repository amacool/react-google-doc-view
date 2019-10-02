import React from 'react';

const getReadProgress = (curPos, totalLen) => {
    return parseInt(totalLen ? (curPos / totalLen) * 100 : '0', 10);
};

const findInNestedList = (list, nodeId, node) => {
    if (list.nodeId === nodeId) {
        list.slides.push(node);
        return true;
    }
    for (let i = 0; i < list.slides.length; i += 1) {
        if (findInNestedList(list.slides[i], nodeId, node)) {
            return true;
        }
    }
    return false;
};

const getDocSlideList = sections => {
    const slideList = [];
    sections.forEach((section, sectionIndex) => {
        section.slides.forEach((slide, slideIndex) => {
            const { level } = slide;
            let pos = slideList.length - 1;
            // get parent index
            let siblingCount = 0;
            for (; pos >= 0 && slideList[pos].level + 1 !== level; pos -= 1) {
                if (slideList[pos].level === level) {
                    siblingCount += 1;
                }
            }
            const parentNodeId = pos >= 0 ? `${slideList[pos].nodeId}.${siblingCount + 1}` : '';
            const nodeId =
                slideIndex === 0
                    ? (sectionIndex + 1).toString()
                    : parentNodeId || (slideIndex + 1).toString();
            slideList.push({
                ...slide,
                sectionTitle: section.title,
                nodeId,
                isOpen: false,
                slides: [],
            });
        });
    });

    const sectionMenuList = [];
    slideList.forEach(item => {
        if (item.level === 1) {
            sectionMenuList.push(item);
        } else {
            const { nodeId } = item;
            const childNodeId = nodeId.substr(0, nodeId.length - 2);
            for (let i = 0; i < sectionMenuList.length; i += 1) {
                if (findInNestedList(sectionMenuList[i], childNodeId, item)) {
                    break;
                }
            }
        }
    });
    return { slideList, menuList: sectionMenuList };
};

const closeNodes = nodes => {
    nodes.forEach(item => (item.isOpen = false));
};

const getNodeId = (list, node) => {
    return list.findIndex(item => item.nodeId === node.nodeId);
};

const getParents = (list, node) => {
    return list.filter(
        item => node.nodeId !== item.nodeId && node.nodeId.indexOf(item.nodeId) === 0,
    );
};

const renderTitle = (level, title, key) => {
    let nodeTitle = '';
    const fontSizes = ['32px', '24px', '20px', '18px', '16px', '14px'];

    if (level) {
        nodeTitle = React.createElement(
            `h${level}`,
            {
                style: { fontSize: fontSizes[level] },
                key,
            },
            title,
        );
    }

    return nodeTitle;
};

const renderNode = (list, node, curNodeId) => {
    const { level, title, sectionTitle } = node;
    let nodeBody = [];

    // render title
    const nodeTitle = renderTitle(level, title, `title-${curNodeId}-${level}`);
    if (level !== 1) {
        let currentLevel = level;
        for (let nodeId = curNodeId - 1; nodeId >= 0 && list[nodeId].level > 1; nodeId -= 1) {
            const slide = list[nodeId];
            if (slide.level < currentLevel) {
                nodeBody.push(
                    renderTitle(slide.level, slide.title, `title-${nodeId}-${slide.level}`),
                );
            }
            if (slide.level > currentLevel) break;
            currentLevel = slide.level;
        }
        nodeBody.push(renderTitle(1, sectionTitle, `title-${curNodeId}-1`));
        nodeBody.reverse();
    }
    if (nodeTitle) nodeBody.push(nodeTitle);

    // render content
    const nodeContent = <div key="node-key" dangerouslySetInnerHTML={{ __html: node.content }} />;
    nodeBody = [...nodeBody, nodeContent];
    return nodeBody;
};

export {
    getReadProgress,
    findInNestedList,
    getDocSlideList,
    closeNodes,
    getNodeId,
    getParents,
    renderTitle,
    renderNode,
};
