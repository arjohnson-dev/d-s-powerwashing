import { Link } from "react-router-dom";

function PrimaryButtonLink({ children, onClick, to }) {
  return (
    <Link className="button button-primary" to={to} onClick={onClick}>
      {children}
    </Link>
  );
}

export default PrimaryButtonLink;
