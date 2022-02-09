import { $t } from "/@/plugins/i18n";
import Layout from "/@/layout/index.vue";

const testLink = {
  path: "/test",
  name: "test",
  component: Layout,
  meta: {
    icon: "link",
    title: $t("menus.testLink"),
    i18n: true,
    rank: 10
  },
  children: [
    {
      path: "/test",
      name: "test",
      component: () => import("/@/views/test/index.vue"),
      meta: {
        title: $t("menus.testLink"),
        i18n: true,
        rank: 11
      }
    }
  ]
};

export default testLink;
