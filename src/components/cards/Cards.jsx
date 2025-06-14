import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../../data/ThemeProvider';
import './cards.scss';

function Cards({ searchQuery }) {
  const navigate = useNavigate();
  const { API_BASE } = useContext(MyContext);
  const [mangaList, setMangaList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/latest-updates`);
        const data = await res.json();
        setMangaList(data);
        console.log(data)
      } catch (err) {
        console.error("❌ Failed to fetch latest updates", err);
      }
    };

    fetchData();
  }, [API_BASE]);

  const filteredList = mangaList.filter((m) =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="Cards">
      <div className='Cards-title'>Latest Updates</div>
      <div className='Cards-container'>
        {filteredList.map((manga, i) => (
          <div className='Cards-container-card' key={i} style={{ '--delay': `${i * 0.1}s` }}>
            <div
              className='Cards-container-card_picture'
              onClick={() => navigate(`/series/${manga.key}`)}
              style={{ cursor: 'pointer' }}
            >
              <img src={`${API_BASE}/${manga.image}`} alt={manga.title} />
            </div>
            <div className='Cards-container-card_leftBox'>
              <div
                className='Cards-container-card_leftBox_title'
                onClick={() => navigate(`/series/${manga.key}`)}
                style={{ cursor: 'pointer' }}
              >
                {manga.title}
              </div>
              <div className='Cards-container-card_leftBox_chapters'>
                {manga.chapters.map((chap, j) => (
                  <div
                    className='Cards-container-card_leftBox_chapters_chapter'
                    key={j}
                    onClick={() => navigate(`/readchapter/${manga.key}/chapter/${chap.number}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className='Cards-container-card_leftBox_chapters_chapter_name'>• {chap.name}</div>
                    <div className='Cards-container-card_leftBox_chapters_chapter_timestamps'>{chap.time}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-right"></div>
            <div className="border-left"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cards;
