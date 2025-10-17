// import { createStore } from 'vuex'
// import axios from 'axios'

// const API_URL = import.meta.env.VITE_URL_API

// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// // Create a new store instance.
// const store = createStore({
//   state() {
//     return {
//       count: 0,
//       products: [],
//       carts: [],
//       loading: false,
//       error: null
//     }
//   },
//   getters: {
//     countCart: (state) => {
//       return state.carts.length
//     },
//     totalCart: (state) => {
//       return  state.carts.reduce((total, item) => total + (item.price * item.quantity), 0)
//     }
//   },
//   mutations: {
//     increment(state) {
//       state.count++
//     },
//     decrease(state) {
//       state.count--
//     },
//     add_cart(state, payload) {
//       /**
//        * 
//        */
//       const {id} = payload
//       const existItem = state.carts.find(item => item.id === id)
//       console.log('existItem',existItem)
//       if (existItem) {
//         existItem.quantity++;
//       } else {
//         state.carts.push({...payload, quantity: 1})
//       }
//     },
//     remove_cart(state, id) {
//       state.carts = state.carts.filter(item => item.id !== id)
//     }
//   },
//   actions: {
//     increment(context) {
//       context.commit('increment')
//     },
//     async incrementAsync({ commit }) {
//       await sleep(3000);
//       commit('increment')
//     },
//   }
// })

// export default store


import { createStore } from 'vuex'
import axios from 'axios'

// SỬA LỖI: Đổi 'cart' thành 'Cart' để khớp với db.json của bạn
const cartApiUrl = 'http://localhost:3000/cart';

export default createStore({
  state: {
    cartItems: [] 
  },
  getters: {
    cartItemCount: (state) => {
      return state.cartItems.reduce((total, item) => total + item.quantity, 0);
    },
    // Thêm getter để tính tổng tiền
    totalCartPrice: (state) => {
      return state.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
  },
  mutations: {
    SET_CART(state, items) {
      state.cartItems = items;
    },
    ADD_ITEM_TO_CART(state, item) {
      state.cartItems.push(item);
    },
    UPDATE_ITEM_QUANTITY(state, updatedItem) {
      const index = state.cartItems.findIndex(item => item.id === updatedItem.id);
      if (index !== -1) {
        state.cartItems[index] = updatedItem;
      }
    },
    // Thêm mutation để xóa sản phẩm
    REMOVE_ITEM_FROM_CART(state, itemId) {
        state.cartItems = state.cartItems.filter(item => item.id !== itemId);
    }
  },
  CLEAR_CART(state) {
      state.cartItems = [];
    },
  actions: {
    async fetchCart({ commit }) {
      try {
        const response = await axios.get(cartApiUrl);
        commit('SET_CART', response.data);
      } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
      }
    },
    async addToCart({ state, commit }, { product, quantity }) {
      const itemInCart = state.cartItems.find(item => item.id === product.id);
      try {
        if (itemInCart) {
          const newQuantity = itemInCart.quantity + quantity;
          const response = await axios.patch(`${cartApiUrl}/${itemInCart.id}`, {
            quantity: newQuantity
          });
          commit('UPDATE_ITEM_QUANTITY', response.data);
        } else {
          // Chỉ lấy những thuộc tính cần thiết để tránh lỗi
          const newItem = {
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            category: product.category,
            quantity: quantity
          };
          const response = await axios.post(cartApiUrl, newItem);
          commit('ADD_ITEM_TO_CART', response.data);
        }
      } catch (error) {
        console.error("Lỗi khi thêm vào giỏ hàng:", error);
      }
    },
    // Thêm action để xóa sản phẩm
    async removeFromCart({ commit }, itemId) {
        try {
            await axios.delete(`${cartApiUrl}/${itemId}`);
            commit('REMOVE_ITEM_FROM_CART', itemId);
        } catch (error) {
            console.error("error: delete", error);
        }
    }
  }
})

