const database = require('../config/database')
const dateFormatter = require('date-fns')

exports.getAdmins = async () => {
  return await database('tbl_staffs').select({
    id: 'staff_id',
    firstName: 'staff_first_name',
    lastName: 'staff_last_name',
    username: 'staff_username',
    email: 'staff_email',
    phoneNumber: 'staff_phone_number',
    role: 'staff_role',
    profilePicture: 'staff_profile_picture',
  })
}

exports.getAdminById = async ({ id }) => {
  return await database('tbl_staffs')
    .where('staff_id', id)
    .select({
      id: 'staff_id',
      firstName: 'staff_first_name',
      lastName: 'staff_last_name',
      username: 'staff_username',
      email: 'staff_email',
      phoneNumber: 'staff_phone_number',
      role: 'staff_role',
      profilePicture: 'staff_profile_picture',
    })
    .first()
}

exports.getAdminRoles = async () => {
  return await database('tbl_staff_roles').select({
    id: 'staff_role_id',
    name: 'staff_role_name',
    description: 'staff_role_description',
  })
}

exports.getOperator = async ({ staffId }) => {
  return await database('tbl_staffs').where('staff_id', staffId).select({
    id: 'staff_id',
    firstName: 'staff_first_name',
    lastName: 'staff_last_name',
  })
}

exports.createAdmin = async ({
  firstName,
  lastName,
  username,
  password,
  email,
  phoneNumber,
  roleId,
  profilePicture,
}) => {
  return await database('tbl_staffs').returning('staff_id').insert({
    staff_first_name: firstName,
    staff_last_name: lastName,
    staff_username: username,
    staff_password: password,
    staff_email: email,
    staff_phone_number: phoneNumber,
    staff_role: roleId,
    staff_profile_picture: profilePicture,
  })
}

exports.updateAdmin = async ({
  id,
  firstName,
  lastName,
  email,
  phoneNumber,
  roleId,
  profilePicture,
}) => {
  await database('tbl_staffs').where('staff_id', id).update({
    staff_first_name: firstName,
    staff_last_name: lastName,
    staff_email: email,
    staff_phone_number: phoneNumber,
    staff_role: roleId,
    staff_profile_picture: profilePicture,
  })
}

exports.updateAdminPassword = async ({ id, password }) => {
  await database('tbl_staffs')
    .where('staff_id', id)
    .update('staff_password', password)
}

exports.deleteAdmin = async ({ id }) => {
  await database('tbl_staffs').where('staff_id', id).del()
}

exports.checkAdmin = async ({ username }) => {
  return await database('tbl_staffs')
    .where('staff_username', username)
    .orWhere('staff_email', username)
    .select({
      id: 'staff_id',
      username: 'staff_username',
      role: 'staff_role',
      hashPassword: 'staff_password',
      image: 'staff_profile_picture',
    })
    .first()
}

exports.checkAdminEmail = async ({ email }) => {
  return await database('tbl_staffs')
    .where('staff_email', email)
    .select({
      id: 'staff_id',
      fullName: database.raw("CONCAT(staff_first_name, ' ', staff_last_name)"),
      email: 'staff_email',
    })
    .first()
}

exports.checkAdminPassword = async ({ id }) => {
  return await database('tbl_staffs')
    .where('staff_id', id)
    .select({ password: 'staff_password' })
    .first()
}

exports.checkToken = async ({ id, token }) => {
  return await database('tbl_staff_password_reset')
    .where('token', token)
    .andWhere('staff_id', id)
    .select({ token: 'token' })
}

exports.login = async ({ username }) => {
  await database('tbl_staffs')
    .where('staff_username', username)
    .update(
      'last_login',
      dateFormatter.format(Date.now(), 'yyyy-MM-dd HH:mm:ss')
    )
}

exports.createPasswordReset = async ({ id, token }) => {
  await database('tbl_staff_password_reset').insert({
    staff_id: id,
    token,
  })
}
