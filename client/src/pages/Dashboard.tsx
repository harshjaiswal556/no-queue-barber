import Cookies from "js-cookie";
import Customer from "./dashboards/Customer";
import Barber from "./dashboards/Barber";
const Dashboard = () => {
  const role = Cookies.get("role");
  return (
    <div className="mt-12">
      {role === "customer" ? <Customer /> : <Barber />}
    </div>
  );
};

export default Dashboard;
