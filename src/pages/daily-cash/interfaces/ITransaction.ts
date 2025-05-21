import { IAccount } from '../../clients';
import { IDayCash } from './IDayCash';
import { ITransactionCode } from './ITransactionCode';

export interface ITransaction {
  creationDate:    string;
  date:            string;
  description?:    string;
  amount:          number;
  dailyCash:       IDayCash;
  transactionCode: ITransactionCode;
  account:         IAccount;
  id:              string;
  isActive:        boolean;
}


