"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "@/components/theme-provider"
import { useAppStore } from "@/lib/store"

export default function FAQPage() {
  const { theme } = useTheme()
  const { state } = useAppStore()

  const activeFaqs = state.faqs.filter((faq) => faq.active).sort((a, b) => a.displayOrder - b.displayOrder)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1
        className={`text-4xl font-bold text-center mb-8 ${
          theme === "classic" ? "text-amber-900" : theme === "bold" ? "text-purple-900" : "text-foreground"
        }`}
      >
        Frequently Asked Questions
      </h1>

      <div className="max-w-4xl mx-auto">
        {activeFaqs.length === 0 ? (
          <Card
            className={
              theme === "classic"
                ? "border-amber-200 bg-amber-50/50"
                : theme === "bold"
                  ? "border-purple-200 bg-gradient-to-r from-purple-50/50 to-pink-50/50"
                  : ""
            }
          >
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground text-lg">No FAQs available at the moment.</p>
            </CardContent>
          </Card>
        ) : (
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
                Common Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {activeFaqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger
                      className={`text-left ${
                        theme === "classic"
                          ? "hover:text-amber-600"
                          : theme === "bold"
                            ? "hover:text-purple-600"
                            : "hover:text-primary"
                      }`}
                    >
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 text-center">
          <Card className={theme === "classic" ? "border-amber-200" : theme === "bold" ? "border-purple-200" : ""}>
            <CardContent className="p-6">
              <h3
                className={`text-lg font-semibold mb-2 ${
                  theme === "classic" ? "text-amber-900" : theme === "bold" ? "text-purple-900" : "text-foreground"
                }`}
              >
                Still have questions?
              </h3>
              <p className="text-muted-foreground mb-4">
                Our friendly team is here to help. Contact us for personalized assistance.
              </p>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Phone:</strong> {state.settings.contactPhone}
                </p>
                <p className="text-sm">
                  <strong>Email:</strong> {state.settings.contactEmail}
                </p>
                <p className="text-sm">
                  <strong>Hours:</strong> {state.settings.businessHours}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
