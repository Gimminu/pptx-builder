#!/usr/bin/env node

/**
 * PPTX Builder - Main CLI
 * One command to rule them all: analyze GitHub repo and generate presentation
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..');

class PPTXBuilder {
  constructor(repoUrl, options = {}) {
    this.repoUrl = repoUrl;
    this.theme = options.theme || 'professional';
    this.output = options.output || 'presentation.pptx';
    this.dataDir = path.join(PROJECT_ROOT, 'data');
    this.outputDir = path.join(PROJECT_ROOT, 'output');
    
    this.analysisFile = path.join(this.dataDir, 'github_analysis.json');
    this.contentFile = path.join(this.dataDir, 'presentation_content.json');
  }
  
  async runPythonScript(scriptName, args = []) {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(PROJECT_ROOT, 'python', scriptName);
      const process = spawn('python3', [scriptPath, ...args]);
      
      let stdout = '';
      let stderr = '';
      
      process.stdout.on('data', (data) => {
        const output = data.toString();
        stdout += output;
        console.log(output.trim());
      });
      
      process.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      process.on('close', (code) => {
        if (code === 0) {
          resolve(stdout);
        } else {
          reject(new Error(`Python script failed: ${stderr}`));
        }
      });
    });
  }
  
  async analyzeRepository() {
    console.log('\n📊 Step 1/3: Analyzing GitHub repository...\n');
    await this.runPythonScript('github_analyzer_advanced.py', [
      this.repoUrl,
      this.analysisFile
    ]);
  }
  
  async generateContent() {
    console.log('\n🤖 Step 2/3: Generating presentation content with AI...\n');
    await this.runPythonScript('ai_generator_advanced.py', [
      this.analysisFile,
      this.contentFile
    ]);
  }
  
  async generatePPTX() {
    console.log('\n🎨 Step 3/3: Creating PowerPoint presentation...\n');
    
    // Load content
    const content = JSON.parse(await fs.readFile(this.contentFile, 'utf-8'));
    
    // Import PPTX generator
    const { default: PptxGenJS } = await import('pptxgenjs');
    const pptx = new PptxGenJS();
    
    // Set metadata
    pptx.author = 'PPTX Builder';
    pptx.company = 'AI Generated';
    pptx.title = content.title || 'Presentation';
    pptx.subject = content.subtitle || 'Repository Analysis';
    
    // Title slide
    const titleSlide = pptx.addSlide();
    titleSlide.background = { color: '1e3a8a' };
    
    titleSlide.addText(content.title, {
      x: 0.5,
      y: 2.0,
      w: 9,
      h: 1.5,
      fontSize: 48,
      bold: true,
      color: 'FFFFFF',
      align: 'center'
    });
    
    if (content.subtitle) {
      titleSlide.addText(content.subtitle, {
        x: 1,
        y: 3.8,
        w: 8,
        h: 0.8,
        fontSize: 24,
        color: 'e0e7ff',
        align: 'center'
      });
    }
    
    // Content slides
    for (const slide of content.slides || []) {
      if (slide.type === 'title') continue; // Skip duplicate title
      
      const pptxSlide = pptx.addSlide();
      
      // Add title
      pptxSlide.addText(slide.title, {
        x: 0.5,
        y: 0.4,
        w: 9,
        h: 0.6,
        fontSize: 32,
        bold: true,
        color: '1e3a8a'
      });
      
      // Add content
      if (slide.content && slide.content.length > 0) {
        const bullets = slide.content.map(text => ({
          text: text,
          options: { bullet: true, fontSize: 18, color: '334155' }
        }));
        
        pptxSlide.addText(bullets, {
          x: 0.7,
          y: 1.3,
          w: 8.6,
          h: 4.0,
          fontSize: 18,
          color: '334155'
        });
      }
      
      // Add visual suggestion as note
      if (slide.visual_suggestion) {
        pptxSlide.addNotes(`Visual: ${slide.visual_suggestion}\n\n${slide.speaker_notes || ''}`);
      } else if (slide.speaker_notes) {
        pptxSlide.addNotes(slide.speaker_notes);
      }
    }
    
    // Save
    await fs.mkdir(this.outputDir, { recursive: true });
    const outputPath = path.join(this.outputDir, this.output);
    
    await pptx.writeFile({ fileName: outputPath });
    
    console.log(`\n✅ Presentation created: ${outputPath}`);
    
    return outputPath;
  }
  
  async build() {
    const startTime = Date.now();
    
    console.log('\n' + '='.repeat(60));
    console.log('🚀 PPTX Builder - Advanced Presentation Generator');
    console.log('='.repeat(60));
    console.log(`\n📦 Repository: ${this.repoUrl}`);
    console.log(`🎨 Theme: ${this.theme}`);
    console.log(`💾 Output: ${this.output}\n`);
    
    try {
      // Ensure data directories exist
      await fs.mkdir(this.dataDir, { recursive: true });
      await fs.mkdir(this.outputDir, { recursive: true });
      
      // Run pipeline
      await this.analyzeRepository();
      await this.generateContent();
      const outputPath = await this.generatePPTX();
      
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      
      console.log('\n' + '='.repeat(60));
      console.log('✅ SUCCESS!');
      console.log('='.repeat(60));
      console.log(`\n📊 Analysis: ${this.analysisFile}`);
      console.log(`📝 Content: ${this.contentFile}`);
      console.log(`🎉 Presentation: ${outputPath}`);
      console.log(`\n⏱️  Total time: ${duration}s`);
      console.log(`\n💡 Open with: open ${outputPath}\n`);
      
    } catch (error) {
      console.error('\n❌ Error:', error.message);
      process.exit(1);
    }
  }
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
PPTX Builder - Advanced Presentation Generator

USAGE:
  npm start -- <repo_url> [options]
  node src/cli.js <repo_url> [options]

ARGUMENTS:
  repo_url        GitHub repository URL
                  Example: https://github.com/user/repo

OPTIONS:
  --theme <name>  Presentation theme (default: professional)
                  Available: professional, modern, minimal
  
  --output <file> Output filename (default: presentation.pptx)

EXAMPLES:
  # Basic usage
  npm start -- https://github.com/Gimminu/capstone-design

  # With options
  npm start -- https://github.com/user/repo --theme modern --output my-deck.pptx

  # Direct invocation
  node src/cli.js https://github.com/user/repo

REQUIREMENTS:
  - Node.js 18+
  - Python 3.9+
  - gh CLI (GitHub CLI)
  - GEMINI_API_KEY in .env file

MORE INFO:
  https://github.com/Gimminu/pptx-builder
`);
    process.exit(0);
  }
  
  const repoUrl = args[0];
  const options = {};
  
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--theme' && args[i + 1]) {
      options.theme = args[i + 1];
      i++;
    } else if (args[i] === '--output' && args[i + 1]) {
      options.output = args[i + 1];
      i++;
    }
  }
  
  const builder = new PPTXBuilder(repoUrl, options);
  await builder.build();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export default PPTXBuilder;
