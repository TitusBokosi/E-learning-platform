import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: "postgresql://titus:3VEV5o4Air9AnNjhuoNI3gg8hz1Urkyl@dpg-d44p7p4hg0os73fjtn90-a.oregon-postgres.render.com/e_learning_r1ro",
  },
});
