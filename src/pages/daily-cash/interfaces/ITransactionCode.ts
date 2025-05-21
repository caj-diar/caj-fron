import { User } from '../../auth';

export interface ITransactionCode {
  id:           string;
  creationDate: string;
  isActive:     boolean;
  name:         string;
  type:         number;
  createdBy:    User;
}
