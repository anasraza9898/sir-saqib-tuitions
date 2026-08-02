import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = resolve(projectRoot, "..", "02-website-assets");
const targetRoot = resolve(projectRoot, "public", "assets");

const assetMap = {
  "images/logo/logo.webp": "logo/sir-saqib-tuitions-logo.webp",
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
  "images/timetables/class 10 general evening boys.webp": "timetables/boys/class-10-general-evening.webp",
  "images/timetables/class 10 general morning boys.webp": "timetables/boys/class-10-general-morning.webp",
  "images/timetables/class 10 science group batch a.webp": "timetables/boys/class-10-science-batch-a.webp",
  "images/timetables/class 10 science group batch b.webp": "timetables/boys/class-10-science-batch-b.webp",
  "images/timetables/class 11 commerce evening boys.webp": "timetables/boys/class-11-commerce-evening.webp",
  "images/timetables/class 11 commerce morning boys.webp": "timetables/boys/class-11-commerce-morning.webp",
  "images/timetables/class 11 science boys.webp": "timetables/boys/class-11-science.webp",
  "images/timetables/class 12 commerce evening boys.webp": "timetables/boys/class-12-commerce-evening.webp",
  "images/timetables/class 12 commerce morning boys.webp": "timetables/boys/class-12-commerce-morning.webp",
  "images/timetables/class 12 science boys.webp": "timetables/boys/class-12-science.webp",
  "images/timetables/class 9 general evening batch a boys.webp": "timetables/boys/class-9-general-evening-batch-a.webp",
  "images/timetables/class 9 general evening batch b boys.webp": "timetables/boys/class-9-general-evening-batch-b.webp",
  "images/timetables/class 9 general morning boys.webp": "timetables/boys/class-9-general-morning.webp",
  "images/timetables/class 9 science group batch a.webp": "timetables/boys/class-9-science-batch-a.webp",
  "images/timetables/class 9 science group batch b.webp": "timetables/boys/class-9-science-batch-b.webp",
  "images/timetables/class 10 general girls.webp": "timetables/girls/class-10-general.webp",
  "images/timetables/class 10 science girls.webp": "timetables/girls/class-10-science.webp",
  "images/timetables/class 11 commerce girls.webp": "timetables/girls/class-11-commerce.webp",
  "images/timetables/class 11 science girls.webp": "timetables/girls/class-11-science.webp",
  "images/timetables/class 12 commerce girls.webp": "timetables/girls/class-12-commerce.webp",
  "images/timetables/class 12 science girls.webp": "timetables/girls/class-12-science.webp",
  "images/timetables/class 9 general girls.webp": "timetables/girls/class-9-general.webp",
  "images/timetables/class 9 science girls.webp": "timetables/girls/class-9-science.webp",
  "videos/campus/boys classroom video.mp4": "videos/campus/boys-classroom.mp4",
  "videos/classroom/classroom + teaching + student learning.mp4": "videos/classroom/classroom-teaching-student-learning.mp4",
  "videos/intro/girls intro + result + admissions.mp4": "videos/intro/girls-intro-results-admissions.mp4",
  "videos/intro/intro + result + admissions.mp4": "videos/hero/intro-results-admissions.mp4",
  "videos/intro/intro.mp4": "videos/intro/academy-intro.mp4",
  "videos/results/highest achivers of matric science group result 2026.mp4": "videos/results/matric-science-high-achievers-2026.mp4",
  "videos/testimonials/Tetimonials.mp4": "videos/testimonials/student-testimonials.mp4"
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
