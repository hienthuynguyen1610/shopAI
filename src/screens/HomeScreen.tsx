import React, { useState, useCallback, useReducer } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";

import ShopButton from "@components/ShopButton";
import Typography from "@components/ui/Typography";
import ShopInput from "@components/ui/ShopInput";
import ProductCard from "@components/ProductCard";

import { useCountdown } from "@hooks/useCountdown";
import { useTheme } from "@contexts/ThemeContext";
import { MOCK_PRODUCTS } from "@data/mockProducts";
import { SIZES } from "@constants/theme";
import type { HomeStackParamList } from "@navigation/HomeStackNavigator";

type HomeNavProp = NativeStackNavigationProp<HomeStackParamList, "Home">;

interface HomeScreenProps {
  onLogout?: () => void;
}

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

const HomeScreen: React.FC<HomeScreenProps> = ({ onLogout }) => {
  const navigation = useNavigation<HomeNavProp>();

  // Lấy bộ màu động và hàm toggleTheme từ ThemeContext
  const { colors, isDark, toggleTheme } = useTheme();

  // State quản lý danh sách sản phẩm & trạng thái Pull-to-Refresh (Giữ từ Ch4)
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [refreshing, setRefreshing] = useState(false);

  // State checkout & coupon
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState("");
  const { timeLeft, isFinished } = useCountdown(60);

  // Bộ đếm số lượng sử dụng useReducer
  const [quantity, dispatchQty] = useReducer(qtyReducer, 1);

  // Hàm xử lý Pull-to-Refresh (Giữ từ Ch4)
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setProducts([...MOCK_PRODUCTS].sort(() => Math.random() - 0.5));
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleCheckout = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log("Thanh toán thành công!", coupon, "Số lượng:", quantity);
    }, 2000);
  }, [coupon, quantity]);

  // Render Header bao gồm Nút Logout, Title, Dark Mode, Card Thanh Toán & Tiêu đề
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Cụm Top Header chứa Tiêu đề + Nút Thoát */}
      <View style={styles.topBar}>
        <Typography variant="h1" color={colors.text}>
          ShopAI UI Kit
        </Typography>
        {onLogout && (
          <ShopButton
            title="Thoát"
            onPress={onLogout}
            style={{
              width: 80,
              height: 36,
              backgroundColor: colors.textLight || "#888",
            }}
          />
        )}
      </View>

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
          Tổng tiền: {(15000000 * quantity).toLocaleString("vi-VN")}đ
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
          <Typography
            variant="h3"
            color={colors.text}
            style={{ marginHorizontal: 20 }}
          >
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

      {/* Tiêu đề phần danh sách sản phẩm */}
      <Typography
        variant="h2"
        color={colors.text}
        style={{ marginTop: 24, marginBottom: 12, paddingHorizontal: 4 }}
      >
        Khám phá sản phẩm
      </Typography>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={["top", "left", "right"]}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <FlashList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            // Bọc Pressable để bấm chuyển sang trang ProductDetail
            <Pressable
              onPress={() =>
                navigation.navigate("ProductDetail", { productId: item.id })
              }
              style={{ flex: 1 }}
            >
              <ProductCard product={item} />
            </Pressable>
          )}
          ListHeaderComponent={renderHeader}
          numColumns={2}
          estimatedItemSize={260}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={{ padding: SIZES.padding / 2 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: SIZES.padding / 2,
    marginBottom: 8,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  card: {
    padding: 20,
    borderRadius: SIZES.radius,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  price: {
    marginBottom: 20,
    textAlign: "center",
  },
});

export default HomeScreen;