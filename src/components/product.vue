<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const edit = ref(false)
const products = ref([])
const product = reactive({
  title: '',
  image: '',
  category: '',
  price: '',
})


// Load du lieu
onMounted(async () => {
  Loadulieu()
})

// load du lieu category
onMounted(async () => {
  Loadulieucategory()
})

// Xoa du lieu
const deleteProduct = async (id) => {
  //b1 
  const isConfirm = confirm(`Ban chac chan muon xoa id: ${id} nay?`)
  if (isConfirm) {
    //b2:
    const response = await axios.delete(`http://localhost:3000/products/${id}`);
    if (response.status == 200) {
      Loadulieu()
      // Thong bao du lieu xoa bang code alert
      alert('Delete success')
    }
  }
}

// Edit du lieu
const editproduct = (item) => {
  item.title,
    item.image,
    item.category,
    item.price,
    item.description
  Object.assign(product, item)
  edit.value = true
}

// load du lieu
const Loadulieu = async () => {
  console.log(`the component is now mounted.`)
  const response = await axios.get('http://localhost:3000/products');
  if (response.status == 200) {
    products.value = response.data
  }
}

// upload img
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      product.image = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// load lai trang
const handleSubmit = async () => {
  // neu o title khong viet gi
  if (products.title === "") {
    alert('Tieu de khong duoc de trong')
    return
  }

  if (edit.value) {
    const response = await axios.put(`http://localhost:3000/products/${product.id}`, product)
    if (response.status === 200) {
      alert("Update thanh cong")
      Loadulieu()
      clearData()
      edit.value = false
    }
  } else {

    // Add data
    const payload = {
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category,
      description: product.description,
      // creator: 'admin',
      // tags: 'news'
    }

    // Day du lieu vo db.json products
    const response = await axios.post('http://localhost:3000/products', payload);
    console.log(response);
    if (response.status == 201) {
      Loadulieu()
      clearData()
      alert('Da them du lieu')
      edit.value = false
    }
  }
}

const clearData = () => {
  Object.assign(products, {
    id: '',
    title: '',
    price: '',
    category: '',
    image: '',
    description: ''
  })
}

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

// logout
const logout = () => {
  if (confirm("ban chac chan muon dang xuat?")) {
    localStorage.removeItem('userlogin')
    router.push('/')
  }
}

// onMounted(async () => {
//   console.log(`the component is now mounted.`)
//   const response = await axios.get('http://localhost:3000/products');
//   if (response.status == 200) {
//     products.value = response.data
//   }
// })

// Catrgory
const categorys = ref([])

// load data category
const Loadulieucategory = async () => {
  const response = await axios.get('http://localhost:3000/category');
  if (response.status == 200) {
    categorys.value = response.data
  }
}

const reset = () => {
  window.location.href = 'Product';
}

</script>

