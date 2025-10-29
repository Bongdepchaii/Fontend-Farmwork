<script setup>
import { reactive, onMounted, ref, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const store = useStore();

const product = reactive({});
const productCategory = ref([]);
const feedbacks = ref([]);
const comment = ref('');
const comments = ref([]);


const loadProductData = async (productId) => {
    if (productId) {
        const response = await axios.get(`http://localhost:3000/products/${productId}`);
        if (response.status == 200) {
            Object.assign(product, response.data);
            await loadRelatedProducts(product.category, product.id);
            await loadFeedbacks(productId);
            await loadComments(productId);
        }
    }
};

onMounted(async () => {
    await loadProductData(route.params.id);
});

watch(() => route.params.id, async (idnew) => {
    if (idnew) {
        await loadProductData(idnew);
        window.scrollTo(0, 0);
    }
});

const loadComments = async (productId) => {
    if (!productId) return;
    try {
        const response = await axios.get(`http://localhost:3000/comment?productId=${productId}`);
        if (response.status === 200) {
            comments.value = response.data; 
        }
    } catch (error) {
        console.error("Loi khi tai binh luan:", error);
    }
};

const loadFeedbacks = async (productId) => {
    if (!productId) return;
    try {
        const response = await axios.get(`http://localhost:3000/feedback?productId=${productId}`);

        feedbacks.value = response.data;

    } catch (error) {
        console.error("Loi khi tai danh gia:", error);
    }
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

const loadRelatedProducts = async (category, currentProductId) => {
    if (category) {
        try {
            const response = await axios.get(`http://localhost:3000/products?category=${category}&id_ne=${currentProductId}&_limit=4`);
            if (response.status === 200) {
                productCategory.value = response.data;
            }
        } catch (error) {
            console.error("Error khong tai duoc san pham lien quan:", error);
        }
    }
};

const goBack = () => {
    router.back();
};

const loggedInUser = computed(() => {
    const userData = localStorage.getItem('userlogin');
    if (userData) {
        return JSON.parse(userData);
    }
    return null;
});

const submitComment = async () => {
    if (!loggedInUser.value) {
        alert('you not login? login now!');
        router.push('/login');
        return;
    }
    if (!comment.value || comment.value.trim() === '') {
        alert('text not empty.');
        return;
    }
    const payload = {
        productId: product.id,
        userId: loggedInUser.value.id,
        username: loggedInUser.value.username,
        text: comment.value,
        created_at: new Date().toISOString()
    };

    try {
        const response = await axios.post('http://localhost:3000/comment', payload);
        if (response.status === 201) {
            await loadComments(product.id);
            comment.value = '';
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error comment.');
    }
};

const addToFavorites = async (product) => {

    if (!loggedInUser.value) {
        if (confirm('You can login will add favorite here')) {
            router.push('/login')
        }
    } else {

        const userId = loggedInUser.value.id;

        const payload = {
            userId: userId,
            productId: product.id,
            product: product,
            added_at: new Date().toISOString()
        };

        try {
            const response = await axios.post('http://localhost:3000/favorite', payload);
            if (response.status === 201) {
                alert(`add "${product.title}" favorite successfly!`);
            }
        } catch (error) {
            console.error('Error add product to favirite', error);
            alert('Erorr add favorite try again.');
        }
    }
};

const addProductToCart = async (product) => {
    if (!localStorage.getItem('userlogin')) {
        if (confirm('chua dang nhap? hay dang nhap')) {
            router.push('/login');
        }
        return;
    }

    if (product.quantity <= 0) {
        alert("Product het hang not order");
        return;
    }

    try {

        await store.dispatch('addToCart', {
            product: { ...product },
            quantity: 1
        });

        alert(`add "${product.title}" to cart!`);

    } catch (error) {
        console.error("error cart", error);
        alert("error xay ra khi them vao gio.");
    }
};


</script>

<template>
    <div class="container my-5">
        <div class="card shadow-sm product-detail-card">
            <div class="card-body">
                <div class="row g-4">
                    <div class="col-md-6 text-center">
                        <img :src="product.image" :alt="product.title" class="product-image img-fluid rounded" />
                    </div>

                    <div class="col-md-6 d-flex flex-column">
                        <div class="product-info">
                            <span class="badge bg-secondary mb-2 product-category">Danh muc {{ product.category
                            }}</span>
                            <h1 class="product-title">{{ product.title }}</h1>
                            <p class="product-price">Gia: ${{ product.price }}</p>
                            <div v-if="product.quantity !== undefined" class="mb-3">
                                <div v-if="product.quantity <= 0" class="alert alert-danger" role="alert">
                                    <strong>not empty product</strong>.
                                </div>
                                <div v-else-if="product.quantity <= 3" class="alert alert-warning" role="alert">
                                    Almost out of stock! Shop have quantity <strong>{{ product.quantity }}</strong>
                                    product!
                                </div>
                            </div>

                            <p class="product-description">Mota: {{ product.description }}</p>
                        </div>
                        <div class="product-actions mt-auto ">
                            <button @click="goBack()" class="btn btn-outline-secondary">
                                Back
                            </button>
                            <button style="margin-left: 15px;" @click="addToFavorites(product)"
                                class="btn btn-outline-danger" title="Yêu thích">
                                Add to favorite
                            </button>
                            <button v-if="product.quantity > 0" style="margin-left: 15px;"
                                @click="addProductToCart(product)" class="btn"
                                :class="product.quantity > 0 ? 'btn-success' : 'btn-secondary'"
                                :disabled="product.quantity <= 0">
                                <span>Add to cart</span>
                            </button>
                            <span v-else style="margin-left: 15px;" class="alert alert-warning">not order</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="product-reviews mt-5">
            <h2 class="mb-4">Comment</h2>
            <form @submit.prevent="submitComment" class="mb-4">
                <div class="mb-3">
                    <label for="commentText" class="form-label">Text comment</label>
                    <textarea v-model="comment" class="form-control" id="commentText" rows="3"
                        placeholder="Enter the text"></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Sent</button>
            </form>
            <div v-if="comments.length > 0">
                <div v-for="c in comments" :key="c.id" class="card mb-3 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <h5 class="card-title mb-1">{{ c.username }}</h5>
                            <small class="text-muted">{{ formatDate(c.created_at) }}</small>
                        </div>
                        <p class="card-text mt-2">{{ c.text }}</p>
                    </div>
                </div>
            </div>
            <div v-else>
                <p class="alert alert-primary">No anymore comment product here!.</p>
            </div>
        </div>
        <hr>
        <div class="product-reviews mt-5">
            <h2 class="mb-4">Feed back!</h2>
            <div v-if="feedbacks.length > 0">
                <div v-for="fb in feedbacks" :key="fb.id" class="card mb-3 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <h5 class="card-title mb-1">{{ fb.username }}</h5>
                            <small class="text-muted">{{ formatDate(fb.created_at) }}</small>
                        </div>
                        <p class="card-text mt-2">{{ fb.review }}</p>
                    </div>
                </div>
            </div>
            <div v-else>
                <p class="text-muted">not empty feed back product here</p>
            </div>
        </div>
        <hr>
        <div v-if="productCategory.length > 0" class="related-products mt-5">
            <h2 class="mb-4">Prouduct lien quan</h2>
            <div class="row">
                <div v-for="related in productCategory" :key="related.id" class="col-md-3">
                    <div class="card h-100 shadow-sm">
                        <img :src="related.image" class="card-img-top related-product-image" :alt="related.title">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">{{ related.title }}</h5>
                            <p class="card-text fw-bold text-danger mt-auto">Price: ${{ related.price }}</p>
                            <p class="card-text text-success mt-auto">Mo ta: {{ related.description }}</p>

                            <RouterLink :to="`/product-detail/${related.id}`"
                                class="btn btn-sm btn-outline-primary stretched-link">
                                check
                            </RouterLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.product-detail-card {
    border: none;
    padding: 1.5rem;
}

.product-image {
    max-height: 450px;
    width: auto;
    max-width: 100%;
    object-fit: contain;
}

.product-info {
    flex-grow: 1;
}

.product-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
}

.product-price {
    font-size: 2rem;
    font-weight: bold;
    color: #dc3545;
    margin-bottom: 1.5rem;
}

.product-category {
    font-size: 0.9rem;
}

.product-description {
    font-size: 1.1rem;
    line-height: 1.6;
    color: #6c757d;
}

.product-actions {
    padding-top: 1.5rem;
    border-top: 1px solid #eee;
}

.related-product-image {
    height: 200px;
    object-fit: contain;
    padding: 1rem;
}
</style>