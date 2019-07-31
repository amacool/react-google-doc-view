import React, {Component} from "react";
import {getFrameStyle, getNamedStyle, getBorderStyle, getTextStyle} from "./GetStyle";

class DocViewFrame extends Component {
  constructor(props) {
    super(props);
    this.elementArr = this.props.data.result.body.content;
    this.documentStyle = this.props.data.result.documentStyle;
    this.namedStyles = this.props.data.result.namedStyles.styles;
    this.inlineObjects = this.props.data.result.inlineObjects;
    this.lists = this.props.data.result.lists;
    // this.elementArr = data1.body.content;
    // this.documentStyle = data1.documentStyle;
    // this.namedStyles = data1.namedStyles.styles;
    // this.inlineObjects = data1.inlineObjects;
    // this.lists = data1.lists;
  }
  
  componentDidMount() {
    this.frameStyle = getFrameStyle(this.documentStyle);
    this.namedStyles = getNamedStyle(this.namedStyles);
    this.getSectionBlocks();
  }
  
  getSectionBlocks = () => {
    let curBlock = '';
    let curType = 2;  // start with slide section
    let curTitle = '';
    let sectionBlocks = [];
    this.elementArr.forEach((element, key) => {
      let tempBlock = this.renderElements(element, key);
      let elementStr = element.paragraph ? JSON.stringify(element.paragraph.elements) : '';
      
      if (tempBlock) {
        if (elementStr.indexOf('[VIDEOHEADER]') >= 0) {
          // video section start
          curType = 0;
          curBlock = '';
        } else if (elementStr.indexOf('[VIDEOBOTTOM]') >= 0) {
          // video section end
          sectionBlocks = [...sectionBlocks, {title: curTitle, content: curBlock, type: 'video'}];
          curBlock = '';
          curTitle = '';
        } else if (elementStr.indexOf('[QUESTIONHEADER]') >= 0) {
          // question section start
          curType = 1;
          curBlock = '';
        } else if (elementStr.indexOf('[QUESTIONBOTTOM]') >= 0) {
          // question section end
          sectionBlocks = [...sectionBlocks, {title: curTitle, content: curBlock, type: 'question'}];
          curBlock = '';
          curTitle = '';
        } else if (elementStr.indexOf('[SLIDECUT]') >= 0) {
          // end of section - video, question, slide
          if (curType === 2) {
            // this is the end of slide section
            sectionBlocks = [...sectionBlocks, {title: curTitle, content: curBlock, type: 'slide'}];
          } else if (curType === 0) {
            sectionBlocks = [...sectionBlocks, {title: curTitle, content: curBlock, type: 'video'}];
          } else if (curType === 1) {
            sectionBlocks = [...sectionBlocks, {title: curTitle, content: curBlock, type: 'question'}];
          }
          curTitle = '';
          curType = 2;  // type initialize
        } else {
          if (curTitle === '') {
            // this is the start of new section - catch section title here
            if (element.paragraph) {
              curTitle = element.paragraph.elements[0].textRun && element.paragraph.elements[0].textRun.content;
            }
          }
          curBlock = [...curBlock, tempBlock];
        }
      }
    });
    this.props.getSections({sectionBlocks, docFrameStyle: this.frameStyle});
  };
  
  renderTextElement = (textElement, key) => {
    const {content, textStyle} = textElement;
    let renderElement = null;
    let style = getTextStyle(textStyle);
    
    if (textStyle.link && textStyle.link !== {}) {
      renderElement = <a href={textStyle.link.url} key={key} style={style}>{content}</a>;
    } else {
      renderElement = <span style={style} key={key}>{content}</span>;
    }
    return renderElement;
  };
  
