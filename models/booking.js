const database = require('../config/database')

exports.getBookingByUser = async ({ customerId }) => {
  const bookings = await database('tbl_bookings')
    .where('tbl_bookings.customer_id', customerId)
    .andWhere('tbl_bookings.booking_status_id', '<>', 4)
    .groupBy('tbl_bookings.booking_id')
    .groupBy('tbl_bookings.created_at')
    .orderBy('tbl_bookings.created_at', 'desc')
    .select({
      id: 'tbl_bookings.booking_id',
      eventTitle: 'tbl_bookings.event_title',
      eventType: database.raw(
        "GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_bookings.event_type_id, 'name', tbl_event_types.event_type_name))"
      ),
      eventStatus: database.raw(
        "GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_bookings.event_status_id, 'name', tbl_event_status.event_status_name))"
      ),
      eventDescription: 'tbl_bookings.event_description',
      eventDate: 'tbl_bookings.event_date',
      eventStartTime: 'tbl_bookings.start_time',
      eventEndTime: 'tbl_bookings.end_time',
      rooms: database.raw(
        "GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_booking_rooms.room_id, 'name', tbl_rooms.room_name))"
      ),
      roomStyle: database.raw(
        "GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_bookings.room_style_id, 'name', tbl_room_styles.room_style_name))"
      ),
      equipments: database.raw(
        "IF(tbl_booking_equipments.equipment_id IS NOT NULL, GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_booking_equipments.equipment_id, 'name', tbl_equipments.equipment_name)), NULL)"
      ),
      drinks: database.raw(
        "IF(tbl_booking_drinks.drink_id IS NOT NULL, GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_booking_drinks.drink_id, 'name', tbl_drinks.drink_name, 'amount', tbl_booking_drinks.drink_amount)), NULL)"
      ),
      table: 'tbl_bookings.table_qty',
      chair: 'tbl_bookings.chair_qty',
      additionalNote: 'tbl_bookings.additional_note',
      roomSubtotal: 'tbl_bookings.room_subtotal',
      drinkSubtotal: 'tbl_bookings.drink_subtotal',
      total: 'tbl_bookings.total',
      deposit: 'tbl_bookings.deposit',
      depositStatement: 'tbl_bookings.deposit_statement',
      bookingStatus: database.raw(
        "GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_bookings.booking_status_id, 'name', tbl_booking_status.booking_status_name))"
      ),
      customer: database.raw(
        "GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_bookings.customer_id, 'firstName', tbl_customers.customer_first_name, 'lastName', tbl_customers.customer_last_name, 'email',tbl_customers.customer_email, 'phoneNumber', tbl_customers.customer_phone_number, 'occupation', tbl_customers.customer_occupation))"
      ),
      createdAt: 'tbl_bookings.created_at',
      updatedAt: 'tbl_bookings.updated_at',
    })
    .innerJoin(
      'tbl_booking_rooms',
      'tbl_bookings.booking_id',
      '=',
      'tbl_booking_rooms.booking_id'
    )
    .innerJoin(
      'tbl_rooms',
      'tbl_booking_rooms.room_id',
      '=',
      'tbl_rooms.room_id'
    )
    .leftJoin(
      'tbl_booking_equipments',
      'tbl_bookings.booking_id',
      '=',
      'tbl_booking_equipments.booking_id'
    )
    .leftJoin(
      'tbl_equipments',
      'tbl_booking_equipments.equipment_id',
      '=',
      'tbl_equipments.equipment_id'
    )
    .leftJoin(
      'tbl_booking_drinks',
      'tbl_bookings.booking_id',
      '=',
      'tbl_booking_drinks.booking_id'
    )
    .leftJoin(
      'tbl_drinks',
      'tbl_booking_drinks.drink_id',
      '=',
      'tbl_drinks.drink_id'
    )
    .innerJoin(
      'tbl_event_types',
      'tbl_bookings.event_type_id',
      '=',
      'tbl_event_types.event_type_id'
    )
    .innerJoin(
      'tbl_event_status',
      'tbl_bookings.event_status_id',
      '=',
      'tbl_event_status.event_status_id'
    )
    .innerJoin(
      'tbl_room_styles',
      'tbl_bookings.room_style_id',
      '=',
      'tbl_room_styles.room_style_id'
    )
    .innerJoin(
      'tbl_booking_status',
      'tbl_bookings.booking_status_id',
      '=',
      'tbl_booking_status.booking_status_id'
    )
    .innerJoin(
      'tbl_customers',
      'tbl_bookings.customer_id',
      '=',
      'tbl_customers.customer_id'
    )

  bookings.forEach((booking) => {
    booking.rooms = booking.rooms
      .split('},{')
      .join('};{')
      .split(';')
      .map((room) => JSON.parse(room))
    if (booking.equipments) {
      booking.equipments = booking.equipments
        .split('},{')
        .join('};{')
        .split(';')
        .map((equipment) => JSON.parse(equipment))
    }
    if (booking.drinks) {
      booking.drinks = booking.drinks
        .split('},{')
        .join('};{')
        .split(';')
        .map((drink) => JSON.parse(drink))
    }
    booking.eventType = JSON.parse(booking.eventType)
    booking.eventStatus = JSON.parse(booking.eventStatus)
    booking.roomStyle = JSON.parse(booking.roomStyle)
    booking.bookingStatus = JSON.parse(booking.bookingStatus)
    booking.customer = JSON.parse(booking.customer)
  })

  return bookings
}

