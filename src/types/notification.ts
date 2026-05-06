 export interface Notification {
  id: string;
  title: string;
  description: string;
  actionLink: string;
  type: "warning" | "info" | "success";
}