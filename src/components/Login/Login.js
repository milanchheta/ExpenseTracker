//file for login component

//import statements
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookie from "js-cookie";
import ReactLoading from "react-loading";

//Function for login component
function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = Cookie.get("token") ? Cookie.get("token") : null;
    //check if user is already logged in
    if (token != null) {
      props.history.push("/sheets");
    }
  }, []);

  // got to register page
  const goToRegister = () => {
    props.history.push("/register");
  };

  //action for on login
  const onSubmit = async (e) => {
    e.preventDefault();

    var pattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );
    //input validation
    if (email === "" || password === "") {
      setError("Please fill out all the fields");
    }
    //input validation
    if (!pattern.test(email) && email !== "") {
      setError("Enter Valid Email Address");
    }
    //if all the input is valid
    if (email !== "" && password !== "" && pattern.test(email)) {
      setError("");
      setLoading(true);
      axios
        .get(
          "https://users-l3dp2wfioq-ue.a.run.app/user?email=" +
            email +
            "&password=" +
            password
        )
        .then(
          (response) => {
            setLoading(false);
            Cookie.set("token", response.data.token);
            props.history.push("/sheets");
          },
          (error) => {
            setLoading(false);
            if (error.response.status === 401) {
              setError("Incorrect credentials / User does not exist");
            } else {
              setError("Error Logging in");
            }
            console.log(error);
          }
        );
    }
  };

  return (
    <div className="Login h-100 bg-info">
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
                <h2 className="text-dark">Login</h2>
                <form className="mx-auto ">
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
                  {error !== "" && (
                    <div>
                      <small className="text-danger">{error}</small>
                    </div>
                  )}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
