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
      "Book sessions instantly, access recorded lessons, and get help whenever you need it 24/7 availability.",
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

// Admin Data
export const adminTabs = [
  { id: 0, title: "Dashboard", icon: "📊" },
  { id: 1, title: "Manage Users", icon: "👥" },
  { id: 2, title: "Tutor Verification", icon: "✅" },
  { id: 3, title: "Sessions", icon: "📅" },
  { id: 4, title: "Complaints", icon: "🚨" },
  { id: 5, title: "Reviews & Ratings", icon: "⭐" },
  { id: 6, title: "Analytics", icon: "📈" },
  { id: 7, title: "Payments", icon: "💰" },
];

export const adminStats = [
  {
    label: "Total Students",
    value: "1,240",
    icon: "🎓",
    color: "from-blue-500 to-cyan-500",
    change: "+12%",
  },
  {
    label: "Total Tutors",
    value: "320",
    icon: "👨‍🏫",
    color: "from-purple-500 to-pink-500",
    change: "+5%",
  },
  {
    label: "Total Sessions",
    value: "4,870",
    icon: "📅",
    color: "from-green-500 to-emerald-500",
    change: "+18%",
  },
  {
    label: "Revenue",
    value: "PKR 2.4M",
    icon: "💰",
    color: "from-orange-500 to-yellow-500",
    change: "+9%",
  },
];

export const adminRecentActivity = [
  { type: "New Student", name: "Ali Hassan", time: "2 mins ago", icon: "🎓" },
  {
    type: "Session Booked",
    name: "Sara Khan → Dr. Abdullah",
    time: "10 mins ago",
    icon: "📅",
  },
  {
    type: "Tutor Applied",
    name: "Prof. Usman Malik",
    time: "25 mins ago",
    icon: "👨‍🏫",
  },
  { type: "Complaint Filed", name: "Zara Ahmed", time: "1 hr ago", icon: "🚨" },
  { type: "Review Posted", name: "Bilal Raza", time: "2 hrs ago", icon: "⭐" },
];

export const adminUsers = [
  {
    id: 1,
    name: "Ali Hassan",
    email: "ali@gmail.com",
    role: "student",
    status: "active",
    joined: "Jan 2025",
  },
  {
    id: 2,
    name: "Sara Khan",
    email: "sara@gmail.com",
    role: "student",
    status: "active",
    joined: "Feb 2025",
  },
  {
    id: 3,
    name: "Dr. Abdullah Ch",
    email: "abdullah@gmail.com",
    role: "tutor",
    status: "active",
    joined: "Dec 2024",
  },
  {
    id: 4,
    name: "Zara Ahmed",
    email: "zara@gmail.com",
    role: "student",
    status: "inactive",
    joined: "Mar 2025",
  },
  {
    id: 5,
    name: "Prof. Tayyab",
    email: "tayyab@gmail.com",
    role: "tutor",
    status: "active",
    joined: "Nov 2024",
  },
  {
    id: 6,
    name: "Bilal Raza",
    email: "bilal@gmail.com",
    role: "student",
    status: "inactive",
    joined: "Apr 2025",
  },
];

export const pendingTutors = [
  {
    id: 1,
    name: "Prof. Usman Malik",
    subject: "Physics",
    experience: "6 years",
    qualification: "M.Phil Physics",
    email: "usman@gmail.com",
  },
  {
    id: 2,
    name: "Ms. Hina Baig",
    subject: "English Literature",
    experience: "4 years",
    qualification: "MA English",
    email: "hina@gmail.com",
  },
  {
    id: 3,
    name: "Mr. Kamran Ali",
    subject: "Mathematics",
    experience: "8 years",
    qualification: "MS Mathematics",
    email: "kamran@gmail.com",
  },
];

export const adminSessions = [
  {
    id: 1,
    student: "Ali Hassan",
    tutor: "Dr. Abdullah",
    subject: "Mathematics",
    date: "May 20, 2025",
    time: "4:00 PM",
    status: "upcoming",
  },
  {
    id: 2,
    student: "Sara Khan",
    tutor: "Prof. Tayyab",
    subject: "Computer Science",
    date: "May 18, 2025",
    time: "6:00 PM",
    status: "completed",
  },
  {
    id: 3,
    student: "Bilal Raza",
    tutor: "Dr. Abdullah",
    subject: "Statistics",
    date: "May 22, 2025",
    time: "3:00 PM",
    status: "upcoming",
  },
  {
    id: 4,
    student: "Zara Ahmed",
    tutor: "Prof. Zain",
    subject: "English",
    date: "May 15, 2025",
    time: "5:00 PM",
    status: "cancelled",
  },
  {
    id: 5,
    student: "Hamza Tariq",
    tutor: "Ms. Hina",
    subject: "Biology",
    date: "May 19, 2025",
    time: "2:00 PM",
    status: "completed",
  },
];

