
import { toast as sonnerToast } from "sonner";
import { toast as shadcnToast } from "@/components/ui/use-toast";

export const toast = sonnerToast;
export const useToast = () => {
  return shadcnToast;
};
