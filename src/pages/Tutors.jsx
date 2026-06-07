import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaSearch, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Chatbot from "../components/chatbot/Chatbot";

const normalizeTutor = (tutor, index = 0) => ({
  id: tutor._id || tutor.id || index,
  name: tutor.name || "Tutor",
  subject: tutor.subject || "Subject not added",
  rating: tutor.rating || 4.5,
  students: tutor.students || 0,
  experience: tutor.experience || "Experience not added",
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
  profile: tutor.profile || tutor.image || "",
  availabilitySlots: Array.isArray(tutor.availabilitySlots)
    ? tutor.availabilitySlots.filter((slot) => !slot.isBooked)
    : [],
});

const Tutors = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterAvail, setFilterAvail] = useState("all");
  const [selected, setSelected] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [booking, setBooking] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const [remoteTutors, setRemoteTutors] = useState([]);
  const [loadingTutors, setLoadingTutors] = useState(true);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVER_API}/user/tutors`,
        );
        const tutors = Array.isArray(data) ? data : [];
        setRemoteTutors(tutors.map(normalizeTutor));
      } catch (err) {
        setRemoteTutors([]);
      } finally {
        setLoadingTutors(false);
      }
    };

    fetchTutors();
  }, []);

  const filteredTutors = useMemo(() => {
    const query = search.trim().toLowerCase();

    return remoteTutors
      .filter((tutor) => {
        const matchSearch =
          !query ||
          tutor.name.toLowerCase().includes(query) ||
          tutor.subject.toLowerCase().includes(query) ||
          tutor.location.toLowerCase().includes(query) ||
          tutor.tags.some((tag) => tag.toLowerCase().includes(query));

        const matchAvail =
          filterAvail === "all" ||
          (filterAvail === "available" && tutor.available) ||
          (filterAvail === "busy" && !tutor.available);

        return matchSearch && matchAvail;
      })
      .sort((a, b) => b.rating - a.rating);
  }, [remoteTutors, search, filterAvail]);

  const openProfile = (tutor) => {
    setSelected(tutor);
    setSelectedSlot(tutor.availabilitySlots?.[0]?._id || "");
  };

  const closeProfile = () => {
    setSelected(null);
    setSelectedSlot("");
    setPaymentInfo(null);
  };

  const removeBookedSlot = (bookedSlotId) => {
    const removeSlot = (tutor) =>
      tutor.id === selected.id
        ? {
            ...tutor,
            availabilitySlots: tutor.availabilitySlots.filter(
              (slot) => String(slot._id) !== String(bookedSlotId),
            ),
          }
        : tutor;

    setRemoteTutors((prev) => prev.map(removeSlot));
    setSelected((prev) => {
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

    if (!selected || !selectedSlot) {
      toast.error("Please select a slot.");
      return;
    }

    setBooking(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_API}/user/tutors/${selected.id}/bookings`,
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
      closeProfile();
      toast.success("Payment successful. Session booked.");
    } catch (err) {
      toast.error(err.response?.data?.error || "Payment could not be confirmed.");
    } finally {
      setConfirmingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply blur-3xl opacity-20 translate-x-1/2 translate-y-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
            Find Your Perfect
            <span className="block bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
              Tutor
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto mb-10">
            Browse Pakistan's top-rated tutors across all subjects. Filter by
            availability, rating, and more.
          </p>

          <div className="max-w-2xl mx-auto relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              <FaSearch />
            </span>
            <div className="p-[2px] rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500">
              <input
                type="text"
                placeholder="Search by name, subject, topic or city..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-[#2a2f8a] text-white text-base focus:outline-none focus:ring-4 focus:ring-purple-300"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-gray-100 py-5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-center">
            {[
              { value: `${remoteTutors.length}+`, label: "Expert Tutors" },
              {
                value: remoteTutors.filter((tutor) => tutor.available).length,
                label: "Available Now",
              },
              { value: "10+", label: "Subjects" },
              { value: "4.7", label: "Avg Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: "All Tutors" },
                { key: "available", label: "Available" },
                { key: "busy", label: "Busy" },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setFilterAvail(filter.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    filterAvail === filter.key
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {filteredTutors.length}
            </span>{" "}
            {loadingTutors ? "loading tutors" : "tutors"}
            {search && (
              <span>
                {" "}
                for "
                <span className="text-purple-600 font-semibold">{search}</span>
                "
              </span>
            )}
          </p>

          {loadingTutors ? (
            <div className="text-center py-20">
              <p className="text-xl font-semibold text-gray-600">
                Loading tutors...
              </p>
            </div>
          ) : filteredTutors.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl font-semibold text-gray-600">
                No tutors found
              </p>
              <p className="text-gray-400 mt-2">
                Try a different search or filter
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTutors.map((tutor) => (
                <div
                  key={tutor.id}
                  className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300 overflow-hidden flex flex-col"
                >
                  <div className="p-8 flex flex-col flex-1 text-center">
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-6">
                      {tutor.profile ? (
                        <img
                          src={tutor.profile}
                          alt={tutor.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                          {tutor.name[0]}
                        </div>
                      )}
                    </div>

                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 text-gray-900">
                      {tutor.name}
                    </h3>
                    <p className="text-purple-600 font-semibold mb-4 text-sm sm:text-base">
                      {tutor.subject}
                    </p>

                    <div className="flex flex-wrap justify-center items-center gap-3 mb-6 text-xs sm:text-sm md:text-base text-gray-700">
                      <div className="flex items-center space-x-1">
                        <FaStar className="text-yellow-500" />
                        <span className="font-semibold">{tutor.rating}</span>
                      </div>
                      <div>{tutor.students}+ students</div>
                      <div>{tutor.experience}</div>
                    </div>

                    <button
                      onClick={() => openProfile(tutor)}
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

      <section className="py-20 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Can't find the right tutor?
          </h2>
          <p className="text-gray-200 text-lg mb-8">
            Tell us what you need and we'll match you with the perfect tutor.
          </p>
          <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer">
            Request a Tutor
          </button>
        </div>
      </section>

      {selected && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={closeProfile}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 rounded-t-3xl p-6 text-white text-center relative">
              <button
                onClick={closeProfile}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all cursor-pointer text-lg"
              >
                X
              </button>

              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-black text-3xl font-bold mx-auto mb-3 shadow-lg overflow-hidden">
                {selected.profile ? (
                  <img
                    src={selected.profile}
                    alt={selected.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  selected.name[0]
                )}
              </div>

              <h3 className="text-xl font-bold">{selected.name}</h3>
              <p className="text-white/80 text-sm mt-0.5">
                {selected.subject}
              </p>
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
                  selected.available
                    ? "bg-green-400/20 text-green-300"
                    : "bg-gray-400/20 text-gray-300"
                }`}
              >
                {selected.available
                  ? "Available for Booking"
                  : "Currently Busy"}
              </span>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    label: "Rating",
                    value: selected.rating,
                    bg: "bg-yellow-50 border-yellow-100",
                  },
                  {
                    label: "Students",
                    value: selected.students,
                    bg: "bg-blue-50 border-blue-100",
                  },
                  {
                    label: "Experience",
                    value: selected.experience,
                    bg: "bg-purple-50 border-purple-100",
                  },
                  {
                    label: "Rate",
                    value: `${selected.rate}/hour`,
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
                  { label: "Qualification", value: selected.qualification },
                  { label: "Location", value: selected.location },
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
                  {selected.bio}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  Specializations
                </p>
                <div className="flex flex-wrap gap-2">
                  {selected.tags.map((tag) => (
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
                {selected.availabilitySlots.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selected.availabilitySlots.map((slot) => (
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
                          name="slot"
                          value={slot._id}
                          checked={selectedSlot === slot._id}
                          onChange={(event) =>
                            setSelectedSlot(event.target.value)
                          }
                          className="sr-only"
                        />
                        <span className="block text-sm font-bold text-gray-800">
                          {slot.day}
                        </span>
                        <span className="text-xs font-semibold text-purple-700">
                          {slot.from} - {slot.to}
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
                  {selected.reviews.length ? (
                    selected.reviews.map((review, index) => (
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
                              {"*".repeat(review.rating)}
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
                  disabled={!selected.available || !selectedSlot || booking}
                  onClick={handleBookSession}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                    selected.available && selectedSlot && !booking
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
                  onClick={closeProfile}
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
                  {selected?.name}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Subject</span>
                <span className="font-semibold text-gray-800 text-right">
                  {selected?.subject}
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

      <Chatbot />
    </div>
  );
};

export default Tutors;
