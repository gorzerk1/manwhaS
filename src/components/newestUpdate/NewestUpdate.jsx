import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './newestUpdate.scss';

function NewestUpdate() {
  const [chapters, setChapters] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetch('https://server.manhwawut.online/api/filtered-manwhas')
      .then(res => res.json())
      .then(data => setChapters(data))
      .catch(err => console.error('fetch error:', err));
  }, []);

  return (
    <div className="NewestUpdate">
      <div className='NewestUpdate-container'>
        <div className='NewestUpdate-container_title'>Latest Updated Chapters</div>
        <div className='NewestUpdate-container-newestChap'>
          {chapters.map((chap, index) => {
            const chapterNum = chap.chapter.replace(/[^\d]/g, '');

            return (
              <div
                key={index}
                className='NewestUpdate-container-newestChap_Chap'
                onClick={() =>
                  navigate(`/readchapter/${chap.manwhaName}/chapter/${chapterNum}`)
                }
              >
                <div
                  className="NewestUpdate-container-newestChap_Chap_image"
                  style={{ backgroundImage: `url("${chap.image}")` }}
                ></div>
                <div className="NewestUpdate-container-newestChap_Chap_manwhaName">{chap.title}</div>
                <div className="NewestUpdate-container-newestChap_Chap_chapter">{chap.chapter}</div>
                <div className="NewestUpdate-container-newestChap_Chap_timeStamps">
                  {chap.timeAgo}
                </div>
                <div className="border-right"></div>
                <div className="border-left"></div>
                <div className='borderLine'></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default NewestUpdate;
