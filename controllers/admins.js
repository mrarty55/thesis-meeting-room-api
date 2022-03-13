const adminModel = require('../models/admin')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const mailTransport = require('../config/mail')

exports.getAdmins = async (req, res) => {
  try {
    const staffs = await adminModel.getAdmins()
    return res.status(200).json({ message: 'Admins retrieved', staffs })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error retrieve admins' })
  }
}

exports.getAdminById = async (req, res) => {
  try {
    const staff = await adminModel.getAdminById({ id: req.credentials.id })
    return res.status(200).json({ message: 'Admin retrieved', staff })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error retrieve admins' })
  }
}

exports.getAdminRoles = async (req, res) => {
  try {
    const roles = await adminModel.getAdminRoles()
    return res.status(200).json({ message: 'Staff retrieved', roles })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error retrieve admins' })
  }
}

exports.createAdmin = async (req, res) => {
  try {
    const staffId = await adminModel.createAdmin({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password: req.body.hashPassword,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      roleId: req.body.roleId,
      profilePicture: req.body.profilePicture || '',
    })

    await mailTransport.sendMail({
      to: req.body.email,
      from: {
        name: process.env.MAIL_NAME,
        address: process.env.MAIL_ADDRESS,
      },
      subject: 'ບັນຊີຜູ້ຮັບຜິດຊອບວຽກງານລະບົບບໍລິການຫ້ອງປະຊຸມກາເຟວະລີ',
      html: `
        <p>ເຖິງທ່ານ ${req.body.firstName + ' ' + req.body.lastName},</p>
        <p>ນີ້ແມ່ນຂໍ້ມູນການເຂົ້າສູ່ລະບົບບໍລິການຫ້ອງປະຊຸມຂອງທ່ານ.</p>
        <p>ຊື່ຜູ້ໃຊ້ລະບົບ: ${req.body.username}</p>
        <p>ລະຫັດຜ່ານ: ${req.body.password}</p>
        `,
    })

    return res
      .status(201)
      .json({ message: 'Admin created', staffId: staffId[0] })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error creating admin' })
  }
}

exports.updateAdmin = async (req, res) => {
  try {
    await adminModel.updateAdmin({
      id: req.body.id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      roleId: req.body.roleId,
      profilePicture: req.body.profilePicture,
    })

    return res.status(200).json({ message: 'Updated admin' })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error updating admin' })
  }
}

exports.updateAdminPassword = async (req, res) => {
  try {
    const oldHashPassword = await adminModel.checkAdminPassword({
      id: req.credentials.id,
    })
    if (await !bcrypt.compare(req.body.oldPassword, oldHashPassword.password)) {
      return res.status(403).json({ message: 'Invalid password' })
    }
    const newHashPass = await bcrypt.hash(req.body.newPassword, 10)
    await adminModel.updateAdminPassword({
      id: req.credentials.id,
      password: newHashPass,
    })

    return res.status(200).json({ message: 'Admin password updated' })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error updating admin password' })
  }
}

exports.resetAdminPassword = async (req, res) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10)
    await adminModel.updateAdminPassword({
      id: req.credentials.id,
      password: hashPassword,
    })

    return res.status(200).json({ message: 'Admin password updated' })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error updating admin password' })
  }
}

exports.deleteAdmin = async (req, res) => {
  try {
    await adminModel.deleteAdmin({
      id: req.body.id,
    })

    return res.status(200).json({ message: 'Deleted admin' })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error deleting admin' })
  }
}

exports.uploadAdminPicture = (req, res) => {
  try {
    const image = `${req.secure ? 'https' : 'http'}://${req.get(
      'host'
    )}/images/${req.file.filename}`
    return res.status(200).json({ message: 'Image uploaded', image })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error uploading image' })
  }
}

exports.login = async (req, res) => {
  try {
    const admin = await adminModel.checkAdmin({ username: req.body.username })
    if (!admin) {
      return res.status(401).json({ message: 'Authorise failed' })
    }
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      admin.hashPassword
    )
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Authorise failed' })
    }
    await adminModel.login({ username: admin.username })
    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )
    return res.status(200).json({
      message: 'Authenticated',
      id: admin.id,
      username: admin.username,
      role: admin.role,
      image: admin.image,
      token: token,
    })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Authorise error' })
  }
}

exports.checkAdminAuth = (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET, {})
    res
      .status(200)
      .json({ message: 'Admin authenticated', credentials: decodedToken })
  } catch (error) {
    console.error(error.toString())
    return res.status(401).json({ message: 'Failed to authenticate' })
  }
}

exports.requestPasswordReset = async (req, res) => {
  try {
    const result = await adminModel.checkAdminEmail({ email: req.body.email })

    if (!result) {
      return res.status(404).json({ message: 'Not found' })
    }
    if (result.email !== req.body.email) {
      return res.status(404).json({ message: 'Not found' })
    }

    const token = jwt.sign(
      { id: result.id, email: result.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )
    await adminModel.createPasswordReset({ id: result.id, token })

    mailTransport.sendMail({
      to: req.body.email,
      from: {
        name: process.env.MAIL_NAME,
        address: process.env.MAIL_ADDRESS,
      },
      subject: 'ຣີເຊັດລະຫັດຜ່ານ',
      html: `
        <p>ເຖິງທ່ານ ${result.fullName},</p>
        <p>ທ່ານໄດ້ສົ່ງຄຳຮ້ອງຂໍປ່ຽນລະຫັດຜ່ານສຳລັບເຂົ້າສູ່ລະບົບບໍລິການຫ້ອງປະຊຸມກາເຟວະລີເປັນທີ່ສໍາເລັດແລ້ວ.</p>
        <p>ກະລຸນາຄຼິກລິງດ້ານລຸ່ມນີ້ເພື່ອປ່ຽນລະຫັດຜ່ານ:</p>
        <p><a href="${process.env.APP_URL}/admin/reset-password?token=${token}">ຣີເຊັດລະຫັດຜ່ານ</a></p>
        <p>ຖ້າວ່າທ່ານບໍ່ໄດ້ສົ່ງຄຳຮ້ອງນີ້, ກະລຸນາປ່ຽນລະຫັດຜ່ານໂດຍດ່ວນ.</p>
        `,
    })

    return res.status(200).json({ message: 'Request sent' })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error requesting' })
  }
}

exports.verifyResetToken = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET)
    const result = await adminModel.checkToken({ id: decodedToken.id, token })
    if (result.length === 0 || result.token !== token) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    return res.status(200).json({ message: 'Verified' })
  } catch (error) {
    console.error(error.toString())
    return res.status(401).json({ message: 'Not authorized' })
  }
}
