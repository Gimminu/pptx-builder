# Free AI Presentation Workflow using Google Antigravity

## Workflow Summary (5 Points)

1. **Install Google Antigravity IDE** - Download AI-powered IDE that uses Gemini 3 models
2. **Set up project folder** - Create `notes/` and `images/` folders for your content  
3. **Add your assets** - Put presentation content (text files) and images in folders
4. **Install presentation skill** - Add custom AI skill for PPTX generation to Antigravity
5. **Run AI prompt** - Ask Antigravity agent to generate `.pptx` file from your assets

---

## Prerequisites

### macOS (Monterey 12 or later, 64-bit)
- macOS Monterey 12.0+
- 4GB RAM minimum (8GB recommended)
- 500MB free disk space
- Internet connection

### Windows (10 or later, 64-bit)
- Windows 10 (64-bit) or later
- 4GB RAM minimum (8GB recommended)  
- 500MB free disk space
- Internet connection

### Linux (64-bit with glibc 2.28+)
- 64-bit Linux distribution
- glibc 2.28 or later
- glibcxx 3.4.25 or later
- 4GB RAM minimum (8GB recommended)
- 500MB free disk space
- Internet connection

---

## Minimal Setup Plan

### 1. Install

**Purpose**: Get Google Antigravity IDE running on your system

**User Action**:

**macOS**:
```bash
# Download from official website
open https://antigravity.google/

# Or use Homebrew (확인 필요)
brew install --cask google-antigravity
```

**Windows**:
```powershell
# Download installer from official website
Start-Process "https://antigravity.google/"

# Run the downloaded .exe file
# Follow installation wizard
```

**Linux**:
```bash
# Download .deb or .rpm from official website
wget https://antigravity.google/download/linux

# For Debian/Ubuntu:
sudo dpkg -i google-antigravity_*.deb

# For Fedora/RHEL:
sudo rpm -i google-antigravity-*.rpm
```

**Expected Result**:
- Google Antigravity icon appears in Applications/Programs
- Launching shows "Welcome to Google Antigravity" screen
- You see Editor view with Agent sidebar

**How to Verify**:
```bash
# macOS/Linux: Check if installed
which antigravity

# All platforms: Launch and check version
# Open Antigravity → Help → About
# Should show version 1.21.x or later
```

**Common Failure**:
- **"Cannot open because developer cannot be verified" (macOS)**: Go to System Preferences → Security & Privacy → Click "Open Anyway"
- **"Missing dependencies" (Linux)**: Install glibc: `sudo apt-get install libc6` or `sudo yum install glibc`
- **Download fails**: Check internet connection, try different browser

---

### 2. Folder Setup

**Purpose**: Create organized structure for presentation content

**User Action**:
```bash
# Create project folder
mkdir my-presentation
cd my-presentation

# Create subfolders
mkdir notes images

# Verify structure
ls -la
```

**Expected Result**:
```
my-presentation/
├── notes/          (empty folder)
└── images/         (empty folder)
```

**How to Verify**:
```bash
# Check folders exist
ls -d notes images

# Should output:
# notes
# images
```

**Common Failure**:
- **"Permission denied"**: Run from your home directory or Documents folder, not system folders
- **Folders not created**: Check you're in the right directory with `pwd`

---

### 3. Add Assets

**Purpose**: Prepare content that AI will use to build presentation

**User Action**:

**Step 1: Create content file**
```bash
# Create a simple markdown file with your content
cat > notes/content.md << 'EOF'
# My Presentation Title

## Slide 1: Introduction
- Welcome message
- Brief overview
- Key objectives

## Slide 2: Main Points
- Point 1: First important topic
- Point 2: Second important topic  
- Point 3: Third important topic

## Slide 3: Conclusion
- Summary
- Call to action
- Thank you
EOF
```

**Step 2: Add images (optional)**
```bash
# Copy your images to images folder
# Files should be .jpg or .png
# Use descriptive English names

# Example:
cp ~/Downloads/company-logo.png images/
cp ~/Downloads/chart.jpg images/
```

**Expected Result**:
```
my-presentation/
├── notes/
│   └── content.md         (your presentation content)
└── images/
    ├── company-logo.png   (optional)
    └── chart.jpg          (optional)
```

**How to Verify**:
```bash
# Check notes file
cat notes/content.md

# Check images
ls images/
```

**Common Failure**:
- **Image files too large**: Resize images to under 5MB each
- **Special characters in filenames**: Rename to use only letters, numbers, hyphens
- **File encoding issues**: Save .md files as UTF-8 encoding

---

### 4. Install Skill

**Purpose**: Add presentation-generation capability to Antigravity

**User Action**:

확인 필요: Exact method to install skills in Antigravity

**Option A: Via Antigravity Marketplace** (most likely)
```
1. Open Google Antigravity
2. Go to Extensions/Marketplace (Cmd+Shift+X or Ctrl+Shift+X)
3. Search for "presentation" or "PPTX"
4. Click "Install" on the presentation skill
5. Wait for installation to complete
```

**Option B: Via Command Palette** (확인 필요)
```
1. Open Google Antigravity
2. Press Cmd+Shift+P (macOS) or Ctrl+Shift+P (Windows/Linux)
3. Type "Install Skill"
4. Search for presentation skill
5. Install
```

**Option C: Manual Installation** (확인 필요)
```bash
# If skills are in a repository
git clone https://github.com/google/antigravity-skills
cd antigravity-skills/presentation
# Follow README instructions
```

