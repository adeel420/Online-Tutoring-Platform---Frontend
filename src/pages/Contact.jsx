import React, { useState } from "react";
import { accordion, contactInfo } from "../data/Data";
import Chatbot from "../components/chatbot/Chatbot";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ---------------- HERO SECTION ---------------- */}
      <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 md:mb-6">
            Get In Touch
          </h1>
          <p className="text-lg md:text-2xl max-w-3xl mx-auto text-gray-200 leading-relaxed px-2">
            Have questions? We're here to help! Reach out to our friendly team
            for support, inquiries, or feedback.
          </p>
        </div>
      </section>

      {/* ---------------- CONTACT CARDS ---------------- */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 p-6 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-1">
                  {item.title}
                </h3>
                <a
                  href={item.link}
                  className="text-gray-600 hover:text-purple-600 text-sm md:text-base transition-colors break-words"
                >
                  {item.info}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FORM + SUPPORT SECTION ---------------- */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* --------- CONTACT FORM --------- */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-5 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Send us a Message
              </h2>

              <p className="text-base md:text-lg text-gray-600 mb-8">
                Fill out the form below and we'll get back to you within 24
                hours.
              </p>

              <form className="space-y-6">
                {["name", "email", "subject"].map((field, i) => (
                  <div key={i}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {field.replace("_", " ")}
                    </label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      value={formData[field]}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder={`Enter your ${field}`}
                      required
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us more about your inquiry..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* --------- QUICK SUPPORT + HOURS --------- */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-8">
                <h3 className="text-xl md:text-2xl font-bold mb-6">
                  Quick Support
                </h3>

                <div className="space-y-4">
                  {[
                    {
                      icon: "?",
                      title: "General Inquiries",
                      desc: "Questions about our platform, pricing, or services",
                    },
                    {
                      icon: "🎓",
                      title: "Student Support",
                      desc: "Help with booking sessions, technical issues, or account",
                    },
                    {
                      icon: "👨🏫",
                      title: "Tutor Support",
                      desc: "Assistance with profile setup, payments, or teaching tools",
                    },
                  ].map((item, i) => (
                    <div className="flex items-start space-x-3" key={i}>
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold">{item.title}</h4>
                        <p className="text-gray-600 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-lg p-8">
                <h3 className="text-xl md:text-2xl font-bold mb-6">
                  Office Hours
                </h3>

                <div className="space-y-3 text-sm md:text-base">
                  <div className="flex justify-between">
                    <span className="font-medium">Monday - Friday</span>
                    <span className="text-gray-600">9:00 AM - 6:00 PM</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium">Saturday</span>
                    <span className="text-gray-600">10:00 AM - 4:00 PM</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium">Sunday</span>
                    <span className="text-gray-600">Closed</span>
                  </div>

                  <div className="border-t pt-4 mt-4 flex justify-between text-purple-600 font-medium">
                    <span>Emergency Support</span>
                    <span>24/7 Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- FAQ SECTION ---------------- */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 text-base md:text-lg">
              Quick answers to common questions
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {accordion.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold">{faq.question}</h3>
                  <span
                    className={`text-2xl transform transition-transform ${
                      openFAQ === index ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>

                {openFAQ === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default Contact;
