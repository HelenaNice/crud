const indexProductRouter = require('./index_product')
const indexUserRouter = require('./index_user')

app.use('/product', indexProductRouter) // Здесь используется маршрутизатор для продуктов
app.use('/user', indexUserRouter) // Здесь используется маршрутизатор для пользователей
