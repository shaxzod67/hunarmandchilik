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
  UserAddOutlined,
} from "@ant-design/icons";
import { supabase } from "../supabaseClient";
import { useNavigate, Link } from "react-router-dom";

const { Title, Text } = Typography;

function Register() {
  const navigate = useNavigate();

  const onFinish = async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        message.error(error.message);
        return;
      }

      const user = data.user;

      if (!user) {
        message.error("User topilmadi");
        return;
      }

      await supabase.from("profiles").insert([
        {
          id: user.id,
          role: "user",
        },
      ]);

      message.success("Ro‘yxatdan o‘tildi");
      navigate("/login");

    } catch (err) {
      console.log(err);
      message.error("Register xatoligi");
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
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <Title level={2} style={{ color: "#fff" }}>
            CraftMap Register
          </Title>
        </div>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            label={<span style={{ color: "#fff" }}>Email</span>}
            rules={[{ required: true }]}
          >
            <Input
              prefix={<MailOutlined />}
              size="large"
              style={inputStyle}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span style={{ color: "#fff" }}>Parol</span>}
            rules={[{ required: true }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              size="large"
              style={inputStyle}
            />
          </Form.Item>

          <Button
            htmlType="submit"
            type="primary"
            icon={<UserAddOutlined />}
            block
            style={submitBtn}
          >
            Register
          </Button>
        </Form>

        <Divider style={{ borderColor: "rgba(255,255,255,0.12)" }} />

        <div style={{ textAlign: "center" }}>
          <Link
            to="/login"
            style={{
              color: "#fff",
              fontWeight: 600,
            }}
          >
            Login
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

export default Register;