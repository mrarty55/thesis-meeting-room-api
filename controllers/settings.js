const database = require('../config/database')

exports.getSettings = async (req, res) => {
  try {
    const settings = await database('tbl_settings').select({
      id: 'setting_id',
      name: 'setting_name',
      description: 'setting_description',
      value: 'setting_value',
    })

    return res.status(200).json({ message: 'Settings retrieved', settings })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error retrieving settings' })
  }
}

exports.updateSettings = async (req, res) => {
  try {
    await database.transaction(async (trx) => {
      for (setting of req.body.settings) {
        await trx('tbl_settings').where('setting_id', setting.id).update({
          setting_value: setting.value,
        })
      }
    })

    return res.status(200).json({ message: 'Settings updated' })
  } catch (error) {
    console.error(error.toString())
    return res.status(500).json({ message: 'Error updating settings' })
  }
}
