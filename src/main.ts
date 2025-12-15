import "./scss/styles.scss";
import { ProductCatalog } from "./components/models/ProductCatalog";
import { Buyer } from "./components/models/Buyer";
import { Cart } from "./components/models/Cart";
import { StoreApi } from "./components/base/StoreApi";
import { API_URL } from "./utils/constants";
import { Api } from "./components/base/Api";

const productsModel = new ProductCatalog();
const buyerModel = new Buyer();
const cartModel = new Cart();
const apiUrl = new Api(API_URL);
const storeApi = new StoreApi(apiUrl);

const products = await storeApi.getProducts();

productsModel.setItems(products);
const testItem = productsModel.getItemById(
  "c101ab44-ed99-4a54-990d-47aa2bb4e7d9"
);
if (testItem) {
  cartModel.addItem(testItem);
}

console.log(`Массив товаров из каталога: `, productsModel.getItems());
console.log(`Данные пользователя: `, buyerModel.getData());
console.log(`Проверка данных пользователя: `, buyerModel.validate());
console.log(`Состав корзины: `, cartModel.getItems());
