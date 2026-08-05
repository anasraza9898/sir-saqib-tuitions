import {
  BookOpenCheck,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  Calculator,
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
    "Focused preparation for Grades IX-XII, with foundation tuition for Grades I-VIII and formal education support for Huffaz.",
  admissionsPhone: "0300-2320599",
  whatsapp: "923002320599",
} as const;

export const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Courses", href: "/courses" },
  { label: "Campuses", href: "/campuses" },
  { label: "Faculty", href: "/faculty" },
  { label: "Results", href: "/results" },
  { label: "Timetables", href: "/timetables" },
  { label: "Media", href: "/media" },
  { label: "Contact", href: "/contact" },
] as const;

export const trustItems = [
  { value: "24 Years", label: "Experience" },
  { value: "3", label: "Campuses" },
  { value: "Qualified", label: "Faculty" },
  { value: "IX-XII", label: "Grades" },
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
    id: "ix-x-science",
    title: "IX-X Science",
    category: "Matric",
    level: "Matric",
    stream: "Science",
    description: "Focused preparation for compulsory subjects and the Science group curriculum.",
    subjects: ["Science group", "Compulsory subjects"],
    icon: FlaskConical,
  },
  {
    id: "ix-x-general",
    title: "IX-X General",
    category: "Matric",
    level: "Matric",
    stream: "General",
    description: "Structured coverage for General group subjects with regular assessment.",
    subjects: ["General group", "Compulsory subjects"],
    icon: BookOpenCheck,
  },
  {
    id: "xi-xii-science",
    title: "XI-XII Science",
    category: "Intermediate",
    level: "Intermediate",
    stream: "Science",
    description: "Subject-focused intermediate preparation for Science students.",
    subjects: ["Science group", "Intermediate"],
    icon: Microscope,
  },
  {
    id: "xi-xii-commerce",
    title: "XI-XII Commerce",
    category: "Intermediate",
    level: "Intermediate",
    stream: "Commerce",
    description: "Organized Commerce preparation supported by experienced faculty.",
    subjects: ["Commerce group", "Intermediate"],
    icon: BriefcaseBusiness,
  },
  {
    id: "computer-science",
    title: "Computer Science",
    category: "Intermediate",
    level: "Secondary & Intermediate",
    stream: "Computer Science",
    description: "Curriculum-focused preparation for students selecting Computer Science.",
    subjects: ["Computer Science", "Compulsory subjects"],
    icon: Laptop,
  },
  {
    id: "pre-engineering",
    title: "Pre-Engineering",
    category: "Intermediate",
    level: "Intermediate",
    stream: "Pre-Engineering",
    description: "Focused support for the core subjects in the Pre-Engineering stream.",
    subjects: ["Pre-Engineering", "Science group"],
    icon: Calculator,
  },
  {
    id: "i-viii",
    title: "Grades I-VIII",
    category: "Foundation",
    level: "Foundation",
    stream: "General",
    description: "A strong academic foundation through focused curriculum and regular attention.",
    subjects: ["Foundation tuition", "Core subjects"],
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
    icon: BrainCircuit,
  },
] as const;

