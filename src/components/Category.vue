<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import axios from 'axios'

const i = 1
const edit = ref(false)
const categorys = ref([])
const category = reactive({
  name: '',
})

// Load du lieu
onMounted(async () => {
  Loadulieu()
})
// Xoa du lieu
const deleteCategory = async (id) => {
  //b1 
  const isConfirm = confirm(`Are u sure delete id: ${id} here?`)
  if (isConfirm) {
    //b2:
    const response = await axios.delete(`http://localhost:3000/category/${id}`);
    if (response.status == 200) {
      Loadulieu()
      alert('Delete successfly')
    }
  }
}

// Edit du lieu
const editCategory = (item) => {
  item.name,
    Object.assign(category, item)
  edit.value = true
}

// load du lieu
const Loadulieu = async () => {
  console.log(`the component is now mounted.`)
  const response = await axios.get('http://localhost:3000/category');
  if (response.status == 200) {
    categorys.value = response.data
  }
}

// load lai trang
const handleSubmit = async () => {
  // neu o title khong viet gi
  if (category.title === "") {
    alert('Khong duoc de danh muc trong')
    return
  }

  if (edit.value) {
    const response = await axios.put(`http://localhost:3000/category/${category.id}`, category)
    if (response.status === 200) {
      alert("Update thanh cong")
      Loadulieu()
      clearData()
      edit.value = false
    }
  } else {

    // Add data
    const payload = {
      name: category.name
      // creator: 'admin',
      // tags: 'news'
    }
    // Day du lieu vo db.json products
    const response = await axios.post('http://localhost:3000/category', payload);
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
  Object.assign(category, {
    name: '',
  })
}

const reset = () => {
  window.location.href = 'Category';
}

// onMounted(async () => {
//   console.log(`the component is now mounted.`)
//   const response = await axios.get('http://localhost:3000/products');
//   if (response.status == 200) {
//     products.value = response.data
//   }
// })

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

</script>
<template>

  <body>
   <div class="container py-4 border-bottom mb-5">
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <RouterLink style="font-size: 2rem;" to="Index" class="nav-link active" aria-current="page">TBS</RouterLink>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
            aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            </ul>
            <div class="d-flex">
              <li class="nav-item">
                <RouterLink to="profile" class="nav-link" aria-current="page">Profile</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" :to="`Userdetail/${loggedInUser.id}`">Hi, {{ loggedInUser.username }}</RouterLink>
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
                  <span class="navbar-brand">Category</span>
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
                      <th style="width:140px">Stt</th>
                      <th style="width:140px">Category</th>
                      <th style="width:120px" class="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in categorys" :key="item.id">
                      <td><strong>{{ i++ }}</strong></td>
                      <td><span>{{ item.name }}</span></td>
                      <td class="text-end">
                        <button @click="editCategory(item)" style="margin-right: 4px;" class="btn btn-sm btn-outline-primary">Edit</button>
                        <button @click="deleteCategory(item.id)" class="btn btn-sm btn-danger">Delete</button>
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
            <div class="card-header">Edit Category</div>
            <div class="card-body">
              <form @submit="handleSubmit" class="form">
                <div class="mb-3">
                  <label for="title" class="form-label">Category</label>
                  <input v-model="category.name" type="text" class="form-control" id="pTitle" name="title"
                    placeholder="Category Product" required>
                </div>

                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-primary">Save</button>
                  <a @click="reset()" class="btn btn-outline-secondary">Reset</a>
                </div>

                <!-- Optional hidden id field if your backend needs it -->
                <input type="hidden" name="id" value="">
              </form>
            </div>
          </div>
        </aside>
      </div>
    </main>
    <!-- 
    <footer class="py-4 bg-dark text-white">
      <div class="container d-flex flex-wrap justify-content-between align-items-center gap-3">
        <span>© <span id="year">2025</span> TBS</span>
        <router-link to="Index"  class="btn btn-outline-light btn-sm">Go back to home</router-link>
      </div>
    </footer> -->
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

tr td{
  padding: 12px;
}
</style>