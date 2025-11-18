import { Client, Loan } from '../types';

const generateSchedule = (amount: number, duration: number, startDate: string): Loan['schedule'] => {
  const monthlyPayment = amount / duration;
  const schedule: Loan['schedule'] = [];
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

export const getInitialData = () => {
  const clients: Client[] = [
    { id: 'cli-1', name: 'Ahmed Khan', cnic: '12345-6789012-3', phone: '0300-1234567', address: '123 Gulberg, Lahore', riskScore: 'Low', joinDate: '2023-01-15' },
    { id: 'cli-2', name: 'Fatima Ali', cnic: '23456-7890123-4', phone: '0321-7654321', address: '456 DHA, Karachi', riskScore: 'Medium', joinDate: '2023-02-20' },
    { id: 'cli-3', name: 'Bilal Chaudhry', cnic: '34567-8901234-5', phone: '0333-1122334', address: '789 F-8, Islamabad', riskScore: 'High', joinDate: '2023-03-10' },
  ];

  const loans: Loan[] = [
    { 
      id: 'loan-1', 
      clientId: 'cli-1', 
      amount: 50000, 
      type: 'Business', 
      durationMonths: 12, 
      startDate: '2023-02-01', 
      status: 'Active',
      schedule: generateSchedule(50000, 12, '2023-02-01')
    },
    { 
      id: 'loan-2', 
      clientId: 'cli-2', 
      amount: 25000, 
      type: 'Personal', 
      durationMonths: 6, 
      startDate: '2023-03-01', 
      status: 'Active',
      schedule: generateSchedule(25000, 6, '2023-03-01')
    },
     { 
      id: 'loan-3', 
      clientId: 'cli-1', 
      amount: 15000, 
      type: 'Emergency', 
      durationMonths: 3, 
      startDate: '2023-05-10', 
      status: 'Completed',
      schedule: generateSchedule(15000, 3, '2023-05-10').map(s => ({...s, status: 'Paid'}))
    },
  ];

  // Make some payments for demo purposes
  if(loans[0]) {
      loans[0].schedule[0].status = 'Paid';
      loans[0].schedule[1].status = 'Paid';
  }
  if(loans[1]) {
    loans[1].schedule[0].status = 'Overdue';
  }

  return { clients, loans };
};
