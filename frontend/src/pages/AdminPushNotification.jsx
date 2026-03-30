import { useState, useEffect } from "react";
import { Send, Loader } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { sendPushNotification, getAdminNotificationHistory } from "../services/notificationService";

export default function AdminPushNotification() {
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "system",
    targetAudience: "all",
    targetUserId: "",
  });

  // Load notification history
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      const res = await getAdminNotificationHistory();
      setHistory(res.data ?? []);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!form.title.trim() || !form.message.trim()) {
      setError("Title and Message are required.");
      return;
    }

    if (form.targetAudience === "specific" && !form.targetUserId.trim()) {
      setError("User ID is required for 'Specific User' target.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: form.title.trim(),
        message: form.message.trim(),
        type: form.type,
        targetAudience: form.targetAudience,
        targetUserId: form.targetAudience === "specific" ? form.targetUserId : null,
      };

      const res = await sendPushNotification(payload);
      setSuccess(res.data?.message || "Notification sent successfully!");

      // Reset form
      setForm({
        title: "",
        message: "",
        type: "system",
        targetAudience: "all",
        targetUserId: "",
      });

      // Refresh history
      await fetchHistory();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to send notification.";
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div>
      <PageHeader title="Push Notifications" subtitle="Send notifications to users" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Send Notification Form */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <h3 className="font-bold text-lg text-heading mb-4 flex items-center gap-2">
              <Send size={18} />
              Send Notification
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 rounded-xl bg-mint-50 text-mint-600 text-sm font-medium">
                  {success}
                </div>
              )}

              <div>
                <label className="input-label">Title *</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Notification title"
                  value={form.title}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="input-label">Message *</label>
                <textarea
                  name="message"
                  placeholder="Notification message"
                  value={form.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="input-field resize-none"
                  required
                />
              </div>

              <div>
                <label className="input-label">Type</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="system">System</option>
                  <option value="broadcast">Broadcast</option>
                  <option value="reminder">Reminder</option>
                  <option value="appointment">Appointment</option>
                </select>
              </div>

              <div>
                <label className="input-label">Target Audience *</label>
                <select
                  name="targetAudience"
                  value={form.targetAudience}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="all">All Users</option>
                  <option value="doctors">All Doctors</option>
                  <option value="patients">All Patients</option>
                  <option value="specific">Specific User</option>
                </select>
              </div>

              {form.targetAudience === "specific" && (
                <div>
                  <label className="input-label">User ID *</label>
                  <input
                    type="text"
                    name="targetUserId"
                    placeholder="Enter user ID"
                    value={form.targetUserId}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Notification
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Notification History */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h3 className="font-bold text-lg text-heading mb-4">Notification History</h3>

            {historyLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="w-6 h-6 border-2 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Send size={32} className="mx-auto mb-3 opacity-30" />
                <p className="font-semibold">No notifications sent yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60">
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Title</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Type</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Recipients</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Date Sent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {history.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-gray-700 font-medium">{item.title}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600">
                            {item.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{item.recipientCount}</td>
                        <td className="px-4 py-3 text-gray-500">{formatDate(item.sentDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
