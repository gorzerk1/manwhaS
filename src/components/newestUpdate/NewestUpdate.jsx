import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './newestUpdate.scss';

function NewestUpdate() {
  const [latestChapters, setLatestChapters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUpdates = async () => {
      try {
        const res = await fetch('/data/jsonFiles/');
        const text = await res.text();
        const folderNames = Array.from(text.matchAll(/href="([^"]+)\/"/g)).map(m => m[1]);

        const updates = [];

        for (const folder of folderNames) {
          try {
            const descRes = await fetch(`/data/jsonFiles/${folder}/manwhaDescription.json`);
            const desc = await descRes.json();

            const now = new Date();
            const recentChapters = (desc.uploadTime || []).filter(ch => {
              const [hour, date] = ch.time.split(' ');
              const [day, month, year] = date.split('/');
              const [hh, mm] = hour.split(':');
              const chapterDate = new Date(`${year}-${month}-${day}T${hh}:${mm}`);
              const diffHours = (now - chapterDate) / 36e5;
              return diffHours < 48;
            });

            recentChapters.forEach(ch => {
              updates.push({
                name: desc.name,
                chapter: ch.chapter,
                time: ch.time,
                image: `/${desc.updateChap}`,
                folder
              });
            });
          } catch (e) {
            console.error(`❌ Error loading ${folder}`, e);
          }
        }

        // Sort newest first
        updates.sort((a, b) => b.chapter - a.chapter);
        setLatestChapters(updates);
      } catch (err) {
        console.error("❌ Failed to load folders", err);
      }
    };

    loadUpdates();
  }, []);

  return (
    <div className="NewestUpdate">
      <div className='NewestUpdate-container'>
        <div className='NewestUpdate-container_title'>Latest Updated Chapters</div>
        <div className='NewestUpdate-container-newestChap'>
          {latestChapters.map((item, i) => (
            <div
              key={i}
              className='NewestUpdate-container-newestChap_Chap'
              onClick={() =>
                navigate(`/readchapter/${item.folder}/chapter/${item.chapter}`)
              }
            >
              <div
                className="NewestUpdate-container-newestChap_Chap_image"
                style={{ backgroundImage: `url("${item.image}")` }}
              ></div>
              <div className="NewestUpdate-container-newestChap_Chap_manwhaName">{item.name}</div>
              <div className="NewestUpdate-container-newestChap_Chap_chapter">Chapter {item.chapter}</div>
              <div className="NewestUpdate-container-newestChap_Chap_timeStamps">{item.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NewestUpdate;
