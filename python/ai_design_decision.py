#!/usr/bin/env python3
"""
AI Design Decision Engine
- AI가 콘텐츠 분석 후 최적 템플릿 선택
- 각 슬라이드마다 레이아웃 결정
- 차트 타입 자동 선택
- 색상 스킴 추천
"""

import json
import os
from google import genai
from google.genai.types import GenerateContentConfig, GoogleSearch

def load_gemini_client():
    """Gemini API 클라이언트 초기화"""
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in environment")
    
    client = genai.Client(api_key=api_key)
    return client

def analyze_content_style(analysis_data):
    """콘텐츠 스타일 분석 - 어떤 템플릿이 적합한지"""
    repo_name = analysis_data.get('repository', {}).get('name', '')
    description = analysis_data.get('repository', {}).get('description', '')
    topics = analysis_data.get('repository', {}).get('topics', [])
    
    # 키워드 기반 스타일 추론
    tech_keywords = ['ai', 'machine learning', 'deep learning', 'neural', 'algorithm']
    creative_keywords = ['design', 'creative', 'art', 'ui', 'ux', 'frontend']
    minimal_keywords = ['minimal', 'simple', 'clean', 'lightweight']
    corporate_keywords = ['enterprise', 'business', 'corporate', 'professional']
    
    content_text = f"{repo_name} {description} {' '.join(topics)}".lower()
    
    scores = {
        'professional': 5,  # default
        'modern': 0,
        'minimal': 0,
        'creative': 0,
        'bold': 0
    }
    
    # Score based on keywords
    for keyword in tech_keywords:
        if keyword in content_text:
            scores['modern'] += 3
            scores['professional'] += 1
    
    for keyword in creative_keywords:
        if keyword in content_text:
            scores['creative'] += 4
            scores['modern'] += 2
    
    for keyword in minimal_keywords:
        if keyword in content_text:
            scores['minimal'] += 5
    
    for keyword in corporate_keywords:
        if keyword in content_text:
            scores['professional'] += 3
    
    # Language count (many = bold/modern)
    lang_count = len(analysis_data.get('language_breakdown', []))
    if lang_count >= 5:
        scores['bold'] += 2
        scores['modern'] += 2
    
    return scores

def ai_select_template(client, analysis_data, presentation_content):
    """AI가 콘텐츠 분석 후 최적 템플릿 선택"""
    
    print("🤖 AI analyzing content for optimal template selection...")
    
    # 콘텐츠 요약
    repo_info = analysis_data.get('repository', {})
    repo_name = repo_info.get('name', 'Unknown')
    description = repo_info.get('description', '')
    topics = repo_info.get('topics', [])
    lang_breakdown = analysis_data.get('language_breakdown', [])
    
    # 프레젠테이션 내용
    title = presentation_content.get('title', '')
    slides = presentation_content.get('slides', [])
    slide_count = len(slides)
    
    # 스타일 사전 분석
    style_scores = analyze_content_style(analysis_data)
    top_styles = sorted(style_scores.items(), key=lambda x: x[1], reverse=True)[:3]
    
    prompt = f"""당신은 프레젠테이션 디자인 전문가입니다. 다음 프로젝트에 가장 적합한 템플릿을 선택하세요.

프로젝트 정보:
- 이름: {repo_name}
- 설명: {description}
- 토픽: {', '.join(topics)}
- 프로그래밍 언어: {', '.join([f"{lang['name']} ({lang['percentage']}%)" for lang in lang_breakdown[:5]])}
- 슬라이드 수: {slide_count}
- 제목: {title}

사용 가능한 템플릿:
1. **professional** - 전문적, 기업용, 딥블루 + 골드, 안정적인 레이아웃
2. **modern** - 현대적, 테크 중심, 인디고 + 핑크, 미니멀하면서 세련됨
3. **minimal** - 초미니멀, 스위스 디자인, 흑백 + 레드 강조, 여백 중시
4. **creative** - 창의적, 화려한 색상, 보라 + 시안 + 앰버, 그라디언트/원형 많음
5. **bold** - 대담한, 높은 대비, 블랙 + 마젠타 + 시안, 강한 타이포그래피

현재 분석된 스타일 점수: {', '.join([f"{s[0]}({s[1]}점)" for s in top_styles])}

다음 기준으로 최적의 템플릿 1개를 선택하세요:
1. 프로젝트의 성격 (기술적/창의적/비즈니스)
2. 타겟 청중 (개발자/디자이너/투자자)
3. 콘텐츠의 복잡도
4. 시각적 임팩트 필요성

응답 형식 (JSON만):
{{
  "template": "템플릿이름",
  "reason": "선택 이유 (한글, 2-3문장)",
  "confidence": 0.0-1.0
}}
"""
    
    try:
        response = client.models.generate_content(
            model='gemini-2.0-flash-exp',
            contents=prompt,
            config=GenerateContentConfig(
                temperature=0.3,
                max_output_tokens=500
            )
        )
        
        result_text = response.text.strip()
        
        # Extract JSON from markdown code blocks if present
        if '```json' in result_text:
            result_text = result_text.split('```json')[1].split('```')[0].strip()
        elif '```' in result_text:
            result_text = result_text.split('```')[1].split('```')[0].strip()
        
        result = json.loads(result_text)
        
        print(f"   ✅ Selected template: {result['template']}")
        print(f"   💡 Reason: {result['reason']}")
        print(f"   🎯 Confidence: {result['confidence']:.0%}")
        
        return result
        
    except Exception as e:
        print(f"   ⚠️  AI selection failed: {e}")
        # Fallback: use highest scored template
        fallback = top_styles[0][0]
        print(f"   📌 Using fallback template: {fallback}")
        return {
            'template': fallback,
            'reason': f'스타일 점수 기반 자동 선택 ({top_styles[0][1]}점)',
            'confidence': 0.7
        }

