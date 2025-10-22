<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Bar } from 'vue-chartjs';
// import { name } from 'server/plugins/log';


// bieu do 
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const router = useRouter()
const orders = ref([]);
const products = ref([]);
const users = ref([]);
const loading = ref(true);
const error = ref(null);

const revenueChartData = ref({
  labels: [],
  datasets: [
    {
      label: 'Doanh thu ($)',
      backgroundColor: 'blue',
      data: []
    }
  ]
});

const revenueChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true
    },
    title: {
      display: true,
      text: 'Char Doanh thu (month)'
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
});

const loadData = async () => {
  loading.value = true;
  error.value = null;
  try {

    const [ordersRes, productsRes, usersRes] = await Promise.all([
      axios.get('http://localhost:3000/orders?status=completed'),
      axios.get('http://localhost:3000/products'),
      axios.get('http://localhost:3000/User')
    ]);
    orders.value = ordersRes.data;
    products.value = productsRes.data;
    users.value = usersRes.data;

    prepareRevenueChartData();

  } catch (err) {
    console.error("error:", err);
    error.value = "khong tai du lieu thong ke.";
  } finally {
    loading.value = false;
  }
};

const topSellingProducts = computed(() => {
  if (products.value.length === 0 || orders.value.length === 0) return [];

  const productSales = {};

  orders.value.forEach(order => {
    if (order.items && order.status === 'completed') {
      order.items.forEach(item => {
        const productName = item.name;
        const quantity = item.quantity;
        if (productSales[productName]) {
          productSales[productName].quantity += quantity;
        } else {
          const productInfo = products.value.find(p => p.title.toLowerCase() === productName.toLowerCase());
          productSales[productName] = {
            quantity: quantity,
            name: productName,
            product: productInfo
          };
        }
      });
    }
  });

  const salesArray = Object.values(productSales);

  salesArray.sort((a, b) => b.quantity - a.quantity);

  return salesArray.slice(0, 5).map(sale => {
    const productInfo = sale.product; 
    return {
      productId: productInfo ? productInfo.id : sale.name,
      name: productInfo ? productInfo.title : 'product not xac dinh',
      quantity: sale.quantity
    };
  });
});

const customerSpending = computed(() => {
  if (users.value.length === 0 || orders.value.length === 0) return [];

  const spending = {};

  orders.value.forEach(order => {
    if (order.user_id && order.status === 'completed') {
      const userId = order.user_id;
      const total = order.total;
      if (spending[userId]) {
        spending[userId] += total;
      } else {
        spending[userId] = total;
      }
    }
  });

  const spendingArray = Object.keys(spending).map(userId => ({
    userId: userId,
    totalSpending: spending[userId]
  }));

  spendingArray.sort((a, b) => b.totalSpending - a.totalSpending);

  return spendingArray.slice(0, 10).map(spend => {
    const userInfo = users.value.find(u => u.id === spend.userId);
    return {
      ...spend,
      name: userInfo ? (userInfo.username || userInfo.name) : 'Khong xac dinh duoc khach hang'
    };
  });
});

const prepareRevenueChartData = () => {
  const monthlyRevenue = {};

  orders.value.forEach(order => {
    if (order.status === 'completed' && order.created_at) {
      try {
        const date = new Date(order.created_at);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const yearMonth = `${date.getFullYear()}-${month}`;

        if (monthlyRevenue[yearMonth]) {
          monthlyRevenue[yearMonth] += order.total;
        } else {
          monthlyRevenue[yearMonth] = order.total;
        }
      } catch (e) {
        console.error("Loi khi xu ly ngay:", order.created_at, e);
      }
    }
  });

  const sortedMonths = Object.keys(monthlyRevenue).sort();

  revenueChartData.value.labels = sortedMonths;
  revenueChartData.value.datasets[0].data = sortedMonths.map(month => monthlyRevenue[month]);
};

onMounted(loadData);

// login
const loggedInUser = computed(() => {
  const userData = localStorage.getItem('userlogin');
  if (userData) {
    return JSON.parse(userData);
  }
  return null;
});

