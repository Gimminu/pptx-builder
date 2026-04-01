#!/usr/bin/env python3
"""
Advanced AI Content Generator using Google Gemini API
Creates high-quality presentation content with deep analysis
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
    print("❌ google-generativeai not installed.")
    print("Install with: pip install -r python/requirements.txt")
    sys.exit(1)

load_dotenv()


class AdvancedAIContentGenerator:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv('GEMINI_API_KEY')
        
        if not self.api_key:
            print("❌ GEMINI_API_KEY not found in .env file")
            print("\nPlease add your API key to .env:")
            print("  GEMINI_API_KEY=your_api_key_here")
            print("\nGet API key from: https://makersuite.google.com/app/apikey")
            sys.exit(1)
        
        genai.configure(api_key=self.api_key)
        # Try different model names
        try:
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        except:
            try:
                self.model = genai.GenerativeModel('gemini-1.5-pro')
            except:
                self.model = genai.GenerativeModel('models/gemini-1.5-flash')
    
    def generate_presentation_content(self, analysis_data: Dict) -> Dict:
        """Generate comprehensive presentation content from analysis"""
        
        print("\n" + "="*60)
        print("🤖 Generating AI-powered presentation content")
        print("="*60 + "\n")
        
        metadata = analysis_data.get('metadata', {})
        repo_info = analysis_data.get('repository', {})
        goals = analysis_data.get('project_goals', {})
        tags = analysis_data.get('tags', [])
        tag_evolution = analysis_data.get('tag_evolution', [])
        timeline = analysis_data.get('commit_timeline', {})
        contributors = analysis_data.get('contributors', [])
        lang_breakdown = analysis_data.get('language_breakdown', {})
        summary = analysis_data.get('summary', {})
        
        # Build comprehensive context
        context = self._build_detailed_context(
            repo_info, goals, tags, tag_evolution, timeline, 
            contributors, lang_breakdown, summary
        )
        
        # Generate with advanced prompt
        prompt = self._create_advanced_prompt(context, metadata.get('repo_name', 'Project'))
        
        print("📝 Requesting content from Gemini AI...")
        print(f"   Context size: {len(context)} characters")
        
        try:
            response = self.model.generate_content(prompt)
            content = response.text.strip()
            
            print("✅ AI response received")
            
            # Parse JSON from response
            presentation_data = self._extract_json_from_response(content)
            
            if presentation_data:
                slide_count = len(presentation_data.get('slides', []))
                print(f"✅ Generated {slide_count} slides\n")
                return presentation_data
            else:
                print("⚠️  Failed to parse AI response, using enhanced fallback")
                return self._generate_enhanced_fallback(analysis_data)
                
        except Exception as e:
            print(f"❌ AI generation error: {e}")
            print("⚠️  Using enhanced fallback content generator")
            return self._generate_enhanced_fallback(analysis_data)
    
    def _build_detailed_context(self, repo_info, goals, tags, tag_evolution, 
                                 timeline, contributors, lang_breakdown, summary) -> str:
        """Build detailed context for AI"""
        parts = []
        
        # Basic info
        parts.append(f"PROJECT: {repo_info.get('name', 'Unknown')}")
        parts.append(f"DESCRIPTION: {repo_info.get('description', 'No description')}")
        parts.append(f"CREATED: {repo_info.get('createdAt', 'Unknown')[:10]}")
        parts.append(f"AGE: {summary.get('age_days', 0)} days")
        parts.append("")
        
        # Project goals
        if goals.get('summary'):
            parts.append(f"PROJECT SUMMARY: {goals['summary']}")
        if goals.get('objectives'):
            parts.append("OBJECTIVES:")
            for obj in goals['objectives'][:5]:
                parts.append(f"  - {obj}")
        if goals.get('features'):
            parts.append("KEY FEATURES:")
            for feat in goals['features'][:5]:
                parts.append(f"  - {feat}")
        parts.append("")
        
        # Languages
        if lang_breakdown.get('languages'):
            parts.append("TECHNOLOGY STACK:")
            for lang in lang_breakdown['languages'][:3]:
                parts.append(f"  - {lang['name']}: {lang['percentage']}%")
            parts.append("")
        
        # Contributors
        if contributors:
            parts.append(f"TEAM: {len(contributors)} contributors")
            top_contributors = ', '.join([c['login'] for c in contributors[:3]])
            parts.append(f"Top contributors: {top_contributors}")
            parts.append("")
        
        # Release history
        if tags:
            parts.append(f"RELEASES: {len(tags)} total")
            for tag in tags[:3]:
                tag_name = tag.get('tagName', 'Unknown')
                tag_date = tag.get('publishedAt', '')[:10]
                parts.append(f"  - {tag_name} ({tag_date})")
            parts.append("")
        
        # Evolution analysis
        if tag_evolution:
            parts.append("VERSION EVOLUTION:")
            for evo in tag_evolution[:3]:
                from_tag = evo['from']
                to_tag = evo['to']
                commits = evo['commits_count']
                changes = evo['changes']
                
                parts.append(f"  {from_tag} → {to_tag}:")
                parts.append(f"    - {commits} commits")
                parts.append(f"    - {changes.get('features', 0)} new features")
                parts.append(f"    - {changes.get('fixes', 0)} bug fixes")
            parts.append("")
        
        # Activity timeline
        if timeline.get('timeline'):
            recent_months = timeline['timeline'][-3:]
            parts.append("RECENT ACTIVITY:")
            for month in recent_months:
                parts.append(f"  {month['month']}: {month['commits']} commits")
            parts.append("")
        
        # Stats
        parts.append("STATISTICS:")
        parts.append(f"  - Total commits: {timeline.get('total_commits', 0)}")
        parts.append(f"  - Stars: {repo_info.get('stargazerCount', 0)}")
        parts.append(f"  - Forks: {repo_info.get('forkCount', 0)}")
        
        return '\n'.join(parts)
    
    def _create_advanced_prompt(self, context: str, repo_name: str) -> str:
        """Create sophisticated prompt for AI"""
        return f"""You are an expert technical presenter creating a professional presentation about a software project.

