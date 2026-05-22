import { useState, useEffect } from "react";
import AddProduct from "../components/AddProduct";
import SellerProducts from "../components/SellerProducts";
import { supabase } from "../supabaseClient";
 
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
  Progress,
  Divider,
} from "antd";
 
import {
  ShoppingOutlined,
  AppstoreAddOutlined,
  DollarOutlined,
  UserOutlined,
  NotificationOutlined,
  RiseOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FireOutlined,
  BulbOutlined,
  MoonOutlined,
} from "@ant-design/icons";
 
const { Content } = Layout;
const { Title, Text } = Typography;
 
/* ─── Static styles (don't depend on darkMode) ─── */
const iconBoxBlue = {
  width: 58, height: 58, borderRadius: 18,
  background: "linear-gradient(145deg, #2563eb, #60a5fa)",
  display: "flex", justifyContent: "center", alignItems: "center",
};
const iconBoxPurple = {
  width: 58, height: 58, borderRadius: 18,
  background: "linear-gradient(145deg, #7c3aed, #a78bfa)",
  display: "flex", justifyContent: "center", alignItems: "center",
};
const iconBoxOrange = {
  width: 58, height: 58, borderRadius: 18,
  background: "linear-gradient(145deg, #f59e0b, #fbbf24)",
  display: "flex", justifyContent: "center", alignItems: "center",
};
const iconBoxGreen = {
  width: 58, height: 58, borderRadius: 18,
  background: "linear-gradient(145deg, #22c55e, #4ade80)",
  display: "flex", justifyContent: "center", alignItems: "center",
};
 
/* ─── Dynamic styles (depend on darkMode) ─── */
const cardBase = (darkMode) => ({
  background: darkMode
    ? "linear-gradient(145deg, rgba(30,41,59,0.95), rgba(15,23,42,0.92))"
    : "rgba(255,255,255,0.92)",
  border: darkMode
    ? "1px solid rgba(255,255,255,0.08)"
    : "1px solid rgba(0,0,0,0.05)",
  backdropFilter: "blur(24px)",
});
 
const heroCard = (darkMode) => ({
  ...cardBase(darkMode),
  borderRadius: 34,
  boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
});
 
const analyticsCard = (darkMode) => ({
  ...cardBase(darkMode),
  borderRadius: 30,
  boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
});
 
const performanceCard = (darkMode) => ({
  ...cardBase(darkMode),
  borderRadius: 34,
  marginBottom: 32,
});
 
const mainPanel = (darkMode) => ({
  ...cardBase(darkMode),
  borderRadius: 34,
});
 
const miniAnalytics = (darkMode) => ({
  borderRadius: 22,
  textAlign: "center",
  background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.92)",
  border: darkMode
    ? "1px solid rgba(255,255,255,0.06)"
    : "1px solid rgba(0,0,0,0.05)",
});
 
const rightPerformance = (darkMode) => ({
  borderRadius: 28,
  background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.92)",
  border: darkMode
    ? "1px solid rgba(255,255,255,0.06)"
    : "1px solid rgba(0,0,0,0.05)",
});
 
const analyticsTitle = (darkMode) => ({
  color: darkMode ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.65)",
  fontSize: 15,
});
 
const analyticsValue = (darkMode) => ({
  color: darkMode ? "#fff" : "#111",
  fontWeight: 800,
});
 
const mutedText = (darkMode) => ({
  color: darkMode ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)",
});
 
