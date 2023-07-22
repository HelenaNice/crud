class Product {
  static #list = []

  constructor(name, price, description) {
    this.id = Math.floor(Math.random() * 90000) + 10000
    this.createDate = new Date().toISOString()
    this.name = name
    this.price = price
    this.description = description
  }

  static getList() {
    return this.#list
  }

  static add(product) {
    this.#list.push(product)
  }

  static getById(id) {
    return this.#list.find(
      (product) => product.id === parseInt(id),
    )
  }

  static updateById(id, data) {
    const product = this.getById(id)

    if (product) {
      if (data.name) {
        product.name = data.name
      }

      if (data.price) {
        product.price = data.price
      }

      if (data.description) {
        product.description = data.description
      }

      return true
    } else {
      return false
    }
  }

  static deleteById(id) {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }
}

module.exports = Product
