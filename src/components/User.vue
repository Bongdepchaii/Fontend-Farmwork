<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const edit = ref(false)
const users = ref([])
const roles = ref(['admin', 'user'])

const user = reactive({
  id: null,
  role: '',
})

// Load du lieu
onMounted(async () => {
  await Loadulieu()
})

// load du lieu
const Loadulieu = async () => {
  console.log(`the component is now mounted.`)
  const response = await axios.get('http://localhost:3000/User');
  if (response.status == 200) {
    users.value = response.data
  }
}

// Xoa du lieu
const deleteUser = async (id) => {
  //b1 
  const isConfirm = confirm(`Ban muon xoa user: ${id}?`)
  if (isConfirm) {
    //b2:
    const response = await axios.delete(`http://localhost:3000/User/${id}`);
    if (response.status == 200) {
      await Loadulieu()
      // Thong bao du lieu xoa bang code alert
      alert('Delete success')
    }
  }
}

// Edit du lieu
const editUser = (item) => {
  user.id = item.id,
    user.role = item.role
  edit.value = true
}

const submit = async () => {

  if (!edit.value) {
    alert("de edit dc vui long edit user ma ban muon chinh sua.");
    return;
  }

  if (user.role === "") {
    alert('vui long chọn role.');
    return;
  }
  const userResponse = await axios.get(`http://localhost:3000/User/${user.id}`);
  const updatedUser = { ...userResponse.data, role: user.role };
  const response = await axios.put(`http://localhost:3000/User/${user.id}`, updatedUser);

  if (response.status === 200) {
    alert(`update user id ${user.id} successfly`);
    Loadulieu();
    reset();
  }
};



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

const reset = () => {
  window.location.href = 'User'
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
        <li class="nav-item">
          <RouterLink style="margin-left: 15px;" to="HistoryOrder" class="nav-link" aria-current="page">History
          </RouterLink>
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
  <div class="container py-5" style="margin-top: 15px;">
          <h1 style="font-family: 'Times New Roman', Times, serif;">USER</h1>
            <br>
    <div class="row">
      <div style="box-shadow: 0px 0px 3px black;" class="col-md-8">
        <table class="table table-sm">
          <thead>
            <tr>
              <th scope="col">id</th>
              <th scope="col">Username</th>
              <th scope="col">Email</th>
              <th scope="col">Sex</th>
              <th scope="col">Role</th>
              <th scope="col">ACT</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in users" :key="item.id">
              <th scope="row">{{ item.id }}</th>
              <td>{{ item.username }}</td>
              <td>{{ item.email }}</td>
              <td>{{ item.sex || 'Chua cap nhat' }}</td>
              <td>{{ item.role }}</td>
              <td>
                <button @click="editUser(item)" style="margin-right: 5px;" class="btn btn-info">Edit</button>
                <button @click="deleteUser(item.id)" class="btn btn-danger">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col-md-4">
        <div class="card shadow-sm sticky-col" id="editForm">
          <div class="card-header">Edit User</div>
          <div class="card-body">
            <form @submit.prevent="submit" class="form">
              <fieldset :disabled="!edit">
                <div class="mb-3">
                  <label for="userId" class="form-label">User ID (Editing)</label>
                  <input type="text" v-model="user.id" id="userId" class="form-control" readonly>
                </div>

                <div class="mb-3">
                  <label for="pCategory" class="form-label">Edit Role</label>
                  <select v-model="user.role" id="pCategory" class="form-select" name="category">
                    <option value="" disabled>Choose...</option>
                    <option v-for="roleValue in roles" :key="roleValue" :value="roleValue">
                      {{ roleValue }}
                    </option>
                  </select>
                </div>

                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-primary">Save Changes</button>
                  <button type="button" @click="reset()" class="btn btn-outline-secondary">Reset</button>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
tr,
th,
td {
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