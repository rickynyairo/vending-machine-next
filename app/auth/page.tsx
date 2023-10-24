import { PivotElement } from "./pivot";
import { SignupForm } from "./signup";
import { LoginForm } from "./login";

export default function Auth() {
  return <PivotElement SignupForm={SignupForm} LoginForm={LoginForm} />;
}
