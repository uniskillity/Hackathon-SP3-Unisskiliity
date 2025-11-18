import { Client, Loan } from '../types';
import { generateSchedule } from './loanUtils';

export const getInitialData = () => {
  const clients: Client[] = [
    { id: 'cli-1', name: 'Ahmed Khan', cnic: '12345-6789012-3', phone: '0300-1234567', address: '123 Gulberg, Lahore', riskScore: 'Low', joinDate: '2023-01-15', income: 80000, occupation: 'Shop Owner', householdSize: 4, documents: [{fileName: 'cnic.jpg', fileType: 'image/jpeg', uploadDate: '2023-01-15'}] },
    { id: 'cli-2', name: 'Fatima Ali', cnic: '23456-7890123-4', phone: '0321-7654321', address: '456 DHA, Karachi', riskScore: 'Medium', joinDate: '2023-02-20', income: 45000, occupation: 'Tailor', householdSize: 6 },
    { id: 'cli-3', name: 'Bilal Chaudhry', cnic: '34567-8901234-5', phone: '0333-1122334', address: '789 F-8, Islamabad', riskScore: 'High', joinDate: '2023-03-10', income: 30000, occupation: 'Laborer', householdSize: 8 },
    { id: 'cli-4', name: 'Sana Iqbal', cnic: '45678-9012345-6', phone: '0345-6789012', address: '101 Johar Town, Lahore', riskScore: 'Low', joinDate: '2023-04-05', income: 120000, occupation: 'Software Engineer', householdSize: 2 }
  ];

  const loans: Loan[] = [
    { 
      id: 'loan-1', 
      clientId: 'cli-1', 
      amount: 50000, 
      type: 'Business', 
      durationMonths: 12, 
      startDate: '2023-08-01', 
      status: 'Active',
      schedule: generateSchedule(50000, 12, '2023-08-01'),
      interestRate: 15,
      assignedOfficer: 'Ali Raza'
    },
    { 
      id: 'loan-2', 
      clientId: 'cli-2', 
      amount: 25000, 
      type: 'Personal', 
      durationMonths: 6, 
      startDate: '2024-01-01', 
      status: 'Active',
      schedule: generateSchedule(25000, 6, '2024-01-01'),
      interestRate: 20,
      assignedOfficer: 'Fatima Jilani'
    },
     { 
      id: 'loan-3', 
      clientId: 'cli-1', 
      amount: 15000, 
      type: 'Emergency', 
      durationMonths: 3, 
      startDate: '2023-05-10', 
      status: 'Completed',
      schedule: generateSchedule(15000, 3, '2023-05-10').map(s => ({...s, status: 'Paid', paidAmount: s.amount})),
      interestRate: 18,
      assignedOfficer: 'Ali Raza'
    },
    { 
      id: 'loan-4', 
      clientId: 'cli-3', 
      amount: 75000, 
      type: 'Agriculture', 
      durationMonths: 12, 
      startDate: '2023-06-15', 
      status: 'Defaulted',
      schedule: generateSchedule(75000, 12, '2023-06-15'),
      interestRate: 25,
      assignedOfficer: 'Fatima Jilani'
    },
    {
      id: 'loan-5',
      clientId: 'cli-4',
      amount: 200000,
      type: 'Business',
      durationMonths: 24,
      startDate: '2024-03-10',
      status: 'Active',
      schedule: generateSchedule(200000, 24, '2024-03-10'),
      interestRate: 12,
      assignedOfficer: 'Ali Raza'
    }
  ];

  // Make some payments for demo purposes
  if(loans[0]) {
      loans[0].schedule[0] = {...loans[0].schedule[0], status: 'Paid', paidAmount: loans[0].schedule[0].amount, paymentDate: '2023-09-01' };
      loans[0].schedule[1] = {...loans[0].schedule[1], status: 'Paid', paidAmount: loans[0].schedule[1].amount, paymentDate: '2023-10-01' };
  }
  if(loans[1]) {
    loans[1].schedule[0] = {...loans[1].schedule[0], status: 'Overdue'};
    loans[1].schedule[1] = {...loans[1].schedule[1], status: 'Partially Paid', paidAmount: 500, paymentDate: '2024-03-05'};
  }
  if(loans[3]) { // Defaulted loan
    loans[3].schedule[0].status = 'Overdue';
    loans[3].schedule[1].status = 'Overdue';
    loans[3].schedule[2].status = 'Overdue';
  }


  return { clients, loans };
};