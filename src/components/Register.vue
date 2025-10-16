<script setup>
import axios from 'axios'
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
// import { router } from 'json-server'

// Dùng ref cho message để hiển thị thông báo
const message = ref('')

// userouter
const router = useRouter()
const route = useRoute()

// Gom tất cả dữ liệu form vào một object reactive
const user = reactive({
    id: Math.ceil(Math.random() * 1000000),
    name: "",
    birthday: "", 
    phone: "",    
    email: "",    
    username: "",
    password: "",
    confirm_password: "", 
    createtime: new Date(),
})

const Register = async () => {
    if (user.name === "") {
        message.value = "ten khong duoc de trong"
    }
    else if (user.birthday === "") {
        message.value = "ngay sinh khong duoc de trong"
    }
    else if (user.phone === "") {
        message.value = "sdt khong duoc de trong"
    }
    else if (user.username === "") {
        message.value = "tai khoan khong duoc de trong"
    }
    else if (user.password === "") {
        message.value = "password khong duoc de trong"
    }
    else if (user.confirm_password !== user.password) {
        message.value = "password phai trung khop"
    } else {
        const new_user = {
            id: user.id,
            name: user.name,
            birthday: user.birthday,
            phone: user.phone,
            email: user.email,
            username: user.username, 
            password: user.password,
            createtime: user.createtime.toISOString(), 
            role: "user"
        }

        try {
            const response = await axios.post('http://localhost:3000/User', new_user);
            console.log(response);
            if (response.status === 201) {
                message.value = "Dang ky thanh cong!"
            }
        } catch (error) {
            console.error("error:", error);
            message.value = "Loi dang ky thu lai."
        }
    }
}


// localstorage
// const name = ref('')
// const birthday = ref('')
// const phone = ref('')
// const username = ref('')
// const password = ref('')
// const confirm = ref('')
// const message = ref('')

// const Register = () => {
// if (name.value === "") {
//     message.value = "Ho ten khong duoc de trong"
// }
// else if (birthday.value === "") {
//     message.value = "ngay sinh khong duoc de trong"
// }
// else if (phone.value === "") {
//     message.value = "So dien thoai khong duoc de trong"
// }
// else if (username.value === "") {
//     message.value = "Tai khoan khong duoc de trong"
// }
// else if (password.value === "") {
//     message.value = "Mat khau khong duoc de trong"
// }
// else if (confirm.value != password.value) {
//     message.value = "Mat khau phai trung khop"
// }
//     else {
//         const user_register = JSON.parse(localStorage.getItem('users')) || [];
//         const new_user = {
//             name: name.value,
//             birthday: birthday.value,
//             phone: phone.value,
//             username: username.value,
//             password: password.value,
//             role: "user"
//         };
//         user_register.push(new_user);
//         localStorage.setItem('users', JSON.stringify(user_register));
//         message.value = "Dang ky thanh cong vui long quay lai trang login"
//         name.value = '';
//         birthday.value = '';
//         phone.value = '';
//         username.value = '';
//         password.value = '';
//         confirm.value = '';
//     }
// }





</script>
<template>
    <form @submit.prevent="Register">
        <h1>DANG KY</h1>
        <input class="form-control" type="text" v-model="user.name" placeholder="ho va ten">
        <input class="form-control" type="date" v-model="user.birthday">
        <input class="form-control" type="tel" v-model="user.phone" placeholder="sdt">
        <input class="form-control" type="email" v-model="user.email" placeholder="email">
        <input class="form-control" type="text" v-model="user.username" placeholder="username">
        <input class="form-control" type="password" v-model="user.password" placeholder="password">
        <input class="form-control" type="password" v-model="user.confirm_password" placeholder="confirm pasword">
        <a href="#" @click="router.back()">Ban co tai khoan?</a><br>
        <button style="margin-top: 15px;" class="btn btn-primary" type="submit">Dang ky</button><br>
        <span class="success">{{ message }}</span>
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

.success {
    color: green;
}
</style>