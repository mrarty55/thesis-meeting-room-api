const database = require('../config/database')

exports.getRents = async () => {
  const rents = await database('tbl_rents')
    .groupBy('rent_id')
    .groupBy('tbl_rents.created_at')
    .orderBy('tbl_rents.created_at', 'desc')
    .select({
      id: 'rent_id',
      booking: database.raw(
        "GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_bookings.booking_id, 'eventTitle', tbl_bookings.event_title, 'eventDate', tbl_bookings.event_date))"
      ),
      staff: database.raw(
        "GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_rents.staff_id, 'firstName', tbl_staffs.staff_first_name, 'lastName', tbl_staffs.staff_last_name))"
      ),
      checkinAt: 'tbl_rents.checkin_at',
      createdAt: 'tbl_rents.created_at',
      updatedAt: 'tbl_rents.updated_at',
    })
    .innerJoin(
      'tbl_bookings',
      'tbl_rents.booking_id',
      '=',
      'tbl_bookings.booking_id'
    )
    .innerJoin('tbl_staffs', 'tbl_rents.staff_id', '=', 'tbl_staffs.staff_id')

  if (rents.length > 0) {
    rents.forEach((rent) => {
      rent.booking = JSON.parse(rent.booking)
      rent.staff = JSON.parse(rent.staff)
    })
  }

  return rents
}

exports.getRentReport = async () => {
  return await database('tbl_rents')
    .select({
      id: 'tbl_rents.rent_id',
      eventTitle: 'tbl_bookings.event_title',
      checkinAt: 'tbl_rents.checkin_at',
    })
    .innerJoin(
      'tbl_bookings',
      'tbl_rents.booking_id',
      '=',
      'tbl_bookings.booking_id'
    )
}

exports.checkin = async ({ bookingId, received, change, staffId }) => {
  const rentId = await database('tbl_rents').returning('rent_id').insert({
    booking_id: bookingId,
    received: received,
    change: change,
    staff_id: staffId,
  })

  return rentId[0]
}
