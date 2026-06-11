import React from "react";
import Chatbot from "../components/chatbot/Chatbot";

const sections = [
  {
    title: "Information We Collect",
    text: "TutorHub collects account details, profile information, booking records, payment references, reviews, complaints, and messages needed to run the platform.",
  },
  {
    title: "How We Use Information",
    text: "We use your information to verify accounts, connect students with tutors, manage sessions, process payments, send notifications, and handle support or complaint requests.",
  },
  {
    title: "Payments and Tutor Payouts",
    text: "Payment information is used to confirm bookings and calculate tutor payouts. TutorHub charges a 10% admin fee per paid session and records the remaining 90% as tutor payout.",
  },
  {
    title: "Complaints and Safety",
    text: "Complaint details are shared with admin for review. The reported user may receive a notice, but the complainant's identity is kept private from that user.",
  },
  {
    title: "Data Security",
    text: "We use authenticated routes and role-based access to protect dashboards and sensitive actions. Users should keep their login credentials secure.",
  },
  {
    title: "Contact",
    text: "For privacy questions or account support, contact TutorHub at tutorhub@gmail.com.",
  },
];

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            How TutorHub handles student, tutor, payment, session, and support
            information.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {sections.map((section) => (
              <div key={section.title} className="p-6 border-b border-gray-100 last:border-b-0">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {section.title}
                </h2>
                <p className="text-gray-600 leading-relaxed">{section.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Chatbot />
    </div>
  );
};

export default PrivacyPolicy;
