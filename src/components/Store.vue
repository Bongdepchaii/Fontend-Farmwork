<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore()
const demo = computed(() => store.count )
console.log('demo', demo)

const handlButtonIncrease = () => {
    store.commit('increment')
}

const handleButtonDecrease = () => {
    store.commit('decrease')
    store.dispatch("")
}


</script>

<template>
    <h1>Store</h1>
    <h3>du lieu o day: {{ demo }}</h3>
</template>