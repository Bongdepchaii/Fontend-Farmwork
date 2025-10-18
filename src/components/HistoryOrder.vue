<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const orders = ref([])
const message = ref('')

const activeFilter = ref('pending');

const filteredOrders = computed(() => {
    return orders.value.filter(order => order.status === activeFilter.value);
});

const setFilter = (status) => {
    activeFilter.value = status
}

onMounted(() => {
    loadData()
})

const loadData = async () => {
    try {
        const response = await axios.get('http://localhost:3000/orders');
        if (response.status === 200) {
            orders.value = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }
    } catch (error) {
        console.error("erorr load order:", error);
        message.value = "not load order."
    }
}

const handleStatusUpdate = async (item, newStatus) => {
    try {
        // update 1 doi tuong dung patch
        const response = await axios.patch(`http://localhost:3000/orders/${item.id}`, {
            status: newStatus
        });

        if (response.status === 200) {
            // update status order khong can goi api 
            const index = orders.value.findIndex(order => order.id === item.id);
            if (index !== -1) {
                orders.value[index].status = newStatus;
            }
            message.value = `Update order #${item.id} successfly`;
            //   tu dong hide thong bao sau 3 sec
            setTimeout(() => message.value = '', 3000);
        }
    } catch (error) {
        console.error(`Error update order product #${item.id}:`, error);
        message.value = "Update that bai, vui long thu lai!"
    }
}

// code formata date
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// user admin
const loggedInUser = computed(() => {
    const userData = localStorage.getItem('userlogin');
    return userData ? JSON.parse(userData) : null;
});

const isAdmin = computed(() => {
    return loggedInUser.value && loggedInUser.value.role.toLowerCase() === 'admin';
});

const logout = () => {
    if (confirm("Ban chac chan muon dang xuat?")) {
        localStorage.removeItem('userlogin')
        router.push('/')
    }
}
</script>

<template>
    <div class="container py-4 border-bottom mb-5">
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <RouterLink to="/Index" class="navbar-brand fs-3">TBS</RouterLink>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarNavContent">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNavContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item" v-if="isAdmin">
                            <RouterLink to="/product" class="nav-link">Admin</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink to="/user" class="nav-link">User</RouterLink>
                        </li>
                    </ul>
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



    <div class="container py-5">
        <h1 style="font-family: 'Times New Roman', Times, serif;">HISTORY</h1>
        <br>
        <nav class="navbar navbar-expand-lg navbar-light bg-light rounded mb-4">
            <div class="container-fluid">
                <div class="collapse navbar-collapse">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a href="#" class="nav-link" :class="{ 'active fw-bold': activeFilter === 'pending' }"
                                @click.prevent="setFilter('pending')">Pending</a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="nav-link" :class="{ 'active fw-bold': activeFilter === 'confirm' }"
                                @click.prevent="setFilter('confirm')">Confirm</a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="nav-link" :class="{ 'active fw-bold': activeFilter === 'shipping' }"
                                @click.prevent="setFilter('shipping')">Shipping</a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="nav-link" :class="{ 'active fw-bold': activeFilter === 'completed' }"
                                @click.prevent="setFilter('completed')">Completed</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        <div v-if="message" class="alert alert-success" role="alert">
            {{ message }}
        </div>

        <table class="table table-hover align-middle">
            <thead class="table-dark">
                <tr>
                    <th scope="col">Stt</th>
                    <th scope="col">id User</th>
                    <th scope="col">id Order</th>
                    <th scope="col">Name </th>
                    <th scope="col">Phone</th>
                    <th scope="col">Address</th>
                    <th scope="col">Payment</th>
                    <th scope="col">Date created</th>
                    <th scope="col">Total</th>
                    <th scope="col">Status</th>
                    <th scope="col">ACT</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in filteredOrders" :key="item.id">
                    <th scope="row">{{ index + 1 }}</th>
                    <th>#{{ item.user_id }}</th>
                    <th>#{{ item.id }}</th>
                    <td>{{ item.name }}</td>
                    <td>{{ item.sdt }}</td>
                    <td>{{ item.address }}</td>
                    <td>{{ item.pay_type }}</td>
                    <!-- code formata date  -->
                    <td>{{ formatDate(item.created_at) }}</td>
                    <!-- format num -->
                    <td>{{ item.total.toLocaleString() }} $</td>
                    <td><span class="badge bg-info text-dark">{{ item.status }}</span></td>
                    <td>
                        <div class="btn-group">
                            <button v-if="item.status === 'pending'" class="btn btn-sm btn-success"
                                @click="handleStatusUpdate(item, 'confirm')">Done</button>
                            <button v-else-if="item.status === 'confirm'" class="btn btn-sm btn-success"
                                @click="handleStatusUpdate(item, 'shipping')">Done</button>
                            <button v-else-if="item.status === 'shipping'" class="btn btn-sm btn-success"
                                @click="handleStatusUpdate(item, 'completed')">Done</button>
                            <span v-else-if="item.status === 'completed'" class="badge bg-success">Ship product
                                complete</span>
                        </div>
                    </td>
                </tr>
                <tr v-if="filteredOrders.length === 0">
                    <td colspan="10" class="text-center text-muted">Khong co don hang nao.</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
body {
    background-color: #f8f9fa;
}

div nav li {
    list-style: none;
    font-size: 1rem;
}

table {
    font-size: 0.9rem !important;
}

.btn-group .btn {
    font-size: 0.8rem;
}
</style>