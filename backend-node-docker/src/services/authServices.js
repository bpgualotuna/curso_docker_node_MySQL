const bcrypt = require("bcrypt");
const userRepository = require("../repositories/userRepository");

const saltRounds = 10;

async function registrarUsuario(data) {
    const userExiste = await userRepository.obtenerPorEmail(data.email);
    if (userExiste) throw new Error("Usuario ya existe");
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    const user = await userRepository.crearUsuario({ ...data, password: hashedPassword, rol: data.rol });
    return user;
}



const jwt = require("jsonwebtoken");
const secret_key = process.env.JWT_SECRET;

async function loginUsuario({ email, password }) {
    const usuario = await userRepository.obtenerPorEmail(email);
    if (!usuario) throw new Error("Usuario no encontrado");
    const passwordCorrecto = await bcrypt.compare(password, usuario.password);
    if (!passwordCorrecto) throw new Error("Contraseña incorrecta");

    const payload = { id: usuario.id, email: usuario.email, rol: usuario.rol };
    //firmar el token
    const token = jwt.sign(payload, secret_key, { expiresIn: "1h" });
    return { usuario, token };
}





module.exports = { registrarUsuario, loginUsuario };