const database = require('../config/database')

exports.getRooms = async () => {
  return await database('tbl_rooms').select({
    id: 'room_id',
    name: 'room_name',
    description: 'room_description',
    hourlyRate: 'room_hourly_rate',
    shiftRate: 'room_shift_rate',
    capacity: 'room_capacity',
    image: 'room_image',
  })
}

exports.createRoom = async ({
  name,
  description,
  hourlyRate,
  shiftRate,
  capacity,
  image,
}) => {
  return await database('tbl_rooms').returning('room_id').insert({
    room_name: name,
    room_description: description,
    room_hourly_rate: hourlyRate,
    room_shift_rate: shiftRate,
    room_capacity: capacity,
    room_image: image,
  })
}

exports.updateRoom = async ({
  id,
  name,
  description,
  hourlyRate,
  shiftRate,
  capacity,
  image,
}) => {
  return await database('tbl_rooms').where('room_id', id).update({
    room_name: name,
    room_description: description,
    room_hourly_rate: hourlyRate,
    room_shift_rate: shiftRate,
    room_capacity: capacity,
    room_image: image,
  })
}

exports.deleteRoom = async ({ id }) => {
  await database('tbl_rooms').where('room_id', id).del()
}

exports.getRoomReport = async () => {
  return await database('tbl_rooms')
    .groupBy('tbl_rooms.room_id')
    .groupBy('tbl_rooms.room_name')
    .select({
      id: 'tbl_rooms.room_id',
      name: 'tbl_rooms.room_name',
      bookingCount: database.raw('count(tbl_booking_rooms.room_id)'),
      bookingHours: database.raw(
        'sum(time_to_sec(timediff(tbl_bookings.end_time, tbl_bookings.start_time))) / 3600'
      ),
    })
    .leftJoin(
      'tbl_booking_rooms',
      'tbl_rooms.room_id',
      '=',
      'tbl_booking_rooms.room_id'
    )
    .leftJoin(
      'tbl_bookings',
      'tbl_booking_rooms.booking_id',
      '=',
      'tbl_bookings.booking_id'
    )
}
