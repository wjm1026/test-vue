export const routePaths = {
  login: '/login',
  forgetPassword: '/forget-password',
  resetPassword: '/reset-password',
  customers: {
    root: '/customers',
    detail: '/customers/:id',
  },
  comments: {
    root: '/comments',
    detail: '/comments/:id',
  },
  requests: '/requests',
  accounts: {
    root: '/accounts',
    detail: '/accounts/:id',
    create: '/accounts/create/:id?',
  },
  products: {
    root: '/products',
    detail: '/products/:id',
    registration: '/products/registration/:id?',
  },
  projects: {
    root: '/',
    detail: '/projects/:id',
    create: '/projects/create/:id?',
  },
  reports: {
    root: '/reports',
    detail: '/reports/:id',
  },
  external: {
    support: '/external/support',
  },
}
