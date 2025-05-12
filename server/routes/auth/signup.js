const  { prisma } = require("../../utils/prisma");
const bcrypt=require("bcrypt");

async function signup(req,res){
  try
  {
    const {name,email,password}=req.body;

    //check if user exists
    const existingUser=await prisma.user.findUnique({
        where:{
            email:email,
        },
    });

    if(existingUser){
      return res.status(400).json({error: "user already exists"});
    }

//hash password
    //bcrypt is a hashing algorithm
    //the second parameter is the number of rounds to hash the password
    //the higher the number, the more secure but also slower it is
    //10 is a good default
const hashedPassword=await bcrypt.hash(password,10)

//create user
const user=await prisma.user.create({
  data:{
    name:name,
    email:email,
    password:hashedPassword
  }
})

return res.status(201).json({
  message: "user created successfully",
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString()
  }
});
}
catch(err)
{
  return res.status(500).json({error:"user coould not be created"});
}

}


module.exports=signup;