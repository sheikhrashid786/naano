import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Sparkles, Target, FileText, Send, BarChart3 } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      num: '01',
      title: 'Find creators your buyers trust',
      desc: 'Set your ICP target audience, industry and country. Our matching engine ranks creators by true buyer fit score.',
      icon: Target,
      highlight: '94% Match Fit'
    },
    {
      num: '02',
      title: 'Build your campaign brief with AI',
      desc: 'Define your hook, key talking points, and call to action in minutes. Creators get clear deliverables and angles.',
      icon: FileText,
      highlight: 'AI Hook Suggestions'
    },
    {
      num: '03',
      title: 'Book at a fixed price per post',
      desc: 'No retainers or unexpected CPM spikes. Agree on deliverables upfront, review the draft, and only pay when live.',
      icon: Send,
      highlight: 'Zero Retainer Fee'
    },
    {
      num: '04',
      title: 'Track clicks, leads & attributed revenue',
      desc: 'Every post includes deduplicated bot-filtered tracking so you know exactly which creator drove your demo signups.',
      icon: BarChart3,
      highlight: 'Full Funnel Attribution'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 sm:py-32 bg-white border-b border-[#EBE9E5]/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#55575E] bg-[#F7F6F3] border border-[#EBE9E5] rounded-full py-1 px-3 mb-4">
            <span>One platform, from brief to results</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#17181C] leading-[1.1]">
            Run creator campaigns from one place<span className="text-blue-600">.</span>
          </h2>
          <p className="mt-4 text-lg text-[#55575E]">
            Find the right voices, launch faster, and connect every post to measurable business results.
          </p>
        </div>

        {/* 4 Journey Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-[#FAF9F6] border border-[#E8E6E2] rounded-2xl p-6 flex flex-col justify-between hover:border-blue-300 hover:shadow-lg transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-bold font-mono text-[#8390A2] bg-white border border-[#EBE9E5] px-2.5 py-1 rounded-lg">
                      STEP {step.num}
                    </span>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                      {step.highlight}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-white border border-[#EBE9E5] text-blue-600 flex items-center justify-center mb-4 shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-base font-bold text-[#17181C] leading-snug">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-[#55575E] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#EBE9E5]/60 flex items-center text-xs font-semibold text-[#17181C]">
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 text-blue-600" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
