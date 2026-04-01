// Creative template - Colorful, dynamic, gradient-heavy
export const colors = {
  primary: '#8B5CF6', // Purple
  secondary: '#06B6D4', // Cyan
  accent: '#F59E0B', // Amber
  background: '#FFFFFF',
  text: '#1F2937',
  textLight: '#6B7280',
  border: '#E5E7EB',
  gradient: ['#8B5CF6', '#EC4899', '#F59E0B']
};

export const fonts = {
  title: { face: 'Arial', size: 52, bold: true },
  subtitle: { face: 'Arial', size: 22, bold: false },
  heading: { face: 'Arial', size: 34, bold: true },
  body: { face: 'Arial', size: 18, bold: false },
  caption: { face: 'Arial', size: 14, bold: false }
};

export function createTitleSlide(pptx, data) {
  const slide = pptx.addSlide();
  
  // Multi-color gradient background
  slide.addShape('rect', {
    x: 0, y: 0, w: 10, h: 7.5,
    fill: {
      type: 'solid',
      color: colors.background
    }
  });
  
  // Large colorful circles - background decoration
  slide.addShape('ellipse', {
    x: -1, y: -1, w: 4, h: 4,
    fill: { type: 'solid', color: colors.primary, transparency: 85 },
    line: { type: 'none' }
  });
  
  slide.addShape('ellipse', {
    x: 7, y: 5, w: 4, h: 4,
    fill: { type: 'solid', color: colors.secondary, transparency: 85 },
    line: { type: 'none' }
  });
  
  slide.addShape('ellipse', {
    x: 3, y: 3.5, w: 3, h: 3,
    fill: { type: 'solid', color: colors.accent, transparency: 90 },
    line: { type: 'none' }
  });
  
  // Title with shadow
  slide.addText(data.title, {
    x: 1, y: 2.5, w: 8, h: 1.5,
    fontSize: fonts.title.size,
    fontFace: fonts.title.face,
    bold: fonts.title.bold,
    color: colors.text,
    align: 'center',
    valign: 'middle',
    shadow: {
      type: 'outer',
      blur: 8,
      opacity: 0.3,
      angle: 90,
      offset: 3,
      color: colors.primary
    }
  });
  
  // Colorful underline
  slide.addShape('rect', {
    x: 3.5, y: 4.2, w: 3, h: 0.15,
    fill: { type: 'solid', color: colors.primary },
    line: { type: 'none' }
  });
  
  // Subtitle
  if (data.subtitle) {
    slide.addText(data.subtitle, {
      x: 1, y: 4.8, w: 8, h: 0.7,
      fontSize: fonts.subtitle.size,
      fontFace: fonts.subtitle.face,
      color: colors.textLight,
      align: 'center'
    });
  }
  
  return slide;
}

