import React from "react";
import {
  services,
  servicesPlans,
  servicesSubjects,
  servicesWork,
} from "../data/Data";
import Chatbot from "../components/chatbot/Chatbot";

const Services = () => {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-20 md:py-28 overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-5 md:left-20 w-40 h-40 md:w-72 md:h-72 bg-purple-500 rounded-full mix-blend-multiply blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-10 right-5 md:right-20 w-40 h-40 md:w-72 md:h-72 bg-blue-500 rounded-full mix-blend-multiply blur-xl opacity-20 animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            Our Services
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
            Comprehensive educational solutions designed to help you achieve
            academic excellence and reach your full potential.
          </p>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Title */}
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              What We Offer
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Choose the perfect learning solution for your needs
            </p>
          </div>

          {/* Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden hover:-translate-y-2"
              >
                <div className="p-6 sm:p-8">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-center mb-3">
                    {service.title}
                  </h3>

                  <p className="text-gray-600 text-center mb-6 sm:leading-relaxed">
                    {service.description}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex text-sm text-gray-600">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-1"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="text-center">
                    <p className="text-lg font-bold text-purple-600 mb-4">
                      {service.price}
                    </p>

                    <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
                      Get Started
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUBJECTS SECTION */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Subjects We Cover
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Expert tutors available in all major subjects
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {servicesSubjects.map((subject, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl p-5 sm:p-6 text-center hover:-translate-y-2 transition-all duration-300 cursor-pointer"
              >
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 ">
                  {subject.icon}
                </div>
                <h3 className="font-bold">{subject.name}</h3>
                <p className="text-sm text-purple-600 font-medium">
                  {subject.tutors} Tutors
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS SECTION */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Simple steps to start your learning journey
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {servicesWork.map((item, index) => (
              <div
                key={index}
                className="text-center px-4 hover:shadow hover:shadow-2xl transition-all hover:-translate-y-2 rounded-[10px] p-8 "
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl sm:text-3xl font-bold mb-4">
                  {item.step}
                </div>
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Flexible Pricing
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Choose a plan that fits your goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {servicesPlans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-3xl shadow-lg p-8 relative transition-all 
                ${plan.popular ? "ring-2 ring-purple-500 scale-[1.03]" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-xs sm:text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-3xl sm:text-4xl font-bold text-purple-600">
                    {plan.price}
                  </div>
                  <p className="text-gray-600">{plan.period}</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center text-sm text-gray-700"
                    >
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-full font-semibold transition-all cursor-pointer ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:-translate-y-0.5"
                      : "border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
                  }`}
                >
                  Choose Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Ready to Excel?
          </h2>
          <p className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto mb-10">
            Join thousands of successful students and start your journey to
            academic excellence with our expert tutors.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-3 sm:px-10 sm:py-4 rounded-full font-bold text-lg hover:shadow-2xl cursor-pointer transition-all hover:-translate-y-1">
              Start Free Trial ✨
            </button>

            <button className="border-2 border-white text-white px-8 py-3 sm:px-10 sm:py-4 rounded-full font-bold text-lg hover:bg-white hover:text-purple-900 transition-all cursor-pointer hover:-translate-y-1">
              View All Tutors 👥
            </button>
          </div>
        </div>
      </section>
      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};
export default Services;
