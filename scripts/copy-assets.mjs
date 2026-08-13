import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = resolve(projectRoot, "..", "02-website-assets");
const targetRoot = resolve(projectRoot, "public", "assets");

const assetMap = {
  "images/logo/SST_Logo_T.b.png": "logo/SST_Logo_T.b.png",
  "images/posters/admission-boys-campus.jpg.webp": "posters/admission-boys-campus.webp",
  "images/posters/admission-girls-campus.jpg.webp": "posters/admission-girls-campus.webp",
  "images/posters/admission-hafiz-program.jpg.webp": "posters/admission-hafiz-program.webp",
  "images/posters/admission-hill-park-campus.jpg.webp": "posters/admission-hill-park-campus.webp",
  "images/posters/current facebook poster.webp": "posters/current-facebook-poster.webp",
  "images/posters/faculty-instructors.jpg.webp": "posters/faculty-instructors.webp",
  "images/results/boys class 11 12 pre eng computer ,scince,commerce group result 2025.webp": "results/boys-xi-xii-groups-2025.webp",
  "images/results/boyss class 9 10 science and general matric 2025 result.webp": "results/boys-ix-x-matric-2025.webp",
  "images/results/girls class 11 12 pre eng, computer scince,commerce group result 2025.webp": "results/girls-xi-xii-groups-2025.webp",
  "images/results/girls class 9 10 science and general matric 2025 result.webp": "results/girls-ix-x-matric-2025.webp",
  "images/results/matric 2026 result  all boys science and general group.webp": "results/boys-matric-science-general-2026.webp",
  "images/results/matric general girl result 2026.webp": "results/girls-matric-general-2026.webp",
  "images/results/matric science  girl result 2026.webp": "results/girls-matric-science-2026.webp",
  "images/results/matric science girl 2 result 2026.webp": "results/girls-matric-science-2-2026.webp",
  "images/timetables/9 general group a batch.png": "timetables/official/grade-ix-general-group-a.png",
  "images/timetables/9 general group  b batch.png": "timetables/official/grade-ix-general-group-b.png",
  "images/timetables/9 general morning batch.png": "timetables/official/grade-ix-general-morning.png",
  "images/timetables/9 science group a batch.png": "timetables/official/grade-ix-science-group-a.png",
  "images/timetables/10 general morning batch.png": "timetables/official/grade-x-general-morning.png",
  "images/timetables/10 general evening batch.png": "timetables/official/grade-x-general-evening.png",
  "images/timetables/10 science group a batch.png": "timetables/official/grade-x-science-group-a.png",
  "images/timetables/10 scinece group b batch.png": "timetables/official/grade-x-science-group-b.png",
  "images/timetables/11 commerce morning batch.png": "timetables/official/grade-xi-commerce-morning.png",
  "images/timetables/11 commerce evening batch.png": "timetables/official/grade-xi-commerce-evening.png",
  "images/timetables/11 science batch.png": "timetables/official/grade-xi-science-main.png",
  "images/timetables/12 commerce morning batch.png": "timetables/official/grade-xii-commerce-morning.png",
  "images/timetables/12 commerce evening batch.png": "timetables/official/grade-xii-commerce-evening.png",
  "images/timetables/12 science batch.png": "timetables/official/grade-xii-science-main.png",
  "videos/campus/boys classroom video.mp4": "videos/campus/boys-classroom.mp4",
  "videos/classroom/classroom + teaching + student learning.mp4": "videos/classroom/classroom-teaching-student-learning.mp4",
  "videos/intro/girls intro + result + admissions.mp4": "videos/intro/girls-intro-results-admissions.mp4",
  "videos/intro/academy-introduction.mp4": "final/videos/academy-introduction.mp4",
  "videos/results/highest achivers of matric science group result 2026.mp4": "videos/results/matric-science-high-achievers-2026.mp4",
  "videos/testimonials/testimonials.mp4": "final/videos/testimonials.mp4"
};

const targets = new Set(Object.values(assetMap));
if (targets.size !== Object.keys(assetMap).length) {
  throw new Error("Asset map contains a destination filename collision.");
}

for (const [source, destination] of Object.entries(assetMap)) {
  const sourcePath = resolve(sourceRoot, source);
  const targetPath = resolve(targetRoot, destination);

  if (!sourcePath.startsWith(sourceRoot) || !targetPath.startsWith(targetRoot)) {
    throw new Error(`Unsafe asset path: ${source}`);
  }

  await mkdir(dirname(targetPath), { recursive: true });
  await copyFile(sourcePath, targetPath);
}

console.log(`Copied ${targets.size} optimized assets without changing source files.`);
