import { Card } from "antd";

function ProductCard({ p }) {
  return (
    <Card className="glass" cover={<img src={p.image} style={{height:200, objectFit:"cover"}} />}>
      <h3>{p.title}</h3>
      <p>{p.price}$</p>
    </Card>
  );
}

export default ProductCard;