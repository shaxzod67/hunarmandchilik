import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Empty,
  message,
  InputNumber,
  Space,
  Divider,
  Tag,
  Modal,
  Form,
  Input,
} from "antd";

import {
  DeleteOutlined,
  ShoppingCartOutlined,
  FireOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

function Cart() {
  const [cart, setCart] = useState([]);

  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("cart")
      .select(
        `
        *,
        products (
  id,
  title,
  price,
  image,
  user_id
)
      `
      )
      .eq("user_id", user.id);

    if (error) {
      console.log(error);
      return;
    }

    setCart(data || []);
  };

  const removeItem = async (id) => {
    const { error } = await supabase.from("cart").delete().eq("id", id);

    if (error) {
      message.error("O‘chirishda xatolik");
      return;
    }

    setCart((prev) => prev.filter((item) => item.id !== id));

    message.success("Savatdan o‘chirildi");
  };

  const updateQuantity = async (id, quantity) => {
    const { error } = await supabase
      .from("cart")
      .update({ quantity })
      .eq("id", id);

    if (error) return;

    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const totalPrice = cart.reduce((acc, item) => {
    return acc + item.products.price * item.quantity;
  }, 0);
  const handleCheckout = async (values) => {
    try {
      setCheckoutLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        message.error("Login qiling");
        return;
      }

      for (const item of cart) {
        const { error } = await supabase.from("orders").insert([
          {
            product_id: item.product_id,
            buyer_id: user.id,
            seller_id: item.products.user_id,

            buyer_name: values.full_name,
            buyer_phone: values.phone,
            buyer_address: values.address,

            quantity: item.quantity,
            status: "pending",
          },
        ]);

        if (error) throw error;
      }

      const { error: deleteError } = await supabase
        .from("cart")
        .delete()
        .eq("user_id", user.id);

      if (deleteError) throw deleteError;

      setCart([]);

      setCheckoutOpen(false);

      form.resetFields();

      message.success("Buyurtma muvaffaqiyatli yuborildi 🔥");
    } catch (err) {
      console.log(err);

      message.error("Checkout xatoligi");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #0d0d0d 0%, #141414 40%, #2d1d13 100%)",
        padding: "50px 30px 100px",
      }}
    >
      <div
        style={{
          maxWidth: 1450,
          margin: "0 auto",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            marginBottom: 40,
          }}
        >
          <Space align="center">
            <div
              style={{
                width: 70,
                height: 70,
                borderRadius: 24,
                background: "linear-gradient(145deg, #8B5E3C, #b07a4f)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 15px 35px rgba(139,94,60,0.45)",
              }}
            >
              <ShoppingCartOutlined
                style={{
                  fontSize: 32,
                  color: "#fff",
                }}
              />
            </div>

            <div>
              <Title
                style={{
                  color: "#fff",
                  margin: 0,
                  fontSize: 42,
                  fontWeight: 800,
                }}
              >
                Premium Cart
              </Title>

              <Text
                style={{
                  color: "rgba(255,255,255,0.65)",
                  fontSize: 16,
                }}
              >
                Premium marketplace savatchasi
              </Text>
            </div>
          </Space>
        </div>

        {/* EMPTY */}
        {cart.length === 0 ? (
          <Card
            style={{
              borderRadius: 30,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
            }}
          >
            <Empty
              description={
                <span
                  style={{
                    color: "#fff",
                    fontSize: 18,
                  }}
                >
                  Savatcha hozircha bo‘sh
                </span>
              }
            />
          </Card>
        ) : (
          <Row gutter={[30, 30]}>
            {/* LEFT */}
            <Col xs={24} lg={17}>
              <Space direction="vertical" size={24} style={{ width: "100%" }}>
                {cart.map((item) => (
                  <Card
                    key={item.id}
                    style={{
                      borderRadius: 30,
                      overflow: "hidden",
                      background:
                        "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
                      border: "1px solid rgba(255,255,255,0.08)",
                      backdropFilter: "blur(20px)",
                      boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
                    }}
                    bodyStyle={{
                      padding: 26,
                    }}
                  >
                    <Row gutter={[24, 24]} align="middle">
                      {/* IMAGE */}
                      <Col xs={24} md={6}>
                        <div
                          style={{
                            overflow: "hidden",
                            borderRadius: 24,
                          }}
                        >
                          <img
                            src={item.products.image}
                            alt={item.products.title}
                            style={{
                              width: "100%",
                              height: 210,
                              objectFit: "cover",
                              borderRadius: 24,
                              transition: "0.4s",
                              boxShadow: "0 15px 35px rgba(0,0,0,0.35)",
                            }}
                          />
                        </div>
                      </Col>

                      {/* INFO */}
                      <Col xs={24} md={10}>
                        <Tag
                          icon={<FireOutlined />}
                          style={{
                            background: "#8B5E3C",
                            color: "#fff",
                            border: "none",
                            borderRadius: 12,
                            padding: "6px 14px",
                            marginBottom: 16,
                            fontWeight: 600,
                          }}
                        >
                          Premium Product
                        </Tag>

                        <Title
                          level={3}
                          style={{
                            color: "#fff",
                            marginBottom: 10,
                          }}
                        >
                          {item.products.title}
                        </Title>

                        <Text
                          style={{
                            color: "rgba(255,255,255,0.65)",
                            fontSize: 15,
                            lineHeight: 1.7,
                          }}
                        >
                          Premium marketplace uchun tanlangan eksklyuziv
                          mahsulot.
                        </Text>

                        <Divider
                          style={{
                            borderColor: "rgba(255,255,255,0.08)",
                          }}
                        />

                        <Title
                          level={2}
                          style={{
                            color: "#8B5E3C",
                            margin: 0,
                            fontWeight: 800,
                          }}
                        >
                          ${item.products.price}
                        </Title>
                      </Col>

                      {/* ACTIONS */}
                      <Col xs={24} md={8}>
                        <Space
                          direction="vertical"
                          size={18}
                          style={{ width: "100%" }}
                        >
                          <div>
                            <Text
                              style={{
                                color: "rgba(255,255,255,0.65)",
                              }}
                            >
                              Quantity
                            </Text>

                            <InputNumber
                              min={1}
                              value={item.quantity}
                              size="large"
                              style={{
                                width: "100%",
                                marginTop: 10,
                                height: 48,
                              }}
                              onChange={(value) =>
                                updateQuantity(item.id, value)
                              }
                            />
                          </div>

                          <Card
                            style={{
                              borderRadius: 18,
                              background: "rgba(255,255,255,0.04)",
                              border: "1px solid rgba(255,255,255,0.06)",
                            }}
                          >
                            <Text
                              style={{
                                color: "rgba(255,255,255,0.65)",
                              }}
                            >
                              Total
                            </Text>

                            <Title
                              level={3}
                              style={{
                                color: "#fff",
                                marginTop: 10,
                                marginBottom: 0,
                              }}
                            >
                              ${item.products.price * item.quantity}
                            </Title>
                          </Card>

                          <Button
                            danger
                            icon={<DeleteOutlined />}
                            size="large"
                            block
                            style={{
                              height: 50,
                              borderRadius: 16,
                              fontWeight: 600,
                            }}
                            onClick={() => removeItem(item.id)}
                          >
                            Remove Product
                          </Button>
                        </Space>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </Space>
            </Col>

            {/* RIGHT */}
            <Col xs={24} lg={7}>
              <Card
                style={{
                  borderRadius: 32,
                  position: "sticky",
                  top: 30,
                  background: "linear-gradient(145deg, #1a1a1a, #111)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
                }}
                bodyStyle={{
                  padding: 32,
                }}
              >
                <Title
                  level={2}
                  style={{
                    color: "#fff",
                    marginBottom: 25,
                  }}
                >
                  Checkout
                </Title>

                <Space direction="vertical" size={22} style={{ width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        color: "rgba(255,255,255,0.65)",
                      }}
                    >
                      Products
                    </Text>

                    <Text style={{ color: "#fff" }}>{cart.length}</Text>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        color: "rgba(255,255,255,0.65)",
                      }}
                    >
                      Delivery
                    </Text>

                    <Text style={{ color: "#fff" }}>Free</Text>
                  </div>

                  <Divider
                    style={{
                      borderColor: "rgba(255,255,255,0.08)",
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Title
                      level={3}
                      style={{
                        color: "#fff",
                        margin: 0,
                      }}
                    >
                      Total
                    </Title>

                    <Title
                      level={2}
                      style={{
                        color: "#8B5E3C",
                        margin: 0,
                        fontWeight: 800,
                      }}
                    >
                      ${totalPrice}
                    </Title>
                  </div>

                  <Button
                    type="primary"
                    onClick={() => setCheckoutOpen(true)}
                    size="large"
                    icon={<ArrowRightOutlined />}
                    style={{
                      marginTop: 10,
                      height: 60,
                      borderRadius: 18,
                      background: "linear-gradient(145deg, #8B5E3C, #b07a4f)",
                      border: "none",
                      fontWeight: 700,
                      fontSize: 17,
                      boxShadow: "0 15px 35px rgba(139,94,60,0.45)",
                    }}
                  >
                    Proceed To Checkout
                  </Button>

                  <Text
                    style={{
                      color: "rgba(255,255,255,0.45)",
                      textAlign: "center",
                      display: "block",
                      marginTop: 10,
                    }}
                  >
                    Secure premium checkout system
                  </Text>
                </Space>
              </Card>
            </Col>
          </Row>
        )}
      </div>
      <Modal
        open={checkoutOpen}
        onCancel={() => setCheckoutOpen(false)}
        footer={null}
        title="Checkout Information"
      >
        <Form form={form} layout="vertical" onFinish={handleCheckout}>
          <Form.Item
            name="full_name"
            label="Full Name"
            rules={[{ required: true }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
            <Input size="large" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Button
            htmlType="submit"
            type="primary"
            loading={checkoutLoading}
            block
            size="large"
            style={{
              height: 54,
              borderRadius: 16,
              background: "linear-gradient(145deg, #8B5E3C, #b07a4f)",
              border: "none",
              fontWeight: 700,
            }}
          >
            Place Order
          </Button>
        </Form>
      </Modal>
    </div>
  );
}

export default Cart;
