// import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import router from './Router'
import store from './store'

// createApp(App).use(store).use(router).mount('#app')

const app = createApp(App)

// app.use(PrimeVue, {
//     theme: {
//         preset: Aura,
//         options: {
//             prefix: 'p',
//             darkModeSelector: '.dark-mode',
//             cssLayer: false
//         }
//     }
// })

app.use(store)
app.use(router)
app.mount('#app')
