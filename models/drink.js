const database = require('../config/database')

exports.getDrinks = async () => {
  return await database('tbl_drinks').select({
    id: 'drink_id',
    name: 'drink_name',
    description: 'drink_description',
    price: 'drink_price',
    image: 'drink_image',
  })
}

exports.createDrink = async ({ name, description, image, price }) => {
  return await database('tbl_drinks').returning('drink_id').insert({
    drink_name: name,
    drink_description: description,
    drink_image: image,
    drink_price: price,
  })
}

exports.updateDrink = async ({ id, name, description, image, price }) => {
  await database('tbl_drinks').where('drink_id', id).update({
    drink_name: name,
    drink_description: description,
    drink_image: image,
    drink_price: price,
  })
}

exports.deleteDrink = async ({ id }) => {
  await database('tbl_drinks').where('drink_id', id).del()
}

exports.getDrinkReport = async () => {
  return await database('tbl_drinks')
    .groupBy('tbl_drinks.drink_id')
    .groupBy('tbl_drinks.drink_name')
    .select({
      id: 'tbl_drinks.drink_id',
      name: 'tbl_drinks.drink_name',
      sellCount: database.raw('sum(tbl_booking_drinks.drink_amount)'),
      sellTotal: database.raw(
        'sum(tbl_booking_drinks.drink_amount * tbl_drinks.drink_price)'
      ),
    })
    .leftJoin(
      'tbl_booking_drinks',
      'tbl_drinks.drink_id',
      '=',
      'tbl_booking_drinks.drink_id'
    )
    .leftJoin(
      'tbl_bookings',
      'tbl_booking_drinks.booking_id',
      '=',
      'tbl_bookings.booking_id'
    )
}
