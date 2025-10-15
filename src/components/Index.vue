<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const Product = ref([])
const total = ref(0)
const search = ref('')
const page = ref(1)
const pagesize = 10

const totalpage = computed(() => Math.ceil(total.value / pagesize))

const loaddata = async () => {
  try {
    const params = { _page: page.value, _limit: pagesize }
    if (search.value) params.title_like = search.value

    const response = await axios.get('http://localhost:3000/products', { params })
    Product.value = response.data

    // console.log('response.headers:', response.headers)

    let totalCount = response.headers && response.headers['x-total-count']
      ? parseInt(response.headers['x-total-count'])
      : null

    if (!totalCount) {
      const countParams = { ...params }
      delete countParams._page
      delete countParams._limit
      const allRes = await axios.get('http://localhost:3000/products', { params: countParams })
      totalCount = Array.isArray(allRes.data) ? allRes.data.length : (Product.value.length || 0)
    }

    total.value = totalCount
  } catch (error) {
    console.error('Error load page:', error)
  }
}

const change_page = (newpage) => {
  if (newpage < 1) return
  if (newpage > totalpage.value) return
  page.value = newpage
  loaddata()
}

watch(search, () => {
  page.value = 1
  loaddata()
})

onMounted(() => {
  loaddata()
})


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
  if (confirm("Ban chac chan muon dang xuat")) {
    localStorage.removeItem('userlogin');
    // load lai trang
     window.location.href = '/';
  }
}
</script>

<style scoped>
img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

div nav li {
  margin-left: 15px;
  list-style: none;
}
</style>

<template>
  <!-- <div class="container py-4 border-bottom mb-5">
    <header style="margin-top: 30px;" class="d-flex align-items-center justify-content-between mb-3">
      <RouterLink style="text-decoration: none;" to="Index"><h1 style="color: black;" class="h3 m-0">TBS</h1></RouterLink>
      <div>
        <RouterLink to="Product" class="btn btn-success me-2">Admin</RouterLink>
        <RouterLink to="Login" class="btn btn-outline-danger" @click="logout()">Logout</RouterLink>
      </div>
      <form class="d-none d-sm-flex" role="search" @submit.prevent>
        <input class="form-control form-control-sm" type="search" v-model="search" placeholder="Search..." />
      </form>
    </header>
  </div>   -->  
<main>
    <div class="container py-4 border-bottom mb-5">
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <RouterLink to="Index" style="font-size: 2rem; font-weight: bold;" class="navbar-brand">TBS</RouterLink>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item" v-if="isAdmin">
                <RouterLink to="/product" class="nav-link">Admin</RouterLink>
              </li>
            </ul>

            <form class="d-flex mx-auto" role="search" @submit.prevent="loaddata">
              <input v-model="search" class="form-control me-2" type="search" placeholder="search..."/>
              <button class="btn btn-outline-success" type="submit">Search</button>
            </form>

            <ul class="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center">
              <template v-if="loggedInUser">
                <li class="nav-item">
                  <RouterLink class="nav-link" :to="`/userdetail/${loggedInUser.id}`">
                    Hi, {{ loggedInUser.username }}
                  </RouterLink>
                </li>
                <li class="nav-item">
                  <button class="nav-link" @click="logout()">Logout</button>
                </li>
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
    </div>

    <div class="container py-2">
      <div class="row g-4">
        <div class="col-md-3" v-for="Item in Product" :key="Item.id">
          <div class="card h-100 shadow-sm">
            <RouterLink :to="`/product-detail/${Item.id}`" class="text-decoration-none text-dark">
              <img :src="Item.image" class="card-img-top" :alt="Item.title" />
            </RouterLink>
            <div class="card-body d-flex flex-column">
              <RouterLink :to="`/product-detail/${Item.id}`" class="text-decoration-none text-dark">
                <h5 class="card-title">{{ Item.title }}</h5>
                <p class="card-text text-muted">
                  By <strong>Admin</strong>
                  <span class="badge text-bg-secondary float-end">{{ Item.category }}</span>
                </p>
                <p class="card-text">
                  Lorem ipsum dolor sit amet...
                </p>
              </RouterLink>
              <div class="mt-auto d-flex justify-content-between align-items-center">
                <h6 class="card-subtitle text-danger mb-0">Price: {{ Item.price }}$</h6>
                <button class="btn btn-primary btn-sm">Add to cart</button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="Product.length === 0" class="col-12 p-3 text-center text-muted">
          Không có sản phẩm
        </div>
      </div>

      <nav aria-label="Post navigation" class="mt-4" v-if="totalpage > 1">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: page === 1 }">
            <button class="page-link" @click="change_page(page - 1)" :disabled="page === 1">Previous</button>
          </li>
          <li class="page-item" v-for="p in totalpage" :key="p" :class="{ active: page === p }">
            <button class="page-link" @click="change_page(p)">{{ p }}</button>
          </li>
          <li class="page-item" :class="{ disabled: page === totalpage }">
            <button class="page-link" @click="change_page(page + 1)" :disabled="page === totalpage">Next</button>
          </li>
        </ul>
      </nav>
    </div>
  </main>
</template>
