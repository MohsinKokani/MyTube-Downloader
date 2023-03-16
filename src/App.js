import { useEffect, useState } from 'react';
import { VideoDetails, TabularOutput, SampleLink, NullIMG, Loader } from './Components';
import './App.css';
import axios from 'axios';

// https://youtu.be/NvjKXwt7n48

function getId(link) {
  link = link.trim();
  const index = Math.max(link.lastIndexOf('='), link.lastIndexOf('/'));
  let ans = link.substr(index + 1);
  if (ans.length === 11) return ans;
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
  const [imgPath, setImgPath] = useState(NullIMG);
  const [videoTitle, setVideoTitle] = useState('Loading...');
  const [output, setOutput] = useState([]);
  const [linkValue, setLinkValue] = useState('');
  const [loading, setLoading] = useState(true);
  const handleTyping = (e) => {
    setLinkValue(e.target.value)
  }

  const handleError = (message) => {
    setVideoTitle(message);
    setImgPath(NullIMG);
    setOutput([]);
    setLoading(false);
    document.querySelector('.container').style.height = "100%";
  }
  useEffect(() => {
    let vidId = getId(linkValue);
    if (vidId !== '') {
      document.querySelector('.input-container input').blur();
      document.querySelector('.container').style.height = "1px";
      setLoading(true);
      axios.request(`https://ytstream-download-youtube-videos.p.rapidapi.com/dl?id=${vidId}`, options)
        .then(function (response) {
          if (response.data.status === "fail") {
            handleError(response.data.error);
          } else {
            setVideoTitle(response.data.title);
            setImgPath(response.data.thumbnail[1]?.url);
            setOutput(response.data.adaptiveFormats);
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
        <VideoDetails videoTitle={videoTitle} imgPath={imgPath} />
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