export const adminComplaints = [
  {
    id: 1,
    from: "Ali Hassan",
    against: "Prof. Tayyab",
    issue: "Session was cancelled without notice",
    date: "May 17, 2025",
    status: "pending",
  },
  {
    id: 2,
    from: "Sara Khan",
    against: "Dr. Abdullah",
    issue: "Tutor was late by 30 minutes",
    date: "May 15, 2025",
    status: "resolved",
  },
  {
    id: 3,
    from: "Bilal Raza",
    against: "Prof. Zain",
    issue: "Inappropriate behavior during session",
    date: "May 14, 2025",
    status: "pending",
  },
];

export const adminReviews = [
  {
    id: 1,
    student: "Ali Hassan",
    tutor: "Dr. Abdullah",
    rating: 5,
    review: "Excellent teacher! Very patient and knowledgeable.",
    date: "May 16, 2025",
    flagged: false,
  },
  {
    id: 2,
    student: "Zara Ahmed",
    tutor: "Prof. Tayyab",
    rating: 1,
    review: "Worst experience ever!!!! FAKE TUTOR!!!",
    date: "May 15, 2025",
    flagged: true,
  },
  {
    id: 3,
    student: "Bilal Raza",
    tutor: "Prof. Zain",
    rating: 4,
    review: "Good sessions, very helpful material.",
    date: "May 14, 2025",
    flagged: false,
  },
  {
    id: 4,
    student: "Sara Khan",
    tutor: "Dr. Abdullah",
    rating: 5,
    review: "Best tutor on the platform!",
    date: "May 13, 2025",
    flagged: false,
  },
];

export const analyticsData = [
  { month: "Jan", students: 80, sessions: 210, revenue: 180000 },
  { month: "Feb", students: 120, sessions: 310, revenue: 240000 },
  { month: "Mar", students: 160, sessions: 420, revenue: 310000 },
  { month: "Apr", students: 210, sessions: 560, revenue: 420000 },
  { month: "May", students: 280, sessions: 740, revenue: 580000 },
];

export const adminPayments = [
  {
    id: 1,
    student: "Ali Hassan",
    tutor: "Dr. Abdullah",
    amount: "PKR 1,600",
    date: "May 18, 2025",
    status: "paid",
  },
  {
    id: 2,
    student: "Sara Khan",
    tutor: "Prof. Tayyab",
    amount: "PKR 2,400",
    date: "May 17, 2025",
    status: "paid",
  },
  {
    id: 3,
    student: "Bilal Raza",
    tutor: "Prof. Zain",
    amount: "PKR 800",
    date: "May 16, 2025",
    status: "pending",
  },
  {
    id: 4,
    student: "Zara Ahmed",
    tutor: "Ms. Hina",
    amount: "PKR 1,200",
    date: "May 15, 2025",
    status: "failed",
  },
];

// Tutor Data
export const tutorTabs = [
  { id: 0, title: "Dashboard", icon: "📊" },
  { id: 1, title: "My Profile", icon: "👤" },
  { id: 2, title: "Availability", icon: "🗓️" },
  { id: 3, title: "Bookings", icon: "📅" },
  { id: 4, title: "Live Session", icon: "🎥" },
  { id: 5, title: "Messages", icon: "💬" },
  { id: 6, title: "Materials", icon: "📚" },
];

export const tutorStats = [
  {
    label: "Total Sessions",
    value: "128",
    icon: "📅",
    color: "from-blue-500 to-cyan-500",
    change: "+8%",
  },
  {
    label: "Upcoming",
    value: "5",
    icon: "⏰",
    color: "from-purple-500 to-pink-500",
    change: "+2",
  },
  {
    label: "Students",
    value: "34",
    icon: "🎓",
    color: "from-green-500 to-emerald-500",
    change: "+3",
  },
  {
    label: "Earnings",
    value: "PKR 48K",
    icon: "💰",
    color: "from-orange-500 to-yellow-500",
    change: "+12%",
  },
];