  renderObjectElement = (objElement, key) => {
    if (objElement.inlineObjectId) {
      const {inlineObjectId, textStyle} = objElement;
      let object = this.inlineObjects[inlineObjectId].inlineObjectProperties.embeddedObject;
      let objStyle = {};
      let src = null;
  
      if (textStyle) {
        objStyle = getTextStyle(textStyle);
      }
      if (object.imageProperties) {
        src = object.imageProperties.contentUri;
      }
      if (object.embeddedObjectBorder) {
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
      return <img src={src} key={key} style={objStyle} alt='' />;
    } else {
      return null;
    }
  };
  
  renderDocElement = (element, key) => {
    if (element.inlineObjectElement) {
      return this.renderObjectElement(element.inlineObjectElement, key);
    } else if(element.textRun) {
      return this.renderTextElement(element.textRun, key);
    }
  };
  
  renderTableCell = (tableCell, columnStyle, key) => {
    const {content, tableCellStyle} = tableCell;
    let style = columnStyle;
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
      let rgbColor = tableCellStyle.backgroundColor.color.rgbColor;
      style.backgroundColor = 'rgb(' + (rgbColor.red || 0)*255 + ',' + (rgbColor.green || 0)*255 + ',' + (rgbColor.blue || 0)*255 + ')';
    }
    if (tableCellStyle.paddingLeft) {
      style.paddingLeft = tableCellStyle.paddingLeft.magnitude + tableCellStyle.paddingLeft.unit;
    }
    if (tableCellStyle.paddingRight) {
      style.paddingRight = tableCellStyle.paddingRight.magnitude + tableCellStyle.paddingRight.unit;
    }
    if (tableCellStyle.paddingTop) {
      style.paddingTop = tableCellStyle.paddingTop.magnitude + tableCellStyle.paddingTop.unit;
    }
    if (tableCellStyle.paddingBottom) {
      style.paddingBottom = tableCellStyle.paddingBottom.magnitude + tableCellStyle.paddingBottom.unit;
    }
    if (tableCellStyle.borderLeft && tableCellStyle.borderLeft.width) {
      let rgbColor = tableCellStyle.borderLeft.color.color.rgbColor;
      style.borderLeft = `${tableCellStyle.borderLeft.dashStyle} ${tableCellStyle.borderLeft.width.magnitude}${tableCellStyle.borderLeft.width.unit} rgb(${(rgbColor.red || 0)*255},${(rgbColor.green || 0)*255},${(rgbColor.blue || 0)*255})`;
    }
    if (tableCellStyle.borderRight && tableCellStyle.borderRight.width) {
      let rgbColor = tableCellStyle.borderRight.color.color.rgbColor;
      style.borderRight = `${tableCellStyle.borderRight.dashStyle} ${tableCellStyle.borderRight.width.magnitude}${tableCellStyle.borderRight.width.unit} rgb(${(rgbColor.red || 0)*255},${(rgbColor.green || 0)*255},${(rgbColor.blue || 0)*255})`;
    }
    if (tableCellStyle.borderTop && tableCellStyle.borderTop.width) {
      let rgbColor = tableCellStyle.borderTop.color.color.rgbColor;
      style.borderTop = `${tableCellStyle.borderTop.dashStyle} ${tableCellStyle.borderTop.width.magnitude}${tableCellStyle.borderTop.width.unit} rgb(${(rgbColor.red || 0)*255},${(rgbColor.green || 0)*255},${(rgbColor.blue || 0)*255})`;
    }
    if (tableCellStyle.borderBottom && tableCellStyle.borderBottom.width) {
      let rgbColor = tableCellStyle.borderBottom.color.color.rgbColor;
      style.borderBottom = `${tableCellStyle.borderBottom.dashStyle} ${tableCellStyle.borderBottom.width.magnitude}${tableCellStyle.borderBottom.width.unit} rgb(${(rgbColor.red || 0)*255},${(rgbColor.green || 0)*255},${(rgbColor.blue || 0)*255})`;
    }
    return <td style={style} key={key}>{content.map((item, key) => this.renderParagraph(item.paragraph, key))}</td>;
  };
  
  renderTableRow = (tableRow, columnStyles, key) => {
    const {tableCells, tableRowStyle} = tableRow;
    let style = {};
    if (tableRowStyle.minRowHeight && tableRowStyle.minRowHeight.magnitude) {
      style.minHeight = tableRowStyle.minRowHeight.magnitude + tableRowStyle.minRowHeight.unit;
    }
    return <tr style={style} key={key}>
      {tableCells.map((tableCell, i) => this.renderTableCell(tableCell, columnStyles[i], i))}
    </tr>;
  };
  
