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
} from "antd";
import {
  SearchOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      return;
    }

    setProducts(data || []);
  };

  const filteredProducts = products.filter((product) =>
    product.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #111111 0%, #1a1a1a 55%, #2d1d13 100%)",
        paddingBottom: 80,
      }}
    >
      {/* HERO */}
      <section
        style={{
          maxWidth: 1300,
          margin: "0 auto",
          padding: "80px 30px 40px",
          textAlign: "center",
        }}
      >
        <Title
          style={{
            color: "#FFFFFF",
            fontSize: 54,
            marginBottom: 12,
            fontWeight: 700,
          }}
        >
          Hunarmandlar
          <span style={{ color: "#8B5E3C" }}> Marketplace</span>
        </Title>

        <Text
          style={{
            color: "rgba(255,255,255,0.72)",
            fontSize: 18,
          }}
        >
          Mahalliy ustalarning noyob va qo‘lda yasalgan mahsulotlari
        </Text>

        <div
          style={{
            maxWidth: 650,
            margin: "35px auto 0",
          }}
        >
          <Input
            size="large"
            prefix={<SearchOutlined />}
            placeholder="Mahsulot qidiring..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              height: 58,
              borderRadius: 18,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#FFFFFF",
            }}
          />
        </div>
      </section>

      {/* CATEGORY TAGS */}
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 12,
          flexWrap: "wrap",
          padding: "0 20px 40px",
        }}
      >
        <Tag style={tagStyle}>Kulolchilik</Tag>
        <Tag style={tagStyle}>Kashtachilik</Tag>
        <Tag style={tagStyle}>Zargarlik</Tag>
        <Tag style={tagStyle}>Yog‘och o‘ymakorligi</Tag>
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
        <Title
          level={2}
          style={{
            color: "#FFFFFF",
            marginBottom: 28,
          }}
        >
          So‘nggi mahsulotlar
        </Title>

        {filteredProducts.length === 0 ? (
          <Empty
            description={
              <span style={{ color: "#FFFFFF" }}>
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
                  cover={
                    <img
                      src={product.image}
                      alt={product.title}
                      style={{
                        height: 260,
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
                    boxShadow: "0 20px 45px rgba(0,0,0,0.35)",
                  }}
                >
                  <Title
                    level={4}
                    style={{
                      color: "#FFFFFF",
                      marginBottom: 10,
                    }}
                  >
                    {product.title}
                  </Title>

                  <Text
                    style={{
                      color: "#8B5E3C",
                      fontSize: 20,
                      fontWeight: 700,
                    }}
                  >
                    ${product.price}
                  </Text>

                  <Button
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    block
                    style={{
                      marginTop: 18,
                      height: 46,
                      borderRadius: 14,
                      background: "#8B5E3C",
                      border: "none",
                      fontWeight: 600,
                    }}
                  >
                    Sotib olish
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </section>
    </div>
  );
}

const tagStyle = {
  padding: "10px 18px",
  borderRadius: 14,
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#FFFFFF",
  fontSize: 14,
};

export default Home;