exports.getAllBookingByUser = async ({ customerId }) => {
  const bookings = await database('tbl_bookings')
    .where('tbl_bookings.customer_id', customerId)
    .groupBy('tbl_bookings.booking_id')
    .groupBy('tbl_bookings.created_at')
    .orderBy('tbl_bookings.created_at', 'desc')
    .select({
      id: 'tbl_bookings.booking_id',
      eventTitle: 'tbl_bookings.event_title',
      eventType: database.raw(
        "GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_bookings.event_type_id, 'name', tbl_event_types.event_type_name))"
      ),
      eventStatus: database.raw(
        "GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_bookings.event_status_id, 'name', tbl_event_status.event_status_name))"
      ),
      eventDescription: 'tbl_bookings.event_description',
      eventDate: 'tbl_bookings.event_date',
      eventStartTime: 'tbl_bookings.start_time',
      eventEndTime: 'tbl_bookings.end_time',
      rooms: database.raw(
        "GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_booking_rooms.room_id, 'name', tbl_rooms.room_name))"
      ),
      roomStyle: database.raw(
        "GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_bookings.room_style_id, 'name', tbl_room_styles.room_style_name))"
      ),
      equipments: database.raw(
        "IF(tbl_booking_equipments.equipment_id IS NOT NULL, GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_booking_equipments.equipment_id, 'name', tbl_equipments.equipment_name)), NULL)"
      ),
      drinks: database.raw(
        "IF(tbl_booking_drinks.drink_id IS NOT NULL, GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_booking_drinks.drink_id, 'name', tbl_drinks.drink_name, 'amount', tbl_booking_drinks.drink_amount)), NULL)"
      ),
      table: 'tbl_bookings.table_qty',
      chair: 'tbl_bookings.chair_qty',
      additionalNote: 'tbl_bookings.additional_note',
      roomSubtotal: 'tbl_bookings.room_subtotal',
      drinkSubtotal: 'tbl_bookings.drink_subtotal',
      total: 'tbl_bookings.total',
      deposit: 'tbl_bookings.deposit',
      depositStatement: 'tbl_bookings.deposit_statement',
      bookingStatus: database.raw(
        "GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_bookings.booking_status_id, 'name', tbl_booking_status.booking_status_name))"
      ),
      customer: database.raw(
        "GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_bookings.customer_id, 'firstName', tbl_customers.customer_first_name, 'lastName', tbl_customers.customer_last_name, 'email',tbl_customers.customer_email, 'phoneNumber', tbl_customers.customer_phone_number, 'occupation', tbl_customers.customer_occupation))"
      ),
      createdAt: 'tbl_bookings.created_at',
      updatedAt: 'tbl_bookings.updated_at',
    })
    .innerJoin(
      'tbl_booking_rooms',
      'tbl_bookings.booking_id',
      '=',
      'tbl_booking_rooms.booking_id'
    )
    .innerJoin(
      'tbl_rooms',
      'tbl_booking_rooms.room_id',
      '=',
      'tbl_rooms.room_id'
    )
    .leftJoin(
      'tbl_booking_equipments',
      'tbl_bookings.booking_id',
      '=',
      'tbl_booking_equipments.booking_id'
    )
    .leftJoin(
      'tbl_equipments',
      'tbl_booking_equipments.equipment_id',
      '=',
      'tbl_equipments.equipment_id'
    )
    .leftJoin(
      'tbl_booking_drinks',
      'tbl_bookings.booking_id',
      '=',
      'tbl_booking_drinks.booking_id'
    )
    .leftJoin(
      'tbl_drinks',
      'tbl_booking_drinks.drink_id',
      '=',
      'tbl_drinks.drink_id'
    )
    .innerJoin(
      'tbl_event_types',
      'tbl_bookings.event_type_id',
      '=',
      'tbl_event_types.event_type_id'
    )
    .innerJoin(
      'tbl_event_status',
      'tbl_bookings.event_status_id',
      '=',
      'tbl_event_status.event_status_id'
    )
    .innerJoin(
      'tbl_room_styles',
      'tbl_bookings.room_style_id',
      '=',
      'tbl_room_styles.room_style_id'
    )
    .innerJoin(
      'tbl_booking_status',
      'tbl_bookings.booking_status_id',
      '=',
      'tbl_booking_status.booking_status_id'
    )
    .innerJoin(
      'tbl_customers',
      'tbl_bookings.customer_id',
      '=',
      'tbl_customers.customer_id'
    )

  bookings.forEach((booking) => {
    booking.rooms = booking.rooms
      .split('},{')
      .join('};{')
      .split(';')
      .map((room) => JSON.parse(room))
    if (booking.equipments) {
      booking.equipments = booking.equipments
        .split('},{')
        .join('};{')
        .split(';')
        .map((equipment) => JSON.parse(equipment))
    }
    if (booking.drinks) {
      booking.drinks = booking.drinks
        .split('},{')
        .join('};{')
        .split(';')
        .map((drink) => JSON.parse(drink))
    }
    booking.eventType = JSON.parse(booking.eventType)
    booking.eventStatus = JSON.parse(booking.eventStatus)
    booking.roomStyle = JSON.parse(booking.roomStyle)
    booking.bookingStatus = JSON.parse(booking.bookingStatus)
    booking.customer = JSON.parse(booking.customer)
  })

  return bookings
}

