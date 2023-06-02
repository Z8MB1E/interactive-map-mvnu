import Image from "next/image";
import Map from "./map";

export default function Home() {
  return (
    <main className="absolute inset-0 p-[100px] w-full h-full">
      <Map />
    </main>
  );
}
