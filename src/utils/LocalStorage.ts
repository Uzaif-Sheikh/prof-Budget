import create from 'zustand';




window.addEventListener("storage", () => {
  localStorage.clear();
  window.location.reload();
}, false);


const useUserInfo = create<any>((set: any) => ({
  userData: JSON.parse(localStorage.getItem('user') || 'null'),
  setUserData: (userData: any) => {
    set({ userData });
    localStorage.setItem('user', JSON.stringify(userData));
  },
  clearLocalStorage: () => {
    localStorage.clear();
    document.cookie.split(";").forEach(function (c) {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  }
}))


export default useUserInfo;