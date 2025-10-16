<script setup>
import { reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const store = useStore();

const id = route.params.id;
const product = reactive({});

onMounted(() => {
    loadProductData();
});

const loadProductData = async () => {
    if (id) {
        const response = await axios.get(`http://localhost:3000/products/${id}`);
        if (response.status == 200) {
            Object.assign(product, response.data);
        }
    }
};

const goBack = () => {
    router.back();
};

const handleAddToCart = (item) => {
    store.dispatch('addToCart', { product: item, quantity: 1 });
    alert(`Đã thêm "${item.title}" vào giỏ hàng!`);
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
                            <span class="badge bg-secondary mb-2 product-category">Danh muc {{ product.category }}</span>
                            <h1 class="product-title">{{ product.title }}</h1>
                            <p class="product-price">Gia: ${{ product.price }}</p>
                            <p class="product-description">Mota:{{ product.description }}</p>
                        </div>
                        <div class="product-actions mt-auto">
                            <button @click="goBack()" class="btn btn-outline-secondary">
                                Back
                            </button>
                            <button style="margin-left: 15px;" @click="handleAddToCart(product)"
                                class="btn btn-success">
                                Add to cart
                            </button>
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
</style>