export function createContentSlide(pptx, data) {
  const slide = pptx.addSlide();
  
  // Gradient accent bar on left
  slide.addShape('rect', {
    x: 0, y: 0, w: 0.3, h: 7.5,
    fill: { type: 'solid', color: colors.primary }
  });
  
  // Decorative circles
  slide.addShape('ellipse', {
    x: 7.5, y: 0.3, w: 1.5, h: 1.5,
    fill: { type: 'solid', color: colors.secondary, transparency: 90 },
    line: { type: 'none' }
  });
  
  // Title with colorful background
  slide.addShape('rect', {
    x: 0.8, y: 0.5, w: 0.15, h: 0.6,
    fill: { type: 'solid', color: colors.primary },
    line: { type: 'none' }
  });
  
  slide.addText(data.title, {
    x: 1.2, y: 0.5, w: 7.5, h: 0.6,
    fontSize: fonts.heading.size,
    fontFace: fonts.heading.face,
    bold: fonts.heading.bold,
    color: colors.text,
    valign: 'middle'
  });
  
  // Content with colorful bullets
  const contentY = 2;
  const contentItems = Array.isArray(data.content) ? data.content : [data.content];
  const bulletColors = [colors.primary, colors.secondary, colors.accent];
  
  contentItems.forEach((item, i) => {
    const y = contentY + (i * 0.85);
    const bulletColor = bulletColors[i % bulletColors.length];
    
    // Colorful rounded square bullet
    slide.addShape('rect', {
      x: 1.2, y: y + 0.15, w: 0.25, h: 0.25,
      fill: { type: 'solid', color: bulletColor },
      line: { type: 'none' }
    });
    
    // Text
    slide.addText(item, {
      x: 1.7, y: y, w: 7, h: 0.6,
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
  
  // Left accent bar
  slide.addShape('rect', {
    x: 0, y: 0, w: 0.3, h: 7.5,
    fill: { type: 'solid', color: colors.primary }
  });
  
  // Title
  slide.addShape('rect', {
    x: 0.8, y: 0.5, w: 0.15, h: 0.6,
    fill: { type: 'solid', color: colors.primary },
    line: { type: 'none' }
  });
  
  slide.addText(data.title, {
    x: 1.2, y: 0.5, w: 7.5, h: 0.6,
    fontSize: fonts.heading.size,
    fontFace: fonts.heading.face,
    bold: fonts.heading.bold,
    color: colors.text,
    valign: 'middle'
  });
  
  // Curved timeline with colors
  const items = data.items || [];
  const startY = 2.5;
  const itemColors = [colors.primary, colors.secondary, colors.accent];
  
  items.forEach((item, i) => {
    const y = startY + (i * 1.3);
    const itemColor = itemColors[i % itemColors.length];
    
    // Large colorful circle
    slide.addShape('ellipse', {
      x: 1.5, y: y - 0.25, w: 0.5, h: 0.5,
      fill: { type: 'solid', color: itemColor },
      line: { type: 'none' }
    });
    
    // Inner white circle
    slide.addShape('ellipse', {
      x: 1.65, y: y - 0.1, w: 0.2, h: 0.2,
      fill: { type: 'solid', color: colors.background },
      line: { type: 'none' }
    });
    
    // Connecting line to next (if not last)
    if (i < items.length - 1) {
      slide.addShape('line', {
        x: 1.75, y: y + 0.25, w: 0, h: 0.8,
        line: { color: itemColor, width: 3, transparency: 50 }
      });
    }
    
    // Label
    slide.addText(item.label || item, {
      x: 2.5, y: y - 0.2, w: 5.5, h: 0.4,
      fontSize: 20,
      fontFace: fonts.body.face,
      bold: true,
      color: colors.text
    });
    
    // Description
    if (item.description) {
      slide.addText(item.description, {
        x: 2.5, y: y + 0.25, w: 5.5, h: 0.7,
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
  
  // Left accent
  slide.addShape('rect', {
    x: 0, y: 0, w: 0.3, h: 7.5,
    fill: { type: 'solid', color: colors.primary }
  });
  
  // Title
  slide.addShape('rect', {
    x: 0.8, y: 0.5, w: 0.15, h: 0.6,
    fill: { type: 'solid', color: colors.primary },
    line: { type: 'none' }
  });
  
  slide.addText(data.title, {
    x: 1.2, y: 0.5, w: 7.5, h: 0.6,
    fontSize: fonts.heading.size,
    fontFace: fonts.heading.face,
    bold: fonts.heading.bold,
    color: colors.text,
    valign: 'middle'
  });
  
  // Colorful stat cards
  const stats = data.stats || [];
  const cols = stats.length <= 2 ? 2 : 3;
  const statW = 7.5 / cols - 0.4;
  const startY = 2.5;
  const cardColors = [colors.primary, colors.secondary, colors.accent, colors.primary, colors.secondary];
  
  stats.forEach((stat, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const x = 1.2 + (col * (statW + 0.4));
    const y = startY + (row * 2.5);
    const cardColor = cardColors[i % cardColors.length];
    
    // Colorful card with gradient-like effect
    slide.addShape('rect', {
      x, y, w: statW, h: 2,
      fill: { type: 'solid', color: cardColor, transparency: 92 },
      line: { color: cardColor, width: 2 }
    });
    
    // Top accent bar
    slide.addShape('rect', {
      x, y, w: statW, h: 0.15,
      fill: { type: 'solid', color: cardColor },
      line: { type: 'none' }
    });
    
    // Number
    slide.addText(stat.value || '—', {
      x, y: y + 0.5, w: statW, h: 0.7,
      fontSize: 40,
      fontFace: fonts.title.face,
      bold: true,
      color: cardColor,
      align: 'center'
    });
    
    // Label
    slide.addText(stat.label || '', {
      x, y: y + 1.3, w: statW, h: 0.5,
      fontSize: 15,
      fontFace: fonts.body.face,
      color: colors.text,
      align: 'center'
    });
  });
  
  return slide;
}

export function createTeamSlide(pptx, data) {
  const slide = pptx.addSlide();
  
  // Left accent
  slide.addShape('rect', {
    x: 0, y: 0, w: 0.3, h: 7.5,
    fill: { type: 'solid', color: colors.primary }
  });
  
  // Title
  slide.addShape('rect', {
    x: 0.8, y: 0.5, w: 0.15, h: 0.6,
    fill: { type: 'solid', color: colors.primary },
    line: { type: 'none' }
  });
  
  slide.addText(data.title, {
    x: 1.2, y: 0.5, w: 7.5, h: 0.6,
    fontSize: fonts.heading.size,
    fontFace: fonts.heading.face,
    bold: fonts.heading.bold,
    color: colors.text,
    valign: 'middle'
  });
  
  // Colorful team cards
  const members = data.members || [];
  const cardW = 3.5;
  const startX = 1.2;
  const avatarColors = [colors.primary, colors.secondary, colors.accent];
  
  members.forEach((member, i) => {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const x = startX + (col * (cardW + 0.5));
    const y = 2.2 + (row * 2.8);
    const avatarColor = avatarColors[i % avatarColors.length];
    
    // Card with subtle color
    slide.addShape('rect', {
      x, y, w: cardW, h: 2.5,
      fill: { type: 'solid', color: avatarColor, transparency: 95 },
      line: { color: avatarColor, width: 2 }
    });
    
    // Colorful avatar circle
    slide.addShape('ellipse', {
      x: x + 0.4, y: y + 0.4, w: 0.8, h: 0.8,
      fill: { type: 'solid', color: avatarColor },
      line: { type: 'none' }
    });
    
    // Name
    slide.addText(member.name || '', {
      x: x + 1.5, y: y + 0.5, w: 1.8, h: 0.4,
      fontSize: 18,
      fontFace: fonts.body.face,
      bold: true,
      color: colors.text
    });
    
    // Role
    if (member.role) {
      slide.addText(member.role, {
        x: x + 1.5, y: y + 0.9, w: 1.8, h: 0.3,
        fontSize: 13,
        fontFace: fonts.body.face,
        color: colors.textLight
      });
    }
    
    // Contributions badge
    if (member.contributions) {
      slide.addShape('rect', {
        x: x + 0.3, y: y + 1.6, w: cardW - 0.6, h: 0.6,
        fill: { type: 'solid', color: avatarColor, transparency: 80 },
        line: { type: 'none' }
      });
      
      slide.addText(`${member.contributions} 기여`, {
        x: x + 0.3, y: y + 1.6, w: cardW - 0.6, h: 0.6,
        fontSize: 14,
        fontFace: fonts.body.face,
        bold: true,
        color: avatarColor,
        align: 'center',
        valign: 'middle'
      });
    }
  });
  
  return slide;
}
