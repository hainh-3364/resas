import React from 'react';
import './App.css';
import { useState, useEffect,} from "react";

type prefectureProps = {
  prefCode: string;
  prefName: string;
};

export default function App() {
  const [prefecture, setPrefecture] = useState<prefectureProps[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  // const xApiKey: string = (process.env.XAPIKEY as string);
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'X-API-KEY': '2DKYRvyCSG8i2eJp0W9IhL2oc6Fsl2Gmjlj6y6CC'
  }
  useEffect(() => {
    const api = async () => {
      const dataPrefecture = await fetch("https://opendata.resas-portal.go.jp/api/v1/prefectures", {
        method: "GET",
        headers: headers
      });
      const jsonData = await dataPrefecture.json();
      setPrefecture(jsonData.result);
    };
    api();
  }, []);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked); // Toggle checkbox state
  };

  return (
    <div className="App">
      <header className="App-header">
      <h1>
        {prefecture.map((value) => {
          return (
            <div>
              <input type="checkbox" id={value.prefCode} name={value.prefName} 
              value={value.prefCode} checked={isChecked} onChange={handleCheckboxChange}/>
              <div>{value.prefName}</div>
            </div>
          );
        })}
      </h1>
      </header>
    </div>
  );
}
