// Bold template - High contrast, strong typography, impactful
export const colors = {
  primary: '#000000',
  secondary: '#FF00FF', // Magenta
  accent: '#00FFFF', // Cyan
  background: '#FFFFFF',
  text: '#000000',
  textLight: '#666666',
  border: '#000000',
  gradient: ['#FF00FF', '#00FFFF']
};

export const fonts = {
  title: { face: 'Arial Black', size: 64, bold: true },
  subtitle: { face: 'Arial', size: 24, bold: false },
  heading: { face: 'Arial Black', size: 40, bold: true },
  body: { face: 'Arial', size: 20, bold: false },
  caption: { face: 'Arial', size: 14, bold: false }
};

export function createTitleSlide(pptx, data) {
  const slide = pptx.addSlide();
  
  // Bold diagonal stripe
  slide.addShape('rect', {
    x: -1, y: 3, w: 12, h: 2,
    fill: { type: 'solid', color: colors.primary },
    line: { type: 'none' },
    rotate: -5
  });
  
  // Neon accent stripes
  slide.addShape('rect', {
    x: -1, y: 5.2, w: 12, h: 0.3,
    fill: { type: 'solid', color: colors.secondary },
    line: { type: 'none' },
    rotate: -5
  });
  
  slide.addShape('rect', {
    x: -1, y: 5.7, w: 12, h: 0.3,
    fill: { type: 'solid', color: colors.accent },
    line: { type: 'none' },
    rotate: -5
  });
  
  // Title - Bold, high impact
  slide.addText(data.title, {
    x: 0.5, y: 1, w: 9, h: 1.5,
    fontSize: fonts.title.size,
    fontFace: fonts.title.face,
    bold: fonts.title.bold,
    color: colors.text,
    align: 'left',
    valign: 'top'
  });
  
  // Subtitle on black stripe
  if (data.subtitle) {
    slide.addText(data.subtitle, {
      x: 0.5, y: 3.3, w: 9, h: 1.2,
      fontSize: fonts.subtitle.size,
      fontFace: fonts.subtitle.face,
      color: colors.background,
      align: 'left',
      valign: 'middle'
    });
  }
  
  return slide;
}

export function createContentSlide(pptx, data) {
  const slide = pptx.addSlide();
  
  // Bold top border
  slide.addShape('rect', {
    x: 0, y: 0, w: 10, h: 0.2,
    fill: { type: 'solid', color: colors.primary },
    line: { type: 'none' }
  });
  
  // Neon accent corners
  slide.addShape('rect', {
    x: 0, y: 0, w: 0.2, h: 1.5,
    fill: { type: 'solid', color: colors.secondary },
    line: { type: 'none' }
  });
  
  slide.addShape('rect', {
    x: 9.8, y: 0, w: 0.2, h: 1.5,
    fill: { type: 'solid', color: colors.accent },
    line: { type: 'none' }
  });
  
  // Title - Bold and loud
  slide.addText(data.title, {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: fonts.heading.size,
    fontFace: fonts.heading.face,
    bold: fonts.heading.bold,
    color: colors.text,
    valign: 'middle'
  });
  
  // Content with bold squares
  const contentY = 2;
  const contentItems = Array.isArray(data.content) ? data.content : [data.content];
  
  contentItems.forEach((item, i) => {
    const y = contentY + (i * 0.9);
    const bulletColor = i % 2 === 0 ? colors.secondary : colors.accent;
    
    // Bold square bullet
    slide.addShape('rect', {
      x: 0.8, y: y + 0.1, w: 0.35, h: 0.35,
      fill: { type: 'solid', color: bulletColor },
      line: { type: 'none' }
    });
    
    // Text - larger, bolder
    slide.addText(item, {
      x: 1.5, y: y, w: 7.5, h: 0.6,
      fontSize: fonts.body.size,
      fontFace: fonts.body.face,
      color: colors.text,
      valign: 'middle'
    });
  });
  
  return slide;
}

export function createTimelineSlide(pptx, data) {
  const slide = pptx.addSlide();
  
  // Bold top border
  slide.addShape('rect', {
    x: 0, y: 0, w: 10, h: 0.2,
    fill: { type: 'solid', color: colors.primary },
    line: { type: 'none' }
  });
  
  // Neon corners
  slide.addShape('rect', {
    x: 0, y: 0, w: 0.2, h: 1.5,
    fill: { type: 'solid', color: colors.secondary },
    line: { type: 'none' }
  });
  
  slide.addShape('rect', {
    x: 9.8, y: 0, w: 0.2, h: 1.5,
    fill: { type: 'solid', color: colors.accent },
    line: { type: 'none' }
  });
  
  // Title
  slide.addText(data.title, {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: fonts.heading.size,
    fontFace: fonts.heading.face,
    bold: fonts.heading.bold,
    color: colors.text,
    valign: 'middle'
  });
  
  // Horizontal bold timeline
  const items = data.items || [];
  const timelineY = 3.5;
  const spacing = 7 / Math.max(items.length - 1, 1);
  
  // Thick base line
  slide.addShape('line', {
    x: 1.5, y: timelineY, w: 7, h: 0,
    line: { color: colors.primary, width: 4 }
  });
  
  items.forEach((item, i) => {
    const x = 1.5 + (i * spacing);
    const nodeColor = i % 2 === 0 ? colors.secondary : colors.accent;
    
    // Large bold circle
    slide.addShape('ellipse', {
      x: x - 0.3, y: timelineY - 0.3, w: 0.6, h: 0.6,
      fill: { type: 'solid', color: nodeColor },
      line: { color: colors.primary, width: 3 }
    });
    
    // Label - bold
    slide.addText(item.label || item, {
      x: x - 1, y: timelineY + 0.5, w: 2, h: 0.5,
      fontSize: 16,
      fontFace: fonts.body.face,
      bold: true,
      color: colors.text,
      align: 'center'
    });
    
    // Description
    if (item.description) {
      slide.addText(item.description, {
        x: x - 1, y: timelineY + 1.1, w: 2, h: 1,
        fontSize: 13,
        fontFace: fonts.body.face,
        color: colors.textLight,
        align: 'center'
      });
    }
  });
  
  return slide;
}

