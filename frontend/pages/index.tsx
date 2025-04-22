import {FC} from "react";
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
    // if (modulePath && slugArray.length === 1) {
    modulePath = "main";
    subModulesPath = slugArray.slice(0).join("/");
  }

  

  function findMatchingRoute(userRoute, modulePath) {

    // Iterate over defined routes only if componentsMap[modulePath] exists
    if (componentsMap[modulePath]) {
      for (const [route, component] of Object.entries(
        componentsMap[modulePath]
      )) {
        // Replace dynamic parts ([slug], [businessUserIdSlug]) with regex to match any value
        const regex = new RegExp(`^${route.replace(/\[.*?\]/g, "[^/]+")}$`);
        // Check if the user-provided route matches the current route pattern
        if (regex.test(userRoute)) {
          return component; // Return the matched route's file/component
        }
      }
    }
    return null; // No match found
  }

  const componentPath = findMatchingRoute(subModulesPath, modulePath);

  if (!componentPath) {
    return (
      <Layout>
        <div>404 - Page Not Found</div>
      </Layout>
    );
  }
  const Component = (componentPath || Default) as FC;

  return (
    <Layout>
      <Component />
    </Layout>
  );
}

