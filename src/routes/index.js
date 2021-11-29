import { lazy } from 'react';

const Dashboard = lazy(() => import('../features/dashboard/index'));

export const Routes = [
  {
    name: 'dashboard',
    url: '/dashboard',
    component: Dashboard
  }
]
