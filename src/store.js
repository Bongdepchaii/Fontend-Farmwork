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
    },
    CLEAR_CART(state) {
      state.cartItems = [];
    }
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
  async addToCart({ state, commit, dispatch }, { product, quantity, userId }) {
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
          userId: userId,
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

