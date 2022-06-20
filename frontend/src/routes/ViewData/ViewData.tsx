import React, { useState, useContext } from "react";
import "../../App.css";
import "./styles.css";
import { DatePicker } from "antd";
import { Typography } from "antd";
import {
  getMonitoringDataByDay,
  getDataBetweenTwoDates,
} from "../../services/api";
import { SpeciesContext } from "../../services/speciesContext";
import { Specie } from "../../types/types";
import isEmpty from "../../services/isEmpty";
import getLevel from "../../services/getLevel";
import moment from "moment";
import {
  CartesianGrid,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";

const { Title } = Typography;

function ViewData() {
  const [species] = useContext(SpeciesContext);
  const [data, setData] = useState<any>({});

  const [firstDate, setFirstDate] = useState<any>(null);
  const [secondDate, setSecondDate] = useState<any>(null);
  const [twoDatesData, setTwoDatesData] = useState<any>([]);

  const selectDate = async (value: any, dateString: string) => {
    setData(await getMonitoringDataByDay(dateString));
  };

  const selectFirstDate = async (value: any, dateString: string) => {
    setFirstDate(moment(value).valueOf());
    if (secondDate) {
      const first = moment(value).valueOf();
      const result = await getDataBetweenTwoDates(first, secondDate);
      setTwoDatesData(result);
    }
  };

  const selectSecondDate = async (value: any, dateString: string) => {
    setSecondDate(moment(value).valueOf());
    if (firstDate) {
      const second = moment(value).valueOf();
      const result = await getDataBetweenTwoDates(firstDate, second);
      setTwoDatesData(result);
    }
  };

  const renderItems = (items: any, type: string) => {
    return items.map((item: Specie) => (
      <div className="specie" key={item.id}>
        <div key={item.id}>{item.name_ru}</div>
        <div className={`${getLevel(type, data[item.id])} viewDataValue`}>
          {data[item.id]}
        </div>
      </div>
    ));
  };

  const renderSpecies = (species: Array<Specie>) => {
    const trees = species.filter((item) => {
      return item.type === "tree";
    });
    const herbs = species.filter((item) => {
      return item.type === "herb";
    });
    return (
      <div className="viewDataWrapper">
        <div>
          <h3>Деревья</h3>
          {renderItems(trees, "tree")}
        </div>
        <div className="viewDataRightColumn">
          <h3>Травы</h3>
          {renderItems(herbs, "herb")}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (data === undefined) {
      return <div className="informationText">Нет данных на эту дату</div>;
    } else {
      if (!isEmpty(data)) {
        return renderSpecies(species);
      } else {
        return null;
      }
    }
  };

  return (
    <div className="container">
      <div>
        <Title>Показать данные за один день</Title>
        <DatePicker onChange={selectDate} className="viewImageDayPicker" />
        {renderContent()}
        {data && !isEmpty(data) && (
          <img
            src={require("../../images/levels.png")}
            className="levelsImage"
          />
        )}
        <Title>Показать данные за временной промежуток</Title>
        <DatePicker onChange={selectFirstDate} className="viewImageDayPicker" />
        <DatePicker
          onChange={selectSecondDate}
          className="viewImageDayPicker"
        />
        {twoDatesData.length > 0 && (
          <div>
            <Title level={4} className="graphTitle">
              Деревья
            </Title>
            <LineChart
              width={730}
              height={250}
              data={twoDatesData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dateString" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="alnus"
                stroke="#82ca9d"
                dot={false}
              />
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
              <Line
                type="monotone"
                dataKey="ulmus"
                stroke="rgb(62,150,81)"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="quercus"
                stroke="rgb(204,37,41)"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="salix"
                stroke="rgb(83,81,84)"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="picea"
                stroke="rgb(83,81,84)"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="acer"
                stroke="rgb(107,76,154)"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="corylus"
                stroke="rgb(146,36,40)"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="tilia"
                stroke="rgb(148,139,61)"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="pinus"
                stroke="rgb(204,194,16)"
                dot={false}
              />
            </LineChart>

            <Title level={4} className="graphTitle">
              Травы
            </Title>
            <LineChart
              width={730}
              height={250}
              data={twoDatesData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dateString" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="ambrosia"
                stroke="#82ca9d"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="poaceae"
                stroke="rgb(57,106,177)"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="urtíca"
                stroke="rgb(218,124,48)"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="chenopodium"
                stroke="rgb(62,150,81)"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="plantago"
                stroke="rgb(204,37,41)"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="artemisia"
                stroke="rgb(83,81,84)"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="rumex"
                stroke="rgb(83,81,84)"
                dot={false}
              />
            </LineChart>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewData;
