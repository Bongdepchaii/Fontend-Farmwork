<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'

const Product = ref([])
const total = ref(0)
const search = ref('')
const page = ref(1)
const pagesize = 5

const totalpage = computed(() => Math.ceil(total.value / pagesize))

const loaddata = async () => {
  try {
    const params = { _page: page.value, _limit: pagesize }
    if (search.value) params.title_like = search.value

    const response = await axios.get('http://localhost:3000/products', { params })
    Product.value = response.data

    // console.log('response.headers:', response.headers)

    let totalCount = response.headers && response.headers['x-total-count']
      ? parseInt(response.headers['x-total-count'])
      : null

    if (!totalCount) {
      const countParams = { ...params }
      delete countParams._page
      delete countParams._limit
      const allRes = await axios.get('http://localhost:3000/products', { params: countParams })
      totalCount = Array.isArray(allRes.data) ? allRes.data.length : (Product.value.length || 0)
    }

    total.value = totalCount
  } catch (error) {
    console.error('Error load page:', error)
  }
}

const change_page = (newpage) => {
  if (newpage < 1) return
  if (newpage > totalpage.value) return
  page.value = newpage
  loaddata()
}

watch(search, () => {
  page.value = 1
  loaddata()
})

onMounted(() => {
  loaddata()
})
</script>

<template>
  <main>
    <div class="container py-2">
      <header class="d-flex align-items-center justify-content-between mb-3">
        <h1 class="h3 m-0">List Products</h1>
        <RouterLink to="Product" class="btn btn-success">Admin</RouterLink>
        <form class="d-none d-sm-flex" role="search" @submit.prevent>
          <input class="form-control form-control-sm" type="search" v-model="search" placeholder="Search..." />
        </form>
      </header>

      <div class="list-group">
        <RouterLink
          v-for="Item in Product"
          :key="Item.id"
          :to="`/product-detail/${Item.id}`"
          class="list-group-item list-group-item-action py-3 ProductItem"
        >
          <div class="row g-3 align-items-start">
            <div class="col-12 col-sm-auto">
              <img :src="Item.image" alt="Post" class="post-thumb w-100 w-sm-auto" />
            </div>
            <div class="col">
              <div class="d-flex w-100 justify-content-between">
                <h2 class="h5 mb-1">{{ Item.title }}</h2>
                <small class="text-muted">Price {{ Item.price }}$</small>
              </div>
              <div class="mb-2">
                <small class="text-muted">By <strong>Admin</strong></small>
              </div>
              <p class="post-excerpt mb-2">
                Lorem ipsum dolor sit amet... 
              </p>
              <div class="d-flex gap-2">
                <span class="badge text-bg-secondary">{{ Item.category }}</span>
              </div>
            </div>
          </div>
        </RouterLink>

        <div v-if="Product.length === 0" class="p-3 text-center text-muted">Không có sản phẩm</div>
      </div>

      <nav aria-label="Post navigation" class="mt-4" v-if="totalpage > 1">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: page === 1 }">
            <button class="page-link" @click="change_page(page - 1)" :disabled="page === 1">Previous</button>
          </li>

          <li class="page-item" v-for="p in totalpage" :key="p" :class="{ active: page === p }">
            <button class="page-link" @click="change_page(p)">{{ p }}</button>
          </li>

          <li class="page-item" :class="{ disabled: page === totalpage }">
            <button class="page-link" @click="change_page(page + 1)" :disabled="page === totalpage">Next</button>
          </li>
        </ul>
      </nav>
    </div>
  </main>
</template>
