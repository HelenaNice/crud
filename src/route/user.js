// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class User {
  static #list = []

  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  verifyPassword = (password) => this.password === password

  static add = (user) => {
    this.#list.push(user)
  }

  static getList = () => this.#list
  static getById = (id) => {
    return this.#list.find((user) => user.id === id)
  }

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (user) => user.id === id,
    )

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, data) => {
    const user = this.getById(id)

    if (user) {
      this.update(user, data)

      return true
    } else {
      return false
    }
  }
  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}
// ================================================================
// router.get Створює нам один ендпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  const list = User.getList()

  res.render('user-index', {
    style: 'user-index',
    data: {
      users: {
        list: User.getList(),
        isEmpty: list.length === 0,
      },
    },
  })
})

// ================================================================
router.post('/user-create', function (req, res) {
  const { email, login, password } = req.body

  const user = new User(email, login, password)
  User.add(user)

  res.render('user-success-info', {
    style: 'user-success-info',
    info: 'Користувач створений',
  })
})
// ================================================================
router.get('/user-delete', function (req, res) {
  const { id } = req.query

  User.deleteById(Number(id))

  res.render('user-success-info', {
    style: 'user-success-info',
    info: 'Користувача видалено',
  })
})

// ================================================================
router.post('/user-update', function (req, res) {
  const { email, password, id } = req.body

  let result = false

  const user = User.getById(Number(id))

  result = false

  if (user.verifyPassword(password)) {
    User.update(user, { email })
    result = true
  }

  // const result = User.updateById(Number(id), { email })

  res.render('user-success-info', {
    style: 'user-success-info',
    info: result
      ? 'Електронна пошта оновлена'
      : 'Сталася помилка при оновленні даних',
  })
})
// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
