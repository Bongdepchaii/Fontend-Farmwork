<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const message = ref('');
// const isAdmin = ref(false);
const user = reactive({
    id: null,
    name: '',
    email: '',
    location: '',
    sex: '',
    age: null,
    favorite: ''
});

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

onMounted(() => {
    const userId = route.params.id;

    if (userId) {
        fetchUserData(userId);
    } else {
        console.error('khong tim thay userid');
        router.push('/')
    }
});

const fetchUserData = async (userId) => {
    try {
        const response = await axios.get(`http://localhost:3000/User/${userId}`);
        if (response.status === 200) {
            Object.assign(user, response.data);
        }
    } catch (error) {
        console.error("error", error);
        message.value = 'error khong tai duoc thong tin nguoi dung'
    }
};

const activeFilter = ref('pending');

const filteredOrders = computed(() => {
    return orders.value.filter(order => order.status === activeFilter.value);
});

const setFilter = (status) => {
    activeFilter.value = status
}




// onMounted(() => {
//     Loaddata()
// })

// const Loaddata = async () => {
//     if(id){
//         const datauser = await axios.get(`http://localhost:3000/User/${id}`);
//         if(datauser.status == 200) {
//             Object.assign(user, datauser.data)
//         }
//     } else {
//         message.value = "khong co du lieu"
//     }
// }

// const fetchUserData = async (userId) => {
//     try {
//         const response = await axios.get(`http://localhost:3000/User/${userId}`);
//         Object.assign(user, response.data);
//         user.password = '';
//     } catch (error) {
//         console.error("Lỗi khi lấy thông tin người dùng:", error);
//         message.value = "Không thể tải được thông tin người dùng.";
//     }
// };

const updateProfile = async () => {

    // const dataToUpdate = { ...user };
    // if (!dataToUpdate.password) {
    //     delete dataToUpdate.password;
    // }

    try {
        const response = await axios.put(`http://localhost:3000/User/${user.id}`, user);
        if (response.status === 200) {
            message.value = 'Update thanh cong';
            if (loggedInUser.value.username !== user.username) {
                const updateLogindata = { ...loggedInUser.value, username: user.username };
                localStorage.setItem('userlogin', JSON.stringify(updateLogindata));
            }
            setTimeout(() => { message.value = '' }, 3000);
        }
    } catch (error) {
        console.error("Loi update thong tin:", error);
        message.value = "Update error, vui long thu lai.";
    }
};

const logout = () => {
    if (confirm("Ban co chac chan muon dang xuat khong")) {
        localStorage.removeItem('userlogin')
        router.push('/')
    }
}
</script>

<template>
    <div class="container py-4 border-bottom mb-5">
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <RouterLink to="/index" style="font-size: 2rem;" class="navbar-brand">TBS</RouterLink>
                <button style="border: none;" class="navbar-toggler">
                    <!-- <li class="nav-item" v-if="isAdmin">
                        <RouterLink to="/product" class="nav-link">Admin</RouterLink>
                    </li> -->
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
                        <li class="nav-item" v-if="isAdmin">
                            <RouterLink to="/product" class="nav-link">Admin</RouterLink>
                        </li>
                    </ul>
                    <ul class="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center">
                        <template v-if="loggedInUser">
                            <li class="nav-item">
                                <RouterLink class="nav-link active" :to="`/userdetail/${loggedInUser.id}`">
                                    Hi, {{ loggedInUser.username }}
                                </RouterLink>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link" @click="logout()">logout</button>
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

    <div class="container py-5" style="max-width: 800px;">
        <div class="card shadow-sm">

            <div class="card-body p-4">
                <div class="row">
                    <div class="col-md-3">
                        <RouterLink class="nav-link" :to="`/history/${loggedInUser.id}`">History order</RouterLink>
                    </div>
                    <div class="col-md-6">
                        <h2 class="card-title mb-4 text-center" style="font-family: 'Times New Roman', Times, serif;">
                            PROFILE</h2>
                    </div>
                </div>
                <form @submit.prevent="updateProfile">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label for="inputName" class="form-label">Name</label>
                            <input type="text" v-model="user.name" class="form-control" id="inputName" value=""
                                required>
                        </div>

                        <div class="col-md-6">
                            <label for="inputUsername" class="form-label">Id user</label>
                            <input type="text" class="form-control" id="inputUsername" :value="user.id" readonly
                                disabled>
                        </div>
                        <div class="col-12">
                            <label for="inputEmail" class="form-label">Email</label>
                            <input type="email" v-model="user.email" class="form-control" id="inputEmail" required>
                        </div>

                        <div class="col-md-6">
                            <label for="inputAge" class="form-label">Age</label>
                            <input type="number" v-model="user.age" class="form-control" id="inputAge"
                                placeholder="Enter age">
                        </div>

                        <div class="col-md-6">
                            <label for="inputSex" class="form-label">Sex</label>
                            <select v-model="user.sex" id="inputSex" class="form-select">
                                <option value="" disabled>Chosee...</option>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                            </select>
                        </div>

                        <div class="col-12">
                            <label for="inputInterests" class="form-label">favorite</label>
                            <input type="text" v-model="user.interests" class="form-control" id="inputInterests"
                                placeholder="iPhone, iPad, Macbook,...">
                        </div>

                        <div class="col-12">
                            <label for="inputLocation" class="form-label">Location</label>
                            <input type="text" v-model="user.location" class="form-control" id="inputLocation"
                                placeholder="">
                        </div>
                    </div>

                    <div class="mt-4">
                        <button type="submit" class="btn btn-primary px-4">Save</button>
                        <span v-if="message" class="ms-3 text-success fw-bold">{{ message }}</span>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
div nav li {
    margin-left: 15px;
    list-style: none;
}

/* .navbar-brand {
    font-weight: bold;
} */

.btn-outline-danger {
    margin-left: 15px;
}
</style>