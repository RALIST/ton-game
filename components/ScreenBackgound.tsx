import Image from "next/image";
import bgImage from "@/assets/houses.png";
import footerImage from "@/assets/floor.png";

export default function ScreenBackground() {
  return (
    <>
      <div className={"bgImage"}>
        <Image src={bgImage} alt={""}></Image>
      </div>
      <div className={"footerImage"}>
        <Image src={footerImage} alt={""}></Image>
      </div>
    </>
  )
}
