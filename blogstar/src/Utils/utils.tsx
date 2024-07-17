import Cookies from "js-cookie";

export function getAuthData() {
  if (typeof window !== "undefined") {
    const cookiesData = Cookies.get();

    const storedAuthData = {
      token: cookiesData.token,
    };

    if (storedAuthData.token) {
      return storedAuthData;
    } else {
      return null;
    }
  }
  return null;
}
