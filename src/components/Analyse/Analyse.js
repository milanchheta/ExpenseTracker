import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookie from "js-cookie";
function Analyse(props) {
  const [barGraph, setbarGraph] = useState(null);
  const [pieChart, setpieChart] = useState(null);

  useEffect(() => {
    const token = Cookie.get("token") ? Cookie.get("token") : null;
    if (token == null) {
      props.history.push("/");
    } else {
      axios
        .get(
          "https://analyse-l3dp2wfioq-ue.a.run.app/analyse?expense_sheet_id=" +
            props.location.state.expense_sheet_id +
            "&budget=" +
            props.location.state.budget
        )
        .then(
          (response) => {
            console.log(response.data);
            setbarGraph(response.data["barGraph"]);
            setpieChart(response.data["pieChart"]);
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }, []);
  return (
    <div className="Analyse h-100 mx-auto">
      <h2 className="text-center mb-5"> Analyse your expenses</h2>
      <embed
        type="image/svg+xml"
        src={barGraph}
        style={{ "max-width": "800px" }}
      />
      <embed
        type="image/svg+xml"
        src={pieChart}
        style={{ "max-width": "800px" }}
      />
    </div>
  );
}

export default Analyse;
