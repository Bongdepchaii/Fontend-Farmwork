<script setup>
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios'

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
// Xoa du lieu
const deleteProduct = async (id) => {
  //b1 
  const isConfirm = confirm(`bạn có muốn xoá id ${id} này không ?`)
  if (isConfirm) {
    //b2:
    const response = await axios.delete(`http://localhost:3000/products/${id}`);
    if (response.status == 200) {
      Loadulieu()
      // Thong bao du lieu xoa bang code alert
      alert('Đã xoá')
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

// onMounted(async () => {
//   console.log(`the component is now mounted.`)
//   const response = await axios.get('http://localhost:3000/products');
//   if (response.status == 200) {
//     products.value = response.data
//   }
// })

</script>
<template>

  <body>
    <header class="py-4 bg-white border-bottom mb-4">
      <div class="container d-flex align-items-center justify-content-between">
        <h1 class="h4 mb-0">MyShop</h1>
        <router-link to="Profile" class="btn btn-primary">Profile User</router-link>
         <!-- <button class="btn btn-info" @click="goBack()">Admin</button> -->
      </div>
    </header>
    <main class="container pb-5">
      <div class="row g-4">
        <!-- Products list -->
        <section class="col-lg-8">
          <div class="card shadow-sm">
            <div class="card-header d-flex justify-content-between align-items-center">
              <span class="fw-semibold">Products</span>
              <form action="">
                  <input type="text" style="padding: 5px; border-radius: 5px; outline: none;" placeholder="Search...">
                  <button style="padding: 5px; border-radius: 5px;" class="custom-file-label">Search</button>
              </form>
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
        <aside class="col-lg-4">
          <div class="card shadow-sm sticky-col" id="editForm">
            <div class="card-header">Edit Product</div>
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
                    <option>Electronics</option>
                    <option>Home</option>
                    <option>Fashion</option>
                    <option>Sports</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="pImage" class="form-label">Image URL</label>
                  <input v-model="product.image" type="url" class="form-control" id="pImage" name="image"
                    placeholder="https://example.com/image.jpg" required>
                </div>
                <div class="mb-3">
                  <label for="pDesc" class="form-label">Description</label>
                  <textarea v-model="product.description" id="pDesc" class="form-control" name="description" rows="3"
                    placeholder="Short product description" required></textarea>
                </div>

                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-primary">Save</button>
                  <button type="reset" class="btn btn-outline-secondary">Reset</button>
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
        <span>© <span id="year">2025</span> MyShop</span>
        <router-link to="Index"  class="btn btn-outline-light btn-sm">Go back to home</router-link>
      </div>
    </footer>
  </body>
</template>

<style>
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
</style>