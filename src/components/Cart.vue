<script setup>
import { reactive, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
// import { VNPay, ignoreLogger } from 'vnpay'; 

const API_URL = 'http://localhost:3000';
const store = useStore();
const cartItems = computed(() => store.state.cartItems);
const totalCartPrice = computed(() => store.getters.totalCartPrice);

const orderInfo = reactive({
  name: '',
  phone: '',
  address: '',
  email: '',
  pay_type: 'cod'
});


// login
const loggedInUser = computed(() => {
  const userData = localStorage.getItem('userlogin');
  if (userData) {
    return JSON.parse(userData);
  }
  return null;
});

const isAdmin = computed(() => {
  return loggedInUser.value && loggedInUser.value.role.toLowerCase() === 'admin';
});


const logout = () => {
  if (confirm("Are you sure logout")) {
    localStorage.removeItem('userlogin');
    window.location.href = '/'; 
  }
};

const clearData = () => {
  orderInfo.name = '';
  orderInfo.phone = '';
  orderInfo.address = '';
  orderInfo.email = '';
  orderInfo.pay_type = 'cod';
};

const handleRemoveFromCart = (itemId) => {
  if (confirm("Delete product here?")) {
    store.dispatch('removeFromCart', itemId);
    alert('Delete success');
  }
};

const handleSubmit = async () => {
  if (cartItems.value.length === 0) {
    alert("cart empty not order");
    return;
  }
  if (!orderInfo.name || !orderInfo.phone || !orderInfo.address) {
      alert("please text profile!");
      return;
  }

  const payload = {
    name: orderInfo.name,
    sdt: orderInfo.phone, 
    address: orderInfo.address,
    email: orderInfo.email,
    pay_type: orderInfo.pay_type,

    items: cartItems.value.map(item => ({
      id: item.id,
      name: item.title, 
      price: item.price,
      quantity: item.quantity
    })),
    total: totalCartPrice.value,

    created_at: new Date().toISOString(),
    status: 'pending', 
    user_id: loggedInUser.value ? loggedInUser.value.id : null 
  };

  try {
    const response = await axios.post(`${API_URL}/orders`, payload);

    if (response.status === 201) {
      alert('Order successfly');
      clearData(); 
      store.dispatch('clearCart', user_id); 
    }
  } catch (error) {
    console.error("Error order:", error);
  }
};

// VN pay

// const handleVNPay = async () => {
//   try {
//     const payload = {
//       order_id: new Date().getTime(), 
//       amount: totalCartPrice.value 
//     };
//     // Giả sử bạn có một server backend ở port 3001 để tạo URL thanh toán
//     const response = await axios.post('http://localhost:3001/init-url', payload);
//     if (response.status === 200 && response.data.url) {
//       window.location.href = response.data.url;
//     }
//   } catch (error) {
//     console.error('Error vnpay:', error);
//     alert('Error connected vnpay.');
//   }
// };

onMounted(() => {

  if(loggedInUser.value){
    store.dispatch('fetchCart', loggedInUser.value.id);
  } else{
    console.log('chua login khong tai duoc gio hang')
  }
});

</script>

<template>
  <div>
    <header class="container py-4 border-bottom mb-5">
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <RouterLink to="/" style="font-size: 2rem;" class="navbar-brand">TBS</RouterLink>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item" v-if="isAdmin">
                <RouterLink to="/product" class="nav-link">Admin</RouterLink>
              </li>
            </ul>
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center">
              <template v-if="loggedInUser">
                <li class="nav-item">
                  <RouterLink class="nav-link" :to="`/userdetail/${loggedInUser.id}`">Hi, {{ loggedInUser.username }}
                  </RouterLink>
                </li>
                <li class="nav-item"><button class="nav-link" @click="logout()">Logout</button></li>
              </template>
              <template v-else>
                <li class="nav-item">
                  <RouterLink to="/login" class="nav-link">Login</RouterLink>
                </li>
              </template>
            </ul>
          </div>
        </div>
      </nav>
    </header>

    <main class="container">
      <h1 class="mb-4">Cart product</h1>

      <div v-if="cartItems.length === 0" class="alert alert-info text-center">
       Not empty cart
      </div>

      <div v-else class="row g-5">
        <div class="col-md-7">
          <div class="cart-items-list">
            <div v-for="item in cartItems" :key="item.id" class="cart-item card mb-3">
              <div class="row g-0">
                <div class="col-md-3">
                  <img :src="item.image" class="img-fluid rounded-start" :alt="item.title">
                </div>
                <div class="col-md-9">
                  <div class="card-body d-flex flex-column h-100">
                    <div>
                      <h5 class="card-title">{{ item.title }}</h5>
                      <p class="card-text text-muted">quantity: {{ item.quantity }}</p>
                    </div>
                    <div class="mt-auto d-flex justify-content-between align-items-center">
                      <p class="card-text mb-0 fs-5 text-danger fw-bold">${{ (item.price * item.quantity).toFixed(2) }}</p>
                      <button @click="handleRemoveFromCart(item.id)" class="btn btn-sm btn-outline-danger">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-5">
          <div class="checkout-form card p-4 shadow-sm">
            <h3 class="mb-4">Order</h3>
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input type="text" v-model="orderInfo.name" class="form-control" id="name" required>
              </div>
              <div class="mb-3">
                <label for="phone" class="form-label">Phone</label>
                <input type="tel" v-model="orderInfo.phone" class="form-control" id="phone" required>
              </div>
              <div class="mb-3">
                <label for="address" class="form-label">Location</label>
                <input type="text" v-model="orderInfo.address" class="form-control" id="address" required>
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" v-model="orderInfo.email" class="form-control" id="email">
              </div>
              <hr class="my-4">
              <div class="d-flex justify-content-between fs-5 mb-4">
                <span>Total:</span>
                <span class="fw-bold text-danger">{{ totalCartPrice }} $</span>
              </div>
              <button type="submit" class="btn btn-primary w-100 btn-lg">Order</button><br><br>
              <button @click="thanhtoanvnpay" class="btn btn-primary w-100 btn-lg">vnpay payment</button>
            </form>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.cart-item img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.checkout-form {
  position: sticky;
  top: 20px;
}
</style>