exports.getAllBooking = async () => {
  const bookings = await database('tbl_bookings')
    .groupBy('tbl_bookings.booking_id')
    .groupBy('tbl_bookings.created_at')
    .orderBy('tbl_bookings.created_at', 'desc')
    .select({
      id: 'tbl_bookings.booking_id',
      eventTitle: 'tbl_bookings.event_title',
      eventType: database.raw(
        "GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_bookings.event_type_id, 'name', tbl_event_types.event_type_name))"
      ),
      eventStatus: database.raw(
        "GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_bookings.event_status_id, 'name', tbl_event_status.event_status_name))"
      ),
      eventDescription: 'tbl_bookings.event_description',
      eventDate: 'tbl_bookings.event_date',
      eventStartTime: 'tbl_bookings.start_time',
      eventEndTime: 'tbl_bookings.end_time',
      rooms: database.raw(
        "GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_booking_rooms.room_id, 'name', tbl_rooms.room_name))"
      ),
      roomStyle: database.raw(
        "GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_bookings.room_style_id, 'name', tbl_room_styles.room_style_name))"
      ),
      equipments: database.raw(
        "IF(tbl_booking_equipments.equipment_id IS NOT NULL, GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_booking_equipments.equipment_id, 'name', tbl_equipments.equipment_name)), NULL)"
      ),
      drinks: database.raw(
        "IF(tbl_booking_drinks.drink_id IS NOT NULL, GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_booking_drinks.drink_id, 'name', tbl_drinks.drink_name, 'amount', tbl_booking_drinks.drink_amount)), NULL)"
      ),
      table: 'tbl_bookings.table_qty',
      chair: 'tbl_bookings.chair_qty',
      additionalNote: 'tbl_bookings.additional_note',
      roomSubtotal: 'tbl_bookings.room_subtotal',
      drinkSubtotal: 'tbl_bookings.drink_subtotal',
      total: 'tbl_bookings.total',
      deposit: 'tbl_bookings.deposit',
      depositStatement: 'tbl_bookings.deposit_statement',
      bookingStatus: database.raw(
        "GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_bookings.booking_status_id, 'name', tbl_booking_status.booking_status_name))"
      ),
      customer: database.raw(
        "GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_bookings.customer_id, 'firstName', tbl_customers.customer_first_name, 'lastName', tbl_customers.customer_last_name, 'email',tbl_customers.customer_email, 'phoneNumber', tbl_customers.customer_phone_number, 'occupation', tbl_customers.customer_occupation))"
      ),
      createdAt: 'tbl_bookings.created_at',
      updatedAt: 'tbl_bookings.updated_at',
    })
    .innerJoin(
      'tbl_booking_rooms',
      'tbl_bookings.booking_id',
      '=',
      'tbl_booking_rooms.booking_id'
    )
    .innerJoin(
      'tbl_rooms',
      'tbl_booking_rooms.room_id',
      '=',
      'tbl_rooms.room_id'
    )
    .leftJoin(
      'tbl_booking_equipments',
      'tbl_bookings.booking_id',
      '=',
      'tbl_booking_equipments.booking_id'
    )
    .leftJoin(
      'tbl_equipments',
      'tbl_booking_equipments.equipment_id',
      '=',
      'tbl_equipments.equipment_id'
    )
    .leftJoin(
      'tbl_booking_drinks',
      'tbl_bookings.booking_id',
      '=',
      'tbl_booking_drinks.booking_id'
    )
    .leftJoin(
      'tbl_drinks',
      'tbl_booking_drinks.drink_id',
      '=',
      'tbl_drinks.drink_id'
    )
    .innerJoin(
      'tbl_event_types',
      'tbl_bookings.event_type_id',
      '=',
      'tbl_event_types.event_type_id'
    )
    .innerJoin(
      'tbl_event_status',
      'tbl_bookings.event_status_id',
      '=',
      'tbl_event_status.event_status_id'
    )
    .innerJoin(
      'tbl_room_styles',
      'tbl_bookings.room_style_id',
      '=',
      'tbl_room_styles.room_style_id'
    )
    .innerJoin(
      'tbl_booking_status',
      'tbl_bookings.booking_status_id',
      '=',
      'tbl_booking_status.booking_status_id'
    )
    .innerJoin(
      'tbl_customers',
      'tbl_bookings.customer_id',
      '=',
      'tbl_customers.customer_id'
    )

  bookings.forEach((booking) => {
    booking.rooms = booking.rooms
      .split('},{')
      .join('};{')
      .split(';')
      .map((room) => JSON.parse(room))
    if (booking.equipments) {
      booking.equipments = booking.equipments
        .split('},{')
        .join('};{')
        .split(';')
        .map((equipment) => JSON.parse(equipment))
    }
    if (booking.drinks) {
      booking.drinks = booking.drinks
        .split('},{')
        .join('};{')
        .split(';')
        .map((drink) => JSON.parse(drink))
    }
    booking.eventType = JSON.parse(booking.eventType)
    booking.eventStatus = JSON.parse(booking.eventStatus)
    booking.roomStyle = JSON.parse(booking.roomStyle)
    booking.bookingStatus = JSON.parse(booking.bookingStatus)
    booking.customer = JSON.parse(booking.customer)
  })

  return bookings
}