  renderTableElement = (tableElement, key) => {
    const {rows, tableRows, tableStyle} = tableElement;
    let columnStyles = [];
    if (tableStyle.tableColumnProperties) {
      tableStyle.tableColumnProperties.forEach(columnStyle => {
        let tempStyle = {};
        if (columnStyle.widthType) {
        
        }
        if (columnStyle.width) {
          tempStyle.width = columnStyle.width.magnitude + columnStyle.width.unit;
        }
        columnStyles.push(tempStyle);
      });
    }
    if (rows > 0) {
      return <table style={{borderSpacing: 'unset', margin: '0 auto'}} key={key}>
        <tbody>{tableRows.map((tableRow, key) => this.renderTableRow(tableRow, columnStyles, key))}</tbody>
      </table>;
    }
  };

  renderParagraph = (paragraph, key) => {
    const {elements, paragraphStyle, bullet} = paragraph;
    let style = {};
    
    if (paragraphStyle.namedStyleType && this.namedStyles[paragraphStyle.namedStyleType]) {
      // getting named style
      let {textStyle, paraStyle} = this.namedStyles[paragraphStyle.namedStyleType];
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
      if (paraStyle.spaceAbove && paraStyle.spaceAbove.magnitude && paraStyle.spaceAbove.unit) {
        style.marginTop = paraStyle.spaceAbove.magnitude + paraStyle.spaceAbove.unit;
      }
      if (paraStyle.spaceBelow && paraStyle.spaceBelow.magnitude && paraStyle.spaceBelow.unit) {
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
      style.lineHeight = paragraphStyle.lineSpacing/100;
    }
    if (paragraphStyle.direction) {
      style.direction = paragraphStyle.direction === 'LEFT_TO_RIGHT' ? 'ltr' : 'rtl';
    }
    if (paragraphStyle.spaceAbove && paragraphStyle.spaceAbove.magnitude && paragraphStyle.spaceAbove.unit) {
      style.marginTop = (paragraphStyle.spaceAbove.magnitude || 0) + paragraphStyle.spaceAbove.unit;
    }
    if (paragraphStyle.spaceBelow && paragraphStyle.spaceBelow.magnitude && paragraphStyle.spaceAbove.unit) {
      style.marginBottom = (paragraphStyle.spaceBelow.magnitude || 0) + paragraphStyle.spaceAbove.unit;
    }
    if (paragraphStyle.alignment) {
      style.textAlign = paragraphStyle.alignment;
      if (paragraphStyle.alignment === 'JUSTIFIED')
        style.textAlign = 'justify';
    }
    if (paragraphStyle.keepLinesTogether) {
      // keep lines together
    }
    if (paragraphStyle.keepWithNext) {
      // display paragraph in one page
    }
    if (paragraphStyle.avoidWidowAndOrphan) {
      // paragraph opening, ending lines control
    }
    if (paragraphStyle.indentFirstLine && paragraphStyle.indentFirstLine && paragraphStyle.indentFirstLine.unit) {
      // let magnitude = (paragraphStyle.indentFirstLine.magnitude || 0) + paragraphStyle.indentFirstLine.unit;
    }
    if (paragraphStyle.indentStart && paragraphStyle.indentStart.magnitude && paragraphStyle.indentStart.unit) {
      style.paddingLeft = (paragraphStyle.indentStart.magnitude || 0) + paragraphStyle.indentStart.unit;
    }
    
    let domBullet = null;
    if (bullet) {
      const {listId} = bullet;
      let bulletObj = this.lists[listId];
      let bulletStyle = {};
      bulletObj = bulletObj.listProperties.nestingLevels[0];
      if (bulletObj.indentFirstLine) {
        bulletStyle.marginLeft = '-20pt';
        bulletStyle.marginRight = '12pt';
      }
      domBullet = <span style={bulletStyle}>●</span>;
    }
    return (
      <div style={style} key={key}>
        {domBullet}
        {elements.map((element, key) => this.renderDocElement(element, key))}
      </div>
    )
  };
  
  renderElements = (elementContainer, key) => {
    if (elementContainer.table) {
      return this.renderTableElement(elementContainer.table, key);
    } else if (elementContainer.paragraph) {
      return this.renderParagraph(elementContainer.paragraph, key);
    } else {
      return null;
    }
  };
  
  render() {
    return null;
  }
}

export default DocViewFrame;