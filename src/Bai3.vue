<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const posts = ref([])
onMounted(async() => {
  console.log(`the component is now mounted.`)
  const response = await axios.get('http://localhost:3000/posts');
  if(response.status == 200) {
    posts.value = response.data
  }
})
</script>
<template>
 <main class="container py-3">
    <header class="d-flex align-items-center justify-content-between mb-3">
      <h1 class="h3 m-0">Latest Posts</h1>
      <form class="d-none d-sm-flex" role="search">
        <input class="form-control form-control-sm" type="search" placeholder="Search posts" />
      </form>
    </header>

    <div class="list-group">

      <!-- Post item -->
      <a href="#" v-for="post in posts" :key="post.id"
         class="list-group-item list-group-item-action py-3">
        <div class="row g-3 align-items-start">
          <div class="col-12 col-sm-auto">
            <img src="https://picsum.photos/300/200?random=1" alt="Post 1" class="post-thumb w-100 w-sm-auto" />
          </div>
          <div class="col">
            <div class="d-flex w-100 justify-content-between">
              <h2 class="h5 mb-1">Post Title One</h2>
              <small class="text-muted">Sep 24, 2025</small>
            </div>
            <div class="mb-2">
              <small class="text-muted">by <strong>Admin</strong> · 5 min read</small>
            </div>
            <p class="post-excerpt mb-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.
              Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet…
            </p>
            <div class="d-flex gap-2">
              <span class="badge text-bg-primary">News</span>
              <span class="badge text-bg-secondary">Tutorial</span>
            </div>
          </div>
        </div>
      </a>

    
    </div>

    <!-- Pagination -->
    <!-- <nav aria-label="Post navigation" class="mt-4">
      <ul class="pagination justify-content-center">
        <li class="page-item disabled"><span class="page-link">Previous</span></li>
        <li class="page-item active" aria-current="page"><span class="page-link">1</span></li>
        <li class="page-item"><a class="page-link" href="#">2</a></li>
        <li class="page-item"><a class="page-link" href="#">3</a></li>
        <li class="page-item"><a class="page-link" href="#">Next</a></li>
      </ul>
    </nav> -->
  </main>
</template>