REPOSITORY DATA:
{context}

TASK:
Create a compelling, high-quality presentation (10-15 slides) that tells the story of this project's evolution and achievements.

PRESENTATION STRUCTURE:
1. Title slide with project name and compelling tagline
2. Project overview and objectives
3. Technology stack and architecture highlights
4. Evolution timeline (how the project evolved from initial version to current)
5. Key milestones and releases
6. Major features and capabilities
7. Development activity and momentum
8. Team and contributors
9. Impact and statistics
10. Future roadmap or call-to-action

QUALITY REQUIREMENTS:
- Professional, polished language
- Concise bullet points (3-5 per slide maximum)
- Focus on achievements and progress
- Highlight key technical decisions
- Show growth and evolution clearly
- Use data to tell a compelling story

OUTPUT FORMAT:
Return ONLY a valid JSON object (no markdown code blocks) with this structure:
{{
  "title": "Main presentation title",
  "subtitle": "Compelling subtitle",
  "theme_suggestion": "professional|modern|technical",
  "slides": [
    {{
      "type": "title|content|timeline|stats|team",
      "title": "Slide title",
      "content": ["Concise bullet point 1", "bullet 2", "bullet 3"],
      "speaker_notes": "Key points to emphasize",
      "visual_suggestion": "chart|image|diagram description"
    }}
  ]
}}

