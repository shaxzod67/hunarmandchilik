import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Empty,
  message,
  Spin,
} from "antd";

const { Title, Text } = Typography;

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        message.error("Login qiling");
        return;
      }

      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          products (
            title,
            price,
            image
          )
        `)
        .eq("buyer_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setOrders(data || []);
    } catch (err) {
      console.log(err);
      message.error("Buyurtmalarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "orange";
      case "accepted":
        return "blue";
      case "shipped":
        return "purple";
      case "delivered":
        return "green";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#111",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111",
        padding: "40px",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <Title style={{ color: "#fff" }}>
          Mening Buyurtmalarim
        </Title>

        {orders.length === 0 ? (
          <Empty
            description={
              <span style={{ color: "#fff" }}>
                Buyurtmalar yo‘q
              </span>
            }
          />
        ) : (
          <Row gutter={[24, 24]}>
            {orders.map((order) => (
              <Col xs={24} md={12} lg={8} key={order.id}>
                <Card
                  style={{
                    borderRadius: 20,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  cover={
                    <img
                      src={order.products?.image}
                      alt={order.products?.title}
                      style={{
                        height: 240,
                        objectFit: "cover",
                      }}
                    />
                  }
                >
                  <Title level={4} style={{ color: "#fff" }}>
                    {order.products?.title}
                  </Title>

                  <Text style={{ color: "#8B5E3C" }}>
                    ${order.products?.price}
                  </Text>

                  <br />
                  <br />

                  <Text style={{ color: "#fff" }}>
                    Soni: {order.quantity}
                  </Text>

                  <br />

                  <Text style={{ color: "#fff" }}>
                    Telefon: {order.buyer_phone}
                  </Text>

                  <br />
                  <br />

                  <Tag color={getStatusColor(order.status)}>
                    {order.status}
                  </Tag>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default MyOrders;