import { Link } from "react-router";

const CoinInfo = ({ id, image, name, symbol, price }) => {
    return (
        <li className="main-list" key={id}>
            <Link
                style={{ color: "White" }}
                to={`/coinDetails/${id}`}
                key={id}
            >
                <img
                    className="icons"
                    src={image}
                    alt={`Small icon for ${name} crypto coin`}
                />
                {name}
                {price != null ? ` $${price} USD` : null}
            </Link>
        </li>
    );
};

export default CoinInfo;
