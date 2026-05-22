import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Button, Space, Typography, Badge } from "antd";
import {
  LoginOutlined,
  UserAddOutlined,
  LogoutOutlined,
  DashboardOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

function Navbar() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const loadProfile = async (userId) => {
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    setRole(data?.role || null);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);

      if (data.session?.user) {
        loadProfile(data.session.user.id);
        fetchCartCount(data.session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      if (session?.user) {
        loadProfile(session.user.id);
        fetchCartCount(session.user.id);
      } else {
        setRole(null);
      }
    });
    const channel = supabase
      .channel("cart-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cart",
        },
        async () => {
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (user) {
            fetchCartCount(user.id);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, []);
  const fetchCartCount = async (userId) => {
    const { count } = await supabase
      .from("cart")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("user_id", userId);

    setCartCount(count || 0);
  };
  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div
      style={{
        padding: "18px 40px",
        background: "#111",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title
          level={2}
          style={{
            margin: 0,
            color: "#fff",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          Craft<span style={{ color: "#8B5E3C" }}>Map</span>
        </Title>

        <Space>
          <Button onClick={() => navigate("/")}>
            <HomeOutlined /> Home
          </Button>
          <Badge count={cartCount} size="small" offset={[-2, 6]}>
            <Button onClick={() => navigate("/cart")}>
              <ShoppingCartOutlined /> Cart
            </Button>
          </Badge>

          {session && role === "user" && (
            <Button onClick={() => navigate("/my-orders")}>
              <ShoppingCartOutlined /> My Orders
            </Button>
          )}

          {session && role === "seller" && (
            <>
              <Button onClick={() => navigate("/dashboard")}>
                <DashboardOutlined /> Dashboard
              </Button>

              <Button onClick={() => navigate("/seller-orders")}>
                <OrderedListOutlined /> Orders
              </Button>
            </>
          )}

          {!session ? (
            <>
              <Button onClick={() => navigate("/login")}>
                <LoginOutlined /> Login
              </Button>

              <Button
                style={{
                  background: "#8B5E3C",
                  color: "#fff",
                }}
                onClick={() => navigate("/register")}
              >
                <UserAddOutlined /> Register
              </Button>
            </>
          ) : (
            <Button danger onClick={logout}>
              <LogoutOutlined /> Logout
            </Button>
          )}
        </Space>
      </div>
    </div>
  );
}

export default Navbar;