<template>

  <body>
    <!-- <div class="container py-2"> -->
    <div class="container py-4 border-bottom mb-5">
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <RouterLink style="font-size: 2rem;" to="Index" class="nav-link active" aria-current="page">TBS</RouterLink>
          <li class="nav-item">
            <RouterLink style="margin-left: 15px;" to="user" class="nav-link" aria-current="page">User</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink style="margin-left: 15px;" to="HistoryOrder" class="nav-link" aria-current="page">History</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink style="margin-left: 15px;" to="Chart" class="nav-link" aria-current="page">Chart</RouterLink>
          </li>
          <button style="border: none;" class="navbar-toggler">
            <ul style="font-size: 1rem;" class="navbar navbar-expand-lg bg-body-tertiary">

              <li class="nav-item" v-if="isAdmin">
                <RouterLink to="/product" class="nav-link">Admin</RouterLink>
              </li>
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
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            </ul>
            <div class="d-flex">
              <li class="nav-item">
                <RouterLink class="nav-link" :to="`Userdetail/${loggedInUser.id}`">Hi, {{ loggedInUser.username }}
                </RouterLink>
              </li>
              <li class="nav-item">
                <button class="nav-link active" aria-current="page" to="Login" @click="logout()">Logout</button>
              </li>
            </div>
          </div>
        </div>
      </nav>
    </div>
    <main class="container pb-5">
      <div class="row g-4">
        <div class="col-md-2">
          <RouterLink style="margin-bottom: 15px;" class="nav-link" to="Category">Add new Category</RouterLink>
          <RouterLink class="nav-link" to="Product">Add new Product</RouterLink>
        </div>
        <!-- Products list -->
        <section class="col-lg-7">
          <div class="card shadow-sm">
            <div class="card-header justify-content-between align-items-center">
              <nav class="navbar bg-body-tertiary">
                <div class="container-fluid">
                  <span class="navbar-brand">Product</span>
                  <form class="d-flex" role="search">
                    <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                    <button class="btn btn-outline-success" type="submit">Search</button>
                  </form>
                </div>
              </nav>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                  <thead class="table-light">
                    <tr>
                      <th style="width:80px">Image</th>
                      <th>Title</th>
                      <th style="width:140px">Category</th>
                      <th style="width:120px" class="text-end">Price</th>
                      <th style="width:120px" class="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in products" :key="item.id">
                      <td><img class="product-thumb" :src="item.image" alt="product"></td>
                      <td>{{ item.title }}</td>
                      <td><span class="badge text-bg-dark">{{ item.category }}</span></td>
                      <td class="text-end">{{ item.price }} $</td>
                      <td class="text-end"><button @click="editproduct(item)" href="#editForm"
                          class="btn btn-sm btn-outline-primary" style="margin-right: 4px;">Edit
                        </button>
                        <button @click="deleteProduct(item.id)" class="btn btn-sm btn-danger"> Delete</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <!-- Edit form -->
        <aside class="col-lg-3">
          <div class="card shadow-sm sticky-col" id="editForm">
            <div class="card-header">Add & Edit Product</div>
            <div class="card-body">
              <form @submit="handleSubmit" class="form">
                <div class="mb-3">
                  <label for="pTitle" class="form-label">Title</label>
                  <input v-model="product.title" type="text" class="form-control" id="pTitle" name="title"
                    placeholder="Product title" required>
                </div>
                <div class="mb-3">
                  <label for="pPrice" class="form-label">Price (USD)</label>
                  <input v-model="product.price" type="number" class="form-control" id="pPrice" name="price" step="0.01"
                    min="0" placeholder="0.00" required>
                </div>
                <div class="mb-3">
                  <label for="pCategory" class="form-label">Category</label>
                  <select v-model="product.category" id="pCategory" class="form-select" name="category" required>
                    <option value="" selected>Choose...</option>
                    <option v-for="item in categorys" :key="item.id">{{ item.name }}</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="pImage" class="form-label">Upload Img</label>
                  <input @change="handleFileUpload" type="file" class="form-control">
                  <div v-if="product.image" class="mt-2">
                    <img :src="product.image" alt="Preview"
                      style="width:100px;height:100px;object-fit:cover;border-radius:5px;">
                  </div>
                </div>
                <div class="mb-3">
                  <label for="pDesc" class="form-label">Description</label>
                  <textarea v-model="product.description" id="pDesc" class="form-control" name="description" rows="3"
                    placeholder="Short product description" required></textarea>
                </div>

                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-primary">Save</button>
                  <a @click="reset()" class="btn btn-outline-secondary">Reset</a><br>
                </div>

                <!-- Optional hidden id field if your backend needs it -->
                <input type="hidden" name="id" value="">
              </form>
            </div>
          </div>
        </aside>
      </div>
    </main>

    <footer class="py-4 bg-dark text-white">
      <div class="container d-flex flex-wrap justify-content-between align-items-center gap-3">
        <span>© <span id="year">2025</span> TBS</span>
        <!-- <router-link to="Index"  class="btn btn-outline-light btn-sm">Go back to home</router-link> -->
      </div>
    </footer>
  </body>
</template>

<style scoped>
body {
  background-color: #f8f9fa;
}

.product-thumb {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: .5rem;
}

.sticky-col {
  position: sticky;
  top: 1rem;
}

div nav li {
  list-style: none;
  margin-left: 15px;
  font-size: 1rem;
}
</style>