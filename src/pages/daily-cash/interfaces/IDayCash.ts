import { ITransaction } from './ITransaction';

export interface IDayCash {
  id:            string;
  creationDate:  string;
  isActive:      boolean;
  date:          string;
  isOpen:        boolean;
  transactions?: ITransaction[];
}

