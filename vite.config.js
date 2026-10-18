import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  // نام ریپازیتوری GitHub را اینجا وارد کن
  base: "/dekon.ir/",
});
