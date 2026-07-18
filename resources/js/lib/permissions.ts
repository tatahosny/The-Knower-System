export type Role =
  | "super_admin"
  | "ceo"
  | "sales"
  | "project_manager"
  | "team_leader"
  | "developer"
  | "designer"
  | "qa"
  | "accountant"
  | "hr"
  | "support"
  | "client";

export const ALL_ROLES: Role[] = [
  "super_admin",
  "ceo",
  "sales",
  "project_manager",
  "team_leader",
  "developer",
  "designer",
  "qa",
  "accountant",
  "hr",
  "support",
  "client",
];

export const PERMISSIONS = [
  "dashboard.view",
  "crm.view",
  "lead.manage",
  "client.manage",

  "quotation.manage",
  "contract.manage",
  "project.view",
  "project.manage",
  "task.view",
  "task.manage",
  "task.update_status",
  "bug.manage",
  "file.upload",
  "finance.view",
  "invoice.manage",
  "payment.manage",
  "expense.manage",
  "hosting.view",
  "hosting.manage",
  "domain.manage",
  "server.manage",
  "ssl.manage",
  "hr.view",
  "hr.manage",
  "attendance.manage",
  "leave.manage",
  "payroll.manage",
  "support.view",
  "ticket.manage",
  "ticket.reply",
  "report.view",
  "ai.use",
  "settings.manage",
  "user.manage",
  "client_portal.view",
  "code.review",
  "design.upload",
  "qa.test",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

const ALL: Permission[] = [...PERMISSIONS];

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  super_admin: ALL,
  ceo: [
    "dashboard.view",
    "crm.view",
    "client.manage",

    "project.view",
    "finance.view",
    "report.view",
    "hr.view",
    "hosting.view",
    "support.view",
    "ai.use",
  ],
  sales: [
    "dashboard.view",
    "crm.view",
    "lead.manage",
    "client.manage",

    "quotation.manage",
    "contract.manage",
    "ai.use",
  ],
  project_manager: [
    "dashboard.view",
    "crm.view",
    "project.view",
    "project.manage",
    "task.view",
    "task.manage",
    "bug.manage",
    "file.upload",
    "report.view",
    "ai.use",
  ],
  team_leader: [
    "dashboard.view",
    "project.view",
    "task.view",
    "task.manage",
    "code.review",
    "bug.manage",
    "file.upload",
    "ai.use",
  ],
  developer: [
    "dashboard.view",
    "project.view",
    "task.view",
    "task.update_status",
    "bug.manage",
    "file.upload",
    "ai.use",
  ],
  designer: [
    "dashboard.view",
    "project.view",
    "task.view",
    "task.update_status",
    "design.upload",
    "file.upload",
  ],
  qa: [
    "dashboard.view",
    "project.view",
    "task.view",
    "qa.test",
    "bug.manage",
    "file.upload",
  ],
  accountant: [
    "dashboard.view",
    "finance.view",
    "invoice.manage",
    "payment.manage",
    "expense.manage",
    "report.view",
  ],
  hr: [
    "dashboard.view",
    "hr.view",
    "hr.manage",
    "attendance.manage",
    "leave.manage",
    "payroll.manage",
    "report.view",
  ],
  support: [
    "dashboard.view",
    "support.view",
    "ticket.manage",
    "ticket.reply",
    "client.manage",
  ],
  client: ["client_portal.view"],
};

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  ceo: "CEO",
  sales: "Sales",
  project_manager: "Project Manager",
  team_leader: "Team Leader",
  developer: "Software Developer",
  designer: "UI/UX Designer",
  qa: "QA Tester",
  accountant: "Accountant",
  hr: "HR",
  support: "Support",
  client: "Client",
};

export function roleHas(role: Role, perm: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(perm) ?? false;
}
