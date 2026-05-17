import { useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

function Redirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData.user;

        if (!user) {
          navigate("/login");
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .limit(1);

        if (error) {
          console.log(error);
          navigate("/");
          return;
        }

        if (!data || data.length === 0) {
          navigate("/");
          return;
        }

        const role = data[0].role;

        console.log("ROLE:", role);

        // 🔥 MUHIM: setTimeout bilan majburlaymiz
        setTimeout(() => {
          if (role === "seller") {
            navigate("/dashboard");
          } else {
            navigate("/");
          }
        }, 100);

      } catch (err) {
        console.log(err);
        navigate("/");
      }
    };

    run();
  }, [navigate]);

  return (
    <h2 style={{ textAlign: "center", marginTop: 100 }}>
      Yuklanmoqda...
    </h2>
  );
}

export default Redirect;