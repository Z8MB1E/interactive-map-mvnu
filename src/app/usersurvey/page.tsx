"use client";

import { useEffect, useState } from "react";

type SurveyPage = {
  isAlumni: boolean;
  pageNum: number;
};

export type SurveyResponse = {
  // page 1
  name: string;
  email: string;
  isAlumni: boolean;
  // page 2
  homeLocations: string[];
  // page 3
  travelLocationsWithMvnu?: string[];
  travelLocationsWithoutMvnu: string[];
};

/* const VerifyLocationData = async (location: string) => {
  // use Nominatim API to verify location
  // https://nominatim.org/release-docs/develop/api/Search/

  const res = await fetch()
} */

export default function UserPage() {
  const [surveyPage, setSurveyPage] = useState<SurveyPage>({
    isAlumni: true,
    pageNum: 0,
  });
  const [surveyResponse, setSurveyResponse] = useState<
    Omit<
      SurveyResponse,
      "homeLocations" | "travelLocationsWithMvnu" | "travelLocationsWithoutMvnu"
    >
  >({
    name: "",
    email: "",
    isAlumni: false,
  });
  const [returnTimer, setReturnTimer] = useState({
    initial: true,
    time: 10,
  });
  const [homeLocations, setHomeLocations] = useState<string[]>([""]);
  const [travelLocationsWithMvnu, setTravelLocationsWithMvnu] = useState<
    string[]
  >([""]);
  const [travelLocationsWithoutMvnu, setTravelLocationsWithoutMvnu] = useState<
    string[]
  >([""]);

  useEffect(() => {
    let timer: any = null;

    const startTimer = () => {
      timer = setInterval(() => {
        setReturnTimer((prevState) => {
          if (prevState.time <= 0 && !prevState.initial) {
            clearInterval(timer);
            setSurveyPage({ isAlumni: true, pageNum: 0 });
            setReturnTimer({ initial: true, time: 10 });
            return { ...prevState, initial: true };
          } else {
            return { ...prevState, initial: false, time: prevState.time - 1 };
          }
        });
      }, 1000);
    };

    if (surveyPage.pageNum === 5) startTimer();

    return () => clearInterval(timer);
  }, [surveyPage.pageNum]);

  const CreateSurveyResponse = (data: SurveyResponse) => {
    // merge home locations, travel locations with mvnu, and travel locations without mvnu into survey response

    console.log("Creating survey response: ", data);

    // converts survey response to prisma schema
    fetch("/api/survey", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => {
      console.log("Response received: ", res);
    });
  };

  const RenderSurveyPage = (surveyPage: SurveyPage) => {
    switch (surveyPage.pageNum) {
      case 0:
        return (
          <div className="grid w-2/3 grid-cols-2 gap-3 px-10 m-auto">
            <button
              className="flex flex-col items-center justify-center p-5 text-3xl font-bold transition-all border border-gray-300 rounded-lg aspect-square hover:bg-sky-800 hover:text-white"
              onClick={() => setSurveyPage({ isAlumni: true, pageNum: 1 })}
            >
              YES! Go Cougs!
            </button>
            <button
              className="flex flex-col items-center justify-center p-5 text-3xl font-bold transition-all border border-gray-300 rounded-lg aspect-square hover:bg-sky-800 hover:text-white"
              onClick={() => setSurveyPage({ isAlumni: false, pageNum: 1 })}
            >
              NO
            </button>
          </div>
        );
      case 1:
        return (
          <div className="p-10">
            <h1 className="my-10 text-4xl font-bold text-[#002856]">
              Hey there{surveyPage.isAlumni && ", alum"}! 👋🏼 Let's get to know
              each other!
              <div className="flex flex-row block gap-1 mt-3 font-sans text-base font-normal text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>

                <small>Your information is safe with us!</small>
              </div>
            </h1>
            <div className="flex flex-col gap-5 font-sans">
              <div>
                <label
                  className="block text-2xl font-bold font-dinbekbold uppercase text-[#002856]"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  className="block w-full p-4 my-2 text-xl border border-gray-300 rounded"
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  onChange={(e) => {
                    // set name
                    setSurveyResponse({
                      ...surveyResponse,
                      name: e.target.value,
                    });
                  }}
                  defaultValue={surveyResponse.name}
                />
              </div>
              <div>
                <label
                  className="block text-2xl font-bold font-dinbekbold uppercase text-[#002856]"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="block w-full p-4 my-2 text-xl border border-gray-300 rounded"
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  onChange={(e) => {
                    // set email
                    setSurveyResponse({
                      ...surveyResponse,
                      email: e.target.value,
                    });
                  }}
                  defaultValue={surveyResponse.email}
                />
              </div>
              <div className="flex flex-row justify-center gap-3">
                <button
                  className="px-6 py-3 font-bold text-white transition-colors bg-sky-600 hover:bg-sky-800"
                  onClick={() => {
                    // go to next page
                    setSurveyPage({
                      ...surveyPage,
                      pageNum: surveyPage.pageNum - 1,
                    });
                  }}
                >
                  ← Back
                </button>
                <button
                  className="px-6 py-3 font-bold text-white transition-colors bg-sky-600 hover:bg-sky-800"
                  onClick={() => {
                    // go to next page
                    setSurveyPage({
                      ...surveyPage,
                      pageNum: surveyPage.pageNum + 1,
                    });
                  }}
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="p-10 font-['Garamond']">
            <h1 className="my-10 text-4xl font-bold text-[#002856]">
              Let's map where you live! 🏡
            </h1>
            <div className="flex flex-col gap-5">
              {homeLocations &&
                homeLocations.map((location, index) => {
                  return (
                    <div key={index}>
                      <label
                        className="block text-2xl font-bold font-dinbekbold"
                        htmlFor={`homeLocation${index}`}
                      >
                        Location #{index + 1}
                        <small className="block font-light text-gray-500">
                          Enter an address here!
                        </small>
                      </label>
                      <input
                        className="block w-full p-4 my-2 font-sans text-xl border border-gray-300 rounded"
                        id={`homeLocation${index}`}
                        type="text"
                        placeholder="Name a place - you don't have to be specific!"
                        onChange={(e) => {
                          // set homeLocations
                          let newHomeLocations = [...homeLocations];
                          newHomeLocations[index] = e.target.value;
                          setHomeLocations(newHomeLocations);
                        }}
                        defaultValue={homeLocations[index] ?? ""}
                      />
                    </div>
                  );
                })}
              <div
                className={
                  homeLocations && homeLocations.length >= 2
                    ? "hidden"
                    : "block"
                }
              >
                <button
                  className="p-3 transition-colors border border-gray-300 rounded hover:bg-sky-800 group"
                  onClick={() => {
                    // add a new entry to homeLocations
                    if (homeLocations && homeLocations.length < 2) {
                      setHomeLocations([...homeLocations, ""]);
                    }
                  }}
                >
                  <p className="font-sans text-lg font-bold text-gray-500 group-hover:text-white">
                    + Add Location
                  </p>
                </button>
              </div>
              <div className="flex flex-row justify-center gap-3">
                <button
                  className="px-6 py-3 font-bold text-white transition-colors bg-sky-600 hover:bg-sky-800"
                  onClick={() => {
                    // go to next page
                    setSurveyPage({
                      ...surveyPage,
                      pageNum: surveyPage.pageNum - 1,
                    });
                  }}
                >
                  ← Back
                </button>
                <button
                  className="px-6 py-3 font-bold text-white transition-colors bg-sky-600 hover:bg-sky-800"
                  onClick={() => {
                    // go to next page
                    setSurveyPage({
                      ...surveyPage,
                      pageNum:
                        surveyPage.pageNum + (surveyPage.isAlumni ? 1 : 2),
                    });
                  }}
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="p-10 font-['Garamond']">
            <h1 className="my-10 text-4xl font-bold text-[#002856]">
              Thanks &mdash; that's a great start to see where we are in the
              world! 😁
              <br />
              Now, where did you travel/serve others with MVNU? 🛫
            </h1>
            <div className="flex flex-col gap-5">
              {travelLocationsWithMvnu &&
                travelLocationsWithMvnu.map((location, index) => {
                  return (
                    <div key={index}>
                      <label
                        className="block text-2xl font-bold font-dinbekbold"
                        htmlFor={"travelLocationWithMvnu" + index}
                      >
                        Location #{index + 1}
                        <small className="block font-light text-gray-500">
                          Enter an address here!
                        </small>
                      </label>
                      <input
                        className="block w-full p-4 my-2 font-sans text-xl border border-gray-300 rounded"
                        id={"travelLocationWithMvnu" + index}
                        type="text"
                        placeholder="Name a place - you don't have to be specific!"
                        onChange={(e) => {
                          // set travelLocationsWithMvnu
                          let newTravelLocationsWithMvnu = [
                            ...travelLocationsWithMvnu,
                          ];
                          newTravelLocationsWithMvnu[index] = e.target.value;
                          setTravelLocationsWithMvnu(
                            newTravelLocationsWithMvnu
                          );
                        }}
                        defaultValue={travelLocationsWithMvnu[index] ?? ""}
                      />
                    </div>
                  );
                })}
              <div
                className={
                  travelLocationsWithMvnu && travelLocationsWithMvnu.length >= 4
                    ? "hidden"
                    : "block"
                }
              >
                <button
                  className="p-3 transition-colors border border-gray-300 rounded hover:bg-sky-800 group"
                  onClick={() => {
                    // add a new entry to travelLocationsWithMvnu
                    if (
                      travelLocationsWithMvnu &&
                      travelLocationsWithMvnu.length < 4
                    ) {
                      setTravelLocationsWithMvnu([
                        ...travelLocationsWithMvnu,
                        "",
                      ]);
                    }
                  }}
                >
                  <p className="font-sans text-lg font-bold text-gray-500 group-hover:text-white">
                    + Add Location
                  </p>
                </button>
              </div>
              <div className="flex flex-row justify-center gap-3">
                <button
                  className="px-6 py-3 font-bold text-white transition-colors bg-sky-600 hover:bg-sky-800"
                  onClick={() => {
                    // go to next page
                    setSurveyPage({
                      ...surveyPage,
                      pageNum: surveyPage.pageNum - 1,
                    });
                  }}
                >
                  ← Back
                </button>
                <button
                  className="px-6 py-3 font-bold text-white transition-colors bg-sky-600 hover:bg-sky-800"
                  onClick={() => {
                    // go to next page
                    setSurveyPage({
                      ...surveyPage,
                      pageNum: surveyPage.pageNum + 1,
                    });
                  }}
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="p-10 font-['Garamond']">
            <h1 className="my-10 text-4xl font-bold text-[#002856]">
              {!surveyPage.isAlumni && (
                <>
                  Thanks &mdash; that's a great start to see where we are
                  located! 😁
                  <br />
                </>
              )}
              {surveyPage.isAlumni
                ? "Where did you travel/serve others after MVNU?"
                : "Where have you served others in the world?"}{" "}
              🌎
              <small className="block mt-3 font-sans text-base font-normal text-gray-500">
                Please do not include travel for vacation/business trips unless
                a service component was included!
              </small>
            </h1>
            <div className="flex flex-col gap-5">
              {travelLocationsWithoutMvnu &&
                travelLocationsWithoutMvnu.map((location, index) => {
                  return (
                    <div key={index}>
                      <label
                        className="block text-2xl font-bold font-dinbekbold"
                        htmlFor={"travelLocationWithoutMvnu" + index}
                      >
                        Location #{index + 1}
                        <small className="block font-light text-gray-500">
                          Enter an address here!
                        </small>
                      </label>
                      <input
                        className="block w-full p-4 my-2 font-sans text-xl border border-gray-300 rounded"
                        id={"travelLocationWithoutMvnu" + index}
                        type="text"
                        placeholder="Name a place - you don't have to be specific!"
                        onChange={(e) => {
                          // set travelLocationsWithoutMvnu
                          let newTravelLocationsWithoutMvnu = [
                            ...travelLocationsWithoutMvnu,
                          ];
                          newTravelLocationsWithoutMvnu[index] = e.target.value;
                          setTravelLocationsWithoutMvnu(
                            newTravelLocationsWithoutMvnu
                          );
                        }}
                        defaultValue={travelLocationsWithoutMvnu[index] ?? ""}
                      />
                    </div>
                  );
                })}
              <div
                className={
                  travelLocationsWithoutMvnu &&
                  travelLocationsWithoutMvnu.length >= 4
                    ? "hidden"
                    : "block"
                }
              >
                <button
                  className="p-3 transition-colors border border-gray-300 rounded hover:bg-sky-800 group"
                  onClick={() => {
                    // add a new entry to travelLocationsWithoutMvnu
                    if (
                      travelLocationsWithoutMvnu &&
                      travelLocationsWithoutMvnu.length < 4
                    ) {
                      setTravelLocationsWithoutMvnu([
                        ...travelLocationsWithoutMvnu,
                        "",
                      ]);
                    }
                  }}
                >
                  <p className="text-lg font-bold text-gray-500 group-hover:text-white">
                    + Add Location
                  </p>
                </button>
              </div>
              <div className="flex flex-row justify-center gap-3">
                <button
                  className="px-6 py-3 font-bold text-white transition-colors bg-sky-600 hover:bg-sky-800"
                  onClick={() => {
                    // go to next page
                    setSurveyPage({
                      ...surveyPage,
                      pageNum:
                        surveyPage.pageNum - (surveyPage.isAlumni ? 1 : 2),
                    });
                  }}
                >
                  ← Back
                </button>
                <button
                  className="px-6 py-3 font-bold text-white transition-colors bg-sky-600 hover:bg-sky-800"
                  onClick={() => {
                    // create a survey response
                    CreateSurveyResponse({
                      name: surveyResponse.name,
                      email: surveyResponse.email,
                      isAlumni: surveyPage.isAlumni,
                      homeLocations: homeLocations,
                      travelLocationsWithMvnu: travelLocationsWithMvnu,
                      travelLocationsWithoutMvnu: travelLocationsWithoutMvnu,
                    });

                    // go to next page
                    setSurveyPage({
                      ...surveyPage,
                      pageNum: surveyPage.pageNum + 1,
                    });
                  }}
                >
                  Submit →
                </button>
              </div>
            </div>
          </div>
        );
      case 5:
        // start timer to return to first page of survey
        /* const timer = setInterval(() => {
          setReturnTimer(prevState => {
            if (prevState.time <= 0 && !prevState.initial) {
              clearInterval(timer);
              setSurveyPage({ isAlumni: true, pageNum: 0 });
              setTimeout(() => {
                setReturnTimer({ initial: true, time: 10 });
              }, 1);
              return { ...prevState, initial: true };
            } else {
              return { ...prevState, initial: false, time: prevState.time - 1 };
            }
          });
        }, 1000); */

        return (
          <div className="relative h-full">
            <div className="p-10 text-center">
              <p className="text-3xl font-dinbekbold text-[#002856]">
                We are so grateful for all that you do to{" "}
                {surveyPage.isAlumni
                  ? "live out our motto..."
                  : "serve God's kingdom!"}
              </p>
              {surveyPage.isAlumni && (
                <p className="py-5 text-5xl font-bold text-sky-700">
                  TO SEEK TO LEARN IS TO SEEK TO SERVE.
                </p>
              )}
              <p className="mt-5 font-sans">
                Watch ... for full details of service data from General
                Assembly!
              </p>
              <p className="mt-5 font-sans font-bold">
                Restarting in {returnTimer.time} seconds...
              </p>
            </div>
            <p className="font-sans text-center text-gray-500">
              Watch the map to see your locations get pinned! 📌
            </p>
          </div>
        );
      default:
        break;
    }
  };

  return (
    <div className="relative flex flex-col font-['Garamond']">
      <div>
        <div className="flex flex-col items-center justify-center py-10 bg-[#002856]">
          <img src="/logo_white.png" alt="Mount Vernon Nazarene University" />
          {/* <h1 className="text-4xl font-bold">Mount Vernon Nazarene University</h1> */}
        </div>
        {surveyPage.pageNum == 0 && (
          <p className="py-10 text-4xl text-center text-[#002856] font-light">
            Are you an MVNU alum?
          </p>
        )}
      </div>
      <div>{RenderSurveyPage(surveyPage)}</div>
    </div>
  );
}
