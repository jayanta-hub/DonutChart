import DonutChart from "@/component/donutChart";
import styles from "./page.module.css";
const data = [
  { label: "A", value: 30, color: "#FF6384" },
  { label: "B", value: 50, color: "#36A2EB" },
  { label: "C", value: 20, color: "#FFCE56" },
  { label: "D", value: 90, color: "red" },
];
export default function Home() {
  return (
    <div className={styles.page}>
    <main className={styles.main}>
     <DonutChart
          data={data}
          size={600}
          innerRadius={120}
          outerRadius={150}
          paddingAngle={1}
        />
        </main>
    </div>
  );
}
