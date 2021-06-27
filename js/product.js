import userProductModal from './userProductModal.js';

const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

configure({
  generateMessage: localize('zh_TW'),
});

const apiUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'ear077';

Vue.createApp({
  data() {
    return {
      loadingStatus: {
        loadingItem: '',
      },
      products: [],
      product: {},
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      cart: {},
    };
  },
  components: {
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
  methods: {
    getProducts() {
      const url = `${apiUrl}/api/${apiPath}/products`;
      axios.get(url).then((response) => {
        if (response.data.success) {
          console.log(response.data.products);
          this.products = response.data.products;
        } else {
          alert(response.data.message);
        }
      });
    },
    getProduct(id) {
      const url = `${apiUrl}/api/${apiPath}/product/${id}`;
      this.loadingStatus.loadingItem = id;
      axios.get(url).then((response) => {
        if (response.data.success) {
          this.loadingStatus.loadingItem = '';
          this.product = response.data.product;
          this.$refs.userProductModal.openModal();
        } else {
          alert(response.data.message);
        }
      });
    },
    addToCart(id, qty = 1) {
      const url = `${apiUrl}/api/${apiPath}/cart`;
      this.loadingStatus.loadingItem = id;
      const cart = {
        product_id: id,
        qty,
      };

      this.$refs.userProductModal.hideModal();
      axios.post(url, { data: cart }).then((response) => {
        if (response.data.success) {
          alert(response.data.message);
          this.loadingStatus.loadingItem = '';
          this.getCart();
        } else {
          alert(response.data.message);
        }
      });
    },
    deleteAllCarts() {
      const url = `${apiUrl}/api/${apiPath}/carts`;
      axios.delete(url).then((response) => {
        if (response.data.success) {
          alert(response.data.message);
          this.getCart();
        } else {
          alert(response.data.message);
        }
      });
    },
    getCart() {
      const url = `${apiUrl}/api/${apiPath}/cart`;
      axios.get(url).then((response) => {
        if (response.data.success) {
          this.cart = response.data.data;
        } else {
          alert(response.data.message);
        }
      });
    },
    removeCartItem(id) {
      const url = `${apiUrl}/api/${apiPath}/cart/${id}`;
      this.loadingStatus.loadingItem = id;
      axios.delete(url).then((response) => {
        if (response.data.success) {
          alert(response.data.message);
          this.loadingStatus.loadingItem = '';
          this.getCart();
        } else {
          alert(response.data.message);
        }
      });
    },
    createOrder() {
      const url = `${apiUrl}/api/${apiPath}/order`;
      const order = this.form;
      axios.post(url, { data: order }).then((response) => {
        if (response.data.success) {
          alert(response.data.message);
          this.$refs.form.resetForm();
          this.getCart();
        } else {
          alert(response.data.message)
        }
      });
    },
  },
  created() {
    this.getProducts();
    this.getCart();
  },
})
  .component('userProductModal', userProductModal)
  .mount('#app');