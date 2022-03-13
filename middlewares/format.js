const bcrypt = require('bcrypt')

exports.checkUserRegisterBody = async (req, res, next) => {
  if (req.body.firstName?.length === 0 || req.body.firstName === undefined) {
    return res.status(400).json({ message: 'First name required' })
  }
  if (req.body.lastName?.length === 0 || req.body.lastName === undefined) {
    return res.status(400).json({ message: 'Last name required' })
  }
  if (req.body.email?.length === 0 || req.body.email === undefined) {
    return res.status(400).json({ message: 'Email required' })
  }
  if (
    req.body.phoneNumber?.length === 0 ||
    req.body.phoneNumber === undefined
  ) {
    return res.status(400).json({
      message: 'Phone number required',
    })
  }
  if (req.body.username?.length === 0 || req.body.username === undefined) {
    return res.status(400).json({ message: 'Username required' })
  }
  if (req.body.password?.length === 0 || req.body.password === undefined) {
    return res.status(400).json({
      message: 'Password required',
    })
  }
  if (req.body.password?.length < 8) {
    return res.status(400).json({
      message: 'Password should have at least 8 characters',
    })
  }
  req.body.hashPassword = await bcrypt.hash(req.body.password, 10)
  next()
}

exports.checkUserBody = async (req, res, next) => {
  if (req.body.firstName?.length === 0 || req.body.firstName === undefined) {
    return res.status(400).json({ message: 'First name required' })
  }
  if (req.body.lastName?.length === 0 || req.body.lastName === undefined) {
    return res.status(400).json({ message: 'Last name required' })
  }
  if (req.body.email?.length === 0 || req.body.email === undefined) {
    return res.status(400).json({ message: 'Email required' })
  }
  if (
    req.body.phoneNumber?.length === 0 ||
    req.body.phoneNumber === undefined
  ) {
    return res.status(400).json({
      message: 'Phone number required',
    })
  }
  next()
}

exports.checkAdminRegisterBody = async (req, res, next) => {
  if (req.body.firstName?.length === 0 || req.body.firstName === undefined) {
    return res.status(400).json({ message: 'First name required' })
  }
  if (req.body.lastName?.length === 0 || req.body.lastName === undefined) {
    return res.status(400).json({ message: 'Last name required' })
  }
  if (req.body.email?.length === 0 || req.body.email === undefined) {
    return res.status(400).json({ message: 'Email required' })
  }
  if (
    req.body.phoneNumber?.length === 0 ||
    req.body.phoneNumber === undefined
  ) {
    return res.status(400).json({
      message: 'Phone number required',
    })
  }
  if (req.body.username?.length === 0 || req.body.username === undefined) {
    return res.status(400).json({ message: 'Username required' })
  }
  if (req.body.roleId === undefined) {
    return res.status(400).json({ message: 'Role required' })
  }
  if (req.body.password?.length === 0 || req.body.password === undefined) {
    return res.status(400).json({
      message: 'Password required',
    })
  }
  if (req.body.password?.length < 8) {
    return res.status(400).json({
      message: 'Password should have at least 8 characters',
    })
  }
  req.body.hashPassword = await bcrypt.hash(req.body.password, 10)
  next()
}

exports.checkAdminBody = (req, res, next) => {
  if (req.body.id?.length === 0 || req.body.firstName === undefined) {
    return res.status(400).json({ message: 'id required' })
  }
  if (req.body.firstName?.length === 0 || req.body.firstName === undefined) {
    return res.status(400).json({ message: 'First name required' })
  }
  if (req.body.lastName?.length === 0 || req.body.lastName === undefined) {
    return res.status(400).json({ message: 'Last name required' })
  }
  if (req.body.email?.length === 0 || req.body.email === undefined) {
    return res.status(400).json({ message: 'Email required' })
  }
  if (
    req.body.phoneNumber?.length === 0 ||
    req.body.phoneNumber === undefined
  ) {
    return res.status(400).json({
      message: 'Phone number required',
    })
  }
  if (req.body.roleId === undefined) {
    return res.status(400).json({ message: 'Role required' })
  }
  next()
}

exports.checkLoginBody = (req, res, next) => {
  if (req.body.username?.length == 0 || req.body.username === undefined) {
    return res.status(400).json({ message: 'Username required' })
  }
  if (req.body.password?.length == 0 || req.body.password === undefined) {
    return res.status(400).json({ message: 'Password required' })
  }
  next()
}

exports.checkRoomBody = (req, res, next) => {
  if (
    (req.body.id?.length === 0 || req.body.id === undefined) &&
    req.method !== 'POST'
  ) {
    return res.status(400).json({ message: 'ID required' })
  }
  if (req.body.name?.length === 0 || req.body.name === undefined) {
    return res.status(400).json({ message: 'Name required' })
  }
  if (req.body.hourlyRate === undefined) {
    return res.status(400).json({ message: 'Hourly rate required' })
  }
  if (req.body.hourlyRate < 1000) {
    return res.status(400).json({
      message: 'Hourly rate should be at least 1000 Kip',
    })
  }
  if (req.body.shiftRate === undefined) {
    return res.status(400).json({ message: 'Shift rate required' })
  }
  if (req.body.shiftRate < 1000) {
    return res.status(400).json({
      message: 'Shift rate should be at least 1000 Kip',
    })
  }
  if (req.body.capacity === undefined) {
    return res.status(400).json({ message: 'Capacity required' })
  }
  if (req.body.capacity < 1) {
    return res.status(400).json({
      message: 'Minimum capacity is one (1)',
    })
  }
  next()
}

