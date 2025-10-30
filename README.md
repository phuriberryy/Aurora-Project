✈️ Aurora Airways Project

นี่คือโปรเจกต์ React สำหรับจำลองการจองตั๋วเครื่องบิน สร้างขึ้นโดยใช้ Create React App, Redux Toolkit, React Router, และ Styled-Components

🚀 วิธีการรันโปรเจกต์

1. ติดตั้ง Dependencies

(ทำครั้งแรกเท่านั้น)

npm install


2. ตั้งค่า Environment //ยังใส่ .env ไม่ได้ เดี๋ยวแก้

(สำคัญมาก!)

โปรเจกต์นี้ต้องการไฟล์ .env เพื่อกำหนดค่า API

สร้างไฟล์ใหม่ชื่อ .env (ที่ root ของโปรเจกต์ ระดับเดียวกับไฟล์นี้)

คัดลอกเนื้อหาจาก .env.example (ไฟล์ตัวอย่าง) ไปวางใน .env

(ไฟล์ .env ของคุณควรจะมีหน้าตาแบบนี้):

REACT_APP_API_BASE_URL=[https://api.aurora-airways.dev/v1](https://api.aurora-airways.dev/v1)


3. รันโปรเจกต์

หลังจากติดตั้งและตั้งค่า .env แล้ว ให้รันคำสั่งนี้:

npm start


แอปพลิเคชันจะเปิดที่ http://localhost:3000

👩‍💻 โครงสร้างทีม (Owners)

A (Search/Discovery): HomePage, SearchBar, searchSlice

B (Flights Results/Detail): FlightsPage, FlightList, FlightCard, flightsSlice

C (Booking Flow): BookingPage, BookingForm, Summary, bookingSlice

D (Shell & UI/Kit): Layout, Navbar, Router, Theme, UI Kit (Button, Modal...), uiSlice
