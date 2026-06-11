import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../Loader";

const statusStyle = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-orange-100 text-orange-600",
  failed: "bg-red-100 text-red-600",
};

const currencyFormatter = new Intl.NumberFormat("en-PK", {
  maximumFractionDigits: 0,
});

const PaymentBreakdown = ({ amount = 0 }) => {
  const total = Number(amount || 0);
  const adminFee = total * 0.1;
  const tutorPayout = total * 0.9;

  return (
    <div className="min-w-44 space-y-1">
      <p className="font-bold text-gray-800">
        Total: PKR {currencyFormatter.format(total)}
      </p>
      <p className="text-xs font-semibold text-orange-600">
        Admin 10%: PKR {currencyFormatter.format(adminFee)}
      </p>
      <p className="text-xs text-green-600">
        Tutor 90%: PKR {currencyFormatter.format(tutorPayout)}
      </p>
    </div>
  );
};

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVER_API}/payment/admin/payments`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setPayments(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error(err.response?.data?.error || "Failed to load payments.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const filtered =
    filter === "all" ? payments : payments.filter((p) => p.status === filter);
  const paidTotal = payments
    .filter((payment) => payment.status === "paid")
    .reduce((total, payment) => total + (payment.rawAmount || 0), 0);
  const adminFeeTotal = paidTotal * 0.1;
  const tutorPayoutTotal = paidTotal * 0.9;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 rounded-2xl p-5 text-white">
          <p className="text-white/70 text-sm mb-1">Total Payment Received</p>
          <p className="text-3xl font-bold">
            PKR {currencyFormatter.format(paidTotal)}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-orange-100">
          <p className="text-orange-600 text-sm font-semibold mb-1">
            Admin Fee 10%
          </p>
          <p className="text-2xl font-bold text-gray-800">
            PKR {currencyFormatter.format(adminFeeTotal)}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-green-100">
          <p className="text-green-600 text-sm font-semibold mb-1">
            Tutor Payout 90%
          </p>
          <p className="text-2xl font-bold text-gray-800">
            PKR {currencyFormatter.format(tutorPayoutTotal)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-2">
        {["all", "paid", "pending", "failed"].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all cursor-pointer ${
              filter === item
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-100">
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">#</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Student</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Tutor</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Subject</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Amount</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Reference</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12">
                    <div className="flex items-center justify-center">
                      <Loader size={36} />
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400">
                    No payments found
                  </td>
                </tr>
              ) : (
                filtered.map((payment, index) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-gray-400">{index + 1}</td>
                    <td className="px-5 py-4 font-semibold text-gray-800">
                      {payment.student}
                    </td>
                    <td className="px-5 py-4 text-gray-600">{payment.tutor}</td>
                    <td className="px-5 py-4 text-gray-600">{payment.subject}</td>
                    <td className="px-5 py-4">
                      <PaymentBreakdown amount={payment.rawAmount} />
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      {payment.transactionRef}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          statusStyle[payment.status] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;
