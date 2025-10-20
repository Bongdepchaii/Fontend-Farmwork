<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const message = ref('');
const orders = ref([])
const userFeedbacks = ref([])
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
            await fetchUserOrders(userId);
            await fetchUserFeedbacks(userId);
        }
    } catch (error) {
        console.error("error", error);
        message.value = 'error khong tai duoc thong tin nguoi dung'
    }
};

const fetchUserOrders = async (userId) => {
    try {
        const response = await axios.get(`http://localhost:3000/orders?user_id=${userId}`)
        if (response.status === 200) {
            orders.value = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }
    } catch (error) {
        console.error('error load order:', error);
        message.value = "not load history order";
    }
}

const fetchUserFeedbacks = async (userId) => {
    try {
        const response = await axios.get(`http://localhost:3000/feedback?userId=${userId}`);
        if (response.status === 200) {
            userFeedbacks.value = response.data;
        }
    } catch (error) {
        console.error('Loi khi tai feedback cua user:', error);
    }
};

const isProductReviewedInOrder = (orderId, productId) => {
    return userFeedbacks.value.some(fb => fb.orderId === orderId && fb.productId === productId);
};

const canReviewAnyProductInOrder = (order) => {
    if (!order || !order.items || order.items.length === 0) {
        return false;
    }
    return order.items.some(item => !isProductReviewedInOrder(order.id, item.id));
};

const handleCancelOrder = async (item) => {
    if (confirm("Are u sure remove order here?")) {
        try {
            const response = await axios.patch(`http://localhost:3000/orders/${item.id}`, {
                status: 'cancelled'
            });
            if (response.status === 200) {
                message.value = "Remove successfly.";
                const index = orders.value.findIndex(order => order.id === item.id);
                if (index !== -1) {
                    orders.value[index].status = 'cancelled';
                }
                setTimeout(() => message.value = '', 3000);
            }
        } catch (error) {
            console.error("Error remove:", error);
            message.value = "Error remove order, please try again.";
        }
    }
};

// History.vue

const goToReview = async (item) => { // 'item' la OBJECT DON HANG

    let productIdToReview = null;
    let availableProductsToReview = []; // Mang luu cac san pham chua review

    // Loc ra cac san pham chua duoc review trong don hang nay
    if (item.items && item.items.length > 0) {
        availableProductsToReview = item.items.filter(product => !isProductReviewedInOrder(item.id, product.id));
    }

    // Neu khong con san pham nao de review (mac du nut van hien - truong hop hiem)
    if (availableProductsToReview.length === 0) {
         alert("Tat ca san pham trong don hang nay da duoc danh gia.");
         return;
    } 
    // Neu chi con 1 san pham chua review
    else if (availableProductsToReview.length === 1) {
        productIdToReview = availableProductsToReview[0].id;
        console.log("Chi con 1 san pham:", availableProductsToReview[0].name); // Log ten sp
    } 
    // Neu con nhieu san pham chua review
    else {
        let productOptions = "Chon san pham ban muon danh gia:\n";
        availableProductsToReview.forEach((product, index) => {
            productOptions += `${index + 1}. ${product.name}\n`; 
        });
        productOptions += `\nVui long chon so thu tu:`;

        let choice = prompt(productOptions); 
        let choiceIndex = parseInt(choice) - 1; 

        if (!isNaN(choiceIndex) && choiceIndex >= 0 && choiceIndex < availableProductsToReview.length) {
            productIdToReview = availableProductsToReview[choiceIndex].id; 
        } else {
            alert("Lua chon khong hop le.");
            return; 
        }
    }
   
    // --- Phan gui feedback giu nguyen ---
    if (!productIdToReview) { 
         alert("Khong xac dinh duoc san pham de danh gia.");
         return;
    }

 const reviewText = prompt(`Vui long nhap danh gia cho san pham vua chon (trong don hang #${item.id}):`);

    if (reviewText && reviewText.trim() !== "") {
        const feedbackPayload = {
            orderId: item.id, // Van luu orderId de biet feedback nay tu don hang nao
            productId: productIdToReview, 
            userId: user.id,
            username: user.name, // Nen dung user.username neu co
            review: reviewText,
            created_at: new Date().toISOString()
        };

        try {
            const response = await axios.post('http://localhost:3000/feedback', feedbackPayload);
            if (response.status === 201) {
                message.value = "Gui danh gia thanh cong!";
                userFeedbacks.value.push(response.data);
                setTimeout(() => message.value = '', 3000);
            }
        } catch (error) {
            console.error("LOI KHI GUI DANH GIA:", error);
            message.value = "Gui danh gia that bai.";
        }
    } else if (reviewText !== null) { 
        alert("Ban chua nhap noi dung danh gia.");
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

<div class="container py-5" style="max-width: 1000px;"> 
        <div class="card shadow-sm">
            <div class="card-body p-4">
                <div v-if="message" class="alert alert-info" role="alert">
                    {{ message }}
                </div>

                <table class="table table-hover align-middle">
                    <thead class="table-dark">
                        <tr>
                            <th scope="col">Stt</th>
                            <th scope="col">Id Order</th>
                            <th scope="col">San pham</th>
                            <th scope="col">Date created</th>
                            <th scope="col">Total</th>
                            <th scope="col">Status</th>
                            <th scope="col" class="text-center">Act</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in orders" :key="item.id">
                            <th scope="row">{{ index + 1 }}</th>
                            <th>#{{ item.id }}</th>
                            <td>
                                <div v-for="product in item.items" :key="product.id" class="mb-1">
                                    <RouterLink :to="`/product-detail/${product.id}`" class="text-dark text-decoration-none">
                                        {{ product.name }}
                                    </RouterLink>
                                    <small class="text-muted"> (x{{ product.quantity }})</small>
                                </div>
                            </td>
                            <td>{{ formatDate(item.created_at) }}</td>
                            <td>{{ item.total.toLocaleString() }} $</td>
                            <td>
                                <span v-if="item.status === 'pending'" class="badge bg-warning text-dark">{{ item.status }}</span>
                                <span v-else-if="item.status === 'confirm'" class="badge bg-info text-dark">{{ item.status }}</span>
                                <span v-else-if="item.status === 'shipping'" class="badge bg-primary">{{ item.status }}</span>
                                <span v-else-if="item.status === 'completed'" class="badge bg-success">{{ item.status }}</span>
                                <span v-else-if="item.status === 'cancelled'" class="badge bg-danger">{{ item.status }}</span>
                                <span v-else class="badge bg-secondary">{{ item.status }}</span>
                            </td>

                            <td class="text-center">
                                <button v-if="item.status === 'pending'" 
                                        class="btn btn-sm btn-outline-danger"
                                        @click="handleCancelOrder(item)">
                                    Remove
                                </button>
                                
                                <template v-else-if="item.status === 'completed'">
                                    <span v-if="!canReviewAnyProductInOrder(item)" class="badge bg-secondary"> 
                                        done feedback
                                    </span>
                                    <button v-else class="btn btn-sm btn-outline-primary" @click="goToReview(item)">
                                        Feed back
                                    </button>
                                </template>

                                <span v-else class="text-muted">not act</span>
                            </td>
                            </tr>
                        <tr v-if="orders.length === 0">
                            <td colspan="8" class="text-center text-muted">Ban chua co don hang nao.</td>
                        </tr>
                    </tbody>
                </table>
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