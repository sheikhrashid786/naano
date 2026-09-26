'use client';

import React from 'react';
import { Check, ShieldCheck, Clock } from 'lucide-react';

interface EscrowMilestoneStepperProps {
  status: string;
  paymentStatus?: string;
  compact?: boolean;
}

export default function EscrowMilestoneStepper({
  status,
  paymentStatus,
  compact = false,
}: EscrowMilestoneStepperProps) {
  // Map CollabStatus to numeric 1-5 step
  let currentStep = 1;

  switch (status) {
    case 'INVITED':
    case 'APPLIED':
      currentStep = 1;
      break;
    case 'ACCEPTED':
    case 'IN_PROGRESS':
      currentStep = 2;
      break;
    case 'CONTENT_SUBMITTED':
      currentStep = 3;
      break;
    case 'APPROVED':
      currentStep = 4;
      break;
    case 'COMPLETED':
      currentStep = paymentStatus === 'PAID' ? 5 : 4;
      break;
    default:
      currentStep = 2;
  }

  const steps = [
    { number: 1, label: 'Brief Confirmed', desc: 'Scope agreed' },
    { number: 2, label: 'Escrow Secured', desc: 'Funds in vault' },
    { number: 3, label: 'Draft Review', desc: 'Copy approved' },
    { number: 4, label: 'Post Live', desc: 'Proof indexed' },
    { number: 5, label: 'Payout Released', desc: 'Funds disbursed' },
  ];

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 w-full">
        {steps.map((s) => {
          const isDone = s.number < currentStep || (s.number === currentStep && currentStep === 5);
          const isCurrent = s.number === currentStep && currentStep < 5;

          return (
            <div key={s.number} className="flex-1 flex flex-col gap-1">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isDone
                    ? 'bg-emerald-500'
                    : isCurrent
                    ? 'bg-indigo-600 animate-pulse'
                    : 'bg-slate-200'
                }`}
                title={`${s.label}: ${s.desc}`}
              />
              <span
                className={`text-[9px] font-bold truncate block ${
                  isDone
                    ? 'text-emerald-700'
                    : isCurrent
                    ? 'text-indigo-700 font-extrabold'
                    : 'text-slate-400'
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-slate-800">Naano Escrow & Milestones</span>
        </div>
        <span className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
          Stage {currentStep} of 5
        </span>
      </div>

      <div className="relative flex items-center justify-between w-full">
        {/* Connecting track line */}
        <div className="absolute left-4 right-4 top-4 h-0.5 bg-slate-200 -z-0" />
        <div
          className="absolute left-4 top-4 h-0.5 bg-emerald-500 transition-all duration-500 -z-0"
          style={{ width: `${Math.min(100, Math.max(0, (currentStep - 1) * 25))}%` }}
        />

        {steps.map((step) => {
          const isDone = step.number < currentStep || (step.number === currentStep && currentStep === 5);
          const isCurrent = step.number === currentStep && currentStep < 5;

          return (
            <div key={step.number} className="flex flex-col items-center relative z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                  isDone
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 ring-4 ring-white'
                    : isCurrent
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 ring-4 ring-indigo-100 animate-pulse'
                    : 'bg-white text-slate-400 border border-slate-300 ring-4 ring-slate-50'
                }`}
              >
                {isDone ? (
                  <Check className="w-4 h-4 stroke-[2.5]" />
                ) : isCurrent ? (
                  <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <span>{step.number}</span>
                )}
              </div>
              <span
                className={`text-[11px] font-bold mt-2 text-center whitespace-nowrap ${
                  isDone
                    ? 'text-slate-800'
                    : isCurrent
                    ? 'text-indigo-700'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
              <span className="text-[10px] text-slate-400 text-center hidden sm:block">
                {step.desc}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
