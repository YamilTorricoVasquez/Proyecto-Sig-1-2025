import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { userModel } from "../models/user.model.js";


const register = async (req, res) => {
    try {
        //console.log(req.body)
        const {  email, password,role_id } = req.body
        
        
        if ( !email || !password ) {
            return res.status(400).json({ ok: false, msg: "Los datos se perdieron" })
        }
        
        
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)
        const newUser = await userModel.create({ email, password: hashedPassword,role_id})

        const token = jwt.sign({ email: newUser.email, role_id: newUser.role_id },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        )

        return res.json({
            ok: true, msg: {
                token, role_id: newUser.role_id
            }
        })
    
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error server'
        })
    }
}
const registrarClientes = async (req, res) => {
    try {
        //console.log(req.body)
        const {  nombre, telefono,direccion,user_id  } = req.body
        
        
        userModel.registrarClientes({nombre,telefono,direccion,user_id})

        return res.json({
            ok: true, msg: "Registro Exitoso"
        })
    
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error server'
        })
    }
}

// /api/v1/users/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ error: "Ya existe" });
        }
        const user = await userModel.FindOneByEmail(email)
        if (!user) {
            return res.status(400).json({ error: "Email no existe" });
        }
        const isMatch = await bcryptjs.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }
        const token = jwt.sign({ email: user.email, role_id: user.role_id },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        )
        return res.json({
            ok: true, msg: {
                token, role_id: user.role_id
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error server'
        })
    }
}



const actualizarUsuario = async (req, res) => {
    try {
        const { ci, ciN, email, password, nombre } = req.body;

        // Validar que los campos ci, ciN, email y nombre están presentes
        if (!ci  || !email || !nombre) {
            return res.status(400).json({ ok: false, msg: "Faltan datos para actualizar" });
        }

        // Buscar al usuario por su CI
        const user = await userModel.FindOneByCI1(ci);
        if (!user) {
            return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });
        }

        // Si se proporciona una nueva contraseña, hashearla, de lo contrario, mantener la contraseña anterior
        let hashedPassword = user.password;
        console.log(hashedPassword);
        // Validar si `password` está presente y no está vacío
        if (password && password.trim() !== "") {
            // Verificar si la nueva contraseña en texto plano coincide con el hash actual
            const isSamePassword = await bcryptjs.compare(password, user.password);

            if (!isSamePassword) {
                // Si no son iguales, hashear la nueva contraseña
                const salt = await bcryptjs.genSalt(10);
                hashedPassword = await bcryptjs.hash(password, salt);
            } else {
                // Si son iguales, volver a hashear la misma contraseña
                const salt = await bcryptjs.genSalt(10);
                hashedPassword = await bcryptjs.hash(password, salt);
            }
        }


        // Actualizar los datos del usuario
        const updatedUser = await userModel.actualizarDatos(ci, ciN, email, hashedPassword, nombre);

        // Devolver una respuesta con los datos actualizados
        return res.json({
            ok: true,
            msg: "Usuario actualizado correctamente",
            user: {
                ci: updatedUser.ci,
                ciN: updatedUser.ciN,
                email: updatedUser.email,
                nombre: updatedUser.nombre
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: "Error del servidor"
        });
    }
};








export const UserController = {
    register,
    login,
    registrarClientes,
}