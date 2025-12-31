function validateRegister(req, res, next) {
  let { login, password } = req.body;

  if(!login || !password){
    return res.status(400).json({
      error: 'INVALID_INPUT',
      message: 'Login and password are required'
    })
  }

  if(typeof login !== 'string' || typeof password !== 'string'){
    return res.status(400).json({
      error: 'INVALID_TYPE',
      message: 'Invalid input format'
    })
  }

  login = login.trim();
  password = password.trim();

  if (login.length < 3 ||  login.length > 50) {
    return res.status(400).json({
      error: 'INVALID_LOGIN',
      message: 'Login must be between 3 and 50 characters'
    });
  }

  if (!/^(?!-)(?!.*--)(?!.*__)[a-zA-Z0-9_-]+(?<!-)$/.test(login)) {
    return res.status(400).json({
      error: 'INVALID_LOGIN',
      message: 'Login contains invalid characters'
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      error: 'INVALID_PASSWORD',
      message: 'Password must be at least 8 characters'
    });
  }

   if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/.test(password)) {
    return res.status(400).json({
      error: 'INVALID_PASSWORD',
      message: 'Password must contain uppercase letters, lowercase letters and a special character'
    });
  }

  next();
}

export { validateRegister };