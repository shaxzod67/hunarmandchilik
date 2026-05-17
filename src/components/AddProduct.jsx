import { useState } from "react";
import { supabase } from "../supabaseClient";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Upload,
  Card,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { TextArea } = Input;

function AddProduct({ onAdded }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        message.error("Login qiling");
        return;
      }

      if (!file) {
        message.error("Rasm tanlang");
        return;
      }

      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      const { error } = await supabase.from("products").insert([
        {
          title: values.title,
          description: values.description,
          price: values.price,
          image: data.publicUrl,
          user_id: user.id,
        },
      ]);

      if (error) throw error;

      message.success("Mahsulot qo‘shildi");
      onAdded?.();

    } catch (err) {
      console.log(err);
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="title"
          label="Nom"
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
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Upload
          beforeUpload={(file) => {
            setFile(file);
            return false;
          }}
          showUploadList
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>
            Rasm tanlash
          </Button>
        </Upload>

        <Button
          htmlType="submit"
          type="primary"
          loading={loading}
          block
          style={{ marginTop: 20 }}
        >
          Qo‘shish
        </Button>
      </Form>
    </Card>
  );
}

export default AddProduct;