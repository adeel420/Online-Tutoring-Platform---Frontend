import React from "react";
import { featuredTutors, features } from "../data/Data";

const Home = () => {
  const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "English",
    "Urdu",
    "Economics",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-20 sm:py-24 overflow-hidden">
        {/* Overlay for better contrast */}
        <div className="absolute inset-0 bg-black opacity-30"></div>

        {/* Content Wrapper */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            Transform Your
            <span className="block bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
              Learning Journey
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-10 max-w-3xl mx-auto text-gray-200 leading-relaxed">
            Connect with Pakistan’s top tutors for personalized online learning.
            Excel in your studies with expert guidance tailored just for you.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <button className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 sm:px-10 py-3 sm:py-4 rounded-full font-bold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <span className="flex items-center justify-center space-x-2">
                <span>Find a Tutor</span>
                <span className=" transition-transform">🚀</span>
              </span>
            </button>

            <button className="group w-full sm:w-auto border-2 border-white text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full font-bold text-lg hover:bg-white hover:text-purple-900 transform hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <span className="flex items-center justify-center space-x-2">
                <span>Become a Tutor</span>
                <span className="transition-transform">💼</span>
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                500+
              </div>
              <div className="text-gray-600 font-medium">Expert Tutors</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600 font-medium">Happy Students</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600 font-medium">Subjects</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-orange-600 mb-2">98%</div>
              <div className="text-gray-600 font-medium">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Why Choose TutorHub?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of online learning with our cutting-edge
              platform
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className=" p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
              >
                <div
                  className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6  transition-transform`}
                >
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tutors */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Meet Our Star Tutors
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Learn from Pakistan’s most qualified and experienced educators
            </p>
          </div>

          {/* Tutors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTutors.map((tutor, index) => (
              <div
                key={index}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="p-8 flex flex-col flex-1 text-center">
                  {/* Tutor Image */}
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-6">
                    <img
                      src={tutor.image}
                      alt={tutor.name}
                      className="w-full h-full object-cover rounded-full "
                    />
                  </div>

                  {/* Tutor Info */}
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 text-gray-900">
                    {tutor.name}
                  </h3>
                  <p className="text-purple-600 font-semibold mb-4 text-sm sm:text-base">
                    {tutor.subject}
                  </p>

                  {/* Stats */}
                  <div className="flex flex-wrap justify-center items-center gap-3 mb-6 text-xs sm:text-sm md:text-base text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="font-semibold">{tutor.rating}</span>
                    </div>
                    <div>{tutor.students}+ students</div>
                    <div>{tutor.experience}</div>
                  </div>

                  {/* Button */}
                  <button className="w-full mt-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all text-sm sm:text-base cursor-pointer">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Popular Subjects
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Master any subject with our expert tutors
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {subjects.map((subject, index) => (
              <div
                key={index}
                className="group p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 text-center border border-gray-100"
              >
                <h3 className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                  {subject}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            Ready to Excel?
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-10 max-w-3xl mx-auto text-gray-200 leading-relaxed">
            Join thousands of successful students and start your journey to
            academic excellence today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <button className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 sm:px-10 py-3 sm:py-4 rounded-full font-bold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <span className="flex items-center justify-center space-x-2">
                <span>Start Learning Now</span>
                <span className="">🎓</span>
              </span>
            </button>
            <button className="group w-full sm:w-auto border-2 border-white text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full font-bold text-lg hover:bg-white hover:text-purple-900 transform hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <span className="flex items-center justify-center space-x-2">
                <span>Free Trial</span>
                <span className="">✨</span>
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
