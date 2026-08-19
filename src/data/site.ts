import {
  BookOpenCheck,
  BriefcaseBusiness,
  Building2,
  BookOpen,
  FlaskConical,
  GraduationCap,
  Laptop,
  Microscope,
  ShieldCheck,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";

export const site = {
  name: "Sir Saqib Tuitions",
  tagline: "A Path to Sound Success in Education",
  description:
    "Complete academic support from Grades I-VIII to Matric, Intermediate and formal education support for Huffaz.",
  admissionsPhone: "0300-2320599",
  whatsapp: "923002320599",
} as const;

export const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Our Mission", href: "/about/mission" },
  { label: "Our Vision", href: "/about/vision" },
  { label: "Courses", href: "/courses" },
  { label: "Campuses", href: "/campuses" },
  { label: "Faculty", href: "/faculty" },
  { label: "Results", href: "/results" },
  { label: "Timetables", href: "/timetables" },
  { label: "Media", href: "/media" },
  { label: "Contact", href: "/contact" },
] as const;

export const missionVision = {
  mission: {
    title: "Focused support with clear academic structure.",
    body: "To provide focused, disciplined and accessible academic support that strengthens foundations, builds confidence and helps students make consistent progress through clear instruction, regular assessment and individual attention.",
  },
  vision: {
    title: "A learning environment for long-term progress.",
    body: "To build a learning environment where students at every academic stage develop the knowledge, discipline and confidence required for long-term academic progress and future success.",
  },
} as const;

export const trustItems = [
  { value: "24 Years", label: "Experience" },
  { value: "3", label: "Campuses" },
  { value: "Qualified", label: "Faculty" },
  { value: "I-XII", label: "Grades" },
] as const;

export const strengths = [
  {
    title: "Qualified faculty",
    description: "Experienced instructors support focused subject learning across the offered streams.",
    icon: UserRoundCheck,
  },
  {
    title: "Individual attention",
    description: "A disciplined learning environment built around progress, support and accountability.",
    icon: UsersRound,
  },
  {
    title: "Assessment system",
    description: "Monthly assessments, MTS, and mid-term and final-term examinations track preparation.",
    icon: BookOpenCheck,
  },
  {
    title: "Secured environment",
    description: "Good study spaces, strict discipline and regular parent meetings support consistent learning.",
    icon: ShieldCheck,
  },
] as const;

