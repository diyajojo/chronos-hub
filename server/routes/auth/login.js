const prisma = require("../../utils/prisma");
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');
const {JWT_SECRET}=process.env;

async function login(req, res) {
  try {
    const { email, password } = req.body;

    //check if user exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email
      }
    });

    if (!existingUser) {
      console.timeLog("user doesnt exist , go signup");
      return res.status(401).json({ "error": "invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) 
      {
      console.log("invalid password");
      return res.status(401).json({ "error": "invalid credentials" });
    }

    const payLoad={
      id:existingUser.id,
      name:existingUser.name,
      email:existingUser.email
    }

    const token=jwt.sign(payLoad,JWT_SECRET,{expiresIn:'1h'})
    return res.status(200).json({ "token": token});
  }
  catch (err) 
  {
    console.log(err);
    return res.status(500).json({ "message": "internal server error" });
  }
}

module.exports = login;