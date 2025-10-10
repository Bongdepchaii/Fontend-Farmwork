<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const name = ref('')
const birthday = ref('')
const phone = ref('')
const username = ref('')
const password = ref('')
const confirm = ref('')
const message = ref('')

const Register = () => {
    if (name.value === "") {
        message.value = "Ho ten khong duoc de trong"
    }
    else if (birthday.value === "") {
        message.value = "ngay sinh khong duoc de trong"
    }
    else if (phone.value === "") {
        message.value = "So dien thoai khong duoc de trong"
    }
    else if (username.value === "") {
        message.value = "Tai khoan khong duoc de trong"
    }
    else if (password.value === "") {
        message.value = "Mat khau khong duoc de trong"
    }
    else if (confirm.value != password.value) {
        message.value = "Mat khau phai trung khop"
    }
    else {
        const user_register = JSON.parse(localStorage.getItem('users')) || [];
        const new_user = {
            name: name.value,
            birthday: birthday.value,
            phone: phone.value,
            username: username.value,
            password: password.value,
            role: "user"
        };
        user_register.push(new_user);
        localStorage.setItem('users', JSON.stringify(user_register));
        message.value = "Dang ky thanh cong vui long quay lai trang login"
        name.value = '';
        birthday.value = '';
        phone.value = '';
        username.value = '';
        password.value = '';
        confirm.value = '';
    }
}

</script>
<template>
    <form action="">
        <h1>DANG KY</h1>
        <input  class="form-control" type="text" v-model="name" placeholder="Ho va ten">
        <input  class="form-control" type="date" v-model="birthday" placeholder="Ngay sinh">
        <input class="form-control" type="tel" v-model="phone" placeholder="So dien thoai">
        <input class="form-control" type="text" v-model="username" placeholder="Tai khoan">
        <input class="form-control" type="password" v-model="password" placeholder="Mat khau">
        <input class="form-control" type="password" v-model="confirm" placeholder="Xac thuc mat khau">
        <router-link to="Login">Ban co tai khoan?</router-link>
        <input class="btn btn-primary" @click="Register" type="button" value="Dang ky ngay">
        <span class="success">{{ message }}</span>
    </form>
</template>

<style scoped>
form {
    width: 500px;
    margin: 0 auto;
    border: 2px solid blue;
    padding: 20px;
    margin-top: 50px;
}

form input {
    width: 100%;
    display: block;
    margin-top: 15px;
    padding: 7px;
    margin-bottom: 15px;
}

.success {
    color: green;
}
</style>