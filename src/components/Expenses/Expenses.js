import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookie from "js-cookie";
import Analyse from "../Analyse/Analyse";
function Expenses(props) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [value, setValue] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(props.location.state.budget);
  const [spent, setSpent] = useState(null);

  useEffect(() => {
    const token = Cookie.get("token") ? Cookie.get("token") : null;
    if (token == null) {
      props.history.push("/");
    } else {
      axios
        .get(
          "https://expenses-l3dp2wfioq-uk.a.run.app/expenses?expense_sheet_id=" +
            props.location.state.id
        )
        .then(
          (response) => {
            console.log(response.data);
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

  const addExpense = (e) => {
    var data = {
      expense_name: name,
      expense_value: value,
      date_created: getCurrentDate(),
      expense_category: category,
      expense_sheet_id: props.location.state.id,
    };

    var config = {
      method: "post",
      url: "https://expenses-l3dp2wfioq-uk.a.run.app/expenses",
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
        console.log(error);
      });
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
      <h2 className="text-center text-info">{props.location.state.name}</h2>
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
          <div className="col">
            <div className="form-group m-2 p-2 bg-light  rounded rounded-pill shadow-sm m-2 border border-info mx-auto">
              <select
                className="custom-select bg-light border-0"
                id="inputGroupSelect01"
                onChange={(e) => setCategory(e.target.value)}
              >
                <option defaultValue>Choose category...</option>
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
          <div className="col my-auto">
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
          {expenses.length != 0 && (
            <div className="col my-auto">
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
                  <i class="fas fa-chart-bar mx-1"></i> Analyse expenses
                </button>
              </center>
            </div>
          )}
        </div>{" "}
        <div className="row">
          <div className="col">
            <h3 class="mb-1 text-success text-center">Budget: {budget}</h3>

            {expenses.length !== 0 ? (
              <div class="mx-auto">
                <h3 class="mb-1 text-danger text-center">Spent: {spent}</h3>
                <h2 class="mb-1 text-info text-center">Expenses</h2>
                {/* <ExpenseList expenses={expenses} /> */}
                <div className="container">
                  <div className="row">
                    <div className="col">
                      <table className=" mx-auto">
                        <thead>
                          <tr>
                            <th>Type</th>
                            <th>Name</th>
                            <th>Date</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {expenses.map((expense, idx) => {
                            return <ExpenseList expense={expense} idx={idx} />;
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center mt-5 text-primary">No Expenses</div>
            )}
          </div>
        </div>
      </div>{" "}
    </div>
  );
}

function ExpenseList(props) {
  return (
    <tr key={props.idx}>
      <td>{props.expense.expense_category}</td>
      <td>{props.expense.expense_name}</td>
      <td>{props.expense.date_created}</td>
      <td
        className={
          props.expense.expense_value > 0
            ? "text-white bg-danger border border-light"
            : "text-white bg-success border border-light"
        }
      >
        {props.expense.expense_value}
      </td>
    </tr>
  );
}
export default Expenses;
