import { useState } from "react";
import AddProduct from "../components/AddProduct";
import SellerProducts from "../components/SellerProducts";
import {
  Tabs,
  Layout,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Avatar,
  Space,
  Button,
} from "antd";
import {
  ShoppingOutlined,
  AppstoreAddOutlined,
  DollarOutlined,
  UserOutlined,
  NotificationOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
const { Title, Text } = Typography;

function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  const items = [
    {
      key: "1",
      label: (
        <span>
          <AppstoreAddOutlined />
          Mahsulot qo‘shish
        </span>
      ),
      children: (
        <AddProduct onAdded={() => setRefreshKey((k) => k + 1)} />
      ),
    },
    {
      key: "2",
      label: (
        <span>
          <ShoppingOutlined />
          Mening mahsulotlarim
        </span>
      ),
      children: <SellerProducts key={refreshKey} />,
    },
  ];

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #0f172a 0%, #020617 70%)",
        padding: "30px",
      }}
    >
      <Content>
        {/* TOP HEADER */}
        <Card
          style={{
            borderRadius: 28,
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.12)",
            marginBottom: 30,
            boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          }}
        >
          <Row justify="space-between" align="middle">
            <Col>
              <Space size={16}>
                <Avatar
                  size={70}
                  icon={<UserOutlined />}
                  style={{
                    background:
                      "linear-gradient(135deg, #1677ff, #69b1ff)",
                  }}
                />

                <div>
                  <Title
                    level={2}
                    style={{
                      color: "white",
                      margin: 0,
                    }}
                  >
                    Seller Dashboard
                  </Title>

                  <Text
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      fontSize: 16,
                    }}
                  >
                    Hunarmand mahsulotlaringizni boshqaring
                  </Text>
                </div>
              </Space>
            </Col>

            <Col>
              <Button
                type="primary"
                size="large"
                icon={<NotificationOutlined />}
                style={{
                  borderRadius: 14,
                  height: 50,
                  paddingInline: 24,
                }}
              >
                Bildirishnomalar
              </Button>
            </Col>
          </Row>
        </Card>

        {/* STATISTICS */}
        <Row gutter={[20, 20]} style={{ marginBottom: 30 }}>
          <Col xs={24} md={8}>
            <Card
              style={glassCard}
            >
              <Statistic
                title={<span style={statTitle}>Mahsulotlar</span>}
                value={12}
                prefix={<ShoppingOutlined />}
                valueStyle={statValue}
              />
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card
              style={glassCard}
            >
              <Statistic
                title={<span style={statTitle}>Buyurtmalar</span>}
                value={34}
                prefix={<AppstoreAddOutlined />}
                valueStyle={statValue}
              />
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card
              style={glassCard}
            >
              <Statistic
                title={<span style={statTitle}>Daromad</span>}
                value={1200}
                prefix={<DollarOutlined />}
                suffix="$"
                valueStyle={statValue}
              />
            </Card>
          </Col>
        </Row>

        {/* MAIN PANEL */}
        <Card
          style={{
            borderRadius: 28,
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(22px)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          }}
          bodyStyle={{
            padding: 28,
          }}
        >
          <Tabs
            defaultActiveKey="1"
            items={items}
            size="large"
          />
        </Card>
      </Content>
    </Layout>
  );
}

const glassCard = {
  borderRadius: 24,
  background: "rgba(255,255,255,0.07)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.1)",
  boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
};

const statTitle = {
  color: "rgba(255,255,255,0.7)",
  fontSize: 15,
};

const statValue = {
  color: "white",
};

export default Dashboard;