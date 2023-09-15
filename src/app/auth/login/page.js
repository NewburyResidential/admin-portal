import {options} from "src/app/api/auth/[...nextauth]/options"
import { getServerSession } from 'next-auth';
import Login from "src/components/auth/Login";

export default async function page({ searchParams }) {
    const {callbackUrl} = searchParams
    const session = await getServerSession( options );
  return (
    <>
    <Login session={session} params={callbackUrl} />
    </>
  )
}
