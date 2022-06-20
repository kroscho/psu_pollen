import React, { useState, useContext } from "react";
import { Specie } from "../../types/types";
import { DatePicker, InputNumber, Button, message } from "antd";
import moment from "moment";
import { db } from "../../services/firebase";
import "./styles.css";
import "../../App.css";
import { SpeciesContext } from "../../services/speciesContext";

function AddData() {
  const [species] = useContext(SpeciesContext);
  const [inputs, setInputs] = useState<any>({});
  const [date, setDate] = useState({
    day: 0,
    year: 0,
    month: 0,
    dateString: "",
  });

  const changeInput = (id: string, value: string | number | undefined) => {
    setInputs((inputs: any) => {
      return {
        ...inputs,
        [id]: value,
      };
    });
  };

  const renderList = (list: any) => {
    return list.map((item: Specie) => (
      <div key={item.id} className="addDataInput">
        <label htmlFor={item.id}>{item.name_ru}</label>
        <InputNumber
          name={item.id}
          min={0}
          value={inputs[item.id] || ""}
          onChange={(value) => changeInput(item.id, value)}
        />
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
      <div className="addDataInputs">
        <div>
          <h3>Деревья</h3>
          {renderList(trees)}
        </div>
        <div className="addDataRightColumn">
          <h3>Травы</h3>
          {renderList(herbs)}
        </div>
      </div>
    );
    // return species.map((item: Specie) => (
    //   <div key={item.id} className="addDataInput">
    //     <label htmlFor={item.id}>{item.name_ru}</label>
    //     <InputNumber
    //       name={item.id}
    //       min={0}
    //       value={inputs[item.id] || ""}
    //       onChange={(value) => changeInput(item.id, value)}
    //     />
    //   </div>
    // ));
  };

  const selectDate = (value: any, dateString: string) => {
    const year = moment(dateString).get("year");
    const month = moment(dateString).get("month") + 1;
    const day = moment(dateString).get("date");
    setDate({
      day,
      month,
      year,
      dateString,
    });
  };

  const sendData = () => {
    let dataToSend = {};
    species.map((item: any) => {
      dataToSend = {
        ...dataToSend,
        [item.id]: parseInt(inputs[item.id]) || 0,
      };
    });

    db.collection("monitoring")
      .doc(`${date.dateString}`)
      .set({
        ...dataToSend,
        timestamp: new Date(date.dateString).getTime(),
        dateString: date.dateString,
        year: date.year,
        month: date.month,
        day: date.day,
      })
      .then(function () {
        message.success("Документ успешно добавлен");
      })
      .catch(function () {
        message.error("Ошибка при добавлении документа");
      });
  };

  return (
    <div className="container">
      <div>
        <DatePicker onChange={selectDate} />
        <div className="speciesWrapper">{renderSpecies(species)}</div>
        <Button type="primary" onClick={sendData}>
          Отправить
        </Button>
      </div>
    </div>
  );
}

export default AddData;