export function createStatsSlide(pptx, data) {
  const slide = pptx.addSlide();
  
  // Bold top border
  slide.addShape('rect', {
    x: 0, y: 0, w: 10, h: 0.2,
    fill: { type: 'solid', color: colors.primary },
    line: { type: 'none' }
  });
  
  // Neon corners
  slide.addShape('rect', {
    x: 0, y: 0, w: 0.2, h: 1.5,
    fill: { type: 'solid', color: colors.secondary },
    line: { type: 'none' }
  });
  
  slide.addShape('rect', {
    x: 9.8, y: 0, w: 0.2, h: 1.5,
    fill: { type: 'solid', color: colors.accent },
    line: { type: 'none' }
  });
  
  // Title
  slide.addText(data.title, {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: fonts.heading.size,
    fontFace: fonts.heading.face,
    bold: fonts.heading.bold,
    color: colors.text,
    valign: 'middle'
  });
  
  // Bold stat boxes
  const stats = data.stats || [];
  const cols = stats.length <= 2 ? 2 : 3;
  const statW = 8 / cols - 0.5;
  const startY = 2.5;
  
  stats.forEach((stat, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const x = 1 + (col * (statW + 0.5));
    const y = startY + (row * 2.8);
    const boxColor = i % 2 === 0 ? colors.secondary : colors.accent;
    
    // Black box with neon border
    slide.addShape('rect', {
      x, y, w: statW, h: 2.3,
      fill: { type: 'solid', color: colors.primary },
      line: { color: boxColor, width: 4 }
    });
    
    // Huge number in white
    slide.addText(stat.value || '—', {
      x, y: y + 0.3, w: statW, h: 1,
      fontSize: 50,
      fontFace: fonts.title.face,
      bold: true,
      color: colors.background,
      align: 'center'
    });
    
    // Label in neon
    slide.addText(stat.label || '', {
      x, y: y + 1.4, w: statW, h: 0.6,
      fontSize: 16,
      fontFace: fonts.body.face,
      bold: true,
      color: boxColor,
      align: 'center'
    });
  });
  
  return slide;
}

export function createTeamSlide(pptx, data) {
  const slide = pptx.addSlide();
  
  // Bold top border
  slide.addShape('rect', {
    x: 0, y: 0, w: 10, h: 0.2,
    fill: { type: 'solid', color: colors.primary },
    line: { type: 'none' }
  });
  
  // Neon corners
  slide.addShape('rect', {
    x: 0, y: 0, w: 0.2, h: 1.5,
    fill: { type: 'solid', color: colors.secondary },
    line: { type: 'none' }
  });
  
  slide.addShape('rect', {
    x: 9.8, y: 0, w: 0.2, h: 1.5,
    fill: { type: 'solid', color: colors.accent },
    line: { type: 'none' }
  });
  
  // Title
  slide.addText(data.title, {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: fonts.heading.size,
    fontFace: fonts.heading.face,
    bold: fonts.heading.bold,
    color: colors.text,
    valign: 'middle'
  });
  
  // Bold team cards
  const members = data.members || [];
  const cardW = 4;
  const startX = 1;
  
  members.forEach((member, i) => {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const x = startX + (col * (cardW + 0.5));
    const y = 2.5 + (row * 2.8);
    const cardColor = i % 2 === 0 ? colors.secondary : colors.accent;
    
    // Black card with neon border
    slide.addShape('rect', {
      x, y, w: cardW, h: 2.3,
      fill: { type: 'solid', color: colors.primary },
      line: { color: cardColor, width: 4 }
    });
    
    // Neon square avatar
    slide.addShape('rect', {
      x: x + 0.4, y: y + 0.4, w: 0.8, h: 0.8,
      fill: { type: 'solid', color: cardColor },
      line: { type: 'none' }
    });
    
    // Name in white
    slide.addText(member.name || '', {
      x: x + 1.5, y: y + 0.5, w: 2.3, h: 0.4,
      fontSize: 20,
      fontFace: fonts.body.face,
      bold: true,
      color: colors.background
    });
    
    // Role
    if (member.role) {
      slide.addText(member.role, {
        x: x + 1.5, y: y + 0.95, w: 2.3, h: 0.3,
        fontSize: 14,
        fontFace: fonts.body.face,
        color: colors.textLight
      });
    }
    
    // Contributions bar
    if (member.contributions) {
      slide.addShape('rect', {
        x: x + 0.3, y: y + 1.7, w: cardW - 0.6, h: 0.4,
        fill: { type: 'solid', color: cardColor },
        line: { type: 'none' }
      });
      
      slide.addText(`${member.contributions} 기여`, {
        x: x + 0.3, y: y + 1.7, w: cardW - 0.6, h: 0.4,
        fontSize: 14,
        fontFace: fonts.body.face,
        bold: true,
        color: colors.primary,
        align: 'center',
        valign: 'middle'
      });
    }
  });
  
  return slide;
}
