// Modern minimalist template - Clean, spacious, tech-forward
export const colors = {
  primary: '#000000',
  secondary: '#6366F1', // Indigo
  accent: '#EC4899', // Pink
  background: '#FFFFFF',
  text: '#000000',
  textLight: '#6B7280',
  border: '#E5E7EB',
  gradient: ['#6366F1', '#EC4899']
};

export const fonts = {
  title: { face: 'Inter', size: 54, bold: true },
  subtitle: { face: 'Inter', size: 24, bold: false },
  heading: { face: 'Inter', size: 36, bold: true },
  body: { face: 'Inter', size: 18, bold: false },
  caption: { face: 'Inter', size: 14, bold: false }
};

export function createTitleSlide(pptx, data) {
  const slide = pptx.addSlide();
  
  // Gradient accent line at top
  slide.addShape('rect', {
    x: 0, y: 0, w: 10, h: 0.05,
    fill: { type: 'solid', color: colors.secondary }
  });
  
  // Title - Large, centered, minimalist
  slide.addText(data.title, {
    x: 1, y: 2.5, w: 8, h: 2,
    fontSize: fonts.title.size,
    fontFace: fonts.title.face,
    bold: fonts.title.bold,
    color: colors.text,
    align: 'center',
    valign: 'middle'
  });
  
  // Subtitle - Light, small
  if (data.subtitle) {
    slide.addText(data.subtitle, {
      x: 1, y: 4.5, w: 8, h: 0.8,
      fontSize: fonts.subtitle.size,
      fontFace: fonts.subtitle.face,
      color: colors.textLight,
      align: 'center',
      valign: 'top'
    });
  }
  
  // Minimal accent circle
  slide.addShape('ellipse', {
    x: 4.5, y: 6, w: 1, h: 1,
    fill: { type: 'solid', color: colors.secondary, transparency: 90 },
    line: { type: 'none' }
  });
  
  return slide;
}

