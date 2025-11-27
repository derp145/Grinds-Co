import { Routes, Route } from "react-router-dom";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import ForgotPass from "./ForgotPass";
import ConfirmCode from "./ConfirmCode";
import NewPass from "./NewPass";
import ResetSuccess from "./ResetSuccess";

function AuthRoute() {
  return (
    <Routes>
      <Route path="signin" element={<SignIn />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="forgot" element={<ForgotPass />} />
      <Route path="confirm-code" element={<ConfirmCode />} />
      <Route path="new-password" element={<NewPass />} />
      <Route path="reset-success" element={<ResetSuccess />} />
    </Routes>
  );
}

export default AuthRoute;
