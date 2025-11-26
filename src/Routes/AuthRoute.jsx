import { Routes, Route } from "react-router-dom";
import SignIn from "../auth/SignIn";
import SignUp from "../auth/SignUp";
import ForgotPass from "../auth/ForgotPass";
import ConfirmCode from "../auth/ConfirmCode";
import NewPass from "../auth/NewPass";
import ResetSuccess from "../auth/ResetSuccess";

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
