import { LoginForm } from "@/components/ui/login-form";
import { Card } from "antd";

const LoginPage = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <Card>
        <p className="text-2xl font-bold flex justify-center">Login</p>
        <LoginForm />
      </Card>
    </div>
  );
};

export default LoginPage;
