// Connected backend store using React Query and Axios
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import * as seed from "./data";

export { seed };

const api = axios.create({
  baseURL: "/api/v1",
  headers: {
    Accept: "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const endpointMap: Record<string, string> = {
  companies: "companies",
  clients: "clients",
  contacts: "contacts",
  leads: "leads",
  meetings: "meetings",
  quotations: "quotations",
  contracts: "contracts",
  projects: "projects",
  milestones: "milestones",
  tasks: "tasks",
  bugs: "bugs",
  files: "files",
  invoices: "invoices",
  payments: "payments",
  expenses: "expenses",
  domains: "domains",
  hostingAccounts: "hosting",
  servers: "servers",
  ssls: "ssl",
  tickets: "tickets",
  employees: "employees",
  departments: "departments",
  attendance: "attendance",
  leaves: "leaves",
  notifications: "notifications",
  timeLogs: "time-logs",
};

import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});
export function useCollection<K extends keyof typeof endpointMap>(key: K): any[] {
  const { data } = useQuery({
    queryKey: [key],
    queryFn: async () => {
      const res = await api.get(`/${endpointMap[key as string]}`);
      return res.data?.data || [];
    },
    initialData: [],
  });

  return data;
}

export async function add<K extends keyof typeof endpointMap>(key: K, item: any) {
  const res = await api.post(`/${endpointMap[key as string]}`, item);
  queryClient.invalidateQueries({ queryKey: [key] });
  return res.data;
}

export async function update<K extends keyof typeof endpointMap>(
  key: K,
  id: string | number,
  patch: any,
) {
  const res = await api.put(`/${endpointMap[key as string]}/${id}`, patch);
  queryClient.invalidateQueries({ queryKey: [key] });
  return res.data;
}

export async function remove<K extends keyof typeof endpointMap>(key: K, id: string | number) {
  const res = await api.delete(`/${endpointMap[key as string]}/${id}`);
  queryClient.invalidateQueries({ queryKey: [key] });
  return res.data;
}
