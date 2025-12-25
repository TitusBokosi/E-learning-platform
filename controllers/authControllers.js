const {createUser, getUserById, getUserByEmail, updateUser} = require('../queries/users');
const AppError = require('../utils/appError');
const { hashPassword, comparePassword } = require('../utils/password');
const authService = require("../services/auth-service"); 

exports.registerUser = async (req, res, next) => {
  try{
    const {name, email , password} = req.body;

    const existingUser = await getUserByEmail(email);

    if(existingUser){
      return res.status(400).json({
        status: "fail",
        message: "User already exists"
      })
    }
    const hashedPassword = await hashPassword(password)
    const newUser = await createUser({name, email, hashedPassword});

    if(!newUser)
      return next (new AppError("failed to create user", 500))
    
    return res.status(201).json({
      status: "success",
      data: newUser,
    })
  }
  catch(err){
    return next (err);
  }
};

exports.loginUser = async (req, res, next) => {
  try{
    const {accessToken, refreshToken, user} = authService.login(req.user); 

    res.cookie("refreshToken", refreshToken,{
      httpOnly:true,
      sameSite: "Strict",
    })

    return res.status(200).json({
      status: "success",
      data:{
        accessToken,
        user
      }
    })
  }
  catch(err){
    return next (err);
  }
};
exports.updatePasswordController = async (req, res, next) => {
  try{
    const {oldPassword, verifiedPassword, newPassword} = req.body || null;

    if(oldPassword){
      const user = await getUserById(req.user.id);
      const isMatch = await comparePassword(oldPassword, user.password);

      if(!isMatch){
        return next (new AppError("Incorrect password", 400));
      }

      return res.status(200).json({
        status: "Success",
        message: "Password is correct",
      })
    }

    if(verifiedPassword &&  newPassword){
      const user = await getUserById(req.user.id);
      
      if(!user)
        return next (new AppError("User not found", 404));

      const isMatch = await comparePassword(verifiedPassword, user.password);

      if(!isMatch){
        return next (new AppError("Incorrect verified password", 400));
      }

      const hashedPassword = await hashPassword(newPassword);

      const updatedUser = await updateUser (req.user.id, {password: hashedPassword});

      return res.status(200).json({
        status:"Success",
        message: "Password updated successfully",
      })
    }
  }
  catch(err){
    return next (err);
  }
};

exports.refreshTokenController = async (req, res, next) => {
  try{
    const {accessToken, refreshToken} = authService.login(req.user);

  res.cookie("refreshToken", refreshToken, {
    httpOnly:true,
    sameSite:"Strict",
  })

  return res.status(200).json({
    status: "Success",
    data:{
      accessToken
    }
  })
  }
  catch(err)
  {
    return next(err);
  }

};
exports.logOutUserController = async(req,res,next)=>{
  try{
    res.clearCookie("refreshToken", {
      httpOnly:true,
      sameSite: "Strict"
    })

    return res.status(200).json({
      status: "Success",
      message: "Logout successful"
    })
  }
  catch(err){
    return next (err);
  }
}

