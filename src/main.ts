import "./scss/styles.scss";
import { apiProducts } from "./utils/data";
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

console.log("================ProductCatalog test================");
productsModel.setItems(apiProducts.items);
const testItem = productsModel.getItemById("854cef69-976d-4c2a-a18c-2aa45046c390");
console.log(`Массив товаров из каталога: `, productsModel.getItems());
console.log(`Найденный элемент по id: `, testItem);
if (testItem) { 
  productsModel.setPreviewItem(testItem);
  console.log(`Выбранный товар для карточки: `, productsModel.getPreviewItem());
}

console.log("====================Buyer test=====================");
buyerModel.setData({
  payment: 'online',
  email: 'email@example.com',
  phone: '+79000000000',
  address: 'Moscow, Pushkin street',
});
console.log(`Информация о пользователе: `, buyerModel.getData());
console.log(`Валидация данных пользователя (корректные данные): `, buyerModel.validate());
buyerModel.clear()
console.log(`Данные пользователя после очистки: `, buyerModel.getData());
console.log(`Валидация данных пользователя (некорректные данные): `, buyerModel.validate());


console.log("====================Cart test=====================");
cartModel.addItem(apiProducts.items[0]);
cartModel.addItem(apiProducts.items[1]);
cartModel.addItem(apiProducts.items[2]);
console.log(`Массив товаров в корзине: `, cartModel.getItems());
cartModel.removeItem(apiProducts.items[0]);
console.log(`Корзина после удаления товара: `, cartModel.getItems());
console.log(`Общая стоимость товаров: `, cartModel.getTotalCost());
console.log(`Наличие элемента в корзине (поиск по id): `, cartModel.isItemInCart(apiProducts.items[2].id));
console.log(`Общее количество товаров: `, cartModel.getTotalCount());
cartModel.clear();
console.log(`Корзина после полной очистки: `, cartModel.getItems());

console.log("=====================Api test=====================");
async function init() {
  const products = await storeApi.getProducts();
  productsModel.setItems(products); 

  console.log(`Массив товаров из каталога (ответ сервера): `, productsModel.getItems());
    const testApiItem = productsModel.getItemById( 
    "c101ab44-ed99-4a54-990d-47aa2bb4e7d9" 
  ); 
  
  if (testApiItem) { 
    cartModel.addItem(testApiItem); 
    console.log(`Добавленный товар в корзину: `, cartModel.getItems());
  }
}
init().catch(console.error); 
