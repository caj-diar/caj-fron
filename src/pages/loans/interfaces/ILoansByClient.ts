import { IAccount } from '../../clients';

export interface ILoansByClient {
  customer:     Customer;
  totalSummary: TotalSummary;
  loans:        ILoanByClient[];
}

interface Customer {
  id:   string;
  name: string;
}

export interface ILoanByClient {
  id:                     string;
  loanNumber:             number;
  startDate:              string;
  amount:                 number;
  totalAmountWithInterest: number;
  profit:                 number;
  status:                 string;
  installments:           number;
  summary:                Summary;
  schedules:              Schedule[];
  account:                IAccount;
}

interface Schedule {
  id:                string;
  installmentNumber: number;
  paymentDate:       string;
  amount:            number;
  status:            Status;
  paidAmount:        number;
  remainingAmount:   number;
  isDelayed:         boolean;
  delayedDays:       number;
}

enum Status {
  PAGADO      = "PAGADO",
  PENDIENTE   = "PENDIENTE",
  PARCIAL     = "PARCIAL",
  CANCELADO   = "CANCELADO",
}

interface Summary {
  paidInstallments:       number;
  remainingInstallments:  number;
  delayedInstallments:    number;
  totalPaidAmount:        number;
  totalRemainingAmount:   number;
  totalDelayedAmount:     number;
  completionPercentage:   string;
}

interface TotalSummary {
  totalLoansAmount:          number;
  totalAmountWithInterest:   number;
  totalProfit:               number;
  totalPaidAmount:           number;
  totalRemainingAmount:      number;
  totalDelayedAmount:        number;
  totalPaidInstallments:     number;
  totalRemainingInstallments: number;
  totalDelayedInstallments:  number;
}