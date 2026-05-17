import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import {
  Card,
  Button,
  Row,
  Col,
  message,
  Popconfirm,
  Typography,
  Empty,
  Space,
  Tag,
} from "antd";
import {
  DeleteOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

function SellerProducts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMine();
  }, []);

  const fetchMine = async () => {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
    } else {
      setItems(data || []);
    }

    setLoading(false);
  };

  const handleDelete = async (id, imageUrl) => {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) throw error;

      if (imageUrl) {
        const fileName = imageUrl.split("/").pop();

        await supabase.storage
          .from("products")
          .remove([fileName]);
      }

      message.success("Mahsulot o‘chirildi");

      setItems((prev) => prev.filter((item) => item.id !== id));

    } catch (err) {
      console.log(err);
      message.error("O‘chirishda xatolik");
    }
  };

  if (!loading && items.length === 0) {
    return (
      <Card
        style={{
          borderRadius: 24,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
        }}
      >
        <Empty
          description={
            <span style={{ color: "#FFFFFF" }}>
              Hozircha mahsulot qo‘shilmagan
            </span>
          }
        />
      </Card>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title
          level={3}
          style={{
            color: "#FFFFFF",
            marginBottom: 8,
          }}
        >
          Mening mahsulotlarim
        </Title>

        <Text
          style={{
            color: "rgba(255,255,255,0.65)",
          }}
        >
          Marketplace’dagi barcha aktiv listinglaringiz
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        {items.map((product) => (
          <Col
            key={product.id}
            xs={24}
            sm={12}
            md={8}
            lg={6}
          >
            <Card
              hoverable
              cover={
                <img
                  src={product.image}
                  alt={product.title}
                  style={{
                    height: 240,
                    objectFit: "cover",
                  }}
                />
              }
              style={{
                borderRadius: 24,
                overflow: "hidden",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(18px)",
                boxShadow: "0 18px 45px rgba(0,0,0,0.35)",
              }}
            >
              <Space
                direction="vertical"
                size={10}
                style={{ width: "100%" }}
              >
                <Tag
                  color="gold"
                  style={{
                    borderRadius: 10,
                    padding: "6px 12px",
                    fontWeight: 600,
                    width: "fit-content",
                  }}
                >
                  ACTIVE
                </Tag>

                <Title
                  level={4}
                  style={{
                    color: "#FFFFFF",
                    margin: 0,
                  }}
                >
                  {product.title}
                </Title>

                <Text
                  style={{
                    color: "#8B5E3C",
                    fontSize: 22,
                    fontWeight: 700,
                  }}
                >
                  ${product.price}
                </Text>

                <Popconfirm
                  title="Mahsulotni o‘chirasizmi?"
                  okText="Ha"
                  cancelText="Yo‘q"
                  onConfirm={() =>
                    handleDelete(product.id, product.image)
                  }
                >
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    block
                    style={{
                      height: 46,
                      borderRadius: 14,
                      fontWeight: 600,
                    }}
                  >
                    Delete
                  </Button>
                </Popconfirm>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default SellerProducts;