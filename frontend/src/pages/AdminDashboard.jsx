import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RefreshCw, Trash2, Eye, Calendar, Mail, Phone, Clock, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import axios from "axios";
import { format } from "date-fns";
import AdminLogin from "@/components/AdminLogin";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const statusColors = {
  pending: "status-pending",
  confirmed: "status-confirmed",
  completed: "status-completed",
  cancelled: "status-cancelled",
};

const serviceLabels = {
  wedding: "Wedding Films",
  event: "Event Coverage",
  commercial: "Commercial Videos",
  social_media: "Social Media Content",
  real_estate: "Real Estate Tours",
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("bookings");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("diesel_admin_token");
    if (!token) {
      setIsCheckingAuth(false);
      return;
    }

    try {
      await axios.get(`${API}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsAuthenticated(true);
      fetchData(token);
    } catch (error) {
      localStorage.removeItem("diesel_admin_token");
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleLoginSuccess = (token) => {
    localStorage.setItem("diesel_admin_token", token);
    setIsAuthenticated(true);
    fetchData(token);
  };

  const handleLogout = () => {
    localStorage.removeItem("diesel_admin_token");
    setIsAuthenticated(false);
    setBookings([]);
    setMessages([]);
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("diesel_admin_token");
    return { Authorization: `Bearer ${token}` };
  };

  const fetchData = async (token) => {
    setIsLoading(true);
    const headers = token ? { Authorization: `Bearer ${token}` } : getAuthHeaders();
    
    try {
      const [bookingsRes, messagesRes] = await Promise.all([
        axios.get(`${API}/bookings`, { headers }),
        axios.get(`${API}/contact`, { headers }),
      ]);
      setBookings(bookingsRes.data);
      setMessages(messagesRes.data);
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Failed to fetch data");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await axios.patch(
        `${API}/bookings/${bookingId}`,
        { status: newStatus },
        { headers: getAuthHeaders() }
      );
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );
      toast.success(`Booking status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const deleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      await axios.delete(`${API}/bookings/${bookingId}`, {
        headers: getAuthHeaders(),
      });
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      toast.success("Booking deleted");
    } catch (error) {
      toast.error("Failed to delete booking");
    }
  };

  const openBookingDetail = (booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  const deleteMessage = async (messageId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await axios.delete(`${API}/contact/${messageId}`, {
        headers: getAuthHeaders(),
      });
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      toast.success("Message deleted");
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  const formatDate = (dateStr) => {
    try {
      return format(new Date(dateStr), "MMM d, yyyy");
    } catch {
      return dateStr;
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw size={32} className="text-[#F59E0B]" />
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#050505]"
      data-testid="admin-dashboard"
    >
      {/* Header */}
      <header className="bg-[#0A0A0A] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.a
                href="/"
                data-testid="admin-back-link"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-[#171717] border border-white/10 flex items-center justify-center text-white hover:border-[#F59E0B] transition-colors"
              >
                <ArrowLeft size={20} />
              </motion.a>
              <div>
                <h1 className="font-anton text-2xl text-white">
                  ADMIN <span className="text-[#F59E0B]">DASHBOARD</span>
                </h1>
                <p className="text-[#A1A1AA] text-sm">Manage bookings and messages</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => fetchData()}
                data-testid="refresh-btn"
                variant="outline"
                className="bg-transparent border-white/20 text-white hover:border-[#F59E0B] hover:text-[#F59E0B]"
              >
                <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
                <span className="ml-2 hidden sm:inline">Refresh</span>
              </Button>
              <Button
                onClick={handleLogout}
                data-testid="logout-btn"
                variant="outline"
                className="bg-transparent border-red-500/30 text-red-400 hover:border-red-500 hover:text-red-300"
              >
                <LogOut size={18} />
                <span className="ml-2 hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
        <div className="flex gap-4 mb-8">
          <motion.button
            onClick={() => setActiveTab("bookings")}
            data-testid="tab-bookings"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-6 py-3 font-medium uppercase tracking-wider text-sm transition-all ${
              activeTab === "bookings"
                ? "bg-[#F59E0B] text-black"
                : "bg-[#171717] text-white hover:bg-[#262626]"
            }`}
          >
            Bookings ({bookings.length})
          </motion.button>
          <motion.button
            onClick={() => setActiveTab("messages")}
            data-testid="tab-messages"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-6 py-3 font-medium uppercase tracking-wider text-sm transition-all ${
              activeTab === "messages"
                ? "bg-[#F59E0B] text-black"
                : "bg-[#171717] text-white hover:bg-[#262626]"
            }`}
          >
            Messages ({messages.length})
          </motion.button>
        </div>

        {/* Bookings Tab */}
        <AnimatePresence mode="wait">
          {activeTab === "bookings" && (
            <motion.div
              key="bookings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-[#0A0A0A] border border-white/5 overflow-hidden"
            >
              {isLoading ? (
                <div className="p-12 text-center text-[#A1A1AA]">
                  <RefreshCw className="animate-spin mx-auto mb-4" size={32} />
                  Loading...
                </div>
              ) : bookings.length === 0 ? (
                <div className="p-12 text-center text-[#A1A1AA]">
                  No bookings yet
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="admin-table" data-testid="bookings-table">
                    <thead>
                      <tr>
                        <th>Client</th>
                        <th>Service</th>
                        <th>Date & Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking, index) => (
                        <motion.tr
                          key={booking.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          data-testid={`booking-row-${booking.id}`}
                        >
                          <td>
                            <div>
                              <p className="text-white font-medium">
                                {booking.client_name}
                              </p>
                              <p className="text-[#A1A1AA] text-sm">
                                {booking.client_email}
                              </p>
                            </div>
                          </td>
                          <td className="text-white">
                            {serviceLabels[booking.service_type] || booking.service_type}
                          </td>
                          <td>
                            <div className="flex items-center gap-2 text-white">
                              <Calendar size={16} className="text-[#F59E0B]" />
                              {formatDate(booking.booking_date)}
                            </div>
                            <div className="flex items-center gap-2 text-[#A1A1AA] text-sm mt-1">
                              <Clock size={14} />
                              {booking.booking_time}
                            </div>
                          </td>
                          <td>
                            <Select
                              value={booking.status}
                              onValueChange={(value) =>
                                updateBookingStatus(booking.id, value)
                              }
                            >
                              <SelectTrigger
                                data-testid={`status-select-${booking.id}`}
                                className={`w-[140px] h-9 ${statusColors[booking.status]} border-none`}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-[#171717] border-white/10">
                                <SelectItem value="pending" className="text-[#F59E0B]">
                                  Pending
                                </SelectItem>
                                <SelectItem value="confirmed" className="text-[#10B981]">
                                  Confirmed
                                </SelectItem>
                                <SelectItem value="completed" className="text-[#3B82F6]">
                                  Completed
                                </SelectItem>
                                <SelectItem value="cancelled" className="text-[#EF4444]">
                                  Cancelled
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              <motion.button
                                onClick={() => openBookingDetail(booking)}
                                data-testid={`view-booking-${booking.id}`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-9 h-9 bg-[#171717] border border-white/10 flex items-center justify-center text-white hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors"
                                aria-label="View details"
                              >
                                <Eye size={16} />
                              </motion.button>
                              <motion.button
                                onClick={() => deleteBooking(booking.id)}
                                data-testid={`delete-booking-${booking.id}`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-9 h-9 bg-[#171717] border border-white/10 flex items-center justify-center text-white hover:border-[#EF4444] hover:text-[#EF4444] transition-colors"
                                aria-label="Delete booking"
                              >
                                <Trash2 size={16} />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {/* Messages Tab */}
          {activeTab === "messages" && (
            <motion.div
              key="messages"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {isLoading ? (
                <div className="bg-[#0A0A0A] border border-white/5 p-12 text-center text-[#A1A1AA]">
                  <RefreshCw className="animate-spin mx-auto mb-4" size={32} />
                  Loading...
                </div>
              ) : messages.length === 0 ? (
                <div className="bg-[#0A0A0A] border border-white/5 p-12 text-center text-[#A1A1AA]">
                  No messages yet
                </div>
              ) : (
                messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    data-testid={`message-card-${message.id}`}
                    className="bg-[#0A0A0A] border border-white/5 p-6 hover:border-[#F59E0B]/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-white font-medium text-lg">
                          {message.name}
                        </p>
                        <a
                          href={`mailto:${message.email}`}
                          className="text-[#F59E0B] text-sm hover:underline"
                        >
                          {message.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-[#A1A1AA] text-sm">
                          {formatDate(message.created_at)}
                        </p>
                        <motion.button
                          onClick={() => deleteMessage(message.id)}
                          data-testid={`delete-message-${message.id}`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-9 h-9 bg-[#171717] border border-white/10 flex items-center justify-center text-white hover:border-[#EF4444] hover:text-[#EF4444] transition-colors"
                          aria-label="Delete message"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </div>
                    <p className="text-[#A1A1AA] leading-relaxed">{message.message}</p>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Booking Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="bg-[#0A0A0A] border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-anton text-2xl">
              BOOKING DETAILS
            </DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 mt-4"
            >
              <div className="space-y-4">
                <div>
                  <p className="text-[#A1A1AA] text-sm uppercase tracking-wider mb-1">
                    Client
                  </p>
                  <p className="text-white text-lg font-medium">
                    {selectedBooking.client_name}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[#A1A1AA] text-sm uppercase tracking-wider mb-1">
                      Email
                    </p>
                    <a
                      href={`mailto:${selectedBooking.client_email}`}
                      className="flex items-center gap-2 text-[#F59E0B] hover:underline"
                    >
                      <Mail size={16} />
                      {selectedBooking.client_email}
                    </a>
                  </div>
                  <div>
                    <p className="text-[#A1A1AA] text-sm uppercase tracking-wider mb-1">
                      Phone
                    </p>
                    <a
                      href={`tel:${selectedBooking.client_phone}`}
                      className="flex items-center gap-2 text-[#F59E0B] hover:underline"
                    >
                      <Phone size={16} />
                      {selectedBooking.client_phone}
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[#A1A1AA] text-sm uppercase tracking-wider mb-1">
                      Service
                    </p>
                    <p className="text-white">
                      {serviceLabels[selectedBooking.service_type]}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#A1A1AA] text-sm uppercase tracking-wider mb-1">
                      Status
                    </p>
                    <span
                      className={`status-badge ${statusColors[selectedBooking.status]}`}
                    >
                      {selectedBooking.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[#A1A1AA] text-sm uppercase tracking-wider mb-1">
                      Date
                    </p>
                    <p className="text-white">
                      {formatDate(selectedBooking.booking_date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#A1A1AA] text-sm uppercase tracking-wider mb-1">
                      Time
                    </p>
                    <p className="text-white">{selectedBooking.booking_time}</p>
                  </div>
                </div>

                {selectedBooking.message && (
                  <div>
                    <p className="text-[#A1A1AA] text-sm uppercase tracking-wider mb-1">
                      Notes
                    </p>
                    <p className="text-white bg-[#171717] p-4 border border-white/10">
                      {selectedBooking.message}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/10">
                <a
                  href={`mailto:${selectedBooking.client_email}`}
                  className="flex-1"
                >
                  <Button className="w-full bg-[#F59E0B] text-black font-bold uppercase tracking-wider hover:bg-[#D97706]">
                    <Mail size={18} className="mr-2" />
                    Email Client
                  </Button>
                </a>
                <a href={`tel:${selectedBooking.client_phone}`} className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent border-white/20 text-white hover:border-[#F59E0B] hover:text-[#F59E0B]"
                  >
                    <Phone size={18} className="mr-2" />
                    Call Client
                  </Button>
                </a>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
