"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Calendar, Send, Loader2, CheckCircle2, User, Mail, Phone, 
  Sparkles, Clock, Home, MapPin, MessageSquare, Shield, 
  CheckCircle, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const services = [
  { value: "deep-cleaning", label: "Deep Cleaning", icon: Sparkles },
  { value: "commercial-cleaning", label: "Commercial Cleaning", icon: Home },
  { value: "residential-cleaning", label: "Residential Cleaning", icon: Home },
  { value: "upholstery-cleaning", label: "Upholstery Cleaning", icon: Sparkles },
  { value: "fumigation", label: "Fumigation", icon: Shield },
  { value: "post-construction", label: "Post-Construction", icon: Home },
];

const timeSlots = [
  { value: "08:00", label: "8:00 AM" },
  { value: "09:00", label: "9:00 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "13:00", label: "1:00 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "16:00", label: "4:00 PM" },
  { value: "17:00", label: "5:00 PM" },
];

const bookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  service: z.string().min(1, "Please select a service"),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  address: z.string().min(10, "Please enter your full address"),
  rooms: z.coerce.number().min(1, "At least 1 room is required"),
  message: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function BookingForm() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service: "",
      date: "",
      time: "",
      address: "",
      rooms: 1,
      message: "",
    },
  });

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setIsSuccess(true);
        form.reset();
        toast({
          title: "Booking Submitted!",
          description: "We'll contact you shortly to confirm your booking.",
        });
      } else {
        throw new Error(result.error || "Failed to submit booking");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <section id="booking" className="py-24 section-booking relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 bg-sokleen-light-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-sokleen-yellow/10 rounded-full blur-3xl" />
      </div>

      <div ref={ref} className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-sokleen-dark-blue/10 rounded-full px-4 py-2 mb-6">
            <Calendar className="w-4 h-4 text-sokleen-dark-blue" />
            <span className="text-sm font-semibold text-sokleen-dark-blue">
              Book Your Service
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Schedule Your <span className="text-sokleen-dark-blue">Cleaning</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fill out the form below and we&apos;ll get back to you within 24 hours to confirm your booking.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {isSuccess ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white border border-green-200 rounded-3xl p-8 lg:p-12 text-center shadow-xl max-w-2xl mx-auto"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Booking Submitted!</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Thank you for choosing SOKLEEN NIGERIA LTD. We&apos;ll contact you shortly to confirm your booking.
              </p>
              <Button
                onClick={() => setIsSuccess(false)}
                className="bg-sokleen-dark-blue hover:bg-sokleen-deep-blue text-white px-8"
              >
                Book Another Service
              </Button>
            </motion.div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="bg-white rounded-3xl p-6 lg:p-10 shadow-xl border border-gray-100"
              >
                {/* Trust Indicators */}
                <div className="flex flex-wrap justify-center gap-6 mb-10 pb-8 border-b border-gray-100">
                  {[
                    { icon: Shield, text: "Secure Booking" },
                    { icon: CheckCircle, text: "Instant Confirmation" },
                    { icon: Clock, text: "24hr Response" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-600">
                      <item.icon className="w-4 h-4 text-sokleen-dark-blue" />
                      <span className="text-sm font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>

                {/* Personal Information Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-sokleen-dark-blue" />
                    Personal Information
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Full Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <Input
                                placeholder="John Doe"
                                {...field}
                                className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-sokleen-dark-blue focus:ring-sokleen-dark-blue/20 rounded-xl"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Email Address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <Input
                                type="email"
                                placeholder="john@example.com"
                                {...field}
                                className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-sokleen-dark-blue focus:ring-sokleen-dark-blue/20 rounded-xl"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Phone Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <Input
                                placeholder="+234 813 245 1474"
                                {...field}
                                className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-sokleen-dark-blue focus:ring-sokleen-dark-blue/20 rounded-xl"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Service Details Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-sokleen-dark-blue" />
                    Service Details
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="service"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Service Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 bg-gray-50 border-gray-200 focus:ring-sokleen-dark-blue/20 rounded-xl">
                                <SelectValue placeholder="Select service" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl">
                              {services.map((service) => (
                                <SelectItem key={service.value} value={service.value} className="rounded-lg">
                                  {service.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Preferred Date</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <Input
                                type="date"
                                min={today}
                                {...field}
                                className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-sokleen-dark-blue focus:ring-sokleen-dark-blue/20 rounded-xl"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Preferred Time</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 bg-gray-50 border-gray-200 focus:ring-sokleen-dark-blue/20 rounded-xl">
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl">
                              {timeSlots.map((slot) => (
                                <SelectItem key={slot.value} value={slot.value} className="rounded-lg">
                                  {slot.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Number of Rooms</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <Input
                                type="number"
                                min={1}
                                max={20}
                                {...field}
                                className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-sokleen-dark-blue focus:ring-sokleen-dark-blue/20 rounded-xl"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Address spanning 2 columns */}
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel className="text-gray-700 font-medium">Full Address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <Input
                                placeholder="House 16 Pamdale Estate, Ilesa, Osun State"
                                {...field}
                                className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-sokleen-dark-blue focus:ring-sokleen-dark-blue/20 rounded-xl"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Special Instructions Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-sokleen-dark-blue" />
                    Special Instructions
                    <span className="text-sm font-normal text-gray-500">(Optional)</span>
                  </h3>
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Any specific requirements or instructions for our cleaning team..."
                            className="bg-gray-50 border-gray-200 focus:border-sokleen-dark-blue focus:ring-sokleen-dark-blue/20 rounded-xl resize-none min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit Section */}
                <div className="pt-6 border-t border-gray-100">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-sokleen-yellow hover:bg-sokleen-yellow/90 text-gray-900 font-bold py-7 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Submit Booking
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                  <p className="text-center text-sm text-gray-500 mt-4">
                    By submitting, you agree to our terms of service and privacy policy.
                  </p>
                </div>
              </form>
            </Form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