export const programs = [
  {
    id: "grade-ix-matric",
    title: "Grade IX Matric",
    category: "Matric",
    level: "Matric",
    stream: "Science / General",
    description: "Grade IX preparation with focused support for Science, General and compulsory subjects.",
    subjects: ["Grade IX", "Science", "General", "Compulsory subjects"],
    poster: "/assets/results/boys-ix-x-matric-2025.webp",
    posterPair: {
      boys: "/assets/results/boys-ix-x-matric-2025.webp",
      girls: "/assets/results/girls-ix-x-matric-2025.webp",
    },
    icon: FlaskConical,
  },
  {
    id: "grade-x-matric",
    title: "Grade X Matric",
    category: "Matric",
    level: "Matric",
    stream: "Science / General",
    description: "Grade X board-focused preparation with regular assessment and subject guidance.",
    subjects: ["Grade X", "Science", "General", "Compulsory subjects"],
    poster: "/assets/results/boys-ix-x-matric-2025.webp",
    posterPair: {
      boys: "/assets/results/boys-ix-x-matric-2025.webp",
      girls: "/assets/results/girls-ix-x-matric-2025.webp",
    },
    icon: BookOpenCheck,
  },
  {
    id: "xi-xii-pre-medical",
    title: "XI-XII Pre-Medical",
    category: "Intermediate",
    level: "Intermediate",
    stream: "Pre-Medical",
    description: "Focused Intermediate preparation for students pursuing the medical-science pathway.",
    subjects: ["Pre-Medical", "Intermediate"],
    poster: "/assets/results/boys-xi-xii-groups-2025.webp",
    posterPair: {
      boys: "/assets/results/boys-xi-xii-groups-2025.webp",
      girls: "/assets/results/girls-xi-xii-groups-2025.webp",
    },
    icon: Microscope,
  },
  {
    id: "xi-xii-pre-engineering",
    title: "XI-XII Pre-Engineering",
    category: "Intermediate",
    level: "Intermediate",
    stream: "Pre-Engineering",
    description: "Focused support for the core subjects in the Pre-Engineering stream.",
    subjects: ["Pre-Engineering", "Science group"],
    poster: "/assets/results/boys-xi-xii-groups-2025.webp",
    posterPair: {
      boys: "/assets/results/boys-xi-xii-groups-2025.webp",
      girls: "/assets/results/girls-xi-xii-groups-2025.webp",
    },
    icon: FlaskConical,
  },
  {
    id: "xi-xii-general-science",
    title: "XI-XII General Science",
    category: "Intermediate",
    level: "Intermediate",
    stream: "General Science",
    description: "Structured Intermediate support for students in General Science and computing-related subjects.",
    subjects: ["General Science", "Computing"],
    poster: "/assets/results/boys-xi-xii-groups-2025.webp",
    posterPair: {
      boys: "/assets/results/boys-xi-xii-groups-2025.webp",
      girls: "/assets/results/girls-xi-xii-groups-2025.webp",
    },
    icon: Laptop,
  },
  {
    id: "xi-xii-commerce",
    title: "XI-XII Commerce",
    category: "Intermediate",
    level: "Intermediate",
    stream: "Commerce",
    description: "Organized Commerce preparation supported by experienced faculty.",
    subjects: ["Commerce group", "Intermediate"],
    poster: "/assets/results/boys-xi-xii-groups-2025.webp",
    posterPair: {
      boys: "/assets/results/boys-xi-xii-groups-2025.webp",
      girls: "/assets/results/girls-xi-xii-groups-2025.webp",
    },
    icon: BriefcaseBusiness,
  },
  {
    id: "iv-viii",
    title: "Grades I-VIII",
    category: "Grades I-VIII",
    level: "Grades I-VIII",
    stream: "General",
    description: "A strong academic foundation through focused curriculum and regular attention.",
    subjects: ["Foundation tuition", "Core subjects"],
    poster: "/assets/posters/admission-boys-campus.webp",
    icon: GraduationCap,
  },
  {
    id: "huffaz-programme",
    title: "Huffaz Programme",
    category: "Huffaz",
    level: "Formal education",
    stream: "Huffaz",
    description: "Hafiz to Formal Education Programme, including a crash course for Huffaz.",
    subjects: ["Formal education", "Compulsory subjects"],
    poster: "/assets/posters/admission-hafiz-program.webp",
    icon: BookOpen,
  },
] as const;

export const campuses = [
  {
    id: "boys",
    name: "Boys Campus",
    shortName: "Boys",
    contacts: [{ name: "Sir Saqib Zaki", phone: "0300-2320599", whatsapp: "923002320599" }],
    phones: ["0300-2320599"],
    whatsapp: "923002320599",
    address: "SA 24/1 Block #05, K.A.E.C.H.S, near Bin Ahmed Supermarket, Karachi",
    area: "K.A.E.C.H.S - Block 05",
    poster: "/assets/posters/admission-boys-campus.webp",
    accent: "boys",
  },
  {
    id: "girls",
    name: "Girls Campus",
    shortName: "Girls",
    contacts: [{ name: "Mrs. Nousheen", phone: "0321-2484395", whatsapp: "923212484395" }],
    phones: ["0321-2484395"],
    whatsapp: "923212484395",
    address: "C-11 Commercial Block #02, K.A.E.C.H.S, Karachi",
    area: "K.A.E.C.H.S - Commercial Block 02",
    poster: "/assets/posters/admission-girls-campus.webp",
    accent: "girls",
  },
  {
    id: "hill-park",
    name: "Hill Park Campus",
    shortName: "Hill Park",
    contacts: [
      { name: "Sir Ashhad Sohail", phone: "0323-1909072", whatsapp: "923231909072" },
      { name: "Sir Hanzala Nouman", phone: "0323-1909062", whatsapp: "923231909062" },
    ],
    phones: ["0323-1909072", "0323-1909062"],
    whatsapp: "923231909072",
    address: "22-Z Block #7-8, K.M.C.H.S Society, near Hill Park, Karachi",
    area: "K.M.C.H.S Society / Hill Park",
    poster: "/assets/posters/admission-hill-park-campus.webp",
    accent: "hill",
  },
] as const;

