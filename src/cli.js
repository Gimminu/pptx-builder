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
    
    // Import PPTX generator, template, and charts
    const { default: PptxGenJS } = await import('pptxgenjs');
    const template = await import(`./templates/${this.theme}.js`);
    const charts = await import('./templates/charts.js');
    
    const pptx = new PptxGenJS();
    
    // Set metadata
    pptx.author = 'PPTX Builder';
    pptx.company = 'AI Generated';
    pptx.title = content.title || 'Presentation';
    pptx.subject = content.subtitle || 'Repository Analysis';
    pptx.layout = 'LAYOUT_WIDE';
    pptx.defineLayout({ name: 'CUSTOM', width: 10, height: 7.5 });
    pptx.layout = 'CUSTOM';
    
    console.log(`   📐 Using template: ${this.theme}`);
    
    // Title slide using template
    template.createTitleSlide(pptx, {
      title: content.title,
      subtitle: content.subtitle
    });
    
    console.log(`   ✓ Created title slide`);
    
    // Content slides using template
    let slideCount = 1;
    const analysisData = content.analysis_data || {};
    
    for (const slideData of content.slides || []) {
      if (slideData.type === 'title') continue; // Skip duplicate title
      
      // Create slide based on type
      if (slideData.type === 'timeline') {
        template.createTimelineSlide(pptx, slideData);
      } else if (slideData.type === 'stats') {
        template.createStatsSlide(pptx, slideData);
        
        // Add chart if data available
        if (slideData.chart_data) {
          const slide = pptx.getSlide(slideCount);
          if (slideData.chart_data.type === 'timeline' && slideData.chart_data.data) {
            // Timeline is rendered by template, skip chart
          }
        }
      } else if (slideData.type === 'team') {
        template.createTeamSlide(pptx, slideData);
      } else {
        // Regular content slide
        template.createContentSlide(pptx, slideData);
        
        // Add chart if specified
        if (slideData.chart_data) {
          const slide = pptx.slides[pptx.slides.length - 1];
          
          if (slideData.chart_data.type === 'pie' && slideData.chart_data.data) {
            const chartData = slideData.chart_data.data.map(lang => ({
              label: lang.name,
              value: lang.percentage
            }));
            charts.createPieChart(slide, chartData, {
              x: 5.5,
              y: 1.8,
              w: 4,
              h: 4.5,
              title: ''
            });
          }
        }
      }
      
      console.log(`   ✓ Slide ${slideCount}: ${slideData.title}`);
      slideCount++;
    }
    
    // Save
    await fs.mkdir(this.outputDir, { recursive: true });
    const outputPath = path.join(this.outputDir, this.output);
    
    await pptx.writeFile({ fileName: outputPath });
    
    console.log(`\n✅ Presentation created: ${outputPath}`);
    console.log(`   📊 Total slides: ${slideCount + 1}`);
    
    const stats = await fs.stat(outputPath);
    console.log(`   💾 File size: ${(stats.size / 1024).toFixed(1)} KB`);
    
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
