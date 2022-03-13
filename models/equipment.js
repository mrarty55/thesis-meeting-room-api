const database = require('../config/database')

exports.getEquipments = async () => {
  return await database('tbl_equipments').select({
    id: 'equipment_id',
    name: 'equipment_name',
    description: 'equipment_description',
    image: 'equipment_image',
  })
}

exports.createEquipment = async ({ name, description, image }) => {
  return await database('tbl_equipments').returning('equipment_id').insert({
    equipment_name: name,
    equipment_description: description,
    equipment_image: image,
  })
}

exports.updateEquipment = async ({ id, name, description, image }) => {
  await database('tbl_equipments').where('equipment_id', id).update({
    equipment_name: name,
    equipment_description: description,
    equipment_image: image,
  })
}

exports.deleteEquipment = async ({ id }) => {
  await database('tbl_equipments').where('equipment_id', id).del()
}

exports.getEquipmentReport = async () => {
  return await database('tbl_equipments')
    .groupBy('tbl_equipments.equipment_id')
    .groupBy('tbl_equipments.equipment_name')
    .select({
      id: 'tbl_equipments.equipment_id',
      name: 'tbl_equipments.equipment_name',
      bookingCount: database.raw('count(tbl_booking_equipments.equipment_id)'),
    })
    .leftJoin(
      'tbl_booking_equipments',
      'tbl_equipments.equipment_id',
      '=',
      'tbl_booking_equipments.equipment_id'
    )
    .leftJoin(
      'tbl_bookings',
      'tbl_booking_equipments.booking_id',
      '=',
      'tbl_bookings.booking_id'
    )
}
