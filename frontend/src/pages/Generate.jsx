import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import toast from 'react-hot-toast';

const customStyles = {
  control: (base) => ({
    ...base,
    background: 'var(--color-bg-base)',
    borderColor: 'var(--color-border)',
    color: 'var(--color-text-main)',
  }),
  menu: (base) => ({
    ...base,
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border)',
  }),
  option: (base, state) => ({
    ...base,
    background: state.isFocused ? 'var(--color-bg-hover)' : 'transparent',
    color: 'var(--color-text-main)',
    cursor: 'pointer',
  }),
  multiValue: (base) => ({
    ...base,
    background: 'var(--color-primary)',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: 'white',
  }),
  singleValue: (base) => ({
    ...base,
    color: 'var(--color-text-main)',
  })
};

const llmOptions = [
  { value: 'gemini', label: 'Gemini (뛰어난 문맥 이해 및 창의성)' },
  { value: 'groq', label: 'Groq (초고속 생성 속도)' },
  { value: 'cohere', label: 'Cohere (정교한 텍스트 렌더링 및 스토리텔링)' }
];

const Generate = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialBookId = searchParams.get('book_id');

  const [characters, setCharacters] = useState([]);
  const [worldviews, setWorldviews] = useState([]);
  const [books, setBooks] = useState([]);
  
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [selectedChars, setSelectedChars] = useState([]);
  const [selectedWorld, setSelectedWorld] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedLlm, setSelectedLlm] = useState(llmOptions[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    Promise.all([
      apiClient.get('/characters'),
      apiClient.get('/worldviews'),
      apiClient.get('/books')
    ]).then(([c, w, b]) => {
      setCharacters(c.map(char => ({ value: char.id, label: char.name })));
      setWorldviews(w.map(world => ({ value: world.id, label: world.name })));
      const bookOpts = b.map(book => ({ value: book.id, label: book.title }));
      setBooks(bookOpts);
      
      if (initialBookId) {
        const found = bookOpts.find(opt => opt.value === parseInt(initialBookId));
        if (found) setSelectedBook(found);
      }
    });
  }, [initialBookId]);

  const handleGenerate = async () => {
    if (!title || !prompt || !selectedWorld || selectedChars.length === 0 || !selectedLlm) {
      return toast.error('모든 필수 항목을 입력해주세요.');
    }

    setIsGenerating(true);
    const toastId = toast.loading('스토리 생성 중... (LLM API 호출 중)');
    
    try {
      const payload = {
        title,
        prompt,
        character_ids: selectedChars.map(c => c.value),
        worldview_id: selectedWorld.value,
        book_id: selectedBook ? selectedBook.value : null,
        content: '', // 백엔드에서 생성함
        genre: '판타지',
        format_type: '소설',
        llm_provider: selectedLlm.value
      };

      const newStory = await apiClient.post('/stories', payload);
      toast.success('스토리가 성공적으로 생성되었습니다!', { id: toastId });
      navigate(`/stories/${newStory.id}`);
    } catch (e) {
      toast.error('스토리 생성에 실패했습니다. API 키가 설정에 입력되었는지 확인해주세요.', { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <h2 className="page-title text-gradient">새로운 스토리 창조</h2>
      
      <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="form-group">
          <label className="form-label">스토리 제목 *</label>
          <input 
            className="input-field" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="뜻밖의 여정" 
          />
        </div>

        <div className="grid-2" style={{ gap: '1.5rem', marginBottom: '1.25rem' }}>
          <div>
            <label className="form-label">책 선택 (선택)</label>
            <Select 
              options={books}
              value={selectedBook}
              onChange={setSelectedBook}
              styles={customStyles}
              placeholder="스토리가 포함될 책 선택..."
              isClearable
            />
          </div>
          <div>
            <label className="form-label">LLM 모델 선택 *</label>
            <Select 
              options={llmOptions}
              value={selectedLlm}
              onChange={setSelectedLlm}
              styles={customStyles}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">등장인물 선택 *</label>
          <Select 
            isMulti
            options={characters}
            value={selectedChars}
            onChange={setSelectedChars}
            styles={customStyles}
            placeholder="인물 선택..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">세계관 선택 *</label>
          <Select 
            options={worldviews}
            value={selectedWorld}
            onChange={setSelectedWorld}
            styles={customStyles}
            placeholder="세계관 선택..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">스토리 프롬프트 / 상황 *</label>
          <textarea 
            className="input-field" 
            value={prompt} 
            onChange={e => setPrompt(e.target.value)} 
            placeholder="상황을 설명하고, 어떤 일이 일어나는지, 혹은 LLM이 어떤 점에 집중해서 글을 쓰길 원하는지 적어주세요..."
            style={{ minHeight: '150px' }}
          />
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'right' }}>
          <button 
            className="btn btn-primary" 
            onClick={handleGenerate} 
            disabled={isGenerating}
            style={{ padding: '0.75rem 2rem', fontSize: '1rem', opacity: isGenerating ? 0.7 : 1 }}
          >
            {isGenerating ? '생성 중...' : '스토리 생성하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Generate;
