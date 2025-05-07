import React, { useRef, useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./scrollChapter.scss";
import { MyContext } from "../../data/ThemeProvider";

function ScrollChapter() {
  const scrollRef = useRef(null);
  const { mangaName } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { mangaData } = useContext(MyContext);

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

  const manga = mangaData[mangaName];
  if (!manga) return <div>not found</div>;

  const chapters = Object.entries(manga)
    .filter(([key]) => key.startsWith("chapter-"))
    .map(([key, val]) => {
      const number = parseInt(key.replace("chapter-", ""));
      const date = val.time?.split(" ")[1] || "unknown date";
      return { number, date };
    })
    .sort((a, b) => b.number - a.number); // Descending

  const lastChapter = chapters[0]?.number || "-";
  const firstChapter = chapters[chapters.length - 1]?.number || "-";

  const title = mangaName.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());

  const filteredChapters = chapters.filter(ch =>
    ch.number.toString().includes(search)
  );

  return (
    <div className="scrollChapter">
      <div className="scrollChapter-container">
        <div className="scrollChapter-container_title">{title}'s Chapters</div>

        <div className="scrollChapter-container_chapterButton">
          <div onClick={() => navigate(`/readchapter/${mangaName}/chapter/${firstChapter}`)} style={{ cursor: 'pointer' }}>
            <div>First Chapter</div>
            <div>Chapter {firstChapter}</div>
          </div>
          <div onClick={() => navigate(`/readchapter/${mangaName}/chapter/${lastChapter}`)} style={{ cursor: 'pointer' }}>
            <div>Last Chapter</div>
            <div>Chapter {lastChapter}</div>
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
