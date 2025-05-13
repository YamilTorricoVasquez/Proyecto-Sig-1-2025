
import { text } from 'express'
import { db } from '../database/connection.database.js'

const create = async ({ email, password,role_id }) => {
    const query = {
        text: 'insert into users(email,password,role_id) values($1,$2,$3) returning *',
        values: [ email, password,role_id]
    }

    const { rows } = await db.query(query)
    return rows[0]
}
const registrarClientes = async ({ nombre, telefono,direccion,user_id }) => {
    const query = {
        text: 'insert into clientes(nombre, telefono,direccion,user_id) values($1,$2,$3,$4) returning *',
        values: [ nombre, telefono,direccion,user_id ]
    }

    const { rows } = await db.query(query)
    return rows[0]
}

export const userModel = {
    create,
    registrarClientes,
}