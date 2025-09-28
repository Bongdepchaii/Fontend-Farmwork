<script setup>
import { ref } from 'vue'

const username = ref('')
const password = ref('')
const message = ref('')
const successfly = ref(false)

const login = () => {
    if(username.value = ""){
        message.value = "Tai khoan khong duoc de trong"
    }
    else if (password.value = ""){
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
            <label for="">Tai khoan
                <input type="text" v-model="username">
            </label>
            <br>
            <label for="">Mat khau
                <input type="password" v-model="password">
            </label>
            <br>
            <input class="btn btn-primary" @click="login" type="button" value="Dang nhap">
            <br>
            <span :class="{ sucesss: successfly, error: !successfly}">{{ message }}</span>
        </form>
</template>

<style scoped>
form {
    width: 500px;
    margin: 0 auto;
    border: 2px solid green;
    padding: 20px;
}
form input {
    width: 100%;
    display: block;
    margin-top: 15px;
    padding: 7px;
}

.success {
    color: green;
}

.error {
    color: red;
}
</style>