export const faculty = [
  { name: "Sir Saqib Zaki", qualification: "CAT, B.Com, MBA", experience: 24, field: "Leadership & Commerce" },
  { name: "Eng. Babar Ashraf", qualification: "BSEL", experience: 11, field: "Engineering" },
  { name: "Sir Muhammad Armash", qualification: "MSc Applied Mathematics", experience: 11, field: "Mathematics" },
  { name: "Sir Shahid Punal", qualification: "MSc Applied Mathematics", experience: 11, field: "Mathematics" },
  { name: "Sir Hanzala Nauman", qualification: "BE Biomedical", experience: 8, field: "Biomedical Science" },
  { name: "Sir Ashhad Sohail", qualification: "CA Finalist", experience: 8, field: "Commerce" },
  { name: "Miss Javeria", qualification: "BS Bio-Sciences, MPhil Biotechnology ongoing", experience: 5, field: "Biological Sciences" },
  { name: "Sir Hassan Haroon", qualification: "Pharma-D ongoing", experience: 5, field: "Life Sciences" },
  { name: "Sir Hasan", qualification: "BSCS ongoing", experience: 3, field: "Computer Science" },
] as const;

export const results2026 = [
  { src: "/assets/results/boys-matric-science-general-2026.webp", alt: "2026 Boys Campus SSC Part II Science and General high achievers", title: "Boys Campus Matric - Science & General" },
  { src: "/assets/results/girls-matric-general-2026.webp", alt: "2026 Girls Campus Matric General result highlight", title: "Girls Campus Matric - General" },
  { src: "/assets/results/girls-matric-science-2026.webp", alt: "2026 Girls Campus Matric Science result highlight", title: "Girls Campus Matric - Science" },
  { src: "/assets/results/girls-matric-science-2-2026.webp", alt: "Second 2026 Girls Campus Matric Science result highlight", title: "Girls Campus Matric - Science II" },
] as const;

export const results2025 = [
  { src: "/assets/results/boys-xi-xii-groups-2025.webp", alt: "2025 Boys Campus classes XI-XII group result highlights", title: "Boys Campus XI-XII Groups" },
  { src: "/assets/results/boys-ix-x-matric-2025.webp", alt: "2025 Boys Campus classes IX-X Matric result highlights", title: "Boys Campus IX-X Matric" },
  { src: "/assets/results/girls-xi-xii-groups-2025.webp", alt: "2025 Girls Campus classes XI-XII group result highlights", title: "Girls Campus XI-XII Groups" },
  { src: "/assets/results/girls-ix-x-matric-2025.webp", alt: "2025 Girls Campus classes IX-X Matric result highlights", title: "Girls Campus IX-X Matric" },
] as const;

export type Timetable = {
  id: string;
  classLevel: "9" | "10" | "11" | "12";
  grade: "IX" | "X" | "XI" | "XII";
  stream: "Science" | "General" | "Commerce";
  variantKey: "group-a" | "group-b" | "morning" | "evening" | "main";
  variant: string;
  label: string;
  src: string;
  alt: string;
};

