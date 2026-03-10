import React from 'react';
import { Decision, METRICS, MetricKey } from '../types';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DecisionCardProps {
  decision: Decision;
  onChange: (updates: Partial<Decision>) => void;
  color: 'blue' | 'purple';
  title: string;
}

export default function DecisionCard({ decision, onChange, color, title }: DecisionCardProps) {
  const accentColor = color === 'blue' ? 'border-cyan-500/50 shadow-cyan-500/20' : 'border-purple-500/50 shadow-purple-500/20';
  const glowColor = color === 'blue' ? 'bg-cyan-500' : 'bg-purple-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative p-6 rounded-2xl border bg-white/5 backdrop-blur-xl transition-all duration-300",
        accentColor,
        "hover:bg-white/10"
      )}
    >
      <div className="mb-6">
        <input
          type="text"
          value={decision.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className="w-full bg-transparent text-2xl font-bold text-white outline-none placeholder:text-white/20"
          placeholder={title}
        />
        <div className={cn("h-1 w-12 mt-2 rounded-full", glowColor)} />
      </div>

      <div className="space-y-6">
        {METRICS.map((metric) => (
          <div key={metric.key} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">{metric.label}</span>
              <span className="text-white font-mono">{decision[metric.key]}</span>
            </div>
            <div className="relative group">
              <input
                type="range"
                min={metric.min}
                max={metric.max}
                step={metric.step}
                value={decision[metric.key]}
                onChange={(e) => onChange({ [metric.key]: Number(e.target.value) })}
                className={cn(
                  "w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-transparent",
                  "group-hover:bg-white/20 transition-colors"
                )}
              />
              <div 
                className={cn("absolute top-0 left-0 h-1.5 rounded-lg pointer-events-none transition-all duration-300", glowColor)}
                style={{ width: `${(decision[metric.key] / metric.max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
