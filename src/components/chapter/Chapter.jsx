import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { MyContext } from '../../data/ThemeProvider';
import "./chapter.scss";

function capitalizeTitle(title) {
  if (!title) return '';
  return title.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

function Chapter() {
  const { API_BASE } = useContext(MyContext);
  const { mangaName, chapterNumber } = useParams();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [maxChapter, setMaxChapter] = useState(null);
  const [zoom, setZoom] = useState(() => {
    const cached = localStorage.getItem("zoomLevel");
    return cached ? parseInt(cached) : 100;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/chapter-data/${mangaName}/${chapterNumber}`);
        const data = await res.json();
        setImages(data.images || []);
        setChapters(data.chapters || []);
        setMaxChapter(data.maxChapter || null);
      } catch (err) {
        console.error("❌ Failed to fetch chapter data", err);
      }
    };

    const handleScroll = () => setShowScrollUp(window.scrollY > 1200);

    fetchData();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [API_BASE, mangaName, chapterNumber]);

  const current = parseInt(chapterNumber);
  const prev = Math.max(1, current - 1);
  const next = maxChapter && current < maxChapter ? current + 1 : null;

  const handleZoom = (direction) => {
    setZoom((prevZoom) => {
      const newZoom = direction === "in"
        ? Math.min(prevZoom + 5, 150)
        : Math.max(prevZoom - 5, 50);
      localStorage.setItem("zoomLevel", newZoom);
      return newZoom;
    });
  };

  return (
    <div className="Chapter">
      {showScrollUp && (
        <div
          className="Chapter-scrollUp"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{ cursor: "pointer" }}
        >
          <div className="Chapter-scrollUp_letter">
            <img src="/arrow.png" alt="Scroll Up" />
          </div>
        </div>
      )}

      {showScrollUp && (
        <div className="Chapter_zoom">
          <div className="Chapter_zoom_minus" onClick={() => handleZoom("out")}>
            <img src="/minus-icon.png" alt="Zoom Out" />
          </div>
          <div>{zoom}%</div>
          <div className="Chapter_zoom_plus" onClick={() => handleZoom("in")}>
            <img src="/plus-icon.png" alt="Zoom In" />
          </div>
        </div>
      )}

      <div className="Chapter-container">
        <div className="Chapter-container-title">
          {capitalizeTitle(mangaName)}
        </div>
        <div className="Chapter-container-tree">
          <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</a>
          <span>&nbsp;&gt;&nbsp;</span>
          <a href={`/series/${mangaName}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            {capitalizeTitle(mangaName)}
          </a>
          <span>&nbsp;&gt;&nbsp;</span>
          {`Chapter ${chapterNumber}`}
        </div>

        <div className="Chapter-container-list">
          <div
            className="Chapter-container-list_chapterList"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {`Chapter ${chapterNumber}`}
            {dropdownOpen && (
              <div className="Chapter-container-list_chapterList_dropdown">
                {chapters.map(chap => (
                  <div
                    key={chap}
                    className="Chapter-container-list_chapterList_dropdown_item"
                    onClick={() => {
                      const chapNum = chap.replace("chapter-", "");
                      window.location.href = `/readchapter/${mangaName}/chapter/${chapNum}`;
                    }}
                  >
                    {chap.replace("chapter-", "Chapter ")}
                  </div>
                ))}
              </div>
            )}
          </div>

          {!showScrollUp && (
            <div className="Chapter-container-list_zoom">
              <div className="Chapter-container-list_zoom_minus" onClick={() => handleZoom("out")}>
                <img src="/minus-icon.png" alt="Zoom Out" />
              </div>
              <div>{zoom}%</div>
              <div className="Chapter-container-list_zoom_plus" onClick={() => handleZoom("in")}>
                <img src="/plus-icon.png" alt="Zoom In" />
              </div>
            </div>
          )}

          <div className="Chapter-container-list_button">
            <div className="Chapter-container-list_button_box">
              <div
                className="Chapter-container-list_button_box_prev"
                onClick={() => window.location.href = `/readchapter/${mangaName}/chapter/${prev}`}
                style={{ cursor: 'pointer' }}
              >
                {`< Prev`}
              </div>
              <div
                className="Chapter-container-list_button_box_next"
                onClick={() => {
                  if (next) {
                    window.location.href = `/readchapter/${mangaName}/chapter/${next}`;
                  }
                }}
                style={{ cursor: next ? 'pointer' : 'not-allowed', opacity: next ? 1 : 0.5 }}
              >
                {`Next >`}
              </div>
            </div>
          </div>
        </div>

        <div className="Chapter-container-images">
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Page ${i + 1}`}
              style={{ width: `${zoom}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Chapter;