exports.getPendingBooking = async () => {
  const bookings = await database('tbl_bookings')
    .whereIn('tbl_bookings.booking_status_id', [1, 2])
    .groupBy('tbl_bookings.booking_id')
    .groupBy('tbl_bookings.created_at')
    .orderBy('tbl_bookings.created_at', 'desc')
    .select({
      id: 'tbl_bookings.booking_id',
      eventTitle: 'tbl_bookings.event_title',
      eventType: database.raw(
        "GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_bookings.event_type_id, 'name', tbl_event_types.event_type_name))"
      ),
      eventStatus: database.raw(
        "GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_bookings.event_status_id, 'name', tbl_event_status.event_status_name))"
      ),
      eventDescription: 'tbl_bookings.event_description',
      eventDate: 'tbl_bookings.event_date',
      eventStartTime: 'tbl_bookings.start_time',
      eventEndTime: 'tbl_bookings.end_time',
      rooms: database.raw(
        "GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_booking_rooms.room_id, 'name', tbl_rooms.room_name))"
      ),
      roomStyle: database.raw(
        "GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_bookings.room_style_id, 'name', tbl_room_styles.room_style_name))"
      ),
      equipments: database.raw(
        "IF(tbl_booking_equipments.equipment_id IS NOT NULL, GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_booking_equipments.equipment_id, 'name', tbl_equipments.equipment_name)), NULL)"
      ),
      drinks: database.raw(
        "IF(tbl_booking_drinks.drink_id IS NOT NULL, GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_booking_drinks.drink_id, 'name', tbl_drinks.drink_name, 'amount', tbl_booking_drinks.drink_amount)), NULL)"
      ),
      table: 'tbl_bookings.table_qty',
      chair: 'tbl_bookings.chair_qty',
      additionalNote: 'tbl_bookings.additional_note',
      roomSubtotal: 'tbl_bookings.room_subtotal',
      drinkSubtotal: 'tbl_bookings.drink_subtotal',
      total: 'tbl_bookings.total',
      deposit: 'tbl_bookings.deposit',
      depositStatement: 'tbl_bookings.deposit_statement',
      bookingStatus: database.raw(
        "GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_bookings.booking_status_id, 'name', tbl_booking_status.booking_status_name))"
      ),
      customer: database.raw(
        "GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_bookings.customer_id, 'firstName', tbl_customers.customer_first_name, 'lastName', tbl_customers.customer_last_name, 'email',tbl_customers.customer_email, 'phoneNumber', tbl_customers.customer_phone_number, 'occupation', tbl_customers.customer_occupation))"
      ),
      createdAt: 'tbl_bookings.created_at',
      updatedAt: 'tbl_bookings.updated_at',
    })
    .innerJoin(
      'tbl_booking_rooms',
      'tbl_bookings.booking_id',
      '=',
      'tbl_booking_rooms.booking_id'
    )
    .innerJoin(
      'tbl_rooms',
      'tbl_booking_rooms.room_id',
      '=',
      'tbl_rooms.room_id'
    )
    .leftJoin(
      'tbl_booking_equipments',
      'tbl_bookings.booking_id',
      '=',
      'tbl_booking_equipments.booking_id'
    )
    .leftJoin(
      'tbl_equipments',
      'tbl_booking_equipments.equipment_id',
      '=',
      'tbl_equipments.equipment_id'
    )
    .leftJoin(
      'tbl_booking_drinks',
      'tbl_bookings.booking_id',
      '=',
      'tbl_booking_drinks.booking_id'
    )
    .leftJoin(
      'tbl_drinks',
      'tbl_booking_drinks.drink_id',
      '=',
      'tbl_drinks.drink_id'
    )
    .innerJoin(
      'tbl_event_types',
      'tbl_bookings.event_type_id',
      '=',
      'tbl_event_types.event_type_id'
    )
    .innerJoin(
      'tbl_event_status',
      'tbl_bookings.event_status_id',
      '=',
      'tbl_event_status.event_status_id'
    )
    .innerJoin(
      'tbl_room_styles',
      'tbl_bookings.room_style_id',
      '=',
      'tbl_room_styles.room_style_id'
    )
    .innerJoin(
      'tbl_booking_status',
      'tbl_bookings.booking_status_id',
      '=',
      'tbl_booking_status.booking_status_id'
    )
    .innerJoin(
      'tbl_customers',
      'tbl_bookings.customer_id',
      '=',
      'tbl_customers.customer_id'
    )

  if (bookings.length > 0) {
    bookings.forEach((booking) => {
      booking.rooms = booking.rooms
        .split('},{')
        .join('};{')
        .split(';')
        .map((room) => JSON.parse(room))
      if (booking.equipments) {
        booking.equipments = booking.equipments
          .split('},{')
          .join('};{')
          .split(';')
          .map((equipment) => JSON.parse(equipment))
      }
      if (booking.drinks) {
        booking.drinks = booking.drinks
          .split('},{')
          .join('};{')
          .split(';')
          .map((drink) => JSON.parse(drink))
      }
      booking.eventType = JSON.parse(booking.eventType)
      booking.eventStatus = JSON.parse(booking.eventStatus)
      booking.roomStyle = JSON.parse(booking.roomStyle)
      booking.bookingStatus = JSON.parse(booking.bookingStatus)
      booking.customer = JSON.parse(booking.customer)
    })
  }

  return bookings
}

