import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/LabelPages";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/")({ head: () => pageHead("home"), component: HomePage });
