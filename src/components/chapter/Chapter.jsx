import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./chapter.scss";

function capitalizeTitle(title) {
  return title.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

function Chapter() {
  const { mangaName, chapterNumber } = useParams();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [chapters, setChapters] = useState([]);

  const currentChapterKey = `chapter-${chapterNumber}`;

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const res = await fetch(`/data/jsonFiles/${mangaName}/${currentChapterKey}.json`);
        const data = await res.json();
        setImages(data.images || []);
      } catch (err) {
        console.error("❌ Failed to fetch chapter JSON", err);
      }
    };

    const fetchChapterList = async () => {
      try {
        const res = await fetch(`/data/jsonFiles/${mangaName}`);
        const files = await res.json();
        const list = files
          .filter(name => name.startsWith("chapter-") && name.endsWith(".json"))
          .map(name => name.replace(".json", ""))
          .sort((a, b) => parseInt(a.replace("chapter-", "")) - parseInt(b.replace("chapter-", "")));
        setChapters(list);
      } catch (err) {
        console.error("❌ Failed to fetch chapter list", err);
      }
    };

    fetchChapter();
    fetchChapterList();
  }, [mangaName, chapterNumber]);

  return (
    <div className="Chapter">
      <div className="Chapter-scrollUp">
        <div className="Chapter-scrollUp_letter">
          <img src="/arrow.png" alt="Scroll Up" />
        </div>
      </div>

      <div className="Chapter-container">
        <div className="Chapter-container-title">
          {capitalizeTitle(mangaName)}
        </div>
        <div className="Chapter-container-tree">
          {`Home > ${capitalizeTitle(mangaName)} > Chapter ${chapterNumber}`}
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
                      window.location.href = `/readchapter/${mangaName}/chapter/${chap.replace("chapter-", "")}`;
                    }}
                  >
                    {chap.replace("chapter-", "Chapter ")}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="Chapter-container-list_button">
            <div className="Chapter-container-list_button_prev">{`< Prev`}</div>
            <div className="Chapter-container-list_button_next">{`Next >`}</div>
          </div>
        </div>

        <div className="Chapter-container-images">
          {images.map((src, i) => (
            <img key={i} src={src} alt={`Page ${i + 1}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Chapter;