exports.getConfirmedBooking = async () => {
  const bookings = await database('tbl_bookings')
    .where('tbl_bookings.booking_status_id', 3)
    .andWhere('tbl_rents.booking_id', 'is', null)
    .groupBy('tbl_bookings.booking_id')
    .groupBy('tbl_bookings.created_at')
    .orderBy('tbl_bookings.created_at', 'desc')
    .select({
      id: 'tbl_bookings.booking_id',
      eventTitle: 'tbl_bookings.event_title',
      eventType: database.raw(
        "GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_bookings.event_type_id, 'name', tbl_event_types.event_type_name))"
      ),
      eventStatus: database.raw(
        "GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_bookings.event_status_id, 'name', tbl_event_status.event_status_name))"
      ),
      eventDescription: 'tbl_bookings.event_description',
      eventDate: 'tbl_bookings.event_date',
      eventStartTime: 'tbl_bookings.start_time',
      eventEndTime: 'tbl_bookings.end_time',
      rooms: database.raw(
        "GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_booking_rooms.room_id, 'name', tbl_rooms.room_name))"
      ),
      roomStyle: database.raw(
        "GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_bookings.room_style_id, 'name', tbl_room_styles.room_style_name))"
      ),
      equipments: database.raw(
        "IF(tbl_booking_equipments.equipment_id IS NOT NULL, GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_booking_equipments.equipment_id, 'name', tbl_equipments.equipment_name)), NULL)"
      ),
      drinks: database.raw(
        "IF(tbl_booking_drinks.drink_id IS NOT NULL, GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_booking_drinks.drink_id, 'name', tbl_drinks.drink_name, 'amount', tbl_booking_drinks.drink_amount)), NULL)"
      ),
      table: 'tbl_bookings.table_qty',
      chair: 'tbl_bookings.chair_qty',
      additionalNote: 'tbl_bookings.additional_note',
      roomSubtotal: 'tbl_bookings.room_subtotal',
      drinkSubtotal: 'tbl_bookings.drink_subtotal',
      total: 'tbl_bookings.total',
      deposit: 'tbl_bookings.deposit',
      depositStatement: 'tbl_bookings.deposit_statement',
      bookingStatus: database.raw(
        "GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_bookings.booking_status_id, 'name', tbl_booking_status.booking_status_name))"
      ),
      customer: database.raw(
        "GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_bookings.customer_id, 'firstName', tbl_customers.customer_first_name, 'lastName', tbl_customers.customer_last_name, 'email',tbl_customers.customer_email, 'phoneNumber', tbl_customers.customer_phone_number, 'occupation', tbl_customers.customer_occupation))"
      ),
      staff: database.raw(
        "GROUP_CONCAT(DISTINCT JSON_OBJECT('id', tbl_bookings.staff_id, 'firstName', tbl_staffs.staff_first_name, 'lastName', tbl_staffs.staff_last_name))"
      ),
      createdAt: 'tbl_bookings.created_at',
      updatedAt: 'tbl_bookings.updated_at',
    })
    .innerJoin(
      'tbl_booking_rooms',
      'tbl_bookings.booking_id',
      '=',
      'tbl_booking_rooms.booking_id'
    )
    .innerJoin(
      'tbl_rooms',
      'tbl_booking_rooms.room_id',
      '=',
      'tbl_rooms.room_id'
    )
    .leftJoin(
      'tbl_booking_equipments',
      'tbl_bookings.booking_id',
      '=',
      'tbl_booking_equipments.booking_id'
    )
    .leftJoin(
      'tbl_equipments',
      'tbl_booking_equipments.equipment_id',
      '=',
      'tbl_equipments.equipment_id'
    )
    .leftJoin(
      'tbl_booking_drinks',
      'tbl_bookings.booking_id',
      '=',
      'tbl_booking_drinks.booking_id'
    )
    .leftJoin(
      'tbl_drinks',
      'tbl_booking_drinks.drink_id',
      '=',
      'tbl_drinks.drink_id'
    )
    .innerJoin(
      'tbl_event_types',
      'tbl_bookings.event_type_id',
      '=',
      'tbl_event_types.event_type_id'
    )
    .innerJoin(
      'tbl_event_status',
      'tbl_bookings.event_status_id',
      '=',
      'tbl_event_status.event_status_id'
    )
    .innerJoin(
      'tbl_room_styles',
      'tbl_bookings.room_style_id',
      '=',
      'tbl_room_styles.room_style_id'
    )
    .innerJoin(
      'tbl_booking_status',
      'tbl_bookings.booking_status_id',
      '=',
      'tbl_booking_status.booking_status_id'
    )
    .innerJoin(
      'tbl_customers',
      'tbl_bookings.customer_id',
      '=',
      'tbl_customers.customer_id'
    )
    .innerJoin(
      'tbl_staffs',
      'tbl_bookings.staff_id',
      '=',
      'tbl_staffs.staff_id'
    )
    .leftJoin(
      'tbl_rents',
      'tbl_bookings.booking_id',
      '=',
      'tbl_rents.booking_id'
    )

  if (bookings.length > 0) {
    bookings.forEach((booking) => {
      booking.rooms = booking.rooms
        .split('},{')
        .join('};{')
        .split(';')
        .map((room) => JSON.parse(room))
      booking.equipments = booking.equipments
        .split('},{')
        .join('};{')
        .split(';')
        .map((equipment) => JSON.parse(equipment))
      booking.drinks = booking.drinks
        .split('},{')
        .join('};{')
        .split(';')
        .map((drink) => JSON.parse(drink))
      booking.eventType = JSON.parse(booking.eventType)
      booking.eventStatus = JSON.parse(booking.eventStatus)
      booking.roomStyle = JSON.parse(booking.roomStyle)
      booking.bookingStatus = JSON.parse(booking.bookingStatus)
      booking.customer = JSON.parse(booking.customer)
      booking.staff = JSON.parse(booking.staff)
    })
  }

  return bookings
}

