<script setup>
import { ref, reactive } from 'vue'

const soluongtonkho = 15
const product = ref(0)

const tang = () => {
    if (product.value < soluongtonkho) {
        product.value++
    } else {
        alert("ban them qua so luong ton kho")
    }
}
const giam = () => {
    if (product.value >= 1) {
        product.value--
    } else {
        alert("Khong duoc phep giam duoi 0")
    }
}

// Bai 2
const user = reactive({
    name: '',
    age: null,
    email: ''
})

const updateUser = () => {
    if (!user.name || !user.email.includes('@')) {
        alert('Dữ liệu không hợp lệ!')
        return
    }
    alert('Cập nhật thành công!')
}

// Bai 3
const oneWayText = ref('Đây là one-way binding')
const twoWayText = ref('Đây là two-way binding')

</script>
<template>
    <!-- Bai 1 -->
    <div class="container">
        <center class="lab-2">
            <h1>Bai 1</h1>
            <strong>iPhone 15 pro max - 256GB</strong>
            <p>Color: Blue titan</p>
            <p class="dem">So luong dang ton trong kho: {{ soluongtonkho }}</p>
            <p>
                <button class="btn btn-danger" @click="giam"> - </button>
                <button class="btn btn-success" @click="tang">+</button>
                <strong>{{ product }}</strong>
            </p>
        </center>
    </div>

    <!-- Bai 2 -->
    <!-- <div class="container">
        <center>
            <form @submit.prevent="updateUser">
                <input v-model="user.name" placeholder="Tên">
                <input v-model="user.age" placeholder="Tuổi" type="number">
                <input v-model="user.email" placeholder="Email">
                <button type="submit">Cập nhật</button>
            </form>
        </center>
    </div> -->

    <!-- Bai 3 -->
<!-- <div class="container">
  <center>
    <h2>Bài 3: One-way & Two-way Binding</h2>

    <h4>One-way binding (chỉ hiển thị):</h4>
    <p>{{ oneWayText }}</p>

    <h4>Two-way binding (có thể chỉnh sửa):</h4>
    <input v-model="twoWayText" placeholder="Nhập nội dung...">
    <p>Kết quả: {{ twoWayText }}</p>
  </center>
</div> -->

</template>
<style>
.lab-2 button {
    margin: 5px 5px;
}

.lab-2 .dem {
    font-weight: 500 !important;
    font-size: 1.3rem;
}
</style>