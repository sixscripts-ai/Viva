import { useState, useEffect } from "react";
import { X, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import axios from "axios";
import { format, addDays, isBefore, startOfDay } from "date-fns";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const services = [
  { value: "wedding", label: "Wedding Films" },
  { value: "event", label: "Event Coverage" },
  { value: "commercial", label: "Commercial Videos" },
  { value: "social_media", label: "Social Media Content" },
  { value: "real_estate", label: "Real Estate Tours" },
];

export default function BookingModal({ isOpen, onClose, preSelectedService }) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  const [formData, setFormData] = useState({
    service_type: preSelectedService || "",
    booking_date: "",
    booking_time: "",
    client_name: "",
    client_email: "",
    client_phone: "",
    message: "",
  });

  useEffect(() => {
    if (preSelectedService) {
      setFormData((prev) => ({ ...prev, service_type: preSelectedService }));
    }
  }, [preSelectedService]);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableTimes(format(selectedDate, "yyyy-MM-dd"));
    }
  }, [selectedDate]);

  const fetchAvailableTimes = async (date) => {
    setIsLoadingTimes(true);
    try {
      const response = await axios.get(`${API}/available-times?date=${date}`);
      setAvailableTimes(response.data.available_times);
    } catch (error) {
      console.error("Error fetching times:", error);
      setAvailableTimes([
        "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
        "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
      ]);
    } finally {
      setIsLoadingTimes(false);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setFormData((prev) => ({
      ...prev,
      booking_date: format(date, "yyyy-MM-dd"),
      booking_time: "",
    }));
  };

  const handleTimeSelect = (time) => {
    setFormData((prev) => ({ ...prev, booking_time: time }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await axios.post(`${API}/bookings`, formData);
      setBookingComplete(true);
      toast.success("Booking submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetModal = () => {
    setStep(1);
    setSelectedDate(null);
    setBookingComplete(false);
    setFormData({
      service_type: "",
      booking_date: "",
      booking_time: "",
      client_name: "",
      client_email: "",
      client_phone: "",
      message: "",
    });
    onClose();
  };

  const canProceedStep1 = formData.service_type;
  const canProceedStep2 = formData.booking_date && formData.booking_time;
  const canProceedStep3 =
    formData.client_name && formData.client_email && formData.client_phone;

  // Disable past dates
  const disabledDays = { before: startOfDay(addDays(new Date(), 1)) };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      data-testid="booking-modal"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={resetModal}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0A0A0A] border border-white/10">
        {/* Close button */}
        <button
          onClick={resetModal}
          data-testid="modal-close-btn"
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-[#A1A1AA] hover:text-white transition-colors z-10"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="p-6 md:p-8 border-b border-white/10">
          <p className="font-bebas text-[#F59E0B] text-sm tracking-[0.3em] mb-2">
            {bookingComplete ? "CONFIRMED" : `STEP ${step} OF 3`}
          </p>
          <h2 className="font-anton text-3xl md:text-4xl text-white">
            {bookingComplete
              ? "BOOKING COMPLETE"
              : step === 1
              ? "SELECT SERVICE"
              : step === 2
              ? "CHOOSE DATE & TIME"
              : "YOUR DETAILS"}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {bookingComplete ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-[#10B981]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={40} className="text-[#10B981]" />
              </div>
              <h3 className="font-anton text-2xl text-white mb-4">
                THANK YOU, {formData.client_name.toUpperCase()}!
              </h3>
              <p className="text-[#A1A1AA] mb-2">
                Your booking for{" "}
                <span className="text-white">
                  {services.find((s) => s.value === formData.service_type)?.label}
                </span>{" "}
                has been submitted.
              </p>
              <p className="text-[#A1A1AA] mb-8">
                Date: <span className="text-[#F59E0B]">{formData.booking_date}</span> at{" "}
                <span className="text-[#F59E0B]">{formData.booking_time}</span>
              </p>
              <p className="text-[#A1A1AA] text-sm mb-6">
                We'll contact you within 24 hours to confirm your booking.
              </p>
              <Button
                onClick={resetModal}
                data-testid="modal-done-btn"
                className="bg-[#F59E0B] text-black font-bold uppercase tracking-wider hover:bg-[#D97706] px-8 py-6"
              >
                Done
              </Button>
            </div>
          ) : (
            <>
              {/* Step 1: Select Service */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-[#A1A1AA] text-sm uppercase tracking-wider mb-3">
                      What can we help you with?
                    </label>
                    <Select
                      value={formData.service_type}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, service_type: value }))
                      }
                    >
                      <SelectTrigger
                        data-testid="service-select"
                        className="h-14 bg-[#171717] border-white/10 text-white"
                      >
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#171717] border-white/10">
                        {services.map((service) => (
                          <SelectItem
                            key={service.value}
                            value={service.value}
                            data-testid={`service-option-${service.value}`}
                            className="text-white focus:bg-[#F59E0B] focus:text-black"
                          >
                            {service.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 2: Date & Time */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-[#A1A1AA] text-sm uppercase tracking-wider mb-3">
                      Select a Date
                    </label>
                    <div className="flex justify-center bg-[#171717] p-4 border border-white/10">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        disabled={disabledDays}
                        data-testid="booking-calendar"
                        className="text-white"
                      />
                    </div>
                  </div>

                  {selectedDate && (
                    <div>
                      <label className="block text-[#A1A1AA] text-sm uppercase tracking-wider mb-3">
                        Available Times for {format(selectedDate, "MMMM d, yyyy")}
                      </label>
                      {isLoadingTimes ? (
                        <p className="text-[#A1A1AA]">Loading times...</p>
                      ) : (
                        <div className="grid grid-cols-3 gap-3">
                          {availableTimes.map((time) => (
                            <button
                              key={time}
                              onClick={() => handleTimeSelect(time)}
                              data-testid={`time-slot-${time.replace(/[: ]/g, "-")}`}
                              className={`p-3 border text-center transition-all duration-300 ${
                                formData.booking_time === time
                                  ? "bg-[#F59E0B] border-[#F59E0B] text-black"
                                  : "bg-[#171717] border-white/10 text-white hover:border-[#F59E0B]"
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Contact Info */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-[#A1A1AA] text-sm uppercase tracking-wider mb-2">
                      Your Name
                    </label>
                    <Input
                      type="text"
                      value={formData.client_name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          client_name: e.target.value,
                        }))
                      }
                      data-testid="booking-name-input"
                      className="h-12 bg-[#171717] border-white/10 text-white"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[#A1A1AA] text-sm uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={formData.client_email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          client_email: e.target.value,
                        }))
                      }
                      data-testid="booking-email-input"
                      className="h-12 bg-[#171717] border-white/10 text-white"
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[#A1A1AA] text-sm uppercase tracking-wider mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={formData.client_phone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          client_phone: e.target.value,
                        }))
                      }
                      data-testid="booking-phone-input"
                      className="h-12 bg-[#171717] border-white/10 text-white"
                      placeholder="(555) 123-4567"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[#A1A1AA] text-sm uppercase tracking-wider mb-2">
                      Additional Notes (Optional)
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          message: e.target.value,
                        }))
                      }
                      data-testid="booking-message-input"
                      className="min-h-[100px] bg-[#171717] border-white/10 text-white resize-none"
                      placeholder="Tell us more about your project..."
                    />
                  </div>

                  {/* Summary */}
                  <div className="bg-[#171717] border border-white/10 p-4">
                    <p className="text-[#A1A1AA] text-sm uppercase tracking-wider mb-3">
                      Booking Summary
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#A1A1AA]">Service:</span>
                        <span className="text-white">
                          {services.find((s) => s.value === formData.service_type)?.label}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#A1A1AA]">Date:</span>
                        <span className="text-white">{formData.booking_date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#A1A1AA]">Time:</span>
                        <span className="text-white">{formData.booking_time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                {step > 1 ? (
                  <Button
                    onClick={() => setStep(step - 1)}
                    data-testid="modal-back-btn"
                    variant="outline"
                    className="bg-transparent border-white/20 text-white hover:border-[#F59E0B] hover:text-[#F59E0B]"
                  >
                    <ChevronLeft size={18} className="mr-1" />
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <Button
                    onClick={() => setStep(step + 1)}
                    disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
                    data-testid="modal-next-btn"
                    className="bg-[#F59E0B] text-black font-bold uppercase tracking-wider hover:bg-[#D97706] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight size={18} className="ml-1" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!canProceedStep3 || isSubmitting}
                    data-testid="modal-submit-btn"
                    className="bg-[#F59E0B] text-black font-bold uppercase tracking-wider hover:bg-[#D97706] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "Confirm Booking"}
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
