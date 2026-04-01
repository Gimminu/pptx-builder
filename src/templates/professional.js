/**
 * Professional Template
 * Clean, modern design for business presentations
 */

export const colors = {
  primary: '1e40af',      // Deep blue
  secondary: '3b82f6',    // Bright blue
  accent: '60a5fa',       // Light blue
  text: {
    primary: '1e293b',    // Dark slate
    secondary: '475569',  // Medium slate
    light: 'ffffff'       // White
  },
  background: {
    main: 'ffffff',       // White
    accent: 'f1f5f9',     // Light gray
    dark: '0f172a'        // Very dark blue
  }
};

export const fonts = {
  title: {
    face: 'Arial',
    size: 44,
    bold: true,
    color: colors.text.primary
  },
  heading: {
    face: 'Arial',
    size: 32,
    bold: true,
    color: colors.primary
  },
  subheading: {
    face: 'Arial',
    size: 24,
    bold: false,
    color: colors.text.secondary
  },
  body: {
    face: 'Arial',
    size: 18,
    bold: false,
    color: colors.text.primary
  },
  caption: {
    face: 'Arial',
    size: 14,
    bold: false,
    color: colors.text.secondary
  }
};

export function createTitleSlide(pptx, data) {
  const slide = pptx.addSlide();
  
  // Background gradient
  slide.background = { 
    fill: colors.background.dark
  };
  
  // Decorative shape
  slide.addShape('rect', {
    x: 0,
    y: 0,
    w: 2,
    h: 7.5,
    fill: { color: colors.primary }
  });
  
  // Title
  slide.addText(data.title || 'Presentation', {
    x: 2.5,
    y: 2.5,
    w: 7,
    h: 1.5,
    fontSize: 54,
    bold: true,
    color: colors.text.light,
    fontFace: 'Arial',
    align: 'left',
    valign: 'middle'
  });
  
  // Subtitle
  if (data.subtitle) {
    slide.addText(data.subtitle, {
      x: 2.5,
      y: 4.2,
      w: 7,
      h: 0.8,
      fontSize: 20,
      color: colors.accent,
      fontFace: 'Arial',
      align: 'left'
    });
  }
  
  // Footer line
  slide.addShape('line', {
    x: 2.5,
    y: 6.5,
    w: 4,
    h: 0,
    line: { color: colors.secondary, width: 3 }
  });
  
  // Date/info
  const date = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  slide.addText(date, {
    x: 2.5,
    y: 6.8,
    w: 4,
    h: 0.4,
    fontSize: 14,
    color: colors.text.secondary,
    fontFace: 'Arial'
  });
}

export function createContentSlide(pptx, data) {
  const slide = pptx.addSlide();
  
  // Background
  slide.background = { fill: colors.background.main };
  
  // Header bar
  slide.addShape('rect', {
    x: 0,
    y: 0,
    w: 10,
    h: 1,
    fill: { color: colors.primary }
  });
  
  // Title
  slide.addText(data.title, {
    x: 0.5,
    y: 0.25,
    w: 9,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: colors.text.light,
    fontFace: 'Arial',
    valign: 'middle'
  });
  
  // Content area with bullets
  if (data.content && data.content.length > 0) {
    const bulletPoints = data.content.map((text, index) => ({
      text: text,
      options: {
        bullet: { 
          type: 'number',
          numberType: 'arabic',
          code: '25A0',
          color: colors.secondary
        },
        fontSize: 18,
        color: colors.text.primary,
        fontFace: 'Arial',
        paraSpaceBefore: 12,
        paraSpaceAfter: 12
      }
    }));
    
    slide.addText(bulletPoints, {
      x: 0.8,
      y: 1.5,
      w: 8.4,
      h: 5,
      fontSize: 18,
      color: colors.text.primary,
      fontFace: 'Arial',
      valign: 'top'
    });
  }
  
  // Footer
  slide.addText('', {
    x: 0.5,
    y: 7,
    w: 9,
    h: 0.3,
    fontSize: 12,
    color: colors.text.secondary,
    fontFace: 'Arial'
  });
}

