import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './cards.scss';
import { MyContext } from '../../data/ThemeProvider'; // ✅ adjust path

function formatTitle(name) {
  return name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function getTimeAgo(timeString) {
  const [time, date] = timeString.split(' ');
  const [hour, minute] = time.split(':').map(Number);
  const [day, month, year] = date.split('/').map(Number);
  const chapterDate = new Date(year, month - 1, day, hour, minute);
  const now = new Date();

  const diffMs = now - chapterDate;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffYear > 0) return `${diffYear} year${diffYear > 1 ? 's' : ''} ago`;
  if (diffMonth > 0) return `${diffMonth} month${diffMonth > 1 ? 's' : ''} ago`;
  if (diffDay > 0) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  if (diffHr > 0) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
  if (diffMin > 0) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  return "just now";
}

function formatChapters(chapterData) {
  const chapters = Object.entries(chapterData)
    .filter(([key]) => key.startsWith("chapter-"))
    .sort((a, b) => parseInt(b[0].replace("chapter-", "")) - parseInt(a[0].replace("chapter-", "")))
    .slice(0, 3);

  return chapters.map(([key, value]) => ({
    number: key.replace("chapter-", ""),
    name: key.replace("chapter-", "Chapter "),
    time: getTimeAgo(value.time)
  }));
}

function Cards() {
  const navigate = useNavigate();
  const { mangaData } = useContext(MyContext); // ✅ from context

  const mangaList = Object.entries(mangaData).map(([key, value]) => ({
    key,
    title: formatTitle(key),
    image: `/${value.imagelogo}`,
    chapters: formatChapters(value)
  }));

  return (
    <div className="Cards">
      <div className='Cards-title'>Latest Updates</div>
      <div className='Cards-container'>
        {mangaList.map((manga, i) => (
          <div className='Cards-container-card' key={i}>
            <div
              className='Cards-container-card_picture'
              onClick={() => navigate(`/series/${manga.key}`)}
              style={{ cursor: 'pointer' }}
            >
              <img src={manga.image} alt={manga.title} />
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
                    <div className='Cards-container-card_leftBox_chapters_chapter_name'>* {chap.name}</div>
                    <div className='Cards-container-card_leftBox_chapters_chapter_timestamps'>{chap.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cards;
