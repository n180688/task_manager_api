function validateLogin(req, res, next){
  let { login, password } = req.body;

  if (typeof login !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Login and password are required' });
  }

  login = login.trim();
  password = password.trim();

  if (!login || !password) {
    return res.status(400).json({ message: 'Login and password cannot be empty' });
  }

  req.body.login = login;
  req.body.password = password;

  next();
};

export { validateLogin };