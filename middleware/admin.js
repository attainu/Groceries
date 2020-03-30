const admin = (req, res, next) => {
    try {
      const storesStaff = req.storeStaff
      if (storesStaff.admin) next()
      else throw new Error()
    } catch (err) {
      res.status(403).send({ statusCode: 403, message: 'You are not an admin' })
    }
  }
  
  module.exports = admin