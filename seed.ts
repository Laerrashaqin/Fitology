import { collection, setDoc, doc } from "firebase/firestore";
import { db } from "../src/lib/firebase";
import { marketplaceProducts } from "../src/features/marketplace/data/products";

export const seedDatabase = async () => {
  try {
    for (const product of marketplaceProducts) {
      await setDoc(doc(collection(db, "products"), product.id), product);
    }
    console.log("Database berhasil disemai dengan data marketplaceProducts!");
  } catch (error) {
    console.error("Gagal menyemai database:", error);
  }
};
