import { User } from '../../../auth';

export interface ILocality {
  id:           string;
  creationDate: string;
  isActive:     boolean;
  name:         string;
  createdBy:    User;
}

