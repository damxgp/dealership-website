"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "@/components/theme-provider"
import { Award, Users, Clock, Star } from "lucide-react"
import Image from "next/image"

const teamMembers = [
  {
    name: "John Smith",
    position: "General Manager",
    image: "/placeholder.svg?height=200&width=200",
    bio: "With over 15 years in the automotive industry, John leads our team with passion and expertise.",
  },
  {
    name: "Sarah Johnson",
    position: "Sales Director",
    image: "/placeholder.svg?height=200&width=200",
    bio: "Sarah has helped thousands of customers find their perfect vehicle with her personalized approach.",
  },
  {
    name: "Mike Davis",
    position: "Service Manager",
    image: "/placeholder.svg?height=200&width=200",
    bio: "Mike ensures every vehicle meets our high standards before reaching our customers.",
  },
]

const stats = [
  { icon: Award, label: "Years in Business", value: "5+" },
  { icon: Users, label: "Happy Customers", value: "300+" },
  { icon: Clock, label: "Cars Sold", value: "300+" },
  { icon: Star, label: "Customer Rating", value: "4.9/5" },
]

export default function AboutPage() {
  const { theme } = useTheme()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1
        className={`text-4xl font-bold text-center mb-8 ${
          theme === "classic" ? "text-amber-900" : theme === "bold" ? "text-purple-900" : "text-foreground"
        }`}
      >
        About Combe's Car Center
      </h1>

      {/* Company Story */}
      <div className="max-w-4xl mx-auto mb-12">
        <Card
          className={
            theme === "classic"
              ? "border-amber-200 bg-amber-50/50"
              : theme === "bold"
                ? "border-purple-200 bg-gradient-to-r from-purple-50/50 to-pink-50/50"
                : ""
          }
        >
          <CardContent className="p-8">
            <h2
              className={`text-2xl font-bold mb-4 ${
                theme === "classic" ? "text-amber-900" : theme === "bold" ? "text-purple-900" : "text-foreground"
              }`}
            >
              Our Story
            </h2>
            <p className="text-muted-foreground mb-4">
              Founded in 2016, Combe's Car Center has been serving the community for nearly three decades. What
              started as a small family business has grown into one of the region's most trusted automotive dealers.
            </p>
            <p className="text-muted-foreground mb-4">
              Our mission is simple: to provide exceptional vehicles and outstanding customer service. We believe that
              buying or renting a car should be an enjoyable experience, not a stressful one.
            </p>
            <p className="text-muted-foreground">
              Today, we're proud to offer a comprehensive selection of quality vehicles, competitive pricing, and the
              personalized service that has made us a cornerstone of the community.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className={`text-center ${
              theme === "classic" ? "border-amber-200" : theme === "bold" ? "border-purple-200" : ""
            }`}
          >
            <CardContent className="p-6">
              <stat.icon
                className={`w-8 h-8 mx-auto mb-2 ${
                  theme === "classic" ? "text-amber-600" : theme === "bold" ? "text-purple-600" : "text-primary"
                }`}
              />
              <div
                className={`text-2xl font-bold mb-1 ${
                  theme === "classic" ? "text-amber-900" : theme === "bold" ? "text-purple-900" : "text-foreground"
                }`}
              >
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Team Section */}
      <div className="mb-12">
        <h2
          className={`text-3xl font-bold text-center mb-8 ${
            theme === "classic" ? "text-amber-900" : theme === "bold" ? "text-purple-900" : "text-foreground"
          }`}
        >
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <Card
              key={index}
              className={`text-center ${
                theme === "classic" ? "border-amber-200" : theme === "bold" ? "border-purple-200" : ""
              }`}
            >
              <CardHeader>
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  width={200}
                  height={200}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <CardTitle
                  className={
                    theme === "classic" ? "text-amber-900" : theme === "bold" ? "text-purple-900" : "text-foreground"
                  }
                >
                  {member.name}
                </CardTitle>
                <p
                  className={`text-sm ${
                    theme === "classic" ? "text-amber-600" : theme === "bold" ? "text-purple-600" : "text-primary"
                  }`}
                >
                  {member.position}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Values */}
      <Card
        className={
          theme === "classic"
            ? "border-amber-200 bg-amber-50/50"
            : theme === "bold"
              ? "border-purple-200 bg-gradient-to-r from-purple-50/50 to-pink-50/50"
              : ""
        }
      >
        <CardHeader>
          <CardTitle
            className={`text-center ${
              theme === "classic" ? "text-amber-900" : theme === "bold" ? "text-purple-900" : "text-foreground"
            }`}
          >
            Our Values
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3
                className={`font-semibold mb-2 ${
                  theme === "classic" ? "text-amber-900" : theme === "bold" ? "text-purple-900" : "text-foreground"
                }`}
              >
                Integrity
              </h3>
              <p className="text-muted-foreground">We believe in honest, transparent dealings with every customer.</p>
            </div>
            <div className="text-center">
              <h3
                className={`font-semibold mb-2 ${
                  theme === "classic" ? "text-amber-900" : theme === "bold" ? "text-purple-900" : "text-foreground"
                }`}
              >
                Quality
              </h3>
              <p className="text-muted-foreground">
                Every vehicle in our inventory meets our rigorous quality standards.
              </p>
            </div>
            <div className="text-center">
              <h3
                className={`font-semibold mb-2 ${
                  theme === "classic" ? "text-amber-900" : theme === "bold" ? "text-purple-900" : "text-foreground"
                }`}
              >
                Service
              </h3>
              <p className="text-muted-foreground">Your satisfaction is our top priority, from purchase to service.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
