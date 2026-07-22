export async function generateStoryWithLLM(provider, prompt, settings) {
  try {
    if (provider === "gemini") {
      if (!settings.geminiApiKey) return "오류: 설정에서 Gemini API 키를 입력해주세요.";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${settings.geminiApiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      return data.candidates[0].content.parts[0].text;
    } 
    
    else if (provider === "openai") {
      if (!process.env.OPENAI_API_KEY) return "오류: 설정에서 OpenAI API 키를 입력해주세요."; // You can add it to settings later
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 2000,
        })
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      return data.choices[0].message.content;
    }
    
    else if (provider === "groq") {
      if (!settings.groqApiKey) return "오류: 설정에서 Groq API 키를 입력해주세요.";
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.groqApiKey}`
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 2000,
        })
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      return data.choices[0].message.content;
    }
    
    else if (provider === "cohere") {
      if (!settings.cohereApiKey) return "오류: 설정에서 Cohere API 키를 입력해주세요.";
      const res = await fetch("https://api.cohere.ai/v1/generate", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.cohereApiKey}`
        },
        body: JSON.stringify({
          model: "command",
          prompt: prompt,
          max_tokens: 2000,
        })
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      return data.generations[0].text;
    }
    
    return `오류: 알 수 없는 프로바이더입니다 (${provider}).`;
  } catch (e) {
    console.error("LLM Error:", e);
    return `LLM 생성 중 오류가 발생했습니다: ${e.message}`;
  }
}