export const tutorRecentActivity = [
  {
    type: "Session Booked",
    name: "Ali Hassan booked Mathematics",
    time: "5 mins ago",
    icon: "📅",
  },
  {
    type: "Message",
    name: "Sara Khan sent a message",
    time: "20 mins ago",
    icon: "💬",
  },
  {
    type: "Session Completed",
    name: "Bilal Raza — Statistics",
    time: "2 hrs ago",
    icon: "✅",
  },
  {
    type: "Review Received",
    name: "Zara Ahmed gave 5 stars",
    time: "5 hrs ago",
    icon: "⭐",
  },
];

export const tutorBookings = [
  {
    id: 1,
    student: "Ali Hassan",
    subject: "Mathematics",
    date: "May 20, 2025",
    time: "4:00 PM",
    duration: "1 hr",
    status: "upcoming",
  },
  {
    id: 2,
    student: "Sara Khan",
    subject: "Statistics",
    date: "May 18, 2025",
    time: "6:00 PM",
    duration: "1.5 hr",
    status: "completed",
  },
  {
    id: 3,
    student: "Bilal Raza",
    subject: "Calculus",
    date: "May 22, 2025",
    time: "3:00 PM",
    duration: "1 hr",
    status: "upcoming",
  },
  {
    id: 4,
    student: "Zara Ahmed",
    subject: "Algebra",
    date: "May 15, 2025",
    time: "5:00 PM",
    duration: "2 hr",
    status: "cancelled",
  },
  {
    id: 5,
    student: "Hamza Tariq",
    subject: "Geometry",
    date: "May 19, 2025",
    time: "2:00 PM",
    duration: "1 hr",
    status: "completed",
  },
];

export const tutorMessages = [
  {
    id: 1,
    student: "Ali Hassan",
    avatar: "A",
    lastMsg: "Can we reschedule tomorrow's session?",
    time: "2m ago",
    unread: 2,
  },
  {
    id: 2,
    student: "Sara Khan",
    avatar: "S",
    lastMsg: "Thank you for the notes!",
    time: "1h ago",
    unread: 0,
  },
  {
    id: 3,
    student: "Bilal Raza",
    avatar: "B",
    lastMsg: "What topics will we cover next?",
    time: "3h ago",
    unread: 1,
  },
  {
    id: 4,
    student: "Zara Ahmed",
    avatar: "Z",
    lastMsg: "I have a question about the assignment.",
    time: "1d ago",
    unread: 0,
  },
];

export const tutorMaterials = [
  {
    id: 1,
    name: "Calculus Chapter 1.pdf",
    type: "PDF",
    size: "2.4 MB",
    subject: "Mathematics",
    uploaded: "May 10, 2025",
  },
  {
    id: 2,
    name: "Algebra Basics.pdf",
    type: "PDF",
    size: "1.8 MB",
    subject: "Mathematics",
    uploaded: "May 8, 2025",
  },
  {
    id: 3,
    name: "Statistics Intro Video.mp4",
    type: "Video",
    size: "45 MB",
    subject: "Statistics",
    uploaded: "May 5, 2025",
  },
  {
    id: 4,
    name: "Practice Problems Set 1.pdf",
    type: "PDF",
    size: "980 KB",
    subject: "Mathematics",
    uploaded: "May 1, 2025",
  },
];

// Student Data
export const studentTabs = [
  { id: 0, title: "Dashboard", icon: "📊" },
  { id: 1, title: "Find Tutors", icon: "🔍" },
  { id: 2, title: "My Bookings", icon: "📅" },
  { id: 3, title: "Join Session", icon: "🎥" },
  { id: 4, title: "Messages", icon: "💬" },
  { id: 5, title: "Materials", icon: "📚" },
  { id: 6, title: "Profile", icon: "👤" },
];

export const studentStats = [
  {
    label: "Total Sessions",
    value: "24",
    icon: "📅",
    color: "from-blue-500 to-cyan-500",
    change: "+3",
  },
  {
    label: "Upcoming",
    value: "2",
    icon: "⏰",
    color: "from-purple-500 to-pink-500",
    change: "+1",
  },
  {
    label: "Tutors Hired",
    value: "5",
    icon: "👨‍🏫",
    color: "from-green-500 to-emerald-500",
    change: "+1",
  },
  {
    label: "Hours Learned",
    value: "36",
    icon: "🎓",
    color: "from-orange-500 to-yellow-500",
    change: "+4",
  },
];

export const studentNotifications = [
  {
    id: 1,
    text: "Dr. Abdullah confirmed your session for May 20",
    time: "5 mins ago",
    icon: "✅",
    unread: true,
  },
  {
    id: 2,
    text: "New material uploaded by Prof. Tayyab",
    time: "1 hr ago",
    icon: "📚",
    unread: true,
  },
  {
    id: 3,
    text: "Your session with Prof. Zain is in 30 minutes",
    time: "2 hrs ago",
    icon: "⏰",
    unread: false,
  },
  {
    id: 4,
    text: "Payment of PKR 1,600 confirmed",
    time: "1 day ago",
    icon: "💰",
    unread: false,
  },
];

