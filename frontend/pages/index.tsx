import dynamic from "next/dynamic";
import {componentsMap} from "@/componentsMap"; // Import the generated map

const Layout = dynamic(() => import("../layouts/main"));
const Default = dynamic(() => import("./default"));

type PageProps = {
  slug: string | string[]; // Slug can be a string or array (e.g., `/auth/login`)
};


export default function Page({ slug }: PageProps) {
  const slugArray = Array.isArray(slug) ? slug : [slug];
  let modulePath = slugArray[0];
  let subModulesPath = slugArray.slice(1).join("/");
 
  if (modulePath && !subModulesPath) {
    modulePath = "main";
    subModulesPath = slugArray.slice(0).join("/");
  }
  const componentPath = subModulesPath.length > 0
    ? componentsMap[modulePath]?.[subModulesPath]
    : Default;
  
  if (!componentPath) {
    return (
      <Layout>
        <div>404 - Page Not Found</div>
      </Layout>
    );
  }
  const Component = componentPath;
  return (
    <Layout>
      <Component />
    </Layout>
  );
}
