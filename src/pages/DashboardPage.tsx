import { useState } from 'react'
import {
  TopNavbar,
  Sidebar,
  DSTable,
  Card,
  CardHeader,
  CardBody,
  Badge,
  DSButton,
  StatCard,
  Breadcrumb,
} from '@uxuissk/design-system'
import {
  BarChart3,
  Users,
  ShoppingCart,
  Package,
  Settings,
  FileText,
  Headset,
} from 'lucide-react'
import type { UserAccount, SocialUser } from '../types/auth'

interface DashboardPageProps {
  user: UserAccount | SocialUser
  onLogout: () => void
}

const SUMMARY_STATS = [
  { title: 'Total Customers', value: '1,248', trend: { direction: 'up' as const, value: 12 } },
  { title: 'Active Subscriptions', value: '856', trend: { direction: 'up' as const, value: 5 } },
  { title: 'Pending Tickets', value: '24', trend: { direction: 'down' as const, value: 3 } },
  { title: 'Revenue', value: 'THB 1.2M', trend: { direction: 'up' as const, value: 8 } },
]

const MOCK_ACTIVITIES = [
  { id: '1', customer: 'Sandee Co., Ltd.', contact: 'Somchai', status: 'Active', plan: 'Pro', date: '2025-03-31' },
  { id: '2', customer: 'Jai Dee Mart', contact: 'Jai Dee', status: 'Pending', plan: 'Basic', date: '2025-03-30' },
  { id: '3', customer: 'SME Solutions', contact: 'Manee', status: 'Active', plan: 'Enterprise', date: '2025-03-30' },
  { id: '4', customer: 'Baan Khanom Thai', contact: 'Chujai', status: 'Cancelled', plan: 'Basic', date: '2025-03-29' },
  { id: '5', customer: 'Tech StartUp', contact: 'Piti', status: 'Active', plan: 'Pro', date: '2025-03-29' },
]

const MOCK_CASES = [
  { id: 'CAS-001', subject: 'Login error after password reset', customer: 'Sandee Co., Ltd.', priority: 'High', status: 'Open', date: '2025-03-31' },
  { id: 'CAS-002', subject: 'Request company name update on invoice', customer: 'Jai Dee Mart', priority: 'Medium', status: 'In Progress', date: '2025-03-30' },
  { id: 'CAS-003', subject: 'Question about package renewal', customer: 'SME Solutions', priority: 'Low', status: 'Resolved', date: '2025-03-29' },
]

function StatusBadge({ value }: { value: string }) {
  const variant =
    value === 'Active' || value === 'Resolved'
      ? 'success'
      : value === 'Pending' || value === 'In Progress'
        ? 'warning'
        : value === 'High' || value === 'Cancelled'
          ? 'destructive'
          : 'secondary'

  return <Badge variant={variant as any}>{value}</Badge>
}

export default function DashboardPage({ user, onLogout }: DashboardPageProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')

  const breadcrumbItems = [
    { label: 'Home' },
    { label: activeTab === 'dashboard' ? 'Dashboard' : activeTab === 'cases' ? 'Cases' : 'Customers' },
  ]

  const pageTitle = activeTab === 'cases' ? 'Case Dashboard' : `Welcome, ${user.name}`
  const pageSubtitle =
    activeTab === 'cases'
      ? 'Track support issues, priorities, and current progress.'
      : `Latest update: ${new Date().toLocaleDateString('th-TH')}`

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
      <TopNavbar
        brand={{ name: 'Sellsuki CRM' }}
        breadcrumbs={breadcrumbItems}
        showSearch
        user={{ name: user.name }}
        notificationCount={2}
        onUserClick={onLogout}
        actions={
          <DSButton variant="ghost" size="sm" onClick={onLogout}>
            Log out
          </DSButton>
        }
      />

      <div style={{ display: 'flex', height: 'calc(100vh - 72px)' }}>
        <Sidebar
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          activeItem={activeTab}
          onNavigate={(item) => setActiveTab(item.id)}
          groups={[
            {
              label: 'Main Menu',
              items: [
                { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={18} /> },
                { id: 'cases', label: 'Cases / Tickets', icon: <Headset size={18} /> },
                { id: 'customers', label: 'Customers', icon: <Users size={18} />, badge: 'New' },
                { id: 'orders', label: 'Sales & Orders', icon: <ShoppingCart size={18} /> },
                { id: 'products', label: 'Products', icon: <Package size={18} /> },
              ],
            },
            {
              label: 'Settings',
              items: [
                { id: 'reports', label: 'Reports', icon: <FileText size={18} /> },
                { id: 'settings', label: 'Configuration', icon: <Settings size={18} /> },
              ],
            },
          ]}
        />

        <main style={{ flex: 1, padding: 'var(--space-24)', overflowY: 'auto' }}>
          <div style={{ marginBottom: 'var(--space-24)', display: 'grid', gap: 'var(--space-12)' }}>
            <Breadcrumb items={breadcrumbItems} />
            <div>
              <h1 style={{ margin: 0, fontSize: 'var(--text-h3)', fontWeight: 'var(--weight-h3)', color: 'var(--foreground)' }}>
                {pageTitle}
              </h1>
              <p style={{ margin: 'var(--space-4) 0 0', color: 'var(--text-secondary)', fontSize: 'var(--text-p)' }}>
                {pageSubtitle}
              </p>
            </div>
          </div>

          {activeTab === 'cases' ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-20)', marginBottom: 'var(--space-32)' }}>
                <StatCard title="Open Cases" value="12" trend={{ direction: 'up', value: 2 }} />
                <StatCard title="In Progress" value="5" trend={{ direction: 'neutral', value: 0 }} />
                <StatCard title="Resolved Today" value="8" trend={{ direction: 'up', value: 4 }} />
              </div>

              <Card>
                <CardHeader>Recent Cases</CardHeader>
                <CardBody>
                  <DSTable
                    columns={[
                      { key: 'id', header: 'Case ID' },
                      { key: 'subject', header: 'Subject' },
                      { key: 'customer', header: 'Customer' },
                      { key: 'date', header: 'Created' },
                      { key: 'priority', header: 'Priority', render: (value: string) => <StatusBadge value={value} /> },
                      { key: 'status', header: 'Status', render: (value: string) => <StatusBadge value={value} /> },
                    ]}
                    data={MOCK_CASES}
                  />
                </CardBody>
              </Card>
            </>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-20)', marginBottom: 'var(--space-32)' }}>
                {SUMMARY_STATS.map((stat) => (
                  <StatCard key={stat.title} title={stat.title} value={stat.value} trend={stat.trend} />
                ))}
              </div>

              <Card>
                <CardHeader>Recent Activity</CardHeader>
                <CardBody>
                  <DSTable
                    columns={[
                      { key: 'customer', header: 'Customer' },
                      { key: 'contact', header: 'Contact' },
                      { key: 'plan', header: 'Plan' },
                      { key: 'date', header: 'Date' },
                      { key: 'status', header: 'Status', render: (value: string) => <StatusBadge value={value} /> },
                    ]}
                    data={MOCK_ACTIVITIES}
                  />
                </CardBody>
              </Card>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
