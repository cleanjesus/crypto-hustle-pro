import { Link } from "react-router";

const CoinInfo = ({ id, image, name, symbol, price }) => {
    return (
        <li className="main-list" key={id}>
            <img
                className="icons"
                src={image}
                alt={`Small icon for ${name} crypto coin`}
            />
            {name} <span className="tab"></span>
            {price != null ? ` $${price} USD` : null}
            <Link
                style={{ color: "White" }}
                to={`/coinDetails/${symbol}`}
                key={symbol}
            >
                <img
                    className="icons"
                    src={`https://www.cryptocompare.com${image}`}
                    alt={`Small icon for ${name} crypto coin`}
                />
                {name}
                {price && price.USD ? ` $${price.USD} USD` : null}
            </Link>
        </li>
    );
};

export default CoinInfo;
