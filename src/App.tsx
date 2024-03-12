import './App.css';
import { useState, useEffect, } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

type prefectureProps = {
  prefCode: string;
  prefName: string;
};
type cityProps = {
  prefCode: string;
  cityCode: string;
  cityName: string;
  bigCityFlag: string;
}

export default function App() {
  const [prefecture, setPrefecture] = useState<prefectureProps[]>([]);
  const [city, setCity] = useState<cityProps[]>([]);
  const [prefCode, setPrefCode] = useState("0");
  const [cityCode, setCityCode] = useState("0");
  const [isHidden, setIsHidden] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [dataGet, setData] = useState<number[]>([]);
  const [cityNameArray, setCityNameArray] = useState<string[]>([]);
  // const xApiKey: string = (process.env.XAPIKEY as string);
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'X-API-KEY': process.env.REACT_APP_XAPIKEY!,
  }
  useEffect(() => {
    const apiPrefecture = async () => {
      const dataPrefecture = await fetch("https://opendata.resas-portal.go.jp/api/v1/prefectures", {
        method: "GET",
        headers: headers
      });
      const jsonData = await dataPrefecture.json();
      setPrefecture(jsonData.result);
    };
    const apiCity = async () => {
      // Fetch API data when checkbox is checked
      const dataCity = await fetch('https://opendata.resas-portal.go.jp/api/v1/cities?' + new URLSearchParams(
        { prefCode: prefCode }), {
        method: "GET",
        headers: headers
      });
      const jsonData = await dataCity.json();
      setCity(jsonData.result);
    }
    
    apiPrefecture();
    if (prefCode !== "0") {
      apiCity();
    }
    if (prefCode !== "0" && cityCode !== "0") {
      setShowGraph(true);
    }
  }, [prefCode, cityCode]);

  const handleCheckboxPrefChange = (event: any, prefCode: string) => {
    if (event.target.checked) {
      setPrefCode(prefCode); // Toggle set prefecture code for api city and api data
      setIsHidden(true); // Toggle set prefecture hidden
    }
  };

  const handleCheckboxCityChange = (event: any, cityCode: string, cityName: string) => {
    if (event.target.checked) {
      setCityCode(cityCode); // Toggle set city code for api data
    }
    else{
      setCityNameArray(cityNameArray.filter(item => item !== cityName)); //Remove cityName from array
      setCityCode("0");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          都道府県
        </h1>
      </header>
      <body>
        {!isHidden &&
          <div className='prefecture'>
            {prefecture.map((value) => {
              return (
                <div>
                  <input type="checkbox" id={value.prefCode} name={value.prefName}
                    value={value.prefCode} onClick={(event) => handleCheckboxPrefChange(event,value.prefCode)} />
                  <div>{value.prefName}</div>
                </div>
              );
            })}
          </div>
        }
        <div className='city'>
          {city.map((value) => {
            return (
              <div>
                <input type="checkbox" id={value.cityCode} name={value.cityName}
                  value={value.cityCode} onClick={(event) => handleCheckboxCityChange(event, value.cityCode, value.cityName)} />
                <div>{value.cityName}</div>
              </div>
            );
          })}
        </div>
      </body>
    </div>

  );
}
