const USER_KEY = "babycare_user";

export function getUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearUser() {
  localStorage.removeItem(USER_KEY);
}

export function authHeader() {
  const user = getUser();
  return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
}
