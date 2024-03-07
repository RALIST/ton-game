import {useEffect} from "react";
import {useBackButton} from "@tma.js/sdk-react";

export default function Bank () {
  const backButton = useBackButton()

  useEffect(() => {
    backButton.show()
  }, [backButton]);

  return <div className={"gameScreen"}>
    <div className={"title"}>Bank</div>
  </div>
}
