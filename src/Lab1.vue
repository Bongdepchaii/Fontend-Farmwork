<script setup>
import { ref } from "vue"
</script>
<template>
    <div class="container">
        <div class="row">
            <div class="col-md-3 wrapper">
                <img src="../images/lab1-avt.jpg" alt="">
            </div>
            <div class="col-md-9 content">
                <h1>BÙI TRỌNG THÀNH</h1>
                <p style="font-size: 1.1rem; font-weight: 500;">Lập trình web</p>
                <p>Tôi tên đầy đủ là Bùi Trọng Thành, năm nay tôi 19 tuổi, quê ở Thái Bình, đang sinh sống ở Đắk Lắk, là
                    một sinh viên của trường FPT Polytechnic
                    với chuyên nghành là lập trình web, hiện tại tôi là sinh viên năm hai, sau khi ra trường Fpoly thi
                    tôi mong sẽ có một công việc ổn định với nghành mà tôi đang theo.
                </p>
            </div>
        </div>
        <div class="row card-2">
            <div class="col-md-5 content-2">
                <ul style="margin-bottom: 0;">
                    <li><i class="fa-solid fa-envelope"></i> <a href=""> Thanhbtps46198@gmail.com</a></li>
                    <li><i class="fa-solid fa-location-dot"></i><a href=""> Buon Trap - Xa Cu M'Gar - Dak Lak</a></li>
                    <li><i class="fa-solid fa-phone"></i><a href=""> 0911616212</a></li>

                </ul>
            </div>
            <div class="col-md-5 content-2">
                <ul style="margin-bottom: 0;">
                    <li><i class="fa-brands fa-facebook"></i> <a href="https://www.facebook.com/05.thanh/">
                            https://www.facebook.com/05.thanh</a></li>
                    <li><i class="fa-brands fa-instagram"></i><a href="https://www.instagram.com/05_thanh/">
                            https://www.instagram.com/05_thanh</a></li>
                    <li><i class="fa-brands fa-tiktok"></i><a href="https://www.tiktok.com/@best.thanh">
                            https://www.tiktok.com/@best.thanh</a></li>
                </ul>
            </div>
        </div>
        <hr>
        <div class="row card-3">
            <h2><i class="fa-solid fa-code-branch"></i> KỸ NĂNG</h2>
            <div class="col-md-6 card-3">
                <ul style="margin-bottom: 0; padding-left: 0;">
                    <li>HTML</li>
                    <div class="progress mb-2" @mousedown="startDrag($event, 'html')"
                        @mousemove="onDrag($event, 'html')" @mouseup="stopDrag">
                        <div class="progress-bar" :style="{ width: html + '%' }" :aria-valuenow="html" aria-valuemin="0"
                            aria-valuemax="100">
                        </div>
                    </div>
                    <li>CSS</li>
                    <div class="progress mb-2" @mousedown="startDrag($event, 'css')" @mousemove="onDrag($event, 'css')"
                        @mouseup="stopDrag">
                        <div class="progress-bar" :style="{ width: css + '%' }" :aria-valuenow="css" aria-valuemin="0"
                            aria-valuemax="100">
                        </div>
                    </div>
                    <li>JavaScript</li>
                    <div class="progress mb-2" @mousedown="startDrag($event, 'js')" @mousemove="onDrag($event, 'js')"
                        @mouseup="stopDrag">
                        <div class="progress-bar" :style="{ width: js + '%' }" :aria-valuenow="js" aria-valuemin="0"
                            aria-valuemax="100">
                        </div>
                    </div>
                </ul>
            </div>
            <div class="col-md-6">
                <ul style="margin-bottom: 0; padding-left: 0;">
                    <li>MY SQL</li>
                    <div class="progress mb-2" @mousedown="startDrag($event, 'sql')" @mousemove="onDrag($event, 'sql')"
                        @mouseup="stopDrag">
                        <div class="progress-bar" :style="{ width: sql + '%' }" :aria-valuenow="sql" aria-valuemin="0"
                            aria-valuemax="100">
                        </div>
                    </div>
                    <li>NodeJS</li>
                    <div class="progress mb-2" @mousedown="startDrag($event, 'nodejs')"
                        @mousemove="onDrag($event, 'nodejs')" @mouseup="stopDrag">
                        <div class="progress-bar" :style="{ width: nodejs + '%' }" :aria-valuenow="nodejs"
                            aria-valuemin="0" aria-valuemax="100">
                        </div>
                    </div>
                    <li>PHP</li>
                    <div class="progress mb-2" @mousedown="startDrag($event, 'php')" @mousemove="onDrag($event, 'php')"
                        @mouseup="stopDrag">
                        <div class="progress-bar" :style="{ width: php + '%' }" :aria-valuenow="php" aria-valuemin="0"
                            aria-valuemax="100">
                        </div>
                    </div>
                </ul>
            </div>
        </div>
        <hr>
        <div class="row">
            <h2><i class="fa-solid fa-briefcase"></i> KINH NGHIỆM VÀ LÀM VIỆC</h2>
        </div>
        <div class="row card-4">
            <h3>1. Business Analyst (Chuyên viên Phân tích Kinh doanh)</h3>
            <p class="content-card-4">Năm 2028 - Nay</p>
            <ul>
                <li>Thiết kế giao diện website theo layout khách hàng họ yêu cầu</li>
                <li>Phối hợp với các thành viên trong nhóm để hoàn thiện dự án</li>
                <li>Làm việc trực tiếp với khác hàng họ yêu cầu</li>
                <li>Tối ưu hoá website hoạt động tốt cho các thiết bị</li>
            </ul>
        </div>
        <div class="row card-4">
            <h3>2. IT Green (chuyên nghiệp nâng tầm thương hiệu)</h3>
            <p class="content-card-4">Năm 2025 - 2028</p>
            <ul>
                <li>Phát triển các ứng dụng của trang web</li>
                <li>Tối ưu hoá hiệu ứng và code của website</li>
                <li>Xây dựng chức năng và theme của khách hàng họ yêu cầu</li>
                <li>Áp dụng các công nghệ mới vào trong dự án</li>
            </ul>
        </div>
    </div>
