import {
  Form,
  Input,
  Button,
  Card,
  message,
  Typography,
  Divider,
  Select,
} from "antd";
import {
  MailOutlined,
  LockOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { supabase } from "../supabaseClient";
import { useNavigate, Link } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

function Register() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async ({ email, password, role }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        message.error(error.message);
        return;
      }

      if (!data?.user) {
        message.error("Foydalanuvchi yaratilmadi");
        return;
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: data.user.id,
          role,
        });

      if (profileError) {
        message.error(profileError.message);
        return;
      }

      message.success("Ro‘yxatdan muvaffaqiyatli o‘tildi!");

      form.resetFields();

      if (role === "seller") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }

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

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
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

          <Form.Item
            name="role"
            label={<span style={{ color: "#fff" }}>Akkount turi</span>}
            initialValue="user"
          >
            <Select size="large">
              <Option value="user">Tourist / Buyer</Option>
              <Option value="seller">Seller</Option>
            </Select>
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

        <Divider />

        <div style={{ textAlign: "center" }}>
          <Link to="/login" style={{ color: "#fff" }}>
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
};

export default Register;