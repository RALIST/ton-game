import {useEffect} from "react";
import {useBackButton} from "@tma.js/sdk-react";

export default function Shop () {
  const backButton = useBackButton()

  useEffect(() => {
    backButton.show()
  }, [backButton]);

  return <div className={"gameScreen"}>
    <div className={"title"}>Shop</div>
  </div>
}
