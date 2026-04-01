// Minimal template - Ultra-clean, Swiss design inspired
export const colors = {
  primary: '#000000',
  secondary: '#000000',
  accent: '#FF0000',
  background: '#FFFFFF',
  text: '#000000',
  textLight: '#999999',
  border: '#CCCCCC',
  gradient: ['#000000', '#333333']
};

export const fonts = {
  title: { face: 'Helvetica', size: 60, bold: true },
  subtitle: { face: 'Helvetica', size: 20, bold: false },
  heading: { face: 'Helvetica', size: 32, bold: true },
  body: { face: 'Helvetica', size: 16, bold: false },
  caption: { face: 'Helvetica', size: 12, bold: false }
};

export function createTitleSlide(pptx, data) {
  const slide = pptx.addSlide();
  
  // Title - Top left aligned, Swiss style
  slide.addText(data.title, {
    x: 0.8, y: 1.5, w: 8, h: 2,
    fontSize: fonts.title.size,
    fontFace: fonts.title.face,
    bold: fonts.title.bold,
    color: colors.text,
    align: 'left',
    valign: 'top'
  });
  
  // Subtitle - Small, bottom left
  if (data.subtitle) {
    slide.addText(data.subtitle, {
      x: 0.8, y: 6.5, w: 6, h: 0.5,
      fontSize: fonts.subtitle.size,
      fontFace: fonts.subtitle.face,
      color: colors.textLight,
      align: 'left'
    });
  }
  
  // Red accent square - signature element
  slide.addShape('rect', {
    x: 8.5, y: 6.5, w: 0.7, h: 0.7,
    fill: { type: 'solid', color: colors.accent },
    line: { type: 'none' }
  });
  
  return slide;
}

export function createContentSlide(pptx, data) {
  const slide = pptx.addSlide();
  
  // Title - Top left
  slide.addText(data.title, {
    x: 0.8, y: 0.8, w: 8, h: 0.6,
    fontSize: fonts.heading.size,
    fontFace: fonts.heading.face,
    bold: fonts.heading.bold,
    color: colors.text
  });
  
  // Thin separator line
  slide.addShape('line', {
    x: 0.8, y: 1.6, w: 8, h: 0,
    line: { color: colors.border, width: 1 }
  });
  
  // Content - No bullets, just text blocks
  const contentY = 2.2;
  const contentItems = Array.isArray(data.content) ? data.content : [data.content];
  
  contentItems.forEach((item, i) => {
    const y = contentY + (i * 0.7);
    
    slide.addText(item, {
      x: 0.8, y: y, w: 8, h: 0.5,
      fontSize: fonts.body.size,
      fontFace: fonts.body.face,
      color: colors.text
    });
  });
  
  return slide;
}

export function createTimelineSlide(pptx, data) {
  const slide = pptx.addSlide();
  
  // Title
  slide.addText(data.title, {
    x: 0.8, y: 0.8, w: 8, h: 0.6,
    fontSize: fonts.heading.size,
    fontFace: fonts.heading.face,
    bold: fonts.heading.bold,
    color: colors.text
  });
  
  // Separator
  slide.addShape('line', {
    x: 0.8, y: 1.6, w: 8, h: 0,
    line: { color: colors.border, width: 1 }
  });
  
  // Vertical timeline - minimalist
  const items = data.items || [];
  const startY = 2.5;
  const lineX = 1.5;
  
  items.forEach((item, i) => {
    const y = startY + (i * 1.2);
    
    // Small square marker
    slide.addShape('rect', {
      x: lineX - 0.1, y: y - 0.1, w: 0.2, h: 0.2,
      fill: { type: 'solid', color: colors.accent },
      line: { type: 'none' }
    });
    
    // Label
    slide.addText(item.label || item, {
      x: lineX + 0.5, y: y - 0.15, w: 6, h: 0.4,
      fontSize: 16,
      fontFace: fonts.body.face,
      bold: true,
      color: colors.text
    });
    
    // Description
    if (item.description) {
      slide.addText(item.description, {
        x: lineX + 0.5, y: y + 0.3, w: 6, h: 0.6,
        fontSize: 14,
        fontFace: fonts.body.face,
        color: colors.textLight
      });
    }
  });
  
  return slide;
}

export function createStatsSlide(pptx, data) {
  const slide = pptx.addSlide();
  
  // Title
  slide.addText(data.title, {
    x: 0.8, y: 0.8, w: 8, h: 0.6,
    fontSize: fonts.heading.size,
    fontFace: fonts.heading.face,
    bold: fonts.heading.bold,
    color: colors.text
  });
  
  // Separator
  slide.addShape('line', {
    x: 0.8, y: 1.6, w: 8, h: 0,
    line: { color: colors.border, width: 1 }
  });
  
  // Stats - List style, not cards
  const stats = data.stats || [];
  const startY = 2.5;
  
  stats.forEach((stat, i) => {
    const y = startY + (i * 1.3);
    
    // Number - Large, left aligned
    slide.addText(stat.value || '—', {
      x: 0.8, y: y, w: 2, h: 0.7,
      fontSize: 48,
      fontFace: fonts.title.face,
      bold: true,
      color: colors.text,
      align: 'left'
    });
    
    // Label - Next to number
    slide.addText(stat.label || '', {
      x: 3, y: y + 0.15, w: 5, h: 0.5,
      fontSize: 18,
      fontFace: fonts.body.face,
      color: colors.textLight,
      align: 'left',
      valign: 'middle'
    });
    
    // Red accent line
    slide.addShape('line', {
      x: 0.8, y: y + 0.9, w: 1.5, h: 0,
      line: { color: colors.accent, width: 2 }
    });
  });
  
  return slide;
}

export function createTeamSlide(pptx, data) {
  const slide = pptx.addSlide();
  
  // Title
  slide.addText(data.title, {
    x: 0.8, y: 0.8, w: 8, h: 0.6,
    fontSize: fonts.heading.size,
    fontFace: fonts.heading.face,
    bold: fonts.heading.bold,
    color: colors.text
  });
  
  // Separator
  slide.addShape('line', {
    x: 0.8, y: 1.6, w: 8, h: 0,
    line: { color: colors.border, width: 1 }
  });
  
  // Team members - List format
  const members = data.members || [];
  const startY = 2.5;
  
  members.forEach((member, i) => {
    const y = startY + (i * 1.5);
    
    // Red square indicator
    slide.addShape('rect', {
      x: 0.8, y: y + 0.15, w: 0.3, h: 0.3,
      fill: { type: 'solid', color: colors.accent },
      line: { type: 'none' }
    });
    
    // Name
    slide.addText(member.name || '', {
      x: 1.3, y: y, w: 4, h: 0.5,
      fontSize: 22,
      fontFace: fonts.body.face,
      bold: true,
      color: colors.text
    });
    
    // Role & contributions
    const details = [];
    if (member.role) details.push(member.role);
    if (member.contributions) details.push(`${member.contributions} 기여`);
    
    if (details.length > 0) {
      slide.addText(details.join(' · '), {
        x: 1.3, y: y + 0.6, w: 6, h: 0.4,
        fontSize: 14,
        fontFace: fonts.body.face,
        color: colors.textLight
      });
    }
  });
  
  return slide;
}
