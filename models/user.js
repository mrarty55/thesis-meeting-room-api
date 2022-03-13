const database = require('../config/database')
const dateFormatter = require('date-fns')

exports.getUsers = async () => {
  return await database('tbl_customers').select({
    id: 'customer_id',
    firstName: 'customer_first_name',
    lastName: 'customer_last_name',
    email: 'customer_email',
    phoneNumber: 'customer_phone_number',
    username: 'customer_username',
    workplace: 'customer_workplace',
    occupation: 'customer_occupation',
    address: 'customer_address',
    profilePicture: 'customer_profile_picture',
  })
}

exports.getUserById = async ({ id }) => {
  return await database('tbl_customers')
    .where('customer_id', id)
    .select({
      id: 'customer_id',
      firstName: 'customer_first_name',
      lastName: 'customer_last_name',
      email: 'customer_email',
      phoneNumber: 'customer_phone_number',
      username: 'customer_username',
      workplace: 'customer_workplace',
      occupation: 'customer_occupation',
      address: 'customer_address',
      profilePicture: 'customer_profile_picture',
    })
    .first()
}

exports.createUser = async ({
  firstName,
  lastName,
  email,
  phoneNumber,
  username,
  hashPassword,
}) => {
  return await database('tbl_customers').returning('customer_id').insert({
    customer_first_name: firstName,
    customer_last_name: lastName,
    customer_email: email,
    customer_phone_number: phoneNumber,
    customer_username: username,
    customer_password: hashPassword,
    customer_workplace: '',
    customer_occupation: '',
    customer_address: '',
    customer_profile_picture: '',
  })
}

exports.updateUser = async ({
  id,
  firstName,
  lastName,
  email,
  phoneNumber,
  workplace,
  occupation,
  address,
  profilePicture,
}) => {
  await database('tbl_customers').where('customer_id', id).update({
    customer_first_name: firstName,
    customer_last_name: lastName,
    customer_email: email,
    customer_phone_number: phoneNumber,
    customer_workplace: workplace,
    customer_occupation: occupation,
    customer_address: address,
    customer_profile_picture: profilePicture,
  })
}

exports.updateUserPassword = async ({ id, password }) => {
  await database('tbl_customers')
    .where('customer_id', id)
    .update('customer_password', password)
}

exports.deleteUser = async ({ id }) => {
  await database('tbl_customers').where('customer_id', id).del()
}

exports.checkUser = async ({ username }) => {
  return await database('tbl_customers')
    .where('customer_username', username)
    .orWhere('customer_email', username)
    .select({
      id: 'customer_id',
      username: 'customer_username',
      hashPassword: 'customer_password',
      image: 'customer_profile_picture',
    })
}

exports.checkUserEmail = async ({ email }) => {
  return await database('tbl_customers')
    .where('customer_email', email)
    .select({
      id: 'customer_id',
      fullName: database.raw(
        "CONCAT(customer_first_name, ' ', customer_last_name)"
      ),
      email: 'customer_email',
    })
}

exports.getUserPassword = async ({ id }) => {
  return await database('tbl_customers')
    .where('customer_id', id)
    .select({ password: 'customer_password' })
    .first()
}

exports.checkToken = async ({ id, token }) => {
  return await database('tbl_customer_password_reset')
    .where('token', token)
    .andWhere('customer_id', id)
    .select({ token: 'token' })
}

exports.updateLastLogin = async ({ username }) => {
  await database('tbl_customers')
    .where('customer_username', username)
    .update(
      'last_login',
      dateFormatter.format(Date.now(), 'yyyy-MM-dd HH:mm:ss')
    )
}

exports.createPasswordReset = async ({ id, token }) => {
  await database('tbl_customer_password_reset').insert({
    customer_id: id,
    token,
  })
}
