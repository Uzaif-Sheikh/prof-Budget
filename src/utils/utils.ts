
export const sessionActive = (): Boolean => {
  if (localStorage.getItem("sb-biplialgqmivfauamgdl-auth-token") || localStorage.getItem("user")) {

    if(!localStorage.getItem("user")) {
      const userData = JSON.parse(localStorage.getItem('sb-biplialgqmivfauamgdl-auth-token') || 'null');
      localStorage.setItem('user', JSON.stringify(userData.user));
      window.location.pathname = "/budget";
    }

    return true;
  }

  document.cookie.split(";").forEach(function (c) {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
  return false;
};
