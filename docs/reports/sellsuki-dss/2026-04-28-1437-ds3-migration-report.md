# รายงานการอัปเกรดไปใช้ DS3

## สรุปงาน
- งาน: อัปเกรดโปรเจกต์ให้ย้ายจาก DS เดิมไปอยู่บน DS3 package line และเทียบกับ source repo / Storybook ของ DS3
- วันที่: 2026-04-28 14:37
- พื้นที่ทำงาน: `c:\Users\uSeR\Desktop\Sellsuki\AMS\sellsuki-ams-deployed`

## เวอร์ชัน Sellsuki Design System
- สถานะเวอร์ชัน: `explicit`
- เวอร์ชันที่ใช้ในโปรเจกต์: `@uxuissk/design-system@0.8.16`
- MCP endpoint ที่ตั้งค่าไว้: `https://ds3-mcp.vercel.app/api/mcp`
- หลักฐาน:
  - `C:\Users\uSeR\.codex\config.toml` ชี้ `sellsuki_design_system` ไปที่ DS3 MCP
  - source repo DS3: `https://github.com/BearyCenter/Design-system-SSK-3.git`
  - source repo DS3 `package.json` ระบุ `@uxuissk/design-system` เวอร์ชัน `0.8.16`
  - source repo DS3 มี Storybook script (`storybook`, `build-storybook`) และอ้างอิง Storybook docs ที่ `https://sellsukidesignsystemv12.vercel.app`

## Components ที่ใช้ในงานนี้
- `TopNavbar`
- `Sidebar`
- `Breadcrumb`
- `DSButton`
- `DSInput`
- `DSTable`
- `Card`
- `CardHeader`
- `CardBody`
- `Badge`
- `StatCard`
- `ToastContainer`
- `ConfirmDialog`
- `Divider`

## Tokens ที่ใช้ในงานนี้
- หมวดหมู่: `spacing`
  - `--space-4`
  - `--space-12`
  - `--space-20`
  - `--space-24`
  - `--space-32`
- หมวดหมู่: `typography`
  - `--text-h3`
  - `--text-p`
  - `--weight-h3`
- หมวดหมู่: `color`
  - `--background`
  - `--foreground`
  - `--text-secondary`

## สิ่งที่อัปเดตในโปรเจกต์
- อัปเดต dependency จาก `@uxuissk/design-system@^0.7.1` เป็น `^0.8.16`
- ติดตั้ง package ใหม่และยืนยันว่า production build ผ่าน
- ปรับ `DSInput` จาก prop `size` ไปใช้ `inputSize` ตาม type ของ package ที่ publish จริง
- เขียน `DashboardPage` ใหม่ให้ใช้ชุด component ที่มีอยู่จริงใน package ที่ publish ได้แก่ `TopNavbar`, `Sidebar`, `Breadcrumb`, `StatCard`, `DSTable`, `Card`, `Badge`

## ผลการเทียบกับ DS3 source repo / Storybook
- ตรงกัน:
  - package หลักยังใช้ชื่อ `@uxuissk/design-system`
  - ต้อง import `@uxuissk/design-system/styles.css` ก่อน style อื่น
  - component หลักที่โปรเจกต์ใช้ เช่น `TopNavbar`, `Sidebar`, `DSButton`, `DSInput`, `DSTable`, `Card`, `Badge`, `Breadcrumb`, `StatCard` มีอยู่ในสาย DS3
- ไม่ตรงกันระหว่าง source repo/Storybook กับ package npm ที่ publish:
  - source repo มี `PageHeader` แต่ package npm `0.8.16` ที่ติดตั้งจริงไม่มี export นี้
  - source repo `TopNavbar` รองรับ `searchMode` และ `onSidebarToggle` แต่ package npm ที่ publish ยังรองรับแค่ `showSearch`
  - source repo `Sidebar` มี props เพิ่ม เช่น `showCollapseToggle`, `accountSwitcher`, `utilityItems`, `version` แต่ package npm ที่ publish ยังไม่มี
- ข้อสรุป:
  - โปรเจกต์นี้อัปเกรดเป็น DS3 package line ที่ publish ใช้งานจริงแล้ว
  - แต่ยังไม่สามารถอ้างว่า parity `100%` กับ source repo / Storybook ได้ เพราะ upstream package ที่ publish ยังไม่เท่ากับ API ใน source repo ทุกจุด

## ข้อเสนอแนะ
- หากต้องการ parity 100% กับ Storybook/repo DS3 จริง ๆ ต้องให้ upstream publish package รุ่นที่รวม `PageHeader`, `searchMode`, `onSidebarToggle` และ Sidebar props ชุดใหม่ก่อน
- ระหว่างนี้ baseline ที่ปลอดภัยที่สุดคือยึด package npm `0.8.16` เป็น source of truth สำหรับโค้ด production และใช้ source repo/Storybook เป็น reference สำหรับ gap analysis

## สถานะการส่งขึ้น GitHub
- วิธีที่ใช้: `markdown-commit`
- เป้าหมาย: `https://github.com/mmonsicha/sellsuki-ams-deployed.git`
- ผลลัพธ์: `สำเร็จ` push ขึ้น `origin/main` แล้วใน commit `cb239e2`
