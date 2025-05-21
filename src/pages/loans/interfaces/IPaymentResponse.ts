import { IAccount } from '../../clients';
import { ILoan } from './ILoan';
import { User } from '../../auth';


export interface IPayment {
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
  account?:       IAccount;
}


