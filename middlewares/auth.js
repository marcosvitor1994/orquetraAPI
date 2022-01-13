const jwt = require("jsonwebtoken");
const { promisify } = require("util");

module.exports = function authorize(arrayOfAuthUsers) {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: true,
        code: 160,
        message: "Erro: Token não encontrado!",
      });
    }

    const [, token] = authHeader.split(" ");

    try {
      const decode = await promisify(jwt.verify)(token, process.env.SECRET);
      req.userID = decode.id;
      req.userRole = decode.role;
      // logica
      if (arrayOfAuthUsers.indexOf(decode.role) == -1) {
        return res.status(401).json({
          error: true,
          code: 161,
          message: "Erro: Usuário não autorizado!",
        });
      }
      return next();
    } catch (err) {
      return res.status(401).json({
        error: true,
        code: 161,
        message: "Erro: Token inválido!",
      });
    }
  };
}
