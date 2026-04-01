"""
AI Content Generator using Google Gemini API
Generates presentation content based on GitHub repository data
"""

import os
import json
import sys
from typing import Dict, List
from dotenv import load_dotenv

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False
    print("Warning: google-generativeai not installed. Run: pip install google-generativeai")

load_dotenv()

class AIContentGenerator:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv('GEMINI_API_KEY')
        
        if not GEMINI_AVAILABLE:
            raise ImportError("google-generativeai package not installed")
        
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY not found. Set it in .env file or pass as argument")
        
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-pro')
    
    def generate_presentation_content(self, github_data: Dict) -> Dict:
        """Generate presentation content from GitHub data"""
        
        repo_info = github_data.get('repository', {})
        tags = github_data.get('tags', [])
        commits = github_data.get('recent_commits', [])
        contributors = github_data.get('contributors', [])
        
        # Build context for AI
        context = self._build_context(repo_info, tags, commits, contributors)
        
        # Generate content
        print("🤖 Generating presentation content with AI...")
        
        prompt = f"""
Based on the following GitHub repository data, create a professional presentation outline.

Repository Data:
{context}

Generate a JSON structure for a presentation with the following format:
{{
  "title": "Main presentation title",
  "subtitle": "Brief subtitle or tagline",
  "slides": [
    {{
      "type": "title|content|image|chart",
      "title": "Slide title",
      "content": ["bullet point 1", "bullet point 2", ...],
      "notes": "Speaker notes or additional context"
    }},
    ...
  ]
}}

Create 8-12 slides covering:
1. Title slide with repo name and description
2. Project overview
3. Key features or highlights
4. Release history (if tags exist)
5. Recent activity/commits
6. Contributors and team
7. Statistics (stars, forks, languages)
8. Call to action or next steps

Make it professional, concise, and engaging.
Return ONLY valid JSON, no markdown formatting.
"""
        
        try:
            response = self.model.generate_content(prompt)
            content = response.text.strip()
            
            # Try to parse JSON
            # Remove markdown code blocks if present
            if content.startswith('```'):
                content = content.split('```')[1]
                if content.startswith('json'):
                    content = content[4:]
            
            presentation_data = json.loads(content)
            
            print(f"✅ Generated {len(presentation_data.get('slides', []))} slides")
            
            return presentation_data
            
        except json.JSONDecodeError as e:
            print(f"❌ Failed to parse AI response as JSON: {e}")
            print(f"Raw response: {content[:500]}...")
            return self._generate_fallback_content(github_data)
        except Exception as e:
            print(f"❌ AI generation failed: {e}")
            return self._generate_fallback_content(github_data)
    
    def _build_context(self, repo_info: Dict, tags: List, commits: List, contributors: List) -> str:
        """Build context string from GitHub data"""
        context_parts = []
        
        if repo_info:
            context_parts.append(f"Repository: {repo_info.get('name', 'Unknown')}")
            context_parts.append(f"Description: {repo_info.get('description', 'No description')}")
            context_parts.append(f"Stars: {repo_info.get('stargazerCount', 0)}")
            context_parts.append(f"Forks: {repo_info.get('forkCount', 0)}")
            
            languages = repo_info.get('languages', [])
            if languages:
                lang_str = ', '.join([f"{l['node']['name']}" for l in languages[:3]])
                context_parts.append(f"Languages: {lang_str}")
        
        if tags:
            context_parts.append(f"\nReleases ({len(tags)} total):")
            for tag in tags[:5]:
                context_parts.append(f"  - {tag.get('tagName')} - {tag.get('name', 'No name')}")
        
        if commits:
            context_parts.append(f"\nRecent Commits:")
            for commit in commits[:5]:
                context_parts.append(f"  - {commit['message']} by {commit['author']}")
        
        if contributors:
            contrib_names = ', '.join([c['login'] for c in contributors[:5]])
            context_parts.append(f"\nTop Contributors: {contrib_names}")
        
        return '\n'.join(context_parts)
    
    def _generate_fallback_content(self, github_data: Dict) -> Dict:
        """Generate basic presentation structure without AI"""
        print("⚠️  Using fallback content generation (no AI)")
        
        repo_info = github_data.get('repository', {})
        repo_name = github_data.get('metadata', {}).get('repo_name', 'Repository')
        
        return {
            "title": repo_name,
            "subtitle": repo_info.get('description', 'Project Presentation'),
            "slides": [
                {
                    "type": "title",
                    "title": repo_name,
                    "content": [repo_info.get('description', 'Project Presentation')],
                    "notes": "Opening slide"
                },
                {
                    "type": "content",
                    "title": "Project Overview",
                    "content": [
                        f"⭐ {repo_info.get('stargazerCount', 0)} stars",
                        f"🍴 {repo_info.get('forkCount', 0)} forks",
                        "Built with modern technologies"
                    ],
                    "notes": "Project statistics and overview"
                },
                {
                    "type": "content",
                    "title": "Recent Activity",
                    "content": [
                        f"{len(github_data.get('recent_commits', []))} recent commits",
                        f"{len(github_data.get('tags', []))} releases",
                        "Active development"
                    ],
                    "notes": "Development activity summary"
                }
            ]
        }

def main():
    if len(sys.argv) < 2:
        print("Usage: python ai_generator.py <github_data.json> [output_file]")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else 'data/presentation_content.json'
    
    # Load GitHub data
    with open(input_file, 'r', encoding='utf-8') as f:
        github_data = json.load(f)
    
    # Generate content
    generator = AIContentGenerator()
    presentation_data = generator.generate_presentation_content(github_data)
    
    # Save to JSON
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(presentation_data, f, indent=2, ensure_ascii=False)
    
    print(f"\n💾 Presentation content saved to: {output_file}")

if __name__ == '__main__':
    main()
