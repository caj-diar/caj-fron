import { User } from '../../auth';
import { ILocality } from '../../control-panel';

export interface IClient {
  number:        number;
  creationDate:  string;
  isActive:      boolean;
  name:          string;
  lastName:      string;
  description:   string;
  phoneNumbers:  string[];
  addresses:     string[];
  dni:           string;
  documentation: any[];
  createdBy:     User;
  locality:      ILocality;
  zone:          null;
  id:            string;
}
