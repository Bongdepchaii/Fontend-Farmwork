<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const username = ref('')
const password = ref('')
const message = ref('')

const login = async () => {
    message.value = ""
    if (username.value === "") {
        message.value = "tai khoan khong duoc de trong"
        return
    }
    if (password.value === "") {
        message.value = "password khong duoc de trong"
        return
    }
    try {
        const response = await axios.get('http://localhost:3000/User');
        const allUsers = response.data;

        const foundUser = allUsers.find(
            user => user.username === username.value && user.password === password.value
        );

        if (foundUser) {
            localStorage.setItem('userlogin', JSON.stringify({
                id: foundUser.id,
                username: foundUser.username,
                role: foundUser.role,
            }));
            if (foundUser.role.toLowerCase() === 'admin') {
                router.push({ name: 'Product' });
            } else {
                router.push({ name: 'Index' });
            }
        } else {
            message.value = "Sai tai khoan va mat khau";
        }
    } catch (error) {
        message.value = "Loi.";
    }
}



// LUU DANG LOCAL STORAGE
// const username = ref('')
// const password = ref('')
// const message = ref('')
// const successfly = ref(false)
// const storageuser = JSON.parse(localStorage.getItem('users')) || []

// const login = () => {

//     // delete thong bao cu
//     message.value = ""

//     if (username.value === "") {
//         message.value = "Tai khoan khong duoc de trong"
//         successfly.value = false
//         return
//     }
//     if (password.value === "") {
//         message.value = "Mat khau khong duoc de trong"
//         successfly.value = false
//         return
//     }
//     const founduser = storageuser.find(
//         user => user.username === username.value && user.password === password.value
//     )
//     if (founduser) {
//         localStorage.setItem('userlogin', JSON.stringify({
//             username: founduser.username,
//             role: founduser.role,
//         }))

//         if (founduser.role === 'Admin') {
//             router.push('Product')
//         } else {
//             router.push('Index')
//         }

//     } else {
//         message.value = "Tài khoản hoặc mật khẩu của bạn sai, vui lòng nhập lại!"
//     }
// }

</script>
<template>
    <form action="">
        <h1>DANG NHAP</h1>
        <input class="form-control" type="text" v-model="username" placeholder="Tai khoan">
        <input class="form-control" type="password" v-model="password" placeholder="Mat khau">
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

h1 {
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