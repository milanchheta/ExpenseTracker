import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookie from "js-cookie";
import ReactLoading from "react-loading";

function Register(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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

    var pattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );
    if (name === "" || email === "" || password === "") {
      setError("Please fill out all the fields");
    }
    if (!pattern.test(email) && error !== "") {
      setError("Enter Valid Email Address");
    }
    if (password !== cpassword && password !== "" && cpassword !== "") {
      setError("Passwords do not match");
    }
    if (
      name !== "" &&
      email !== "" &&
      password !== "" &&
      pattern.test(email) &&
      password === cpassword
    ) {
      setError("");
      setLoading(true);
      let res = await axios.post("https://users-l3dp2wfioq-ue.a.run.app/user", {
        email: email,
        password: password,
        full_name: name,
      });
      setLoading(false);
      if (res.status === 201) {
        props.history.push("/");
      } else if (res.status === 202) {
        setError("User already exists. Please login.");
      } else {
        setError("Error signing up");
      }
    }
  };

  return (
    <div className="Register h-100 bg-info">
      <div className="container h-100">
        <div className="row h-100">
          <div className="col m-auto card shadow">
            <p className="display-4 text-info text-center">
              Expense Tracker App
            </p>
            {loading ? (
              <ReactLoading
                type="spin"
                className="m-auto"
                color="#00aaff"
                height={100}
                width={100}
              />
            ) : (
              <center>
                <h2 className="text-dark">Register</h2>
                <form className="m-auto">
                  <div className="form-group m-2">
                    <input
                      type="text"
                      className="form-control p-2"
                      id="name"
                      placeholder="Enter name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="form-group m-2">
                    <input
                      type="text"
                      className="form-control p-2"
                      id="email"
                      aria-describedby="emailHelp"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) =>
                        e.target.value.trim() == email
                          ? null
                          : setEmail(e.target.value)
                      }
                    />
                  </div>

                  <div className="form-group m-2">
                    <input
                      type="password"
                      className="form-control p-2"
                      id="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) =>
                        e.target.value.trim() == password
                          ? null
                          : setPassword(e.target.value)
                      }
                    />
                  </div>
                  <div className="form-group m-2">
                    <input
                      type="password"
                      className="form-control p-2"
                      id="cpassword"
                      placeholder="Confirm password"
                      value={cpassword}
                      onChange={(e) =>
                        e.target.value.trim() == cpassword
                          ? null
                          : setCpassword(e.target.value)
                      }
                    />
                  </div>
                  {error !== "" && (
                    <div>
                      {" "}
                      <small className="text-danger">{error}</small>
                    </div>
                  )}
                  <button
                    type="submit"
                    className="btn btn-info mt-2 p-2"
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
