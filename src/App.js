import '/node_modules/bootstrap/dist/css/bootstrap.css';
import './App.css';
import { useEffect, useState } from 'react';
import speaker from './img/speaker.png';

function App() {
  const [word, setWord] = useState('');
  const [result, setResult] = useState({});
  const [meanings, setMeanings] = useState([]);
  const [phonetics, setPhonetics] = useState([]);
  const [audio, setAudio] = useState('');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState({});
  const handleChange = (e) => {
    setWord(e.target.value);
    console.log(word);
    e.preventDefault();
  }


  const fetchDef = () => {
    try {
      setNotFound('');
      setPhonetics([]);
      setAudio('');
      setLoading(true);
      console.log('clicked', word);
      fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(res => res.json())
        .then(data => {
          if (!(data.title)) {
            setPhonetics(data[0].phonetics);
            setResult(data[0]);
            setMeanings(data[0].meanings);
            if (phonetics[0]) {
              setAudio((phonetics.find(element => (element.audio !== ''))).audio);
            }
          } else {
            setNotFound(data);
          }
          setLoading(false);
        })
      //console.log(word);
      //console.log(result);
    }
    catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{
    
  },[])

  const playAudio = () => {
    try {
      if (audio !== '') {
        console.log(audio);
        let ding = new Audio(audio);
        ding.play();
      }
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div className="myContainer d-flex justify-content-center align-items-center w-75 mx-auto px-5 py-5">
      <div className='m-auto'>
        <div className="searchArea m-auto text-center">
          <input type="text" name="searchTerm" id="" onChange={handleChange} />
          <button onClick={fetchDef}>Submit</button>
        </div>
        {/* {(loading) && 
          <div className="wordInfo">Loading...</div>
        } */}
        {(!(notFound.title)) ?
          <div className="resultArea">
            <div className="wordInfo d-flex justify-content-between align-items-baseline">
              <h2>{result.word}</h2>
              {(audio!=='') ? <span><img src={speaker} alt="listen" onClick={playAudio} /></span> : <span></span>}
            </div>
            <div style={{ color: 'gray' }}>
              {result.phonetic}
            </div>
            {meanings && <div className="meanings">
              {
                meanings.map((each) =>
                  <div className='eachMeaning py-2 px-3 my-3 text-wrap'>
                    <p>Parts of Speech: <span className="special"><u>{each.partOfSpeech}</u></span></p>
                    <p>Meaning: <span className="special">{each.definitions[0].definition}</span></p>
                    {each.definitions[0].example && <p>Example: <span className="special">{each.definitions[0].example}</span></p>}
                  </div>
                )
              }
            </div>}
          </div> :
          <div className="resultArea">
            <div className="wordInfo text-center">
              <h4>{
                notFound.title
              }</h4>
            </div>
          </div>

        }
      </div>
    </div>
  );
}

export default App;
