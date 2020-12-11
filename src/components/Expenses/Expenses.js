import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookie from "js-cookie";
import ReactLoading from "react-loading";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Expenses(props) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Other");
  const [value, setValue] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(props.location.state.budget);
  const [spent, setSpent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  useEffect(() => {
    const token = Cookie.get("token") ? Cookie.get("token") : null;
    if (token == null) {
      props.history.push("/");
    } else {
      setLoading(true);

      axios
        .get(
          "https://expenses-l3dp2wfioq-ue.a.run.app/expenses?expense_sheet_id=" +
            props.location.state.id
        )
        .then(
          (response) => {
            let expenseArr = response.data;
            expenseArr.sort(function (a, b) {
              var c = new Date(a.date_created);
              var d = new Date(b.date_created);
              return d - c;
            });
            let s = 0;
            for (let i = 0; i < expenseArr.length; i++) {
              s += parseInt(expenseArr[i]["expense_value"]);
            }
            setSpent(s);
            setExpenses(expenseArr);
            setLoading(false);
          },
          (error) => {
            console.log(error);
            setLoading(false);
          }
        );
    }
  }, []);
  const getCurrentDate = (newDate = new Date(), separator = "/") => {
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();

    return `${
      month < 10 ? `0${month}` : `${month}`
    }${separator}${date}${separator}${year}`;
  };

  const addExpense = (e) => {
    if (category === "" || name === "" || value === "") {
      setError("Please fill out all the fields");
    }
    if (category !== "" && name !== "" && value !== "") {
      setError("");
      var data = {
        expense_name: name,
        expense_value: value,
        date_created: getCurrentDate(startDate),
        expense_category: category,
        expense_sheet_id: props.location.state.id,
      };

      var config = {
        method: "post",
        url: "https://expenses-l3dp2wfioq-ue.a.run.app/expenses",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          console.log(response.data);
          setExpenses([data, ...expenses]);
          setSpent(spent + parseInt(value));
        })
        .catch(function (error) {
          setError("Error adding expense");
          console.log(error);
        });
    }
  };

  const analyse = (e) => {
    console.log("graphs");
    props.history.push({
      pathname: "/analyse",
      state: {
        budget: budget,
        expense_sheet_id: props.location.state.id,
      },
    });
  };

  return (
    <div className="Expenses">
      <h2 className="text-center text-info mt-3">
        Expenses for {props.location.state.name}
      </h2>
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="form-group p-2 bg-light  rounded rounded-pill shadow-sm m-2 border border-info mx-auto">
              <input
                type="text"
                placeholder="Enter expense name"
                aria-describedby="button-addon1"
                className="form-control border-0 bg-light my-auto mx-auto"
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="addExpense"
                name="addExpense"
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="form-group m-2 p-2 bg-light  rounded rounded-pill shadow-sm m-2 border border-info mx-auto">
              <select
                className="custom-select bg-light border-0"
                id="inputGroupSelect01"
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Other">Choose category...</option>
                <option value="Housing">Housing</option>
                <option value="Transportation">Transportation</option>
                <option value="Food">Food</option>
                <option value="Utilities">Utilities</option>
                <option value="Clothing">Clothing</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Gifts">Gifts</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Personal">Personal</option>
                <option value="Debt">Debt</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="form-group m-2 p-2 bg-light  rounded rounded-pill shadow-sm m-2 border border-info mx-auto">
              <input
                type="number"
                placeholder="Enter expense value"
                aria-describedby="button-addon1"
                className="form-control border-0 bg-light mx-auto"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                id="addExpense"
                name="addExpense"
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <center>
              <label>Date of expense: </label>

              <div className="form-group p-2 bg-light mx-auto  rounded rounded-pill shadow-sm  border border-info mx-auto">
                <DatePicker
                  selected={startDate}
                  className="border-0 bg-light text-center"
                  onChange={(date) => setStartDate(date)}
                  maxDate={new Date()}
                />
              </div>
            </center>
          </div>
        </div>
        {error !== "" && (
          <center>
            <small className="text-danger">{error}</small>
          </center>
        )}
        <div className="row">
          <div className="col my-2">
            <center>
              <button
                id="button-addon1"
                type="submit"
                className="btn  btn-info text-light "
                onClick={(e) => {
                  addExpense(e);
                }}
              >
                <i className="fas fa-plus-circle mx-1"></i>
                Add expense
              </button>
            </center>
          </div>
        </div>
        <div className="row">
          {expenses.length !== 0 && (
            <div className="col my-2">
              <center>
                <button
                  id="button-addon1"
                  type="button"
                  data-toggle="modal"
                  data-target="#exampleModalCenter"
                  className="btn  btn-info text-light "
                  onClick={(e) => {
                    analyse(e);
                  }}
                >
                  <i className="fas fa-chart-bar mx-1"></i> Analyse expenses
                </button>
              </center>
            </div>
          )}
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
              <h3 className="mb-1 text-success text-center">
                Budget: {budget}$
              </h3>

              {expenses.length !== 0 ? (
                <div className="mx-auto">
                  <h3 className="mb-1 text-danger text-center">
                    Spent: {spent}$
                    {spent > budget ? ` / Overspent: ${spent - budget}$` : null}
                  </h3>
                  <hr />
                  <div className="container">
                    <div className="row">
                      {expenses.map((expense, idx) => {
                        return (
                          <div
                            key={idx}
                            className="col-lg-4 col-md-4 col-sm-12 col-xs-12"
                          >
                            <ExpenseList expense={expense} idx={idx} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center mt-5 text-primary">No Expenses</div>
              )}
            </div>
          )}
        </div>
      </div>{" "}
    </div>
  );
}

function ExpenseList(props) {
  return (
    <div className="card shadow p-0 my-1">
      <div className="card-body">
        <center>
          <span className="card-title">{props.expense.expense_name}</span>
          <br />
          <span>Type: {props.expense.expense_category}</span>
          <br />
          <span
            className={
              props.expense.expense_value > 0
                ? "text-danger  expenseValue "
                : "text-success expenseValue"
            }
          >
            {props.expense.expense_value}$
          </span>
          <br />
          <small className="text-muted">
            Date of Expense: {props.expense.date_created}
          </small>
          <br />
        </center>
      </div>
    </div>
  );
}
export default Expenses;
