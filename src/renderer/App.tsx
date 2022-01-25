import { useState, useEffect } from "react";
import { Switch, Route, Link, useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AuthService from "./services/auth.service";
import IUser from './types/user.type';
import Login from "./components/login.component";
import Register from "./components/register.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";

const App = () => {

  const [currentUser, setCurrentUser] = useState<IUser>()
  const history = useHistory()
  const user = AuthService.getWithExpiry('user')

  const redirect = () => {
      history.push('/')
  }

  const toMain = () => {
      history.push('/user')
  }

  const logOut = () => {
    AuthService.logout();
    // history.push('/')
    setCurrentUser(undefined);
    // setCurrentUser({});
  }

  useEffect(() => {
    const user = AuthService.getWithExpiry('user')
    if (!user) {
      redirect();
    }
    if (user) {
      setCurrentUser(user)
      toMain();
    }
  }, [])

  useEffect(() => {
    if (!user) {
      redirect();
    }
  })

  console.log(currentUser)

    return (
      <div>
          <nav className="navbar navbar-expand navbar-dark bg-dark" style = {{position: "static"}}>
            <div className="navbar-nav mr-auto" style = {{width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between'}}>
              {currentUser && (
                <li className="nav-item">
                  <Link to={"/user"} className="nav-link">
                    Automatic Tool for essay submit system
                  </Link>
                </li>
              )}
            </div>
            {currentUser ? (
              <div className="navbar-nav ml-auto" 
              
              >
                <li className="nav-item">
                  <Link to={"/profile"} className="nav-link">
                    {currentUser.username}
                  </Link>
                </li>
                <li>
                  <a href="#" className="nav-link" onClick={logOut}>
                    LogOut
                  </a>
                </li>
              </div>
            ) : (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to={"/login"} className="nav-link">
                    Login
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to={"/register"} className="nav-link">
                    SignUp
                  </Link>
                </li>
              </div>
            )}
          </nav>
          <div className="container mt-10">
            <Switch>
              <Route exact path={["/","/home","/login"]}>
                <Login currentUser = {() => {setCurrentUser(AuthService.getWithExpiry('user'))}} />
              </Route>
              <Route exact path="/register">
                <Register  />
              </Route>
              <Route exact path="/profile" component={Profile} />
              <Route path="/user" component={BoardUser} />
            </Switch>
          </div>
      </div>
    );
}

export default App;