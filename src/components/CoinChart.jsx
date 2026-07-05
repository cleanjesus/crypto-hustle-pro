import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Label,
} from "recharts";
const API_KEY = import.meta.env.VITE_APP_API_KEY;

const CoinChart = ({ id }) => {
    const [histData, setHistData] = useState(null);

    useEffect(() => {
        const getCoinHist = async () => {
            const response = await fetch(
                `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=30`,
                {
                    headers: {
                        "x-cg-demo-api-key": API_KEY,
                    },
                },
            );

            const json = await response.json();
            setHistData(json.prices);
        };
        getCoinHist().catch(console.error);
    }, [id]);

    const cleanData = (data) => {
        let filteredData = [];
        for (const item of data) {
            filteredData.push({
                time: new Date(item[0]).toLocaleDateString("en-US"),
                "open price": item[1],
            });
        }
        return filteredData;
    };

    return (
        <div>
            {histData ? (
                <div>
                    <br></br>
                    <h2>30-Day Price Data for {id}</h2>

                    <LineChart
                        width={900}
                        height={400}
                        data={cleanData(histData)}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 20,
                            bottom: 30,
                        }}
                    >
                        <Line
                            type="monotone"
                            dataKey="open price"
                            stroke="#8884d8"
                            activeDot={{ r: 5 }}
                        />
                        <CartesianGrid strokeDasharray="5 5" />
                        <XAxis dataKey="time" interval={24} angle={20} dy={5}>
                            <Label
                                value="Date and Time"
                                offset={0}
                                position="insideBottom"
                                dy={50}
                            />
                        </XAxis>

                        <YAxis
                            label={{
                                value: "Price",
                                angle: -90,
                                position: "insideLeft",
                                textAnchor: "middle",
                                dx: -18,
                            }}
                        />
                        <Tooltip />
                    </LineChart>
                </div>
            ) : null}
        </div>
    );
};

export default CoinChart;
