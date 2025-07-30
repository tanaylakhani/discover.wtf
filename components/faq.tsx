"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Is Tale A Replacement For Therapy?",
    answer:
      "No. Tale Is A Support Tool — Not A Substitute For Professional Mental Health Care. It Helps You Reflect, De-Stress, And Build Healthier Habits, But It Doesn't Diagnose Or Treat Mental Health Conditions.",
  },
  {
    question: "How Does The AI Understand My Mood?",
    answer:
      "Our AI analyzes patterns in your responses, activities, and interactions to understand your emotional state and provide personalized recommendations.",
  },
  {
    question: "Is It Really Free For 14 Days?",
    answer:
      "Yes, you get full access to all features for 14 days with no credit card required. After the trial, you can choose to continue with a subscription.",
  },
  {
    question: "Can I Use Tale Without Internet?",
    answer:
      "Some basic features work offline, but most AI-powered features require an internet connection to provide real-time insights and recommendations.",
  },
  {
    question: "Will My Data Be Private?",
    answer:
      "Absolutely. Your data is encrypted and stored securely. We never share your personal information with third parties and you have full control over your data.",
  },
  {
    question: "What Kind of Activities Does Tale Recommend?",
    answer:
      "Tale recommends personalized activities based on your mood and goals, including mindfulness exercises, journaling prompts, breathing techniques, and wellness challenges.",
  },
];

export default function Component() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="max-w-5xl mx-auto md:mt-[100px] px-4 py-16">
      <div className="grid grid-cols-1  gap-12 items-center">
        {/* Title Section */}
        <div className="flex items-center justify-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium md:font-semibold text-black text-center tracking-tighter font-inter leading-tight">
            Frequently Asked
            <br />
            <span className="bg-gradient-to-t bg-clip-text text-transparent from-orange-500 via-orange-600 to-orange-400">
              Questions?
            </span>
          </h2>
        </div>

        {/* FAQ Items */}

        <div className="space-y-4 font-inter">
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              className={cn(
                "bg-neutral-100 border-neutral-200 border  overflow-hidden transition-all duration-200 rounded-3xl"
              )}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-2 py-2 text-left flex items-center justify-between transition-colors duration-200"
              >
                <span className="text-lg leading-tight tracking-tight font-medium py-2 rounded-full w-full bg-white px-6  text-gray-900 ">
                  {faq.question}
                </span>
                <div className="flex-shrink-0 bg-white rounded-full p-2 transition-transform duration-200 ml-4">
                  {openIndex === index ? (
                    <X className="w-6 h-6 text-neutral-600" />
                  ) : (
                    <Plus className="w-6 h-6 text-neutral-600" />
                  )}
                </div>
              </button>

              {openIndex === index && (
                <div className="px-6 pb-6">
                  <div className="pt-2 border-t border-neutral-200">
                    <p className="text-neutral-600 leading-relaxed mt-3">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
