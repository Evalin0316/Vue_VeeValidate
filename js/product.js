import userProductModal from './userProductModal.js';

const apiUrl = "https://vue3-course-api.hexschool.io/";
const apiPath = "ear077";



const app = Vue.createApp({
  data() {
    return {
      // 產品列表
      products: [],
      //props傳遞到內層的暫存資料
      product: {},
      //購物車列表
      cart: {},
      //讀取效果
      loadingStatus: {
        loadingItem: '',
      },
      // 表單結構
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
    };
  },
  methods: {
    //取得產品列表
    getProucts() {
      const url = `${apiUrl}api/${apiPath}/products`;
      axios.get(url)
        .then((res) => {
          if (res.data.success) {
            console.log("取得產品列表", res);
            this.products = res.data.products; //將資料 賦予到 data
          } else if (!res.data.success) {
            alert("取得產品列表錯誤!");
          }
        })
    },
    //加入購物車
    addCart(id, qty = 1) {
      this.loadingStatus.loadingItem = id; //載入特效
      const cart = {
        "product_id": id
        , qty
      };
      console.log(cart);
      const api = `${apiUrl}api/${apiPath}/cart`;
      this.$refs.userProductModal.hideModal(); //用refs取得DMO，關閉MODAL
      axios.post(api, { data: cart })
        .then((res) => {
          if (res.data.success) {
            alert("加入購物車成功")
            this.loadingStatus.loadingItem = ''; //載入特跳
            this.getCart();   //載入購物車列表
          } else if (!res.data.success) {
            alert("加入購物錯誤!");
          }
        })
    },
    //載入購物車列表
    getCart() {
      const api = `${apiUrl}api/${apiPath}/cart`;
      axios.get(api)
        .then((res) => {
          if (res.data.success) {
            console.log("獲得購物車列表", res);
            this.cart = res.data.data; //賦予資料到購物車
          } else if (!res.data.success) {
            alert("載入購物列表錯誤!");
          }
        })
    },
    //開啟Modal
    openModal(item) {
      this.loadingStatus.loadingItem = item.id;//載入特跳
      const api = `${apiUrl}api/${apiPath}/product/${item.id}`;
      axios.get(api)
        .then((res) => {
          if (res.data.success) {
            this.product = res.data.product; //寫入單一購物車資料
            this.loadingStatus.loadingItem = ''; //載入特校回歸
            this.$refs.userProductModal.openModal(); //用refs取得DMO，開啟MODAL
          } else if (!res.data.success) {
            alert("取得單一購物資料錯誤");
          }
        })
    },
    //更新購物車資料
    updateCart(item) {
      this.loadingStatus.loadingItem = item.id;//載入特跳
      const api = `${apiUrl}api/${apiPath}/cart/${item.id}`;
      const cart = {
        "product_id": item.product.id,
        qty: item.qty
      };
      console.log(cart, api);
      axios.put(api, { data: cart })
        .then((res) => {
          if (res.data.success) {
            alert("更新購物車資料成功!");
            this.loadingStatus.loadingItem = '';//載入特校回歸
            this.getCart(); //取得購物車列表
          } else if (!res.data.success) {
            alert("更新購物車資料失敗!");
          }
        })
    },
    //刪除單一購物車資料
    deletCart(id) {
      console.log(id);
      const api = `${apiUrl}api/${apiPath}/cart/${id}`;
      axios.delete(api)
        .then((res) => {
          if (res.data.success) {
            console.log("刪除單一購物車資料", res);
            alert("刪除單一購物車資料成功!")
            this.getCart();  //取得購物車列表
          } else if (!res.data.success) {
            alert("刪除單一購物車資料失敗!");
          }
        })
    },
    //刪除全部購物車資料
    deletAllCart() {
      const api = `${apiUrl}api/${apiPath}/carts`;
      axios.delete(api)
        .then((res) => {
          if (res.data.success) {
            console.log("刪除購物車資料", res);
            alert("刪除購物車資料成功")
            this.getCart();  //取得購物車列表
          } else if (!res.data.success) {
            alert("刪除購物車資料失敗");
          }
        })
    },
    sendForm() {
      const api = `${apiUrl}api/${apiPath}/order`;
      const order = this.form;
      axios.post(api, { data: order })
        .then((res) => {
          if (res.data.success) {
            console.log("送出表單成功", res);
            alert("送出表單成功")
            this.getCart();  //取得購物車列表
            this.$refs.form.resetForm(); //清空清單
          } else if (!res.data.success) {
            alert("送出表單失敗");
          }
        })
    },

  },
  mounted() {
    this.getProucts();
    this.getCart();
    //   this.$refs.userProductModal.openModal();
  },
});

VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為輸入字元立即進行驗證
});

//定義規則 全部加入
Object.keys(VeeValidateRules).forEach(rule => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});
//註冊全域表單驗證元件
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);
//註冊全域modal元件
app.component('userProductModal', userProductModal);
app.mount('#app');