exports.getBookingSchedule = async () => {
  return await database('tbl_bookings')
    .where('booking_status_id', '<>', 4)
    .select({
      name: database.raw(
        "IF(event_status_id = 1, event_title, 'ງານສ່ວນບຸກຄົນ')"
      ),
      date: 'event_date',
      start: database.raw('TIMESTAMP(event_date, start_time)'),
      end: database.raw('TIMESTAMP(event_date, end_time)'),
    })
}

exports.bookRooms = async ({
  eventTitle,
  eventType,
  eventStatus,
  eventDescription,
  eventDate,
  eventStartTime,
  eventEndTime,
  roomStyle,
  table,
  chair,
  additionalNote,
  roomSubtotal,
  drinkSubtotal,
  total,
  deposit,
  customer,
  rooms,
  equipments,
  drinks,
}) => {
  return await database.transaction(async (trx) => {
    const bookingId = await trx('tbl_bookings').returning('booking_id').insert({
      event_title: eventTitle,
      event_type_id: eventType,
      event_status_id: eventStatus,
      event_description: eventDescription,
      event_date: eventDate,
      start_time: eventStartTime,
      end_time: eventEndTime,
      room_style_id: roomStyle,
      table_qty: table,
      chair_qty: chair,
      additional_note: additionalNote,
      room_subtotal: roomSubtotal,
      drink_subtotal: drinkSubtotal,
      total: total,
      deposit: deposit,
      deposit_statement: '',
      booking_status_id: 1,
      customer_id: customer,
    })

    for (room of rooms) {
      await trx('tbl_booking_rooms').insert({
        room_id: room.id,
        booking_id: bookingId[0],
      })
    }

    if (drinks.length > 0 && drinks !== undefined) {
      for (drink of drinks) {
        await trx('tbl_booking_drinks').insert({
          drink_id: drink.id,
          drink_amount: drink.amount,
          booking_id: bookingId[0],
        })
      }
    }

    if (equipments.length > 0 && equipments !== undefined) {
      for (equipment of equipments) {
        await trx('tbl_booking_equipments').insert({
          equipment_id: equipment.id,
          booking_id: bookingId[0],
        })
      }
    }

    return bookingId[0]
  })
}

