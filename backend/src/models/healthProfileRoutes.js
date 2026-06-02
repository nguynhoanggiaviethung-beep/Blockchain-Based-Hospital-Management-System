import HealthProfilePanel from "../components/HealthProfilePanel"

// Trong JSX, khi bệnh nhân bấm nút cập nhật sức khỏe:
<HealthProfilePanel
  patientId={localStorage.getItem("userId")}
  onClose={() => setShowHealthPanel(false)}
/>