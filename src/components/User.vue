<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const edit = ref(false)
const users = ref([])
const user = reactive({
  name: '',
  role: '',
})

// Load du lieu
onMounted(async () => {
  Loadulieu()
})

// Xoa du lieu
const deleteProduct = async (id) => {
  //b1 
  const isConfirm = confirm(`bạn có muốn xoá user ${id} này không ?`)
  if (isConfirm) {
    //b2:
    const response = await axios.delete(`http://localhost:3000/User/${id}`);
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
  const response = await axios.get('http://localhost:3000/User');
  if (response.status == 200) {
    users.value = response.data
  }
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
</script> 
<template>
    <div class="container py-4 border-bottom mb-5">
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <RouterLink style="font-size: 2rem;" to="Index" class="nav-link active" aria-current="page">TBS</RouterLink>
                        <li class="nav-item" v-if="isAdmin">
                <RouterLink style="margin-left: 15px;" to="/product" class="nav-link">Admin</RouterLink>
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
    <div class="container py-5" style="margin-top: 15px;">
        <table class="table table-sm">
  <thead>
    <tr>
      <th scope="col">id</th>
      <th scope="col">Username</th>
      <th scope="col">Email</th>
      <th scope="col">Sex</th>
      <th scope="col">Create</th>
      <th scope="col">Role</th>
      <th scope="col">ACT</th>
    </tr>
  </thead>
  <tbody>
    <tr  v-for="item in users" :key="item.id">
      <th scope="row">{{item.id}}</th>
      <td>{{item.username}}</td>
      <td>{{ item.email}}</td>
      <td>{{ item.sex || 'Chua cap nhat' }}</td>
      <td>{{ item.createtime }}</td>
      <td>{{ item.role }}</td>
      <td>
        <button style="margin-right: 5px;" class="btn btn-info">Edit</button>
        <button class="btn btn-danger">Delete</button>
    </td>
    </tr>
  </tbody>
</table>
    </div>
</template>

<style scoped>

tr, th, td {
     padding: 10px;
}

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