export const timetables: Timetable[] = [
  { id: "ix-general-group-a", classLevel: "9", grade: "IX", stream: "General", variantKey: "group-a", variant: "Group A", label: "Grade IX General Group A", src: "/assets/timetables/official/grade-ix-general-group-a.png", alt: "Sir Saqib Tuitions Grade IX General Group A timetable" },
  { id: "ix-general-group-b", classLevel: "9", grade: "IX", stream: "General", variantKey: "group-b", variant: "Group B", label: "Grade IX General Group B", src: "/assets/timetables/official/grade-ix-general-group-b.png", alt: "Sir Saqib Tuitions Grade IX General Group B timetable" },
  { id: "ix-general-morning", classLevel: "9", grade: "IX", stream: "General", variantKey: "morning", variant: "Morning", label: "Grade IX General Morning", src: "/assets/timetables/official/grade-ix-general-morning.png", alt: "Sir Saqib Tuitions Grade IX General Morning timetable" },
  { id: "ix-science-group-a", classLevel: "9", grade: "IX", stream: "Science", variantKey: "group-a", variant: "Group A", label: "Grade IX Science Group A", src: "/assets/timetables/official/grade-ix-science-group-a.png", alt: "Sir Saqib Tuitions Grade IX Science Group A timetable" },
  { id: "ix-science-group-b", classLevel: "9", grade: "IX", stream: "Science", variantKey: "group-b", variant: "Group B", label: "Grade IX Science Group B", src: "/assets/timetables/official/grade-ix-science-group-b.png", alt: "Sir Saqib Tuitions Grade IX Science Group B timetable" },
  { id: "x-general-morning", classLevel: "10", grade: "X", stream: "General", variantKey: "morning", variant: "Morning", label: "Grade X General Morning", src: "/assets/timetables/official/grade-x-general-morning.png", alt: "Sir Saqib Tuitions Grade X General Morning timetable" },
  { id: "x-general-evening", classLevel: "10", grade: "X", stream: "General", variantKey: "evening", variant: "Evening", label: "Grade X General Evening", src: "/assets/timetables/official/grade-x-general-evening.png", alt: "Sir Saqib Tuitions Grade X General Evening timetable" },
  { id: "x-science-group-a", classLevel: "10", grade: "X", stream: "Science", variantKey: "group-a", variant: "Group A", label: "Grade X Science Group A", src: "/assets/timetables/official/grade-x-science-group-a.png", alt: "Sir Saqib Tuitions Grade X Science Group A timetable" },
  { id: "x-science-group-b", classLevel: "10", grade: "X", stream: "Science", variantKey: "group-b", variant: "Group B", label: "Grade X Science Group B", src: "/assets/timetables/official/grade-x-science-group-b.png", alt: "Sir Saqib Tuitions Grade X Science Group B timetable" },
  { id: "xi-commerce-morning", classLevel: "11", grade: "XI", stream: "Commerce", variantKey: "morning", variant: "Morning", label: "Grade XI Commerce Morning", src: "/assets/timetables/official/grade-xi-commerce-morning.png", alt: "Sir Saqib Tuitions Grade XI Commerce Morning timetable" },
  { id: "xi-commerce-evening", classLevel: "11", grade: "XI", stream: "Commerce", variantKey: "evening", variant: "Evening", label: "Grade XI Commerce Evening", src: "/assets/timetables/official/grade-xi-commerce-evening.png", alt: "Sir Saqib Tuitions Grade XI Commerce Evening timetable" },
  { id: "xi-science-main", classLevel: "11", grade: "XI", stream: "Science", variantKey: "main", variant: "Main timetable", label: "Grade XI Science", src: "/assets/timetables/official/grade-xi-science-main.png", alt: "Sir Saqib Tuitions Grade XI Science timetable" },
  { id: "xii-commerce-morning", classLevel: "12", grade: "XII", stream: "Commerce", variantKey: "morning", variant: "Morning", label: "Grade XII Commerce Morning", src: "/assets/timetables/official/grade-xii-commerce-morning.png", alt: "Sir Saqib Tuitions Grade XII Commerce Morning timetable" },
  { id: "xii-commerce-evening", classLevel: "12", grade: "XII", stream: "Commerce", variantKey: "evening", variant: "Evening", label: "Grade XII Commerce Evening", src: "/assets/timetables/official/grade-xii-commerce-evening.png", alt: "Sir Saqib Tuitions Grade XII Commerce Evening timetable" },
  { id: "xii-science-main", classLevel: "12", grade: "XII", stream: "Science", variantKey: "main", variant: "Main timetable", label: "Grade XII Science", src: "/assets/timetables/official/grade-xii-science-main.png", alt: "Sir Saqib Tuitions Grade XII Science timetable" },
];

