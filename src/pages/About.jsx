import React from "react";
import { aboutTeamMembers, aboutValues } from "../data/Data";
import Chatbot from "../components/chatbot/Chatbot";

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 px-2">
            About TutorHub
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto text-gray-200 leading-relaxed px-4">
            Transforming education in Pakistan through personalized online
            tutoring and innovative learning solutions.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Our Mission
              </h2>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-4 sm:mb-6">
                At TutorHub, we believe every student deserves access to quality
                education. Our mission is to bridge the gap between students and
                expert tutors, making personalized learning accessible to
                everyone across Pakistan.
              </p>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                We're committed to empowering students with the knowledge and
                skills they need to succeed in their academic journey and
                beyond.
              </p>
            </div>
            <div className="order-1 lg:order-2 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8">
              <div className="text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-3xl sm:text-4xl">
                  🎓
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                  Empowering Education
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Making quality education accessible to every student in
                  Pakistan
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center">
            <div className="p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-600 mb-2">
                500+
              </div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">
                Expert Tutors
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                10K+
              </div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">
                Students Taught
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600 mb-2">
                50+
              </div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">
                Subjects Covered
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-600 mb-2">
                98%
              </div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">
                Success Rate
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Our Values
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {aboutValues.map((value, index) => (
              <div
                key={index}
                className="group text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl sm:text-3xl group-hover:scale-110 transition-transform">
                  {value.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3">
                  {value.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Meet Our Team
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
              The passionate people behind TutorHub
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {aboutTeamMembers.map((member, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300 overflow-hidden"
              >
                <div className="p-6 sm:p-8 text-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-3xl sm:text-4xl group-hover:scale-110 transition-transform">
                    {member.image}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">
                    {member.name}
                  </h3>
                  <p className="text-purple-600 font-semibold mb-3 text-sm sm:text-base">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {member.experience}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Our Story
            </h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 md:p-12">
              <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
                TutorHub was founded in 2020 with a simple yet powerful vision:
                to make quality education accessible to every student in
                Pakistan. Our founders, having experienced the challenges of
                finding good tutors firsthand, decided to create a platform that
                would connect students with the best educators in the country.
              </p>
              <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
                Starting with just 10 tutors and 50 students, we've grown into
                Pakistan's leading online tutoring platform. Our success is
                built on trust, quality, and our unwavering commitment to
                student success.
              </p>
              <p className="text-base sm:text-lg text-gray-600">
                Today, we continue to innovate and expand our services, always
                keeping our students' success at the heart of everything we do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-40 h-40 sm:w-64 sm:h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 sm:w-64 sm:h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 px-2">
            Join Our Mission
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 text-gray-200 max-w-3xl mx-auto px-4">
            Be part of the educational revolution. Whether you're a student
            seeking knowledge or a tutor ready to share expertise, TutorHub is
            your platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
            <button className="group bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 sm:px-10 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
              <span className="flex items-center justify-center space-x-2">
                <span>Start Learning</span>
                <span className="group-hover:translate-x-1 transition-transform">
                  📚
                </span>
              </span>
            </button>
            <button className="group border-2 border-white text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-white hover:text-purple-900 transform hover:-translate-y-1 transition-all duration-300">
              <span className="flex items-center justify-center space-x-2">
                <span>Become a Tutor</span>
                <span className="group-hover:translate-x-1 transition-transform">
                  🎯
                </span>
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default About;