def ai_optimize_slides(client, slides, template_choice):
    """각 슬라이드 최적화 - 레이아웃, 차트 타입 등"""
    
    print(f"\n🎨 AI optimizing {len(slides)} slides for {template_choice} template...")
    
    optimized_slides = []
    
    for i, slide in enumerate(slides):
        # Skip title slide
        if slide.get('type') == 'title':
            optimized_slides.append(slide)
            continue
        
        prompt = f"""슬라이드 최적화 요청:

템플릿: {template_choice}
슬라이드 제목: {slide.get('title', '')}
슬라이드 타입: {slide.get('type', 'content')}
콘텐츠 항목 수: {len(slide.get('content', []))}

다음을 결정하세요:
1. 최적 슬라이드 타입 (content/timeline/stats/team)
2. 차트가 필요한 경우 타입 (pie/bar/line/none)
3. 레이아웃 힌트

응답 형식 (JSON만):
{{
  "type": "슬라이드타입",
  "chart_type": "차트타입 or null",
  "layout_hint": "레이아웃 설명"
}}
"""
        
        try:
            response = client.models.generate_content(
                model='gemini-2.0-flash-exp',
                contents=prompt,
                config=GenerateContentConfig(
                    temperature=0.2,
                    max_output_tokens=300
                )
            )
            
            result_text = response.text.strip()
            if '```json' in result_text:
                result_text = result_text.split('```json')[1].split('```')[0].strip()
            elif '```' in result_text:
                result_text = result_text.split('```')[1].split('```')[0].strip()
            
            optimization = json.loads(result_text)
            
            # Apply optimization
            optimized_slide = slide.copy()
            if optimization.get('type'):
                optimized_slide['type'] = optimization['type']
            
            if optimization.get('chart_type') and optimization['chart_type'] != 'none':
                # Add chart specification
                if 'chart_data' not in optimized_slide:
                    optimized_slide['chart_data'] = {}
                optimized_slide['chart_data']['type'] = optimization['chart_type']
            
            if optimization.get('layout_hint'):
                optimized_slide['layout_hint'] = optimization['layout_hint']
            
            optimized_slides.append(optimized_slide)
            print(f"   ✓ Slide {i+1}: {slide.get('title', '')} → {optimization.get('type', 'content')}")
            
        except Exception as e:
            print(f"   ⚠️  Slide {i+1} optimization failed: {e}, using original")
            optimized_slides.append(slide)
    
    return optimized_slides

def ai_design_decision(analysis_file, content_file, output_file):
    """메인 AI 디자인 결정 함수"""
    
    print("\n" + "="*60)
    print("🎨 AI Design Decision Engine")
    print("="*60)
    
    # Load data
    with open(analysis_file, 'r', encoding='utf-8') as f:
        analysis_data = json.load(f)
    
    with open(content_file, 'r', encoding='utf-8') as f:
        presentation_content = json.load(f)
    
    # Initialize Gemini client
    try:
        client = load_gemini_client()
    except Exception as e:
        print(f"❌ Failed to initialize Gemini: {e}")
        print("⚠️  Using rule-based fallback...")
        
        # Fallback: rule-based selection
        style_scores = analyze_content_style(analysis_data)
        best_template = max(style_scores.items(), key=lambda x: x[1])[0]
        
        result = {
            'template': best_template,
            'reason': f'규칙 기반 자동 선택 (Gemini API 사용 불가)',
            'confidence': 0.6,
            'slides': presentation_content['slides']
        }
        
        # Save result
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        
        print(f"✅ Design decision saved: {output_file}")
        print(f"   📐 Template: {result['template']}")
        return result
    
    # AI-powered template selection
    template_decision = ai_select_template(client, analysis_data, presentation_content)
    
    # AI-powered slide optimization
    optimized_slides = ai_optimize_slides(
        client, 
        presentation_content.get('slides', []), 
        template_decision['template']
    )
    
    # Combine results
    result = {
        'template': template_decision['template'],
        'reason': template_decision['reason'],
        'confidence': template_decision['confidence'],
        'slides': optimized_slides,
        'title': presentation_content.get('title', ''),
        'subtitle': presentation_content.get('subtitle', ''),
        'analysis_data': presentation_content.get('analysis_data', {})
    }
    
    # Save
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    
    print("\n" + "="*60)
    print(f"✅ AI Design Decision Complete!")
    print("="*60)
    print(f"   📐 Template: {result['template']}")
    print(f"   🎯 Confidence: {template_decision['confidence']:.0%}")
    print(f"   📊 Optimized {len(optimized_slides)} slides")
    print(f"   💾 Saved to: {output_file}")
    
    return result

if __name__ == '__main__':
    import sys
    
    if len(sys.argv) != 4:
        print("Usage: python ai_design_decision.py <analysis.json> <content.json> <output.json>")
        sys.exit(1)
    
    analysis_file = sys.argv[1]
    content_file = sys.argv[2]
    output_file = sys.argv[3]
    
    ai_design_decision(analysis_file, content_file, output_file)
