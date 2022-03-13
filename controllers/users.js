const userModel = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mailTransport = require('../config/mail')

exports.getUsers = async (req, res) => {
  try {
    const customers = await userModel.getUsers()
    return res.status(200).json({ message: 'Users retrieved', customers })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error retrieving users' })
  }
}

exports.getUserById = async (req, res) => {
  try {
    const customer = await userModel.getUserById({ id: req.credentials.id })
    return res.status(200).json({ message: 'User retrieved', customer })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error retrieving user' })
  }
}

exports.createUser = async (req, res) => {
  try {
    const customerId = await userModel.createUser({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      username: req.body.username,
      hashPassword: req.body.hashPassword,
    })

    await mailTransport.sendMail({
      to: req.body.email,
      from: {
        name: process.env.MAIL_NAME,
        address: process.env.MAIL_ADDRESS,
      },
      subject: 'ລົງທະບຽນນໍາໃຊ້ລະບົບບໍລິການຫ້ອງປະຊຸມກາເຟວະລີ',
      html: `
        <p>ເຖິງທ່ານ ${req.body.firstName + ' ' + req.body.lastName},</p>
        <p>ທ່ານໄດ້ລົງທະບຽນນໍາໃຊ້ລະບົບບໍລິການຫ້ອງປະຊຸມກາເຟວະລີເປັນທີ່ສໍາເລັດແລ້ວ.</p>
        <p>ຂອບໃຈທີ່ໃຊ້ບໍລິການຂອງພວກເຮົາ</p>
        `,
    })

    return res
      .status(201)
      .json({ message: 'Created user successful', customerId: customerId[0] })
  } catch (err) {
    console.error(err.toString())
    return res.status(500).json({
      message: 'Error register user',
    })
  }
}

exports.uploadUserPicture = (req, res) => {
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

exports.updateUser = async (req, res) => {
  try {
    await userModel.updateUser({
      id: req.body.id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      workplace: req.body.workplace,
      occupation: req.body.occupation,
      address: req.body.address,
      profilePicture: req.body.profilePicture,
    })

    return res.status(200).json({ message: 'User updated' })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error updating user' })
  }
}

exports.updatePassword = async (req, res) => {
  try {
    const oldHashPass = await userModel.getUserPassword({
      id: req.credentials.id,
    })
    if (await !bcrypt.compare(req.body.oldPassword, oldHashPass.password)) {
      return res.status(403).json({ message: 'Invalid password' })
    }
    const newHashPass = await bcrypt.hash(req.body.newPassword, 10)
    await userModel.updateUserPassword({
      id: req.credentials.id,
      password: newHashPass,
    })

    return res.status(200).json({ message: 'User password updated' })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error updating user password' })
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10)
    await userModel.updateUserPassword({
      id: req.credentials.id,
      password: hashPassword,
    })

    return res.status(200).json({ message: 'User password reset' })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error resetting user password' })
  }
}

exports.deleteUser = async (req, res) => {
  try {
    await userModel.deleteUser({ id: req.body.id })

    await mailTransport.sendMail({
      to: req.body.email,
      from: {
        name: process.env.MAIL_NAME,
        address: process.env.MAIL_ADDRESS,
      },
      subject: 'ຍົກເລີກນໍາໃຊ້ລະບົບບໍລິການຫ້ອງປະຊຸມກາເຟວະລີ',
      html: `
        <p>ເຖິງທ່ານ ${req.body.firstName + ' ' + req.body.lastName},</p>
        <p>ທ່ານໄດ້ຍົກເລີກການນໍາໃຊ້ລະບົບບໍລິການຫ້ອງປະຊຸມກາເຟວະລີເປັນທີ່ສໍາເລັດແລ້ວ.</p>
        <p>ຂອບໃຈທີ່ໃຊ້ບໍລິການຂອງພວກເຮົາ</p>
        `,
    })

    return res.status(200).json({ message: 'User deleted' })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error updating user' })
  }
}

exports.login = async (req, res) => {
  try {
    const result = await userModel.checkUser({ username: req.body.username })
    if (result.length == 0 || result == undefined) {
      return res.status(401).json({ message: 'User unauthenticated' })
    }
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      result[0].hashPassword
    )
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'User unauthenticated' })
    }
    await userModel.updateLastLogin({ username: req.body.username })
    const token = jwt.sign(
      { id: result[0].id, username: result[0].username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )
    return res.status(200).json({
      message: 'User authenticated',
      id: result[0].id,
      username: result[0].username,
      image: result[0].image,
      token: token,
    })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error user login' })
  }
}

exports.checkUserAuth = (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET, {})
    res
      .status(200)
      .json({ message: 'User authenticated', credentials: decodedToken })
  } catch (error) {
    console.error(error.toString())
    return res.status(401).json({ message: 'Failed to authenticate' })
  }
}

exports.requestPasswordReset = async (req, res) => {
  try {
    const result = await userModel.checkUserEmail({ email: req.body.email })

    if (result.length === 0) {
      return res.status(404).json({ message: 'Not found' })
    }
    if (result[0].email !== req.body.email) {
      return res.status(404).json({ message: 'Not found' })
    }

    const token = jwt.sign(
      { id: result[0].id, email: result[0].email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )
    await userModel.createPasswordReset({ id: result[0].id, token })

    mailTransport.sendMail({
      to: req.body.email,
      from: {
        name: process.env.MAIL_NAME,
        address: process.env.MAIL_ADDRESS,
      },
      subject: 'ຣີເຊັດລະຫັດຜ່ານ',
      html: `
        <p>ເຖິງທ່ານ ${result[0].fullName},</p>
        <p>ທ່ານໄດ້ສົ່ງຄຳຮ້ອງຂໍປ່ຽນລະຫັດຜ່ານສຳລັບເຂົ້າສູ່ລະບົບບໍລິການຫ້ອງປະຊຸມກາເຟວະລີເປັນທີ່ສໍາເລັດແລ້ວ.</p>
        <p>ກະລຸນາຄຼິກລິງດ້ານລຸ່ມນີ້ເພື່ອປ່ຽນລະຫັດຜ່ານ:</p>
        <p><a href="${process.env.APP_URL}/reset-password?token=${token}">ຣີເຊັດລະຫັດຜ່ານ</a></p>
        <p>ຖ້າວ່າທ່ານບໍ່ໄດ້ສົ່ງຄຳຮ້ອງນີ້, ກະລຸນາປ່ຽນລະຫັດຜ່ານໂດຍດ່ວນ.</p>
        <p>ຂອບໃຈທີ່ໃຊ້ບໍລິການຂອງພວກເຮົາ</p>
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
    const result = await userModel.checkToken({ id: decodedToken.id, token })
    if (result.length === 0 || result[0].token !== token) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    return res.status(200).json({ message: 'Verified' })
  } catch (error) {
    console.error(error.toString())
    return res.status(401).json({ message: 'Not authorized' })
  }
}