exports.checkRooms = async ({ roomId, date, startTime, endTime }) => {
  return await database('tbl_bookings')
    .innerJoin(
      'tbl_booking_rooms',
      'tbl_bookings.booking_id',
      '=',
      'tbl_booking_rooms.booking_id'
    )
    .where('tbl_booking_rooms.room_id', '=', roomId)
    .andWhere('tbl_bookings.event_date', '=', date)
    .andWhere('tbl_bookings.start_time', '<', endTime)
    .andWhere('tbl_bookings.end_time', '>', startTime)
    .select({ bookingId: 'tbl_bookings.booking_id' })
}

exports.updateDepositStatement = async ({ statement, bookingId }) => {
  await database('tbl_bookings')
    .where('booking_id', bookingId)
    .update({ deposit_statement: statement, booking_status_id: 2 })
}

exports.confirmBooking = async ({ bookingId, staffId }) => {
  await database('tbl_bookings')
    .where('booking_id', bookingId)
    .update({ booking_status_id: 3, staff_id: staffId })
}

exports.cancelBooking = async ({ bookingId }) => {
  await database('tbl_bookings')
    .where('booking_id', bookingId)
    .update('booking_status_id', 4)
}

exports.updateBooking = async ({
  id,
  eventTitle,
  eventDescription,
  eventType,
  eventStatus,
  roomStyle,
  additionalNote,
}) => {
  await database('tbl_bookings').where('booking_id', id).update({
    event_title: eventTitle,
    event_description: eventDescription,
    event_type_id: eventType,
    event_status_id: eventStatus,
    room_style_id: roomStyle,
    additional_note: additionalNote,
  })
}

