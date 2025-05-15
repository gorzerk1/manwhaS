import React, { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./scrollChapter.scss";

function toTitleCase(str) {
  return str.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function ScrollChapter() {
  const scrollRef = useRef(null);
  const { mangaName } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://18.102.36.92:4000/data/jsonFiles/${mangaName}/manwhaDescription.json`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("❌ Failed to fetch manwhaDescription.json", err);
      }
    };
    fetchData();
  }, [mangaName]);

  useEffect(() => {
    const el = scrollRef.current;
    const stopScroll = (e) => {
      if (el && el.scrollHeight > el.clientHeight && (e.deltaY || e.deltaX)) {
        e.stopPropagation();
      }
    };
    if (el) el.addEventListener("wheel", stopScroll, { passive: false });
    return () => el && el.removeEventListener("wheel", stopScroll);
  }, []);

  if (!data) return <div>Loading...</div>;

  const title = toTitleCase(data.name || mangaName);
  const chapters = (data.uploadTime || [])
    .filter(c => c.chapter && c.time)
    .map(c => ({
      number: c.chapter,
      date: c.time?.split(" ")[1] || "unknown"
    }))
    .sort((a, b) => b.number - a.number);

  const lastChapter = chapters[0]?.number || "-";
  const firstChapter = chapters[chapters.length - 1]?.number || "-";

  const filteredChapters = chapters.filter(ch =>
    ch.number.toString().includes(search)
  );

  return (
    <div className="scrollChapter">
      <div className="scrollChapter-container">
        <div className="scrollChapter-container_title">{title}'s Chapters</div>

        <div className="scrollChapter-container_chapterButton">
          <div onClick={() => navigate(`/readchapter/${mangaName}/chapter/${firstChapter}`)} style={{ cursor: 'pointer' }} className="scrollChapter-container_chapterButton_firstChap">
            <div>First Chapter</div>
            <div>Chapter {firstChapter}</div>
            <div className="border-right"></div>
            <div className="border-left"></div>
          </div>
          <div onClick={() => navigate(`/readchapter/${mangaName}/chapter/${lastChapter}`)} style={{ cursor: 'pointer' }} className="scrollChapter-container_chapterButton_lastChap">
            <div>Last Chapter</div>
            <div>Chapter {lastChapter}</div>
            <div className="border-right"></div>
            <div className="border-left"></div>
          </div>

        </div>

        <div className="scrollChapter-container_searchBox">
          <input
            type="text"
            placeholder="Search chapter. Example 1 or 250 *numbers only*"
            className="scrollChapter-container_searchBox_input"
            value={search}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              setSearch(val);
            }}
          />
        </div>

        <div className="scrollChapter-container_allChapters" ref={scrollRef}>
          {filteredChapters.map((chap, i) => (
            <div
              key={i}
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/readchapter/${mangaName}/chapter/${chap.number}`)}
            >
              <div>Chapter {chap.number}</div>
              <div>{chap.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ScrollChapter;
