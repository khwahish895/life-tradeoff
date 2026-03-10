export interface Decision {
  name: string;
  salary: number; // 0-100 scale or actual value
  workingHours: number; // 0-100 scale (lower is better for balance)
  stressLevel: number; // 0-100 scale (lower is better)
  skillGrowth: number; // 0-100 scale
  workLifeBalance: number; // 0-100 scale
}

export type MetricKey = keyof Omit<Decision, 'name'>;

export const METRICS: { key: MetricKey; label: string; min: number; max: number; step: number }[] = [
  { key: 'salary', label: 'Salary', min: 0, max: 100, step: 1 },
  { key: 'workingHours', label: 'Working Hours', min: 0, max: 100, step: 1 },
  { key: 'stressLevel', label: 'Stress Level', min: 0, max: 100, step: 1 },
  { key: 'skillGrowth', label: 'Skill Growth', min: 0, max: 100, step: 1 },
  { key: 'workLifeBalance', label: 'Work-Life Balance', min: 0, max: 100, step: 1 },
];
