import { User } from '../../auth';
import { IAccount, IClient } from '../../clients';


export interface ILoan {
  id:                string;
  number:            number;
  creationDate:      string;
  isActive:          boolean;
  startDate:         Date;
  dueDays:           string;
  amount:            number;
  interest:          number;
  installments:      number;
  installmentAmount: number;
  status:            string;
  paymentFrequency:  string;
  createdBy:         User;
  customer:          IClient;
  account:           IAccount;
}

export interface IPaymentScheduleEditBody {
  amount:      number;
  paymentDate: string;
}


export interface IPaymentScheduleEditResponse {
  id:             string;
  creationDate:   string;
  isActive:       boolean;
  isDelayed:      boolean;
  isPaid:         string;
  paymentDate:    string;
  partialPayment: number;
  paymentAmount:  number;
  createdBy:      User;
  loan:           ILoan;
}

