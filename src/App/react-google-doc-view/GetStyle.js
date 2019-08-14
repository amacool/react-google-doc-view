const getNamedStyle = (styles) => {
  let namedStyles = {};
  styles.forEach(item => {
    namedStyles[item.namedStyleType] = {
      textStyle: item.textStyle,
      paraStyle: item.paragraphStyle
    };
  });
  return namedStyles;
};

const getFrameStyle = (documentStyle) => {
  const {background, marginTop, marginBottom, marginRight, marginLeft, pageSize} = documentStyle;
  let frameStyle = {};
  if (background) {
    const {color} = background;
    if (color && color.rgbColor) {
      const rgbColor = color.rgbColor;
      frameStyle.backgroundColor = 'rgb(' + (rgbColor.red || 0)*255 + ',' + (rgbColor.green || 0)*255 + ',' + (rgbColor.blue || 0)*255 + ')';
    }
  }
  if (marginTop) {
    const {magnitude, unit} = marginTop;
    frameStyle.marginTop = magnitude + unit;
  }
  if (marginBottom) {
    const {magnitude, unit} = marginBottom;
    frameStyle.marginBottom = magnitude + unit;
  }
  if (marginLeft) {
    const {magnitude, unit} = marginLeft;
    frameStyle.marginLeft = magnitude + unit;
  }
  if (marginRight) {
    const {magnitude, unit} = marginRight;
    frameStyle.marginRight = magnitude + unit;
  }
  if (pageSize) {
    const {height, width} = pageSize;
    if (height) {
      const {magnitude, unit} = height;
      frameStyle.height = magnitude + unit;
    }
    if (width) {
      const {magnitude, unit} = width;
      frameStyle.width = (magnitude - (marginLeft.magnitude || 0) - (marginRight.magnitude || 0)) + unit;
    }
  }
  return frameStyle;
};

// get border style of paragraph
const getBorderStyle = (border) => {
  const {color, width, dashStyle} = border;
  const rgbColor = color.color.rgbColor;
  return dashStyle + ' ' + width.magnitude + width.unit + 'rgb(' + (rgbColor.red || 0)*255 + ',' + (rgbColor.green || 0)*255 + ',' + (rgbColor.blue || 0)*255 + ')';
};

const getTextStyle = (textStyle) => {
  let style = {};
  if (textStyle.bold) {
    style.fontWeight = 'bold';
  }
  if (textStyle.fontSize && textStyle.fontSize !== {}) {
    style.fontSize = textStyle.fontSize.magnitude + textStyle.fontSize.unit;
  }
  if (textStyle.foregroundColor && textStyle.foregroundColor !== {}) {
    let rgbColor = textStyle.foregroundColor.color.rgbColor;
    style.color = 'rgb(' + (rgbColor.red || 0)*255 + ',' + (rgbColor.green || 0)*255 + ',' + (rgbColor.blue || 0)*255 + ')';
  }
  if (textStyle.backgroundColor && textStyle.backgroundColor.color && textStyle.backgroundColor.color.rgbColor ) {
    let rgbColor = textStyle.backgroundColor.color.rgbColor;
    style.backgroundColor = 'rgb(' + (rgbColor.red || 0)*255 + ',' + (rgbColor.green || 0)*255 + ',' + (rgbColor.blue || 0)*255 + ')';
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

export {getNamedStyle, getFrameStyle, getBorderStyle, getTextStyle};