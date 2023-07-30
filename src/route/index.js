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
    // наш count не змінюється, тож настуній товар матиме последовний номер id.
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
class Purchase {
  static DELIVERY_PRICE = 150 // це статична ціна замовлення
  static #BONUS_FACTOR = 0.1

  static #count = 0
  static #list = []

  static #bonusAccount = new Map() // словник. в форматі ключ-знач буде йти пошта та бонусбаланс

  static getBonusBalance = (email) => {
    return Purchase.#bonusAccount.get(email) || 0 // стат метод.шукае бонус по пошті та повертае значення, або нуль
  }

  // щоб використовувати значення статичного метода #BONUS_FACTOR,
  static calcBonusAmount = (value) => {
    return value * Purchase.#BONUS_FACTOR
  }

  static updateBonusBalance = (
    email,
    price,
    bonusUse = 0, // скільки бонусів бажає списати користувач, з/з=0
  ) => {
    const amount = this.calcBonusAmount(price)

    const currentBalance = Purchase.getBonusBalance(email)

    const updatedBalance =
      currentBalance + amount - bonusUse

    Purchase.#bonusAccount.set(email, updatedBalance)

    console.log(email, updatedBalance)

    return amount
  }

  constructor(data, product) {
    this.id = ++Purchase.#count
    // Добавляем поле title при создании объекта Purchase
    this.title = product.title // Присваиваем полю title значение из объекта product

    this.firstname = data.firstname
    this.lastname = data.lastname

    this.phone = data.phone
    this.email = data.email
    this.address = data.address

    this.comment = data.comment || null

    this.bonus = data.bonus || 0

    this.promocode = data.promocode || null

    this.totalPrice = data.totalPrice
    this.productPrice = data.productPrice
    this.deliveryPrice = data.deliveryPrice
    this.amount = data.amount

    // Рассчитываем значение бонусов (10% от общей цены)
    this.bonusAmount =
      this.totalPrice * Purchase.#BONUS_FACTOR

    this.product = product
  }
  // статичні методи
  static add = (...arg) => {
    const newPurchase = new Purchase(...arg)

    this.#list.push(newPurchase)
    return newPurchase
  }
  static getList = () => {
    return Purchase.#list.reverse() //  отримаем список замовлень (спочатку нові)
    // !!!! - самостійно через деструктурізацію .map(({...}) => {...}) дістаєм дані та повертаємоу  у обїєкт,  щоб отримати потрібні
    //  тільки потрібні поля: id, бонуси
  }

  static getById = (id) => {
    return Purchase.#list.find((item) => item.id === id) // знаходить\повертає товар по айди
  }
  static updateById = (id, data) => {
    const purchase = Purchase.getById(id)
    // передаємо потрібні поля, якщо вони присутні в data
    if (purchase) {
      if (data.firstname)
        purchase.firstname = data.firstname
      if (data.lastname) purchase.lastname = data.lastname
      if (data.phone) purchase.phone = data.phone
      if (data.email) purchase.email = data.email

      return true
    } else {
      return false
    }
  }
}

// логика списання та нарахування бонусів
class Promocode {
  static #list = []

  constructor(name, factor) {
    this.name = name
    this.factor = factor
  }

  static add = (name, factor) => {
    const newPromoCode = new Promocode(name, factor)
    Promocode.#list.push(newPromoCode)
    return newPromoCode
  }
  // шукає промокод по назві
  static getByName = (name) => {
    return this.#list.find((promo) => promo.name === name)
  }

  static calc = (promo, price) => {
    return price * promo.factor
  }
}
Promocode.add('SUMMER2023', 0.9)
Promocode.add('DISCOUNT50', 0.5)
Promocode.add('SALE25', 0.75)

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

  if (amount < 1) {
    return res.render('alert', {
      style: 'alert',
      // повертаємо алерт та посилання назад до обранного товару
      data: {
        message: 'Помилка',
        info: 'Некоректна кількість товару',
        link: `/purchase-product?id=${id}`,
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
        info: 'Такої кількості товару немає в наявності',
        link: `/purchase-product?id=${id}`,
      },
    })
  }

  console.log(product, amount)

  const productPrice = product.price * amount
  const totalPrice = productPrice + Purchase.DELIVERY_PRICE
  const bonus = Purchase.calcBonusAmount(totalPrice)

  // ************вказує назву папки з container
  res.render('purchase-create', {
    style: 'purchase-create',

    data: {
      id: product.id,

      cart: [
        {
          text: `${product.title} (${amount} шт)`,
          price: productPrice,
        },
        {
          text: `Доставка`,
          price: Purchase.DELIVERY_PRICE,
        },
      ],
      totalPrice,
      productPrice,
      deliveryPrice: Purchase.DELIVERY_PRICE,
      amount,
      bonus,
    },
  })
})
// ***мои изменения

// Формуємо номер замовлення у форматі "MM-DD-HH-mm" (місяць-день-година-хвилина)
// const orderNumber = new Date()
//   .toLocaleString('uk-UA')
//   .replace(/[.,/: ]/g, '-')

// Перенаправляємо користувача на сторінку /purchase-delivery з номером замовлення в URL
// res.redirect(
//   `/purchase-delivery?id=${purchase.id}&orderNumber=${orderNumber}`,
// )

