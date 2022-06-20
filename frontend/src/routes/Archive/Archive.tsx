import React, { useEffect, useState } from "react";
import "../../App.css";
import "./style.css";
import { get2019Year } from "../../services/api";
import {
  CartesianGrid,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";

function Archive() {
  const [data, setData] = useState<any>([]);
  useEffect(() => {
    async function getData() {
      const result = await get2019Year();
      setData(result);
    }
    getData();
  }, []);
  return (
    <div className="container">
      <div className="graphTitle">2019 - Деревья</div>

      {data.length > 0 && (
        <LineChart
          width={730}
          height={250}
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dateString" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="alnus" stroke="#82ca9d" dot={false} />
          <Line
            type="monotone"
            dataKey="betula"
            stroke="rgb(57,106,177)"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="populus"
            stroke="rgb(218,124,48)"
            dot={false}
          />
        </LineChart>
      )}

      <div className="graphTitle">2019 - Травы</div>

      {data.length > 0 && (
        <LineChart
          width={730}
          height={250}
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dateString" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="urtica" stroke="#82ca9d" dot={false} />
          <Line
            type="monotone"
            dataKey="poaceae"
            stroke="rgb(57,106,177)"
            dot={false}
          />
          {/* <Line
            type="monotone"
            dataKey="populus"
            stroke="rgb(218,124,48)"
            dot={false}
          /> */}
        </LineChart>
      )}
    </div>
  );
}

export default Archive;
