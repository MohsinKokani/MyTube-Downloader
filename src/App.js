import { useEffect, useState } from 'react';
import { VideoDetails, TabularOutput, SampleLink, NullIMG, Loader } from './Components';
import './App.css';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

// https://youtu.be/NvjKXwt7n48

function getId(input) {
  if (!input) return '';
  
  input = input.trim();
  
  // If it's already a valid 11-character ID, return it
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
    return input;
  }
  
  try {
    // Handle various YouTube URL formats
    const url = new URL(input.startsWith('http') ? input : `https://${input}`);
    
    // Handle youtu.be URLs: https://youtu.be/VIDEO_ID or https://youtu.be/VIDEO_ID?si=...
    if (url.hostname === 'youtu.be' || url.hostname === 'www.youtu.be') {
      const videoId = url.pathname.slice(1).split('?')[0].split('/')[0];
      if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return videoId;
      }
    }
    
    // Handle youtube.com URLs
    if (url.hostname.includes('youtube.com')) {
      // Handle /watch?v=VIDEO_ID
      const vParam = url.searchParams.get('v');
      if (vParam && /^[a-zA-Z0-9_-]{11}$/.test(vParam)) {
        return vParam;
      }
      
      // Handle /shorts/VIDEO_ID or /embed/VIDEO_ID
      const pathMatch = url.pathname.match(/\/(shorts|embed)\/([a-zA-Z0-9_-]{11})/);
      if (pathMatch && pathMatch[2]) {
        return pathMatch[2];
      }
    }
  } catch (error) {
    // If URL parsing fails, try extracting ID using regex as fallback
    const regexMatch = input.match(/[a-zA-Z0-9_-]{11}/);
    if (regexMatch) {
      return regexMatch[0];
    }
  }
  
  return '';
}

const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': process.env.REACT_APP__YTStream_API_KEY,
    'X-RapidAPI-Host': 'ytstream-download-youtube-videos.p.rapidapi.com'
  }
};

const App = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [imgPath, setImgPath] = useState(NullIMG);
  const [videoTitle, setVideoTitle] = useState('Loading...');
  const [lengthSeconds, setLengthSeconds] = useState(null);
  const [viewCount, setViewCount] = useState(null);
  const [output, setOutput] = useState([]);
  const [linkValue, setLinkValue] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize linkValue from URL parameter on component mount
  useEffect(() => {
    const urlParam = searchParams.get('v') || searchParams.get('id') || searchParams.get('link');
    if (urlParam) {
      setLinkValue(urlParam);
    }
  }, [searchParams]);

  const handleTyping = (e) => {
    const newValue = e.target.value;
    setLinkValue(newValue);
    
    // Update URL parameter when user types
    if (newValue.trim()) {
      setSearchParams({ v: newValue });
    } else {
      setSearchParams({});
    }
  }

  const handleError = (message) => {
    setVideoTitle(message);
    setImgPath(NullIMG);
    setLengthSeconds(null);
    setViewCount(null);
    setOutput([]);
    setLoading(false);
    document.querySelector('.container').style.height = "100%";
  }
  useEffect(() => {
    let vidId = getId(linkValue);
    console.log("vidId: ", vidId);
    if (vidId !== '') {
      document.querySelector('.input-container input').blur();
      document.querySelector('.container').style.height = "1px";
      setLoading(true);
      axios.request(`https://ytstream-download-youtube-videos.p.rapidapi.com/dl?id=${vidId}`, options)
        .then(function (response) {
          if (response.data.status === "fail") {
            handleError(response.data.error);
          } else {
            // Combine formats (with audio) first, then adaptiveFormats
            const formats = response.data.formats || [];
            const adaptiveFormats = response.data.adaptiveFormats || [];
            setOutput([...formats, ...adaptiveFormats]);
            setVideoTitle(response.data.title);
            setImgPath(response.data.thumbnail[1]?.url);
            setLengthSeconds(response.data.lengthSeconds);
            setViewCount(response.data.viewCount);
          }
          setLoading(false);
          document.querySelector('.container').style.height = "100%";
        })
        .catch(function (error) {
          handleError(error.response.data.message);
        });
    }
  }, [linkValue])



  return (
    <>
      <SampleLink />

      <div className="input-container">
        <input type="text" placeholder="Paste Link here" value={linkValue} onChange={handleTyping} />
      </div>

      <div className="container">
        <VideoDetails 
          videoTitle={videoTitle} 
          imgPath={imgPath} 
          lengthSeconds={lengthSeconds}
          viewCount={viewCount}
        />
        {
          loading &&
          <img width="80px" src={Loader} alt="Loading..." />
        }
        {
          !loading &&
          output.length !== 0 &&
          <TabularOutput output={output} />
        }
      </div>
    </>
  )
}
export default App;