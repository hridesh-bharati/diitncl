import { useEffect, useState } from "react";

export default function Time() {
  const [time, setTime] = useState(
    new Date().toLocaleTimeString("en-IN", { hour12: true })
  );

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-IN", { hour12: true }));
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return <span className="small text-uppercase">{time}</span>;
}
