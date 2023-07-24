// // Підключаємо технологію express для back-end сервера
// // Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
// // ================================================================

const express = require('express')
const router = express.Router()
const Product = require('./Product')

// нові товари та перевірка
const product1 = new Product(
  'Product 1',
  10,
  'Description 1',
)
const product2 = new Product(
  'Product 2',
  20,
  'Description 2',
)
const product3 = new Product(
  'Product 3',
  30,
  'Description 3',
)
const product4 = new Product(
  'Product 4',
  40,
  'Description 4',
)
const product5 = new Product(
  'Product 5',
  50,
  'Description 5',
)

Product.add(product1)
Product.add(product2)
Product.add(product3)
Product.add(product4)
Product.add(product5)

console.log(Product.getList()) // Должен вывести список добавленных товаров
console.log(Product.getById(product1.id)) // Должен вывести информацию о товаре с id product1.id

// GET ендпоїнт зі шляхом /product-create
router.get('/product-create', function (req, res) {
  res.render('product-create', {
    style: 'product-create',
  })
})

// POST ендпоїнт зі шляхом /product-create
router.post('/product-create', (req, res) => {
  const { name, price, description } = req.body

  // Створення нового товару через клас Product
  const product = new Product(name, price, description)

  // Додати товар в список
  Product.add(product)

  res.render('alert', {
    style: 'alert',
    result: 'Успішне виконання дії',
    info: 'Товар створений',
  })
})

// GET эндпоинт для отображения списка товаров
router.get('/product-list', function (req, res) {
  const productList = Product.getList()

  res.render('product-list', {
    style: 'product-list',
    data: {
      productList: {
        list: productList,
        isEmpty: productList.length === 0,
      },
    },
    productList: productList,
    css: 'styles.css',
  })
})

// GET эндпоинт для отображения страницы редактирования товара
router.get('/product-edit/:id', (req, res) => {
  const productId = req.params.id // Получаем идентификатор товара из параметра маршрута

  // Ваш код для загрузки данных товара с указанным идентификатором
  const product = Product.getById(productId)

  if (product) {
    res.render('product-edit', {
      style: 'product-edit',
      product: product,
    })
  } else {
    res.render('alert', {
      style: 'alert',
      result: '...Упс...щось пішло не так',
      info: 'Товар з таким ID не знайдено',
    })
  }
})

// POST эндпоинт для обновления товара
router.post('/product-edit/:id', (req, res) => {
  const productId = req.params.id
  const updatedData = {
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
  }

  const success = Product.updateById(productId, updatedData)

  if (success) {
    const productList = Product.getList()
    res.redirect('/product-list')
  } else {
    res.render('alert', {
      style: 'alert',
      info: 'Не вдалося знайти товар з таким ID',
    })
  }
})

// GET ендпоїнт для видалення товару
router.get('/product-delete', (req, res) => {
  // ***от Анни***
  const { id } = req.query
  Product.deleteById(Number(id))

  const success = Product.deleteById(Number(id))
  // ******
  // const productId = req.query.id // Отримати параметр id з запиту

  // if (!productId) {
  //   // Перевірка, чи передано id
  //   return res
  //     .status(400)
  //     .json({ error: 'Missing id parameter' })
  // }

  // // Видалення товару
  // const success = Product.deleteById(productId)

  if (success) {
    // Отримати оновлений список товарів після видалення
    const productList = Product.getList()
    res.render('product-list', {
      style: 'product-list',
      data: {
        productList: {
          list: productList,
          isEmpty: productList.length === 0,
        },
      },
      productList: productList,
      css: 'styles.css',
    })
  } else {
    return res.render('alert', {
      style: 'alert',
      result: '...Упс...щось пішло не так',
      info: 'Товар з таким ID не знайдено',
    })
  }
})

// ===========================================================

module.exports = router
