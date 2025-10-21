<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router';
import { useStore } from 'vuex'

const store = useStore();
const router = useRouter();

// Data product
const Product = ref([])
const total = ref(0)
const search = ref('')
const page = ref(1)
const pagesize = 12

const categories = ref([])
const selectedCategory = ref('')

const allProducts = ref([]);
const completedOrders = ref([]);
const loadingTopSellers = ref(true);


const fetchCategories = async () => {
  try {
    const response = await axios.get('http://localhost:3000/products')
    const allProducts = response.data
    const uniqueCategories = [...new Set(allProducts.map(product => product.category))]
    categories.value = uniqueCategories.filter(Boolean);
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}


// count so trang
// const totalpage = computed(() => Math.ceil(total.value / pagesize))

const loaddata = async () => {
  try {
    const params = { _page: page.value, _limit: pagesize }
    if (search.value) params.title_like = search.value
    if (selectedCategory.value) params.category = selectedCategory.value
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

const loadDataForTopSellers = async () => {
  loadingTopSellers.value = true;
  try {
    const [productsRes, ordersRes] = await Promise.all([
      axios.get('http://localhost:3000/products'),
      axios.get('http://localhost:3000/orders?status=completed')
    ]);
    allProducts.value = productsRes.data;
    completedOrders.value = ordersRes.data;
  } catch (error) {
    console.error('Loi tai du lieu top sellers:', error);
  } finally {
    loadingTopSellers.value = false;
  }
};

const topSellingProducts = computed(() => {
  if (allProducts.value.length === 0 || completedOrders.value.length === 0) return [];

  const productSales = {};

  completedOrders.value.forEach(order => {
    if (order.items) {
      order.items.forEach(item => {
        const productId = item.id;
        const quantity = item.quantity;
        if (productSales[productId]) {
          productSales[productId] += quantity;
        } else {
          productSales[productId] = quantity;
        }
      });
    }
  });

  const salesArray = Object.keys(productSales).map(productId => ({
    productId: productId,
    quantity: productSales[productId]
  }));

  salesArray.sort((a, b) => b.quantity - a.quantity);

  return salesArray.slice(0, 5).map(sale => {
    const productInfo = allProducts.value.find(p => p.id === sale.productId);
    return {
      ...sale,
      name: productInfo ? productInfo.title : 'N/A',
      image: productInfo ? productInfo.image : '',
    };
  });
});

// next trang
// const change_page = (newpage) => {
//   if (newpage < 1) return
//   if (newpage > totalpage.value) return
//   page.value = newpage
//   loaddata()
// }

watch(search, () => {
  page.value = 1
  loaddata()
})

watch(selectedCategory, () => {
  page.value = 1
  loaddata()
})

onMounted(() => {
  loaddata()
  fetchCategories()
  loadDataForTopSellers()
  if (loggedInUser.value) {
    store.dispatch('fetchCart', loggedInUser.value.id);
  } else {
    console.log('not login, no load data cart.');
  }
})

// User
const loggedInUser = computed(() => {
  const userData = localStorage.getItem('userlogin');
  if (userData) {
    return JSON.parse(userData);
  }
  return null;
});

// admin
const isAdmin = computed(() => {
  return loggedInUser.value && loggedInUser.value.role.toLowerCase() === 'admin';
});

// logout
const logout = () => {
  if (confirm("Ban chac chan muon dang xuat")) {
    localStorage.removeItem('userlogin');
    // load lai trang
    window.location.href = '/';
    // loaddata()
  }
}

// add cart
const addProductToCart = async (product) => {
  if (!localStorage.getItem('userlogin')) {
    if (confirm('Ban chua dang nhap hay dang nhap!')) {
      router.push('/login')
    }
  } else {
    const userId = loggedInUser.value.id;
    await store.dispatch('addToCart', { product: product, userId: userId, quantity: 1 });
    alert(`Da add "${product.title}" vao gio hang!`);
  }
};

const cartItemCount = computed(() => store.getters.cartItemCount);

const goToCart = () => {
  router.push('Store')
}

// favorite
const addToFavorites = async (product) => {
  if (!loggedInUser.value) {
    if (confirm('Bạn cần đăng nhập để thêm vào yêu thích! Đăng nhập ngay?')) {
      router.push('/login')
    }
  } else {
    const userId = loggedInUser.value.id;

    const payload = {
      userId: userId,
      productId: product.id,
      product: product,
      added_at: new Date().toISOString()
    };

    try {

      const response = await axios.post('http://localhost:3000/favorite', payload);

      if (response.status === 201) {
        alert(`Đã thêm "${product.title}" vào danh sách yêu thích!`);
      }
    } catch (error) {
      console.error('LỖI KHI THÊM VÀO YÊU THÍCH:', error);
      alert('Có lỗi xảy ra, vui lòng thử lại.');
    }
  }
};

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

 img {
  height: 200px;
  object-fit: contain;
  /* GIUP ANH KHONG BI VO KHI CAO BANG NHAU */
  width: 100%;
}
.top-seller-title {
  min-height: 3em;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

<template>
  <main>
    <div class="container py-4 border-bottom mb-5">
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <RouterLink to="Index" style="font-size: 2rem;" class="navbar-brand">TBS</RouterLink>
          <div class="header-actions ms-auto me-3">
            <button style="margin-left: 15px;" @click="goToCart" class="nav-link position-relative">
              Cart
              <span v-if="cartItemCount > 0" class=" badge rounded-pill bg-danger">
                {{ cartItemCount }}
              </span>
            </button>
          </div>
          <button style="border: none;" class="navbar-toggler">
            <ul style="font-size: 1rem;" class="navbar navbar-expand-lg bg-body-tertiary">
              <li class="nav-item" v-if="isAdmin">
                <RouterLink to="/product" class="nav-link">Admin</RouterLink>
              </li>
              <template v-if="loggedInUser">
                <li class="nav-item">
                  <RouterLink class="nav-link" :to="`/favorite/${loggedInUser.id}`">
                    Favorite
                  </RouterLink>
                </li>
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
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item" v-if="isAdmin">
                <RouterLink to="/product" class="nav-link">Admin</RouterLink>
              </li>
            </ul>

            <form class="d-flex mx-auto" role="search" @submit.prevent="loaddata">
              <input v-model="search" class="form-control me-2" type="search" placeholder="search..." />
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
      <section class="mb-5">
        <h2 class="text-center mb-4">Top 5 San Pham Ban Chay</h2>
        
        <div v-if="loadingTopSellers" class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Dang tai...</span>
          </div>
        </div>

        <div v-else>
          <div v-if="topSellingProducts.length > 0" class="row row-cols-1 row-cols-md-3 row-cols-lg-5 g-4">
            
            <div v-for="(product) in topSellingProducts" :key="product.productId" class="col">
              <div class="card h-100 shadow-sm text-center">
                <RouterLink :to="`/product-detail/${product.productId}`" class="text-decoration-none text-dark d-flex flex-column h-100">
                  
                  <img :src="product.image" class="card-img-top p-3 top-seller-img" :alt="product.name">
                  
                  <div class="card-body p-2 d-flex flex-column">
                    <h6 class="card-title small top-seller-title">{{ product.name }}</h6>
                    <p class="card-text text-danger fw-bold mt-auto mb-0">Da ban: {{ product.quantity }}</p>
                  </div>
                </RouterLink>
              </div>
            </div>

          </div>
          
          <div v-else class="alert alert-info text-center">
            Chua co du lieu san pham ban chay.
          </div>
        </div>
      </section>
      <div class="mb-4 text-center">
        <button @click="selectedCategory = ''"
          :class="['btn', 'me-2', 'mb-2', selectedCategory === '' ? 'btn-primary' : 'btn-outline-secondary']">
          Tất cả
        </button>

        <button v-for="category in categories" :key="category" @click="selectedCategory = category"
          :class="['btn', 'me-2', 'mb-2', selectedCategory === category ? 'btn-primary' : 'btn-outline-secondary']">
          {{ category }}
        </button>
      </div>
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
                <p style="margin-bottom: 15px;" class="card-text">quantity
                  <span class="badge text-bg-info float-end">{{ Item.quantity }}</span>
                </p>
              </RouterLink>
              <div class="mt-auto d-flex justify-content-between align-items-center">
                <h6 class="card-subtitle text-danger mb-0">Price: {{ Item.price }}$</h6>
                <div class="d-flex gap-1"> <button @click="addToFavorites(Item)" class="btn btn-outline-danger btn-sm">
                    favorite
                  </button>
                  <button v-if="Item.quantity > 0" @click="addProductToCart(Item)" class="btn btn-primary btn-sm">Add to
                    cart</button>
                  <button v-else class="btn btn-secondary btn-sm" disabled>out of stock</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="Product.length === 0" class="col-12 p-3 text-center text-muted">
          <span class="alert alert-info">khong co san pham</span>
        </div>
      </div>
    </div>
  </main>
  <footer style="margin-top: 50px;" class="py-4 bg-dark text-white">
    <div class="container d-flex flex-wrap justify-content-between align-items-center gap-3">
      <span>© <span id="year">2025</span> TBS</span>
    </div>
  </footer>
</template>
