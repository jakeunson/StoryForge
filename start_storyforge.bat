@echo off
echo ===================================================
echo        StoryForge AI - 로컬 서버 시작 스크립트
echo ===================================================
echo.

:: 1. 루트 폴더에 가상환경이 없으면 생성
if not exist "venv" (
    echo [설정] 파이썬 가상환경(venv)을 생성합니다...
    python -m venv venv
    echo [설정] 필수 패키지를 설치합니다...
    call venv\Scripts\activate
    pip install -r requirements.txt
    deactivate
)

:: 2. 백엔드 서버 백그라운드 실행
echo [1/2] 백엔드(FastAPI) 서버를 시작합니다... (포트: 8000)
start "StoryForge Backend" cmd /c ".\venv\Scripts\python.exe -m uvicorn api.main:app --reload"

:: 3. 프론트엔드 서버 실행
echo [2/2] 프론트엔드(React/Vite) 서버를 시작합니다...
if not exist "node_modules" (
    echo [설정] 노드 패키지를 설치합니다...
    call npm install
)
start "StoryForge Frontend" cmd /c "npm run dev"

echo.
echo 모든 서버가 실행되었습니다!
echo 백엔드 및 프론트엔드 창이 별도로 열려 있습니다.
echo 끄실 때는 열려있는 두 개의 검은 창(터미널)을 닫으시면 됩니다.
echo 잠시 후 브라우저에서 http://localhost:5173 으로 접속해주세요!
echo.
pause
