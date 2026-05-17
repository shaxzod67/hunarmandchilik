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
  Skeleton,
  Modal,
  Form,
  Input,
  InputNumber,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;

function SellerProducts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchMine();
  }, []);

  const fetchMine = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setItems(data || []);
    } catch (err) {
      console.log(err);
      message.error("Mahsulotlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
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

      setItems((prev) => prev.filter((item) => item.id !== id));

      message.success("Mahsulot o‘chirildi");
    } catch (err) {
      console.log(err);
      message.error("O‘chirishda xatolik");
    }
  };

  const openEdit = (product) => {
    setSelectedProduct(product);

    form.setFieldsValue({
      title: product.title,
      description: product.description,
      price: product.price,
    });

    setEditOpen(true);
  };

  const handleUpdate = async (values) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({
          title: values.title,
          description: values.description,
          price: values.price,
        })
        .eq("id", selectedProduct.id);

      if (error) throw error;

      message.success("Mahsulot yangilandi");

      setEditOpen(false);

      fetchMine();

    } catch (err) {
      console.log(err);
      message.error("Yangilashda xatolik");
    }
  };

  if (loading) {
    return (
      <Row gutter={[24, 24]}>
        {[1, 2, 3, 4].map((i) => (
          <Col xs={24} sm={12} md={8} lg={6} key={i}>
            <Card style={cardStyle}>
              <Skeleton active />
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <Card style={emptyCard}>
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
    <>
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
          Marketplace’dagi barcha aktiv mahsulotlaringiz
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
              style={cardStyle}
            >
              <Space
                direction="vertical"
                size={10}
                style={{ width: "100%" }}
              >
                <Tag
                  style={{
                    background: "#8B5E3C",
                    color: "#fff",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: 10,
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
                    color: "rgba(255,255,255,0.65)",
                  }}
                >
                  {product.description || "Mahsulot tavsifi"}
                </Text>

                <Text
                  style={{
                    color: "#8B5E3C",
                    fontSize: 22,
                    fontWeight: 700,
                  }}
                >
                  ${product.price}
                </Text>

                <Button
                  icon={<EditOutlined />}
                  block
                  style={{
                    height: 44,
                    borderRadius: 14,
                    fontWeight: 600,
                  }}
                  onClick={() => openEdit(product)}
                >
                  Edit
                </Button>

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
                      height: 44,
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

      <Modal
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        footer={null}
        title="Mahsulotni tahrirlash"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
        >
          <Form.Item
            name="title"
            label="Mahsulot nomi"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Tavsif"
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="price"
            label="Narx"
            rules={[{ required: true }]}
          >
            <InputNumber
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Button
            htmlType="submit"
            type="primary"
            block
            icon={<ShoppingOutlined />}
            style={{
              background: "#8B5E3C",
              border: "none",
              height: 46,
              borderRadius: 14,
            }}
          >
            Yangilash
          </Button>
        </Form>
      </Modal>
    </>
  );
}

const cardStyle = {
  borderRadius: 24,
  overflow: "hidden",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(18px)",
  boxShadow: "0 18px 45px rgba(0,0,0,0.35)",
};

const emptyCard = {
  borderRadius: 24,
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(20px)",
};

export default SellerProducts;