export function createContentSlide(pptx, data) {
  const slide = pptx.addSlide();
  
  // Top accent line
  slide.addShape('rect', {
    x: 0, y: 0, w: 10, h: 0.05,
    fill: { type: 'solid', color: colors.secondary }
  });
  
  // Title - Left aligned, modern
  slide.addText(data.title, {
    x: 0.8, y: 0.5, w: 8, h: 0.8,
    fontSize: fonts.heading.size,
    fontFace: fonts.heading.face,
    bold: fonts.heading.bold,
    color: colors.text
  });
  
  // Content area with generous spacing
  const contentY = 1.8;
  const contentItems = Array.isArray(data.content) ? data.content : [data.content];
  
  contentItems.forEach((item, i) => {
    const y = contentY + (i * 0.8);
    
    // Bullet point - minimal dot
    slide.addShape('ellipse', {
      x: 1, y: y + 0.15, w: 0.15, h: 0.15,
      fill: { type: 'solid', color: colors.secondary },
      line: { type: 'none' }
    });
    
    // Text
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
  
  // Top accent
  slide.addShape('rect', {
    x: 0, y: 0, w: 10, h: 0.05,
    fill: { type: 'solid', color: colors.secondary }
  });
  
  // Title
  slide.addText(data.title, {
    x: 0.8, y: 0.5, w: 8, h: 0.8,
    fontSize: fonts.heading.size,
    fontFace: fonts.heading.face,
    bold: fonts.heading.bold,
    color: colors.text
  });
  
  // Horizontal timeline - modern style
  const timelineY = 3;
  const items = data.items || [];
  const spacing = 7 / Math.max(items.length - 1, 1);
  
  // Timeline base line
  slide.addShape('line', {
    x: 1.5, y: timelineY, w: 7, h: 0,
    line: { color: colors.border, width: 2 }
  });
  
  items.forEach((item, i) => {
    const x = 1.5 + (i * spacing);
    
    // Node circle
    slide.addShape('ellipse', {
      x: x - 0.15, y: timelineY - 0.15, w: 0.3, h: 0.3,
      fill: { type: 'solid', color: colors.secondary },
      line: { type: 'none' }
    });
    
    // Label
    slide.addText(item.label || item, {
      x: x - 0.8, y: timelineY + 0.3, w: 1.6, h: 0.5,
      fontSize: 14,
      fontFace: fonts.body.face,
      color: colors.text,
      align: 'center'
    });
    
    // Description
    if (item.description) {
      slide.addText(item.description, {
        x: x - 0.8, y: timelineY + 0.9, w: 1.6, h: 1.2,
        fontSize: 12,
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
  
  // Top accent
  slide.addShape('rect', {
    x: 0, y: 0, w: 10, h: 0.05,
    fill: { type: 'solid', color: colors.secondary }
  });
  
  // Title
  slide.addText(data.title, {
    x: 0.8, y: 0.5, w: 8, h: 0.8,
    fontSize: fonts.heading.size,
    fontFace: fonts.heading.face,
    bold: fonts.heading.bold,
    color: colors.text
  });
  
  // Stats grid - 2x2 or 3 columns
  const stats = data.stats || [];
  const cols = stats.length <= 2 ? 2 : 3;
  const statW = 8 / cols - 0.3;
  const startY = 2.5;
  
  stats.forEach((stat, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const x = 1 + (col * (statW + 0.3));
    const y = startY + (row * 2.5);
    
    // Card background - subtle
    slide.addShape('rect', {
      x, y, w: statW, h: 2,
      fill: { type: 'solid', color: colors.background },
      line: { color: colors.border, width: 1 }
    });
    
    // Big number
    slide.addText(stat.value || '—', {
      x, y: y + 0.3, w: statW, h: 0.8,
      fontSize: 42,
      fontFace: fonts.title.face,
      bold: true,
      color: colors.secondary,
      align: 'center'
    });
    
    // Label
    slide.addText(stat.label || '', {
      x, y: y + 1.2, w: statW, h: 0.6,
      fontSize: 16,
      fontFace: fonts.body.face,
      color: colors.textLight,
      align: 'center'
    });
  });
  
  return slide;
}

export function createTeamSlide(pptx, data) {
  const slide = pptx.addSlide();
  
  // Top accent
  slide.addShape('rect', {
    x: 0, y: 0, w: 10, h: 0.05,
    fill: { type: 'solid', color: colors.secondary }
  });
  
  // Title
  slide.addText(data.title, {
    x: 0.8, y: 0.5, w: 8, h: 0.8,
    fontSize: fonts.heading.size,
    fontFace: fonts.heading.face,
    bold: fonts.heading.bold,
    color: colors.text
  });
  
  // Team members - horizontal cards
  const members = data.members || [];
  const cardW = 3.5;
  const startX = (10 - (members.length * cardW) - ((members.length - 1) * 0.5)) / 2;
  
  members.forEach((member, i) => {
    const x = startX + (i * (cardW + 0.5));
    const y = 2.5;
    
    // Card
    slide.addShape('rect', {
      x, y, w: cardW, h: 3.5,
      fill: { type: 'solid', color: colors.background },
      line: { color: colors.border, width: 1 }
    });
    
    // Avatar placeholder
    slide.addShape('ellipse', {
      x: x + 1.25, y: y + 0.5, w: 1, h: 1,
      fill: { type: 'solid', color: colors.secondary, transparency: 80 },
      line: { type: 'none' }
    });
    
    // Name
    slide.addText(member.name || '', {
      x, y: y + 1.8, w: cardW, h: 0.5,
      fontSize: 20,
      fontFace: fonts.body.face,
      bold: true,
      color: colors.text,
      align: 'center'
    });
    
    // Role
    if (member.role) {
      slide.addText(member.role, {
        x, y: y + 2.3, w: cardW, h: 0.4,
        fontSize: 14,
        fontFace: fonts.body.face,
        color: colors.textLight,
        align: 'center'
      });
    }
    
    // Contributions
    if (member.contributions) {
      slide.addText(`${member.contributions} 기여`, {
        x, y: y + 2.8, w: cardW, h: 0.4,
        fontSize: 12,
        fontFace: fonts.caption.face,
        color: colors.secondary,
        align: 'center'
      });
    }
  });
  
  return slide;
}