Generate professional, engaging content NOW:"""
    
    def _extract_json_from_response(self, content: str) -> Dict:
        """Extract and parse JSON from AI response"""
        # Remove markdown code blocks
        if '```json' in content:
            content = content.split('```json')[1].split('```')[0]
        elif '```' in content:
            content = content.split('```')[1].split('```')[0]
        
        content = content.strip()
        
        try:
            return json.loads(content)
        except json.JSONDecodeError as e:
            print(f"   ⚠️  JSON parse error: {e}")
            print(f"   First 200 chars: {content[:200]}")
            return None
    
    def _generate_enhanced_fallback(self, analysis_data: Dict) -> Dict:
        """Generate high-quality fallback content without AI"""
        print("📋 Generating enhanced fallback presentation...")
        
        repo_info = analysis_data.get('repository', {})
        goals = analysis_data.get('project_goals', {})
        tag_evolution = analysis_data.get('tag_evolution', [])
        summary = analysis_data.get('summary', {})
        lang_breakdown = analysis_data.get('language_breakdown', {})
        timeline = analysis_data.get('commit_timeline', {})
        contributors = analysis_data.get('contributors', [])
        
        repo_name = analysis_data['metadata'].get('repo_name', 'Project')
        
        slides = []
        
        # Title slide
        slides.append({
            "type": "title",
            "title": repo_name,
            "content": [
                repo_info.get('description', 'Project Presentation'),
                f"📅 {summary.get('age_days', 0)}일간의 개발 여정"
            ],
            "speaker_notes": "프로젝트 소개 슬라이드"
        })
        
        # Project overview
        overview_content = []
        if repo_info.get('description'):
            overview_content.append(f"📝 {repo_info['description']}")
        overview_content.extend([
            f"⭐ {repo_info.get('stargazerCount', 0)} stars",
            f"🍴 {repo_info.get('forkCount', 0)} forks",
            f"💻 주요 언어: {summary.get('primary_language', 'Unknown')}",
            f"👥 {summary.get('total_contributors', 0)}명의 기여자"
        ])
        
        slides.append({
            "type": "content",
            "title": "프로젝트 개요",
            "content": overview_content,
            "speaker_notes": "프로젝트 기본 정보 및 통계",
            "visual_suggestion": "stats overview"
        })
        
        # Project goals
        if goals.get('objectives'):
            slides.append({
                "type": "content",
                "title": "프로젝트 목표",
                "content": goals['objectives'][:5],
                "speaker_notes": "프로젝트의 핵심 목표와 방향성"
            })
        
        # Technology stack with chart
        if lang_breakdown.get('languages'):
            tech_content = [
                f"{lang['name']}: {lang['percentage']}%"
                for lang in lang_breakdown['languages'][:5]
            ]
            slides.append({
                "type": "content",
                "title": "기술 스택",
                "content": tech_content,
                "speaker_notes": "프로젝트에서 사용하는 주요 기술",
                "visual_suggestion": "pie chart",
                "chart_data": {
                    "type": "pie",
                    "data": lang_breakdown['languages'][:5]
                }
            })
        
        # Version evolution
        if tag_evolution:
            evo_content = []
            for evo in tag_evolution[:5]:
                changes = evo['changes']
                evo_content.append(
                    f"{evo['from']} → {evo['to']}: "
                    f"{evo['commits_count']}개 커밋, "
                    f"{changes.get('features', 0)}개 기능, "
                    f"{changes.get('fixes', 0)}개 수정"
                )
            
            slides.append({
                "type": "timeline",
                "title": "버전 진화 과정",
                "content": evo_content,
                "speaker_notes": "프로젝트가 어떻게 발전해왔는지 보여주는 타임라인",
                "visual_suggestion": "timeline visualization"
            })
        
        # Development activity with chart
        if timeline.get('timeline'):
            activity_content = []
            recent_months = timeline['timeline'][-6:]
            
            for month_data in recent_months:
                activity_content.append(
                    f"{month_data['month']}: {month_data['commits']}개 커밋"
                )
            
            slides.append({
                "type": "stats",
                "title": "개발 활동 추이",
                "content": activity_content,
                "speaker_notes": "시간에 따른 개발 활동 추이",
                "visual_suggestion": "line chart",
                "chart_data": {
                    "type": "timeline",
                    "data": recent_months
                }
            })
        
        # Key features
        if goals.get('features'):
            slides.append({
                "type": "content",
                "title": "주요 기능",
                "content": goals['features'][:5],
                "speaker_notes": "프로젝트의 핵심 기능들"
            })
        
        # Team
        if contributors:
            team_content = []
            for c in contributors[:8]:
                team_content.append(
                    f"{c['login']}: {c['contributions']}개 기여"
                )
            
            slides.append({
                "type": "team",
                "title": f"팀 ({len(contributors)}명의 기여자)",
                "content": team_content,
                "speaker_notes": "프로젝트에 기여한 핵심 멤버들",
                "chart_data": {
                    "type": "contributors",
                    "data": contributors[:5]
                }
            })
        
        # Summary stats
        slides.append({
            "type": "stats",
            "title": "프로젝트 통계",
            "content": [
                f"📦 {summary.get('total_releases', 0)}개 릴리스",
                f"💾 {timeline.get('total_commits', 0)}개 커밋",
                f"👥 {summary.get('total_contributors', 0)}명 기여자",
                f"⭐ {repo_info.get('stargazerCount', 0)}개 스타",
                f"🔄 {repo_info.get('forkCount', 0)}개 포크",
                f"📅 {summary.get('age_days', 0)}일 개발 기간"
            ],
            "speaker_notes": "프로젝트의 주요 성과 지표"
        })
        
        # Call to action
        slides.append({
            "type": "content",
            "title": "다음 단계",
            "content": [
                "🚀 프로젝트 계속 발전시키기",
                "📖 문서화 개선",
                "🤝 새로운 기여자 환영",
                "✨ 피드백 및 제안 환영",
                f"🔗 {repo_info.get('name', repo_name)}"
            ],
            "speaker_notes": "프로젝트 발전 방향 및 참여 독려"
        })
        
        return {
            "title": repo_name,
            "subtitle": repo_info.get('description', 'Project Presentation'),
            "theme_suggestion": "professional",
            "slides": slides,
            "analysis_data": {
                "languages": lang_breakdown.get('languages', []),
                "timeline": timeline.get('timeline', []),
                "contributors": contributors
            }
        }


def main():
    if len(sys.argv) < 2:
        print("Usage: python ai_generator_advanced.py <github_analysis.json> [output_file]")
        print("\nExample:")
        print("  python ai_generator_advanced.py data/github_analysis.json")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else 'data/presentation_content.json'
    
    # Load analysis data
    print(f"📂 Loading analysis from: {input_file}")
    with open(input_file, 'r', encoding='utf-8') as f:
        analysis_data = json.load(f)
    
    # Generate content
    generator = AdvancedAIContentGenerator()
    presentation_data = generator.generate_presentation_content(analysis_data)
    
    # Save to JSON
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(presentation_data, f, indent=2, ensure_ascii=False)
    
    print("="*60)
    print(f"✅ Presentation content saved to: {output_file}")
    print("="*60 + "\n")


if __name__ == '__main__':
    main()
