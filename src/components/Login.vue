<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const message = ref('')
const successfly = ref(false)
const storageuser = JSON.parse(localStorage.getItem('users')) || []

const login = () => {

    // delete thong bao cu
    message.value = ""

    if (username.value === "") {
        message.value = "Tai khoan khong duoc de trong"
        successfly.value = false
        return
    }
    if (password.value === "") {
        message.value = "Mat khau khong duoc de trong"
        successfly.value = false
        return
    }
    const founduser = storageuser.find(
        user => user.username === username.value && user.password === password.value
    )
    if (founduser) {
        localStorage.setItem('userlogin', JSON.stringify({
            username: founduser.username,
            role: founduser.role,
        }))

        if (founduser.role === 'admin') {
            router.push('Product')
        } else {
            router.push('Index')
        }

    } else {
        message.value = "Tài khoản hoặc mật khẩu của bạn sai, vui lòng nhập lại!"
    }
}

</script>
<template>
    <form action="">
        <h1>DANG NHAP</h1>
        <input type="text" v-model="username" placeholder="Tai khoan">
        <input type="password" v-model="password" placeholder="Mat khau">
        <router-link to="Register">Ban chua co tai khoan?</router-link>
        <input class="btn btn-primary" @click="login" type="button" value="Dang nhap">
        <span class="message">{{ message }}</span>
    </form>
</template>

<style scoped>
form {
    width: 500px;
    margin: 0 auto;
    box-shadow: 0px 0px 4px black;
    padding: 20px;
    margin-top: 50px;
}

h1{
    font-size: 1.7rem;
}

form input {
    width: 100%;
    display: block;
    margin-top: 15px;
    padding: 7px;
    margin-bottom: 15px;
}

.message {
    color: red;
}
</style>