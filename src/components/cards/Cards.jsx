import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './cards.scss';

function getTimeAgo(timeString) {
  if (!timeString) return '';
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

function toTitleCase(str) {
  return str.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1));
}

function Cards({ searchQuery }) {
  const navigate = useNavigate();
  const [mangaList, setMangaList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const folders = [
        "absolute-regression",
        "nano-machine",
        "myst-might-mayhem",
        "the-return-of-the-crazy-demon",
        "surviving-as-a-genius-on-borrowed-time",
        "swordmasters-youngest-son",
        "the-priest-of-corruption",
        "reincarnation-of-the-suicidal-battle-god",
        "sword-fanatic-wanders-through-the-night",
        "reaper-of-the-drifting-moon",
        "legend-of-asura-the-venom-dragon",
        "mookhyang-the-origin",
        "kingdom",
        "magic-emperor"
      ];

      const list = await Promise.all(
        folders.map(async (folder) => {
          try {
            const res = await fetch(`/data/jsonFiles/${folder}/manwhaDescription.json`);
            const data = await res.json();
            const chapters = (data.uploadTime || [])
              .filter(c => c.chapter && c.time)
              .slice(-3)
              .reverse()
              .map(c => ({
                number: c.chapter,
                name: `Chapter ${c.chapter}`,
                time: getTimeAgo(c.time)
              }));

            const latestRawTime = data.uploadTime?.[data.uploadTime.length - 1]?.time || "";
            const [h, d] = latestRawTime.split(" ");
            const [hour, min] = h?.split(":") || [];
            const [day, month, year] = d?.split("/") || [];
            const latestTimestamp = new Date(`${year}-${month}-${day}T${hour}:${min}:00`).getTime() || 0;

            return {
              key: folder,
              title: toTitleCase(data.name || folder),
              image: `/${data.imagelogo}`,
              chapters,
              latestTimestamp
            };
          } catch (err) {
            console.error(`❌ Failed to fetch data for ${folder}`, err);
            return null;
          }
        })
      );

      const sorted = list.filter(Boolean).sort((a, b) => b.latestTimestamp - a.latestTimestamp);
      setMangaList(sorted);
    };

    fetchData();
  }, []);

  const filteredList = mangaList.filter((m) =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="Cards">
      <div className='Cards-title'>Latest Updates</div>
      <div className='Cards-container'>
        {filteredList.map((manga, i) => (
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
                    <div className='Cards-container-card_leftBox_chapters_chapter_name'>• {chap.name}</div>
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
