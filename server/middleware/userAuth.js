import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not Authorized. Login Again" });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode.id) {
      //req.userId = tokenDecode.id; // ✅ better than putting it in req.body
      req.body.userId = tokenDecode.id;
    } else {
      return res
        .status(403)
        .json({ success: false, message: "Not Authorized. Login Again" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default userAuth;
