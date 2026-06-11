import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { features, servicesSubjects } from "../data/Data";
import Chatbot from "../components/chatbot/Chatbot";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import ReadyToStart from "../components/ReadyToStart";
import { formatDateLabel, formatTimeRange12 } from "../utils/time";

const normalizeFeaturedTutor = (tutor) => ({
  id: tutor._id || tutor.id,
  name: tutor.name || "Tutor",
  subject: tutor.subject || "Subject not added",
  rating: Number(tutor.rating || 0),
  ratingCount: tutor.ratingCount ?? (tutor.rating ? 1 : 0),
  students: tutor.students || 0,
  experience: tutor.experience || "Experience not added",
  image: tutor.profile || tutor.image || "",
  rate: tutor.rate || "Rate not added",
  available: tutor.available ?? true,
  qualification: tutor.qualification || "Qualification not added",
  location: tutor.location || "Location not added",
  bio: tutor.bio || "This tutor has not added a bio yet.",
  tags:
    Array.isArray(tutor.tags) && tutor.tags.length
      ? tutor.tags
      : [tutor.subject || "Tutoring"],
  reviews: Array.isArray(tutor.reviews) ? tutor.reviews : [],
  availabilitySlots: Array.isArray(tutor.availabilitySlots)
    ? tutor.availabilitySlots.filter((slot) => !slot.isBooked)
    : [],
});

