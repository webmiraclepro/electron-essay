import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import AuthService from "../services/auth.service";
import IUser from "../types/user.type";

export default function Profile () {
  const [userReady, setUserReady] = useState(false)
  const [currentUser, setCurrentUser] = useState<IUser & {accessToken:string}>({accessToken: ""})
  const history = useHistory()

  const redirect = () => {
     history.push('/')
  }

  useEffect(() => {
    const currentUser = AuthService.getWithExpiry("user");

    if (!currentUser) {
      redirect();
    }
    setCurrentUser(currentUser)
    setUserReady(true)
  }, [])

    return (
      <div className="container">
        {(userReady) ?
          <div>
            <header className="jumbotron">
              <h3>
                <strong>{currentUser.username}</strong> Profile
              </h3>
            </header>
            <p>
              <strong>Token:</strong>{" "}
              {currentUser.accessToken.substring(0, 20)} ...{" "}
              {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
            </p>
            <p>
              <strong>Id:</strong>{" "}
              {currentUser.id}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              {currentUser.email}
            </p>
            <strong>Authorities:</strong>
            <ul>
              {currentUser.roles &&
                currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
            </ul>
          </div> : null}
      </div>
    );
}