export const studentBookings = [
  {
    id: 1,
    tutor: "Dr. Abdullah Ch",
    subject: "Mathematics",
    date: "May 20, 2025",
    time: "4:00 PM",
    duration: "1 hr",
    amount: "PKR 1,200",
    status: "upcoming",
  },
  {
    id: 2,
    tutor: "Prof. Tayyab Nawaz",
    subject: "Computer Science",
    date: "May 18, 2025",
    time: "6:00 PM",
    duration: "1.5 hr",
    amount: "PKR 1,800",
    status: "completed",
  },
  {
    id: 3,
    tutor: "Dr. Abdullah Ch",
    subject: "Statistics",
    date: "May 22, 2025",
    time: "3:00 PM",
    duration: "1 hr",
    amount: "PKR 1,200",
    status: "upcoming",
  },
  {
    id: 4,
    tutor: "Prof. Zain Zaheer",
    subject: "English",
    date: "May 15, 2025",
    time: "5:00 PM",
    duration: "2 hr",
    amount: "PKR 2,400",
    status: "cancelled",
  },
  {
    id: 5,
    tutor: "Prof. Tayyab Nawaz",
    subject: "Algorithms",
    date: "May 10, 2025",
    time: "2:00 PM",
    duration: "1 hr",
    amount: "PKR 1,200",
    status: "completed",
  },
];

export const allTutors = [
  {
    id: 1,
    name: "Dr. Abdullah Ch",
    subject: "Mathematics & Statistics",
    rating: 4.9,
    students: 250,
    experience: "5+ years",
    rate: "PKR 1,200/hr",
    available: true,
    qualification: "M.Phil Applied Mathematics",
    location: "Lahore",
    bio: "Experienced mathematics tutor making complex concepts simple and accessible for every student.",
    tags: ["Calculus", "Algebra", "Statistics"],
    reviews: [{ student: "Ali H.", text: "Best math tutor ever!", rating: 5 }, { student: "Sara K.", text: "Very patient and clear.", rating: 5 }],
  },
  {
    id: 2,
    name: "Prof. Tayyab Nawaz",
    subject: "Computer Science",
    rating: 5.0,
    students: 180,
    experience: "8+ years",
    rate: "PKR 1,500/hr",
    available: true,
    qualification: "MS Computer Science",
    location: "Islamabad",
    bio: "Full-stack developer and CS educator with 8 years of teaching experience at university level.",
    tags: ["Python", "DSA", "Web Dev"],
    reviews: [{ student: "Bilal R.", text: "Explains DSA like a pro!", rating: 5 }, { student: "Hamza T.", text: "Amazing teacher.", rating: 5 }],
  },
  {
    id: 3,
    name: "Prof. Zain Zaheer",
    subject: "English Literature",
    rating: 4.8,
    students: 320,
    experience: "6+ years",
    rate: "PKR 800/hr",
    available: false,
    qualification: "MA English Literature",
    location: "Karachi",
    bio: "Passionate English educator helping students master grammar, writing, and literary analysis.",
    tags: ["Grammar", "Writing", "Literature"],
    reviews: [{ student: "Zara A.", text: "My writing improved a lot!", rating: 5 }, { student: "Nida M.", text: "Very engaging sessions.", rating: 4 }],
  },
  {
    id: 4,
    name: "Ms. Hina Baig",
    subject: "Biology & Chemistry",
    rating: 4.7,
    students: 140,
    experience: "4+ years",
    rate: "PKR 1,000/hr",
    available: true,
    qualification: "M.Phil Biochemistry",
    location: "Lahore",
    bio: "Dedicated science tutor specializing in MCAT preparation and conceptual clarity in Biology and Chemistry.",
    tags: ["Biology", "Chemistry", "MCAT"],
    reviews: [{ student: "Fatima S.", text: "Helped me ace my MCAT!", rating: 5 }, { student: "Omar K.", text: "Great at explaining concepts.", rating: 4 }],
  },
  {
    id: 5,
    name: "Mr. Kamran Ali",
    subject: "Physics",
    rating: 4.6,
    students: 95,
    experience: "7+ years",
    rate: "PKR 1,100/hr",
    available: true,
    qualification: "MS Physics",
    location: "Faisalabad",
    bio: "Physics specialist with a focus on ECAT preparation, mechanics, and optics for FSc students.",
    tags: ["Mechanics", "Optics", "ECAT"],
    reviews: [{ student: "Usman B.", text: "Physics finally makes sense!", rating: 5 }, { student: "Ayesha N.", text: "Very thorough explanations.", rating: 4 }],
  },
  {
    id: 6,
    name: "Prof. Usman Malik",
    subject: "Economics",
    rating: 4.5,
    students: 78,
    experience: "6+ years",
    rate: "PKR 900/hr",
    available: false,
    qualification: "MBA Economics",
    location: "Multan",
    bio: "Economics educator with expertise in micro and macroeconomics, helping students understand real-world applications.",
    tags: ["Micro", "Macro", "Statistics"],
    reviews: [{ student: "Raza M.", text: "Economics is now my fav subject!", rating: 5 }, { student: "Sana T.", text: "Very knowledgeable.", rating: 4 }],
  },
  {
    id: 7,
    name: "Dr. Sadia Noor",
    subject: "Urdu & Islamiat",
    rating: 4.8,
    students: 210,
    experience: "9+ years",
    rate: "PKR 700/hr",
    available: true,
    qualification: "PhD Urdu Literature",
    location: "Lahore",
    bio: "Expert in Urdu literature and Islamiat with a passion for preserving cultural heritage through education.",
    tags: ["Urdu", "Islamiat", "Matric"],
    reviews: [{ student: "Maham A.", text: "Best Urdu teacher!", rating: 5 }, { student: "Tariq H.", text: "Very inspiring.", rating: 5 }],
  },
  {
    id: 8,
    name: "Mr. Faisal Raza",
    subject: "Mathematics",
    rating: 4.7,
    students: 165,
    experience: "5+ years",
    rate: "PKR 1,000/hr",
    available: true,
    qualification: "BS Mathematics",
    location: "Rawalpindi",
    bio: "Dedicated math tutor focused on building strong foundations for O/A level and FSc students.",
    tags: ["O-Level", "A-Level", "FSc"],
    reviews: [{ student: "Haris K.", text: "Cleared all my concepts!", rating: 5 }, { student: "Laiba S.", text: "Very helpful and patient.", rating: 4 }],
  },
  {
    id: 9,
    name: "Ms. Amna Khalid",
    subject: "Chemistry",
    rating: 4.6,
    students: 112,
    experience: "3+ years",
    rate: "PKR 850/hr",
    available: true,
    qualification: "M.Phil Chemistry",
    location: "Karachi",
    bio: "Chemistry tutor specializing in organic chemistry and helping students prepare for competitive exams.",
    tags: ["Organic", "Inorganic", "MCAT"],
    reviews: [{ student: "Zainab F.", text: "Chemistry is easy now!", rating: 5 }, { student: "Ali M.", text: "Great teaching style.", rating: 4 }],
  },
];

