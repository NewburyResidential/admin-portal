import PandaDocView from './components/View';

export default async function page({ params, searchParams }) {
  console.log(params);
  console.log(searchParams)
  const pandaParam = params?.pandadoc || '';
  const [sk, session] = pandaParam.split('_');
  const employee = params?.employee || '';
  
  return (
    <>
      <PandaDocView session={session} employee={employee} sk={sk} />
    </>
  );
}