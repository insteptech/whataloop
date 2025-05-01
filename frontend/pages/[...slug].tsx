import { useRouter } from "next/router";
import Page from "./index";

export default function DynamicPage() {
  const router = useRouter();
  const { slug } = router.query; 
  console.log("slug", slug);
    
  return <Page slug={slug} />;
}