**Expected Result**:
- Skill appears in Antigravity Extensions list
- Status shows "Installed" or "Enabled"
- Agent can recognize presentation-related commands

**How to Verify**:
```
1. Open Antigravity
2. Go to Extensions panel
3. Search installed extensions for "presentation" or "PPTX"
4. Should show as active/enabled
```

**Common Failure**:
- **Skill not found**: Check you're using latest Antigravity version
- **Installation fails**: Check internet connection, restart Antigravity
- **Skill installed but not working**: Reload Antigravity window (Cmd+R or Ctrl+R)

---

### 5. Run Prompt

**Purpose**: Use AI agent to generate PowerPoint file

**User Action**:

**Step 1: Open project in Antigravity**
```bash
# From terminal, open project folder in Antigravity
cd my-presentation

# macOS/Linux:
antigravity .

# Or from Antigravity:
# File → Open Folder → Select my-presentation
```

**Step 2: Open Agent panel**
```
- Click Agent icon in sidebar (robot icon)
- Or press Cmd+Shift+A (macOS) or Ctrl+Shift+A (Windows/Linux)
```

**Step 3: Enter prompt**
```
Create a PowerPoint presentation using the content in notes/content.md

Requirements:
- Professional design with clean layout
- Use images from images/ folder where appropriate
- 5-10 slides total
- Modern color scheme (blue/gray tones)
- Save as presentation.pptx

Apply best practices for slide design.
```

**Step 4: Let agent work**
```
- Agent will show progress in Agent panel
- You'll see it reading files, planning structure, generating slides
- Wait for "Task completed" message (usually 1-3 minutes)
```

**Expected Result**:
- Agent shows step-by-step progress
- You see artifacts (task list, plan, etc.) in Agent panel
- File `presentation.pptx` appears in project folder
- No error messages

**How to Verify**:
```bash
# Check if PPTX file was created
ls -lh presentation.pptx

# Should show file with size (e.g., 500K - 5MB)
# Modified timestamp should be recent
```

**Common Failure**:
- **Agent doesn't respond**: Check internet connection, Gemini API may be rate-limited
- **"Skill not found" error**: Re-install presentation skill (see step 4)
- **Empty or corrupt PPTX**: Check notes/content.md has valid content, try simpler prompt
- **Rate limit exceeded**: Wait 1 hour and try again, or upgrade to paid plan (확인 필요)

---

### 6. Export/Open PPTX

**Purpose**: View and edit the generated presentation

**User Action**:

**macOS**:
```bash
# Open with default app (Keynote or PowerPoint)
open presentation.pptx

# Or specific app:
open -a "Microsoft PowerPoint" presentation.pptx
open -a "Keynote" presentation.pptx
```

**Windows**:
```powershell
# Open with default app
Start-Process presentation.pptx

# Or specific app:
Start-Process "C:\Program Files\Microsoft Office\root\Office16\POWERPNT.EXE" presentation.pptx
```

**Linux**:
```bash
# LibreOffice Impress
libreoffice --impress presentation.pptx

# Or OnlyOffice
onlyoffice-desktopeditors presentation.pptx

# Or upload to Google Slides
# (manually via web browser)
```

**Expected Result**:
- PowerPoint/Keynote/LibreOffice opens
- You see title slide with your content
- Navigate through all slides
- Images are properly placed
- Text is readable and well-formatted

**How to Verify**:
- Manually click through each slide
- Check:
  - All content from notes/content.md is present
  - Images appear correctly
  - No Lorem Ipsum or placeholder text
  - Consistent design across slides

**Common Failure**:
- **File won't open**: May be corrupted, try generating again with simpler content
- **Missing content**: Prompt may have been unclear, try more specific instructions
- **Poor formatting**: Regenerate with more detailed design requirements in prompt
- **Images missing/broken**: Check image file formats (.jpg, .png only), check file paths

---

## Notes

### Free Plan Limitations (확인 필요)
- Gemini 3.1 Pro: "Generous rate limits" but exact numbers not specified
- May be limited requests per hour/day
- File size limits may apply to generated PPTX

### Quality Expectations
- AI output varies between runs
- First attempt may not be perfect
- Iterate on prompts for better results
- Complex designs may need manual refinement

### Best Practices
1. Start simple (3-5 slides) to test workflow
2. Use clear, structured markdown in notes/
3. Keep images under 2MB each
4. Be specific in prompts about design preferences
5. Always review and edit AI output before presenting

### Troubleshooting

**Cannot install Antigravity**:
- Check system requirements match
- Download from official site only: https://antigravity.google/
- Check antivirus isn't blocking installation

**Skill not working**:
- Restart Antigravity
- Check Antigravity version (must be 1.11.2+)
- Reinstall skill
- Check Gemini API connection in Antigravity settings

**Poor quality output**:
- Refine prompt with more specific requirements
- Break complex presentations into multiple simpler requests
- Add more structure to notes/content.md
- Try different phrasing in prompt

**Rate limits hit**:
- Wait 1 hour and retry
- Use fewer/smaller slides
- Consider paid plan for higher limits (확인 필요)

---

## Quick Reference

```bash
# 1. Install Antigravity
# Download from https://antigravity.google/

# 2. Setup
mkdir my-presentation && cd my-presentation
mkdir notes images

# 3. Add content
echo "# My Presentation" > notes/content.md
# Add your content to notes/content.md

# 4. Open in Antigravity
antigravity .

# 5. In Antigravity Agent panel, run:
# "Create PowerPoint from notes/content.md, save as presentation.pptx"

# 6. Open result
open presentation.pptx
```
