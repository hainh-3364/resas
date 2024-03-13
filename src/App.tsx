<<<<<<< Updated upstream
import './App.css';
import { useState, useEffect, } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { cityProps } from './modals/city';
import { prefectureProps } from './modals/prefecture';
import { ELDERLY, TOTAL, WORKING_AGE, YOUNG, isEmpty2DArray, mergeArrays } from './handlers/const';
import { headers } from './api/axios';
=======
import "./App.css";
import { useState, useEffect, SetStateAction } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { cityProps } from "./modals/city";
import { prefectureProps } from "./modals/prefecture";
import {
  ELDERLY,
  TOTAL,
  WORKING_AGE,
  YOUNG,
  isEmpty2DArray,
  mergeArrays,
} from "./handlers/const";
import { headers } from "./api/axios";
>>>>>>> Stashed changes

export default function App() {
  const [prefecture, setPrefecture] = useState<prefectureProps[]>([]);
  const [city, setCity] = useState<cityProps[]>([]);
  const [prefCode, setPrefCode] = useState("0");
  const [cityCode, setCityCode] = useState("0");
  const [isHidden, setIsHidden] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [dataGet, setDataGet] = useState<any[][]>([[]]);
  const [cityNameArray, setCityNameArray] = useState<string[]>([]);
  const [filter, setFilter] = useState(TOTAL);

  useEffect(() => {
    const apiPrefecture = async () => {
      const dataPrefecture = await fetch(
        "https://opendata.resas-portal.go.jp/api/v1/prefectures",
        {
          method: "GET",
          headers: headers,
        }
      );
      const jsonData = await dataPrefecture.json();
      setPrefecture(jsonData.result);
    };
    const apiCity = async () => {
      // Fetch API data when checkbox is checked
      const dataCity = await fetch(
        "https://opendata.resas-portal.go.jp/api/v1/cities?" +
          new URLSearchParams({ prefCode: prefCode }),
        {
          method: "GET",
          headers: headers,
        }
      );
      const jsonData = await dataCity.json();
      setCity(jsonData.result);
    };
    const apiData = async () => {
      // Fetch API data when checkbox is checked
      try {
        const data = await fetch(
          "https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?" +
            new URLSearchParams({ cityCode: cityCode }) +
            "&" +
            new URLSearchParams({ prefCode: prefCode }),
          {
            method: "GET",
            headers: headers,
          }
        );
        const currentCity = city.filter((item) => {
          return item.cityCode === cityCode;
        });
        const currentCityNameArray = [
          ...cityNameArray,
          currentCity[0].cityName,
        ];
        setCityNameArray(currentCityNameArray);

        const jsonData = await data.json();
        // Process jsonData.result.data into newData
        const newData = jsonData.result.data.map(
          (labelData: { data: { year: any; value: any }[] }) => {
            return labelData.data.map((result: { year: any; value: any }) => {
              return {
                year: result.year,
                [currentCity[0].cityName]: result.value,
              };
            });
          }
        );

        let combinedData;
        if (isEmpty2DArray(dataGet)) {
          combinedData = newData;
        } else {
          combinedData = mergeArrays(newData, dataGet);
        }
        setDataGet(combinedData);
      } catch (error) {}
    };
    apiPrefecture();
    if (prefCode !== "0") {
      apiCity();
    }
    if (prefCode !== "0" && cityCode !== "0") {
      setShowGraph(true);
      apiData();
    }
  }, [prefCode, cityCode, filter]);

  const handleCheckboxPrefChange = (event: any, prefCode: string) => {
    if (event.target.checked) {
      setPrefCode(prefCode); // Toggle set prefecture code for api city and api data
      setIsHidden(true); // Toggle set prefecture hidden
    }
  };

  const handleCheckboxCityChange = (
    event: any,
    cityCode: string,
    cityName: string
  ) => {
    if (event.target.checked) {
      setCityCode(cityCode); // Toggle set city code for api data
    } else {
      setCityNameArray(cityNameArray.filter((item) => item !== cityName)); //Remove cityName from array
      setCityCode("0");
    }
  };

  const handleChangeFilter = (event: any) => {
    setFilter(event.target.value);
  };

  return (
    <div className="App p-4 min-h-screen flex flex-col w-full xl:w-2/3 m-auto">
      {/* <header className="App-header">
        <h1>都道府県</h1>
      </header> */}
      <div>
        <h1 className="text-xl font-bold mb-4 float-start">都道府県</h1>
      </div>
      <body>
        {!isHidden && (
          <div className="prefecture flex flex-wrap mb-4 border border-gray-300 rounded shadow-md p-4">
            {prefecture.map((value) => {
              return (
                <div className="flex w-24">
                  <input
                    type="checkbox"
                    id={value.prefCode}
                    name={value.prefName}
                    value={value.prefCode}
                    onClick={(event) =>
                      handleCheckboxPrefChange(event, value.prefCode)
                    }
                    className="mr-2"
                  />
                  <div>{value.prefName}</div>
                </div>
              );
            })}
          </div>
        )}
        {isHidden && (
          <div className="city w-full flex flex-wrap mb-4 border border-gray-300 rounded shadow-md p-4">
            {city.map((value) => {
              return (
                <div className="flex w-28">
                  <input
                    type="checkbox"
                    id={value.cityCode}
                    name={value.cityName}
                    value={value.cityCode}
                    onClick={(event) =>
                      handleCheckboxCityChange(
                        event,
                        value.cityCode,
                        value.cityName
                      )
                    }
                    className="mr-2"
                  />
                  <div className="truncate">{value.cityName}</div>
                </div>
              );
            })}
          </div>
        )}
        <div className="dropdown">
          <select
            name="filter"
            value={filter}
            onChange={handleChangeFilter}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-1.5"
          >
            <option value={TOTAL}>総人口</option>
            <option value={YOUNG}>年少人口</option>
            <option value={WORKING_AGE}>生産年齢人口</option>
            <option value={ELDERLY}>老年人口</option>
          </select>
        </div>
        {showGraph && (
          <div className="data w-full flex justify-center mt-8 ">
            <ResponsiveContainer height={480}>
              <LineChart data={dataGet[filter]}>
                {cityNameArray.map((value) => {
                  return (
                    <Line type="monotone" dataKey={value} stroke="#8884d8" />
                  );
                })}
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </body>
    </div>
  );
}
