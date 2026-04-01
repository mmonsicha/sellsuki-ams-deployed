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
  Statistic,
  PageHeader,
  Breadcrumb,
} from '@uxuissk/design-system'
import {
  BarChart3,
  Users,
  ShoppingCart,
  Package,
  Settings,
  FileText,
  Headset
} from 'lucide-react'
import type { UserAccount, SocialUser } from '../types/auth'

interface DashboardPageProps {
  user: UserAccount | SocialUser
  onLogout: () => void
}

// ── Mock CRM Data
const SUMMARY_STATS = [
  { title: 'Total Customers', value: '1,248', trend: { direction: 'up' as const, value: 12 } },
  { title: 'Active Subscriptions', value: '856', trend: { direction: 'up' as const, value: 5 } },
  { title: 'Pending Tickets', value: '24', trend: { direction: 'down' as const, value: 3 } },
  { title: 'Revenue (MM)', value: '฿1.2M', trend: { direction: 'up' as const, value: 8 } },
]

const MOCK_ACTIVITIES = [
  { id: '1', customer: 'บริษัท แสนดี จำกัด', contact: 'คุณสมชาย', status: 'Active', plan: 'Pro', date: '2025-03-31' },
  { id: '2', customer: 'ร้านใจดี มาร์ท', contact: 'คุณใจดี', status: 'Pending', plan: 'Basic', date: '2025-03-30' },
  { id: '3', customer: 'SME Solutions', contact: 'คุณมานี', status: 'Active', plan: 'Enterprise', date: '2025-03-30' },
  { id: '4', customer: 'บ้านขนมไทย', contact: 'คุณชูใจ', status: 'Cancelled', plan: 'Basic', date: '2025-03-29' },
  { id: '5', customer: 'Tech StartUp', contact: 'คุณปิติ', status: 'Active', plan: 'Pro', date: '2025-03-29' },
]

const MOCK_CASES = [
  { id: 'CAS-001', subject: 'เข้าระบบไม่ได้ ติด Error', customer: 'บริษัท แสนดี จำกัด', priority: 'High', status: 'Open', date: '2025-03-31' },
  { id: 'CAS-002', subject: 'ขอแก้ไขชื่อข้อมูลบริษัทบนใบเสร็จ', customer: 'ร้านใจดี มาร์ท', priority: 'Medium', status: 'In Progress', date: '2025-03-30' },
  { id: 'CAS-003', subject: 'สอบถามเรื่องการต่ออายุแพ็กเกจ', customer: 'SME Solutions', priority: 'Low', status: 'Resolved', date: '2025-03-29' },
]

