#!/usr/bin/env node

import PptxGenJS from 'pptxgenjs';
import { marked } from 'marked';
import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';

/**
 * PPTX Builder - Generate PowerPoint from notes and images
 */

class PptxBuilder {
  constructor() {
    this.pptx = new PptxGenJS();
    this.notesDir = './notes';
    this.imagesDir = './images';
    this.outputFile = 'presentation.pptx';
  }

  /**
   * Read all markdown files from notes directory
   */
  async readNotes() {
    try {
      const files = await glob(`${this.notesDir}/**/*.md`);
      
      if (files.length === 0) {
        console.log('⚠️  No markdown files found in notes/ directory');
        return [];
      }

      const notes = [];
      for (const file of files) {
        const content = await fs.readFile(file, 'utf-8');
        notes.push({
          filename: path.basename(file),
          content: content
        });
      }

      console.log(`✅ Read ${notes.length} note file(s)`);
      return notes;
    } catch (error) {
      console.error('❌ Error reading notes:', error.message);
      return [];
    }
  }

  /**
   * Read all images from images directory
   */
  async readImages() {
    try {
      const files = await glob(`${this.imagesDir}/**/*.{jpg,jpeg,png,gif}`);
      
      console.log(`✅ Found ${files.length} image(s)`);
      return files;
    } catch (error) {
      console.error('❌ Error reading images:', error.message);
      return [];
    }
  }

  /**
   * Parse markdown content into slides structure
   */
  parseMarkdown(content) {
    const lines = content.split('\n');
    const slides = [];
    let currentSlide = null;

    for (const line of lines) {
      const trimmed = line.trim();
      
      // Main title (# Title)
      if (trimmed.startsWith('# ')) {
        if (currentSlide) slides.push(currentSlide);
        currentSlide = {
          title: trimmed.substring(2),
          content: [],
          type: 'title'
        };
      }
      // Slide title (## Slide Title)
      else if (trimmed.startsWith('## ')) {
        if (currentSlide) slides.push(currentSlide);
        currentSlide = {
          title: trimmed.substring(3),
          content: [],
          type: 'content'
        };
      }
      // Bullet point
      else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (currentSlide) {
          currentSlide.content.push(trimmed.substring(2));
        }
      }
      // Regular text
      else if (trimmed.length > 0 && currentSlide) {
        currentSlide.content.push(trimmed);
      }
    }

    if (currentSlide) slides.push(currentSlide);

    console.log(`✅ Parsed ${slides.length} slide(s) from markdown`);
    return slides;
  }

  /**
   * Create title slide
   */
  createTitleSlide(slide) {
    const pptxSlide = this.pptx.addSlide();
    
    // Title
    pptxSlide.addText(slide.title, {
      x: 0.5,
      y: 2.5,
      w: 9,
      h: 1.5,
      fontSize: 44,
      bold: true,
      color: '363636',
      align: 'center',
      valign: 'middle'
    });

    // Subtitle if content exists
    if (slide.content.length > 0) {
      pptxSlide.addText(slide.content.join(' '), {
        x: 1,
        y: 4,
        w: 8,
        h: 1,
        fontSize: 20,
        color: '666666',
        align: 'center'
      });
    }
  }

  /**
   * Create content slide
   */
  createContentSlide(slide) {
    const pptxSlide = this.pptx.addSlide();
    
    // Title
    pptxSlide.addText(slide.title, {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 0.75,
      fontSize: 32,
      bold: true,
      color: '363636'
    });

    // Content as bullet points
    if (slide.content.length > 0) {
      const bullets = slide.content.map(item => ({
        text: item,
        options: { fontSize: 18, color: '444444', bullet: true }
      }));

      pptxSlide.addText(bullets, {
        x: 0.5,
        y: 1.5,
        w: 9,
        h: 4.5,
        fontSize: 18,
        color: '444444'
      });
    }
  }

  /**
   * Add image slide if images exist
   */
  async createImageSlide(imagePath) {
    const pptxSlide = this.pptx.addSlide();
    
    const filename = path.basename(imagePath, path.extname(imagePath));
    const title = filename.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    // Title
    pptxSlide.addText(title, {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 0.75,
      fontSize: 28,
      bold: true,
      color: '363636'
    });

    // Image
    try {
      pptxSlide.addImage({
        path: imagePath,
        x: 1.5,
        y: 1.5,
        w: 7,
        h: 4,
        sizing: { type: 'contain', w: 7, h: 4 }
      });
    } catch (error) {
      console.log(`⚠️  Could not add image ${imagePath}: ${error.message}`);
    }
  }

  /**
   * Main build function
   */
  async build() {
    console.log('\n🚀 Starting PPTX Builder...\n');

    // Read content
    const notes = await this.readNotes();
    const images = await this.readImages();

    if (notes.length === 0) {
      console.error('\n❌ No content found. Please add markdown files to notes/ directory\n');
      return;
    }

    // Parse notes into slides
    let allSlides = [];
    for (const note of notes) {
      const slides = this.parseMarkdown(note.content);
      allSlides = allSlides.concat(slides);
    }

    if (allSlides.length === 0) {
      console.error('\n❌ No slides could be parsed from notes\n');
      return;
    }

    // Set presentation metadata
    this.pptx.author = 'PPTX Builder';
    this.pptx.company = 'AI Generated';
    this.pptx.subject = 'Presentation';
    this.pptx.title = allSlides[0]?.title || 'Presentation';

    // Create slides
    console.log('\n📝 Creating slides...\n');
    for (const slide of allSlides) {
      if (slide.type === 'title') {
        this.createTitleSlide(slide);
        console.log(`   ✓ Title slide: ${slide.title}`);
      } else {
        this.createContentSlide(slide);
        console.log(`   ✓ Content slide: ${slide.title}`);
      }
    }

    // Add image slides
    if (images.length > 0) {
      console.log('\n🖼️  Adding images...\n');
      for (const imagePath of images) {
        await this.createImageSlide(imagePath);
        console.log(`   ✓ Image slide: ${path.basename(imagePath)}`);
      }
    }

    // Save presentation
    console.log(`\n💾 Saving presentation as ${this.outputFile}...\n`);
    try {
      await this.pptx.writeFile({ fileName: this.outputFile });
      console.log(`✅ SUCCESS! Created ${this.outputFile}\n`);
      console.log(`📊 Summary:`);
      console.log(`   - Total slides: ${allSlides.length + images.length}`);
      console.log(`   - Content slides: ${allSlides.length}`);
      console.log(`   - Image slides: ${images.length}`);
      console.log(`\n🎉 Open with: open ${this.outputFile}\n`);
    } catch (error) {
      console.error(`\n❌ Error saving presentation: ${error.message}\n`);
    }
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const builder = new PptxBuilder();
  builder.build().catch(console.error);
}

export default PptxBuilder;
