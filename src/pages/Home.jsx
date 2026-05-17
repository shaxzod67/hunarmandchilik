import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import {
  Card,
  Input,
  Typography,
  Row,
  Col,
  Empty,
  Button,
  Tag,
  Modal,
  Skeleton,
  Statistic,
  message,
  Form,
  InputNumber,
} from "antd";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  FireOutlined,
  ShopOutlined,
  StarOutlined,
  EyeOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      message.error("Mahsulotlarni yuklashda xatolik");
    } else {
      setProducts(data || []);
    }

    setLoading(false);
  };

  const filteredProducts = products.filter((product) =>
    product.title?.toLowerCase().includes(search.toLowerCase())
  );

  const openProduct = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const openCheckout = async (product) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      message.error("Buyurtma uchun login qiling");
      return;
    }

    if (product.user_id === user.id) {
      message.warning("O‘zingizning mahsulotingizni sotib olmaysiz");
      return;
    }

    setSelectedProduct(product);
    setCheckoutOpen(true);
  };

  const placeOrder = async (values) => {
    try {
      setOrderLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase
        .from("orders")
        .insert([
          {
            product_id: selectedProduct.id,
            buyer_id: user.id,
            seller_id: selectedProduct.user_id,
            buyer_name: values.full_name,
            buyer_phone: values.phone,
            buyer_address: values.address,
            quantity: values.quantity,
            status: "pending",
          },
        ]);

      if (error) throw error;

      message.success("Buyurtma muvaffaqiyatli yuborildi");
      form.resetFields();
      setCheckoutOpen(false);

    } catch (err) {
      console.log(err);
      message.error("Buyurtmada xatolik");
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #0d0d0d 0%, #151515 45%, #2d1d13 100%)",
        paddingBottom: 100,
      }}
    >      {/* HERO */}
    <section
      style={{
        maxWidth: 1400,
        margin: "0 auto",
        padding: "80px 30px 50px",
        textAlign: "center",
      }}
    >
      <Title
        style={{
          color: "#fff",
          fontSize: 56,
          fontWeight: 800,
          marginBottom: 10,
        }}
      >
        Premium Hunarmand
        <span style={{ color: "#8B5E3C" }}> Marketplace</span>
      </Title>

      <Text
        style={{
          color: "rgba(255,255,255,0.72)",
          fontSize: 18,
        }}
      >
        Mahalliy ustalarning eksklyuziv qo‘lda yasalgan mahsulotlari
      </Text>

      <div
        style={{
          maxWidth: 650,
          margin: "35px auto 0",
        }}
      >
        <Input
          size="large"
          prefix={<SearchOutlined style={{ color: "#8B5E3C" }} />}
          placeholder="Mahsulot qidiring..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            height: 60,
            borderRadius: 20,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#fff",
          }}
        />
      </div>
    </section>

    {/* STATS */}
    <section
      style={{
        maxWidth: 1400,
        margin: "0 auto",
        padding: "0 30px 40px",
      }}
    >
      <Row gutter={[20, 20]}>
        <Col xs={24} md={8}>
          <Card style={statCard}>
            <Statistic
              title={<span style={statTitle}>Mahsulotlar</span>}
              value={products.length}
              prefix={<ShopOutlined />}
              valueStyle={statValue}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card style={statCard}>
            <Statistic
              title={<span style={statTitle}>Premium</span>}
              value={99}
              suffix="%"
              prefix={<StarOutlined />}
              valueStyle={statValue}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card style={statCard}>
            <Statistic
              title={<span style={statTitle}>Trend</span>}
              value={24}
              suffix="/7"
              prefix={<FireOutlined />}
              valueStyle={statValue}
            />
          </Card>
        </Col>
      </Row>
    </section>

    {/* TAGS */}
    <section
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 12,
        flexWrap: "wrap",
        padding: "0 20px 50px",
      }}
    >
      <Tag style={tagStyle}>Kulolchilik</Tag>
      <Tag style={tagStyle}>Kashtachilik</Tag>
      <Tag style={tagStyle}>Zargarlik</Tag>
      <Tag style={tagStyle}>Yog‘och</Tag>
      <Tag style={tagStyle}>Milliy buyumlar</Tag>
    </section>

    {/* PRODUCTS */}
    <section
      style={{
        maxWidth: 1400,
        margin: "0 auto",
        padding: "0 30px",
      }}
    >
      <Title level={2} style={{ color: "#fff", marginBottom: 30 }}>
        So‘nggi mahsulotlar
      </Title>

      {loading ? (
        <Row gutter={[24, 24]}>
          {[1, 2, 3, 4].map((i) => (
            <Col xs={24} sm={12} md={8} lg={6} key={i}>
              <Card style={productCard}>
                <Skeleton active />
              </Card>
            </Col>
          ))}
        </Row>
      ) : filteredProducts.length === 0 ? (
        <Empty
          description={
            <span style={{ color: "#fff" }}>
              Mahsulot topilmadi
            </span>
          }
        />
      ) : (
        <Row gutter={[24, 24]}>
          {filteredProducts.map((product) => (
            <Col
              key={product.id}
              xs={24}
              sm={12}
              md={8}
              lg={6}
            >
              <Card
                hoverable
                style={productCard}
                bodyStyle={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
                cover={
                  <img
                    src={product.image}
                    alt={product.title}
                    style={{
                      height: 260,
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                }
              >
                <Tag
                  style={{
                    background: "#8B5E3C",
                    color: "#fff",
                    border: "none",
                    marginBottom: 10,
                    width: "fit-content",
                  }}
                >
                  Premium
                </Tag>

                <Title level={4} style={{ color: "#fff" }}>
                  {product.title}
                </Title>

                <Paragraph
                  ellipsis={{ rows: 2 }}
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    minHeight: 48,
                  }}
                >
                  {product.description || "Premium mahsulot"}
                </Paragraph>

                <Text
                  style={{
                    color: "#8B5E3C",
                    fontSize: 22,
                    fontWeight: 700,
                  }}
                >
                  ${product.price}
                </Text>

                <div style={{ marginTop: "auto" }}>
                  <Button
                    icon={<EyeOutlined />}
                    block
                    style={{
                      marginTop: 14,
                      height: 46,
                      borderRadius: 14,
                    }}
                    onClick={() => openProduct(product)}
                  >
                    Batafsil
                  </Button>

                  <Button
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    block
                    style={{
                      marginTop: 12,
                      height: 46,
                      borderRadius: 14,
                      background: "#8B5E3C",
                      border: "none",
                      fontWeight: 600,
                    }}
                    onClick={() => openCheckout(product)}
                  >
                    Sotib olish
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </section>    {/* PRODUCT DETAIL MODAL */}
      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={850}
      >
        {selectedProduct && (
          <Row gutter={30}>
            <Col xs={24} md={12}>
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                style={{
                  width: "100%",
                  borderRadius: 20,
                  height: 420,
                  objectFit: "cover",
                }}
              />
            </Col>

            <Col xs={24} md={12}>
              <Title>{selectedProduct.title}</Title>

              <Paragraph>
                {selectedProduct.description ||
                  "Premium hunarmand mahsuloti"}
              </Paragraph>

              <Title style={{ color: "#8B5E3C" }}>
                ${selectedProduct.price}
              </Title>

              <Button
                type="primary"
                block
                size="large"
                style={{
                  background: "#8B5E3C",
                  border: "none",
                  borderRadius: 14,
                  height: 50,
                }}
                onClick={() => {
                  setModalOpen(false);
                  openCheckout(selectedProduct);
                }}
              >
                Buyurtma berish
              </Button>
            </Col>
          </Row>
        )}
      </Modal>

      {/* CHECKOUT MODAL */}
      <Modal
        open={checkoutOpen}
        onCancel={() => setCheckoutOpen(false)}
        footer={null}
        title="Buyurtma berish"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={placeOrder}
          initialValues={{
            quantity: 1,
          }}
        >
          <Form.Item
            name="full_name"
            label="To‘liq ism"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Telefon"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="address"
            label="Manzil"
            rules={[{ required: true }]}
          >
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Soni"
            rules={[{ required: true }]}
          >
            <InputNumber
              min={1}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Button
            htmlType="submit"
            type="primary"
            loading={orderLoading}
            block
            style={{
              height: 48,
              background: "#8B5E3C",
              border: "none",
              borderRadius: 14,
              fontWeight: 600,
            }}
          >
            Buyurtmani yuborish
          </Button>
        </Form>
      </Modal>
    </div>
  );
}

const statCard = {
  borderRadius: 24,
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(20px)",
};

const statTitle = {
  color: "rgba(255,255,255,0.7)",
};

const statValue = {
  color: "#fff",
};

const productCard = {
  borderRadius: 24,
  overflow: "hidden",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(18px)",
  boxShadow: "0 20px 45px rgba(0,0,0,0.35)",
  height: "100%",
  display: "flex",
  flexDirection: "column",
};

const tagStyle = {
  padding: "10px 18px",
  borderRadius: 14,
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#fff",
};

export default Home;