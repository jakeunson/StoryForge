import google.generativeai as genai
from groq import Groq
import cohere

def generate_story_with_llm(provider: str, prompt: str, settings) -> str:
    try:
        if provider == "gemini":
            if not settings.gemini_api_key:
                return "오류: 설정에서 Gemini API 키를 입력해주세요."
            genai.configure(api_key=settings.gemini_api_key)
            model = genai.GenerativeModel('gemini-1.5-pro')
            response = model.generate_content(prompt)
            return response.text
            
        elif provider == "groq":
            if not settings.groq_api_key:
                return "오류: 설정에서 Groq API 키를 입력해주세요."
            client = Groq(api_key=settings.groq_api_key)
            chat_completion = client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="mixtral-8x7b-32768",
            )
            return chat_completion.choices[0].message.content
            
        elif provider == "cohere":
            if not settings.cohere_api_key:
                return "오류: 설정에서 Cohere API 키를 입력해주세요."
            co = cohere.Client(settings.cohere_api_key)
            response = co.generate(
                prompt=prompt,
                model='command',
                max_tokens=2000,
            )
            return response.generations[0].text
            
        return f"오류: 알 수 없는 프로바이더입니다 ({provider})."
    except Exception as e:
        return f"LLM 생성 중 오류가 발생했습니다: {str(e)}"
