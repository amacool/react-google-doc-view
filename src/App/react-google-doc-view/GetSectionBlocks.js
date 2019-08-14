import React from 'react';
import { getFrameStyle, getNamedStyle, getBorderStyle, getTextStyle } from './GetStyle';

export const getSectionBlocks = data => {
    const elementArr = data.body.content;
    const { documentStyle } = data;
    let namedStyles = data.namedStyles.styles;
    const { inlineObjects } = data;
    const { lists } = data;
    let sectionBlocks = [];
    const errors = [];

    const renderTextElement = (textElement, key, namedStyletype) => {
        const { content, textStyle } = textElement;
        let renderElement = null;
        const style = getTextStyle(textStyle);

        if (textStyle.link && textStyle.link !== {}) {
            renderElement = (
                <a href={textStyle.link.url} key={key} style={style}>
                    {content}
                </a>
            );
        } else if (namedStyletype === 'HEADING_1')
            renderElement = (
                <h1 style={style} key={key}>
                    {content}
                </h1>
            );
        else if (namedStyletype === 'HEADING_2')
            renderElement = (
                <h2 style={style} key={key}>
                    {content}
                </h2>
            );
        else if (namedStyletype === 'HEADING_3')
            renderElement = (
                <h3 style={style} key={key}>
                    {content}
                </h3>
            );
        else if (namedStyletype === 'HEADING_4')
            renderElement = (
                <h4 style={style} key={key}>
                    {content}
                </h4>
            );
        else if (namedStyletype === 'HEADING_5')
            renderElement = (
                <h5 style={style} key={key}>
                    {content}
                </h5>
            );
        else if (namedStyletype === 'HEADING_6')
            renderElement = (
                <h6 style={style} key={key}>
                    {content}
                </h6>
            );
        else
            renderElement = (
                <span style={style} key={key}>
                    {content}
                </span>
            );
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

    const renderDocElement = (element, key, namedStyletype) => {
        if (element.inlineObjectElement) {
            return renderObjectElement(element.inlineObjectElement, key);
        }
        if (element.textRun) {
            return renderTextElement(element.textRun, key, namedStyletype);
        }
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
                {content.map((item, key) => renderParagraph(item.paragraph, key))}
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

    const renderParagraph = (paragraph, key) => {
        const { elements, paragraphStyle, bullet } = paragraph;
        let style = {};

        if (paragraphStyle.namedStyleType && namedStyles[paragraphStyle.namedStyleType]) {
            // getting named style
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
            // display paragraph in one page
        }
        if (paragraphStyle.avoidWidowAndOrphan) {
            // paragraph opening, ending lines control
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
                {elements.map((element, key) =>
                    renderDocElement(element, key, paragraphStyle.namedStyleType),
                )}
            </div>
        );
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
        errors.push({ type, message, action, context });
    };

    const getSections = () => {
        let curBlock = '';
        let curType = 2; // start with slide section
        let curTitle = '';
        let curBlockStrLength = 0;
        let curSlideStrLength = 0;
        let curQuestionCount = 0;
        sectionBlocks = [];
        let isFirstVideoHeader = 0;
        let isBlockFinished = false;

        for (let i = 0; i < elementArr.length; i++) {
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
                const videoStarted = elementStr.indexOf('[VIDEOHEADER]') >= 0;
                const videoEnded = elementStr.indexOf('[VIDEOBOTTOM]') >= 0;
                const questionStarted = elementStr.indexOf('[QUESTIONHEADER]') >= 0;
                const questionEnded = elementStr.indexOf('[QUESTIONBOTTOM]') >= 0;
                const slideCut = elementStr.indexOf('[SLIDECUT]') >= 0;
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
                    if (nextElementStyle.indexOf('HEADING_1') < 0) {
                        addError(
                            'Heading',
                            'H1 does not exist right after VIDEOHEADER.',
                            'hard',
                            curTitle,
                        );
                        break;
                    }

                    // video section start
                    curType = 0;
                    isFirstVideoHeader++;
                    isBlockFinished = false;
                    curSlideStrLength = 0;
                    curTitle = '';
                } else if (videoEnded) {
                    /**
                     * SLIDECUT after VIDEOBOTTOM inspection
                     */
                    if (nextElementStr.indexOf('[SLIDECUT]') < 0 && isFirstVideoHeader > 1) {
                        addError(
                            'Tag',
                            '[SLIDECUT] does not exist after [VIDEOBOTTOM].',
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
                    if (nextElementStr.indexOf('[SLIDECUT]') < 0) {
                        addError(
                            'Tag',
                            '[SLIDECUT] does not exist after [QUESTIONBOTTOM].',
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
                        if (table) {
                            if (table.tableRows[0].tableCells.length < 4) {
                                addError(
                                    'Question',
                                    'A question must have at minimum: Question Name, Question text, a Correct answer, and a Wrong answer.',
                                    'hard',
                                    curTitle,
                                );
                                break;
                            }
                        } else {
                            addError(
                                'Question',
                                'A question must have at minimum: Question Name, Question text, a Correct answer, and a Wrong answer.',
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
                    // end of section - video, question, slide
                    if (curType === 2) {
                        // this is the end of slide section
                        isBlockFinished = true;
                        sectionBlocks = [
                            ...sectionBlocks,
                            { title: curTitle, content: curBlock, type: 'slide' },
                        ];
                        curBlock = [];
                    } else if (curType === 0 && !isBlockFinished) {
                        /**
                         * VIDEOHEADER, VIDEOBOTTOM matching inspection
                         */
                        addError('Tag', '[VIDEOBOTTOM] does not exist.', 'hard', curTitle);
                        break;
                    } else if (curType === 1 && !isBlockFinished) {
                        /**
                         * QUESTIONHEADER, QUESTIONBOTTOM matching inspection
                         */
                        addError('Tag', '[QUESTIONBOTTOM] does not exist.', 'hard', curTitle);
                        break;
                    }
                    /**
                     *  h1 after SLIDECUT inspection
                     */
                    if (
                        nextElementStr &&
                        nextElementStyle.indexOf('HEADING_1') < 0 &&
                        nextElementStr.indexOf('QUESTIONHEADER') < 0 &&
                        nextElementStr.indexOf('VIDEOHEADER') < 0
                    ) {
                        addError('Heading', 'H1 does not exist after SLIDECUT.', 'hard', curTitle);
                        break;
                    }
                    curTitle = '';
                    curType = 2; // type initialization
                } else {
                    if (curTitle === '') {
                        // this is the start of new section - catch section title here
                        if (element.paragraph) {
                            curTitle = curText;
                            curSlideStrLength = 0;
                        }
                    }
                    curBlockStrLength += curText.length;
                    curBlock = [...curBlock, tempBlock];

                    /**
                     *  slide section total text length, text length between headings inspection
                     */
                    if (curType === 2) {
                        if (curBlockStrLength >= 30000) {
                            addError(
                                'Section',
                                'Slide section contains more than 30000 characters.',
                                'soft',
                                curTitle,
                            );
                        } else if (elementStyle.indexOf('HEADING') < 0) {
                            // not heading, count normal text length
                            curSlideStrLength += curText.length;
                            if (curSlideStrLength > 3000) {
                                addError(
                                    'Slide',
                                    'Length of text between two headings in slide section cannot be longer than 3000.',
                                    'soft',
                                    curTitle,
                                );
                            }
                        }
                    }
                }

                /**
                 * Heading Exception inspection
                 */
                if (elementStyle.indexOf('HEADING') >= 0) {
                    curSlideStrLength = 0;
                    if (curText.length > 150) {
                        addError(
                            'Heading',
                            'Heading contains more than 150 characters.',
                            'soft',
                            curTitle,
                        );
                    }
                }
                if (nextElementStyle.indexOf('HEADING') >= 0) {
                    const nextHeadingType = nextElementStyle.substr('-1');
                    const headingType = elementStyle.substr('-1') || 0;
                    if (nextHeadingType === 1) {
                        if (!slideCut && !videoStarted) {
                            addError(
                                'Heading',
                                'H1 can only be followed by VIDEOHEADER or SLIDECUT.',
                                'hard',
                                curTitle,
                            );
                            break;
                        }
                    }
                    if (elementStyle.indexOf('HEADING') >= 0 && headingType > nextHeadingType) {
                        addError(
                            'Heading',
                            `Headings need to cascade: ${nextElementStyle} after ${elementStyle}.`,
                            'hard',
                            curTitle,
                        );
                        break;
                    }
                }
            }
        }
    };

    const frameStyle = getFrameStyle(documentStyle);
    namedStyles = getNamedStyle(namedStyles);
    getSections();
    return { docSections: sectionBlocks, docFrameStyle: frameStyle, errors };
};
