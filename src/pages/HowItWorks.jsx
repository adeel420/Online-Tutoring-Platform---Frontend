import React from "react";
import { useNavigate } from "react-router-dom";
import Chatbot from "../components/chatbot/Chatbot";
import ReadyToStart from "../components/ReadyToStart";

const studentSteps = [
  {
    title: "Find the right tutor",
    text: "Browse tutors by subject, availability, rating, profile details, and reviews.",
  },
  {
    title: "Book an available slot",
    text: "Choose a tutor's open date and time, then create a booking request from the profile.",
  },
  {
    title: "Pay securely",
    text: "Complete payment through TutorHub. Once payment is confirmed, the session becomes active.",
  },
  {
    title: "Join the live class",
    text: "Use the student dashboard to join your paid upcoming session at the scheduled time.",
  },
  {
    title: "Review or report",
    text: "After the session, leave a review or file a complaint if something went wrong.",
  },
];

const teacherSteps = [
  {
    title: "Create your tutor profile",
    text: "Sign up as a teacher, upload required documents, and add subjects, rate, bio, and bank details.",
  },
  {
    title: "Wait for admin approval",
    text: "TutorHub admin verifies your account before your profile appears publicly.",
  },
  {
    title: "Add availability",
    text: "Set your available session dates and times from the tutor dashboard.",
  },
  {
    title: "Teach paid sessions",
    text: "When a student pays, the booking appears in your dashboard and you can start the live class at session time.",
  },
  {
    title: "Receive your payout",
    text: "For every paid session, TutorHub charges 10% admin fee and the tutor receives 90% of the session payment.",
  },
];

const safeguards = [
  "Only approved and verified tutors are shown to students.",
  "Students and tutors can file complaints from their booking history.",
  "Complaint notices protect the complainant's identity from the reported user.",
  "Admins can review complaints and resolve, warn, or ban users.",
];

const HowItWorks = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-5">
            How It Works
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-200 leading-relaxed">
            A simple workflow for students to learn online and teachers to earn
            through verified, paid tutoring sessions.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex items-center justify-between gap-4 mb-8">
                <div>
                  <p className="text-sm font-semibold text-blue-600 mb-1">
                    For Students
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Learn With Tutors
                  </h2>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  S
                </div>
              </div>

              <div className="space-y-5">
                {studentSteps.map((step, index) => (
                  <div key={step.title} className="flex gap-4">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{step.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                        {step.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate("/tutors")}
                className="mt-8 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all cursor-pointer"
              >
                Find a Tutor
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex items-center justify-between gap-4 mb-8">
                <div>
                  <p className="text-sm font-semibold text-purple-600 mb-1">
                    For Teachers
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Teach and Earn
                  </h2>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  T
                </div>
              </div>

              <div className="space-y-5">
                {teacherSteps.map((step, index) => (
                  <div key={step.title} className="flex gap-4">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{step.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                        {step.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl bg-orange-50 border border-orange-100 p-4">
                <p className="text-sm font-bold text-orange-700">
                  Admin fee policy
                </p>
                <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                  TutorHub charges 10% admin fee per paid session. The tutor
                  receives 90% of the total session payment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Safe Learning and Teaching
              </h2>
              <p className="text-gray-600 leading-relaxed max-w-3xl">
                TutorHub keeps bookings, payments, live sessions, reviews, and
                complaints inside one platform so both students and teachers
                have a clear record of every session.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-4">Platform Checks</h3>
              <div className="space-y-3">
                {safeguards.map((item) => (
                  <div key={item} className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      ✓
                    </span>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ReadyToStart />

      <Chatbot />
    </div>
  );
};

export default HowItWorks;
