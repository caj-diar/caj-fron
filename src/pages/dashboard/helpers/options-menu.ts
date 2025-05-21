import { Icons } from '../../../shared';

export const cardOptions = [
  { title: 'Clientes', Icon: Icons.IoPeopleOutline, route: '/clientes', type: 'clientes' as const },
  { title: 'Préstamos', Icon: Icons.IoCashOutline, route: '/prestamos', type: 'prestamos' as const },
  { title: 'Cobranza', Icon: Icons.IoCalendarOutline, route: '/cobranza', type: 'cobranza' as const },
  { title: 'Caja', Icon: Icons.IoCalculatorOutline, route: '/caja', type: 'caja' as const },
  // { title: 'Configuración', Icon: Icons.IoOptionsOutline, route: '/panel-de-control' },
];