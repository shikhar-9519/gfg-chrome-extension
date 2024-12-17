import React, { useState, useEffect } from 'react';
import VideoLength from './components/VideoLength';

const App = () => {
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const extractProblemTitle = (url) => {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      const problemsIndex = pathParts.findIndex((part) => part === 'problems');
      if (problemsIndex !== -1 && pathParts[problemsIndex + 1]) {
        return pathParts[problemsIndex + 1]
          .split('-')
          .join(' ')
          .replace(/\d+$/, '')
          .trim();
      }
      return null;
    } catch (err) {
      console.error('Error extracting problem title:', err);
      return null;
    }
  };

  useEffect(() => {
    const getCurrentTab = async () => {
      try {
        if (typeof chrome !== 'undefined' && window?.chrome?.tabs) {
          const [tab] = await window.chrome.tabs.query({
            active: true,
            currentWindow: true,
          });

          if (tab?.url) {
            const problemTitle = extractProblemTitle(tab.url);
            if (problemTitle) {
              await fetchVideos(problemTitle);
            } else {
              setError('Could not extract problem title from URL');
              setLoading(false);
            }
          } else {
            setError('No active tab URL found');
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error in getCurrentTab:', err);
        setError('Failed to get current tab information');
        setLoading(false);
      }
    };

    getCurrentTab();
  }, []);

  const fetchVideos = async (problemTitle) => {
    const API_KEYS = ['*****', '*****'];

    let currentKeyIndex = 0;
    let success = false;
    let formattedData = null;
    let errorMessage = null;
  
    const API_URL = "https://www.googleapis.com/youtube/v3/search";
  
    while (!success && currentKeyIndex < API_KEYS.length) {
      try {
        const response = await fetch(
          `${API_URL}?part=snippet&q=${encodeURIComponent(
            problemTitle + " 5 minutes code channel"
          )}&type=video&maxResults=10&regionCode=IN&key=${API_KEYS[currentKeyIndex]}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
  
        console.log('Full Response:', response);
  
        if (!response.ok) {
          const errorBody = await response.text();
  
          // Check for quota-exceeded error
          if (response.status === 403) {
            currentKeyIndex++;
            continue; // Move to the next API key
          } else {
            throw new Error(`HTTP Error: ${response.status} - ${errorBody}`);
          }
        }
  
        const data = await response.json();
  
        formattedData = {
          selectedVideo: {
            videoId: data.items[0]?.id?.videoId,
            channelUrl: `channel/${data.items[0]?.snippet?.channelId}`,
          },
          relatedVideos: data.items.map((item) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails?.high?.url,
            channelTitle: item.snippet.channelTitle,
            channelUrl: `channel/${item.snippet.channelId}`,
            description: item.snippet.description,
            publishTime: item.snippet.publishTime,
          })),
        };
  
        success = true; // Successfully fetched data
      } catch (err) {
        console.error(
          `Error with API key ${API_KEYS[currentKeyIndex]}:`,
          err.message,
          err
        );
        errorMessage = err.message;
        currentKeyIndex++;
      }
    }
  
    if (success) {
      setVideoData(formattedData);
      setLoading(false);
    } else {
      console.error("All API keys exhausted. Failed to fetch videos.");
      setError(errorMessage || "Failed to fetch videos");
      setLoading(false);
    }
  };
  

  if (error) {
    return (
      <div className="w-96 p-4">
        <div className="text-red-600 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="top-0 right-0 w-96 p-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200 transition-all min-h-screen">
      <div className="flex justify-between items-center mb-4">
      <h1 className="text-xl font-bold text-center">DSA Solutions</h1>
        <div className='flex gap-4'>
        <button
          className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-full shadow-lg"
          onClick={() => window.open('https://chromewebstore.google.com/detail/dsa-video-solutions/fplacgmeefidnohgepjcnabcaakfbknm/reviews/', '_blank')}
        >
          Rate us
        </button>
        <button
          onClick={() => window.open('https://www.linkedin.com/in/shikhar-gupta-98a15b197/', '_blank')}
        >
          <img src='linkedin_icon.png' alt='Linkedin icon' width={24} height={24}/>
        </button>
        </div>
      </div>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div>
          <div className="mb-4 relative rounded-lg overflow-hidden shadow-lg">
            {videoData?.selectedVideo?.videoId ? (
              <iframe
                width="100%"
                height="200"
                src={`https://www.youtube.com/embed/${videoData.selectedVideo.videoId}`}
                frameBorder="0"
                allowFullScreen
                title="Solution Video"
                className="rounded"
              ></iframe>
            ) : (
              <div className="text-center text-gray-600 dark:text-gray-400">
                No video available
              </div>
            )}
          </div>
  
          <div className=" flex mb-4 text-center space-x-2">
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full shadow-lg"
              onClick={() => window.open(`https://www.youtube.com/${videoData?.selectedVideo?.channelUrl}`, '_blank')}
            >
              Subscribe
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg"
              onClick={() => window.open(`https://www.youtube.com/watch?v=${videoData?.selectedVideo?.videoId}`, '_blank')}
            >
              Watch on YouTube
            </button>
          </div>
  
          <div className="space-y-4">
            {videoData?.relatedVideos?.map((video) => (
              <div
                key={video.id}
                className="flex items-center space-x-4 p-3 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-lg cursor-pointer hover:scale-105 transform transition-all"
                onClick={() => setVideoData({ ...videoData, selectedVideo: { videoId: video.id, channelUrl: video.channelUrl } })}
              >
                <div className="relative w-36 h-20 flex-shrink-0">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover rounded"
                  />
                  {video?.lengthSeconds && <VideoLength time={video?.lengthSeconds} />}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{video.channelTitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
  
};

export default App;
