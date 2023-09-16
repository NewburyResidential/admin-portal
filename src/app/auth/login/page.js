import Login from "src/components/auth/Login";
export default async function page({ searchParams }) {
const redirectedFrom = searchParams?.redirectedFrom || "/dashboard"
  return <Login redirectPath={redirectedFrom} />
}
