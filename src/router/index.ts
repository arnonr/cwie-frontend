import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useConfigStore } from "@/stores/config";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "home",
    component: () => import("@/layouts/front-layout/FrontLayout.vue"),
    children: [
      {
        path: "/home",
        name: "home",
        component: () => import("@/views/Home.vue"),
        meta: {
          pageTitle: "ระบบ CWIE",
        },
      },
      {
        path: "/document",
        name: "document",
        component: () => import("@/views/Document.vue"),
        meta: {
          pageTitle: "เอกสารดาวน์โหลด",
        },
      },
      {
        path: "/contact",
        name: "contact",
        component: () => import("@/views/Contact.vue"),
        meta: {
          pageTitle: "ติดต่อเรา",
        },
      },
      //
    ],
  },
  {
    path: "/",
    component: () => import("@/layouts/default-layout/DefaultLayout.vue"),
    // meta: {
    //   middleware: "auth",
    // },
    children: [
      {
        path: "/student",
        name: "student",
        component: () => import("@/views/student/Index.vue"),
        meta: {
          pageTitle: "โครงการ CWIE",
        },
      },
      //

      {
        path: "/advisor/student",
        name: "advisor-student",
        component: () => import("@/views/advisor/form-students/Index.vue"),
        meta: {
          pageTitle: "รายการนักศึกษา",
        },
      },
      {
        path: "/division-head/student",
        name: "division-head-student",
        component: () =>
          import("@/views/division-head/form-students/Index.vue"),
        meta: {
          pageTitle: "รายการนักศึกษา",
        },
      },
      {
        path: "/staff/student",
        name: "staff-student",
        component: () => import("@/views/staff/form-students/Index.vue"),
        meta: {
          pageTitle: "รายการนักศึกษา",
        },
      },
      {
        path: "/staff/student/request-document",
        name: "staff-student-request-document",
        component: () => import("@/views/staff/request-document/Index.vue"),
        meta: {
          pageTitle: "หนังสือขอความอนุเคราะห์",
        },
      },
      {
        path: "/staff/student/send-document",
        name: "staff-student-senddocument",
        component: () => import("@/views/staff/send-document/Index.vue"),
        meta: {
          pageTitle: "หนังสือส่งตัว",
        },
      },
      {
        path: "/visitor/student",
        name: "visitor-student",
        component: () => import("@/views/visitor/form-students/Index.vue"),
        meta: {
          pageTitle: "รายการนักศึกษา",
        },
      },

      {
        path: "/staff/student/response",
        name: "staff-student-response",
        component: () => import("@/views/staff/form-students/Response.vue"),
        meta: {
          pageTitle: "รายการเอกสารตอบกลับ",
        },
      },

      {
        path: "/visitor/student/plan",
        name: "visitor-student-plan",
        component: () => import("@/views/visitor/form-students/Plan.vue"),
        meta: {
          pageTitle: "รายการแผนการปฏิบัติงาน",
        },
      },

      {
        path: "/staff/student/report",
        name: "staff-student-report",
        component: () => import("@/views/staff/form-students/Report.vue"),
        meta: {
          pageTitle: "รายงานผลการปฏิบัติงาน",
        },
      },

      {
        path: "/staff/student/map-teacher",
        name: "staff-map-teacher",
        component: () => import("@/views/staff/form-students/MapTeacher.vue"),
        meta: {
          pageTitle: "จับคู่อาจารย์นิเทศ",
        },
      },
      {
        path: "/report/report1",
        name: "report1",
        component: () => import("@/views/report/report1.vue"),
        meta: {
          pageTitle: "รายงานนักศึกษา",
        },
      },
      {
        path: "/report/report2",
        name: "report2",
        component: () => import("@/views/report/report2.vue"),
        meta: {
          pageTitle: "รายงานสถานประกอบการ",
        },
      },

      {
        path: "/setting/users",
        name: "setting-users",
        component: () => import("@/views/setting/users/Index.vue"),
        meta: {
          pageTitle: "รายการผู้ใช้งาน",
        },
      },
      {
        path: "/setting/teachers",
        name: "setting-teachers",
        component: () => import("@/views/setting/teachers/Index.vue"),
        meta: {
          pageTitle: "รายการอาจารย์",
        },
      },
      {
        path: "/setting/company",
        name: "setting-company",
        component: () => import("@/views/setting/company/Index.vue"),
        meta: {
          pageTitle: "รายการสถานประกอบการ",
        },
      },
      {
        path: "/setting/semester",
        name: "setting-semester",
        component: () => import("@/views/setting/semester/Index.vue"),
        meta: {
          pageTitle: "รายการปีการศึกษา",
        },
      },
      {
        path: "/paper",
        name: "paper",
        component: () => import("@/views/paper/Index.vue"),
        meta: {
          pageTitle: "รายการยื่นเสนอโครงการวิจัย",
        },
      },
      {
        path: "/paper-add",
        name: "paper-add",
        component: () => import("@/views/paper/Add.vue"),
        meta: {
          pageTitle: "แบบฟอร์มยื่นเสนอโครงการวิจัย",
        },
      },
      {
        path: "/paper-edit/:id",
        name: "paper-edit",
        component: () => import("@/views/paper/Edit.vue"),
        meta: {
          pageTitle: "แบบฟอร์มแก้ไขโครงการวิจัย",
        },
      },
      {
        path: "/admin-paper",
        name: "admin-paper",
        component: () => import("@/views/admin-paper/Index.vue"),
        meta: {
          middleware: "admin",
          pageTitle: "รายการโครงการวิจัย",
        },
      },
      {
        path: "/admin-paper-edit/:id",
        name: "admin-paper-edit",
        component: () => import("@/views/admin-paper/Edit.vue"),
        meta: {
          middleware: "admin",
          pageTitle: "แบบฟอร์มแก้ไขโครงการวิจัย",
        },
      },
      {
        path: "/admin-user",
        name: "admin-user",
        component: () => import("@/views/admin-user/Index.vue"),
        meta: {
          middleware: "admin",
          pageTitle: "รายการผู้ใช้งาน",
        },
      },
      {
        path: "/admin-reviewer",
        name: "admin-reviewer",
        component: () => import("@/views/admin-reviewer/Index.vue"),
        meta: {
          middleware: "admin",
          pageTitle: "รายการกรรมการ",
        },
      },
      {
        path: "/admin-home-edit",
        name: "admin-home-edit",
        component: () => import("@/views/admin-about/EditHome.vue"),
        meta: {
          middleware: "admin",
          pageTitle: "แบบฟอร์มแก้ไขข้อมูลหน้าแรก",
        },
      },
      {
        path: "/admin-document-edit",
        name: "admin-document-edit",
        component: () => import("@/views/admin-about/EditDocument.vue"),
        meta: {
          middleware: "admin",
          pageTitle: "แบบฟอร์มแก้ไขข้อมูลหน้าเอกสารดาวน์โหลด",
        },
      },
      {
        path: "/admin-contact-edit",
        name: "admin-contact-edit",
        component: () => import("@/views/admin-about/EditContact.vue"),
        meta: {
          middleware: "admin",
          pageTitle: "แบบฟอร์มแก้ไขข้อมูลหน้าติดต่อเรา",
        },
      },
    ],
  },

  {
    path: "/",
    redirect: "/dashboard",
    component: () => import("@/layouts/default-layout/DefaultLayout.vue"),
    meta: {
      middleware: "auth",
    },
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@/views/Dashboard.vue"),
        meta: {
          pageTitle: "Dashboard",
          breadcrumbs: ["Dashboards"],
        },
      },
      {
        path: "/builder",
        name: "builder",
        component: () => import("@/views/LayoutBuilder.vue"),
        meta: {
          pageTitle: "Layout Builder",
          breadcrumbs: ["Layout"],
        },
      },
      {
        path: "/crafted/pages/profile",
        name: "profile",
        component: () => import("@/components/page-layouts/Profile.vue"),
        meta: {
          breadcrumbs: ["Pages", "Profile"],
        },
        children: [
          {
            path: "overview",
            name: "profile-overview",
            component: () =>
              import("@/views/crafted/pages/profile/Overview.vue"),
            meta: {
              pageTitle: "Overview",
            },
          },
          {
            path: "projects",
            name: "profile-projects",
            component: () =>
              import("@/views/crafted/pages/profile/Projects.vue"),
            meta: {
              pageTitle: "Projects",
            },
          },
          {
            path: "campaigns",
            name: "profile-campaigns",
            component: () =>
              import("@/views/crafted/pages/profile/Campaigns.vue"),
            meta: {
              pageTitle: "Campaigns",
            },
          },
          {
            path: "documents",
            name: "profile-documents",
            component: () =>
              import("@/views/crafted/pages/profile/Documents.vue"),
            meta: {
              pageTitle: "Documents",
            },
          },
          {
            path: "connections",
            name: "profile-connections",
            component: () =>
              import("@/views/crafted/pages/profile/Connections.vue"),
            meta: {
              pageTitle: "Connections",
            },
          },
          {
            path: "activity",
            name: "profile-activity",
            component: () =>
              import("@/views/crafted/pages/profile/Activity.vue"),
            meta: {
              pageTitle: "Activity",
            },
          },
        ],
      },
      {
        path: "/crafted/pages/wizards/horizontal",
        name: "horizontal-wizard",
        component: () =>
          import("@/views/crafted/pages/wizards/HorizontalWizardPage.vue"),
        meta: {
          pageTitle: "Horizontal",
          breadcrumbs: ["Pages", "Wizard"],
        },
      },
      {
        path: "/crafted/pages/wizards/vertical",
        name: "vertical-wizard",
        component: () =>
          import("@/views/crafted/pages/wizards/VerticalWizardPage.vue"),
        meta: {
          pageTitle: "Vertical",
          breadcrumbs: ["Pages", "Wizard"],
        },
      },
      {
        path: "/crafted/account",
        name: "account",
        component: () => import("@/views/crafted/account/Account.vue"),
        meta: {
          breadcrumbs: ["Crafted", "Account"],
        },
        children: [
          {
            path: "overview",
            name: "account-overview",
            component: () => import("@/views/crafted/account/Overview.vue"),
            meta: {
              pageTitle: "Overview",
            },
          },
          {
            path: "settings",
            name: "account-settings",
            component: () => import("@/views/crafted/account/Settings.vue"),
            meta: {
              pageTitle: "Settings",
            },
          },
        ],
      },
      {
        path: "/apps/customers/getting-started",
        name: "apps-customers-getting-started",
        component: () => import("@/views/apps/customers/GettingStarted.vue"),
        meta: {
          pageTitle: "Getting Started",
          breadcrumbs: ["Apps", "Customers"],
        },
      },
      {
        path: "/apps/customers/customers-listing",
        name: "apps-customers-listing",
        component: () => import("@/views/apps/customers/CustomersListing.vue"),
        meta: {
          pageTitle: "Customers Listing",
          breadcrumbs: ["Apps", "Customers"],
        },
      },
      {
        path: "/apps/customers/customer-details",
        name: "apps-customers-details",
        component: () => import("@/views/apps/customers/CustomerDetails.vue"),
        meta: {
          pageTitle: "Customers Details",
          breadcrumbs: ["Apps", "Customers"],
        },
      },
      {
        path: "/apps/subscriptions/getting-started",
        name: "apps-subscriptions-getting-started",
        component: () =>
          import("@/views/apps/subscriptions/GettingStarted.vue"),
        meta: {
          pageTitle: "Getting Started",
          breadcrumbs: ["Apps", "Subscriptions"],
        },
      },
      {
        path: "/apps/subscriptions/subscription-list",
        name: "apps-subscriptions-subscription-list",
        component: () =>
          import("@/views/apps/subscriptions/SubscriptionList.vue"),
        meta: {
          pageTitle: "Getting Started",
          breadcrumbs: ["Apps", "Subscriptions"],
        },
      },
      {
        path: "/apps/subscriptions/add-subscription",
        name: "apps-subscriptions-add-subscription",
        component: () =>
          import("@/views/apps/subscriptions/AddSubscription.vue"),
        meta: {
          pageTitle: "Add Subscription",
          breadcrumbs: ["Apps", "Subscriptions"],
        },
      },
      {
        path: "/apps/subscriptions/view-subscription",
        name: "apps-subscriptions-view-subscription",
        component: () =>
          import("@/views/apps/subscriptions/ViewSubscription.vue"),
        meta: {
          pageTitle: "View Subscription",
          breadcrumbs: ["Apps", "Subscriptions"],
        },
      },
      {
        path: "/apps/calendar",
        name: "apps-calendar",
        component: () => import("@/views/apps/Calendar.vue"),
        meta: {
          pageTitle: "Calendar",
          breadcrumbs: ["Apps"],
        },
      },
      {
        path: "/apps/chat/private-chat",
        name: "apps-private-chat",
        component: () => import("@/views/apps/chat/Chat.vue"),
        meta: {
          pageTitle: "Private Chat",
          breadcrumbs: ["Apps", "Chat"],
        },
      },
      {
        path: "/apps/chat/group-chat",
        name: "apps-group-chat",
        component: () => import("@/views/apps/chat/Chat.vue"),
        meta: {
          pageTitle: "Group Chat",
          breadcrumbs: ["Apps", "Chat"],
        },
      },
      {
        path: "/apps/chat/drawer-chat",
        name: "apps-drawer-chat",
        component: () => import("@/views/apps/chat/DrawerChat.vue"),
        meta: {
          pageTitle: "Drawer Chat",
          breadcrumbs: ["Apps", "Chat"],
        },
      },
      {
        path: "/crafted/modals/general/invite-friends",
        name: "modals-general-invite-friends",
        component: () =>
          import("@/views/crafted/modals/general/InviteFriends.vue"),
        meta: {
          pageTitle: "Invite Friends",
          breadcrumbs: ["Crafted", "Modals", "General"],
        },
      },
      {
        path: "/crafted/modals/general/view-user",
        name: "modals-general-view-user",
        component: () => import("@/views/crafted/modals/general/ViewUsers.vue"),
        meta: {
          pageTitle: "View User",
          breadcrumbs: ["Crafted", "Modals", "General"],
        },
      },
      {
        path: "/crafted/modals/general/upgrade-plan",
        name: "modals-general-upgrade-plan",
        component: () =>
          import("@/views/crafted/modals/general/UpgradePlan.vue"),
        meta: {
          pageTitle: "Upgrade Plan",
          breadcrumbs: ["Crafted", "Modals", "General"],
        },
      },
      {
        path: "/crafted/modals/general/share-and-earn",
        name: "modals-general-share-and-earn",
        component: () =>
          import("@/views/crafted/modals/general/ShareAndEarn.vue"),
        meta: {
          pageTitle: "Share And Earn",
          breadcrumbs: ["Crafted", "Modals", "General"],
        },
      },
      {
        path: "/crafted/modals/forms/new-target",
        name: "modals-forms-new-target",
        component: () => import("@/views/crafted/modals/forms/NewTarget.vue"),
        meta: {
          pageTitle: "New Target",
          breadcrumbs: ["Crafted", "Modals", "Forms"],
        },
      },
      {
        path: "/crafted/modals/forms/new-card",
        name: "modals-forms-new-card",
        component: () => import("@/views/crafted/modals/forms/NewCard.vue"),
        meta: {
          pageTitle: "New Card",
          breadcrumbs: ["Crafted", "Modals", "Forms"],
        },
      },
      {
        path: "/crafted/modals/forms/new-address",
        name: "modals-forms-new-address",
        component: () => import("@/views/crafted/modals/forms/NewAddress.vue"),
        meta: {
          pageTitle: "New Address",
          breadcrumbs: ["Crafted", "Modals", "Forms"],
        },
      },
      {
        path: "/crafted/modals/forms/create-api-key",
        name: "modals-forms-create-api-key",
        component: () =>
          import("@/views/crafted/modals/forms/CreateApiKey.vue"),
        meta: {
          pageTitle: "Create Api Key",
          breadcrumbs: ["Crafted", "Modals", "Forms"],
        },
      },
      {
        path: "/crafted/modals/wizards/two-factor-auth",
        name: "modals-wizards-two-factor-auth",
        component: () =>
          import("@/views/crafted/modals/wizards/TwoFactorAuth.vue"),
        meta: {
          pageTitle: "Two Factory Auth",
          breadcrumbs: ["Crafted", "Modals", "Wizards"],
        },
      },
      {
        path: "/crafted/modals/wizards/create-app",
        name: "modals-wizards-create-app",
        component: () => import("@/views/crafted/modals/wizards/CreateApp.vue"),
        meta: {
          pageTitle: "Create App",
          breadcrumbs: ["Crafted", "Modals", "Wizards"],
        },
      },
      {
        path: "/crafted/modals/wizards/create-account",
        name: "modals-wizards-create-account",
        component: () =>
          import("@/views/crafted/modals/wizards/CreateAccount.vue"),
        meta: {
          pageTitle: "Create Account",
          breadcrumbs: ["Crafted", "Modals", "Wizards"],
        },
      },
      {
        path: "/crafted/widgets/lists",
        name: "widgets-list",
        component: () => import("@/views/crafted/widgets/Lists.vue"),
        meta: {
          pageTitle: "Lists",
          breadcrumbs: ["Crafted", "Widgets"],
        },
      },
      {
        path: "/crafted/widgets/statistics",
        name: "widgets-statistics",
        component: () => import("@/views/crafted/widgets/Statistics.vue"),
        meta: {
          pageTitle: "Statistics",
          breadcrumbs: ["Crafted", "Widgets"],
        },
      },
      {
        path: "/crafted/widgets/charts",
        name: "widgets-charts",
        component: () => import("@/views/crafted/widgets/Charts.vue"),
        meta: {
          pageTitle: "Charts",
          breadcrumbs: ["Crafted", "Widgets"],
        },
      },
      {
        path: "/crafted/widgets/mixed",
        name: "widgets-mixed",
        component: () => import("@/views/crafted/widgets/Mixed.vue"),
        meta: {
          pageTitle: "Mixed",
          breadcrumbs: ["Crafted", "Widgets"],
        },
      },
      {
        path: "/crafted/widgets/tables",
        name: "widgets-tables",
        component: () => import("@/views/crafted/widgets/Tables.vue"),
        meta: {
          pageTitle: "Tables",
          breadcrumbs: ["Crafted", "Widgets"],
        },
      },
      {
        path: "/crafted/widgets/feeds",
        name: "widgets-feeds",
        component: () => import("@/views/crafted/widgets/Feeds.vue"),
        meta: {
          pageTitle: "Feeds",
          breadcrumbs: ["Crafted", "Widgets"],
        },
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/layouts/AuthLayout.vue"),
    children: [
      {
        path: "/sign-in",
        name: "sign-in",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/SignIn.vue"),
        meta: {
          pageTitle: "Sign In",
        },
      },
      {
        path: "/register",
        name: "register",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/Register.vue"),
        meta: {
          pageTitle: "Register",
        },
      },
      {
        path: "/sign-up",
        name: "sign-up",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/SignUp.vue"),
        meta: {
          pageTitle: "Sign Up",
        },
      },
      {
        path: "/password-reset",
        name: "password-reset",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/PasswordReset.vue"),
        meta: {
          pageTitle: "Password reset",
        },
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/layouts/SystemLayout.vue"),
    children: [
      {
        // the 404 route, when none of the above matches
        path: "/404",
        name: "404",
        component: () => import("@/views/crafted/authentication/Error404.vue"),
        meta: {
          pageTitle: "Error 404",
        },
      },
      {
        path: "/500",
        name: "500",
        component: () => import("@/views/crafted/authentication/Error500.vue"),
        meta: {
          pageTitle: "Error 500",
        },
      },
      {
        path: "/error-permission",
        name: "error-permission",
        component: () =>
          import("@/views/crafted/authentication/ErrorPermission.vue"),
        meta: {
          pageTitle: "Error Permission",
        },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  //   history: createWebHashHistory(),
  routes,
  scrollBehavior(to) {
    // If the route has a hash, scroll to the section with the specified ID; otherwise, scroll toc the top of the page.
    if (to.hash) {
      return {
        el: to.hash,
        top: 80,
        behavior: "smooth",
      };
    } else {
      return {
        top: 0,
        left: 0,
        behavior: "smooth",
      };
    }
  },
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const configStore = useConfigStore();

  // current page view title
  document.title = `${to.meta.pageTitle} - ${import.meta.env.VITE_APP_NAME}`;

  // reset config to initial state
  configStore.resetLayoutConfig();

  // verify auth token before each page change
  authStore.verifyAuth();

  // before page access check if page requires authentication
  if (to.meta.middleware == "auth" || to.meta.middleware == "admin") {
    if (authStore.isAuthenticated) {
      if (to.meta.middleware == "admin") {
        if (authStore.isAdmin) {
          next();
        } else {
          next({ name: "error-permission" });
        }
      } else {
        next();
      }
    } else {
      next({ name: "sign-in" });
    }
  } else {
    next();
  }
});

export default router;
