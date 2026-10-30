type NavigationItem = {
  id: string;
  label: string;
  href: string;
  submenu?: "products" | "cases";
};

export const navigation: NavigationItem[] = [
  { id: "home", label: "首页", href: "/" },
  { id: "solutions", label: "产品与解决方案", href: "/solutions", submenu: "products" },
  { id: "cases", label: "案例", href: "/cases", submenu: "cases" },
  { id: "about", label: "关于我们", href: "/about" },
  { id: "contact", label: "联系我们", href: "/contact" },
];
