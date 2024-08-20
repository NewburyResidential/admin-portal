export default function isAuthorizedToViewContent(contentRoles, currentSessionRoles) {
  
  if (contentRoles) {
    if (currentSessionRoles.includes('admin')) {
      return true;
    }
    return contentRoles.includes('public') || currentSessionRoles.some((role) => contentRoles.includes(role));
  } else {
    return true;
  }
}
