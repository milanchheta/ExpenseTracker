//file for expense sheets component

//import statements
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookie from "js-cookie";
import ReactLoading from "react-loading";

//Function for sheets component
function Sheets(props) {
  const [name, setName] = useState("");
  const [budget, setBudget] = useState();
  const [sheets, setSheets] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = Cookie.get("token") ? Cookie.get("token") : null;
    //check if user is already logged in
    if (token == null) {
      props.history.push("/");
    } else {
      //fetch already existing sheets
      setLoading(true);
      axios
        .get("https://sheets-l3dp2wfioq-ue.a.run.app/sheets?token=" + token)
        .then(
          (response) => {
            let sheetArr = response.data;
            sheetArr.sort(function (a, b) {
              var c = new Date(a.date_created);
              var d = new Date(b.date_created);
              return d - c;
            });
            setSheets(sheetArr);
            setLoading(false);
          },
          (error) => {
            console.log(error);
            setLoading(false);
          }
        );
    }
  }, []);

  //function to get current date
  const getCurrentDate = (separator = "/") => {
    let newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();

    return `${
      month < 10 ? `0${month}` : `${month}`
    }${separator}${date}${separator}${year}`;
  };

  //function to add new sheet
  const addSheet = (e) => {
    //input validation
    if (name === "" || budget === "") {
      setError("Please fill out all the fields");
    }
    let token = Cookie.get("token") ? Cookie.get("token") : null;
    var data = {
      date_created: getCurrentDate(),
      sheet_budget: budget,
      sheet_name: name,
      token: token,
    };
    //if all the input is valid
    if (name !== "" && budget !== "") {
      setError("");
      var config = {
        method: "post",
        url: "https://sheets-l3dp2wfioq-ue.a.run.app/sheets",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          setName("");
          setBudget(0);
          setSheets([response.data, ...sheets]);
        })
        .catch(function (error) {
          setError("Error creating new sheet");
          console.log(error);
        });
    }
  };
  // function for logging out
  const logOut = (e) => {
    Cookie.remove("token");
    props.history.push("/");
  };
  return (
    <div className="Sheets h-100">
      <h2 className="text-info text-center mb-3 mt-3">Expense sheets</h2>

      <div className="container">
        <div className="row">
          <div className="col">
            {" "}
            <div className="form-group p-2 bg-light  rounded rounded-pill shadow-sm m-2 border border-info mx-auto">
              <input
                type="text"
                placeholder="New expense sheet name..."
                aria-describedby="button-addon1"
                className="form-control border-0 bg-light my-auto mx-auto"
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="addExpense"
                name="addExpense"
              />
            </div>
          </div>
        </div>{" "}
        <div className="row">
          <div className="col">
            <div className="form-group m-2 p-2 bg-light  rounded rounded-pill shadow-sm m-2 border border-info mx-auto">
              <input
                type="number"
                placeholder="Enter budget..."
                aria-describedby="button-addon1"
                className="form-control border-0 bg-light mx-auto"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                id="addExpense"
                name="addExpense"
              />
            </div>
          </div>
        </div>
        {error !== "" && (
          <center>
            <small className="text-danger">{error}</small>
          </center>
        )}
        <div className="row mt-1">
          <div className="col my-auto">
            <center>
              <button
                id="button-addon1"
                type="submit"
                className="btn  btn-info text-light "
                onClick={(e) => {
                  addSheet(e);
                }}
              >
                <i className="fas fa-plus-circle mx-1"></i>
                Add expense sheet
              </button>
            </center>
          </div>
        </div>{" "}
        <div className="row mt-2">
          <div className="col my-auto">
            <center>
              <button
                id="button-addon1"
                type="submit"
                className="btn  btn-danger text-light "
                onClick={(e) => {
                  logOut(e);
                }}
              >
                Logout
              </button>
            </center>
          </div>
        </div>
        <hr />
        <div className="row">
          {loading ? (
            <div className="col">
              <ReactLoading
                type="spin"
                className="m-auto"
                color="#00aaff"
                height={100}
                width={100}
              />
            </div>
          ) : (
            <div className="col">
              {sheets.length !== 0 ? (
                <div className="container">
                  <div className="row">
                    {sheets.map((sheet, idx) => {
                      return (
                        <div
                          key={idx}
                          className="col-lg-4 col-md-4 col-sm-12 col-xs-12"
                        >
                          <SheetsList sheet={sheet} {...props} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center mt-5 text-primary">
                  No Expense Sheet available
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

//function to display all the created sheets
function SheetsList(props) {
  //function to handle go to sheet button
  const itemClick = (id) => {
    props.history.push({
      pathname: "/expenses",
      state: {
        id: id,
        name: props.sheet.sheet_name,
        budget: props.sheet.sheet_budget,
      },
    });
  };
  return (
    <div className="card shadow p-0 my-1">
      <div className="card-body">
        <center>
          <span className="card-title">{props.sheet.sheet_name}</span>
          <br />
          <small className="text-muted">
            Date Created: {props.sheet.date_created}
          </small>
          <br />
          <button
            className="btn btn-info my-auto"
            onClick={(e) => {
              itemClick(props.sheet.sheet_id);
            }}
          >
            Go to sheet <i className="fas fa-arrow-circle-right mx-1"></i>
          </button>
        </center>
      </div>
    </div>
  );
}
export default Sheets;
