import {
  Form,
  Input,
  Button,
  Card,
  message,
  Typography,
  Divider,
} from "antd";
import {
  MailOutlined,
  LockOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { supabase } from "../supabaseClient";
import { useNavigate, Link } from "react-router-dom";

const { Title, Text } = Typography;

function Login() {
  const navigate = useNavigate();

  const onFinish = async ({ email, password }) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        message.error(error.message);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        message.error("Foydalanuvchi topilmadi");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

        if (data?.role === "seller") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
    } catch (err) {
      console.log(err);
      message.error("Login xatoligi");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #111111 0%, #1d1d1d 50%, #8B5E3C 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <Card
        style={{
          width: 430,
          borderRadius: 28,
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(24px)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.45)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <Title level={2} style={{ color: "#FFFFFF" }}>
            CraftMap Login
          </Title>

          <Text
            style={{
              color: "rgba(255,255,255,0.7)",
            }}
          >
            Marketplace platformasiga xush kelibsiz
          </Text>
        </div>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            label={<span style={{ color: "#fff" }}>Email</span>}
            rules={[
              { required: true, message: "Email kiriting" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              size="large"
              placeholder="Email"
              style={inputStyle}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span style={{ color: "#fff" }}>Parol</span>}
            rules={[
              { required: true, message: "Parol kiriting" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              size="large"
              placeholder="Parol"
              style={inputStyle}
            />
          </Form.Item>

          <Button
            htmlType="submit"
            type="primary"
            icon={<LoginOutlined />}
            block
            style={submitBtn}
          >
            Login
          </Button>
        </Form>

        <Divider style={{ borderColor: "rgba(255,255,255,0.12)" }} />

        <div style={{ textAlign: "center" }}>
          <Text style={{ color: "rgba(255,255,255,0.7)" }}>
            Akkount yo‘qmi?{" "}
          </Text>

          <Link
            to="/register"
            style={{
              color: "#fff",
              fontWeight: 600,
            }}
          >
            Register
          </Link>
        </div>
      </Card>
    </div>
  );
}

const inputStyle = {
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "#fff",
  borderRadius: 14,
};

const submitBtn = {
  height: 52,
  borderRadius: 14,
  background: "#8B5E3C",
  border: "none",
  fontWeight: 600,
};

export default Login;