/* ─── Component ─── */
function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [darkMode, setDarkMode] = useState(true);
  const [analytics, setAnalytics] = useState({
    revenue: 0,
    totalOrders: 0,
    pending: 0,
    delivered: 0,
    products: 0,
  });
 
  useEffect(() => {
    fetchAnalytics();
  }, [refreshKey]);
 
  const fetchAnalytics = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
 
    const { data: products } = await supabase
      .from("products")
      .select("*")
      .eq("user_id", user.id);
 
    const { data: orders } = await supabase
      .from("orders")
      .select("*, products(price)")
      .eq("seller_id", user.id);
 
    const totalRevenue =
      orders?.reduce((acc, order) => acc + (order.products?.price || 0) * order.quantity, 0) ?? 0;
 
    setAnalytics({
      revenue: totalRevenue,
      totalOrders: orders?.length ?? 0,
      pending: orders?.filter((o) => o.status === "pending").length ?? 0,
      delivered: orders?.filter((o) => o.status === "delivered").length ?? 0,
      products: products?.length ?? 0,
    });
  };
 
  const pendingPercent = analytics.totalOrders
    ? Math.round((analytics.pending / analytics.totalOrders) * 100)
    : 0;
 
  const tabItems = [
    {
      key: "1",
      label: (
        <span style={{ color: "#fff", fontWeight: 600 }}>
          <AppstoreAddOutlined /> Mahsulot qo'shish
        </span>
      ),
      children: <AddProduct onAdded={() => setRefreshKey((k) => k + 1)} />,
    },
    {
      key: "2",
      label: (
        <span style={{ color: "#fff", fontWeight: 600 }}>
          <ShoppingOutlined /> Mening mahsulotlarim
        </span>
      ),
      children: <SellerProducts key={refreshKey} />,
    },
  ];
 
  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: darkMode
          ? "linear-gradient(180deg, #0b1120 0%, #0f172a 40%, #111827 100%)"
          : "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
        padding: 35,
      }}
    >
      <Content style={{ maxWidth: 1450, width: "100%", margin: "0 auto" }}>
 
        {/* ── HERO ── */}
        <Card style={heroCard(darkMode)} bodyStyle={{ padding: 35 }}>
          <Row justify="space-between" align="middle" gutter={[24, 24]}>
            <Col>
              <Space size={18}>
                <Avatar
                  size={82}
                  icon={<UserOutlined />}
                  style={{
                    background: "linear-gradient(145deg, #2563eb, #60a5fa)",
                    boxShadow: "0 15px 35px rgba(37,99,235,0.45)",
                  }}
                />
                <div>
                  <Space align="center" size={10}>
                    <FireOutlined style={{ color: "#f59e0b", fontSize: 22 }} />
                    <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 15 }}>
                      Premium Seller Panel
                    </Text>
                  </Space>
                  <Title level={1} style={{ color: "#fff", margin: "6px 0 4px", fontWeight: 800 }}>
                    Seller Dashboard
                  </Title>
                  <Text style={{ color: "rgba(255,255,255,0.68)", fontSize: 16 }}>
                    Marketplace faoliyatingizni professional boshqaring
                  </Text>
                </div>
              </Space>
            </Col>
 
            <Col>
              <Button
                onClick={() => setDarkMode((d) => !d)}
                size="large"
                style={{
                  marginRight: 12,
                  borderRadius: 14,
                  height: 50,
                  background: darkMode ? "#1e293b" : "#fff",
                  color: darkMode ? "#fff" : "#111",
                  border: "none",
                }}
              >
                {darkMode ? <BulbOutlined /> : <MoonOutlined />}
              </Button>
              <Button
                type="primary"
                size="large"
                icon={<NotificationOutlined />}
                style={{
                  height: 54,
                  borderRadius: 18,
                  paddingInline: 28,
                  border: "none",
                  background: "linear-gradient(145deg, #2563eb, #60a5fa)",
                  fontWeight: 700,
                  boxShadow: "0 12px 30px rgba(37,99,235,0.35)",
                }}
              >
                Notifications
              </Button>
            </Col>
          </Row>
        </Card>
 
        {/* ── ANALYTICS ── */}
        <Row gutter={[24, 24]} style={{ marginTop: 32, marginBottom: 32 }}>
          <Col xs={24} md={12} lg={6}>
            <Card style={analyticsCard(darkMode)}>
              <Space direction="vertical" size={14} style={{ width: "100%" }}>
                <div style={iconBoxBlue}>
                  <DollarOutlined style={{ fontSize: 26, color: "#fff" }} />
                </div>
                <Statistic
                  title={<span style={analyticsTitle(darkMode)}>Revenue</span>}
                  value={analytics.revenue}
                  prefix="$"
                  valueStyle={analyticsValue(darkMode)}
                />
                <Text style={mutedText(darkMode)}>Umumiy daromad</Text>
              </Space>
            </Card>
          </Col>
 
          <Col xs={24} md={12} lg={6}>
            <Card style={analyticsCard(darkMode)}>
              <Space direction="vertical" size={14} style={{ width: "100%" }}>
                <div style={iconBoxPurple}>
                  <ShoppingOutlined style={{ fontSize: 26, color: "#fff" }} />
                </div>
                <Statistic
                  title={<span style={analyticsTitle(darkMode)}>Orders</span>}
                  value={analytics.totalOrders}
                  valueStyle={analyticsValue(darkMode)}
                />
                <Text style={mutedText(darkMode)}>Barcha buyurtmalar</Text>
              </Space>
            </Card>
          </Col>
 
          <Col xs={24} md={12} lg={6}>
            <Card style={analyticsCard(darkMode)}>
              <Space direction="vertical" size={14} style={{ width: "100%" }}>
                <div style={iconBoxOrange}>
                  <ClockCircleOutlined style={{ fontSize: 26, color: "#fff" }} />
                </div>
                <Statistic
                  title={<span style={analyticsTitle(darkMode)}>Pending</span>}
                  value={analytics.pending}
                  valueStyle={analyticsValue(darkMode)}
                />
                <Progress percent={pendingPercent} showInfo={false} strokeColor="#f59e0b" />
              </Space>
            </Card>
          </Col>
 
          <Col xs={24} md={12} lg={6}>
            <Card style={analyticsCard(darkMode)}>
              <Space direction="vertical" size={14} style={{ width: "100%" }}>
                <div style={iconBoxGreen}>
                  <CheckCircleOutlined style={{ fontSize: 26, color: "#fff" }} />
                </div>
                <Statistic
                  title={<span style={analyticsTitle(darkMode)}>Products</span>}
                  value={analytics.products}
                  valueStyle={analyticsValue(darkMode)}
                />
                <Text style={mutedText(darkMode)}>Aktiv mahsulotlar</Text>
              </Space>
            </Card>
          </Col>
        </Row>
 
        {/* ── PERFORMANCE ── */}
        <Card style={performanceCard(darkMode)} bodyStyle={{ padding: 32 }}>
          <Row justify="space-between" align="middle" gutter={[20, 20]}>
            <Col xs={24} lg={16}>
              <Space direction="vertical" size={18} style={{ width: "100%" }}>
                <Space align="center">
                  <RiseOutlined style={{ fontSize: 24, color: "#22c55e" }} />
                  <Title level={2} style={{ color: darkMode ? "#fff" : "#111", margin: 0 }}>
                    Marketplace Performance
                  </Title>
                </Space>
 
                <Text style={{ color: darkMode ? "rgba(255,255,255,0.68)" : "rgba(0,0,0,0.68)", fontSize: 16, lineHeight: 1.8 }}>
                  Seller faoliyatingiz premium marketplace standartlari bo'yicha
                  kuzatilmoqda va analytics ma'lumotlari realtime tarzda yangilanmoqda.
                </Text>
 
                <Divider style={{ borderColor: "rgba(255,255,255,0.08)" }} />
 
                <Row gutter={[18, 18]}>
                  <Col xs={24} md={8}>
                    <Card style={miniAnalytics(darkMode)}>
                      <Title level={3} style={{ color: "#22c55e", margin: 0 }}>98%</Title>
                      <Text style={{ color: "rgba(255,255,255,0.65)" }}>Customer Satisfaction</Text>
                    </Card>
                  </Col>
                  <Col xs={24} md={8}>
                    <Card style={miniAnalytics(darkMode)}>
                      <Title level={3} style={{ color: "#60a5fa", margin: 0 }}>24/7</Title>
                      <Text style={{ color: "rgba(255,255,255,0.65)" }}>Seller Activity</Text>
                    </Card>
                  </Col>
                  <Col xs={24} md={8}>
                    <Card style={miniAnalytics(darkMode)}>
                      <Title level={3} style={{ color: "#f59e0b", margin: 0 }}>Premium</Title>
                      <Text style={{ color: "rgba(255,255,255,0.65)" }}>Marketplace</Text>
                    </Card>
                  </Col>
                </Row>
              </Space>
            </Col>
 
            <Col xs={24} lg={8}>
              <Card style={rightPerformance(darkMode)}>
                <Space direction="vertical" size={22} style={{ width: "100%" }}>
                  <div>
                    <Text style={{ color: "rgba(255,255,255,0.65)" }}>Sales Performance</Text>
                    <Progress percent={86} strokeColor="#22c55e" />
                  </div>
                  <div>
                    <Text style={{ color: "rgba(255,255,255,0.65)" }}>Product Growth</Text>
                    <Progress percent={72} strokeColor="#60a5fa" />
                  </div>
                  <div>
                    <Text style={{ color: "rgba(255,255,255,0.65)" }}>Customer Reach</Text>
                    <Progress percent={91} strokeColor="#f59e0b" />
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
        </Card>
 
        {/* ── MAIN TABS ── */}
        <Card style={mainPanel(darkMode)} bodyStyle={{ padding: 28 }}>
          <Tabs defaultActiveKey="1" items={tabItems} size="large" />
        </Card>
 
      </Content>
    </Layout>
  );
}
 
export default Dashboard;