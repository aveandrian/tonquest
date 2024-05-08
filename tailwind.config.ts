import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import flowBitePlugin from "flowbite/plugin"

export default {
  content: ["./src/**/*.tsx", "./node_modules/flowbite-react/lib/**/*.ts",],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [flowBitePlugin],
} satisfies Config;
