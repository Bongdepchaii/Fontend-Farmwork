<script setup>
import { ref, onMounted, reactive } from 'vue'
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
  const isConfirm = confirm(`bạn có muốn xoá id ${id} này không ?`)
  if (isConfirm) {
    //b2:
    const response = await axios.delete(`http://localhost:3000/category/${id}`);
    if (response.status == 200) {
      Loadulieu()
      // Thong bao du lieu xoa bang code alert
      alert('Đã xoá')
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
        <h1 class="h4 mb-0">TBS</h1>
        <router-link to="Product" class="btn btn-info">Back</router-link>
        <!-- <button class="btn btn-info" @click="goBack()">Admin</button> -->
      </div>
    </header>
    <main class="container pb-5">
      <div class="row g-4">
        <!-- Products list -->
        <section class="col-lg-8">
          <div class="card shadow-sm">
            <div class="card-header d-flex justify-content-between align-items-center">
              <span class="fw-semibold">Category</span>
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
                        <button @click="editCategory(item)" class="btn btn-sm btn-outline-primary">Edit</button>
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
        <aside class="col-lg-4">
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
</style>