export const studentMessages = [
  {
    id: 1,
    tutor: "Dr. Abdullah Ch",
    avatar: "A",
    lastMsg: "See you tomorrow at 4 PM!",
    time: "10m ago",
    unread: 1,
  },
  {
    id: 2,
    tutor: "Prof. Tayyab Nawaz",
    avatar: "T",
    lastMsg: "I've uploaded the notes for today.",
    time: "2h ago",
    unread: 0,
  },
  {
    id: 3,
    tutor: "Prof. Zain Zaheer",
    avatar: "Z",
    lastMsg: "Please review chapter 3 before our session.",
    time: "1d ago",
    unread: 0,
  },
];

export const studentMaterials = [
  {
    id: 1,
    name: "Calculus Chapter 1.pdf",
    type: "PDF",
    size: "2.4 MB",
    tutor: "Dr. Abdullah Ch",
    subject: "Mathematics",
    date: "May 10, 2025",
  },
  {
    id: 2,
    name: "Python Basics Notes.pdf",
    type: "PDF",
    size: "1.2 MB",
    tutor: "Prof. Tayyab Nawaz",
    subject: "Computer Science",
    date: "May 8, 2025",
  },
  {
    id: 3,
    name: "DSA Lecture Recording.mp4",
    type: "Video",
    size: "120 MB",
    tutor: "Prof. Tayyab Nawaz",
    subject: "Computer Science",
    date: "May 6, 2025",
  },
  {
    id: 4,
    name: "Practice Problems Set 1.pdf",
    type: "PDF",
    size: "980 KB",
    tutor: "Dr. Abdullah Ch",
    subject: "Mathematics",
    date: "May 1, 2025",
  },
];
