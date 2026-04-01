#!/usr/bin/env python3
"""
Advanced GitHub Repository Analyzer
Deep analysis including tag evolution, commit patterns, and code changes
"""

import os
import json
import sys
import subprocess
from datetime import datetime
from typing import Dict, List, Optional
from collections import defaultdict

class AdvancedGitHubAnalyzer:
    def __init__(self, repo_url: str):
        self.repo_url = repo_url
        self.repo_owner = None
        self.repo_name = None
        self._parse_repo_url()
        self.repo_full = f"{self.repo_owner}/{self.repo_name}"
    
    def _parse_repo_url(self):
        """Parse GitHub URL to extract owner and repo name"""
        parts = self.repo_url.rstrip('/').split('/')
        if len(parts) >= 2:
            self.repo_name = parts[-1].replace('.git', '')
            self.repo_owner = parts[-2]
        else:
            raise ValueError(f"Invalid GitHub URL: {self.repo_url}")
    
    def _run_gh_command(self, args: List[str]) -> Optional[str]:
        """Run gh CLI command and return output"""
        try:
            result = subprocess.run(
                ['gh'] + args,
                capture_output=True,
                text=True,
                check=True
            )
            return result.stdout
        except subprocess.CalledProcessError as e:
            print(f"⚠️  Warning: {e.stderr}", file=sys.stderr)
            return None
        except FileNotFoundError:
            print("❌ Error: gh CLI not found. Install from https://cli.github.com", file=sys.stderr)
            sys.exit(1)
    
    def get_repository_info(self) -> Dict:
        """Get comprehensive repository information"""
        print("📊 Fetching repository metadata...")
        output = self._run_gh_command([
            'repo', 'view', self.repo_full, '--json',
            'name,description,stargazerCount,forkCount,createdAt,pushedAt,'
            'languages,licenseInfo,isPrivate,isFork,defaultBranchRef,diskUsage'
        ])
        
        if output:
            data = json.loads(output)
            print(f"   ✓ {data.get('name', 'Unknown')}")
            print(f"   ✓ {data.get('stargazerCount', 0)} stars, {data.get('forkCount', 0)} forks")
            return data
        return {}
    
    def get_tags_with_details(self) -> List[Dict]:
        """Get tags/releases with detailed information"""
        print("🏷️  Analyzing tags and releases...")
        output = self._run_gh_command([
            'release', 'list', '-R', self.repo_full, '--json',
            'tagName,name,publishedAt,isPrerelease,isDraft,body,author',
            '-L', '50'
        ])
        
        if output:
            tags = json.loads(output)
            print(f"   ✓ Found {len(tags)} releases")
            return tags
        return []
    
    def get_tag_evolution(self, tags: List[Dict]) -> List[Dict]:
        """Analyze evolution between tags"""
        if not tags or len(tags) < 2:
            return []
        
        print("🔄 Analyzing tag evolution...")
        evolution = []
        
        # Sort tags by date
        sorted_tags = sorted(tags, key=lambda x: x.get('publishedAt', ''))
        
        for i in range(len(sorted_tags) - 1):
            current_tag = sorted_tags[i]
            next_tag = sorted_tags[i + 1]
            
            current_name = current_tag.get('tagName', '')
            next_name = next_tag.get('tagName', '')
            
            # Get commits between tags
            commits = self.get_commits_between_tags(current_name, next_name)
            
            evolution.append({
                'from': current_name,
                'to': next_name,
                'from_date': current_tag.get('publishedAt'),
                'to_date': next_tag.get('publishedAt'),
                'commits_count': len(commits),
                'commits': commits[:10],  # Top 10 commits
                'changes': self.analyze_changes(commits)
            })
        
        print(f"   ✓ Analyzed {len(evolution)} version transitions")
        return evolution
    
    def get_commits_between_tags(self, tag1: str, tag2: str) -> List[Dict]:
        """Get commits between two tags"""
        output = self._run_gh_command([
            'api', f'repos/{self.repo_full}/compare/{tag1}...{tag2}',
            '-q', '.commits'
        ])
        
        if output:
            commits = json.loads(output)
            return [{
                'sha': c['sha'][:7],
                'message': c['commit']['message'].split('\n')[0],
                'author': c['commit']['author']['name'],
                'date': c['commit']['author']['date']
            } for c in commits]
        return []
    
    def analyze_changes(self, commits: List[Dict]) -> Dict:
        """Analyze patterns in commits"""
        patterns = {
            'features': 0,
            'fixes': 0,
            'docs': 0,
            'refactor': 0,
            'other': 0
        }
        
        for commit in commits:
            msg = commit['message'].lower()
            if 'feat' in msg or 'add' in msg or 'implement' in msg:
                patterns['features'] += 1
            elif 'fix' in msg or 'bug' in msg:
                patterns['fixes'] += 1
            elif 'doc' in msg or 'readme' in msg:
                patterns['docs'] += 1
            elif 'refactor' in msg or 'improve' in msg:
                patterns['refactor'] += 1
            else:
                patterns['other'] += 1
        
        return patterns
    
    def get_commit_timeline(self, limit: int = 100) -> Dict:
        """Get commit timeline for activity visualization"""
        print("📈 Building commit timeline...")
        output = self._run_gh_command([
            'api', f'repos/{self.repo_full}/commits',
            '-q', f'.[:{limit}]'
        ])
        
        if output:
            commits = json.loads(output)
            
            # Group by month
            timeline = defaultdict(int)
            for commit in commits:
                date = commit['commit']['author']['date'][:7]  # YYYY-MM
                timeline[date] += 1
            
            sorted_timeline = [
                {'month': k, 'commits': v}
                for k, v in sorted(timeline.items())
            ]
            
            print(f"   ✓ Analyzed {len(commits)} commits across {len(timeline)} months")
            return {
                'total_commits': len(commits),
                'timeline': sorted_timeline
            }
        return {}
    
    def get_contributors_detailed(self) -> List[Dict]:
        """Get detailed contributor information"""
        print("👥 Analyzing contributors...")
        output = self._run_gh_command([
            'api', f'repos/{self.repo_full}/contributors',
            '-q', '.[:20]'
        ])
        
        if output:
            contributors = json.loads(output)
            detailed = []
            
            for c in contributors:
                detailed.append({
                    'login': c['login'],
                    'contributions': c['contributions'],
                    'avatar_url': c.get('avatar_url', ''),
                    'profile_url': c.get('html_url', '')
                })
            
            print(f"   ✓ Found {len(detailed)} contributors")
            return detailed
        return []
    
    def get_language_breakdown(self, repo_info: Dict) -> Dict:
        """Calculate language percentages"""
        languages = repo_info.get('languages', [])
        if not languages:
            return {}
        
        total_size = sum(l['size'] for l in languages)
        breakdown = []
        
        for lang in languages:
            percentage = (lang['size'] / total_size * 100) if total_size > 0 else 0
            breakdown.append({
                'name': lang['node']['name'],
                'percentage': round(percentage, 1),
                'bytes': lang['size']
            })
        
        return {
            'languages': sorted(breakdown, key=lambda x: x['percentage'], reverse=True),
            'primary': breakdown[0]['name'] if breakdown else 'Unknown'
        }
    
    def get_project_goals(self) -> Dict:
        """Extract project goals from README"""
        print("🎯 Extracting project goals...")
        output = self._run_gh_command([
            'api', f'repos/{self.repo_full}/readme',
            '-q', '.content'
        ])
        
        if output:
            import base64
            try:
                readme_content = base64.b64decode(output).decode('utf-8')
                
                # Extract goals/objectives section
                goals = self._extract_goals_from_readme(readme_content)
                print(f"   ✓ Extracted project goals")
                return goals
            except Exception as e:
                print(f"   ⚠️  Could not parse README: {e}")
        
        return {'summary': '', 'objectives': []}
    
    def _extract_goals_from_readme(self, content: str) -> Dict:
        """Extract structured goals from README content"""
        lines = content.split('\n')
        goals = {
            'summary': '',
            'objectives': [],
            'features': []
        }
        
        current_section = None
        
        for line in lines:
            lower = line.lower()
            
            # Detect sections
            if any(keyword in lower for keyword in ['목표', 'goal', 'objective', 'purpose']):
                current_section = 'objectives'
            elif any(keyword in lower for keyword in ['feature', '기능', 'capability']):
                current_section = 'features'
            elif line.startswith('#') and not goals['summary']:
                # First heading as summary
                goals['summary'] = line.strip('# ').strip()
            
            # Extract list items
            if current_section and (line.strip().startswith('-') or line.strip().startswith('*')):
                item = line.strip().lstrip('-*').strip()
                if item:
                    goals[current_section].append(item)
        
        return goals
    
    def analyze(self) -> Dict:
        """Run comprehensive analysis"""
        print(f"\n{'='*60}")
        print(f"🔍 Advanced Analysis: {self.repo_owner}/{self.repo_name}")
        print(f"{'='*60}\n")
        
        repo_info = self.get_repository_info()
        tags = self.get_tags_with_details()
        tag_evolution = self.get_tag_evolution(tags)
        commit_timeline = self.get_commit_timeline()
        contributors = self.get_contributors_detailed()
        language_breakdown = self.get_language_breakdown(repo_info)
        project_goals = self.get_project_goals()
        
        data = {
            'metadata': {
                'analyzed_at': datetime.now().isoformat(),
                'repo_url': self.repo_url,
                'repo_owner': self.repo_owner,
                'repo_name': self.repo_name,
                'analyzer_version': '2.0'
            },
            'repository': repo_info,
            'project_goals': project_goals,
            'tags': tags,
            'tag_evolution': tag_evolution,
            'commit_timeline': commit_timeline,
            'contributors': contributors,
            'language_breakdown': language_breakdown,
            'summary': {
                'total_releases': len(tags),
                'total_contributors': len(contributors),
                'primary_language': language_breakdown.get('primary', 'Unknown'),
                'latest_release': tags[0].get('tagName') if tags else 'No releases',
                'age_days': self._calculate_repo_age(repo_info.get('createdAt'))
            }
        }
        
        print(f"\n{'='*60}")
        print("✅ Analysis Complete!")
        print(f"{'='*60}\n")
        print(f"📦 Total releases: {data['summary']['total_releases']}")
        print(f"👥 Contributors: {data['summary']['total_contributors']}")
        print(f"💻 Primary language: {data['summary']['primary_language']}")
        print(f"🏷️  Latest release: {data['summary']['latest_release']}")
        print(f"📅 Repository age: {data['summary']['age_days']} days\n")
        
        return data
    
    def _calculate_repo_age(self, created_at: str) -> int:
        """Calculate repository age in days"""
        if not created_at:
            return 0
        
        from datetime import datetime
        created = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
        now = datetime.now(created.tzinfo)
        return (now - created).days


def main():
    if len(sys.argv) < 2:
        print("Usage: python github_analyzer_advanced.py <github_repo_url> [output_file]")
        print("\nExample:")
        print("  python github_analyzer_advanced.py https://github.com/user/repo")
        print("  python github_analyzer_advanced.py https://github.com/user/repo data/analysis.json")
        sys.exit(1)
    
    repo_url = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else 'data/github_analysis.json'
    
    analyzer = AdvancedGitHubAnalyzer(repo_url)
    data = analyzer.analyze()
    
    # Save to JSON
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"💾 Analysis saved to: {output_file}\n")


if __name__ == '__main__':
    main()
