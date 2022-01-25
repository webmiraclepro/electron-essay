export default function authHeader() {
  const userStr = localStorage.getItem("user");
  if(userStr !== null)
  {
    let user = userStr !== null ? JSON.parse(userStr) : "{}";  
    return user.value.accessToken;
  }
  return 'hehe-kill-me';
}