export function createTimelineSlide(pptx, data) {
  const slide = pptx.addSlide();
  
  // Background
  slide.background = { fill: colors.background.main };
  
  // Header
  slide.addShape('rect', {
    x: 0,
    y: 0,
    w: 10,
    h: 0.8,
    fill: { color: colors.primary }
  });
  
  slide.addText(data.title, {
    x: 0.5,
    y: 0.2,
    w: 9,
    h: 0.4,
    fontSize: 26,
    bold: true,
    color: colors.text.light,
    fontFace: 'Arial'
  });
  
  // Timeline items
  if (data.content && data.content.length > 0) {
    const itemHeight = 0.8;
    const startY = 1.5;
    const spacing = 0.3;
    
    data.content.forEach((item, index) => {
      const y = startY + (itemHeight + spacing) * index;
      
      // Timeline dot
      slide.addShape('ellipse', {
        x: 0.8,
        y: y + 0.15,
        w: 0.3,
        h: 0.3,
        fill: { color: colors.secondary }
      });
      
      // Timeline line (except last)
      if (index < data.content.length - 1) {
        slide.addShape('line', {
          x: 0.95,
          y: y + 0.45,
          w: 0,
          h: itemHeight + spacing,
          line: { color: colors.accent, width: 2, dashType: 'dash' }
        });
      }
      
      // Content box
      slide.addShape('rect', {
        x: 1.4,
        y: y,
        w: 7.6,
        h: itemHeight,
        fill: { color: colors.background.accent },
        line: { color: colors.accent, width: 1 }
      });
      
      slide.addText(item, {
        x: 1.6,
        y: y + 0.1,
        w: 7.2,
        h: itemHeight - 0.2,
        fontSize: 16,
        color: colors.text.primary,
        fontFace: 'Arial',
        valign: 'middle'
      });
    });
  }
}

export function createStatsSlide(pptx, data) {
  const slide = pptx.addSlide();
  
  // Background gradient
  slide.background = { fill: colors.background.main };
  
  // Header
  slide.addText(data.title, {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.6,
    fontSize: 32,
    bold: true,
    color: colors.primary,
    fontFace: 'Arial'
  });
  
  // Stats grid
  if (data.content && data.content.length > 0) {
    const cols = 2;
    const rows = Math.ceil(data.content.length / cols);
    const boxWidth = 4;
    const boxHeight = 1.5;
    const gapX = 0.5;
    const gapY = 0.3;
    const startX = 0.75;
    const startY = 1.8;
    
    data.content.forEach((stat, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = startX + (boxWidth + gapX) * col;
      const y = startY + (boxHeight + gapY) * row;
      
      // Stat box
      slide.addShape('rect', {
        x: x,
        y: y,
        w: boxWidth,
        h: boxHeight,
        fill: { 
          type: 'solid',
          color: colors.background.accent
        },
        line: { color: colors.secondary, width: 2 }
      });
      
      // Icon or emoji
      const emoji = stat.match(/^[^\s]+/)?.[0] || '📊';
      slide.addText(emoji, {
        x: x + 0.2,
        y: y + 0.3,
        w: 0.8,
        h: 0.8,
        fontSize: 32,
        align: 'center',
        valign: 'middle'
      });
      
      // Stat text
      const text = stat.replace(/^[^\s]+\s*/, '');
      slide.addText(text, {
        x: x + 1.1,
        y: y + 0.3,
        w: boxWidth - 1.3,
        h: 0.9,
        fontSize: 16,
        bold: true,
        color: colors.text.primary,
        fontFace: 'Arial',
        valign: 'middle'
      });
    });
  }
}

export function createTeamSlide(pptx, data) {
  const slide = pptx.addSlide();
  
  // Background
  slide.background = { fill: colors.background.main };
  
  // Header with icon
  slide.addText('👥 ' + data.title, {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.7,
    fontSize: 32,
    bold: true,
    color: colors.primary,
    fontFace: 'Arial'
  });
  
  // Team members
  if (data.content && data.content.length > 0) {
    const itemHeight = 0.9;
    const startY = 1.8;
    const spacing = 0.2;
    
    data.content.forEach((member, index) => {
      const y = startY + (itemHeight + spacing) * index;
      
      // Member card
      slide.addShape('rect', {
        x: 1,
        y: y,
        w: 8,
        h: itemHeight,
        fill: { color: colors.background.accent },
        line: { color: colors.accent, width: 1 }
      });
      
      // Avatar placeholder
      slide.addShape('ellipse', {
        x: 1.3,
        y: y + 0.15,
        w: 0.6,
        h: 0.6,
        fill: { color: colors.secondary }
      });
      
      slide.addText('👤', {
        x: 1.3,
        y: y + 0.15,
        w: 0.6,
        h: 0.6,
        fontSize: 20,
        color: colors.text.light,
        align: 'center',
        valign: 'middle'
      });
      
      // Member info
      slide.addText(member, {
        x: 2.2,
        y: y + 0.15,
        w: 6.5,
        h: 0.6,
        fontSize: 16,
        color: colors.text.primary,
        fontFace: 'Arial',
        valign: 'middle'
      });
    });
  }
}

export default {
  colors,
  fonts,
  createTitleSlide,
  createContentSlide,
  createTimelineSlide,
  createStatsSlide,
  createTeamSlide
};