</template>

<!-- css -->

<style>
body {
    margin: 0;
    padding: 0;
    /* font-family: 'Times New Roman', Times, serif !important; */
}

img {
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 50%;
}

h1 {
    /* font-family: "Alumni Sans Pinstripe", sans-serif; */
    font-weight: bold !important;
    /* font-style: italic; */
    font-size: 1.5rem !important;
}


h2 {
    font-size: 1.3rem !important;
    color: black !important;
    font-weight: bold !important;
}

h3 {
    font-size: 1.2rem !important;
}

div.container {
    /* border: 1px solid black; */
    max-width: 1000px;
    margin-top: 40px;
    box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.192);
    padding: 50px;
}

div.row {
    /* border: 1px solid black; */
    margin-top: 25px;
}

div.card-2 {
    background-color: rgb(66, 66, 66);
    border-radius: 5px;
    margin-bottom: 30px;
}

ul {
    list-style: none;
    padding-left: 0;
    margin-bottom: 0;
    padding: 10px;
    margin: 0;
}

div.card-2 a {
    text-decoration: none !important;
    color: white !important;
}

div.card-2 a:hover {
    text-decoration: none !important;
    color: blue !important;
    transition: 0.2s !important;
}

div.content-2 ul li {
    color: white;
    margin: 7px;
}

div.card-4 ul li {
    list-style: inside !important;
}

p.content-card-4 {
    margin: 5px 0px;
    color: gray !important;
    font-size: 0.9rem !important;
    font-weight: 400;
}

div.card-3 ul li {
    margin: 5px 0px;
}

.progress-bar {
    background-color: rgb(66, 66, 66) !important;
}

hr {
    border: 2px solid black !important;
    margin: 25px 0px !important;
    border-radius: 20px;
}
</style>

<!-- js -->
<script>
const html = ref(90);
const css = ref(85);
const js = ref(60);
const sql = ref(75);
const nodejs = ref(55);
const php = ref(85);

let dragging = ref(false);
let currentField = ref(null);

function startDrag(event, field) {
    dragging.value = true;
    currentField.value = field;
    updateValue(event, field);
}

function onDrag(event, field) {
    if (!dragging.value || currentField.value !== field) return;
    updateValue(event, field);
}

function stopDrag() {
    dragging.value = false;
    currentField.value = null;
}

function updateValue(event, field) {
    const progressBar = event.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const percent = ((event.clientX - rect.left) / rect.width) * 100;
    const value = Math.max(0, Math.min(100, Math.round(percent)));

    if (field === "html") html.value = value;
    if (field === "css") css.value = value;
    if (field === "js") js.value = value;
    if (field === "sql") sql.value = value;
    if (field === "nodejs") nodejs.value = value;
    if (field === "php") php.value = value;
}</script>