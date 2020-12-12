//file for analyse component

//import statements
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookie from "js-cookie";
import ReactLoading from "react-loading";

//Function for analyse component
function Analyse(props) {
  const [barGraph, setbarGraph] = useState(null);
  const [pieChart, setpieChart] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = Cookie.get("token") ? Cookie.get("token") : null;
    //check if user is already logged in
    if (token == null) {
      props.history.push("/");
    } else {
      //get the graphs from the analyse microservice
      setLoading(true);
      axios
        .get(
          "https://analyse-l3dp2wfioq-ue.a.run.app/analyse?expense_sheet_id=" +
            props.location.state.expense_sheet_id +
            "&budget=" +
            props.location.state.budget
        )
        .then(
          (response) => {
            setbarGraph(response.data["barGraph"]);
            setpieChart(response.data["pieChart"]);
            setLoading(false);
          },
          (error) => {
            console.log(error);
            setLoading(false);
          }
        );
    }
  }, []);

  return (
    <div className="Analyse h-100 mx-auto">
      <h2 className="text-center text-info mb-5 mt-3">
        {" "}
        Analyse your expenses
      </h2>
      <div className="container-fluid">
        {loading ? (
          <div className="row">
            <div className="col">
              <ReactLoading
                type="spin"
                className="m-auto"
                color="#00aaff"
                height={100}
                width={100}
              />{" "}
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col text-center">
              <embed
                type="image/svg+xml"
                src={barGraph}
                className="m-1"
                style={{ maxWidth: "750px" }}
              />
              <embed
                type="image/svg+xml"
                src={pieChart}
                className="m-1"
                style={{ maxWidth: "750px" }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Analyse;
