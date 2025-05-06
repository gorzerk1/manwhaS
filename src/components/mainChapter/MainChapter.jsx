import React from "react";
import { useParams } from "react-router-dom";
import "./mainChapter.scss";
import mangaData from "../../mangaData.json";

function toTitleCase(str) {
  return str.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function getLatestDate(chapters) {
  const times = Object.entries(chapters)
    .filter(([key]) => key.startsWith("chapter-"))
    .map(([_, val]) => val.time?.split(" ")[1]); // get only the date part
  return times.length > 0 ? times.sort().reverse()[0] : "--";
}

function MainChapter() {
  const { mangaName } = useParams();
  const data = mangaData[mangaName];

  if (!data) return <div className="mainChapter">Not found.</div>;

  return (
    <div className="mainChapter">
      <div className="mainChapter-container">
        <div className="mainChapter-container-content">
          <div className="mainChapter-container_tree">{`ManwhaSite > ${toTitleCase(mangaName)}`}</div>
          <div className="mainChapter-container-body">
            <div className="mainChapter-container-body-boxLeftRight">
              <div className="mainChapter-container-body-boxLeftRight-leftSide">
                <div className="mainChapter-container-body-boxLeftRight-leftSide_imageLogo">
                  <img src={`/${data.imagelogo}`} alt="" />
                </div>
                <div className="mainChapter-container-body-boxLeftRight-leftSide_rating">
                  <img src="/fullStar.png" alt="" />
                  <img src="/fullStar.png" alt="" />
                  <img src="/fullStar.png" alt="" />
                  <img src="/fullStar.png" alt="" />
                  <img src="/halfStar.png" alt="" />
                  <div>9/9</div>
                  <div className="mainChapter-container-body-boxLeftRight-leftSide_rating_rateButton">Rate</div>
                </div>
                <div className="mainChapter-container-body-boxLeftRight-leftSide_info">
                  <div>Status</div>
                  <div>Ongoing</div>
                </div>
                <div className="mainChapter-container-body-boxLeftRight-leftSide_info">
                  <div>Type</div>
                  <div>Manhwa</div>
                </div>
              </div>

              <div className="mainChapter-container-body-boxLeftRight-rightSide">
                <div className="mainChapter-container-body-boxLeftRight-rightSide_title">
                  {toTitleCase(mangaName)}
                </div>

                <div className="mainChapter-container-body-boxLeftRight-rightSide_description">
                  <div className="mainChapter-container-body-boxLeftRight-rightSide_description_title">
                    Synopsis {toTitleCase(mangaName)}
                  </div>
                  <div className="mainChapter-container-body-boxLeftRight-rightSide_description_synopsis">
                    {data.synopsis || "--"}
                  </div>
                </div>

                <div className="mainChapter-container-body-boxLeftRight-rightSide_manwhaDetails">
                  <div>
                    <div>Author</div>
                    <div>{data.author || "--"}</div>
                  </div>
                  <div>
                    <div>Artist</div>
                    <div>{data.artist || "--"}</div>
                  </div>
                  <div>
                    <div>Updated On</div>
                    <div>{getLatestDate(data)}</div>
                  </div>
                </div>

                <div className="mainChapter-container-body-boxLeftRight-rightSide_genres">
                  <div className="mainChapter-container-body-boxLeftRight-rightSide_genres_title">Genres</div>
                  <div className="mainChapter-container-body-boxLeftRight-rightSide_genres_boxes">
                    {(data.genres || []).map((g, i) => <div key={i}>{g}</div>)}
                  </div>
                </div>
              </div>
            </div>

            <div className="mainChapter-container-body_keywords">
              Keywords: {data.keywords?.join(", ") || "--"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainChapter;
