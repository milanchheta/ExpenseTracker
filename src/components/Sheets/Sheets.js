import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookie from "js-cookie";
import Expenses from "../Expenses/Expenses";
function Sheets(props) {
  const [name, setName] = useState("");
  const [budget, setBudget] = useState(null);
  const [sheets, setSheets] = useState([]);
  const [sheet_id, setSheet_id] = useState("");

  useEffect(() => {
    const token = Cookie.get("token") ? Cookie.get("token") : null;
    if (token == null) {
      props.history.push("/");
    } else {
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
            console.log(sheets);
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }, []);

  const getCurrentDate = (separator = "/") => {
    let newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();

    return `${
      month < 10 ? `0${month}` : `${month}`
    }${separator}${date}${separator}${year}`;
  };

  const addSheet = (e) => {
    let token = Cookie.get("token") ? Cookie.get("token") : null;

    var data = {
      date_created: getCurrentDate(),
      sheet_budget: budget,
      sheet_name: name,
      token: token,
    };

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
        console.log(error);
      });
  };

  const logOut = (e) => {
    Cookie.remove("token");
    props.history.push("/");
  };
  return (
    <div className="Sheets h-100">
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
          </div>{" "}
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
        </div>{" "}
        <div className="row">
          <div className="col">
            {sheets.length !== 0 ? (
              <div class="list-group mt-5  mx-auto">
                <h2 class="mb-1 text-info text-center">Expense sheets</h2>

                {sheets.map((sheet, idx) => {
                  return (
                    <div key={idx}>
                      <SheetsList
                        sheet={sheet}
                        setSheet_id={setSheet_id}
                        {...props}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center mt-5 text-primary">
                No Expense Sheet available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
function SheetsList(props) {
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
    <div className="list-group-item flex-column align-items-center d-flex w-100">
      <h5 className="mb-1">{props.sheet.sheet_name}</h5>
      <small className="text-muted">{props.sheet.date_created}</small>
      <button
        className="btn text-info"
        onClick={(e) => {
          itemClick(props.sheet.sheet_id);
        }}
      >
        {" "}
        <i class="fas fa-arrow-circle-right fa-2x"></i>
      </button>
    </div>
  );
}
export default Sheets;