const AnimatedStat = ({ target, suffix = "", label, color, formatter }) => {
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStarted(true);
      },
      { threshold: 0.35 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return undefined;

    let frameId;
    const duration = 1400;
    const startTime = performance.now();

    const animate = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [started, target]);

  return (
    <div ref={ref} className="p-6">
      <div className={`text-4xl font-bold ${color} mb-2`}>
        {formatter ? formatter(value) : value}
        {suffix}
      </div>
      <div className="text-gray-600 font-medium">{label}</div>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [homeTutors, setHomeTutors] = useState([]);
  const [loadingTutors, setLoadingTutors] = useState(true);
  const [subjectCounts, setSubjectCounts] = useState({});
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [booking, setBooking] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [confirmingPayment, setConfirmingPayment] = useState(false);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVER_API}/user/tutors`,
        );
        const tutors = Array.isArray(data) ? data : [];
        setHomeTutors(tutors.slice(0, 3).map(normalizeFeaturedTutor));
        const counts = servicesSubjects.reduce((acc, subject) => {
          const subjectName = subject.name.toLowerCase();
          acc[subject.name] = tutors.filter((tutor) => {
            const tutorSubject = String(tutor.subject || "").toLowerCase();
            const tags = Array.isArray(tutor.tags) ? tutor.tags : [];
            return (
              tutorSubject.includes(subjectName) ||
              tags.some((tag) =>
                String(tag).toLowerCase().includes(subjectName),
              )
            );
          }).length;
          return acc;
        }, {});
        setSubjectCounts(counts);
      } catch {
        setHomeTutors([]);
      } finally {
        setLoadingTutors(false);
      }
    };

    fetchTutors();
  }, []);

  const openTutorProfile = (tutor) => {
    setSelectedTutor(tutor);
    setSelectedSlot(tutor.availabilitySlots?.[0]?._id || "");
    setPaymentInfo(null);
  };

  const closeTutorProfile = () => {
    setSelectedTutor(null);
    setSelectedSlot("");
    setPaymentInfo(null);
  };

  const removeBookedSlot = (bookedSlotId) => {
    const removeSlot = (tutor) =>
      tutor.id === selectedTutor.id
        ? {
            ...tutor,
            availabilitySlots: tutor.availabilitySlots.filter(
              (slot) => String(slot._id) !== String(bookedSlotId),
            ),
          }
        : tutor;

    setHomeTutors((prev) => prev.map(removeSlot));
    setSelectedTutor((prev) => {
      if (!prev) return prev;

      const availabilitySlots = prev.availabilitySlots.filter(
        (slot) => String(slot._id) !== String(bookedSlotId),
      );
      setSelectedSlot(availabilitySlots[0]?._id || "");
      return { ...prev, availabilitySlots };
    });
  };

  const handleBookSession = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token) {
      toast.error("Pehle student role se login ho.");
      navigate("/login");
      return;
    }

    if (user.role !== "student") {
      toast.error("Pehle student role se login ho.");
      return;
    }

    if (!selectedTutor || !selectedSlot) {
      toast.error("Please select a slot.");
      return;
    }

    setBooking(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_API}/user/tutors/${selectedTutor.id}/bookings`,
        { slotId: selectedSlot },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setPaymentInfo({
        booking: data.booking,
        payment: data.payment,
        jazzCash: data.jazzCash,
        slotId: selectedSlot,
      });
      toast.success("Booking ready. Please complete payment.");
    } catch (err) {
      toast.error(err.response?.data?.error || "Could not book this slot.");
    } finally {
      setBooking(false);
    }
  };

  const submitJazzCashForm = () => {
    if (!paymentInfo?.jazzCash?.payload) return;

    const form = document.createElement("form");
    form.method = "POST";
    form.action = paymentInfo.jazzCash.actionUrl;

    Object.entries(paymentInfo.jazzCash.payload).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value ?? "";
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  const confirmSandboxPayment = async () => {
    const token = localStorage.getItem("token");
    if (!paymentInfo?.payment?._id && !paymentInfo?.payment?.id) return;

    setConfirmingPayment(true);
    try {
      const paymentId = paymentInfo.payment._id || paymentInfo.payment.id;
      await axios.post(
        `${import.meta.env.VITE_SERVER_API}/payment/${paymentId}/dev-confirm`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      removeBookedSlot(paymentInfo.slotId);
      setPaymentInfo(null);
      closeTutorProfile();
      toast.success("Payment successful. Session booked.");
    } catch (err) {
      toast.error(err.response?.data?.error || "Payment could not be confirmed.");
    } finally {
      setConfirmingPayment(false);
    }
  };

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
            <button
              onClick={() => navigate("/tutors")}
              className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 sm:px-10 py-3 sm:py-4 rounded-full font-bold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>Find a Tutor</span>
                <span className=" transition-transform">🚀</span>
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              {
                target: 500,
                suffix: "+",
                label: "Expert Tutors",
                color: "text-purple-600",
              },
              {
                target: 10000,
                suffix: "+",
                label: "Happy Students",
                color: "text-blue-600",
                formatter: (value) =>
                  value >= 10000 ? "10K" : value.toLocaleString(),
              },
              {
                target: 50,
                suffix: "+",
                label: "Subjects",
                color: "text-green-600",
              },
              {
                target: 98,
                suffix: "%",
                label: "Success Rate",
                color: "text-orange-600",
              },
            ].map((stat) => (
              <AnimatedStat key={stat.label} {...stat} />
            ))}
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

          {loadingTutors ? (
            <div className="flex items-center justify-center py-16">
              <Loader size={44} />
            </div>
          ) : homeTutors.length === 0 ? (
            <p className="text-center text-gray-500 py-12">
              No tutors available right now.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {homeTutors.map((tutor, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300 overflow-hidden flex flex-col"
                >
                  <div className="p-8 flex flex-col flex-1 text-center">
                    {/* Tutor Image */}
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-6">
                      {tutor.image ? (
                        <img
                          src={tutor.image}
                          alt={tutor.name}
                          className="w-full h-full object-cover rounded-full "
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                          {tutor.name[0]}
                        </div>
                      )}
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
                        <span className="font-semibold">
                          {tutor.ratingCount ? tutor.rating : "New"}
                        </span>
                      </div>
                      <div>{tutor.students}+ students</div>
                      <div>{tutor.experience}</div>
                    </div>

                    {/* Button */}
                    <button
                      onClick={() => openTutorProfile(tutor)}
                      className="w-full mt-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all text-sm sm:text-base cursor-pointer"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {servicesSubjects.map((subject, index) => (
              <button
                key={index}
                type="button"
                onClick={() =>
                  navigate(`/subjects/${encodeURIComponent(subject.name)}`)
                }
                className="bg-white rounded-2xl shadow-md hover:shadow-xl p-5 sm:p-6 text-center hover:-translate-y-2 transition-all duration-300 cursor-pointer"
              >
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">
                  {subject.icon}
                </div>
                <h3 className="font-bold">{subject.name}</h3>
                <p className="text-sm text-purple-600 font-medium">
                  {subjectCounts[subject.name] ?? subject.tutors} Tutors
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <ReadyToStart />

      {selectedTutor && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={closeTutorProfile}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 rounded-t-3xl p-6 text-white text-center relative">
              <button
                onClick={closeTutorProfile}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all cursor-pointer text-lg"
              >
                X
              </button>

              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-black text-3xl font-bold mx-auto mb-3 shadow-lg overflow-hidden">
                {selectedTutor.image ? (
                  <img
                    src={selectedTutor.image}
                    alt={selectedTutor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  selectedTutor.name[0]
                )}
              </div>

              <h3 className="text-xl font-bold">{selectedTutor.name}</h3>
              <p className="text-white/80 text-sm mt-0.5">
                {selectedTutor.subject}
              </p>
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
                  selectedTutor.available
                    ? "bg-green-400/20 text-green-300"
                    : "bg-gray-400/20 text-gray-300"
                }`}
              >
                {selectedTutor.available
                  ? "Available for Booking"
                  : "Currently Busy"}
              </span>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    label: "Rating",
                    value: selectedTutor.ratingCount
                      ? `${selectedTutor.rating}/5`
                      : "No ratings",
                    bg: "bg-yellow-50 border-yellow-100",
                  },
                  {
                    label: "Students",
                    value: selectedTutor.students,
                    bg: "bg-blue-50 border-blue-100",
                  },
                  {
                    label: "Experience",
                    value: selectedTutor.experience,
                    bg: "bg-purple-50 border-purple-100",
                  },
                  {
                    label: "Rate",
                    value: `${selectedTutor.rate}/hour`,
                    bg: "bg-green-50 border-green-100",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={`${stat.bg} border rounded-xl p-3 text-center`}
                  >
                    <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                    <p className="font-bold text-gray-800 text-sm">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {[
                  { label: "Qualification", value: selectedTutor.qualification },
                  { label: "Location", value: selectedTutor.location },
                ].map((detail) => (
                  <div
                    key={detail.label}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                  >
                    <div>
                      <p className="text-xs text-gray-500">{detail.label}</p>
                      <p className="font-semibold text-gray-800 text-sm">
                        {detail.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  About
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedTutor.bio}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  Specializations
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedTutor.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-xl text-xs font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  Available Slots
                </p>
                {selectedTutor.availabilitySlots.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedTutor.availabilitySlots.map((slot) => (
                      <label
                        key={slot._id}
                        className={`border rounded-xl p-3 cursor-pointer transition-all ${
                          selectedSlot === slot._id
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-100 bg-gray-50 hover:border-purple-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name="home-slot"
                          value={slot._id}
                          checked={selectedSlot === slot._id}
                          onChange={(event) =>
                            setSelectedSlot(event.target.value)
                          }
                          className="sr-only"
                        />
                        <span className="block text-sm font-bold text-gray-800">
                          {formatDateLabel(slot.date)}
                        </span>
                        <span className="block text-xs text-gray-500">
                          {slot.day}
                        </span>
                        <span className="text-xs font-semibold text-purple-700">
                          {formatTimeRange12(slot.from, slot.to)}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 p-3 bg-gray-50 rounded-xl">
                    No open slots right now.
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  Student Reviews
                </p>
                <div className="space-y-2">
                  {selectedTutor.reviews.length ? (
                    selectedTutor.reviews.slice(0, 3).map((review, index) => (
                      <div
                        key={`${review.student}-${index}`}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl"
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {review.student?.[0] || "S"}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-gray-800">
                              {review.student}
                            </p>
                            <span className="text-xs text-yellow-500">
                              {"★".repeat(review.rating)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            "{review.text}"
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 p-3 bg-gray-50 rounded-xl">
                      No reviews yet.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  disabled={!selectedTutor.available || !selectedSlot || booking}
                  onClick={handleBookSession}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                    selectedTutor.available && selectedSlot && !booking
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg cursor-pointer"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {booking
                    ? "Preparing Payment..."
                    : selectedSlot
                      ? "Book a Session"
                      : "No Slot Available"}
                </button>
                <button
                  onClick={closeTutorProfile}
                  className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {paymentInfo && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
            <div className="text-center mb-5">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center justify-center font-bold">
                JC
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                JazzCash Payment
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Complete payment to confirm your session.
              </p>
            </div>

            <div className="space-y-3 bg-gray-50 rounded-2xl p-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Tutor</span>
                <span className="font-semibold text-gray-800 text-right">
                  {selectedTutor?.name}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Subject</span>
                <span className="font-semibold text-gray-800 text-right">
                  {selectedTutor?.subject}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Amount</span>
                <span className="font-bold text-purple-700">
                  PKR {paymentInfo.payment?.amount}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Reference</span>
                <span className="font-semibold text-gray-800 text-right">
                  {paymentInfo.payment?.transactionRef}
                </span>
              </div>
            </div>

            {!paymentInfo.jazzCash?.configured && (
              <p className="text-xs text-orange-600 bg-orange-50 border border-orange-100 rounded-xl p-3 mt-4">
                JazzCash credentials are not configured yet. Use sandbox confirm
                for local testing.
              </p>
            )}

            <div className="flex flex-col gap-3 mt-5">
              <button
                onClick={submitJazzCashForm}
                disabled={!paymentInfo.jazzCash?.configured}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                  paymentInfo.jazzCash?.configured
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg cursor-pointer"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                Pay with JazzCash
              </button>
              <button
                onClick={confirmSandboxPayment}
                disabled={confirmingPayment}
                className="w-full py-3 rounded-xl font-bold text-sm bg-green-100 text-green-700 hover:bg-green-200 transition-all cursor-pointer"
              >
                {confirmingPayment ? "Confirming..." : "Sandbox: Mark Paid"}
              </button>
              <button
                onClick={() => setPaymentInfo(null)}
                className="w-full py-3 rounded-xl font-semibold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {false && (
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
            </div>
          </div>
        </section>
      )}

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default Home;
