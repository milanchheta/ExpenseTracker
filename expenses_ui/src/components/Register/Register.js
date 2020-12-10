import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookie from "js-cookie";

function Register(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");

  useEffect(() => {
    const token = Cookie.get("token") ? Cookie.get("token") : null;
    if (token != null) {
      props.history.push("/sheets");
    }
  }, []);

  const goToLogin = () => {
    props.history.push("/");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    let res = await axios.post("https://users-l3dp2wfioq-uk.a.run.app/user", {
      email: email,
      password: password,
      full_name: name,
    });
    console.log(res);
    if (res.status === 201) {
      props.history.push("/");
    }
  };

  return (
    <div className="Register h-100">
      <div className="container h-100">
        <div className="row h-100">
          <div className="col m-auto">
            <center>
              <h2 className="text-info">Register</h2>
              <form className="m-auto">
                <div className="form-group m-2">
                  <input
                    type="text"
                    className="form-control p-2"
                    id="name"
                    placeholder="Enter name"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
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
                <div className="form-group m-2">
                  <input
                    type="password"
                    className="form-control p-2"
                    id="cpassword"
                    placeholder="Confirm password"
                    onChange={(e) => setCpassword(e.target.value)}
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
                  goToLogin();
                }}
              >
                Already have an account? Login here
              </button>
            </center>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