// ======POST========
router.post('/purchase-submit', function (req, res) {
  const id = Number(req.query.id)

  let {
    totalPrice,
    productPrice,
    deliveryPrice,
    amount,

    firstname,
    lastname,
    email,
    phone,
    address,
    comment,

    promocode,
    bonus,
  } = req.body

  const product = Product.getById(id)

  if (!product) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Товар не знайдено',
        link: `/purchase-list`,
      },
    })
  }
  // перевірка кількості товара  - наявній
  if (product.amount < amount) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Товару немає в потрібній кількості',
        link: `/purchase-list`,
      },
    })
  }
  totalPrice = Number(totalPrice)
  productPrice = Number(productPrice)
  deliveryPrice = Number(deliveryPrice)
  amount = Number(amount)
  bonus = Number(bonus)
  // перевірка коректності введених значень
  if (
    isNaN(totalPrice) ||
    isNaN(productPrice) ||
    isNaN(deliveryPrice) ||
    isNaN(amount) ||
    isNaN(bonus)
  ) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Некоректні дані',
        link: `/purchase-list`,
      },
    })
  }
  // чи заповнені поля?
  if (!firstname || !lastname || !email || !phone) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: `Заповніть обов'язкові поля`,
        info: 'Некоректні дані',
        link: `/purchase-list`,
      },
    })
  }
  // чи є бонус, та він більше 0?
  if (bonus || bonus > 0) {
    const bonusAmount = Purchase.getBonusBalance(email) // отримали кіл-ть бонусів на поточному балансі

    console.log(bonusAmount)
    // якщо число  бонусів перевищує кіл-сть наявних бонусів на поточному балансі, обмежуем наявними
    if (bonus > bonusAmount) {
      bonus = bonusAmount
    }

    Purchase.updateBonusBalance(email, totalPrice, bonus) // 1)обновили баланс с нарахованими бонусами

    totalPrice -= bonus // зменьшуємо ціну на кіл-сть бонусів
    // 2)якщо не має введених бонусів, то вважаємо, що =0
  } else {
    Purchase.updateBonusBalance(email, totalPrice, 0)
  }

  // чи є промокод. Він рахується після бонусу
  if (promocode) {
    promocode = Promocode.getByName(promocode) // шукаемо по назві промокод, и кладемо в змінну promocode. Якщо є →

    if (promocode) {
      totalPrice = Promocode.calc(promocode, totalPrice) //  → переписуєм totalPrice на калькуляцию totalPrice*promocode
    }
  }

  if (totalPrice < 0) totalPrice = 0 // навіть за відємного числа прайса, вважаємо, що це 0.

  // після додавання всіх оновлень, знижок отримуємо нові значення const purchase
  const purchase = Purchase.add(
    {
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,
      bonus,

      firstname,
      lastname,
      email,
      phone,

      promocode,
      comment,
      address,
    },
    product,
  )

  console.log(purchase)

  res.render('alert', {
    style: 'alert',
    data: {
      message: 'Успішно',
      info: 'Замовлення створено',
      link: `/purchase-list`,
    },
  })
})
// ===== GET =====
router.get('/purchase-list', function (req, res) {
  res.render('purchase-list', {
    style: 'purchase-list',
    data: {
      list: Purchase.getList(),
    },
  })
})

// ===== GET =====test шаблона purchase-delivery
router.get('/purchase-delivery', function (req, res) {
  const id = Number(req.query.id)
  const purchase = Purchase.getById(id)

  if (!purchase) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Замовлення не знайдено',
        link: `/purchase-list`,
      },
    })
  }

  res.render('purchase-delivery', {
    style: 'purchase-delivery',
    data: {
      id: purchase.id,
      title: purchase.product.title,
      firstname: purchase.firstname,
      lastname: purchase.lastname,
      phone: purchase.phone,
      email: purchase.email,
      address: purchase.address,
      comment: purchase.comment,
      totalPrice: purchase.totalPrice,
      productPrice: purchase.productPrice,
      deliveryPrice: purchase.deliveryPrice,
      bonusAmount: purchase.bonusAmount,
    },
  })
})

// / ===== POST для зміни даних=====
router.post('/purchase-update', function (req, res) {
  const id = Number(req.query.id)

  // Находим покупку по id
  const purchase = Purchase.getById(id)

  if (!purchase) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Замовлення не знайдено',
        link: '/purchase-list',
      },
    })
  }

  // Получаем новые значения из формы
  const { firstname, lastname, phone, email } = req.body

  // Обновляем данные покупки
  if (firstname) purchase.firstname = firstname
  if (lastname) purchase.lastname = lastname
  if (phone) purchase.phone = phone
  if (email) purchase.email = email

  // Вернуть ответ пользователю
  return res.render('alert', {
    style: 'alert',
    data: {
      message: 'Успішно',
      info: 'Дані замовлення оновлено',
      link: `/purchase-delivery?id=${id}`,
    },
  })
})
// GET запрос для отображения страницы редактирования данных покупки
router.get('/purchase-change', function (req, res) {
  const id = Number(req.query.id)

  // Находим покупку по id
  const purchase = Purchase.getById(id)

  if (!purchase) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Замовлення не знайдено',
        link: '/purchase-list',
      },
    })
  }

  // Отображаем шаблон purchase-change.hbs и передаем данные о покупке в шаблон
  return res.render('purchase-change', {
    style: 'purchase-change',
    purchase,
  })
})

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
