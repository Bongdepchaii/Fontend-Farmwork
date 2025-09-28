<script setup>
import { ref } from 'vue'
const message = ref("Chua co tin nhan")
const dem = ref(0)
const hocluc = ref(0)
const diemtoida = 10

const thaydoimessage = () => { message.value = "Ban da thay doi tin nhan"}
const tang = () => {
    if (hocluc.value < diemtoida){
        hocluc.value++
    } else {
        alert("Ban da dat diem toi da!")
    }
}
const giam = () => {
    if(hocluc.value >= 1){

        hocluc.value--
    } else {
        alert ("Diem khong the am!")
    }
}
</script>
<template>
    <div class="container">
        <center class="lab-2">
            <h1>Hien thi hoc luc</h1>
            <p>{{ message }}</p>
            <p class="dem">{{ dem }} | {{ hocluc }}</p>
            <button class="btn btn-light" @click="thaydoimessage">Thay doi tin nhan</button>
            <button class="btn btn-danger" @click="giam">Tru diem</button>
            <button class="btn btn-success" @click="tang">Cong diem</button>
            <hr>
            <!-- if -->
             <p v-if="hocluc < 3.5">Hoc luc Yeu</p>
             <p v-else-if="hocluc < 5">Hoc luc trung binh</p>
             <p v-else-if="hocluc < 6.5">Hoc luc kha</p>
             <p v-else>Hoc luc gioi</p>
             <div v-show="hocluc >= 10">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOv9mTpCuhDzYbYqgf_u8jzo7zRObKDrvDyQ&s" alt="hoc sinh xuat sac">
                <p>Xin chuc mung ban la hoc sinh xuat sac</p>
             </div>
        </center>
    </div>
    <div class="container">
        <center>
            
        </center>
    </div>
</template>
<style>
.lab-2 button{
    margin: 5px 5px;
}
.lab-2 .dem{
    font-weight: 500 !important;
    font-size: 1.3rem;
}
</style>