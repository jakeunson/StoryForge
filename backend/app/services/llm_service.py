import httpx

def generate_story_with_llm(provider: str, prompt: str, settings) -> str:
    try:
        if provider == "gemini":
            if not settings.gemini_api_key:
                return "오류: 설정에서 Gemini API 키를 입력해주세요."
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key={settings.gemini_api_key}"
            response = httpx.post(url, json={
                "contents": [{"parts": [{"text": prompt}]}]
            }, timeout=60)
            response.raise_for_status()
            return response.json()["candidates"][0]["content"]["parts"][0]["text"]

        elif provider == "openai":
            if not settings.openai_api_key:
                return "오류: 설정에서 OpenAI API 키를 입력해주세요."
            response = httpx.post(
                "https://api.openai.com/v1/chat/completions",
                headers={"Authorization": f"Bearer {settings.openai_api_key}"},
                json={
                    "model": "gpt-4o-mini",
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": 2000,
                },
                timeout=60
            )
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]

        elif provider == "groq":
            if not settings.groq_api_key:
                return "오류: 설정에서 Groq API 키를 입력해주세요."
            response = httpx.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {settings.groq_api_key}"},
                json={
                    "model": "llama3-70b-8192",
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": 2000,
                },
                timeout=60
            )
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]

        elif provider == "cohere":
            if not settings.cohere_api_key:
                return "오류: 설정에서 Cohere API 키를 입력해주세요."
            response = httpx.post(
                "https://api.cohere.ai/v1/generate",
                headers={"Authorization": f"Bearer {settings.cohere_api_key}"},
                json={
                    "model": "command",
                    "prompt": prompt,
                    "max_tokens": 2000,
                },
                timeout=60
            )
            response.raise_for_status()
            return response.json()["generations"][0]["text"]

        return f"오류: 알 수 없는 프로바이더입니다 ({provider})."
    except Exception as e:
        return f"LLM 생성 중 오류가 발생했습니다: {str(e)}"
