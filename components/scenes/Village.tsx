import ActionList from "@/components/ActionList";
import FooterMenu from "@/components/FooterMenu";
import {GameplayData} from "@/lib/utils/GameRenderer";
import {useBackButton} from "@tma.js/sdk-react";
import {useEffect} from "react";

import HeaderMenu from "@/components/HeaderMenu";

export default function Village({game}: { game: GameplayData | null }) {
  const backButton = useBackButton()
  useEffect(() => {
    backButton.hide();
  }, [backButton]);

  if (!game) {
    return <div>Something went wrong.</div>
  }

  return (
    <>
      <HeaderMenu character={game.character}/>
      <div className={"gameScreen"}>
        <div className={"title"}>Поселение</div>
        {/*<CurrentLocation location={game.currentLocation}/>*/}
        {/*<Scene log={game.currentLogs}/>*/}
        <ActionList actions={game.availableActions}/>
      </div>
      <FooterMenu/>
    </>
  )
}
