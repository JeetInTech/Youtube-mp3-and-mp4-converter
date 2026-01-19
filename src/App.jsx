import React, { useState, useEffect } from 'react';
import { Download, Music, Video, Link, ArrowRight, CheckCircle, Loader2, AlertCircle, Play } from 'lucide-react';

export default function App() {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState('mp3'); // 'mp3' or 'mp4'
  const [status, setStatus] = useState('idle'); // idle, processing, converting, success, error
  const [progress, setProgress] = useState(0);
  const [videoData, setVideoData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Extract YouTube ID from various URL formats
  const getYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleConvert = async () => {
    setErrorMsg('');
    const videoId = getYoutubeId(url);

    if (!videoId) {
      setErrorMsg('Please enter a valid YouTube URL');
      setStatus('error');
      return;
    }

    // 1. Fetching Info Phase
    setStatus('processing');
    
    try {
      const response = await fetch(`/api/info?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch video info');
      }
      const data = await response.json();
      
      setVideoData({
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        duration: data.duration,
        quality: data.quality || (format === 'mp4' ? 'HD' : 'High Quality')
      });
      
      // 2. Ready for Download
      // We skip "converting" simulation because the server streams it directly on download click
      setStatus('success');
      setProgress(100);

    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to fetch video info. Please check the URL.');
      setStatus('error');
    }
  };

  // Removed simulated progress bar effect as we don't need it for the info fetch
  // The download happens via browser download manager when clicking the button


  const handleReset = () => {
    setStatus('idle');
    setUrl('');
    setVideoData(null);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-rose-500 selection:text-white">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-rose-600/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[100px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col min-h-screen">
        
        {/* Navbar */}
        <nav className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-rose-500 to-orange-500 p-2 rounded-lg">
              <Download className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Neuro<span className="text-rose-500">tube</span>
            </span>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-white transition-colors">How it works</a>
            <a href="#" className="hover:text-white transition-colors">FAQ</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-grow flex flex-col items-center justify-center max-w-3xl mx-auto w-full">
          
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
              Convert Video to <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-orange-500">
                Audio & MP4
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-lg mx-auto">
              Paste a YouTube link below to download high-quality MP3 audio or MP4 video files instantly.
            </p>
          </div>

          {/* Converter Card */}
          <div className="w-full bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
            
            {/* Format Toggle */}
            <div className="flex p-1 bg-slate-900/50 rounded-xl mb-2">
              <button 
                onClick={() => setFormat('mp3')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${format === 'mp3' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                <Music className="w-4 h-4" /> MP3 Audio
              </button>
              <button 
                onClick={() => setFormat('mp4')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${format === 'mp4' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                <Video className="w-4 h-4" /> MP4 Video
              </button>
            </div>

            {/* Input Area */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Link className="w-5 h-5 text-slate-500 group-focus-within:text-rose-500 transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Paste YouTube URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleConvert()}
                className="w-full bg-slate-900 border border-slate-700 text-white pl-12 pr-32 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all placeholder:text-slate-600"
              />
              <button 
                onClick={handleConvert}
                disabled={status === 'processing' || status === 'converting'}
                className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white px-6 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-rose-500/20"
              >
                {status === 'processing' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ArrowRight className="w-5 h-5" />
                )}
              </button>
            </div>
            
            {/* Error Message */}
            {errorMsg && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errorMsg}
              </div>
            )}
          </div>

          {/* Result Card */}
          {videoData && status !== 'idle' && status !== 'error' && (
            <div className="w-full mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-slate-800 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                
                {/* Video Info Header */}
                <div className="p-6 flex gap-4 md:gap-6">
                  <div className="relative shrink-0 w-32 md:w-48 aspect-video rounded-lg overflow-hidden bg-slate-900 shadow-lg group">
                    <img 
                      src={videoData.thumbnail} 
                      alt="Thumbnail" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-8 h-8 text-white fill-current" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className="text-lg md:text-xl font-bold text-white truncate leading-tight mb-2">
                      {videoData.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <span className="bg-slate-700/50 px-2 py-0.5 rounded text-xs border border-white/5">
                        {videoData.duration}
                      </span>
                      <span className="bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded text-xs border border-rose-500/20 uppercase">
                        {videoData.quality}
                      </span>
                      <span>• {format.toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                {/* Progress / Download Section */}
                <div className="bg-slate-900/50 p-6 border-t border-white/5">
                  {status === 'converting' ? (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-slate-400">Converting...</span>
                        <span className="text-rose-500">{progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-rose-500 to-orange-500 transition-all duration-300 ease-out"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-center text-slate-500 animate-pulse">
                        Please wait while we prepare your file...
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col md:flex-row gap-3 items-center justify-between animate-in fade-in duration-300">
                      <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                        <CheckCircle className="w-5 h-5" />
                        Conversion Complete!
                      </div>
                      <div className="flex gap-3 w-full md:w-auto">
                        <button 
                          onClick={handleReset}
                          className="flex-1 md:flex-none px-6 py-2.5 rounded-lg border border-slate-600 hover:bg-slate-800 text-slate-300 font-medium transition-all"
                        >
                          Convert Another
                        </button>
                        <a 
                          href={`/api/download?url=${encodeURIComponent(url)}&format=${format}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20 transition-all"
                        >
                          <Download className="w-4 h-4" />
                          Download File
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </main>

        <footer className="mt-auto py-6 text-center text-slate-500 text-sm">
          <p>© 2024 Neurotube. Designed for educational purposes.</p>
        </footer>

      </div>
    </div>
  );
}
