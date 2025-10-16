<script setup>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();


const cartItems = computed(() => store.state.cartItems);

const cartItemCount = computed(() => store.getters.cartItemCount);

const totalCartPrice = computed(() => store.getters.totalCartPrice);

const customerInfo = ref({
  name: '',
  phone: '',
  address: '',
  email: ''
});

const loggedInUser = computed(() => {
  const userData = localStorage.getItem('userlogin');
  return userData ? JSON.parse(userData) : null;
});
const isAdmin = computed(() => {
  return loggedInUser.value && loggedInUser.value.role.toLowerCase() === 'admin';
});
const logout = () => {
  if (confirm("Ban chac chan muon dang xuat?")) {
    localStorage.removeItem('userlogin');
    window.location.href = '/';
  }
};

const handleRemoveFromCart = (itemId) => {
    if (confirm("ban chac chan muon delete san pham nay?")) {
        alert ('delete thanh cong')
        store.dispatch('removeFromCart', itemId);
    }
};

const handleCheckout = () => {
    if (cartItems.value.length === 0) {
        alert("cart not empty!");
        return;
    }

    console.log("Thong tin don hang:", {
        customer: customerInfo.value,
        items: cartItems.value,
        total: totalCartPrice.value
    });
    alert("dat hang thanh cong");

};

onMounted(() => {
  store.dispatch('fetchCart');
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
                <li class="nav-item"><RouterLink class="nav-link" :to="`/userdetail/${loggedInUser.id}`">Hi, {{ loggedInUser.username }}</RouterLink></li>
                <li class="nav-item"><button class="nav-link" @click="logout()">Logout</button></li>
              </template>
              <template v-else>
                <li class="nav-item"><RouterLink to="/login" class="nav-link">Login</RouterLink></li>
              </template>
            </ul>
          </div>
        </div>
      </nav>
    </header>

    <main class="container">
      <h1 class="mb-4">Cart</h1>

      <div v-if="cartItems.length === 0" class="alert alert-info text-center">
        khong co don hang nao
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
                      <p class="card-text text-muted">Quantity: {{ item.quantity }}</p>
                    </div>
                    <div class="mt-auto d-flex justify-content-between align-items-center">
                      <p class="card-text mb-0 fs-5 text-danger fw-bold">${{ (item.price * item.quantity).toFixed(2) }}</p>
                      <button @click="handleRemoveFromCart(item.id)" class="btn btn-sm btn-outline-danger">Xóa</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-5">
          <div class="checkout-form card p-4 shadow-sm">
            <h3 class="mb-4">Check out</h3>
            <form @submit.prevent="handleCheckout">
              <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input type="text" v-model="customerInfo.name" class="form-control" id="name" required>
              </div>
              <div class="mb-3">
                <label for="phone" class="form-label">SDT</label>
                <input type="tel" v-model="customerInfo.phone" class="form-control" id="phone" required>
              </div>
              <div class="mb-3">
                <label for="address" class="form-label">Location</label>
                <input type="text" v-model="customerInfo.address" class="form-control" id="address" required>
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" v-model="customerInfo.email" class="form-control" id="email">
              </div>
              <hr class="my-4">
              <div class="d-flex justify-content-between fs-5 mb-4">
                <span>Total:</span>
                <span class="fw-bold text-danger">${{ totalCartPrice }}</span>
              </div>
              <button type="submit" class="btn btn-primary w-100 btn-lg">Order</button>
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