exports.checkEquipmentBody = (req, res, next) => {
  if (
    (req.body.id?.length === 0 || req.body.id === undefined) &&
    req.method !== 'POST'
  ) {
    return res.status(400).json({ message: 'ID required' })
  }
  if (req.body.name?.length === 0 || req.body.name === undefined) {
    return res.status(400).json({ message: 'name required' })
  }
  next()
}

exports.checkDrinkBody = (req, res, next) => {
  if (
    (req.body.id?.length === 0 || req.body.id === undefined) &&
    req.method !== 'POST'
  ) {
    return res.status(400).json({ message: 'ID required' })
  }
  if (req.body.name.length === 0 || req.body.name === undefined) {
    return res.status(400).json({ message: 'name required' })
  }
  if (req.body.price === undefined) {
    return res.status(400).json({ message: 'price required' })
  }
  if (req.body.price < 1000) {
    return res.status(400).json({
      message: 'Minimum price is 1000 Kip',
    })
  }
  next()
}

exports.checkBookingBody = (req, res, next) => {
  if (req.body.eventTitle?.length === 0 || req.body.eventTitle === undefined) {
    return res.status(400).json({ message: 'Event title required' })
  }
  if (req.body.eventType === undefined) {
    return res.status(400).json({ message: 'Event type required' })
  }
  if (req.body.eventStatus === undefined) {
    return res.status(400).json({ message: 'Event status required' })
  }
  if (req.body.eventDate === undefined) {
    return res.status(400).json({ message: 'Event date required' })
  }
  if (
    req.body.eventStartTime === undefined ||
    req.body.eventStartTime.length === 0
  ) {
    return res.status(400).json({ message: 'Event start time required' })
  }
  if (
    req.body.eventEndTime === undefined ||
    req.body.eventEndTime.length === 0
  ) {
    return res.status(400).json({ message: 'Event end time required' })
  }
  if (req.body.rooms === undefined || req.body.rooms.length === 0) {
    return res.status(400).json({ message: 'room required' })
  }
  if (
    req.body.drinks?.length > 0 &&
    req.body.drinks?.filter((item) => item.amount < 1).length > 0
  ) {
    return res.status(400).json({ message: 'Invalid drink amount' })
  }
  if (req.body.roomStyle === undefined) {
    return res.status(400).json({ message: 'Room style required' })
  }
  if (req.body.table === undefined) {
    return res.status(400).json({ message: 'Table required' })
  }
  if (req.body.table < 0) {
    return res.status(400).json({
      message: 'Invalid table amount',
    })
  }
  if (req.body.chair === undefined) {
    return res.status(400).json({ message: 'Chair required' })
  }
  if (req.body.chair < 0) {
    return res.status(400).json({
      message: 'Invalid chair amount',
    })
  }
  if (req.body.roomSubtotal === undefined) {
    return res.status(400).json({ message: 'Room subtotal required' })
  }
  if (req.body.drinkSubtotal === undefined) {
    return res.status(400).json({ message: 'Drink subtotal required' })
  }
  if (req.body.total === undefined) {
    return res.status(400).json({ message: 'Total required' })
  }
  if (req.body.deposit === undefined) {
    return res.status(400).json({ message: 'Deposit required' })
  }
  if (req.body.customer === undefined) {
    return res.status(400).json({ message: 'Customer required' })
  }
  next()
}

exports.checkBookingUpdateBody = (req, res, next) => {
  if (req.body.id?.length === 0 || req.body.id === undefined) {
    return res.status(400).json({ message: 'Event title required' })
  }
  if (req.body.eventTitle?.length === 0 || req.body.eventTitle === undefined) {
    return res.status(400).json({ message: 'Event title required' })
  }
  if (req.body.eventType === undefined) {
    return res.status(400).json({ message: 'Event type required' })
  }
  if (req.body.eventStatus === undefined) {
    return res.status(400).json({ message: 'Event status required' })
  }
  if (req.body.roomStyle === undefined) {
    return res.status(400).json({ message: 'Room style required' })
  }
  next()
}

exports.checkDepositBody = (req, res, next) => {
  if (req.body.bookingId === undefined) {
    return res.status(400).json({ message: 'Booking id required' })
  }
  if (req.body.depositStatement === undefined) {
    return res.status(400).json({ message: 'Deposit statement required' })
  }
  next()
}

exports.checkConfirmBookingBody = (req, res, next) => {
  if (req.body.booking === undefined) {
    return res.status(400).json({ message: 'Booking data required' })
  }
  next()
}

exports.checkRentBody = (req, res, next) => {
  if (req.body.bookingId === undefined) {
    return res.status(400).json({ message: 'Booking id required' })
  }
  next()
}
