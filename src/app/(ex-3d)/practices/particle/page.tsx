"use client";

import { useEffect } from "react";
import { App } from "./_app";
import "./page.scss";

function Particle() {
  useEffect(() => {
    const app = new App();

    return () => {
      app.destroy();
    };
  }, []);

  return (
    <div className="particle h-full w-full" id="craft">
      <svg className="svg-particles hidden" xmlns="http://www.w3.org/2000/svg">
        <path d="m-182.94 336.4c14.29-0.0356 29.141-0.16346 43.089-3.7798 3.6261-0.94011 6.9572-2.8397 10.583-3.7798 3.2083-0.83177 6.6298-0.63984 9.8274-1.5119 2.3943-0.65299 4.5357-2.0159 6.8036-3.0238 4.2837-1.2599 8.497-2.7902 12.851-3.7798 12.257-2.7857-8.7975 5.4098 10.583-1.5119 1.3837-0.49418 2.4371-1.6711 3.7798-2.2678 0.94941-0.42198 2.078-0.32604 3.0238-0.75596 3.6989-1.6813 6.9069-4.3176 10.583-6.0476 2.4556-1.1556 5.2766-1.5562 7.5595-3.0238 1.3572-0.87251 1.9444-2.5804 3.0238-3.7798 1.7919-1.991 4.3044-3.2579 6.0476-5.2917 3.4941-4.0764 2.0028-7.5006 3.0238-12.095 0.24446-1.1001 1.2674-1.9237 1.5119-3.0238 0.68612-3.0875 0.46541-15.506 0-18.143-0.7483-4.2404-3.4262-7.9347-4.5357-12.095-3.5901-13.463 3.6276 5.0169-3.0238-13.607-0.30558-0.85561-1.2508-1.3976-1.5119-2.2679-1.6788-5.5959-1.5524-11.663-2.2679-17.387-1.423-11.384-3.9573-27.556 0.75595-38.554 1.4554-3.396 3.8925-6.198 6.0476-9.0714 0.88158-1.1754 1.5119-2.5198 2.2679-3.7798 1.0079-1.5119 1.9159-3.0955 3.0238-4.5357 9.1459-11.89-0.3141 1.4021 9.8274-10.583 1.1737-1.3871 1.7389-3.2508 3.0238-4.5357 4.0908-4.0908 10.297-6.5176 14.363-10.583 4.6141-4.6141-5.3518 0.0301 3.7798-4.5357 1.4254-0.71272 3.1912-0.65629 4.5357-1.5119 1.5032-0.9566 2.3733-2.6858 3.7798-3.7798 1.0211-0.79423 8.2574-5.6858 9.0714-6.0476 6.1971-2.7543-0.38111 1.2968 6.8036-0.75595 2.3863-0.68179 4.4173-2.342 6.8036-3.0238 5.4663-1.5618 11.003-2.9758 16.631-3.7798 2.7553-0.39361 5.6062-0.11848 8.3155-0.75595 1.6454-0.38716 2.8886-1.8878 4.5357-2.2679 2.4745-0.57105 12.382-0.49903 15.875 0 2.8188 0.40269 3.9413 2.2 6.0476 3.7798 0.20159 0.15119 0.50397 0 0.75595 0 0.50397 0.25199 1.1135 0.35753 1.5119 0.75595 0.39842 0.39842 0.28713 1.1994 0.75595 1.5119 1.6226 1.0817 1.3292-1.1213 2.2679 0.75595 0.35636 0.71272 0.1925 1.7044 0.75595 2.2679 0.79685 0.79684 2.1343 0.82005 3.0238 1.5119 6.4804 5.0403 9.9475 10.824 13.607 18.143 1.9273 3.8546 1.5387 8.5095 3.7798 12.095 0.56661 0.90657 1.6748 1.3783 2.2679 2.2678 0.87933 1.319 4.1527 8.5826 4.5357 9.8274 0.45076 1.465 0.1867 3.1126 0.75595 4.5357 0.46792 1.1698 1.6705 1.9145 2.2679 3.0238 0.28525 0.52974 4.7665 10.73 5.2917 12.095 1.1442 2.9749 2.3987 5.946 3.0238 9.0714 0.19767 0.98836-0.21865 2.0399 0 3.0238 1.4813 6.6659 5.2004 12.224 8.3155 18.143 3.1672 6.0178 4.5574 12.895 7.5595 18.899 2.0316 4.0631 4.9191 7.6427 7.5595 11.339 7.6394 10.695-0.54049 0.16159 5.2917 4.5357 1.4537 1.0902 1.5895 3.4201 3.0238 4.5357 1.3343 1.0378 3.0756 1.4161 4.5357 2.2678 5.6225 3.2798 11.443 6.4298 17.387 9.0714 0.94941 0.42196 2.0744 0.33398 3.0238 0.75594 3.6597 1.6265 7.0106 4.2613 10.583 6.0476 1.1492 0.57459 2.5491 0.38674 3.7798 0.75594 3.2828 0.98485 6.6064 1.8525 9.8274 3.0238 1.0591 0.3851 1.9237 1.2674 3.0238 1.5119 1.2299 0.27332 2.5276-0.13914 3.7798 0 4.1304 0.45892 8.0439 2.0978 12.095 3.0238 12.083 2.7618 23.299 4.6886 35.53 6.0476 9.0472 1.0052 18.174 1.2043 27.214 2.2678 4.8138 0.56634 9.532 1.8762 14.363 2.2679 4.5208 0.36656 9.0714 0 13.607 0h37.798c31.519 0 62.994-0.11906 94.494 0.75594 5.6883 0.15801 11.698-0.51718 17.387 0 3.0529 0.27755 6.0165 1.2573 9.0714 1.5119 1.5067 0.12555 3.0482-0.27046 4.5357 0 1.3351 0.24273 2.4491 1.2458 3.7798 1.5119 2.1499 0.42997 5.3124 0 7.5595 0 8.0491 0-2.7327-0.19767 6.8036 0.75594 4.245 0.4245 7.9676-0.75594 12.095-0.75594" />
        <path d="m-31.75-133.8c-31.354 52.8-75.702 67.387-127 93.738-1.7849 0.9169-87.854 47.042-96.006 51.405-3.7768 2.0214-7.4847 4.1787-11.339 6.0476-4.4662 2.1654-9.351 3.4939-13.607 6.0476-19.558 11.735 8.8171-0.56857-11.339 9.0714-7.6416 3.6547-15.681 6.416-23.435 9.8274-4.1259 1.8154-7.8446 4.5474-12.095 6.0476-2.4232 0.85526-5.0982 0.7735-7.5595 1.5119-6.0751 1.8225-14.006 7.5595-20.411 7.5595" />
        <path d="m197.3-129.27c13.071 31.807 42.638 63.933 66.524 86.935 27.653 26.629 59.757 51.144 95.25 66.524 5.4679 2.3694 12.4 4.4068 18.143 6.0476 1.4738 0.42108 3.0727 0.29877 4.5357 0.75595 9.7227 3.0383 4.7953 2.4484 12.851 5.2917 8.6094 3.0386 16.486 5.2787 24.946 9.0714 9.6766 4.3378 20.202 8.4516 29.482 13.607 5.0484 2.8047 9.8332 6.6688 15.119 9.0714 3.1566 1.4348 12.502 3.405 15.875 3.7798 1.0018 0.11131 2.0399-0.21865 3.0238 0 2.3336 0.51858 4.47 1.7493 6.8036 2.2679 4.6174 1.0261 10.354 1.5119 15.119 1.5119" />
        <path d="m-752.93-190.5c3.7874 12.242 4.2548 25.523 7.5595 37.798 4.682 17.39 11.742 34.072 16.631 51.405 7.3108 25.92 14.724 51.864 24.19 77.107 9.9888 26.637 23.458 51.88 33.262 78.619 7.9606 21.711 12.36 43.129 19.655 65.012 2.2198 6.6592 5.4115 12.972 7.5595 19.655 7.8503 24.423 12.677 48.818 22.679 72.571 6.1113 14.514 12.886 30.388 21.167 43.845 6.3821 10.371 15.063 19.557 21.167 30.238 5.5434 9.701 8.5472 20.642 16.631 28.726 4.2912 4.2911 9.316 7.8041 13.607 12.095 8.0792 8.0792 14.283 17.953 22.679 25.702 3.1856 2.9405 7.147 4.9162 10.583 7.5595 6.8025 5.2327 12.746 11.54 19.655 16.631 5.8514 4.3116 12.302 7.7689 18.143 12.095 7.7792 5.7624 14.893 12.389 22.679 18.143 19.812 14.644 3.9614 1.541 24.19 12.095 25.553 13.332 49.753 29.412 75.595 42.333 21.208 10.604 23.819 10.6 45.357 16.631 5.5333 1.5493 11.339 2.2968 16.631 4.5357 7.8904 3.3382 14.966 8.3636 22.679 12.095 7.9227 3.8336 16.318 6.6472 24.19 10.583 11.296 5.6481 21.71 13.038 33.262 18.143 15.163 6.6998 35.275 11.021 51.405 16.631 25.924 9.017 51.511 19.128 77.107 28.726 7.6463 2.8674 19.787 2.0598 27.214 4.5357 6.8454 2.2818 12.706 7.1258 19.655 9.0714 5.8438 1.6363 12.23 0.14732 18.143 1.5119 7.3002 1.6847 13.963 5.5013 21.167 7.5595 15.092 4.3119 31.632 5.0618 46.869 9.0714 15.604 4.1063 7.3934 4.8998 21.167 6.0476 4.52 0.37666 9.1595-0.88953 13.607 0 9.8133 1.9626-3.3695 1.5119 6.0476 1.5119" />
        <path d="m615.35-299.36c-7.5001 14.55-15.412 27.959-25.702 40.821-9.4074 11.759-2.6458 0.88194-10.583 10.583-9.1564 11.191-12.033 16.569-22.679 27.214-2.2818 2.2818-5.4008 3.649-7.5595 6.0476-7.5623 8.4025-13.527 18.811-21.167 27.214-6.8454 7.53-15.453 13.941-22.679 21.167-5.0648 5.0648-9.634 10.671-13.607 16.631-1.8753 2.8129-2.3356 6.5046-4.5357 9.0714-1.0372 1.21-3.4088 0.385-4.5357 1.5119-3.5636 3.5636-5.8161 8.248-9.0714 12.095-2.3019 2.7204-5.5828 4.5944-7.5595 7.5595-2.129 3.1935-2.4602 7.3548-4.5357 10.583-10.56 16.427-7.6142 4.4213-16.631 21.167-4.2148 7.8275-11.821 29.141-13.607 36.286-1.487 5.948-0.55459 12.531-3.0238 18.143-3.2092 7.2936-10.044 12.528-13.607 19.655-4.0631 8.1262-5.459 17.366-9.0714 25.702-2.9586 6.8275-7.5866 12.844-10.583 19.655-7.8052 17.739-10.9 36.817-12.095 55.94-0.22005 3.5209 0.65014 7.116 0 10.583-0.88109 4.6992-3.5981 8.9189-4.5357 13.607-2.3651 11.826-2.1707 24.342-3.0238 36.286-1.7648 24.707-4.4071 49.184-3.0238 74.083 1.2889 23.2 1.7394 46.428 3.0238 69.548 0.3075 5.5351-0.64773 11.125 0 16.631 0.3724 3.1655 2.2508 5.9792 3.0238 9.0714 1.9761 7.9044 2.5596 16.286 4.5357 24.19 0.27332 1.0933 1.0079 2.0159 1.5119 3.0238 1.0079 2.5199 2.4136 4.9151 3.0238 7.5595 5.1069 22.13 4.5357 37.807 4.5357 60.476 0 6.147 1.2061 13.624 0 19.655-1.5543 7.7715-8.0461 12.069-12.095 18.143-0.88403 1.326-0.51634 3.2913-1.5119 4.5357-1.1351 1.4189-3.1561 1.8413-4.5357 3.0238-2.1646 1.8553-3.7278 4.3906-6.0476 6.0476-1.2968 0.92631-3.2608 0.55571-4.5357 1.5119-2.8509 2.1382-4.8539 5.2404-7.5596 7.5595-1.8495 1.5853-5.6313 2.0597-7.5595 3.0238-2.767 1.3835-4.5201 4.5279-7.5595 6.0476-1.4254 0.71274-3.1692 0.69197-4.5357 1.5119-3.213 1.9278-3.1727 3.1728-4.5357 4.5357-1.1269 1.1269-3.4088 0.38499-4.5357 1.5119-0.35637 0.35635 0.35637 1.1556 0 1.5119-2.944 2.944-11.573 9.5664-16.631 12.095-1.5504 0.7752-4.4972 0.7367-6.0476 1.5119-1.9272 0.96358-4.0491 3.8695-6.0476 4.5357-1.4406 0.48017-7.932 0.65736-9.0714 1.5119-1.4537 1.0902-1.7389 3.2508-3.0238 4.5357-0.84656 0.84659-6.5747-0.32827-7.5595 0-1.3523 0.45077-1.7489 2.3863-3.0238 3.0238-0.90151 0.45077-2.088-0.37434-3.0238 0-3.1389 1.2556-5.7916 3.7158-9.0714 4.5357-12.211 3.0526-25.246 3.4898-37.798 4.5357-16.22 1.3517-32.271 4.9736-48.381 6.0476-13.007 0.86714-26.327-1.1802-39.31 0-7.0979 0.64526-14.055 2.5497-21.167 3.0238-4.5257 0.30173-9.1112-0.59944-13.607 0-3.1594 0.42127-5.9657 2.3071-9.0714 3.0238-9.8496 2.273-20.362 1.3777-30.238 3.0238-1.572 0.26199-2.9486 1.3676-4.5357 1.5119-14.056 1.2778-28.386 1.3172-42.333 4.5357-20.902 4.8236 4.3057 1.6177-21.167 6.0476-1.887 0.32816-41.161 5.3447-43.845 6.0476-14.339 3.7553-27.976 9.9257-42.333 13.607-15.049 3.8586-39.817 3.2954-55.94 4.5357-7.1062 0.54663-14.222 1.4212-21.167 3.0238-3.1058 0.7167-5.9161 2.573-9.0714 3.0238-32.991 4.713-67.979 3.4251-101.3 4.5357-5.5406 0.18471-11.118-0.58033-16.631 0-4.133 0.43506-7.9565 2.6476-12.095 3.0238-8.4789 2.6595-17.154-0.56991-25.702 0-21.613 1.4409-47.019 4.2033-68.036 0-11.052-2.2103-23.656 1.3897-34.774 0-4.8618-0.60772-10.533-3.7714-15.119-4.5357-6.4624-1.0771-13.179 0.99624-19.655 0-7.6842-1.1822-18.824-5.3195-25.702-9.0714-15.406-8.4034-7.5595-11.283-7.5595-27.214 0-2.0159 0.79407-4.1947 0-6.0476-0.84227-1.9653-3.4356-2.7022-4.5357-4.5357-3.6576-6.096-14.925-28.801-16.631-34.774-4.3615-15.265 8.5904-29.499 19.655-37.798 8.4667-6.35 3.4471 0.0605 13.607-7.5595 4.7858-3.5893 2.9115-4.4983 7.5595-6.0476 4.6889-1.563 26.423-0.63593 30.238 0 2.677 0.44616 4.9848 2.1656 7.5595 3.0238 1.6623 0.5541 6.3558 0.70943 7.5595 1.5119 7.1257 4.7505 13.219 38.946 7.5596 46.869-17.626 24.676 0.7639-2.2758-9.0714 7.5595-3.2855 3.2855-5.6178 7.4751-9.0714 10.583-4.819 4.3371-36.651 17.212-39.31 18.143-3.3635 1.1772-7.1046 0.73885-10.583 1.5119-3.7467 0.83259-6.8435 3.6726-10.583 4.5357-9.4458 2.1798-19.22 2.6346-28.726 4.5357-7.0756 1.4151-13.976 3.9365-21.167 4.5357-24.944 2.0787-50.324 1.5119-75.595 1.5119-23.623 0-49.391 2.3181-72.571 0-7.671-0.76711-15.024-3.6172-22.679-4.5357-5.0038-0.60047-10.086 0.26488-15.119 0-13.172-0.69326-26.149-3.6583-39.31-4.5357-6.5371-0.4358-13.108 0.26185-19.655 0-12.78-0.51121-22.604-4.5357-34.774-4.5357" />
        <path d="m-387.05-353.79c5.8404 45.379-13.838 99.082-25.702 140.61-4.6417 16.246-8.3056 32.92-15.119 48.381-14.629 33.197-41.958 69.046-66.524 95.25-12.293 13.113-20.443 29.675-34.774 40.821-4.0957 3.1855-9.4345 4.4754-13.607 7.5595-57.842 42.753 28.62-11.566-60.476 45.357-19.817 12.661-42.723 20.91-63.5 31.75-16.171 8.4372-31.539 18.484-48.381 25.702-19.098 8.1848-47.325 21.004-68.036 24.19-2.4906 0.38316-5.05-0.22813-7.5595 0-6.1059 0.55508-12.027 2.587-18.143 3.0238-9.9276 0.70912-17.407-0.99435-25.702 4.5357" />
        <path d="m-241.9-305.4c4.711 16.489 2.9536 10.918 10.583 33.262 4.4807 13.122 9.6487 26.021 13.607 39.31 7.2011 24.175 11.711 49.641 18.143 74.083 1.3954 5.3024 1.3415 11.584 3.0238 16.631 0.52202 1.5661 2.2738 3.0358 3.0238 4.5357 0.45077 0.90152-0.31873 2.0676 0 3.0238 1.4868 4.4605 1.537 1.5871 3.0238 6.0476 2.5241 7.5722 3.0382 17.408 7.5595 24.19 0.27955 0.41933 1.1555-0.35636 1.5119 0 1.4693 1.4693 0.35929 4.3187 1.5119 6.0476 0.27955 0.41933 1.0611-0.22538 1.5119 0 3.0688 1.5344 4.3431 5.855 6.0476 7.5595 2.2752 2.2752 6.3859 3.1929 9.0714 4.5357 2.5499 1.275 3.7669 4.3371 6.0476 6.0476 0.40317 0.30238 1.0079 0 1.5119 0 1.5119 0.50397 3.4088 0.385 4.5357 1.5119 0.71271 0.71272-0.71272 2.3111 0 3.0238 3.4228 3.4229 8.3163 5.0403 12.095 7.5595 0.41933 0.27955 0 1.0079 0 1.5119 0.50397 0.50397 0.91889 1.1166 1.5119 1.5119 3.4018 2.2679 5.2917 1.5119 9.0714 4.5357 0.87996 0.70397 0.61038 2.3477 1.5119 3.0238 1.275 0.95621 3.1691 0.69196 4.5357 1.5119 3.7728 2.2637 8.3177 5.0412 12.095 7.5595 1.7009 1.1339 2.6458 3.7798 4.5357 4.5357 1.4038 0.56151 3.0532-0.29651 4.5357 0 4.2643 0.85287 7.8309 5.1948 12.095 6.0476 9.658 1.9316 19.021 5.1332 28.726 7.5595 2.6329 0.65823 4.8825 2.5776 7.5595 3.0238 1.9884 0.33141 4.0919-0.48892 6.0476 0 22.156 5.539 43.071 16.41 65.012 22.679 16.169 4.6198 34.167 7.0547 49.893 13.607 11.638 4.849 3.5562 3.29 12.095 7.5595 6.8114 3.4057 15.977 7.0563 22.679 10.583 5.2009 2.7373 9.8206 6.5282 15.119 9.0714 11.221 5.3862 22.747 10.4 34.774 13.607 15.882 4.2351 5.9954-2.294 22.679 6.0476 21.415 10.707 40.483 25.762 61.988 36.286 12.61 6.1708 26.392 9.622 39.31 15.119 10.786 4.5898 20.976 10.502 31.75 15.119 30.993 13.283 63.882 21.197 95.25 33.262 1.696 0.65229 2.8486 2.349 4.5357 3.0238 2.5199 1.0079 2.5199-0.50397 4.5357 0 7.0824 1.7706 14.016 4.5154 21.167 6.0476 9.9659 2.1355 20.205 2.744 30.238 4.5357 33.91 6.0553 16.17 4.9566 58.964 9.0714 43.24 4.1577 36.27 1.4749 75.595 6.0476 10.619 1.2348 21.132 3.2866 31.75 4.5357 11.452 1.3473 21.981 1.1437 33.262 3.0238 4.5831 0.76386 9.0034 2.396 13.607 3.0238 21.322 2.9075 43.567 1.5119 65.012 1.5119 17.036 0 30.326-1.5279 46.869-4.5357 5.4664-0.99388 13.088-0.49631 18.143-3.0238" />
        <path d="m742.35 601.74c-54.495 1.8792-51.384 4.7228-114.9-10.583-14.634-3.5263-53.465-13.645-71.06-28.726-4.8702-4.1745-8.7797-9.3832-13.607-13.607-1.3675-1.1966-3.4455-1.5702-4.5357-3.0238-2.0284-2.7046-2.5707-6.3204-4.5357-9.0714-0.65501-0.917-2.444-0.54557-3.0238-1.5119-1.0691-1.7818-0.58264-4.1891-1.5119-6.0476-0.63749-1.275-2.3863-1.7489-3.0238-3.0238-0.92927-1.8585-0.85481-4.0763-1.5119-6.0476-2.2014-6.6042-1.0854 1.0663-4.5357-7.5595-1.1385-2.8463-0.54251-6.1632-1.5119-9.0714-2.2014-6.6041-1.0854 1.0663-4.5357-7.5595-0.93583-2.3396 0.49419-5.0886 0-7.5595-0.62807-3.1404-3.4949-7.9813-4.5357-10.583-1.9229-4.8073 0.40913-13.732 1.5119-18.143 0.36669-1.4668-0.83865-3.2777 0-4.5357 0.79068-1.186 2.2904-1.8015 3.0238-3.0238 2.3812-3.9686 1.1603-10.232 4.5357-13.607 0.79684-0.79685 2.3987-0.57428 3.0238-1.5119 0.55909-0.83865-0.31874-2.0676 0-3.0238 1.2817-3.8451 5.804-7.0723 7.5595-10.583 1.219-2.438 1.7708-5.0536 3.0238-7.5595 2.2278-4.4557-0.47908-11.137 1.5119-15.119 1.1269-2.2538 3.5431-3.7315 4.5357-6.0476 0.59558-1.3897-0.32797-3.0598 0-4.5357 8.2873-24.862-1.0625 6.3748 3.0238-18.143 0.52401-3.144 2.3987-5.946 3.0238-9.0714 1.4984-7.4921 2.0685-16.548 3.0238-24.19 2.5632-20.505 5.9756-41.396 7.5595-61.988 0.62995-8.1895-0.94496-14.174 0-22.679 1.8481-16.633 6.436-33.041 7.5595-49.893 1.3301-19.952 0-40.465 0-60.476 0-5.3229-1.0286-13 0-18.143 4.1541-20.77 2.8937 8.1293 4.5357-18.143 1.7699-28.318 0.65585-57.998-1.5119-86.179-0.76404-9.9324-0.28189-20.398-1.5119-30.238-2.2227-17.782-10.825-34.227-15.119-51.405-4.1088-16.435 2.131-8.7161-6.0476-25.702-10.388-21.575-23.598-40.539-36.286-60.476-3.2693-5.1374-3.821-11.824-7.5595-16.631-1.9812-2.5472-5.131-3.9226-7.5595-6.0476-8.9186-7.8038-15.298-16.02-25.702-22.679-7.7924-4.9871-16.288-8.7968-24.19-13.607-18.205-11.081-36.183-23.283-55.94-31.75-19.435-8.3292-37.255-11.879-57.452-16.631-12.82-3.0165-24.976-8.8899-37.798-12.095-4.1796-1.0449-11.535 0.21085-15.119 0-17.196-1.0115-34.176-1.5119-51.405-1.5119-9.4939 0-19.504-0.37801-27.214 6.0476-0.86572 0.72143-0.64619 2.3024-1.5119 3.0238-3.3305 2.7754-6.9761 5.1547-10.583 7.5595-13.092 8.728 1.1114-3.446-12.095 7.5595-9.3432 7.786-17.535 23.461-25.702 33.262-9.9987 11.998-25.632 19.18-34.774 31.75-1.9884 2.7341-2.3095 6.5272-4.5357 9.0714-1.4842 1.6962-4.4539 1.4301-6.0476 3.0238-4.5152 4.5152-12.288 24.158-16.631 30.238-5.8668 8.2135-13.788 14.465-19.655 22.679-6.6903 9.3665-17.351 30.329-21.167 40.821-1.2538 3.448-1.5337 7.2306-3.0238 10.583-0.57892 1.3026-2.2904 1.8015-3.0238 3.0238-3.8517 6.4195-4.8374 14.816-9.0714 21.167-0.79069 1.186-2.573 1.6715-3.0238 3.0238-0.63748 1.9124 0.63747 4.1352 0 6.0476-0.18164 0.54492-24.605 20.435-25.702 21.167-2.2581 1.5054-5.1871 1.7058-7.5595 3.0238-5.023 2.7906-8.4677 8.0136-13.607 10.583-1.3523 0.67614-3.1461-0.59557-4.5357 0-8.1758-3.0257-4.3721 5.9658-7.5595 7.5595-1.3523 0.67614-3.0532-0.29651-4.5357 0-3.9842 0.79684-6.9492 4.2305-10.583 6.0476-10.172 5.0861-21.796 8.0082-31.75 13.607-3.7785 2.1254-6.7774 5.4836-10.583 7.5595-6.2808 3.4259-15.929 5.3098-22.679 7.5595-3.2937-0.56511-0.50396 2.5198-1.5119 3.0238-0.43197 0.21599-3.5638-0.10799-4.5357 0-9.564 1.0627-21.614 1.7357-30.238 6.0476" />
        <path d="m-902.61 376.46c85.012 1.8292 46.269 4.3007 163.29-24.19 43.153-10.507 87.502-21.065 127-42.333 2.2186-1.1947 4.0318-3.0238 6.0476-4.5357 4.5357-2.5198 9.0289-5.1178 13.607-7.5595 2.983-1.5909 6.0476-3.0238 9.0714-4.5357 4.5357-2.0159 9.2148-3.7359 13.607-6.0476 18.158-9.5569 34.556-24.404 46.869-40.821 5.4083-7.211 3.436-18.188 9.0714-25.702 6.5213-8.6951 12.592-14.939 18.143-24.19 1.2964-2.1608 3.5123-3.745 4.5357-6.0476 3.7727-8.4886 4.9143-19.66 6.0476-28.726 1.7418-13.934 6.2363-27.78 10.583-40.821 0.60378-1.8113 0.53634-8.6322 1.5119-10.583 0.31872-0.63748 1.3721-0.81303 1.5119-1.5119 0.39534-1.9767-0.63749-4.1352 0-6.0476 0.92927-2.7878 3.3422-4.8742 4.5357-7.5595 2.8337-6.3758 0.31713-7.9013 3.0238-15.119 1.4354-3.8276 7.4756-8.2652 9.0714-12.095 1.5984-3.8362 1.1653-8.3782 3.0238-12.095 2.6536-5.3073 13.08-13.947 16.631-18.143 10.157-12.004 4.7477-8.264 13.607-19.655 1.3127-1.6878 3.6673-2.5818 4.5357-4.5357 1.245-2.8013 0.5425-6.1632 1.5119-9.0714 1.0691-3.2072 3.3986-5.8877 4.5357-9.0714 1.3977-3.9137 1.626-8.1815 3.0238-12.095 3.3607-9.41 9.7534-21.806 15.119-30.238 1.7325-2.7225 4.6045-4.6732 6.0476-7.5595 0.67614-1.3523-0.67615-3.1834 0-4.5357 0.9562-1.9124 3.5795-2.6233 4.5357-4.5357 0.67614-1.3523-0.83865-3.2777 0-4.5357 1.3978-2.0966 4.3883-2.6393 6.0476-4.5357 3.5897-4.1025 5.4817-9.5047 9.0714-13.607 6.4293-7.3478 15.576-14.71 22.679-21.167 14.562-13.238 27.062-14.194 42.333-22.679 2.2027-1.2237 3.9108-3.2002 6.0476-4.5357 8.0095-5.0059 5.1667-1.5238 15.119-6.0476 24.293-11.042-14.808 3.2019 19.655-10.583 3.4065-1.3626 7.148-1.7356 10.583-3.0238 5.6276-2.1104 15.893-7.8377 22.679-9.0714 2.4792-0.45077 5.0997 0.54663 7.5595 0 2.2001-0.48892 3.9095-2.3111 6.0476-3.0238 8.2844-2.7615 19.05-6.9228 27.214-9.0714 20.747-5.4596 12.763-0.10548 33.262-7.5595 5.7228-2.081 10.767-5.9176 16.631-7.5595 6.8632-1.9217 14.209-1.4777 21.167-3.0238 6.6915-1.487 13.005-4.3851 19.655-6.0476 3.4572-0.8643 7.2573-0.23266 10.583-1.5119 6.5347-2.5133 11.642-7.9831 18.143-10.583 17.875-7.1499 12.656-2.2404 33.262-12.095 9.3618-4.4774 18.316-9.78 27.214-15.119 2.3543-1.4126 6.5018-7.8815 7.5595-9.0714 17.479-19.664 33.502-39.988 49.893-60.476 2.3263-2.9078 0.54281-5.0785 3.0238-7.5595" />
        <path d="m-99.786 624.42c-4.5357-4.0318-9.8404-7.3372-13.607-12.095-5.9022-7.4554-9.7398-16.349-15.119-24.19-24.361-35.509-49.767-70.294-74.083-105.83-1.909-2.7901-2.6991-6.233-4.5357-9.0714-5.697-8.8045-13.453-16.323-18.143-25.702-1.9257-3.8513-2.4606-8.3223-4.5357-12.095-9.2191-16.762-23.351-31.639-34.774-46.869-12.231-16.308-22.594-33.046-36.286-48.381-51.603-57.795 6.5747 8.0866-46.869-45.357-9.0955-9.0955-17.017-20.588-25.702-30.238-6.3854-7.0949-14.104-13.396-19.655-21.167-14.615-20.461-25.767-43.135-39.31-65.012-2.2819-3.6862-5.5194-6.7581-7.5595-10.583-13.372-25.073 6.008 1.4525-12.095-25.702-3.1874-4.7811-7.4984-8.7594-10.583-13.607-18.16-28.537-2.2211-11.015-22.679-36.286-4.2661-5.2699-9.719-9.5645-13.607-15.119-6.4624-9.232-9.2428-20.622-15.119-30.238-9.0024-14.731-9.9002-9.2495-16.631-25.702-22.219-54.312 2.7839 3.3779-7.5595-30.238-0.99423-3.2312-3.6462-5.8098-4.5357-9.0714-2.3078-8.4618 0.5997-37.381 3.0238-43.845 3.9701-10.587 11.063-18.791 13.607-30.238 5.5304-24.887-2.6745-5.5835 4.5357-27.214 3.5505-10.652 9.7184-20.658 12.095-31.75 10.345-48.275-7.9825 22.218 6.0476-22.679 1.3859-4.4348 1.0589-9.3967 3.0238-13.607 1.6646-3.5668 5.6067-5.6539 7.5596-9.0714 5.2035-9.1061 16.164-42.746 12.095-52.917-6.9165-10.375-0.48268 1.093-3.0238-9.0714-0.78266-3.1306-4.4805-4.7386-6.0476-7.5595-1.318-2.3724-1.4464-5.3511-3.0238-7.5595-1.0562-1.4786-3.2509-1.739-4.5357-3.0238-2.5697-2.5697-3.7211-6.2796-6.0476-9.0714-3.8803-4.6564-8.3932-8.3932-12.095-12.095" />
        <path d="m796.77-189c-5.8858 12.048-20.288 14.153-31.75 19.655-19.753 9.4813-38.581 22.085-58.964 30.238-2.7845 1.1138-15.169 2.1465-16.631 3.0238-1.5582 0.93488-1.739 3.2508-3.0238 4.5357-3.748 3.748-2.0555-0.0849-6.0476 1.5119-5.0361 2.0144-9.0263 6.781-13.607 9.0714-1.1371 0.56854-3.4867-0.69935-4.5357 0-1.7791 1.186-2.5073 3.8596-4.5357 4.5357-1.4343 0.4781-3.2777-0.83866-4.5357 0-4.9802 3.3201-0.57161 5.1073-3.0238 7.5595-0.35634 0.35636-1.1555-0.35636-1.5119 0-3.6296 3.6296-6.0176 9.5354-9.0714 13.607-3.4018 4.5357-5.2917 3.0238-9.0714 9.0714-1.1013 1.7621-0.74018 4.1183-1.5119 6.0476-1.2556 3.1389-3.4666 5.8642-4.5357 9.0714-2.2934 6.8801-1.7694 14.267-3.0238 21.167-2.6824 14.753-9.9794 29.034-12.095 43.845-5.8544 40.981 7.963-26.342-1.5119 24.19-0.67614 3.6061-2.4659 6.9571-3.0238 10.583-1.8034 11.722 1.9727 24.724 3.0238 36.286 2.2788 25.067 4.8745 49.345 10.583 74.083 2.118 9.178 5.4189 16.605 7.5596 25.702 2.3543 10.006 3.8939 20.187 6.0476 30.238 1.6422 7.6635 5.018 16.214 3.0238 24.19-3.3568 13.427-14.585 38.73-19.655 51.405-5.0587 12.647-8.3036 26.694-16.631 37.798-1.5119 2.0159-4.4344 2.5999-6.0476 4.5357-4.4865 5.3838-3.3496 12.103-9.0714 18.143-31.988 33.765-75.318 53.164-116.42 72.571-3.057 1.4436-5.8333 3.5643-9.0714 4.5357-1.9308 0.57925-4.1352-0.63749-6.0476 0-18.073 6.0244 9.5188 0.6441-6.0476 4.5357-6.3748 1.5937-13.19 0.33644-19.655 1.5119-6.1332 1.1151-11.994 3.5109-18.143 4.5357-17.595 2.9324-36.619 1.5119-54.429 1.5119-37.205 0-70.984-1.457-108.86-6.0476-11.68-1.4157-23.115-4.472-34.774-6.0476-7.0098-0.94726-14.207-0.24656-21.167-1.5119-12.512-2.275-23.768-11.104-36.286-13.607-7.0555-1.4111-14.111 0.78396-21.167 0-14.344-1.5937-29.864-0.54102-43.845-4.5357-10.475-2.9929-4.7354-5.3186-6.0476-6.0476-7.9424-4.4125-17.32-4.6256-25.702-7.5595-6.1838-2.1643-12.085-5.065-18.143-7.5595-2.5095-1.0333-5.4403-1.3284-7.5595-3.0238-0.95639-0.76512-0.70673-7.9978-1.5119-9.0714-2.8527-3.8035-8.2264-4.7961-12.095-7.5595-1.1599-0.82852-2.0159-2.0159-3.0238-3.0238-1.5119-1.5119-2.7958-3.2929-4.5357-4.5357-3.668-2.62-8.3447-3.5472-12.095-6.0476-15.955-10.637-29.597-25.253-45.357-36.286-9.278-6.4946-19.361-11.775-28.726-18.143-12.481-8.487-24.452-19.259-36.286-28.726-3.6282-2.9026-5.5874-7.5092-9.0714-10.583-10.56-9.3175-22.768-16.374-33.262-25.702-10.574-9.3995-21.426-19.323-33.262-27.214-3.0834-9.395-12.345-5.5927-18.143-9.0714-3.5253-2.1152-6.8453-5.6905-10.583-7.5596-2.2538-1.1269-5.0397 0-7.5595 0h-16.631c-5.0397 0-10.552-2.1312-15.119 0-16.998 7.9326-36.89 18.046-51.405 30.238-7.0945 5.9594-11.838 14.68-19.655 19.655-9.1586 5.8282-21.124 6.1978-30.238 12.095-14.313 3.7966-17.459 21.215-28.726 28.726-6.387 4.258-14.536 5.2036-21.167 9.0714-12.356 7.2079-16.401 23.029-27.214 30.238-5.7965 3.8643-17.694 11.171-24.19 13.607-1.9456 0.72959-4.1891 0.58264-6.0476 1.5119-6.8806 3.4403-12.625 8.9709-19.655 12.095-3.7976 1.6878-8.3782 1.1652-12.095 3.0238-1.275 0.63749-1.8015 2.2904-3.0238 3.0238-2.8415 1.7049-19.963 11.823-27.214 15.119-21.94 9.9728-43.187 21.565-65.012 31.75-10.263 4.7893-21.252 7.8461-31.75 12.095-25.036 10.134-59.277 24.606-84.667 33.262-7.8046 2.6606-45.519 11.026-55.94 12.095-15.574 1.5973-31.334 1.082-46.869 3.0238-12.75 1.5937-25.164 5.2199-37.798 7.5595-6.6826 1.2375-25.413 1.0562-31.75 0-10.028-1.6713-1.3565-1.5119-6.0476-1.5119" />
        <path d="m-610.81-352.29c-5.4818 75.764-41.216 147.33-92.226 202.6-3.8975 4.2223-6.5202 9.544-10.583 13.607-1.7818 1.7818-4.2658 2.7539-6.0476 4.5357-1.2849 1.2849-1.6657 3.3285-3.0238 4.5357-10.966 9.7477-9.5591 5.5712-21.167 13.607-0.0897 0.0621-15.394 12.941-16.631 13.607-40.286 21.693 11.404-9.9284-21.167 9.0714-3.1391 1.8312-5.6972 4.6979-9.0714 6.0476-1.8717 0.74866-4.1868-0.77534-6.0476 0-4.3887 1.8286-7.6809 5.7938-12.095 7.5595-10.577 4.231-30.8 9.4862-43.845 12.095-15.096 3.0192-28.844 0-43.845 0" />
        <path d="m349.25 615.33c-16.631-16.631-35.251-31.486-49.893-49.893-0.51948-0.65307-5.5097-31.995-6.0476-34.774-1.8594-9.607-3.6744-19.233-6.0476-28.726-4.8682-19.473-12.872-38.126-18.143-57.452-0.93763-3.438-0.68649-7.1167-1.5119-10.583-1.6996-7.1384-3.6235-14.241-6.0476-21.167-3.3512-9.5748-9.0131-15.685-12.095-25.702-2.8795-9.3583-7.0176-19.142-9.0714-28.726-0.85135-3.9729-0.52645-8.1534-1.5119-12.095-3.4638-13.855-9.3576-27.223-13.607-40.821-4.2246-13.519-4.7813-26.892-6.0476-40.821-1.031-11.341-2.0711-4.3078-4.5357-16.631-0.39534-1.9767 0.33142-4.0592 0-6.0476-1.6979-10.188-4.8746-21.193-6.0476-31.75-2.1681-19.513 1.5119-39.527 1.5119-58.964 0-15.05-2.288-36.533 0-51.405 0.727-4.7255 3.7497-8.8911 4.5357-13.607 0.4263-2.5577 0.56505-17.445 1.5119-19.655 1.1576-2.701 3.2215-4.9311 4.5357-7.5595 2.1991-4.3982 1.0861-5.7392 3.0238-10.583 0.59106-1.4776 8.699-7.1871 9.0714-7.5595 1.1269-1.1269 0.51633-3.2913 1.5119-4.5357 3.0754-3.8443 7.6278-6.6427 10.583-10.583 3.6596-4.8794 5.2096-11.997 9.0714-16.631 1.1633-1.3959 3.2508-1.7389 4.5357-3.0238 11.504-11.504 21.182-25.468 31.75-37.798-3e-3 -5.2575 5.4346-3.6191 7.5596-6.0476 2.8548-3.2626 4.6433-7.3755 7.5595-10.583 2.1707-2.3878 5.5784-3.5004 7.5595-6.0476 1.6662-2.1423 1.3954-5.3884 3.0238-7.5595 1.5119-2.0159 4.3384-2.6841 6.0476-4.5357 7.771-8.4186 16.737-20.336 22.679-30.238 0.81994-1.3666 0.72123-3.152 1.5119-4.5357 1.601-2.8018 4.6045-4.6732 6.0476-7.5595 1.3321-2.6642 3.9101-10.935 6.0476-13.607 0.70398-0.87996 2.0159-1.0079 3.0238-1.5119 1.5119-1.5119 3.223-2.848 4.5357-4.5357 8.3605-10.749 11.055-14.39 24.19-18.143 4.7951-1.37 22.638 4.3914 27.214 7.5595 4.7244 3.2708 8.5723 7.8142 13.607 10.583 5.1686 2.8427 11.355 3.4096 16.631 6.0476 4.7917 2.3958 7.6378 7.6117 12.095 10.583 8.1816 5.4544 17.825 5.5304 25.702 12.095 3.0238 2.5198 4.4525 6.6549 7.5595 9.0714 1.6402 1.2757 4.2142 0.53406 6.0476 1.5119 40.049 25.485-5.0314-1.7597 31.75 16.631 9.7848 4.8924 18.483 10.729 28.726 15.119 10.583 4.5357 15.119 3.0238 27.214 9.0714 2.5499 1.2749 3.4977 4.7727 6.0476 6.0476 2.7419 1.3709 6.1239 0.66974 9.0714 1.5119 43.217 12.348-34.923-5.4487 34.774 9.0715 3.8865 0.80968 17.412 4.1595 22.679 4.5357 4.0215 0.28726 8.0882-0.44524 12.095 0 22.276 2.4752 43.816 7.9399 66.524 6.0476 7.3271-0.61061 7.0878-2.032 12.095-4.5357 3.9678-1.9839 41.535-1.5119 49.893-1.5119" />
        <path d="m-905.63 235.84c21.989 3.6101 42.429-7.9495 63.5-10.583 2.3638-0.29546 17.981-2.0193 19.655-3.0238 1.5581-0.93491 1.7389-3.2509 3.0238-4.5357 0.76787-0.76787 6.1048-0.78451 7.5595-1.5119 3.2505-1.6252 5.6972-4.6979 9.0714-6.0476 0.93585-0.37436 2.0676 0.31871 3.0238 0 3.7947-1.2649 7.9544-4.6674 12.095-6.0476 4.7967-1.5989 10.248-2.5871 15.119-4.5357 4.1841-1.6737 9.783-3.8624 13.607-6.0476 2.1878-1.2502 3.745-3.5123 6.0476-4.5357 1.0866-0.48292 10.105-1.5313 12.095-3.0238 0.90152-0.67614 0.46559-2.6053 1.5119-3.0238 1.8717-0.74867 4.0418 0.2006 6.0476 0 3.0503-0.30502 6.0584-0.94697 9.0714-1.5119 18.649-3.4967 37.356-3.2707 55.94-7.5595 10.717-2.4731 18.227-7.72 28.726-10.583 1.9448-0.53041 4.0866 0.46691 6.0476 0 17.774-4.2319 36.063-12.724 54.429-15.119 16.559-2.1599 33.331-2.3987 49.893-4.5357 6.0806-0.7846 12.148-1.7392 18.143-3.0238 1.1019-0.23611 1.8994-1.4369 3.0238-1.5119 6.5371-0.43579 13.114 0.38474 19.655 0 14.525-0.85441 29.288-5.0078 43.845-6.0476 32.971-2.3551 66.719 0 99.786 0 33.022 0 67.03-2.5825 99.786 1.5119 21.241 2.6551 47.888-0.89477 69.548 1.5119 18.518 2.0576 35.984 9.4603 54.429 12.095 7.4469 1.0638 15.151 1.9485 22.679 3.0238 6.2668 0.89527 11.798-0.30083 18.143 1.5119 14.339 4.0968 25.011 11.039 37.798 18.143 1.8555 1.0308 8.3842 3.986 9.0714 4.5357 2.2947 1.8357 2.4578 5.4816 4.5357 7.5595 1.2849 1.2849 3.2509 1.7389 4.5357 3.0238 6.651 6.651 10.15 14.871 15.119 22.679 2.4276 3.8148 7.0419 8.0362 9.0714 12.095 2.2197 4.4395 3.531 9.3289 6.0476 13.607 2.5552 4.3439 6.1651 7.978 9.0714 12.095 7.4887 10.609 14.01 21.997 22.679 31.75 5.2943 5.9562 10.655 11.447 15.119 18.143 3.6449 5.4674 7.6447 10.754 10.583 16.631 3.6489 7.2979 5.8314 15.551 10.583 22.679 3.1874 4.781 7.328 8.8721 10.583 13.607 10.568 15.372 15.949 33.409 24.19 49.893 1.1269 2.2538 3.5666 3.7216 4.5357 6.0476 1.5984 3.8362 1.8296 8.1147 3.0238 12.095 4.3883 14.628 10.101 28.943 13.607 43.845 2.3146 9.8369 3.9689 22.565 9.0714 31.75 3.5298 6.3537 8.3557 11.91 12.095 18.143 5.1127 8.5211 6.6661 19.071 12.095 27.214 6.2494 9.374 14.991 17.51 21.167 27.214 0.85561 1.3445 1.008 3.0238 1.5119 4.5357 1.5119 2.5198 2.7979 5.1898 4.5357 7.5595 4.0317 5.0397 8.0635 10.079 12.095 15.119 1.5119 1.0079 3.3724 1.6279 4.5357 3.0238 1.4428 1.7314 2.1868 3.955 3.0238 6.0476 0.18717 0.46791-0.41933 1.2323 0 1.5119 1.326 0.884 3.1103 0.79918 4.5357 1.5119 5.2568 2.6284 9.616 7.0078 15.119 9.0714 10.571 3.964 5.1011-0.94652 9.0714 3.0238" />
        <path d="m137.58-359.85c8.3162 13.86 6.1805 8.8636 12.095 33.262 3.2606 13.45 9.2968 54.494 10.583 63.5 1.5825 11.077 1.8218 22.406 4.5357 33.262 2.7524 11.009 8.0578 20.145 12.095 30.238 2.1468 5.3671 2.883 11.122 4.5357 16.631 1.695 5.65 4.768 10.873 6.0476 16.631 1.438 6.4708 1.4161 13.224 3.0238 19.655 0.44069 1.7628 2.3858 2.8343 3.0238 4.5357 1.7865 4.764 6.5989 19.868 7.5595 24.19 2.6216 11.797 7.9926 24.662 12.095 36.286 0.18592 6.7998 5.301 12.12 7.5595 18.143 0.90228 2.4061-0.30517 5.7424 1.5119 7.5595 0.79684 0.79685 2.5198 0.50395 3.0238 1.5119 1.1492 2.2984 0.60962 5.1534 1.5119 7.5595 0.74078 1.9754 7.0379 9.5401 7.5595 10.583 0.45074 0.90152 0 2.0159 0 3.0238 1.5119 3.0238 2.8323 6.1512 4.5357 9.0714 7.5338 12.915 3.8058 4.9528 10.583 15.119 4.7749 7.1624 3.6358 8.2525 7.5595 15.119 7.408 12.964 14.027 26.458 21.167 39.31 7.5307 13.555 1.6999 1.8073 12.095 18.143 2.42 3.8029 3.5472 8.3446 6.0476 12.095 0.79068 1.186 2.3166 1.7862 3.0238 3.0238 1.3465 2.3564 1.5184 5.3014 3.0238 7.5595 8.7738 13.161 21.21 23.388 30.238 36.286 10.331 14.759-7.3889-4.6334 9.0714 15.119 12.633 15.16 5.0888 3.5216 19.655 16.631 1.873 1.6857 2.8958 4.1344 4.5357 6.0476 2.1001 2.4501 5.6233 3.466 7.5595 6.0476 0.95623 1.2749 0.47477 3.3257 1.5119 4.5357 19.578 22.841-0.82288-2.775 12.095 7.5596 6.06 4.848 7.7127 12.903 13.607 18.143 1.237 1.0996 10.721 7.0097 13.607 9.0714 7.7408 5.5291 14.185 11.998 22.679 16.631 4.7652 2.5992 10.13 3.9095 15.119 6.0476 3.6504 1.5645 2.3972 2.9712 6.0476 4.5357 2.362 1.0123 5.1611 0.58941 7.5595 1.5119 10.518 4.0454 19.775 10.934 30.238 15.119 6.3644 2.5458 13.213 3.7051 19.655 6.0476 4.6647 1.6962 8.8346 4.684 13.607 6.0476 2.4229 0.69226 5.1285-0.66302 7.5595 0 6.9615 1.8986 12.955 6.3916 19.655 9.0714 10.062 4.0248 20.362 7.6061 30.238 12.095 4.7236 2.1471 8.6847 5.9187 13.607 7.5595 29.573 9.8577 23.068 5.2111 51.405 13.607 5.6558 1.6758 10.972 4.3832 16.631 6.0476 9.9158 2.9164 20.4 3.9349 30.238 7.5596 6.1476 2.2649 11.955 5.4072 18.143 7.5595 13.768 4.7887 28.757 4.5458 42.333 9.0714 1.7238 0.57462 2.8656 2.308 4.5357 3.0238 12.945 5.5478 26.844 9.0714 40.821 9.0714" />
        <path d="m-294.82-350.78c1.0079 22.175 2.4759 44.333 3.0238 66.524 0.95591 38.715 0 77.665 0 116.42 0 8.5675-0.4503 17.147 0 25.702 0.57515 10.928 2.738 22.227 1.5119 33.262-0.62222 5.6001-2.3249 11.04-3.0238 16.631-1.8846 15.077-1.5119 30.176-1.5119 45.357 0 9.6678-0.53332 19.182 1.5119 28.726 3.6452 17.011 16.557 30.68 27.214 43.845 14.347 17.723 27.482 31.765 43.845 46.869 11.926 11.009 22.45 22.945 36.286 31.75 16.092 10.24 34.804 10.939 52.917 15.119 26.578 6.1334 13.492 6.2187 36.286 7.5595 9.8319 0.57833 23.428 1.9668 33.262 0 3.3151-0.66302 5.906-3.3487 9.0714-4.5357 3.8912-1.4592 8.3781-1.1653 12.095-3.0238 2.2538-1.1269 3.951-3.138 6.0476-4.5357 11.395-7.5966 22.883-13.337 33.262-22.679 2.0159-2.0159 4.0317-4.0317 6.0476-6.0476 1.008-1.5119 1.7389-3.2508 3.0238-4.5357 0.79685-0.79685 2.3477-0.61039 3.0238-1.5119 2.6292-3.5056 2.665-33.437 0-37.798-4.3101-7.053-9.7164-13.399-15.119-19.655-11.498-13.313-27.328-30.174-43.845-37.798-3.9096-1.8044-8.3759-2.3661-12.095-4.5357-7.7079-4.4962-10.101-11.219-19.655-13.607-3.8554-0.96385-26.269-5.3729-31.75-3.0238-1.709 0.73242-14.624 8.5766-16.631 10.583-0.7127 0.71271 0.66374 2.2653 0 3.0238-3.0596 3.4967-7.4579 5.6334-10.583 9.0714-8.3301 9.1631-13.469 35.393-10.583 48.381 1.3505 6.0774 8.1678 10.995 10.583 16.631 0.81854 1.9099 0.50279 4.2312 1.5119 6.0476 3.8231 6.8816 10.255 11.953 15.119 18.143 7.8976 10.052 12.124 21.481 19.655 31.75 7.1456 9.744 10.12 11.059 18.143 19.655 6.5696 7.0388 13.314 13.921 19.655 21.167 1.1966 1.3675 1.6049 3.4006 3.0238 4.5357 1.2444 0.99557 3.2608 0.5557 4.5357 1.5119 2.8509 2.1382 4.6775 5.4635 7.5595 7.5595 2.7341 1.9884 6.1512 2.8323 9.0714 4.5357 29.414 17.158-9.4452-4.4987 16.631 12.095 6.8101 4.3337 14.71 7.0737 21.167 12.095 7.8112 6.0754 13.44 14.986 21.167 21.167 1.7599 1.4079 4.2446 1.6715 6.0476 3.0238 8.6934 6.5201 16.024 15.533 24.19 22.679 9.421 8.2434 18.782 16.586 28.726 24.19 4.3733 3.3443 21.168 12.852 25.702 15.119 3.4329 1.7164 7.3898 2.4067 10.583 4.5357 2.9651 1.9767 4.5944 5.5828 7.5595 7.5595 3.1935 2.129 7.204 2.7161 10.583 4.5357 11.101 5.9774 20.472 15.527 31.75 21.167 2.4274 1.2137 5.3014 1.5184 7.5595 3.0238 2.3721 1.5814 3.6755 4.4662 6.0476 6.0476 2.2581 1.5054 5.1871 1.7058 7.5595 3.0238 2.2027 1.2237 3.708 3.5999 6.0476 4.5357 2.8462 1.1385 6.2417 0.33287 9.0714 1.5119 3.3546 1.3978 6.0476 4.0318 9.0714 6.0476 5.0397 2.5198 9.8319 5.6116 15.119 7.5595 4.3598 1.6063 9.2216 1.4889 13.607 3.0238 16.059 5.6206 31.6 13.934 46.869 21.167 10.397 4.9248 18.49 5.6593 28.726 9.0714 6.0476 2.0159-0.3057 1.4508 7.5595 3.0238 33.948 6.7897 76.966 3.0238 111.88 3.0238 11.11 0 23.936-2.1677 34.774 0 17.882 3.5765-0.15518 3.215 19.655 4.5357 24.468 1.6312 49.534 0 74.083 0 15.762 0 32.64 1.3687 48.381 0 7.1004-0.61743 14.056-2.5335 21.167-3.0238 30.09-2.0752 60.63 2.1489 90.714 0 4.552-0.32514 9.0482-1.3047 13.607-1.5119 1.6916-0.0769 24.128 1.7456 30.238 0 1.7472-0.49919 2.8486-2.349 4.5357-3.0238 5.1637-2.0655 22.977 0 30.238 0" />
        <path d="m796.77 64.995c-7.9676 12.606-8.9094 28.24-13.607 42.333-1.5119 4.5357-2.5573 9.2546-4.5357 13.607-1.312 2.8864-7.7419 11.13-9.0714 15.119-2.3985 7.1954-1.2153 16.957-3.0238 24.19-0.98544 3.9418-4.8801 6.6916-6.0476 10.583-0.97922 3.2641-0.92006 8.5441-1.5119 12.095-1.851 11.106-2.7336 3.5684-7.5595 19.655-1.6191 5.3969-1.4759 11.213-3.0238 16.631-0.49919 1.7472-2.4492 2.8119-3.0238 4.5357-1.4693 4.4079-1.4175 9.2473-3.0238 13.607-1.9479 5.2871-5.373 9.9261-7.5595 15.119-5.3373 12.676-9.2237 27.421-12.095 40.821-4.7232 22.042-0.97975 44.563-6.0476 66.524-1.3264 5.7477-4.8117 10.863-6.0476 16.631-2.1356 9.9659-2.7894 20.197-4.5357 30.238-1.0079 6.0476-2.0159 12.095-3.0238 18.143-1.5119 5.0397-3.5038 9.9597-4.5357 15.119-0.49419 2.4709 0.25072 5.0522 0 7.5595-1.2033 12.033-2.347 24.103-3.0238 36.286-0.89566 16.122 1.0988 14.978 4.5357 28.726 1.0578 4.2314-1.1978 9.415 0 13.607 2.0582 7.2038 5.7424 13.898 7.5595 21.167 2.4081 9.6325 0.66384 9.8465 1.5119 16.631 3.3274 26.619-0.23063-4.4075 3.0238 15.119 1.5312 9.1868-2.2519 19.718 0 28.726 0.93814 3.7525 1.5119 4.2889 1.5119 7.5595" />
      </svg>
    </div>
  );
}

export default Particle;
