<script setup>
import { ref } from 'vue'

const username = ref('')
const password = ref('')
const message = ref('')
const successfly = ref(false)

const login = () => {
    if(username.value === ""){
        message.value = "Tai khoan khong duoc de trong"
    }
    else if (password.value === ""){
        message.value = "Mat khau khong duoc de trong"
    }
    else if (username.value === "Admin" && password.value === "Abcd@1234"){
        message.value = "Dang nhap thanh cong"
        successfly.value = true
    }
    else {
        message.value = "Dang nhap that bai =(("
        successfly.value = false
    }
}

</script>
<template>
        <form action="">
            <h1>LOGIN</h1>
                <input type="text" v-model="username" placeholder="Tai khoan">
                <input type="password" v-model="password" placeholder="Mat khau">
            <input class="btn btn-primary" @click="login" type="button" value="Dang nhap">
            <span :class="{ sucess: successfly, error: !successfly}">{{ message }}</span>
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

.error {
    color: red;
}
</style>