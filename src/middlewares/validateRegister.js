function validateRegister(req, res, next) {
  const { login, password } = req.body;

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