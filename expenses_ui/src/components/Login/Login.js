import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookie from "js-cookie";

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = Cookie.get("token") ? Cookie.get("token") : null;
    if (token != null) {
      props.history.push("/sheets");
    }
  }, []);

  const goToRegister = () => {
    props.history.push("/register");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    let res = await axios.get(
      "https://users-l3dp2wfioq-uk.a.run.app/user?email=" +
        email +
        "&password=" +
        password
    );

    console.log(res);
    if (res.status === 200) {
      Cookie.set("token", res.data.token);
      console.log(res.data.token);
      props.history.push("/sheets");
    }
  };

  return (
    <div className="Login h-100">
      <div className="container h-100">
        <div className="row h-100">
          <div className="col m-auto">
            <center>
              <h2 className="text-info">Login</h2>
              <form className="mx-auto">
                <div className="form-group m-2">
                  <input
                    type="email"
                    className="form-control p-2"
                    id="email"
                    aria-describedby="emailHelp"
                    placeholder="Enter email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group m-2">
                  <input
                    type="password"
                    className="form-control p-2"
                    id="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-info p-2"
                  onClick={(e) => {
                    onSubmit(e);
                  }}
                >
                  Submit
                </button>
              </form>
              <button
                type="button"
                className="btn btn-link"
                onClick={() => {
                  goToRegister();
                }}
              >
                Do not have an account? Sign Up here
              </button>
            </center>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
