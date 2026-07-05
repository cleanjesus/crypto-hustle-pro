import { useEffect, useState } from "react";
import { useParams } from "react-router";
import CoinChart from "./CoinChart";
const API_KEY = import.meta.env.VITE_APP_API_KEY;

function CoinDetail() {
    const { id } = useParams();
    const [fullDetails, setFullDetails] = useState(null);

    useEffect(() => {
        const getCoinDetail = async () => {
            const response = await fetch(
                `https://api.coingecko.com/api/v3/coins/${id}`,
                {
                    headers: {
                        "x-cg-demo-api-key": API_KEY,
                    },
                },
            );
            const data = await response.json();
            setFullDetails(data);
        };

        getCoinDetail().catch(console.error);
    }, [id]);

    return (
        <>
            <h1>{fullDetails?.name}</h1>
            <img
                className="images"
                src={fullDetails?.image?.large}
                alt={`Small icon for ${id} crypto coin`}
            />
            <div
                dangerouslySetInnerHTML={{ __html: fullDetails?.description?.en }}
            />
            <br></br>
            <div>
                This coin was built with the algorithm{" "}
                {fullDetails?.hashing_algorithm}{" "}
            </div>
            <table>
                <tbody>
                    <tr>
                        <th>Launch Date </th>
                        <td>{fullDetails?.genesis_date}</td>
                    </tr>
                    <tr>
                        <th>Website </th>
                        <td>{fullDetails?.links?.homepage?.[0]}</td>
                    </tr>
                    <tr>
                        <th>Whitepaper </th>
                        <td>{fullDetails?.links?.whitepaper}</td>
                    </tr>
                    <tr>
                        <th>Monetary Symbol </th>
                        <td>{fullDetails?.symbol?.toUpperCase()}</td>
                    </tr>
                    <tr>
                        <th>Market </th>
                        <td>{fullDetails?.categories?.[0]}</td>
                    </tr>
                    <tr>
                        <th>Last Transaction </th>
                        <td>{fullDetails?.market_data?.last_updated}</td>
                    </tr>
                    <tr>
                        <th>Last Transaction Value</th>
                        <td>
                            {fullDetails?.market_data?.current_price?.usd !=
                            null
                                ? `$ ${fullDetails.market_data.current_price.usd}`
                                : null}
                        </td>
                    </tr>
                    <tr>
                        <th>Volume </th>
                        <td>
                            {fullDetails?.market_data?.total_volume?.usd !=
                            null
                                ? `$ ${fullDetails.market_data.total_volume.usd}`
                                : null}
                        </td>
                    </tr>
                    <tr>
                        <th>Today's Open Price </th>
                        <td>
                            {fullDetails?.market_data
                                ? `$ ${(
                                      fullDetails.market_data.current_price
                                          .usd -
                                      fullDetails.market_data.price_change_24h
                                  ).toFixed(2)}`
                                : null}
                        </td>
                    </tr>
                    <tr>
                        <th>Highest Price during the Day </th>
                        <td>
                            {fullDetails?.market_data?.high_24h?.usd != null
                                ? `$ ${fullDetails.market_data.high_24h.usd}`
                                : null}
                        </td>
                    </tr>
                    <tr>
                        <th>Lowest Price during the Day </th>
                        <td>
                            {fullDetails?.market_data?.low_24h?.usd != null
                                ? `$ ${fullDetails.market_data.low_24h.usd}`
                                : null}
                        </td>
                    </tr>
                    <tr>
                        <th>Change from Previous Day </th>
                        <td>
                            {fullDetails?.market_data?.price_change_24h !=
                            null
                                ? `$ ${fullDetails.market_data.price_change_24h}`
                                : null}
                        </td>
                    </tr>
                    <tr>
                        <th>Market Cap </th>
                        <td>
                            {fullDetails?.market_data?.market_cap?.usd != null
                                ? `$ ${fullDetails.market_data.market_cap.usd}`
                                : null}
                        </td>
                    </tr>
                </tbody>
            </table>
            <CoinChart id={id} />
        </>
    );
}

export default CoinDetail;
