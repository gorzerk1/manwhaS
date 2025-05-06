const fs = require("fs");
const path = require("path");

// === CONFIG ===
const mawhaBasePath = path.join("E:", "my_projects", "React", "manwha", "public", "Mawhas");
const outputDir = path.join("E:", "my_projects", "React", "manwha", "src");
const metadataJsonPath = path.join(outputDir, "manhwa_metadata.json");

// === Timestamped output filename ===
const timestamp = new Date().toISOString().replace(/[:T]/g, "-").slice(0, 16); // 2025-05-06-14-44
const outputJsonPath = path.join(outputDir, `mangaData_${timestamp}.json`);

// === LOAD METADATA ===
const metadata = JSON.parse(fs.readFileSync(metadataJsonPath, "utf-8"));
const output = {};

// === SCAN MAWHA FOLDERS ===
const manhwaDirs = fs.readdirSync(mawhaBasePath, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

manhwaDirs.forEach(manhwaName => {
  const manhwaPath = path.join(mawhaBasePath, manhwaName);

  const chapters = fs.readdirSync(manhwaPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && dirent.name.startsWith("chapter-"))
    .map(dirent => dirent.name)
    .sort((a, b) => {
      const aNum = parseInt(a.replace("chapter-", ""));
      const bNum = parseInt(b.replace("chapter-", ""));
      return aNum - bNum;
    });

  // Use metadata if available
  output[manhwaName] = metadata[manhwaName] || {
    cover: `${manhwaName}.webp`
  };

  chapters.forEach(chapter => {
    const chapterPath = path.join(manhwaPath, chapter);
    const imageFiles = fs.readdirSync(chapterPath)
      .filter(file => /\.(webp|jpg|jpeg|png)$/i.test(file))
      .sort();

    const stat = fs.statSync(chapterPath);
    const timeObj = new Date(stat.mtime);

    const timeStr = timeObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }); // 24h
    const dateStr = timeObj.toLocaleDateString('en-GB'); // DD/MM/YYYY

    output[manhwaName][chapter] = {
      time: `${timeStr} ${dateStr}`,
      images: imageFiles.map(filename =>
        `/Mawhas/${manhwaName}/${chapter}/${filename}`
      )
    };
  });
});

// === SAVE OUTPUT ===
fs.writeFileSync(outputJsonPath, JSON.stringify(output, null, 2));
console.log("✅ mangaData.json created at:", outputJsonPath);
