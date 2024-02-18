import {AppUser} from "@/app/page";
import Link from "next/link";

export default function MainMenu({ user }: { user: AppUser | null }) {
  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className={"mainMenu"}>
      <p>Welcome, {user?.username}</p>
      <p>This game is on-chain, that why you have to import or create TON wallet</p>
      <Link href=""> Import wallet </Link>
      <Link href=""> Create wallet </Link>
    </div>
  )
}
