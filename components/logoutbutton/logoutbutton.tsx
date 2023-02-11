import { signOut } from "next-auth/react"

export default function LogOutButton( props ) {
    return (<button onClick={() => signOut()}>Logga ut</button>)
}