export default function DashboardPage({ user, onLogout }: DashboardPageProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
      {/* ── Navbar ── */}
      <TopNavbar
        brand={{ name: 'Sellsuki CRM' }}
        breadcrumbs={[
          { label: 'Home' },
          { label: activeTab === 'dashboard' ? 'Dashboard' : 'Customers' }
        ]}
        showSearch
        user={{ 
          name: user.name, 
          // You could pass avatar URL here if we had one, otherwise TopNavbar often handles initial internally
        }}
        notificationCount={2}
        // onSidebarToggle={() => setCollapsed(c => !c)}
        onUserClick={onLogout} // Using this to trigger logout, or we can add it to actions
        actions={
          <DSButton variant="ghost" size="sm" onClick={onLogout}>
            ออกจากระบบ
          </DSButton>
        }
      />

      <div style={{ display: 'flex', height: 'calc(100vh - 72px)' }}>
        {/* ── Sidebar ── */}
        <Sidebar
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          groups={[
            {
              label: 'Main Menu',
              items: [
                { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={18} /> },
                { id: 'cases', label: 'Cases / Tickets', icon: <Headset size={18} /> },
                { id: 'customers', label: 'Customers (CRM)', icon: <Users size={18} />, badge: 'New' },
                { id: 'orders', label: 'Sales & Orders', icon: <ShoppingCart size={18} /> },
                { id: 'products', label: 'Products', icon: <Package size={18} /> },
              ]
            },
            {
              label: 'Settings',
              items: [
                { id: 'reports', label: 'Reports', icon: <FileText size={18} /> },
                { id: 'settings', label: 'Configuration', icon: <Settings size={18} /> },
              ]
            }
          ]}
          activeItem={activeTab}
          onNavigate={(item) => setActiveTab(item.id)}
        />

        {/* ── Main Content ── */}
        <main style={{ flex: 1, padding: 'var(--space-24)', overflowY: 'auto' }}>
          <div style={{ marginBottom: 'var(--space-24)' }}>
            <PageHeader
              title={activeTab === 'cases' ? 'Case Dashboard ข้อมูลการแจ้งปัญหา' : `ยินดีต้อนรับ, ${user.name} 👋`}
              subtitle={`ข้อมูลอัปเดตล่าสุด: ${new Date().toLocaleDateString('th-TH')}`}
              breadcrumb={
                <Breadcrumb 
                  items={[
                    { label: 'Home' },
                    { label: activeTab === 'dashboard' ? 'Dashboard' : activeTab === 'cases' ? 'Cases' : 'Customers' }
                  ]} 
                />
              }
            />
          </div>

          {activeTab === 'cases' ? (
            /* ── CASE DASHBOARD VIEW ── */
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-20)', marginBottom: 'var(--space-32)' }}>
                <Card>
                   <CardBody>
                     <Statistic title="Open Cases" value="12" />
                   </CardBody>
                </Card>
                <Card>
                   <CardBody>
                     <Statistic title="In Progress" value="5" />
                   </CardBody>
                </Card>
                <Card>
                   <CardBody>
                     <Statistic title="Resolved (Today)" value="8" />
                   </CardBody>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <span style={{ fontSize: '18px', fontWeight: 700 }}>เคสล่าสุด (Recent Cases)</span>
                </CardHeader>
                <CardBody>
                  <div style={{ padding: 0 }}>
                    <DSTable
                      columns={[
                        { key: 'id', header: 'หมายเลขเคส' },
                        { key: 'subject', header: 'หัวข้อปัญหา' },
                        { key: 'customer', header: 'ลูกค้า' },
                        { key: 'date', header: 'วันที่แจ้ง' },
                        { 
                          key: 'priority', 
                          header: 'ความสำคัญ', 
                          render: (val: any) => {
                            const variant = val === 'High' ? 'destructive' : val === 'Medium' ? 'warning' : 'outline'
                            return <Badge variant={variant as any}>{val}</Badge>
                          } 
                        },
                        { 
                          key: 'status', 
                          header: 'สถานะ', 
                          render: (val: any) => {
                            const variant = val === 'Resolved' ? 'success' : val === 'In Progress' ? 'warning' : 'secondary'
                            return <Badge variant={variant as any}>{val}</Badge>
                          } 
                        },
                      ]}
                      data={MOCK_CASES}
                    />
                  </div>
                </CardBody>
              </Card>
            </>
          ) : (
            /* ── MAIN DASHBOARD VIEW ── */
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-20)', marginBottom: 'var(--space-32)' }}>
                {SUMMARY_STATS.map((stat, i) => (
                  <Card key={i}>
                    <CardBody>
                      <Statistic {...stat} />
                    </CardBody>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <span style={{ fontSize: '18px', fontWeight: 700 }}>ลูกค้าล่าสุด (Recent Activity)</span>
                </CardHeader>
                <CardBody>
                  <div style={{ padding: 0 }}>
                    <DSTable
                      columns={[
                        { key: 'customer', header: 'ชื่อลูกค้า / บริษัท' },
                        { key: 'contact', header: 'ชื่อผู้ติดต่อ' },
                        { key: 'plan', header: 'แพ็กเกจ' },
                        { key: 'date', header: 'วันที่ทำรายการ' },
                        { 
                          key: 'status', 
                          header: 'สถานะ', 
                          render: (val: any) => {
                            const variant = val === 'Active' ? 'success' : val === 'Pending' ? 'warning' : 'destructive'
                            return <Badge variant={variant as any}>{val}</Badge>
                          } 
                        },
                      ]}
                      data={MOCK_ACTIVITIES}
                    />
                  </div>
                </CardBody>
              </Card>
            </>
          )}

        </main>
      </div>
    </div>
  )
}
