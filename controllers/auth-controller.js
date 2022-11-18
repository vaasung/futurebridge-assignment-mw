const { hashSync, compareSync } = require('bcryptjs')

const { pool } = require('../DB/db')

const register = async (req, res) => {
  const {first_name, last_name, email, password, contact} = req.body
  
  try {
    const values = [
      first_name,
      last_name,
      email,
      hashSync(password, 8),
      contact
    ]
    const q = `INSERT INTO users(first_name, last_name, email, password, contact) VALUES($1,$2,$3,$4,$5) RETURNING *`
    const user = await pool.query(q, values)
    return res.status(201).send({
      status: 201,
      message: 'User registered'
    })
    
  } catch (error) {
    return res.send({message:error})
    
  }
}

const login = async(req, res) => {
  const {email, password} = req.body

  try {
    const findUserQ = `SELECT * FROM users WHERE email='${email}'`
    const {rows, rowCount } = await pool.query(findUserQ)
    if(rowCount === 0 || !rowCount){
      return res.status(404).send({
        status: 404,
        message: 'User/password not matching'
      })
    }
    const comparePwd = compareSync(password, rows[0].password)
    
    if(!comparePwd){
        return res.status(404).send({
          status: 404,  
          message: 'User/password not matching'
        })
    }

    delete rows[0].password
    res.status(200).send({
      status: 200,
      message: 'User Logged',
      data: rows[0]
    })
  } catch (error) {
    res.send({message: error})
    
  }
}
const viewUser = async(req, res) => {
  const {id} = req.query ?? {}
  try {
    console.log(id)
    
    let findUserQ
    if(id !== undefined){
          findUserQ = `SELECT * FROM users WHERE id=${id}`
    } else {
        findUserQ = `SELECT * FROM users`
    }
    
    const {rows, rowCount } = await pool.query(findUserQ)

    if(!rows.length){
        return res.status(200).send({
          status: 200,
          message: 'no user'
        })
    }

    const users = rows.filter(user => delete user.password)
    return res.status(200).send({
      status: 200,
      message: 'list of users',
      users
    })

    
  } catch (error) {
    
  }
}

const deleteUser = async(req, res) => {
  const {id} =req.query
  try {
    const findUserQ = `SELECT * FROM users WHERE id=${id}`
    const deleteUserQ = `DELETE FROM users WHERE id=${id}`
    const {rowCount} = await pool.query(findUserQ)
    if(rowCount === 0 || !rowCount){
      return res.status(404).send({
        status: 404,
        message: 'User not matching'
      })
    }
    await pool.query(deleteUserQ)
    res.status(202).send({
      status: 202,
      message: 'User deleted...'
    })
  } catch (error) {
    res.send({
      message: `Error delete while, ${error}`
    })
  }
}
const updateUser = async(req, res) => {
  const {id} = req.query

  try {
    const keys = Object.keys(req.body)//.map(key => key)
    const values = Object.values(req.body).map(value => value)

    if(keys.includes('id') || keys.includes('password') || keys.includes('email')){
      return res.send({
        message: 'Sorry, id and password, not changable'
      })
    }
    const updateUserQ = `UPDATE users SET ${keys.map((key, indx) => `${key} = '${values[indx]}'`)} WHERE id=${parseInt(id)}`
    console.log(updateUserQ)
    const user = await pool.query(updateUserQ)
    res.status(202).send({
      status: 202,
      message: 'User updated'
    })
  } catch (error) {
    res.send(error)
    
  }
}

module.exports = { login, register, deleteUser, updateUser, viewUser }