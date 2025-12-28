# StreamRip - YouTube Converter

A modern YouTube to MP3/MP4 converter with a beautiful UI and Python backend.

## Features

- 🎵 Convert YouTube videos to MP3 (320kbps audio)
- 🎥 Download YouTube videos as MP4 (highest quality)
- 🎨 Modern, sleek UI with Tailwind CSS
- ⚡ Fast conversion using yt-dlp + FFmpeg
- 🐍 Python Flask backend
- 📱 Responsive design

## Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **FFmpeg** (required for audio conversion)
  - Windows: Download from https://ffmpeg.org/download.html and add to PATH
  - Or install via Chocolatey: `choco install ffmpeg`

## Installation

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Setup Python Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
```

## Usage

### Option 1: Using Batch Files (Windows)

1. Start the backend:
```bash
cd backend
start_backend.bat
```

2. In a new terminal, start the frontend:
```bash
npm run dev
```

### Option 2: Manual Start

1. Start the Python backend:
```bash
cd backend
venv\Scripts\activate
python app.py
```

2. In a new terminal, start the frontend:
```bash
npm run dev
```

3. Open your browser and go to `http://localhost:5173`

4. Paste a YouTube URL, select format (MP3 or MP4), and download!

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/info` | GET | Get video info (title, thumbnail, duration) |
| `/api/download` | GET | Download video as MP3 or MP4 |
| `/api/health` | GET | Health check |

### Query Parameters

- `url` - YouTube video URL
- `format` - Output format (`mp3` or `mp4`)

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Python Flask + yt-dlp + FFmpeg
- **Icons**: Lucide React

## Project Structure

```
Youtube converter/
├── src/                    # React frontend
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── backend/                # Python backend
│   ├── app.py              # Flask server
│   ├── requirements.txt
│   └── start_backend.bat
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Troubleshooting

### FFmpeg not found
Make sure FFmpeg is installed and added to your system PATH.

### Video download fails
Some videos may be age-restricted or region-locked. Try a different video.

### CORS errors
Make sure the backend is running on port 5000 and the frontend proxy is configured correctly.

## License

For educational purposes only. Respect YouTube's Terms of Service.

- Make sure you have a stable internet connection
- Some videos may take longer depending on their size
- Audio is converted to 320kbps MP3 format
- Video downloads are in the highest quality available
