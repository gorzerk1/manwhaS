import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './newestUpdate.scss';

function NewestUpdate() {
  const [chapters, setChapters] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://18.102.36.92:4000/api/filtered-manwhas')
      .then(res => res.json())
      .then(data => setChapters(data))
      .catch(err => console.error('fetch error:', err));
  }, []);

  const formatTimeAgo = (timeStr) => {
    const [hourMin, datePart] = timeStr.split(' ');
    const [hour, minute] = hourMin.split(':');
    const [day, month, year] = datePart.split('/');

    const itemTime = new Date(Date.UTC(+year, +month - 1, +day, +hour, +minute));
    const now = new Date();
    const diffMs = now - itemTime;

    const mins = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (mins < 60) return `${mins} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
  };

  const parseTime = (str) => {
    const [hm, dmy] = str.split(' ');
    const [h, m] = hm.split(':');
    const [d, mo, y] = dmy.split('/');
    return new Date(Date.UTC(+y, +mo - 1, +d, +h, +m));
  };
  const formatManwhaName = (name) =>
    name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  return (
    <div className="NewestUpdate">
      <div className='NewestUpdate-container'>
        <div className='NewestUpdate-container_title'>Latest Updated Chapters</div>
        <div className='NewestUpdate-container-newestChap'>
          {Object.values(chapters)
            .flat()
            .sort((a, b) => parseTime(b.time) - parseTime(a.time))
            .map((chap, index) => {
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
                  <div className="NewestUpdate-container-newestChap_Chap_manwhaName">{formatManwhaName(chap.manwhaName)}</div>
                  <div className="NewestUpdate-container-newestChap_Chap_chapter">{chap.chapter}</div>
                  <div className="NewestUpdate-container-newestChap_Chap_timeStamps">
                    {formatTimeAgo(chap.time)}
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
