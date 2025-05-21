export interface ICollectionRouteResponse {
  customerId:    string;
  customerName:  string;
  loans:         { [key: string]: IRouteLoan };
  totalDueToday: number;
  totalDelayed:  number;
  totalDebt:     number;
}

export interface IRouteLoan {
  loanId:                string;
  loanNumber:            number;
  dueToday:              IRouteDelayed[];
  delayed:               IRouteDelayed[];
  totalDueToday:         number;
  totalDelayed:          number;
  totalInstallments:     number;
  paidInstallments:      number;
  remainingInstallments: number;
}

export interface IRouteDelayed {
  scheduleId:      string;
  paymentDate:     string;
  paymentAmount:   number;
  paidAmount:      number;
  remainingAmount: number;
  isPaid:          IRouteIsPaid;
  isDelayed:       boolean;
}

export enum IRouteIsPaid {
  Pagado    = "PAGADO",
  Pendiente = "PENDIENTE",
  Parcial   = "PARCIAL"
}
