import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

import {
  Row,
  Col,
  Typography,
  Button,
  Card,
  Spin,
  message,
  Divider,
  Tag,
  Space,
} from "antd";

import {
  ShoppingCartOutlined,
  FireOutlined,
  StarFilled,
  TruckOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.log(error);
      message.error("Mahsulot topilmadi");
    } else {
      setProduct(data);
    }

    setLoading(false);
  };

  const addToCart = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        message.error("Login qiling");
        return;
      }

      const { data: existing } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_id", product.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("cart")
          .update({
            quantity: existing.quantity + 1,
          })
          .eq("id", existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("cart")
          .insert([
            {
              user_id: user.id,
              product_id: product.id,
              quantity: 1,
            },
          ]);

        if (error) throw error;
      }

      message.success("Savatga qo‘shildi 🔥");

    } catch (err) {
      console.log(err);
      message.error("Xatolik yuz berdi");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#111",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #0d0d0d 0%, #151515 45%, #2d1d13 100%)",
        padding: "50px 30px 100px",
      }}
    >
      <div
        style={{
          maxWidth: 1450,
          margin: "0 auto",
        }}
      >
        <Row gutter={[40, 40]}>
          {/* IMAGE */}
          <Col xs={24} lg={13}>
            <Card
              style={{
                borderRadius: 36,
                overflow: "hidden",
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
                border:
                  "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
                boxShadow:
                  "0 20px 55px rgba(0,0,0,0.35)",
              }}
              bodyStyle={{
                padding: 20,
              }}
            >
              <img
                src={product.image}
                alt={product.title}
                style={{
                  width: "100%",
                  height: 650,
                  objectFit: "cover",
                  borderRadius: 28,
                }}
              />
            </Card>
          </Col>

          {/* INFO */}
          <Col xs={24} lg={11}>
            <Space
              direction="vertical"
              size={22}
              style={{ width: "100%" }}
            >
              {/* TAG */}
              <Tag
                icon={<FireOutlined />}
                style={{
                  width: "fit-content",
                  background: "#8B5E3C",
                  color: "#fff",
                  border: "none",
                  borderRadius: 14,
                  padding: "8px 18px",
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                Premium Handmade
              </Tag>

              {/* TITLE */}
              <Title
                style={{
                  color: "#fff",
                  fontSize: 52,
                  fontWeight: 800,
                  lineHeight: 1.1,
                  marginBottom: 0,
                }}
              >
                {product.title}
              </Title>

              {/* RATING */}
              <Space size={4}>
                <StarFilled style={{ color: "#faad14" }} />
                <StarFilled style={{ color: "#faad14" }} />
                <StarFilled style={{ color: "#faad14" }} />
                <StarFilled style={{ color: "#faad14" }} />
                <StarFilled style={{ color: "#faad14" }} />

                <Text
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    marginLeft: 10,
                  }}
                >
                  5.0 Premium Rating
                </Text>
              </Space>

              {/* DESCRIPTION */}
              <Paragraph
                style={{
                  color: "rgba(255,255,255,0.72)",
                  fontSize: 17,
                  lineHeight: 1.9,
                  marginTop: 10,
                }}
              >
                {product.description ||
                  "Premium qo‘lda tayyorlangan eksklyuziv mahsulot. Yuqori sifatli materiallardan tayyorlangan va professional hunarmandlar tomonidan ishlab chiqilgan."}
              </Paragraph>

              {/* PRICE */}
              <div>
                <Text
                  style={{
                    color: "rgba(255,255,255,0.55)",
                    fontSize: 15,
                  }}
                >
                  Premium Price
                </Text>

                <Title
                  style={{
                    color: "#8B5E3C",
                    fontSize: 56,
                    margin: 0,
                    fontWeight: 800,
                  }}
                >
                  ${product.price}
                </Title>
              </div>

              <Divider
                style={{
                  borderColor:
                    "rgba(255,255,255,0.08)",
                }}
              />

              {/* FEATURES */}
              <Row gutter={[18, 18]}>
                <Col xs={24} md={8}>
                  <Card style={featureCard}>
                    <TruckOutlined
                      style={featureIcon}
                    />

                    <Text style={featureText}>
                      Fast Delivery
                    </Text>
                  </Card>
                </Col>

                <Col xs={24} md={8}>
                  <Card style={featureCard}>
                    <SafetyCertificateOutlined
                      style={featureIcon}
                    />

                    <Text style={featureText}>
                      Premium Quality
                    </Text>
                  </Card>
                </Col>

                <Col xs={24} md={8}>
                  <Card style={featureCard}>
                    <FireOutlined
                      style={featureIcon}
                    />

                    <Text style={featureText}>
                      Handmade
                    </Text>
                  </Card>
                </Col>
              </Row>

              {/* BUTTON */}
              <Button
                type="primary"
                size="large"
                icon={<ShoppingCartOutlined />}
                onClick={addToCart}
                style={{
                  marginTop: 20,
                  height: 64,
                  borderRadius: 20,
                  background:
                    "linear-gradient(145deg, #8B5E3C, #b07a4f)",
                  border: "none",
                  fontWeight: 700,
                  fontSize: 18,
                  boxShadow:
                    "0 18px 40px rgba(139,94,60,0.45)",
                }}
              >
                Add To Cart
              </Button>

              {/* EXTRA */}
              <Card
                style={{
                  marginTop: 20,
                  borderRadius: 28,
                  background:
                    "rgba(255,255,255,0.05)",
                  border:
                    "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(18px)",
                }}
              >
                <Space
                  direction="vertical"
                  size={16}
                  style={{ width: "100%" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                    }}
                  >
                    <Text
                      style={{
                        color:
                          "rgba(255,255,255,0.65)",
                      }}
                    >
                      Category
                    </Text>

                    <Text style={{ color: "#fff" }}>
                      Premium Handmade
                    </Text>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                    }}
                  >
                    <Text
                      style={{
                        color:
                          "rgba(255,255,255,0.65)",
                      }}
                    >
                      Delivery
                    </Text>

                    <Text style={{ color: "#fff" }}>
                      2-4 days
                    </Text>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                    }}
                  >
                    <Text
                      style={{
                        color:
                          "rgba(255,255,255,0.65)",
                      }}
                    >
                      Warranty
                    </Text>

                    <Text style={{ color: "#fff" }}>
                      Premium Support
                    </Text>
                  </div>
                </Space>
              </Card>
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  );
}

const featureCard = {
  borderRadius: 24,
  textAlign: "center",
  background:
    "rgba(255,255,255,0.05)",
  border:
    "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(18px)",
};

const featureIcon = {
  fontSize: 30,
  color: "#8B5E3C",
  marginBottom: 14,
};

const featureText = {
  color: "#fff",
  fontWeight: 600,
};

export default ProductDetails;