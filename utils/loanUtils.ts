import { Loan, Installment } from '../types';

export const generateSchedule = (amount: number, duration: number, startDate: string): Installment[] => {
  const monthlyPayment = amount / duration;
  const schedule: Installment[] = [];
  const start = new Date(startDate);

  for (let i = 0; i < duration; i++) {
    const dueDate = new Date(start);
    dueDate.setMonth(start.getMonth() + i + 1);
    schedule.push({
      id: `inst-${Date.now()}-${i}`,
      dueDate: dueDate.toISOString().split('T')[0],
      amount: parseFloat(monthlyPayment.toFixed(2)),
      status: 'Pending',
    });
  }
  return schedule;
};
