import Vue from 'vue'
import Router from 'vue-router'
import BotUI from '@/components/BotUi'
import ThankYou from "../components/ThankYou"
import Exited from "../components/Exited";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'BotUi',
      component: BotUI
    },
    {
      path: '/agradecemos-seu-contato',
      name: 'ThankYou',
      component: ThankYou
    },
    {
      path: '/exited',
      name: 'Exited',
      component: Exited
    }
  ]
})
