import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { Home } from "./pages/Home";
import { CitySelection } from "./pages/CitySelection";
import { BodyAreaSelection } from "./pages/BodyAreaSelection";
import { Services } from "./pages/Services";
import { Booking } from "./pages/Booking";
import { Auth } from "./pages/Auth";
import { Checkout } from "./pages/Checkout";
import { PaymentGateway } from "./pages/PaymentGateway";
import { Confirmation } from "./pages/Confirmation";
import { AdminDashboard } from "./pages/AdminDashboard";
import { Journey } from "./pages/Journey";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "city", Component: CitySelection },
      { path: "body-area", Component: BodyAreaSelection },
      { path: "services", Component: Services },
      { path: "booking", Component: Booking },
      { path: "auth", Component: Auth },
      { path: "checkout", Component: Checkout },
      { path: "payment", Component: PaymentGateway },
      { path: "confirmation", Component: Confirmation },
      { path: "journey", Component: Journey },
      { path: "admin", Component: AdminDashboard },
    ],
  },
]);