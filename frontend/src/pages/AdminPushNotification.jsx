import { useState, useEffect, useMemo } from "react";
import { Send, Loader, X, Search } from "lucide-react";
import PageHeader from "../components/PageHeader";
import {
  sendPushNotification,
  getAdminNotificationHistory,
  getAdminNotificationUsers,
} from "../services/notificationService";

export default function AdminPushNotification() {
  const [historyLoading, setHistoryLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "system",
    targetAudience: "all",
    targetUserId: "",
  });

  const [userSearch, setUserSearch] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Load users and notification history
  useEffect(() => {
    fetchUsers();
    fetchHistory();
  }, []);

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const res = await getAdminNotificationUsers();
      setUsers(res.data ?? []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setUsersLoading(false);
    }
  };

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

  // Filter users based on search query (by name or email)
  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return users.slice(0, 10); // Show first 10 by default
    const query = userSearch.toLowerCase();
    return users.filter(
      (u) =>
        u.fullName.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)
    );
  }, [userSearch, users]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Reset user selection when target audience changes
    if (name === "targetAudience" && value !== "specific") {
      setSelectedUser(null);
      setUserSearch("");
      setForm((prev) => ({ ...prev, targetUserId: "" }));
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setForm((prev) => ({
      ...prev,
      targetUserId: user.id,
    }));
    setUserSearch("");
    setShowUserDropdown(false);
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
      setError("Please select a user for 'Specific User' target.");
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
      setSelectedUser(null);
      setUserSearch("");

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
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
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
                  <label className="input-label">Username *</label>
                  <div className="relative">
                    <div className="relative">
                      <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                      <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        onFocus={() => setShowUserDropdown(true)}
                        className="input-field pl-9"
                      />
                    </div>

                    {showUserDropdown && !usersLoading && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-64 overflow-y-auto">
                        {filteredUsers.length === 0 ? (
                          <div className="p-4 text-center text-gray-400 text-sm">
                            No users found
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-100">
                            {filteredUsers.map((user) => (
                              <button
                                key={user.id}
                                type="button"
                                onClick={() => handleUserSelect(user)}
                                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors focus:outline-none"
                              >
                                <div className="font-semibold text-gray-800">
                                  {user.fullName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {user.email} • {user.role}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {selectedUser && (
                    <div className="mt-2 p-3 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-blue-900 text-sm">
                          {selectedUser.fullName}
                        </div>
                        <div className="text-xs text-blue-700">{selectedUser.email}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUser(null);
                          setForm((prev) => ({ ...prev, targetUserId: "" }));
                          setUserSearch("");
                        }}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
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
                      <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                        Title
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                        Recipients
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                        Targeted Audience
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                        Date Sent
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {history.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-gray-700 font-medium max-w-xs truncate">
                          {item.title}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600 whitespace-nowrap">
                            {item.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                          {item.recipientCount}
                        </td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                          <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-600 capitalize">
                            {item.targetedAudience}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                          {formatDate(item.sentDate)}
                        </td>
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
