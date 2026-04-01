"""
GitHub Repository Analyzer
Fetches repository data for presentation generation
"""

import os
import json
import sys
from datetime import datetime
from typing import Dict, List
import subprocess

class GitHubAnalyzer:
    def __init__(self, repo_url: str):
        self.repo_url = repo_url
        self.repo_owner = None
        self.repo_name = None
        self._parse_repo_url()
    
    def _parse_repo_url(self):
        """Parse GitHub URL to extract owner and repo name"""
        # https://github.com/owner/repo -> owner, repo
        parts = self.repo_url.rstrip('/').split('/')
        if len(parts) >= 2:
            self.repo_name = parts[-1].replace('.git', '')
            self.repo_owner = parts[-2]
        else:
            raise ValueError(f"Invalid GitHub URL: {self.repo_url}")
    
    def _run_gh_command(self, args: List[str]) -> str:
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
            print(f"Error running gh command: {e.stderr}", file=sys.stderr)
            return None
        except FileNotFoundError:
            print("Error: gh CLI not found. Please install GitHub CLI", file=sys.stderr)
            return None
    
    def get_repository_info(self) -> Dict:
        """Get basic repository information"""
        repo_full = f"{self.repo_owner}/{self.repo_name}"
        output = self._run_gh_command(['repo', 'view', repo_full, '--json', 
                                        'name,description,stargazerCount,forkCount,createdAt,pushedAt,languages'])
        
        if output:
            return json.loads(output)
        return {}
    
    def get_tags(self) -> List[Dict]:
        """Get repository tags/releases"""
        repo_full = f"{self.repo_owner}/{self.repo_name}"
        output = self._run_gh_command(['release', 'list', '-R', repo_full, '--json',
                                       'tagName,name,publishedAt,isPrerelease', '-L', '20'])
        
        if output:
            return json.loads(output)
        return []
    
    def get_recent_commits(self, limit: int = 10) -> List[Dict]:
        """Get recent commits"""
        repo_full = f"{self.repo_owner}/{self.repo_name}"
        output = self._run_gh_command(['api', f'repos/{repo_full}/commits',
                                       '-q', f'.[:{limit}]'])
        
        if output:
            commits = json.loads(output)
            return [{
                'sha': c['sha'][:7],
                'message': c['commit']['message'].split('\n')[0],
                'author': c['commit']['author']['name'],
                'date': c['commit']['author']['date']
            } for c in commits]
        return []
    
    def get_contributors(self) -> List[Dict]:
        """Get repository contributors"""
        repo_full = f"{self.repo_owner}/{self.repo_name}"
        output = self._run_gh_command(['api', f'repos/{repo_full}/contributors'])
        
        if output:
            contributors = json.loads(output)
            return [{
                'login': c['login'],
                'contributions': c['contributions'],
                'avatar_url': c.get('avatar_url', '')
            } for c in contributors[:10]]  # Top 10
        return []
    
    def analyze(self) -> Dict:
        """Run full analysis and return structured data"""
        print(f"🔍 Analyzing repository: {self.repo_owner}/{self.repo_name}")
        
        data = {
            'metadata': {
                'analyzed_at': datetime.now().isoformat(),
                'repo_url': self.repo_url,
                'repo_owner': self.repo_owner,
                'repo_name': self.repo_name
            },
            'repository': self.get_repository_info(),
            'tags': self.get_tags(),
            'recent_commits': self.get_recent_commits(),
            'contributors': self.get_contributors()
        }
        
        print(f"✅ Found {len(data['tags'])} releases")
        print(f"✅ Found {len(data['recent_commits'])} recent commits")
        print(f"✅ Found {len(data['contributors'])} contributors")
        
        return data

def main():
    if len(sys.argv) < 2:
        print("Usage: python github_analyzer.py <github_repo_url> [output_file]")
        sys.exit(1)
    
    repo_url = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else 'data/github_data.json'
    
    analyzer = GitHubAnalyzer(repo_url)
    data = analyzer.analyze()
    
    # Save to JSON
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"\n💾 Data saved to: {output_file}")

if __name__ == '__main__':
    main()