export const campuses = [
  {
    id: "boys",
    name: "Boys Campus",
    shortName: "Boys",
    phones: ["0300-2320599", "0334-2320594"],
    whatsapp: "923002320599",
    address: "SA 24/1 Block #05, K.A.E.C.H.S, near Bin Ahmed Supermarket, Karachi",
    poster: "/assets/posters/admission-boys-campus.webp",
    accent: "navy",
  },
  {
    id: "girls",
    name: "Girls Campus",
    shortName: "Girls",
    phones: ["0321-2484395"],
    whatsapp: "923212484395",
    address: "C-11 Commercial Block #02, K.A.E.C.H.S, Karachi",
    poster: "/assets/posters/admission-girls-campus.webp",
    accent: "burgundy",
  },
  {
    id: "hill-park",
    name: "Hill Park Campus",
    shortName: "Hill Park",
    phones: ["0323-1909072", "0323-1909062"],
    whatsapp: "923231909072",
    address: "22-Z Block #7-8, K.M.C.H.S Society, near Hill Park, Karachi",
    poster: "/assets/posters/admission-hill-park-campus.webp",
    accent: "gold",
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
  { src: "/assets/results/boys-matric-science-general-2026.webp", alt: "2026 boys campus SSC Part II Science and General high achievers", title: "Boys Matric - Science & General" },
  { src: "/assets/results/girls-matric-general-2026.webp", alt: "2026 girls campus Matric General result highlight", title: "Girls Matric - General" },
  { src: "/assets/results/girls-matric-science-2026.webp", alt: "2026 girls campus Matric Science result highlight", title: "Girls Matric - Science" },
  { src: "/assets/results/girls-matric-science-2-2026.webp", alt: "Second 2026 girls campus Matric Science result highlight", title: "Girls Matric - Science II" },
] as const;

export const results2025 = [
  { src: "/assets/results/boys-xi-xii-groups-2025.webp", alt: "2025 boys classes XI-XII group result highlights", title: "Boys XI-XII Groups" },
  { src: "/assets/results/boys-ix-x-matric-2025.webp", alt: "2025 boys classes IX-X Matric result highlights", title: "Boys IX-X Matric" },
  { src: "/assets/results/girls-xi-xii-groups-2025.webp", alt: "2025 girls classes XI-XII group result highlights", title: "Girls XI-XII Groups" },
  { src: "/assets/results/girls-ix-x-matric-2025.webp", alt: "2025 girls classes IX-X Matric result highlights", title: "Girls IX-X Matric" },
] as const;

export type Timetable = {
  id: string;
  campus: "boys" | "girls";
  classLevel: "9" | "10" | "11" | "12";
  stream: "Science" | "General" | "Commerce";
  variant: string;
  src: string;
};

export const timetables: Timetable[] = [
  { id: "b9ga", campus: "boys", classLevel: "9", stream: "General", variant: "Evening batch A", src: "/assets/timetables/boys/class-9-general-evening-batch-a.webp" },
  { id: "b9gb", campus: "boys", classLevel: "9", stream: "General", variant: "Evening batch B", src: "/assets/timetables/boys/class-9-general-evening-batch-b.webp" },
  { id: "b9gm", campus: "boys", classLevel: "9", stream: "General", variant: "Morning", src: "/assets/timetables/boys/class-9-general-morning.webp" },
  { id: "b9sa", campus: "boys", classLevel: "9", stream: "Science", variant: "Batch A", src: "/assets/timetables/boys/class-9-science-batch-a.webp" },
  { id: "b9sb", campus: "boys", classLevel: "9", stream: "Science", variant: "Batch B", src: "/assets/timetables/boys/class-9-science-batch-b.webp" },
  { id: "b10ge", campus: "boys", classLevel: "10", stream: "General", variant: "Evening", src: "/assets/timetables/boys/class-10-general-evening.webp" },
  { id: "b10gm", campus: "boys", classLevel: "10", stream: "General", variant: "Morning", src: "/assets/timetables/boys/class-10-general-morning.webp" },
  { id: "b10sa", campus: "boys", classLevel: "10", stream: "Science", variant: "Batch A", src: "/assets/timetables/boys/class-10-science-batch-a.webp" },
  { id: "b10sb", campus: "boys", classLevel: "10", stream: "Science", variant: "Batch B", src: "/assets/timetables/boys/class-10-science-batch-b.webp" },
  { id: "b11ce", campus: "boys", classLevel: "11", stream: "Commerce", variant: "Evening", src: "/assets/timetables/boys/class-11-commerce-evening.webp" },
  { id: "b11cm", campus: "boys", classLevel: "11", stream: "Commerce", variant: "Morning", src: "/assets/timetables/boys/class-11-commerce-morning.webp" },
  { id: "b11s", campus: "boys", classLevel: "11", stream: "Science", variant: "Standard", src: "/assets/timetables/boys/class-11-science.webp" },
  { id: "b12ce", campus: "boys", classLevel: "12", stream: "Commerce", variant: "Evening", src: "/assets/timetables/boys/class-12-commerce-evening.webp" },
  { id: "b12cm", campus: "boys", classLevel: "12", stream: "Commerce", variant: "Morning", src: "/assets/timetables/boys/class-12-commerce-morning.webp" },
  { id: "b12s", campus: "boys", classLevel: "12", stream: "Science", variant: "Standard", src: "/assets/timetables/boys/class-12-science.webp" },
  { id: "g9g", campus: "girls", classLevel: "9", stream: "General", variant: "Standard", src: "/assets/timetables/girls/class-9-general.webp" },
  { id: "g9s", campus: "girls", classLevel: "9", stream: "Science", variant: "Standard", src: "/assets/timetables/girls/class-9-science.webp" },
  { id: "g10g", campus: "girls", classLevel: "10", stream: "General", variant: "Standard", src: "/assets/timetables/girls/class-10-general.webp" },
  { id: "g10s", campus: "girls", classLevel: "10", stream: "Science", variant: "Standard", src: "/assets/timetables/girls/class-10-science.webp" },
  { id: "g11c", campus: "girls", classLevel: "11", stream: "Commerce", variant: "Standard", src: "/assets/timetables/girls/class-11-commerce.webp" },
  { id: "g11s", campus: "girls", classLevel: "11", stream: "Science", variant: "Standard", src: "/assets/timetables/girls/class-11-science.webp" },
  { id: "g12c", campus: "girls", classLevel: "12", stream: "Commerce", variant: "Standard", src: "/assets/timetables/girls/class-12-commerce.webp" },
  { id: "g12s", campus: "girls", classLevel: "12", stream: "Science", variant: "Standard", src: "/assets/timetables/girls/class-12-science.webp" },
];

export type TimetableSlot = { start: string; end: string; subject: string };
export type TimetableDay = { day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday"; slots: TimetableSlot[]; note?: string };

/**
 * Verified transcription of the published Class IX timetable posters. Other
 * posters remain safely addressable through the normalized `timetables` index
 * and are shown on the filtered timetable route rather than being guessed.
 */
export const timetableSchedules: Readonly<Record<string, readonly TimetableDay[]>> = {
  b9sa: [
    { day: "Monday", slots: [{ start: "4:30 PM", end: "5:15 PM", subject: "Maths" }, { start: "5:15 PM", end: "6:00 PM", subject: "Physics" }, { start: "6:00 PM", end: "6:15 PM", subject: "English" }] },
    { day: "Tuesday", slots: [{ start: "4:00 PM", end: "4:45 PM", subject: "Test" }, { start: "4:45 PM", end: "5:30 PM", subject: "Physics" }, { start: "5:30 PM", end: "6:15 PM", subject: "Maths" }] },
    { day: "Wednesday", slots: [{ start: "4:30 PM", end: "5:15 PM", subject: "Maths" }, { start: "5:15 PM", end: "6:00 PM", subject: "Physics" }, { start: "6:00 PM", end: "6:15 PM", subject: "Urdu" }] },
    { day: "Thursday", slots: [{ start: "4:00 PM", end: "4:45 PM", subject: "Test" }, { start: "4:45 PM", end: "5:30 PM", subject: "Chemistry" }, { start: "5:30 PM", end: "6:15 PM", subject: "Computer / Biology" }] },
    { day: "Friday", slots: [{ start: "4:15 PM", end: "4:45 PM", subject: "Islamiat" }, { start: "4:45 PM", end: "5:30 PM", subject: "Chemistry" }, { start: "5:30 PM", end: "6:15 PM", subject: "Computer / Biology" }] },
    { day: "Saturday", slots: [], note: "Weekly grand test: 12:30-1:30 PM or 4:30-5:30 PM" },
  ],
  b9sb: [
    { day: "Monday", slots: [{ start: "6:15 PM", end: "7:00 PM", subject: "Physics" }, { start: "7:00 PM", end: "7:45 PM", subject: "Maths" }, { start: "7:45 PM", end: "8:15 PM", subject: "English" }] },
    { day: "Tuesday", slots: [{ start: "6:15 PM", end: "7:00 PM", subject: "Physics" }, { start: "7:00 PM", end: "7:45 PM", subject: "Maths" }, { start: "7:45 PM", end: "8:15 PM", subject: "Test" }] },
    { day: "Wednesday", slots: [{ start: "6:15 PM", end: "7:00 PM", subject: "Physics" }, { start: "7:00 PM", end: "7:45 PM", subject: "Maths" }, { start: "7:45 PM", end: "8:15 PM", subject: "Urdu" }] },
    { day: "Thursday", slots: [{ start: "5:30 PM", end: "6:15 PM", subject: "Biology" }, { start: "6:15 PM", end: "7:00 PM", subject: "Chemistry" }, { start: "7:00 PM", end: "7:45 PM", subject: "Test" }, { start: "7:45 PM", end: "8:15 PM", subject: "Computer" }] },
    { day: "Friday", slots: [{ start: "5:30 PM", end: "6:15 PM", subject: "Biology" }, { start: "6:15 PM", end: "7:00 PM", subject: "Chemistry" }, { start: "7:00 PM", end: "7:45 PM", subject: "Islamiat" }, { start: "7:45 PM", end: "8:15 PM", subject: "Computer" }] },
    { day: "Saturday", slots: [], note: "Weekly grand test: 12:30-1:30 PM or 4:30-5:30 PM" },
  ],
  b9gm: [
    { day: "Monday", slots: [{ start: "11:15 AM", end: "12:00 PM", subject: "Maths" }, { start: "12:00 PM", end: "12:30 PM", subject: "Economics" }, { start: "12:30 PM", end: "1:15 PM", subject: "English" }] },
    { day: "Tuesday", slots: [{ start: "11:15 AM", end: "12:00 PM", subject: "Maths" }, { start: "12:00 PM", end: "12:30 PM", subject: "Economics" }, { start: "12:30 PM", end: "1:15 PM", subject: "Test" }] },
    { day: "Wednesday", slots: [{ start: "11:15 AM", end: "12:00 PM", subject: "Civics" }, { start: "12:00 PM", end: "12:30 PM", subject: "Islamiat" }, { start: "12:30 PM", end: "1:15 PM", subject: "Science" }] },
    { day: "Thursday", slots: [{ start: "11:15 AM", end: "12:00 PM", subject: "Science" }, { start: "12:00 PM", end: "12:30 PM", subject: "Civics" }, { start: "12:30 PM", end: "1:15 PM", subject: "Test" }] },
    { day: "Friday", slots: [{ start: "11:15 AM", end: "12:00 PM", subject: "Islamiat" }, { start: "12:00 PM", end: "12:30 PM", subject: "Urdu" }] },
    { day: "Saturday", slots: [], note: "Weekly grand test: 11:30 AM-12:30 PM or 5:30-6:30 PM" },
  ],
  b9ga: [
    { day: "Monday", slots: [{ start: "4:30 PM", end: "5:15 PM", subject: "Maths" }, { start: "5:15 PM", end: "5:45 PM", subject: "Economics" }, { start: "5:45 PM", end: "6:15 PM", subject: "English" }] },
    { day: "Tuesday", slots: [{ start: "4:30 PM", end: "5:15 PM", subject: "Maths" }, { start: "5:15 PM", end: "5:45 PM", subject: "Economics" }, { start: "5:45 PM", end: "6:15 PM", subject: "Test" }] },
    { day: "Wednesday", slots: [{ start: "4:30 PM", end: "5:15 PM", subject: "Civics" }, { start: "5:15 PM", end: "5:45 PM", subject: "Islamiat" }, { start: "5:45 PM", end: "6:15 PM", subject: "Science" }] },
    { day: "Thursday", slots: [{ start: "4:30 PM", end: "5:15 PM", subject: "Science" }, { start: "5:15 PM", end: "5:45 PM", subject: "Civics" }, { start: "5:45 PM", end: "6:15 PM", subject: "Test" }] },
    { day: "Friday", slots: [{ start: "4:30 PM", end: "5:15 PM", subject: "Islamiat" }, { start: "5:15 PM", end: "5:45 PM", subject: "Urdu" }] },
    { day: "Saturday", slots: [], note: "Weekly grand test: 11:30 AM-12:30 PM or 5:30-6:30 PM" },
  ],
  b9gb: [
    { day: "Monday", slots: [{ start: "6:15 PM", end: "7:00 PM", subject: "Maths" }, { start: "7:00 PM", end: "7:30 PM", subject: "Economics" }, { start: "7:30 PM", end: "8:15 PM", subject: "English" }] },
    { day: "Tuesday", slots: [{ start: "6:15 PM", end: "7:00 PM", subject: "Maths" }, { start: "7:00 PM", end: "7:30 PM", subject: "Economics" }, { start: "7:30 PM", end: "8:15 PM", subject: "Test" }] },
    { day: "Wednesday", slots: [{ start: "6:15 PM", end: "7:00 PM", subject: "Civics" }, { start: "7:00 PM", end: "7:30 PM", subject: "Islamiat" }, { start: "7:30 PM", end: "8:15 PM", subject: "Science" }] },
    { day: "Thursday", slots: [{ start: "6:15 PM", end: "7:00 PM", subject: "Science" }, { start: "7:00 PM", end: "7:30 PM", subject: "Civics" }, { start: "7:30 PM", end: "8:15 PM", subject: "Test" }] },
    { day: "Friday", slots: [{ start: "6:15 PM", end: "7:00 PM", subject: "Islamiat" }, { start: "7:00 PM", end: "7:30 PM", subject: "Urdu" }] },
    { day: "Saturday", slots: [], note: "Weekly grand test: 11:30 AM-12:30 PM or 5:30-6:30 PM" },
  ],
  g9s: [
    { day: "Monday", slots: [{ start: "4:30 PM", end: "6:00 PM", subject: "Chemistry" }] },
    { day: "Tuesday", slots: [{ start: "4:30 PM", end: "5:15 PM", subject: "Physics" }, { start: "5:15 PM", end: "6:00 PM", subject: "Maths" }] },
    { day: "Wednesday", slots: [{ start: "4:30 PM", end: "5:15 PM", subject: "Physics" }, { start: "5:15 PM", end: "6:00 PM", subject: "Maths" }] },
    { day: "Thursday", slots: [{ start: "4:30 PM", end: "6:00 PM", subject: "Compulsory subjects (English / Urdu / Islamiat)" }] },
    { day: "Friday", slots: [{ start: "3:00 PM", end: "4:30 PM", subject: "Computer / Biology" }] },
    { day: "Saturday", slots: [{ start: "12:00 PM", end: "1:00 PM", subject: "Extra class (if needed)" }] },
  ],
  g9g: [
    { day: "Monday", slots: [], note: "Off" },
    { day: "Tuesday", slots: [{ start: "3:00 PM", end: "3:45 PM", subject: "Maths" }, { start: "3:45 PM", end: "4:30 PM", subject: "Economics" }] },
    { day: "Wednesday", slots: [{ start: "3:00 PM", end: "3:45 PM", subject: "Maths" }, { start: "3:45 PM", end: "4:30 PM", subject: "Science / Economics" }] },
    { day: "Thursday", slots: [{ start: "4:30 PM", end: "6:00 PM", subject: "Compulsory subjects (English / Urdu / Islamiat)" }] },
    { day: "Friday", slots: [{ start: "3:00 PM", end: "4:30 PM", subject: "Civics / Computer" }] },
  ],
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
  { id: "academy-introduction", category: "Academy Introduction", title: "Meet Sir Saqib", description: "Sir Saqib introduces the academy and its learning approach.", src: "/assets/videos/hero/sir-saqib-introduction.mp4", poster: "/assets/posters/video/sir-saqib-introduction.webp", duration: "0:37" },
  { id: "girls-campus", category: "Girls Campus", title: "Girls Campus", description: "An introduction to the Girls Campus and admissions.", src: "/assets/videos/intro/girls-intro-results-admissions.mp4", poster: "/assets/posters/video/girls-campus-introduction.webp", duration: "0:33" },
  { id: "boys-campus", category: "Boys Campus", title: "Boys Campus", description: "A look inside the Boys Campus learning environment.", src: "/assets/videos/campus/boys-classroom.mp4", poster: "/assets/posters/video/boys-campus-classroom.webp", duration: "1:10" },
  { id: "classroom-learning", category: "Classroom Learning", title: "Classroom Learning", description: "Teaching and focused student learning in a real classroom.", src: "/assets/videos/classroom/classroom-teaching-student-learning.mp4", poster: "/assets/posters/video/classroom-learning.webp", duration: "0:25" },
  { id: "results-2026", category: "Results", title: "2026 Result Highlights", description: "Matric Science high achievers from the 2026 results.", src: "/assets/videos/results/matric-science-high-achievers-2026.mp4", poster: "/assets/posters/video/results-2026.webp", duration: "0:15" },
  { id: "student-voices", category: "Testimonials", title: "Student Voices", description: "A student shares his experience in the original academy recording.", src: "/assets/videos/testimonials/student-testimonials.mp4", poster: "/assets/posters/video/student-testimonial.webp", duration: "1:31" },
];

export const faqs = [
  { question: "Which classes are offered?", answer: "Sir Saqib Tuitions offers tuition for Grades I-VIII and Grades IX-XII." },
  { question: "Which streams are available?", answer: "Available study paths include Science, General, Commerce, Computer Science and Pre-Engineering." },
  { question: "Are there separate boys and girls campuses?", answer: "Yes. There are dedicated Boys and Girls campuses, along with the Hill Park Campus in Karachi." },
  { question: "Is there a programme for Huffaz?", answer: "Yes. The academy offers a Hafiz to Formal Education Programme and a crash course for Huffaz." },
  { question: "How can parents contact admissions?", answer: "Parents can call a campus directly or use the website's WhatsApp enquiry builder. Admissions will provide current fees, timings and registration guidance." },
] as const;

export const assistantAnswers = {
  "Find a Course": "Choose from Grades I-VIII foundation tuition, IX-X Science and General, XI-XII Science and Commerce, Computer Science, Pre-Engineering, or the Huffaz Programme.",
  "Choose a Campus": "The Boys and Girls campuses are in K.A.E.C.H.S, while the Hill Park Campus is near Hill Park. Each campus page includes direct call, WhatsApp and map actions.",
  "Find a Timetable": "Open the timetable finder to filter by Boys or Girls, class, stream and batch. The selected academy poster can be viewed or downloaded.",
  "Admissions Contact": "Admissions are open. Call 0300-2320599 or choose a campus to ask about current fees, timings and registration guidance.",
  "Latest Results": "The latest gallery presents the academy's 2026 Matric result posters, with 2025 shown separately as previous academic highlights.",
} as const;

export const buildingIcon = Building2;
