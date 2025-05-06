import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./chapter.scss";
import mangaData from "../../mangaData.json";

function capitalizeTitle(title) {
  return title.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

function Chapter() {
  const { mangaName, chapterNumber } = useParams();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const currentChapterKey = `chapter-${chapterNumber}`;
  const currentManga = mangaData[mangaName];
  const chapters = Object.keys(currentManga)
    .filter(key => key.startsWith("chapter-"))
    .sort((a, b) => parseInt(b.replace("chapter-", "")) - parseInt(a.replace("chapter-", "")))
    .reverse();

  const images = currentManga?.[currentChapterKey]?.images || [];

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
                      window.location.href = `/series/${mangaName}/chapter/${chap.replace("chapter-", "")}`;
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
