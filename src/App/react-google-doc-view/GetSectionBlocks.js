import React from 'react';
import { getFrameStyle, getNamedStyle, getBorderStyle, getTextStyle, getHeadingNum } from './operations';

export const getSectionBlocks = data => {
  // console.log('processing data', data);
  const elementArr = data.body.content;
  const { documentStyle } = data;
  let namedStyles = data.namedStyles.styles;
  const { inlineObjects } = data;
  const { lists } = data;
  let sectionBlocks = [];
  let sectionList = {
    title: data.title,
    sections: []
  };
  const errors = [];
  
  const renderTextElement = (textElement, key, namedStyleType) => {
    const { content, textStyle } = textElement;
    let renderElement = null;
    const style = getTextStyle(textStyle);
    
    if (textStyle.link && textStyle.link !== {}) {
      renderElement = (
        <a href={textStyle.link.url} key={key} style={style}>
          {content}
        </a>
      );
    } else if (namedStyleType === 'HEADING_1') {
      renderElement = (
        <h1 style={style} key={key}>
          {content}
        </h1>
      );
    } else if (namedStyleType === 'HEADING_2') {
      renderElement = (
        <h2 style={style} key={key}>
          {content}
        </h2>
      );
    } else if (namedStyleType === 'HEADING_3') {
      renderElement = (
        <h3 style={style} key={key}>
          {content}
        </h3>
      );
    } else if (namedStyleType === 'HEADING_4') {
      renderElement = (
        <h4 style={style} key={key}>
          {content}
        </h4>
      );
    } else if (namedStyleType === 'HEADING_5') {
      renderElement = (
        <h5 style={style} key={key}>
          {content}
        </h5>
      );
    } else if (namedStyleType === 'HEADING_6') {
      renderElement = (
        <h6 style={style} key={key}>
          {content}
        </h6>
      );
    } else {
      renderElement = (
        <span style={style} key={key}>
                    {content}
                </span>
      );
    }
    return renderElement;
  };
  
  const renderObjectElement = (objElement, key) => {
    if (objElement.inlineObjectId) {
      const { inlineObjectId, textStyle } = objElement;
      const object = inlineObjects[inlineObjectId].inlineObjectProperties.embeddedObject;
      let objStyle = {};
      let src = null;
      
      if (textStyle) {
        objStyle = getTextStyle(textStyle);
      }
      if (object.imageProperties) {
        src = object.imageProperties.contentUri;
      }
      if (object.embeddedObjectBorder) {
        // Not styled
      }
      if (object.size) {
        objStyle.height = object.size.height.magnitude + object.size.height.unit;
        objStyle.width = object.size.width.magnitude + object.size.width.unit;
      }
      if (object.marginTop && object.marginTop.magnitude) {
        objStyle.marginTop = object.marginTop.magnitude + object.marginTop.unit;
      }
      if (object.marginBottom && object.marginBottom.magnitude) {
        objStyle.marginBottom = object.marginBottom.magnitude + object.marginBottom.unit;
      }
      if (object.marginLeft && object.marginLeft.magnitude) {
        objStyle.marginLeft = object.marginLeft.magnitude + object.marginLeft.unit;
      }
      if (object.marginRight && object.marginRight.magnitude) {
        objStyle.marginRight = object.marginRight.magnitude + object.marginRight.unit;
      }
      return <img src={src} key={key} style={objStyle} alt="" />;
    }
    return null;
  };
  
  const renderDocElement = (element, key, namedStyleType) => {
    if (element.inlineObjectElement) {
      return renderObjectElement(element.inlineObjectElement, key);
    }
    if (element.textRun) {
      return renderTextElement(element.textRun, key, namedStyleType);
    }
  };
  
  const renderParagraph = (paragraph, key) => {
    const { elements, paragraphStyle, bullet } = paragraph;
    let style = {};
    
    if (paragraphStyle.namedStyleType && namedStyles[paragraphStyle.namedStyleType]) {
      // Get named styles
      const { textStyle, paraStyle } = namedStyles[paragraphStyle.namedStyleType];
      style = getTextStyle(textStyle);
      if (paraStyle.alignment === 'START') {
        //
      }
      if (paraStyle.direction === 'LEFT_TO_RIGHT') {
        style.direction = 'ltr';
      }
      if (paraStyle.spacingMode === 'NEVER_COLLAPSE') {
        //
      }
      if (
        paraStyle.spaceAbove &&
        paraStyle.spaceAbove.magnitude &&
        paraStyle.spaceAbove.unit
      ) {
        style.marginTop = paraStyle.spaceAbove.magnitude + paraStyle.spaceAbove.unit;
      }
      if (
        paraStyle.spaceBelow &&
        paraStyle.spaceBelow.magnitude &&
        paraStyle.spaceBelow.unit
      ) {
        style.marginBottom = paraStyle.spaceBelow.magnitude + paraStyle.spaceBelow.unit;
      }
      if (paraStyle.borderTop) {
        if (paraStyle.borderTop.width && paraStyle.borderTop.width.magnitude)
          style.borderTop = getBorderStyle(paraStyle.borderTop);
      }
      if (paraStyle.borderBottom) {
        if (paraStyle.borderBottom.width && paraStyle.borderBottom.width.magnitude)
          style.borderBottom = getBorderStyle(paraStyle.borderBottom);
      }
      if (paraStyle.borderLeft) {
        if (paraStyle.borderLeft.width && paraStyle.borderLeft.width.magnitude)
          style.borderLeft = getBorderStyle(paraStyle.borderLeft);
      }
      if (paraStyle.borderRight) {
        if (paraStyle.borderRight.width && paraStyle.borderRight.width.magnitude)
          style.borderRight = getBorderStyle(paraStyle.borderRight);
      }
    }
    if (paragraphStyle.lineSpacing) {
      style.lineHeight = paragraphStyle.lineSpacing / 100;
    }
    if (paragraphStyle.direction) {
      style.direction = paragraphStyle.direction === 'LEFT_TO_RIGHT' ? 'ltr' : 'rtl';
    }
    if (
      paragraphStyle.spaceAbove &&
      paragraphStyle.spaceAbove.magnitude &&
      paragraphStyle.spaceAbove.unit
    ) {
      style.marginTop =
        (paragraphStyle.spaceAbove.magnitude || 0) + paragraphStyle.spaceAbove.unit;
    }
    if (
      paragraphStyle.spaceBelow &&
      paragraphStyle.spaceBelow.magnitude &&
      paragraphStyle.spaceAbove &&
      paragraphStyle.spaceAbove.unit
    ) {
      style.marginBottom =
        (paragraphStyle.spaceBelow.magnitude || 0) + paragraphStyle.spaceAbove.unit;
    }
    if (paragraphStyle.alignment) {
      style.textAlign = paragraphStyle.alignment;
      if (paragraphStyle.alignment === 'JUSTIFIED') style.textAlign = 'justify';
    }
    if (paragraphStyle.keepLinesTogether) {
      // keep lines together
    }
    if (paragraphStyle.keepWithNext) {
      // display paragraph on same page as the previous
    }
    if (paragraphStyle.avoidWidowAndOrphan) {
      // avoid widows and orphans
    }
    if (
      paragraphStyle.indentFirstLine &&
      paragraphStyle.indentFirstLine &&
      paragraphStyle.indentFirstLine.unit
    ) {
      // let magnitude = (paragraphStyle.indentFirstLine.magnitude || 0) + paragraphStyle.indentFirstLine.unit;
    }
    if (
      paragraphStyle.indentStart &&
      paragraphStyle.indentStart.magnitude &&
      paragraphStyle.indentStart.unit
    ) {
      style.paddingLeft =
        (paragraphStyle.indentStart.magnitude || 0) + paragraphStyle.indentStart.unit;
    }
    
    let domBullet = null;
    if (bullet) {
      const { listId } = bullet;
      const listObj = lists[listId];
      const { listProperties } = listObj;
      const { nestingLevels } = listProperties;
      const bulletStyle = {};
      const { 0: bulletObj } = nestingLevels;
      if (bulletObj.indentFirstLine) {
        bulletStyle.marginLeft = '-20pt';
        bulletStyle.marginRight = '12pt';
      }
      domBullet = <span style={bulletStyle}>●</span>;
    }
    return (
      <div style={style} key={key}>
        {domBullet}
        {elements.map((element, itemKey) =>
          renderDocElement(element, itemKey, paragraphStyle.namedStyleType),
        )}
      </div>
    );
  };
  
  const renderTableCell = (tableCell, columnStyle, key) => {
    const { content, tableCellStyle } = tableCell;
    const style = columnStyle;
    style.border = 'solid 1px black';
    if (tableCellStyle.rowSpan) {
      style.rowspan = tableCellStyle.rowSpan;
    }
    if (tableCellStyle.columnSpan) {
      style.colspan = tableCellStyle.columnSpan;
    }
    if (tableCellStyle.contentAlignment) {
      style.verticalAlign = tableCellStyle.contentAlignment;
    }
    if (tableCellStyle.backgroundColor && tableCellStyle.backgroundColor.color) {
      const { rgbColor } = tableCellStyle.backgroundColor.color;
      style.backgroundColor = `rgb(${(rgbColor.red || 0) * 255},${(rgbColor.green || 0) *
      255},${(rgbColor.blue || 0) * 255})`;
    }
    if (tableCellStyle.paddingLeft) {
      style.paddingLeft =
        tableCellStyle.paddingLeft.magnitude + tableCellStyle.paddingLeft.unit;
    }
    if (tableCellStyle.paddingRight) {
      style.paddingRight =
        tableCellStyle.paddingRight.magnitude + tableCellStyle.paddingRight.unit;
    }
    if (tableCellStyle.paddingTop) {
      style.paddingTop = tableCellStyle.paddingTop.magnitude + tableCellStyle.paddingTop.unit;
    }
    if (tableCellStyle.paddingBottom) {
      style.paddingBottom =
        tableCellStyle.paddingBottom.magnitude + tableCellStyle.paddingBottom.unit;
    }
    if (tableCellStyle.borderLeft && tableCellStyle.borderLeft.width) {
      const { rgbColor } = tableCellStyle.borderLeft.color.color;
      style.borderLeft = `${tableCellStyle.borderLeft.dashStyle} ${
        tableCellStyle.borderLeft.width.magnitude
        }${tableCellStyle.borderLeft.width.unit} rgb(${(rgbColor.red || 0) *
      255},${(rgbColor.green || 0) * 255},${(rgbColor.blue || 0) * 255})`;
    }
    if (tableCellStyle.borderRight && tableCellStyle.borderRight.width) {
      const { rgbColor } = tableCellStyle.borderRight.color.color;
      style.borderRight = `${tableCellStyle.borderRight.dashStyle} ${
        tableCellStyle.borderRight.width.magnitude
        }${tableCellStyle.borderRight.width.unit} rgb(${(rgbColor.red || 0) *
      255},${(rgbColor.green || 0) * 255},${(rgbColor.blue || 0) * 255})`;
    }
    if (tableCellStyle.borderTop && tableCellStyle.borderTop.width) {
      const { rgbColor } = tableCellStyle.borderTop.color.color;
      style.borderTop = `${tableCellStyle.borderTop.dashStyle} ${
        tableCellStyle.borderTop.width.magnitude
        }${tableCellStyle.borderTop.width.unit} rgb(${(rgbColor.red || 0) *
      255},${(rgbColor.green || 0) * 255},${(rgbColor.blue || 0) * 255})`;
    }
    if (tableCellStyle.borderBottom && tableCellStyle.borderBottom.width) {
      const { rgbColor } = tableCellStyle.borderBottom.color.color;
      style.borderBottom = `${tableCellStyle.borderBottom.dashStyle} ${
        tableCellStyle.borderBottom.width.magnitude
        }${tableCellStyle.borderBottom.width.unit} rgb(${(rgbColor.red || 0) *
      255},${(rgbColor.green || 0) * 255},${(rgbColor.blue || 0) * 255})`;
    }
    return (
      <td style={style} key={key}>
        {content.map((item, itemKey) => renderParagraph(item.paragraph, itemKey))}
      </td>
    );
  };
  
  const renderTableRow = (tableRow, columnStyles, key) => {
    const { tableCells, tableRowStyle } = tableRow;
    const style = {};
    if (tableRowStyle.minRowHeight && tableRowStyle.minRowHeight.magnitude) {
      style.minHeight =
        tableRowStyle.minRowHeight.magnitude + tableRowStyle.minRowHeight.unit;
    }
    return (
      <tr style={style} key={key}>
        {tableCells.map((tableCell, i) => renderTableCell(tableCell, columnStyles[i], i))}
      </tr>
    );
  };
  
  const renderTableElement = (tableElement, key) => {
    const { rows, tableRows, tableStyle } = tableElement;
    const columnStyles = [];
    if (tableStyle.tableColumnProperties) {
      tableStyle.tableColumnProperties.forEach(columnStyle => {
        const tempStyle = {};
        if (columnStyle.widthType) {
          // Not styled
        }
        if (columnStyle.width) {
          tempStyle.width = columnStyle.width.magnitude + columnStyle.width.unit;
        }
        columnStyles.push(tempStyle);
      });
    }
    if (rows > 0) {
      return (
        <table style={{ borderSpacing: 'unset', margin: '0 auto' }} key={key}>
          <tbody>
          {tableRows.map((tableRow, tableKey) =>
            renderTableRow(tableRow, columnStyles, tableKey),
          )}
          </tbody>
        </table>
      );
    }
  };
  
  const renderElements = (elementContainer, key) => {
    if (elementContainer.table) {
      return renderTableElement(elementContainer.table, key);
    }
    if (elementContainer.paragraph) {
      return renderParagraph(elementContainer.paragraph, key);
    }
    return null;
  };
  
  const addError = (type, message, action, context) => {
    errors.push({ type, message, action, context, key: errors.length });
  };
  
  const getSectionList = (startPos) => {
    if (startPos >= elementArr.length) {
      return {nodes: null, endPos: startPos + 1};
    }
    
    if (!elementArr[startPos] || elementArr[startPos] === 'undefined') {
      return {nodes: null, endPos: startPos + 1};
    }
    
    const headingNum = getHeadingNum(elementArr[startPos]);
    let endPos = startPos + 1;
    let tmpHeadingNum = -1;
    let nodes = [];
    if (headingNum > 0) {
      while ((tmpHeadingNum === -1 || tmpHeadingNum > headingNum) && endPos < elementArr.length) {
        tmpHeadingNum = getHeadingNum(elementArr[endPos]);
        if (tmpHeadingNum > 0) {
          if (tmpHeadingNum <= headingNum) {
            break;
          }
          let children = getSectionList(endPos);
          let twig = {
            id: endPos,
            title: elementArr[endPos].paragraph.elements[0].textRun.content,
            type: 'slide',
            level: tmpHeadingNum,
            html: '',
            wordCount: 100,
            slides: children && children.nodes
          };
          if (children) {
            endPos = children.endPos;
            nodes.push(twig);
          }
        } else {
          const child = getSectionList(endPos);
          const text = elementArr[endPos].paragraph &&
            elementArr[endPos].paragraph.elements[0] &&
            elementArr[endPos].paragraph.elements[0].textRun &&
            elementArr[endPos].paragraph.elements[0].textRun.content;
          const videoStarted = text && text.indexOf('[VIDEOHEADER]') >= 0;
          const videoEnded = text && text.indexOf('[VIDEOBOTTOM]') >= 0;
          const questionStarted = text && text.indexOf('[QUESTIONHEADER]') >= 0;
          const questionEnded = text && text.indexOf('[QUESTIONBOTTOM]') >= 0;
          const slideCut = text && text.indexOf('[SLIDECUT]') >= 0;
          if (!videoStarted && !videoEnded && !questionStarted && !questionEnded && !slideCut) {
            let leaf = {
              id: endPos,
              title: '',
              type: 'slide',
              html: child.nodes,
              text: text,
              wordCount: text ? text.split(/\s+/).length : 0,
            };
            nodes.push(leaf);
          }
          endPos = child.endPos;
        }
      }
    } else {
      return {nodes: renderElements(elementArr[startPos], 'leaf'), endPos};
    }
    return {nodes, endPos};
  };
  
  const getSections = () => {
    let curBlock = '';
    let curType = 2;
    let curTitle = '';
    let curBlockStrLength = 0;
    let curSlideStrLength = 0;
    let curQuestionCount = 0;
    sectionBlocks = [];
    let isFirstVideoHeader = 0;
    let isBlockFinished = false;
    
    for (let i = 0; i < elementArr.length; i += 1) {
      const element = elementArr[i];
      const tempBlock = renderElements(element, i);
      const elementStr = element.paragraph ? JSON.stringify(element.paragraph.elements) : '';
      const elementStyle =
        element.paragraph && element.paragraph.paragraphStyle.namedStyleType
          ? element.paragraph.paragraphStyle.namedStyleType
          : '';
      const nextElementStr =
        elementArr[i + 1] && elementArr[i + 1].paragraph
          ? JSON.stringify(elementArr[i + 1].paragraph.elements)
          : '';
      const nextElementStyle =
        elementArr[i + 1] &&
        elementArr[i + 1].paragraph &&
        elementArr[i + 1].paragraph.paragraphStyle.namedStyleType
          ? elementArr[i + 1].paragraph.paragraphStyle.namedStyleType
          : '';
      
      if (tempBlock) {
        const videoStarted = elementStr.indexOf('[VIDEOHEADER]') !== -1;
        const videoEnded = elementStr.indexOf('[VIDEOBOTTOM]') !== -1;
        const questionStarted = elementStr.indexOf('[QUESTIONHEADER]') !== -1;
        const questionEnded = elementStr.indexOf('[QUESTIONBOTTOM]') !== -1;
        const slideCut = elementStr.indexOf('[SLIDECUT]') !== -1;
        const curText =
          element.paragraph &&
          element.paragraph.elements[0].textRun &&
          element.paragraph.elements[0].textRun.content
            ? element.paragraph.elements[0].textRun.content
            : '';
        
        if (videoStarted) {
          /**
           * H1 followed by VIDEOHEADER inspection
           */
          if (nextElementStyle.indexOf('HEADING_1') === -1) {
            addError('Heading', 'H1 required after VIDEOHEADER', 'hard', curTitle);
            break;
          }
          
          // video section start
          curType = 0;
          isFirstVideoHeader += 1;
          isBlockFinished = false;
          curSlideStrLength = 0;
          curTitle = '';
        } else if (videoEnded) {
          /**
           * SLIDECUT after VIDEOBOTTOM inspection
           */
          if (nextElementStr.indexOf('[SLIDECUT]') === -1 && isFirstVideoHeader > 1) {
            addError(
              'Tag',
              '[SLIDECUT] must exist after [VIDEOBOTTOM].',
              'hard',
              curTitle,
            );
            break;
          }
          
          // video section end
          sectionBlocks = [
            ...sectionBlocks,
            { title: curTitle, content: curBlock, type: 'video' },
          ];
          curBlock = [];
          curBlockStrLength = 0;
          isBlockFinished = true;
        } else if (questionStarted) {
          // question section start
          curType = 1;
          curTitle = '';
          curSlideStrLength = 0;
          curQuestionCount = 0;
          isBlockFinished = false;
        } else if (questionEnded) {
          /**
           * SLIDECUT after QUESTIONBOTTOM inspection
           */
          if (nextElementStr.indexOf('[SLIDECUT]') === -1) {
            addError(
              'Tag',
              '[SLIDECUT] must exist after [QUESTIONBOTTOM].',
              'hard',
              curTitle,
            );
            break;
          }
          /**
           * question content inspection
           */
          if (curQuestionCount < 4) {
            const { table } = elementArr[i - 1];
            if (!table || (table && table.tableRows[0].tableCells.length < 4)) {
              addError(
                'Question',
                'Questions must have at minimum: Question name, question text, a correct answer, and a wrong answer.',
                'hard',
                curTitle,
              );
              break;
            }
          }
          
          // question section end
          sectionBlocks = [
            ...sectionBlocks,
            { title: curTitle, content: curBlock, type: 'question' },
          ];
          curBlock = [];
          curBlockStrLength = 0;
          isBlockFinished = true;
        } else if (slideCut) {
          // section end
          if (curType === 2) {
            // end of slide section
            isBlockFinished = true;
            sectionBlocks = [
              ...sectionBlocks,
              { title: curTitle, content: curBlock, type: 'slide' },
            ];
            curBlock = [];
          } else if (curType === 0 && !isBlockFinished) {
            addError('Tag', '[VIDEOBOTTOM] is required', 'hard', curTitle);
            break;
          } else if (curType === 1 && !isBlockFinished) {
            addError('Tag', '[QUESTIONBOTTOM] is required', 'hard', curTitle);
            break;
          }
          
          if (
            nextElementStr &&
            nextElementStyle.indexOf('HEADING_1') === -1 &&
            nextElementStr.indexOf('QUESTIONHEADER') === -1 &&
            nextElementStr.indexOf('VIDEOHEADER') === -1
          ) {
            addError('Heading', 'H1 required after SLIDECUT', 'hard', curTitle);
            break;
          }
          curTitle = '';
          curType = 2;
        } else {
          if (curTitle === '') {
            // Start of new section
            if (element.paragraph) {
              curTitle = curText;
              curSlideStrLength = 0;
            }
          }
          curBlockStrLength += curText.length;
          curBlock = [...curBlock, tempBlock];
          
          if (curType === 2) {
            if (curBlockStrLength >= 30000) {
              addError(
                'Section',
                'Slide section must not contain more than 30000 characters',
                'soft',
                curTitle,
              );
            } else if (elementStyle.indexOf('HEADING') === -1) {
              curSlideStrLength += curText.length;
              if (curSlideStrLength > 3000) {
                addError(
                  'Slide',
                  'Length of text between two headings in slide section must not be greater than 3000',
                  'soft',
                  curTitle,
                );
              }
            }
          }
        }
        
        if (elementStyle.indexOf('HEADING') !== -1) {
          curSlideStrLength = 0;
          if (curText.length > 150) {
            addError(
              'Heading',
              'Headings must not contain more than 150 characters',
              'soft',
              curTitle,
            );
          }
        }
        if (nextElementStyle.indexOf('HEADING') !== -1) {
          const nextHeadingType = nextElementStyle.substr('-1');
          const headingType = elementStyle.substr('-1') || 0;
          if (nextHeadingType === 1) {
            if (!slideCut && !videoStarted) {
              addError(
                'Heading',
                'H1 must be followed by VIDEOHEADER or SLIDECUT',
                'hard',
                curTitle,
              );
              break;
            }
          }
          if (elementStyle.indexOf('HEADING') !== -1 && headingType > nextHeadingType) {
            addError(
              'Heading',
              `Headings must cascade: ${nextElementStyle} after ${elementStyle}.`,
              'hard',
              curTitle,
            );
            break;
          }
        }
      }
    }
  };
  
  console.time('ParsingDocContent');
  const frameStyle = getFrameStyle(documentStyle);
  namedStyles = getNamedStyle(namedStyles);
  getSections();
  console.timeEnd('ParsingDocContent');
  
  // get section list structure
  console.time('building structure');
  let node = {};
  let pos = 0;
  // make sure that the document starts with heading - ignore objects at the start of document which are none heading
  while (getHeadingNum(elementArr[pos]) === -1) {
    pos++;
  }
  
  do {
    node = getSectionList(pos);
    sectionList.sections.push({
      id: pos,
      title: elementArr[pos].paragraph && elementArr[pos].paragraph.elements[0].textRun.content,
      level: 1,
      slides: node.nodes
    });
    pos = node.endPos;
  } while (getHeadingNum(elementArr[pos]) === 1);
  console.timeEnd('building structure');
  
  return {
    docSections: sectionBlocks,
    docSectionList: sectionList,
    docFrameStyle: frameStyle,
    errors,
    totalElementCount: elementArr.length
  };
};
