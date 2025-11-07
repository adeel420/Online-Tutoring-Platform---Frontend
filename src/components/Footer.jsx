import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                TutorHub
              </h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Empowering students across Pakistan with world-class online
              tutoring.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-lg">For Students</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors">
                  Find Tutors
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors">
                  Browse Subjects
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors">
                  Success Stories
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-lg">For Tutors</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors">
                  Become a Tutor
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors">
                  Tutor Resources
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors">
                  Earnings
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-lg">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 py-8 text-center text-gray-400">
          <p>&copy; copyright by tutorhub 2025</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
