// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class Product {
  static #list = []
  static #count = 0
  //для унікальності ідентификаторів

  constructor(
    img,
    title,
    description,
    category,
    price,
    amount = 0, // кількість товару- 0 за умовч
  ) {
    this.id = ++Product.#count // Генеруємо унікальний id для товару
    // кожен раз доданний товар збільшує count і додаеться в id, а при видвлені товара
    // наш count не змінюється, тож настуній товар матиме последовниу номер id.
    this.img = img
    this.title = title
    this.description = description
    this.category = category
    this.price = price
    this.amount = amount
  }
  // метод, що додає товар
  static add = (...data) => {
    const newProduct = new Product(...data)

    this.#list.push(newProduct)
  }

  static getList = () =>
    // метод, що формує список
    {
      return this.#list
    }
  static getById = (id) => {
    // знаходить продукт по нашому іденту
    return this.#list.find((product) => product.id === id)
  }
  static getRandomList = (id) => {
    // Фільтруємо товари, щоб вилучити той, з яким порівнюємо id
    const filteredList = this.#list.filter(
      (product) => product.id !== id,
    )

    // Відсортуємо за допомогою .Math.random() та перемішаємо масив
    const shuffledList = filteredList.sort(
      () => Math.random() - 0.5,
    )

    // Повертаємо перші 3 елементи з перемішаного масиву
    return shuffledList.slice(0, 3)
  }
}
// додали тестові товари
Product.add(
  'https://picsum.photos/200/300',
  `Комп'ютер Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600`,
  'AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС',
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  27000,
  10,
)

Product.add(
  'https://picsum.photos/200/300',
  `Комп'ютер COBRA Advanced (I11F.8.H1S2.15T.13356) Intel`,
  'Intel Core i3-10100F (3.6 - 4.3 ГГц) / RAM 8 ГБ / HDD 1 ТБ + SSD 240 ГБ / GeForce GTX 1050 Ti, 4 ГБ / без ОД / LAN / Linux',
  [
    // { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  20000,
  10,
)
Product.add(
  'https://picsum.photos/200/300',
  `Комп'ютер ARTLINE Gaming by ASUS TUF v119 (TUFv119)`,
  'Intel Core i9-13900KF (3.0 - 5.8 ГГц) / RAM 64 ГБ / SSD 2 ТБ (2 x 1 ТБ) / nVidia GeForce RTX 4070 Ti, 12 ГБ / без ОД / LAN / Wi-Fi / Bluetooth / / без ОС',
  [
    { id: 1, text: 'Готовий до відправки' },
    // { id: 2, text: 'Топ продажів' },
  ],
  40000,
  10,
)
// ==
// ================================================================
// router.get Створює нам один ендпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  res.render('purchase-index', {
    style: 'purchase-index',
    data: {
      list: Product.getList(),
    },
  })
})

//=====GET=============== новий ендпонт
router.get('/purchase-product', function (req, res) {
  const id = Number(req.query.id) //отримуемо число ідентифікатор від req.query.id,!інакше отримуємо ряок
  // вказує назву папки з container
  res.render('purchase-product', {
    // вказує назву папки-контейра, де знаходяться наші стилі
    style: 'purchase-product',
    // повертаємо спис
    data: {
      list: Product.getRandomList(id),
      product: Product.getById(id),
    },
  })
})
//====POST================== новий ендпонт
router.post('/purchase-create', function (req, res) {
  const id = Number(req.query.id) //отримуемо число ідентифікатор через запит (query parameter) ,!інакше отримуємо ряок
  const amount = Number(req.body.amount) //отримуемо число amount через тело запроса (request body).
  //щоб відслідковувати потік даних

  console.log(id, amount)
  if (amount < 1) {
    return res.render('alert', {
      style: 'alert',
      // повертаємо алерт та посилання назад до обранного товару
      data: {
        message: 'Помилка',
        info: 'Некоректна кількість товару',
        link: '/purchase-product?id=${id}',
      },
    })
  }

  const product = Product.getById(id)

  if (product.amount < 1) {
    return res.render('alert', {
      style: 'alert',
      // повертаємо алерт та посилання назад до обранного товару
      data: {
        message: 'Помилка',
        info: 'Такої кількості товару немає в наявности',
        link: '/purchase-product?id=${id}',
      },
    })
  }

  console.log(product, amount)

  // вказує назву папки з container
  res.render('purchase-product', {
    // вказує назву папки-контейра, де знаходяться наші стилі
    style: 'purchase-product',
    // повертаємо спис
    data: {
      list: Product.getRandomList(id),
      product: Product.getById(id),
    },
  })
})

//  ================================================================

// ================================================================

// const result = User.updateById(Number(id), { email })

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
