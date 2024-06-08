import UnauthorizedView from "../components/View";

export default async function page() {
  return <UnauthorizedView type={'login'} />;
}
