import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', 
        component: () => import('../views/welcomeSection.vue'), 
        children: [ 
          { path: '/initial-startup', 
            name: 'initialStartup',
            component: () => import('../components/dialogs/newFilePrompt.vue') 
          },
          { path: '/startup', 
            name: 'startup',
            component: () => import('../components/dialogs/passwordInputPrompt.vue') 
          }
        ] 
      },
      { path: '/contacts', component: () => import('../views/contactsDisplay.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
];

export default routes;