const isAdmin = computed(() => {
  return loggedInUser.value && loggedInUser.value.role.toLowerCase() === 'admin';
});

// logout
const logout = () => {
  if (confirm("ban chac chan muon dang xuat?")) {
    localStorage.removeItem('userlogin')
    router.push('/')
  }
}

</script>

<template>
  <div class="container py-4 border-bottom mb-5">
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <RouterLink style="font-size: 2rem;" to="Index" class="nav-link active" aria-current="page">TBS</RouterLink>
        <li class="nav-item">
          <RouterLink style="margin-left: 15px;" to="user" class="nav-link" aria-current="page">User</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink style="margin-left: 15px;" to="HistoryOrder" class="nav-link" aria-current="page">History
          </RouterLink>
        </li>
        <button style="border: none;" class="navbar-toggler">
          <ul style="font-size: 1rem;" class="navbar navbar-expand-lg bg-body-tertiary">

            <li class="nav-item" v-if="isAdmin">
              <RouterLink to="/product" class="nav-link">Admin</RouterLink>
            </li>
            <template v-if="loggedInUser">
              <li class="nav-item">
                <RouterLink class="nav-link" :to="`/userdetail/${loggedInUser.id}`">
                  Hi, {{ loggedInUser.username }}
                </RouterLink>
              </li>
              <li class="nav-item">
                <button class="nav-link" @click="logout()">Logout</button>
              </li>
            </template>
            <template v-else>
              <li class="nav-item">
                <RouterLink to="/login" class="nav-link">Login</RouterLink>
              </li>
            </template>
          </ul>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          </ul>
          <div class="d-flex">
            <li class="nav-item">
              <RouterLink class="nav-link" :to="`Userdetail/${loggedInUser.id}`">Hi, {{ loggedInUser.username }}
              </RouterLink>
            </li>
            <li class="nav-item">
              <button class="nav-link active" aria-current="page" to="Login" @click="logout()">Logout</button>
            </li>
          </div>
        </div>
      </div>
    </nav>
  </div>
  <div class="container mt-4 mb-5">
    <h1>Chart</h1>

    <div v-if="loading" class="alert alert-info">Load dataa..</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="!loading && !error">

      <section class="mt-5">
        <h2>Top 5 produc sell a lot</h2>
        <table class="table table-striped table-hover">
          <thead class="table-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">product</th>
              <th scope="col">quantity</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="topSellingProducts.length === 0">
              <td colspan="3" class="text-center text-muted">not data sell product.</td>
            </tr>
            <tr v-for="(product, index) in topSellingProducts" :key="product.productId">
              <th scope="row">{{ index + 1 }}</th>
              <td>
                <router-link :to="`/product-detail/${product.productId}`">
                  {{ product.name }}
                </router-link>
              </td>
              <td>{{ product.quantity }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <hr class="my-5">

      <section>
        <h2>User sell a lot product top 10 </h2>
        <table class="table table-striped table-hover">
          <thead class="table-dark">
            <tr>
              <th scope="col">stt</th>
              <th scope="col">Name kh</th>
              <th scope="col">Total ($)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="customerSpending.length === 0">
              <td colspan="3" class="text-center text-muted">not have data khach hang.</td>
            </tr>
            <tr v-for="(customer, index) in customerSpending" :key="customer.userId">
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ customer.name }} (ID: {{ customer.userId }})</td>
              <td>{{ customer.totalSpending.toLocaleString('en-US', {
                minimumFractionDigits: 2, maximumFractionDigits: 2
              }) }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <hr class="my-5">

      <section>
        <h2>char (month)</h2>
        <div style="height: 400px">
          <Bar v-if="revenueChartData.labels.length > 0" :data="revenueChartData" :options="revenueChartOptions" />
          <div v-else class="text-muted text-center mt-5">not data chart total sell</div>
        </div>
      </section>

    </div>
  </div>
</template>

<style scoped>
body {
  background-color: #f8f9fa;
}

.product-thumb {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: .5rem;
}

.sticky-col {
  position: sticky;
  top: 1rem;
}

div nav li {
  list-style: none;
  margin-left: 15px;
  font-size: 1rem;
}
</style>