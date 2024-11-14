import { useContext } from "react"
import { AppContext } from "../../contexts/app.context"

export default function Profile() {

  const {profile} = useContext(AppContext);
  console.log(profile);

  return <>
    Profile
  </>
}