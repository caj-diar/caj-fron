import { User } from '../../auth';

export interface IAccount {
  id:           string;
  creationDate: string;
  isActive:     boolean;
  name:         string;
  description:  string;
  createdBy:    User;
}
