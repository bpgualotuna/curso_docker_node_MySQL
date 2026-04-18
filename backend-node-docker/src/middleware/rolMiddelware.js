function autorizarRoles(...rolesPermitidos){
    return (req, res, next) => {
        const usuario = req.user;
        if (!usuario) return res.status(401).json({ message: "Usuario no autenticado" });
        if (!rolesPermitidos.includes(usuario.rol)) return res.status(403).json({ message: "Rol no autorizado" });
        next();
    }
}

module.exports = { autorizarRoles };
