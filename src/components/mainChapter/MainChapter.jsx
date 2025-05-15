import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./mainChapter.scss";

function toTitleCase(str) {
  return str.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function getLatestDate(uploadTime = []) {
  const last = uploadTime[uploadTime.length - 1];
  return last?.time?.split(" ")[1] || "--";
}

function MainChapter() {
  const { mangaName } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/data/jsonFiles/${mangaName}/manwhaDescription.json`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("❌ Failed to fetch manwha description", err);
      }
    };

    fetchData();
  }, [mangaName]);

  if (!data) return <div className="mainChapter">Loading...</div>;

  return (
    <div className="mainChapter">
      <div className="mainChapter-container">
        <div className="mainChapter-container-content">
          <div className="mainChapter-container_tree">
            <div className="mainChapter-container_tree_manwhaName" onClick={() => navigate("/")}> ManwhaSite </div>
            {" > "}
            {toTitleCase(mangaName)}
          </div>

          <div className="mainChapter-container-body">
            <div className="mainChapter-container-body-bodyLeft">
              <div className="mainChapter-container-body-bodyLeft-boxLeftRight">
                <div className="mainChapter-container-body-bodyLeft-boxLeftRight-leftSide">
                  <div className="mainChapter-container-body-bodyLeft-boxLeftRight-leftSide_imageLogo">
                    <img src={`/${data.imagelogo}`} alt="" />
                  </div>
                  <div className="mainChapter-container-body-bodyLeft-boxLeftRight-leftSide_rating">
                    <img src="/fullStar.png" alt="" />
                    <img src="/fullStar.png" alt="" />
                    <img src="/fullStar.png" alt="" />
                    <img src="/fullStar.png" alt="" />
                    <img src="/halfStar.png" alt="" />
                    <div>9/9</div>
                  </div>
                  <div className="mainChapter-container-body-bodyLeft-boxLeftRight-leftSide_info">
                    <div>Status</div>
                    <div>Ongoing</div>
                  </div>
                  <div className="mainChapter-container-body-bodyLeft-boxLeftRight-leftSide_info">
                    <div>Type</div>
                    <div>Manhwa</div>
                  </div>
                </div>

                <div className="mainChapter-container-body-bodyLeft-boxLeftRight-rightSide">
                  <div className="mainChapter-container-body-bodyLeft-boxLeftRight-rightSide_title">
                    {toTitleCase(data.name)}
                  </div>

                  <div className="mainChapter-container-body-bodyLeft-boxLeftRight-rightSide_description">
                    <div className="mainChapter-container-body-bodyLeft-boxLeftRight-rightSide_description_title">
                      Synopsis {toTitleCase(data.name)}
                    </div>
                    <div className="mainChapter-container-body-bodyLeft-boxLeftRight-rightSide_description_synopsis">
                      {data.synopsis || "--"}
                    </div>
                  </div>

                  <div className="mainChapter-container-body-bodyLeft-boxLeftRight-rightSide_manwhaDetails">
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
                      <div>{getLatestDate(data.uploadTime)}</div>
                    </div>
                  </div>

                  <div className="mainChapter-container-body-bodyLeft-boxLeftRight-rightSide_genres">
                    <div className="mainChapter-container-body-bodyLeft-boxLeftRight-rightSide_genres_title">Genres</div>
                    <div className="mainChapter-container-body-bodyLeft-boxLeftRight-rightSide_genres_boxes">
                      {(data.genres || []).map((g, i) => <div key={i}>{g}</div>)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mainChapter-container-body-bodyLeft_keywords">
                Keywords: {data.keywords?.join(", ") || "--"}
              </div>
            </div>
            <div className="mainChapter-container-body-bodyRight">
              <img src={`/sideImage/${mangaName}_sideimage.webp`} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainChapter;
