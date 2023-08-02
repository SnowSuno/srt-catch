import axios, { AxiosResponse } from "axios";

const instance = axios.create({
  baseURL: "https://srtplay.com",
  withCredentials: true,
});

const parseCookies = (res: AxiosResponse) => Object.fromEntries(
  res.headers["set-cookie"]
    ?.map(x => x.split(";"))
    ?.flat()
    ?.map(x => x.split("="))
  || []
);

const test = async () => {
  const mainPageRes = await instance.get("/");

  const cookies = parseCookies(mainPageRes);
  const csrfToken = cookies?.["XSRF-TOKEN"];
  console.log(csrfToken);

  if (!csrfToken) throw new Error("No CSRF token found");

  const loginRes = await instance.postForm("/login", {
    _csrf: csrfToken,
    userLoginId: "percy3368@gmail.com",
    srtplayPw: "rnjstnsgh0115",
    "remember-me": "off"
  });

  console.log(parseCookies(loginRes));
};

test();
