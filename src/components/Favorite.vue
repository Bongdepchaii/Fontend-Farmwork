<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const message = ref('');
const favorites = ref([]) 

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
    if (confirm("Ban co chac chan muon dang xuat khong")) {
        localStorage.removeItem('userlogin')
        router.push('/')
    }
}


onMounted(() => {
    if (loggedInUser.value && loggedInUser.value.id) {
        fetchFavorites(loggedInUser.value.id);
    } else {
        message.value = 'Do not login, Login now!';
        setTimeout(() => {
            router.push('/login');
        }, 2000);
    }
});

// get favorite
const fetchFavorites = async (userId) => {
    try {
        const response = await axios.get(`http://localhost:3000/favorite?userId=${userId}`)
        if (response.status === 200) {
            favorites.value = response.data.sort((a, b) => new Date(b.added_at) - new Date(a.added_at));
        }
    } catch (error) {
        console.error('Lỗi khi tải danh sách yêu thích:', error);
        message.value = "Không thể tải danh sách yêu thích.";
    }
}

// remove favorte
const handleRemoveFavorite = async (item) => {
    if (confirm(`Are you sure remove "${item.product.title}" list favorite?`)) {
        try {
            const response = await axios.delete(`http://localhost:3000/favorite/${item.id}`);
            
            if (response.status === 200) {
                message.value = "Remove successfly.";
                
                favorites.value = favorites.value.filter(fav => fav.id !== item.id);
                
                setTimeout(() => message.value = '', 3000);
            }
        } catch (error) {
            console.error("Lỗi khi xoá:", error);
            message.value = "Lỗi khi xoá, vui lòng thử lại.";
        }
    }
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}
</script>

<template>
    <div class="container py-4 border-bottom mb-5">
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <RouterLink to="/index" style="font-size: 2rem;" class="navbar-brand">TBS</RouterLink>
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

    <div class="container py-5" style="max-width: 1000px;">
        <h2 class="mb-4">My favorite</h2>
        <div class="card shadow-sm">
            <div class="card-body p-4">
                <div v-if="message" class="alert alert-info" role="alert">
                    {{ message }}
                </div>

                <table class="table table-hover align-middle">
                    <thead class="table-dark">
                        <tr>
                            <th scope="col">Stt</th>
                            <th scope="col" colspan="2">Product</th>
                            <th scope="col">Price</th>
                            <th scope="col">Date</th>
                            <th scope="col" class="text-center">ACT</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in favorites" :key="item.id">
                            <th scope="row">{{ index + 1 }}</th>
                            <td style="width: 80px;">
                                <img :src="item.product.image" class="product-image" alt="item.product.title">
                            </td>
                            <td>
                                <RouterLink :to="`/product-detail/${item.productId}`"
                                    class="text-dark text-decoration-none fw-bold">
                                    {{ item.product.title }}
                                </RouterLink>
                                <br>
                                <small class="text-muted">{{ item.product.category }}</small>
                            </td>
                            <td>{{ item.product.price.toLocaleString() }} $</td>
                            <td>{{ formatDate(item.added_at) }}</td>
                            <td class="text-center">
                                <button class="btn btn-sm btn-outline-danger"
                                    @click="handleRemoveFavorite(item)">
                                    Xoá
                                </button>
                            </td>
                        </tr>
                        <tr v-if="favorites.length === 0">
                            <td colspan="6" class="text-center text-muted">There are no favorite products here</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Style (Copy từ history.vue) */
div nav li {
    margin-left: 15px;
    list-style: none;
}

.btn-outline-danger {
    margin-left: 15px;
}

/* Thêm style cho ảnh sản phẩm trong bảng */
.product-image {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #eee;
}
</style>