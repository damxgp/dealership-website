"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useTheme } from "@/components/theme-provider"
import { useAppStore, type ContactMessage, type Booking } from "@/lib/store"
import { CalendarIcon, Phone, Mail, MapPin, Clock } from "lucide-react"
import { format } from "date-fns"

export default function ContactPage() {
  const { theme } = useTheme()
  const { state, dispatch } = useAppStore()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [meetingData, setMeetingData] = useState({
    name: "",
    email: "",
    phone: "",
    date: undefined as Date | undefined,
    time: "",
    purpose: "",
  })
  const [isSubmittingContact, setIsSubmittingContact] = useState(false)
  const [isSubmittingMeeting, setIsSubmittingMeeting] = useState(false)

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingContact(true)

    try {
      const newMessage: ContactMessage = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        message: formData.message,
        status: "unread",
        createdAt: new Date().toISOString(),
      }

      dispatch({ type: "ADD_CONTACT_MESSAGE", payload: newMessage })

      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours.",
      })

      setFormData({ name: "", email: "", message: "" })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingContact(false)
    }
  }

  const handleMeetingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!meetingData.date) {
      toast({
        title: "Please select a date",
        description: "You need to select a meeting date.",
        variant: "destructive",
      })
      return
    }

    setIsSubmittingMeeting(true)

    try {
      const newBooking: Booking = {
        id: Date.now().toString(),
        type: "meeting",
        customerName: meetingData.name,
        customerEmail: meetingData.email,
        customerPhone: meetingData.phone,
        bookingDate: format(meetingData.date, "yyyy-MM-dd"),
        bookingTime: meetingData.time,
        purpose: meetingData.purpose,
        status: "pending",
        createdAt: new Date().toISOString(),
      }

      dispatch({ type: "ADD_BOOKING", payload: newBooking })

      toast({
        title: "Meeting Scheduled!",
        description: "We'll send you a confirmation email shortly.",
      })

      setMeetingData({
        name: "",
        email: "",
        phone: "",
        date: undefined,
        time: "",
        purpose: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule meeting. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingMeeting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1
        className={`text-4xl font-bold text-center mb-8 ${
          theme === "classic" ? "text-amber-900" : theme === "bold" ? "text-purple-900" : "text-foreground"
        }`}
      >
        Contact Us
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Contact Form */}
        <Card className={theme === "classic" ? "border-amber-200" : theme === "bold" ? "border-purple-200" : ""}>
          <CardHeader>
            <CardTitle
              className={
                theme === "classic" ? "text-amber-900" : theme === "bold" ? "text-purple-900" : "text-foreground"
              }
            >
              Send us a Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <Input
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Textarea
                placeholder="Your Message"
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
              <Button
                type="submit"
                disabled={isSubmittingContact}
                className={`w-full ${
                  theme === "bold"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    : ""
                }`}
              >
                {isSubmittingContact ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Meeting Booking */}
        <Card className={theme === "classic" ? "border-amber-200" : theme === "bold" ? "border-purple-200" : ""}>
          <CardHeader>
            <CardTitle
              className={
                theme === "classic" ? "text-amber-900" : theme === "bold" ? "text-purple-900" : "text-foreground"
              }
            >
              Schedule a Meeting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleMeetingSubmit} className="space-y-4">
              <Input
                placeholder="Your Name"
                value={meetingData.name}
                onChange={(e) => setMeetingData({ ...meetingData, name: e.target.value })}
                required
              />
              <Input
                type="email"
                placeholder="Your Email"
                value={meetingData.email}
                onChange={(e) => setMeetingData({ ...meetingData, email: e.target.value })}
                required
              />
              <Input
                type="tel"
                placeholder="Phone Number"
                value={meetingData.phone}
                onChange={(e) => setMeetingData({ ...meetingData, phone: e.target.value })}
                required
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {meetingData.date ? format(meetingData.date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={meetingData.date}
                    onSelect={(date) => setMeetingData({ ...meetingData, date })}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Select
                value={meetingData.time}
                onValueChange={(value) => setMeetingData({ ...meetingData, time: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9:00">9:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="14:00">2:00 PM</SelectItem>
                  <SelectItem value="15:00">3:00 PM</SelectItem>
                  <SelectItem value="16:00">4:00 PM</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={meetingData.purpose}
                onValueChange={(value) => setMeetingData({ ...meetingData, purpose: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Meeting purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purchase">Vehicle Purchase</SelectItem>
                  <SelectItem value="rental">Car Rental</SelectItem>
                  <SelectItem value="service">Service Inquiry</SelectItem>
                  <SelectItem value="financing">Financing Options</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="submit"
                disabled={isSubmittingMeeting}
                className={`w-full ${
                  theme === "bold"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    : ""
                }`}
              >
                {isSubmittingMeeting ? "Scheduling..." : "Schedule Meeting"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card
          className={`text-center ${
            theme === "classic" ? "border-amber-200" : theme === "bold" ? "border-purple-200" : ""
          }`}
        >
          <CardContent className="p-6">
            <Phone
              className={`w-8 h-8 mx-auto mb-2 ${
                theme === "classic" ? "text-amber-600" : theme === "bold" ? "text-purple-600" : "text-primary"
              }`}
            />
            <h3
              className={`font-semibold mb-1 ${
                theme === "classic" ? "text-amber-900" : theme === "bold" ? "text-purple-900" : "text-foreground"
              }`}
            >
              Phone
            </h3>
            <p className="text-muted-foreground">{state.settings.contactPhone}</p>
          </CardContent>
        </Card>

        <Card
          className={`text-center ${
            theme === "classic" ? "border-amber-200" : theme === "bold" ? "border-purple-200" : ""
          }`}
        >
          <CardContent className="p-6">
            <Mail
              className={`w-8 h-8 mx-auto mb-2 ${
                theme === "classic" ? "text-amber-600" : theme === "bold" ? "text-purple-600" : "text-primary"
              }`}
            />
            <h3
              className={`font-semibold mb-1 ${
                theme === "classic" ? "text-amber-900" : theme === "bold" ? "text-purple-900" : "text-foreground"
              }`}
            >
              Email
            </h3>
            <p className="text-muted-foreground">{state.settings.contactEmail}</p>
          </CardContent>
        </Card>

        <Card
          className={`text-center ${
            theme === "classic" ? "border-amber-200" : theme === "bold" ? "border-purple-200" : ""
          }`}
        >
          <CardContent className="p-6">
            <MapPin
              className={`w-8 h-8 mx-auto mb-2 ${
                theme === "classic" ? "text-amber-600" : theme === "bold" ? "text-purple-600" : "text-primary"
              }`}
            />
            <h3
              className={`font-semibold mb-1 ${
                theme === "classic" ? "text-amber-900" : theme === "bold" ? "text-purple-900" : "text-foreground"
              }`}
            >
              Address
            </h3>
            <p className="text-muted-foreground">{state.settings.address}</p>
          </CardContent>
        </Card>

        <Card
          className={`text-center ${
            theme === "classic" ? "border-amber-200" : theme === "bold" ? "border-purple-200" : ""
          }`}
        >
          <CardContent className="p-6">
            <Clock
              className={`w-8 h-8 mx-auto mb-2 ${
                theme === "classic" ? "text-amber-600" : theme === "bold" ? "text-purple-600" : "text-primary"
              }`}
            />
            <h3
              className={`font-semibold mb-1 ${
                theme === "classic" ? "text-amber-900" : theme === "bold" ? "text-purple-900" : "text-foreground"
              }`}
            >
              Hours
            </h3>
            <p className="text-muted-foreground text-sm">{state.settings.businessHours}</p>
          </CardContent>
        </Card>
      </div>

      {/* Map */}
      <Card className={theme === "classic" ? "border-amber-200" : theme === "bold" ? "border-purple-200" : ""}>
        <CardHeader>
          <CardTitle
            className={`text-center ${
              theme === "classic" ? "text-amber-900" : theme === "bold" ? "text-purple-900" : "text-foreground"
            }`}
          >
            Visit Our Showroom
          </CardTitle>
        </CardHeader>
        <CardContent>
<iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3969.162432606894!2d-55.1490053!3d5.8327122!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8d08354d821f5bb7%3A0x8d3face11dfd6f64!2sCombe%20Car%20Center%20%26%20Parts!5e0!3m2!1sen!2s!4v1750118468692!5m2!1sen!2s"
  width="100%"
  height="450"
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
/>

        </CardContent>
      </Card>
    </div>
  )
}