exports.deleteBooking = async ({ bookingId }) => {
  await database('tbl_bookings').where('booking_id', bookingId).del()
}

exports.getEventTypes = async () => {
  return await database('tbl_event_types').select({
    id: 'event_type_id',
    name: 'event_type_name',
  })
}

exports.getEventStatus = async () => {
  return await database('tbl_event_status').select({
    id: 'event_status_id',
    name: 'event_status_name',
  })
}

exports.getRoomStyles = async () => {
  return await database('tbl_room_styles').select({
    id: 'room_style_id',
    name: 'room_style_name',
  })
}

exports.getRooms = async () => {
  return await database('tbl_rooms').select({
    id: 'room_id',
    name: 'room_name',
    hourlyRate: 'room_hourly_rate',
    shiftRate: 'room_shift_rate',
  })
}

exports.getEquipments = async () => {
  return await database('tbl_equipments').select({
    id: 'equipment_id',
    name: 'equipment_name',
  })
}

exports.getDrinks = async () => {
  return await database('tbl_drinks').select({
    id: 'drink_id',
    name: 'drink_name',
    price: 'drink_price',
    amount: 0,
  })
}

exports.getBookingStatus = async () => {
  return await database('tbl_booking_status').select({
    id: 'booking_status_id',
    name: 'booking_status_name',
  })
}

exports.getRevenueReport = async () => {
  const overall = await database('tbl_bookings')
    .whereNotIn('booking_status_id', [4])
    .select({
      total: database.raw('SUM(total)'),
      roomSubtotal: database.raw('SUM(room_subtotal)'),
      drinkSubtotal: database.raw('SUM(drink_subtotal)'),
    })
    .first()

  const confirmed = await database('tbl_bookings')
    .where('booking_status_id', 3)
    .select({
      total: database.raw('SUM(total)'),
      roomSubtotal: database.raw('SUM(room_subtotal)'),
      drinkSubtotal: database.raw('SUM(drink_subtotal)'),
    })
    .first()

  const checkedin = await database('tbl_bookings')
    .where('booking_status_id', 3)
    .select({
      total: database.raw(
        'IF(tbl_rents.booking_id IS NOT NULL, SUM(total), 0)'
      ),
      roomSubtotal: database.raw(
        'IF(tbl_rents.booking_id IS NOT NULL, SUM(room_subtotal), 0)'
      ),
      drinkSubtotal: database.raw(
        'IF(tbl_rents.booking_id IS NOT NULL, SUM(drink_subtotal), 0)'
      ),
    })
    .innerJoin(
      'tbl_rents',
      'tbl_bookings.booking_id',
      '=',
      'tbl_rents.booking_id'
    )
    .first()

  return { overall, confirmed, checkedin }
}

exports.getBookingReport = async () => {
  return await database('tbl_bookings')
    .select({
      id: 'tbl_bookings.booking_id',
      eventTitle: 'tbl_bookings.event_title',
      eventType: 'tbl_event_types.event_type_name',
      eventStatus: 'tbl_event_status.event_status_name',
      eventDate: 'tbl_bookings.event_date',
      createdAt: 'tbl_bookings.created_at',
    })
    .innerJoin(
      'tbl_event_types',
      'tbl_bookings.event_type_id',
      '=',
      'tbl_event_types.event_type_id'
    )
    .innerJoin(
      'tbl_event_status',
      'tbl_bookings.event_status_id',
      '=',
      'tbl_event_status.event_status_id'
    )
}

exports.getDashboardSummary = async () => {
  return await database('tbl_bookings')
    .select({
      bookingCount: database.raw('COUNT(booking_id)'),
      totalIncome: database.raw('SUM(total)'),
      totalHours: database.raw(
        'SUM(TIME_TO_SEC(TIMEDIFF(end_time, start_time))) / 3600'
      ),
    })
    .first()
}

exports.getStatusRatio = async () => {
  return await database('tbl_booking_status')
    .groupBy('tbl_booking_status.booking_status_id')
    .groupBy('tbl_booking_status.booking_status_name')
    .select({
      id: 'tbl_booking_status.booking_status_id',
      name: 'tbl_booking_status.booking_status_name',
      count: database.raw('COUNT(tbl_bookings.booking_status_id)'),
    })
    .leftJoin(
      'tbl_bookings',
      'tbl_booking_status.booking_status_id',
      '=',
      'tbl_bookings.booking_status_id'
    )
}
