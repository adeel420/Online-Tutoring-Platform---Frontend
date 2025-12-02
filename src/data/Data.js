import { assets } from "../assets/assets";

export const featuredTutors = [
  {
    name: "Dr. Abdullah Ch",
    subject: "Mathematics & Statistics",
    rating: 4.9,
    students: 250,
    experience: "5+ years",
    image: assets.man,
  },
  {
    name: "Prof. Tayyab Nawaz",
    subject: "Computer Science",
    rating: 5.0,
    students: 180,
    experience: "8+ years",
    image: assets.man,
  },
  {
    name: "Prof. Zain Zaheer",
    subject: "English Literature",
    rating: 4.8,
    students: 320,
    experience: "6+ years",
    image: assets.man,
  },
];

export const features = [
  {
    icon: "🎯",
    title: "Personalized Learning",
    color: "from-purple-500 to-pink-500",
    description:
      "AI-powered matching system connects you with tutors who understand your unique learning style and academic goals.",
  },
  {
    icon: "⚡",
    title: "Instant Access",
    color: "from-blue-500 to-cyan-500",
    description:
      "Book sessions instantly, access recorded lessons, and get help whenever you need it — 24/7 availability.",
  },
  {
    icon: "🏆",
    title: "Proven Results",
    color: "from-green-500 to-emerald-500",
    description:
      "Join thousands of students who have improved their grades by an average of 2 letter grades within 3 months.",
  },
];

export const aboutTeamMembers = [
  {
    name: "Ahmed Hassan",
    role: "Founder & CEO",
    image: "👨💼",
    experience: "10+ years in EdTech",
  },
  {
    name: "Sara Khan",
    role: "Head of Education",
    image: "👩🎓",
    experience: "8+ years in Teaching",
  },
  {
    name: "Ali Raza",
    role: "CTO",
    image: "👨💻",
    experience: "12+ years in Tech",
  },
];

export const aboutValues = [
  {
    icon: "🎯",
    title: "Excellence",
    description: "We strive for the highest quality in education",
  },
  {
    icon: "🤝",
    title: "Trust",
    description: "Building lasting relationships with students and tutors",
  },
  {
    icon: "🚀",
    title: "Innovation",
    description: "Using cutting-edge technology for better learning",
  },
  {
    icon: "💡",
    title: "Growth",
    description: "Empowering students to reach their full potential",
  },
];

export const contactInfo = [
  {
    icon: "📧",
    title: "Email",
    info: "tutorhub@gmail.com",
    link: "mailto:tutorhub@gmail.com",
  },
  {
    icon: "📞",
    title: "Phone",
    info: "+92 320 9430934",
    link: "tel:+923209430934",
  },
  {
    icon: "📍",
    title: "Address",
    info: "Lahore, Punjab, Pakistan",
    //   link: "#",
  },
  { icon: "🕒", title: "Hours", info: "24/7 Support Available" },
];

export const accordion = [
  {
    question: "How do I book a session?",
    answer:
      "Browse our tutors, select your preferred teacher, and book a slot through our platform.",
  },
  {
    question: "What subjects do you cover?",
    answer:
      "We offer tutoring in 50+ subjects including Math, Science, English, Computer Science, and more.",
  },
  {
    question: "How much does it cost?",
    answer:
      "Pricing varies by tutor & subject, typically PKR 500–2000 per hour depending on expertise.",
  },
];

// Services
export const services = [
  {
    icon: "🎯",
    title: "One-on-One Tutoring",
    description:
      "Personalized learning sessions with expert tutors tailored to your specific needs and learning pace.",
    features: [
      "Customized lesson plans",
      "Flexible scheduling",
      "Progress tracking",
      "Interactive sessions",
    ],
    price: "From PKR 800/hour",
  },
  {
    icon: "👥",
    title: "Group Classes",
    description:
      "Learn with peers in small group settings for collaborative learning and cost-effective education.",
    features: [
      "Max 5 students per group",
      "Peer interaction",
      "Shared resources",
      "Competitive pricing",
    ],
    price: "From PKR 400/hour",
  },
  {
    icon: "📚",
    title: "Exam Preparation",
    description:
      "Intensive preparation for board exams, entrance tests, and competitive examinations.",
    features: [
      "Past papers practice",
      "Mock tests",
      "Time management",
      "Strategy sessions",
    ],
    price: "From PKR 1000/hour",
  },
  {
    icon: "💻",
    title: "Online Courses",
    description:
      "Self-paced comprehensive courses with video lectures, assignments, and assessments.",
    features: [
      "Video lectures",
      "Downloadable resources",
      "Assignments",
      "Certificates",
    ],
    price: "From PKR 2500/course",
  },
  {
    icon: "🏠",
    title: "Home Tutoring",
    description:
      "In-person tutoring at your home for hands-on learning and direct interaction.",
    features: [
      "Face-to-face learning",
      "Home comfort",
      "Family involvement",
      "Local tutors",
    ],
    price: "From PKR 1200/hour",
  },
  {
    icon: "🎓",
    title: "Career Counseling",
    description:
      "Professional guidance for academic and career decisions with expert counselors.",
    features: [
      "Career assessment",
      "University guidance",
      "Skill development",
      "Future planning",
    ],
    price: "From PKR 1500/session",
  },
];

export const servicesSubjects = [
  { name: "Mathematics", icon: "🔢", tutors: "120+" },
  { name: "Physics", icon: "⚛️", tutors: "85+" },
  { name: "Chemistry", icon: "🧪", tutors: "90+" },
  { name: "Biology", icon: "🧬", tutors: "75+" },
  { name: "Computer Science", icon: "💻", tutors: "95+" },
  { name: "English", icon: "📖", tutors: "110+" },
  { name: "Urdu", icon: "📝", tutors: "65+" },
  { name: "Economics", icon: "📊", tutors: "45+" },
];

export const servicesWork = [
  {
    step: "1",
    title: "Sign Up",
    description: "Create your account and complete your profile",
    icon: "📝",
  },
  {
    step: "2",
    title: "Choose Service",
    description: "Select the learning option that suits you best",
    icon: "🎯",
  },
  {
    step: "3",
    title: "Find Tutor",
    description: "Browse and select from our expert tutors",
    icon: "👨",
  },
  {
    step: "4",
    title: "Start Learning",
    description: "Begin your personalized learning journey",
    icon: "🚀",
  },
];

export const servicesPlans = [
  {
    name: "Basic",
    price: "PKR 2,000",
    period: "/month",
    features: [
      "4 sessions per month",
      "Basic subjects",
      "Email support",
      "Progress reports",
    ],
    popular: false,
  },
  {
    name: "Premium",
    price: "PKR 4,500",
    period: "/month",
    features: [
      "12 sessions per month",
      "All subjects",
      "Priority support",
      "Mock tests",
      "Career guidance",
    ],
    popular: true,
  },
  {
    name: "Pro",
    price: "PKR 7,500",
    period: "/month",
    features: [
      "Unlimited sessions",
      "Premium tutors",
      "24/7 support",
      "Exam preparation",
      "One-on-one mentoring",
    ],
    popular: false,
  },
];
