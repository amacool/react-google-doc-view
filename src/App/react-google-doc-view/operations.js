const getNamedStyle = styles => {
    const namedStyles = {};
    styles.forEach(item => {
        namedStyles[item.namedStyleType] = {
            textStyle: item.textStyle,
            paraStyle: item.paragraphStyle,
        };
    });
    return namedStyles;
};

const getFrameStyle = documentStyle => {
    const {
        background,
        marginTop,
        marginBottom,
        marginRight,
        marginLeft,
        pageSize,
    } = documentStyle;
    const frameStyle = {};
    if (background) {
        const { color } = background;
        if (color && color.rgbColor) {
            const { rgbColor } = color;
            frameStyle.backgroundColor = `rgb(${(rgbColor.red || 0) * 255},${(rgbColor.green || 0) *
                255},${(rgbColor.blue || 0) * 255})`;
        }
    }
    if (marginTop) {
        const { magnitude, unit } = marginTop;
        frameStyle.marginTop = magnitude + unit;
    }
    if (marginBottom) {
        const { magnitude, unit } = marginBottom;
        frameStyle.marginBottom = magnitude + unit;
    }
    if (marginLeft) {
        const { magnitude, unit } = marginLeft;
        frameStyle.marginLeft = magnitude + unit;
    }
    if (marginRight) {
        const { magnitude, unit } = marginRight;
        frameStyle.marginRight = magnitude + unit;
    }
    if (pageSize) {
        const { height, width } = pageSize;
        if (height) {
            const { magnitude, unit } = height;
            frameStyle.height = magnitude + unit;
        }
        if (width) {
            const { magnitude, unit } = width;
            frameStyle.width =
                magnitude - (marginLeft.magnitude || 0) - (marginRight.magnitude || 0) + unit;
        }
    }
    return frameStyle;
};

// get border style of paragraph
const getBorderStyle = border => {
    const { color, width, dashStyle } = border;
    const { rgbColor } = color.color;
    return `${dashStyle} ${width.magnitude}${width.unit}rgb(${(rgbColor.red || 0) *
        255},${(rgbColor.green || 0) * 255},${(rgbColor.blue || 0) * 255})`;
};

const getTextStyle = textStyle => {
    const style = {};
    if (textStyle.bold) {
        style.fontWeight = 'bold';
    }
    if (textStyle.fontSize && textStyle.fontSize !== {}) {
        style.fontSize = textStyle.fontSize.magnitude + textStyle.fontSize.unit;
    }
    if (textStyle.foregroundColor && textStyle.foregroundColor !== {}) {
        const { rgbColor } = textStyle.foregroundColor.color;
        style.color = `rgb(${(rgbColor.red || 0) * 255},${(rgbColor.green || 0) *
            255},${(rgbColor.blue || 0) * 255})`;
    }
    if (
        textStyle.backgroundColor &&
        textStyle.backgroundColor.color &&
        textStyle.backgroundColor.color.rgbColor
    ) {
        const { rgbColor } = textStyle.backgroundColor.color;
        style.backgroundColor = `rgb(${(rgbColor.red || 0) * 255},${(rgbColor.green || 0) *
            255},${(rgbColor.blue || 0) * 255})`;
    }
    if (textStyle.underline) {
        style.textDecoration = 'underline';
    }
    if (textStyle.italic) {
        style.fontStyle = 'italic';
    }
    if (textStyle.strikethrough) {
        style.textDecoration = 'line-through';
    }
    if (textStyle.weightedFontFamily && textStyle.weightedFontFamily !== {}) {
        style.fontFamily = textStyle.weightedFontFamily.fontFamily;
        style.fontWeight = textStyle.weightedFontFamily.fontWeight;
    }
    if (textStyle.baselineOffset) {
        // baselineOffset
    }
    return style;
};

const getHeadingNum = (element) => {
  if (!element) return -1;
  const elementStyle =
    element.paragraph && element.paragraph.paragraphStyle.namedStyleType
      ? element.paragraph.paragraphStyle.namedStyleType
      : '';
  for (let k = 1; k < 7; k++) {
    if (elementStyle.indexOf(`HEADING_${k}`) >= 0) {
      return k;
    }
  }
  return -1;
};

export { getNamedStyle, getFrameStyle, getBorderStyle, getTextStyle, getHeadingNum };
