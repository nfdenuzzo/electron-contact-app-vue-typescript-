import { store } from 'quasar/wrappers'
import Vuex from 'vuex'

import { state, getters, mutations, actions } from './generalInfo';

export default store(function ({ Vue }) {
  Vue.use(Vuex)

  const Store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
  })

  return Store
})
