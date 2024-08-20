export default function isAdmin(session) {
  const currentSessionRoles = session?.user?.roles || [];

  if (currentSessionRoles) {
    if (currentSessionRoles.includes('admin')) {
      return true;
    }
  } else {
    return false;
  }
}
