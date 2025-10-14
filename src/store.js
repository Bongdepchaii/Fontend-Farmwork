import { createStore } from 'vuex'
import axios from 'axios'

const API_URL = import.meta.env.VITE_URL_API

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Create a new store instance.
const store = createStore({
  state() {
    return {
      count: 0,
      products: [],
      carts: [],
      loading: false,
      error: null
    }
  },
  getters: {
    countCart: (state) => {
      return state.carts.length
    },
    totalCart: (state) => {
      return  state.carts.reduce((total, item) => total + (item.price * item.quantity), 0)
    }
  },
  mutations: {
    increment(state) {
      state.count++
    },
    decrease(state) {
      state.count--
    },
    add_cart(state, payload) {
      /**
       * 
       */
      const {id} = payload
      const existItem = state.carts.find(item => item.id === id)
      console.log('existItem',existItem)
      if (existItem) {
        existItem.quantity++;
      } else {
        state.carts.push({...payload, quantity: 1})
      }
    },
    remove_cart(state, id) {
      state.carts = state.carts.filter(item => item.id !== id)
    }
  },
  actions: {
    increment(context) {
      context.commit('increment')
    },
    async incrementAsync({ commit }) {
      await sleep(3000);
      commit('increment')
    },
  }
})

export default store