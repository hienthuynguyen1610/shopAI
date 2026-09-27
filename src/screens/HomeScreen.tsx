import React, { useState, useCallback, useReducer } from "react";
import { View, StyleSheet } from "react-native";
import ShopButton from "@components/ShopButton";
import Typography from "@components/ui/Typography";
import ShopInput from "@components/ui/ShopInput";
import { useCountdown } from "@hooks/useCountdown";
import { SIZES } from "@constants/theme";
import { useTheme } from "@contexts/ThemeContext";

// Action types cho bộ đếm số lượng
type QtyAction = { type: "ADD" } | { type: "REMOVE" };

// Reducer xử lý tăng / giảm số lượng
function qtyReducer(state: number, action: QtyAction): number {
  switch (action.type) {
    case "ADD":
      return state + 1;
    case "REMOVE":
      return Math.max(1, state - 1);
    default:
      return state;
  }
}

const HomeScreen = () => {
  // Lấy bộ màu động và hàm toggleTheme từ ThemeContext
  const { colors, isDark, toggleTheme } = useTheme();

  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState("");
  const { timeLeft, isFinished } = useCountdown(60);

  // Bộ đếm số lượng sử dụng useReducer
  const [quantity, dispatchQty] = useReducer(qtyReducer, 1);

  const handleCheckout = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log("Thanh toán thành công!", coupon, "Số lượng:", quantity);
    }, 2000);
  }, [coupon, quantity]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Typography variant="h1" color={colors.text} style={styles.title}>
        ShopAI UI Kit
      </Typography>

      {/* Nút bật/tắt Dark Mode */}
      <ShopButton
        title={isDark ? "☀️ Chuyển sang Sáng" : "🌙 Chuyển sang Tối"}
        onPress={toggleTheme}
        style={{ backgroundColor: colors.primary, marginBottom: 16 }}
      />

      <Typography
        variant="body2"
        color={colors.textLight}
        style={{ textAlign: "center", marginBottom: 16 }}
      >
        {isFinished
          ? "Đã hết hạn khuyến mãi!"
          : `Flash sale kết thúc sau: ${timeLeft}s`}
      </Typography>

      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Typography variant="h2" color={colors.primary} style={styles.price}>
          Tổng tiền: 15.000.000đ
        </Typography>

        <ShopInput
          label="Mã giảm giá"
          placeholder="Nhập mã (VD: SHOPAI10)"
          value={coupon}
          onChangeText={setCoupon}
          autoCapitalize="characters"
        />

        {/* Cụm bộ đếm số lượng */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <ShopButton
            title="-"
            onPress={() => dispatchQty({ type: "REMOVE" })}
            style={{ width: 44, height: 44, backgroundColor: colors.primary }}
          />
          <Typography variant="h3" color={colors.text} style={{ marginHorizontal: 20 }}>
            {quantity}
          </Typography>
          <ShopButton
            title="+"
            onPress={() => dispatchQty({ type: "ADD" })}
            style={{ width: 44, height: 44, backgroundColor: colors.primary }}
          />
        </View>

        <ShopButton
          title="Xác nhận thanh toán"
          onPress={handleCheckout}
          isLoading={loading}
          disabled={isFinished}
          style={{ backgroundColor: colors.primary }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: SIZES.padding,
  },
  title: { textAlign: "center", marginBottom: 12 },
  card: {
    padding: 20,
    borderRadius: SIZES.radius,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  price: { marginBottom: 20, textAlign: "center" },
});

export default HomeScreen;