export type TimetableSlot = { start: string; end: string; subject: string };
export type TimetableDay = { day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday"; slots: TimetableSlot[]; note?: string };

/**
 * No current structured timetable transcription is installed. The stable
 * timetable slot index above is ready for final posters. Do not quote old or
 * image-derived schedule text until this record is updated from verified
 * structured timetable data.
 */
export const timetableSchedules: Readonly<Record<string, readonly TimetableDay[]>> = {
};

export type MediaItem = {
  id: string;
  category: "Academy Introduction" | "Girls Campus" | "Boys Campus" | "Classroom Learning" | "Results" | "Testimonials";
  title: string;
  description: string;
  src: string;
  poster: string;
  duration: string;
};

export const mediaItems: MediaItem[] = [
  { id: "academy-introduction", category: "Academy Introduction", title: "Academy Introduction", description: "Official academy introduction video slot.", src: "/assets/final/videos/academy-introduction.mp4", poster: "/assets/posters/video/sir-saqib-introduction.webp", duration: "HD" },
  { id: "girls-campus", category: "Girls Campus", title: "Girls Campus", description: "Official Girls Campus video slot.", src: "/assets/videos/intro/girls-intro-results-admissions.mp4", poster: "/assets/posters/video/girls-campus-introduction.webp", duration: "0:33" },
  { id: "boys-campus", category: "Boys Campus", title: "Boys Campus", description: "Official Boys Campus video slot.", src: "/assets/videos/campus/boys-classroom.mp4", poster: "/assets/posters/video/boys-campus-classroom.webp", duration: "1:10" },
  { id: "classroom-learning", category: "Classroom Learning", title: "Classroom Learning", description: "Official classroom learning video slot.", src: "/assets/videos/classroom/classroom-teaching-student-learning.mp4", poster: "/assets/posters/video/classroom-learning.webp", duration: "0:25" },
  { id: "results-2026", category: "Results", title: "Results", description: "Official results video slot.", src: "/assets/videos/results/matric-science-high-achievers-2026.mp4", poster: "/assets/posters/video/results-2026.webp", duration: "0:15" },
  { id: "student-voices", category: "Testimonials", title: "Testimonials", description: "Official testimonials video slot.", src: "/assets/final/videos/testimonials.mp4", poster: "/assets/posters/video/student-testimonial.webp", duration: "HD" },
];

export const faqs = [
  { question: "Which classes are offered?", answer: "Sir Saqib Tuitions offers tuition for Grades I-VIII, Matric and Intermediate, alongside support for Huffaz." },
  { question: "Which streams are available?", answer: "Available study paths include Matric Science and General, plus Intermediate Pre-Medical, Pre-Engineering, General Science and Commerce." },
  { question: "Are there separate boys and girls campuses?", answer: "Yes. There are dedicated Boys and Girls campuses, along with the Hill Park Campus in Karachi." },
  { question: "Is there a programme for Huffaz?", answer: "Yes. The academy offers a Hafiz to Formal Education Programme and a crash course for Huffaz." },
  { question: "How can parents contact admissions?", answer: "Parents can call a campus directly or use the website's WhatsApp enquiry builder. Admissions will provide current fees, timings and registration guidance." },
] as const;

export const buildingIcon = Building2;
