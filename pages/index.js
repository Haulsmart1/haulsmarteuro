// Recovered from the confirmed HaulSmart deployment dpl_iQusu5gtwUsy8wMW9CV4Lrip8USD.
// Original compiled component recovered intact; framework imports rebound to this app.
import * as t from "react/jsx-runtime";
import Head from "next/head";
import Link from "next/link";
import recoveredStyles from "@/styles/pages/professional-home.module.css";
const r = { default: Head },
  n = { default: Link };
import * as o from "react";
const a = { default: recoveredStyles };
let i = [
    {
      vehicle: "Luton",
      from: "Birmingham · B24",
      to: "Leeds · LS10",
      load: "4 pallets · 600 kg",
      distance: "130 miles",
      collection: "Morning collection",
      requirement: "Tail-lift required",
    },
    {
      vehicle: "Van",
      from: "Bristol · BS11",
      to: "Manchester · M17",
      load: "6 cartons · 180 kg",
      distance: "170 miles",
      collection: "Afternoon collection",
      requirement: "Dedicated delivery",
    },
    {
      vehicle: "Rigid",
      from: "Lille · 59000",
      to: "Rotterdam · 3011",
      load: "10 pallets · 3,200 kg",
      distance: "180 miles",
      collection: "Scheduled collection",
      requirement: "Loading bay collection",
    },
    {
      vehicle: "Artic",
      from: "Antwerp · 2000",
      to: "Lyon · 69007",
      load: "Full load · 18,000 kg",
      distance: "480 miles",
      collection: "Scheduled collection",
      requirement: "Curtainsider required",
    },
  ],
  l = [
    [
      "Can I book or take a job today?",
      "Not yet. Haulsmart is in development. The jobs and distances here are illustrative samples, not live freight. No example prices are displayed. Genuine authorised rates will be shown to eligible carriers before they accept a real job.",
    ],
    [
      "How is the carrier rate agreed?",
      "Our model establishes the carrier rate before the job is accepted. The professional operator decides whether the work fits. There is no reverse auction, public bidding war or lowest-bidder selection.",
    ],
    [
      "What does dedicated transport mean?",
      "A vehicle dedicated to your job, with direct collection to delivery. Vehicle suitability, timings and handling requirements are part of the brief before booking.",
    ],
    [
      "Does a minimum rate guarantee profit?",
      "No. A configurable minimum rate floor prevents the platform from supporting unlimited downward price competition. Each carrier still needs to assess their operating costs and commitments.",
    ],
    [
      "Are the operators shown here verified?",
      "No live carrier profiles are displayed. Our onboarding direction includes company identity, vehicle information and appropriate insurance and credentials. Only indicators we can actually verify will be presented as verified.",
    ],
  ];
function ProfessionalHome() {
  let [e, s] = (0, o.useState)("All vehicles"),
    d = "All vehicles" === e ? i : i.filter((t) => t.vehicle === e);
  return (0, t.jsxs)("div", {
    className: a.default.site,
    children: [
      (0, t.jsxs)(r.default, {
        children: [
          (0, t.jsx)("title", {
            children:
              "Haulsmart | Dedicated UK & European Transport in Development",
          }),
          (0, t.jsx)("meta", {
            name: "description",
            content:
              "Dedicated transport, built by transport people. A professional UK and European transport network in development. Clear prices, professional rates and no freight auction.",
          }),
          (0, t.jsx)("meta", {
            name: "viewport",
            content: "width=device-width, initial-scale=1",
          }),
          (0, t.jsx)("meta", {
            name: "google-site-verification",
            content: "tRixieNsbQ4wPZpJKdwTh40OiK6C2kJ_LV73MnAeuDk",
          }),
          (0, t.jsx)("link", {
            rel: "canonical",
            href: "https://www.haulsmart-europe.com/",
          }),
          (0, t.jsx)("link", {
            rel: "icon",
            href: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='8' fill='%23101e35'/%3E%3Ctext x='32' y='42' text-anchor='middle' font-family='Arial' font-size='28' font-weight='700' fill='%23e52d42'%3EHS%3C/text%3E%3C/svg%3E",
          }),
          (0, t.jsx)("meta", {
            property: "og:title",
            content: "Haulsmart — dedicated transport, done properly",
          }),
          (0, t.jsx)("meta", {
            property: "og:description",
            content:
              "Dedicated vehicle. Clear price. Professional operator. A UK and European transport network in development.",
          }),
          (0, t.jsx)("meta", { property: "og:type", content: "website" }),
          (0, t.jsx)("meta", {
            property: "og:url",
            content: "https://www.haulsmart-europe.com/",
          }),
        ],
      }),
      (0, t.jsx)("a", {
        href: "#main",
        className: a.default.skip,
        children: "Skip to content",
      }),
      (0, t.jsxs)("header", {
        className: a.default.header,
        children: [
          (0, t.jsxs)(n.default, {
            href: "/",
            className: a.default.brand,
            "aria-label": "Haulsmart home",
            children: [
              "HAUL",
              (0, t.jsx)("span", { children: "SMART" }),
              (0, t.jsx)("span", {
                className: a.default.brandLine,
                children: "BUILT BY TRANSPORT PEOPLE",
              }),
            ],
          }),
          (0, t.jsxs)("nav", {
            "aria-label": "Main navigation",
            className: a.default.nav,
            children: [
              (0, t.jsx)("a", {
                href: "#find-a-load",
                children: "For drivers & hauliers",
              }),
              (0, t.jsx)("a", {
                href: "#move-a-load",
                children: "For loads to move",
              }),
              (0, t.jsx)(n.default, {
                href: "/uk-european-loads",
                children: "UK & European work",
              }),
            ],
          }),
          (0, t.jsx)(n.default, {href:"/contact",className:a.default.status,children:"Freight enquiries"}),
        ],
      }),
      (0, t.jsxs)("main", {
        id: "main",
        children: [
          (0, t.jsxs)("section", {
            className: a.default.hero,
            "aria-labelledby": "hero-title",
            children: [
              (0, t.jsxs)("div", {
                className: a.default.heroCopy,
                children: [
                  (0, t.jsx)("p", {
                    className: a.default.eyebrow,
                    children:
                      "VANS. RIGIDS. ARTICS. PEOPLE WHO KEEP THEM MOVING.",
                  }),
                  (0, t.jsxs)("h1", {
                    id: "hero-title",
                    children: [
                      "Dedicated transport",
                      (0, t.jsx)("br", {}),
                      "across the ",
                      (0, t.jsx)("span", { children: "UK & Europe." }),
                    ],
                  }),
                  (0, t.jsxs)("p", {
                    className: a.default.heroLead,
                    children: [
                      "Real loads.",
                      (0, t.jsx)("br", {}),
                      "Real operators.",
                      (0, t.jsx)("br", {}),
                      "Fair rates.",
                    ],
                  }),
                  (0, t.jsx)("p", {
                    className: a.default.intro,
                    children:
                      "A professional transport network matching the right operator to the right dedicated job across the UK and Europe.",
                  }),
                  (0, t.jsxs)("div", {
                    className: a.default.actions,
                    children: [
                      (0, t.jsxs)("a", {
                        className: a.default.primary,
                        href: "#find-a-load",
                        children: [
                          "Find dedicated work ",
                          (0, t.jsx)("span", {
                            "aria-hidden": "true",
                            children: "↗",
                          }),
                        ],
                      }),
                      (0, t.jsxs)("a", {
                        className: a.default.secondary,
                        href: "/contact",
                        children: [
                          "Got a load to move? ",
                          (0, t.jsx)("span", {
                            "aria-hidden": "true",
                            children: "↗",
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, t.jsx)("p", {
                    className: a.default.notice,
                    children:
                      "Clear rates. Professional transport. No bidding war. We’re in development; live bookings are not open yet.",
                  }),
                ],
              }),
              (0, t.jsxs)("div", {
                className: a.default.heroCaption,
                children: [
                  (0, t.jsx)("span", {
                    children: "DEDICATED VEHICLE. DIRECT DELIVERY.",
                  }),
                  (0, t.jsx)("strong", {
                    children: "Built by transport people.",
                  }),
                  (0, t.jsx)("span", {
                    children: "UK ↔ EUROPE · VANS / RIGIDS / ARTICS",
                  }),
                ],
              }),
            ],
          }),
          (0, t.jsxs)("div", {
            className: a.default.roadStrip,
            children: [
              (0, t.jsx)("span", { children: "SMALL VAN TO ARTIC" }),
              (0, t.jsx)("span", { children: "OWNER-DRIVER TO FLEET" }),
              (0, t.jsx)("span", { children: "UK & EUROPEAN WORK" }),
            ],
          }),
          (0, t.jsxs)("section", {
            className: a.default.marketplace,
            "aria-label": "Dedicated transport marketplace preview",
            children: [
              (0, t.jsxs)("div", {
                className: a.default.marketIntro,
                children: [
                  (0, t.jsx)("p", {
                    className: a.default.eyebrow,
                    children: "THE ROAD. THE ROUTE. THE RIGHT RATE.",
                  }),
                  (0, t.jsxs)("h2", {
                    children: [
                      "Dedicated work.",
                      (0, t.jsx)("br", {}),
                      "A clear rate from the start.",
                    ],
                  }),
                  (0, t.jsx)("p", {
                    children:
                      "Collection. Delivery. Vehicle. Mileage. Requirements. Everything you need to assess the job before accepting the established rate.",
                  }),
                  (0, t.jsx)("p", {
                    children:
                      "Professional transport deserves professional rates. A configurable minimum carrier rate floor is part of our model.",
                  }),
                  (0, t.jsxs)("div", {
                    className: a.default.routeGraphic,
                    "aria-label": "Illustrative UK and European route network",
                    children: [
                      (0, t.jsx)("span", { children: "UK & EUROPE" }),
                      (0, t.jsxs)("svg", {
                        viewBox: "0 0 420 230",
                        role: "img",
                        "aria-label":
                          "Schematic route connections between Manchester, Lille, Rotterdam, Antwerp and Lyon",
                        children: [
                          (0, t.jsxs)("g", {
                            fill: "none",
                            stroke: "#364b6a",
                            strokeWidth: "1.5",
                            children: [
                              (0, t.jsx)("path", {
                                d: "M75 25l25 25-8 25 15 15-7 25-35 12-14-20 12-27-4-28zM150 90l35-22 55 4 32-25 37 10 25 35 30 16-12 44-36 12-16 42-45-10-32 9-30-30-37-5-15-34z",
                              }),
                              (0, t.jsx)("path", {
                                d: "M265 178l20 30 30 10 7-9-21-14-12-25M312 50l8-36 17-8 9 43",
                              }),
                            ],
                          }),
                          (0, t.jsx)("g", {
                            fill: "none",
                            stroke: "#ed3547",
                            strokeWidth: "2.5",
                            strokeDasharray: "5 5",
                            children: (0, t.jsx)("path", {
                              d: "M82 68Q115 122 190 115L229 94 224 118 240 174",
                            }),
                          }),
                          (0, t.jsxs)("g", {
                            fill: "#fff",
                            stroke: "#ed3547",
                            strokeWidth: "3",
                            children: [
                              (0, t.jsx)("circle", {
                                cx: "82",
                                cy: "68",
                                r: "5",
                              }),
                              (0, t.jsx)("circle", {
                                cx: "190",
                                cy: "115",
                                r: "5",
                              }),
                              (0, t.jsx)("circle", {
                                cx: "229",
                                cy: "94",
                                r: "5",
                              }),
                              (0, t.jsx)("circle", {
                                cx: "224",
                                cy: "118",
                                r: "5",
                              }),
                              (0, t.jsx)("circle", {
                                cx: "240",
                                cy: "174",
                                r: "5",
                              }),
                            ],
                          }),
                          (0, t.jsxs)("g", {
                            fill: "#dbe5f3",
                            fontSize: "11",
                            fontFamily: "Arial",
                            children: [
                              (0, t.jsx)("text", {
                                x: "18",
                                y: "53",
                                children: "Manchester",
                              }),
                              (0, t.jsx)("text", {
                                x: "154",
                                y: "140",
                                children: "Lille",
                              }),
                              (0, t.jsx)("text", {
                                x: "242",
                                y: "88",
                                children: "Rotterdam",
                              }),
                              (0, t.jsx)("text", {
                                x: "239",
                                y: "130",
                                children: "Antwerp",
                              }),
                              (0, t.jsx)("text", {
                                x: "252",
                                y: "183",
                                children: "Lyon",
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, t.jsx)("small", {
                        children: "Route illustration · not live coverage",
                      }),
                    ],
                  }),
                ],
              }),
              (0, t.jsxs)("div", {
                id: "load-board-preview",
                className: a.default.board,
                children: [
                  (0, t.jsxs)("div", {
                    className: a.default.boardHeading,
                    children: [
                      (0, t.jsxs)("div", {
                        children: [
                          (0, t.jsx)("span", {
                            className: a.default.eyebrow,
                            children: "DEDICATED JOBS",
                          }),
                          (0, t.jsx)("h2", {
                            children: "Know the job. Know the rate.",
                          }),
                        ],
                      }),
                      (0, t.jsx)("span", {
                        className: a.default.previewBadge,
                        children: "Illustrative preview",
                      }),
                    ],
                  }),
                  (0, t.jsx)("p", {
                    className: a.default.boardIntro,
                    children:
                      "One dedicated vehicle, from collection to delivery. An established carrier rate: decide whether the work fits.",
                  }),
                  (0, t.jsx)("div", {
                    className: a.default.filters,
                    role: "group",
                    "aria-label": "Filter illustrative loads by vehicle",
                    children: [
                      "All vehicles",
                      "Van",
                      "Luton",
                      "Rigid",
                      "Artic",
                    ].map((r) =>
                      (0, t.jsx)(
                        "button",
                        {
                          type: "button",
                          "aria-pressed": e === r,
                          onClick: () => s(r),
                          children: r,
                        },
                        r,
                      ),
                    ),
                  }),
                  (0, t.jsx)("div", {
                    "aria-live": "polite",
                    "aria-atomic": "true",
                    children: d.map((e) =>
                      (0, t.jsxs)(
                        "article",
                        {
                          className: a.default.load,
                          children: [
                            (0, t.jsxs)("div", {
                              className: a.default.loadTop,
                              children: [
                                (0, t.jsx)("span", {
                                  className: a.default.vehicle,
                                  children: e.vehicle,
                                }),
                                (0, t.jsx)("span", { children: e.collection }),
                              ],
                            }),
                            (0, t.jsxs)("div", {
                              className: a.default.route,
                              children: [
                                (0, t.jsx)("strong", { children: e.from }),
                                (0, t.jsx)("span", {
                                  "aria-hidden": "true",
                                  children: "↓",
                                }),
                                (0, t.jsx)("strong", { children: e.to }),
                              ],
                            }),
                            (0, t.jsxs)("div", {
                              className: a.default.loadBottom,
                              children: [
                                (0, t.jsx)("span", { children: e.load }),
                                (0, t.jsx)("span", { children: e.requirement }),
                              ],
                            }),
                            (0, t.jsxs)("div", {
                              className: a.default.rate,
                              children: [
                                (0, t.jsx)("span", {
                                  children: "Sample distance",
                                }),
                                (0, t.jsx)("strong", { children: e.distance }),
                              ],
                            }),
                            (0, t.jsxs)("div", {
                              className: a.default.rate,
                              children: [
                                (0, t.jsx)("span", {
                                  children: "Professional rate",
                                }),
                                (0, t.jsx)("strong", {
                                  children: "Not shown in this demo",
                                }),
                              ],
                            }),
                            (0, t.jsxs)("div", {
                              className: a.default.jobAction,
                              children: [
                                (0, t.jsx)("span", {
                                  children: "Dedicated vehicle",
                                }),
                                (0, t.jsx)("button", {
                                  type: "button",
                                  disabled: !0,
                                  "aria-label": `Take ${e.vehicle} job — illustrative only`,
                                  children: "Take job · preview only",
                                }),
                              ],
                            }),
                          ],
                        },
                        e.from,
                      ),
                    ),
                  }),
                  (0, t.jsx)("p", {
                    className: a.default.boardFoot,
                    children:
                      "Illustrative jobs and distances only. No example prices are displayed. Genuine authorised rates will be shown to eligible carriers before acceptance.",
                  }),
                ],
              }),
            ],
          }),
          (0, t.jsxs)("section", {
            id: "find-a-load",
            className: a.default.split,
            "aria-labelledby": "driver-title",
            children: [
              (0, t.jsxs)("div", {
                children: [
                  (0, t.jsx)("p", {
                    className: a.default.eyebrow,
                    children: "FOR THE PERSON RUNNING THE VEHICLE",
                  }),
                  (0, t.jsxs)("h2", {
                    id: "driver-title",
                    children: [
                      "Proper jobs.",
                      (0, t.jsx)("br", {}),
                      "Professional rates.",
                    ],
                  }),
                  (0, t.jsx)("p", {
                    className: a.default.sectionLead,
                    children:
                      "Know the job. Know the rate. Choose the dedicated work that fits your vehicle and your day.",
                  }),
                  (0, t.jsx)("p", {
                    children:
                      "Professional transport costs more than fuel. Your vehicle, driver time, maintenance and compliance all matter. Our model establishes the rate before you decide to take the job, without a bidding war or a promise of guaranteed profit.",
                  }),
                  (0, t.jsx)(n.default, {
                    className: a.default.textLink,
                    href: "/uk-european-loads#return-loads",
                    children: "What makes a dedicated job fit? ↗",
                  }),
                ],
              }),
              (0, t.jsxs)("div", {
                className: a.default.driverPanel,
                children: [
                  (0, t.jsx)("span", {
                    className: a.default.eyebrow,
                    children: "THE DETAILS THAT MATTER",
                  }),
                  (0, t.jsxs)("h3", {
                    children: [
                      "The right operator.",
                      (0, t.jsx)("br", {}),
                      "The right dedicated job.",
                    ],
                  }),
                  (0, t.jsxs)("dl", {
                    children: [
                      (0, t.jsxs)("div", {
                        children: [
                          (0, t.jsx)("dt", { children: "Vehicle" }),
                          (0, t.jsx)("dd", { children: "Luton · tail-lift" }),
                        ],
                      }),
                      (0, t.jsxs)("div", {
                        children: [
                          (0, t.jsx)("dt", { children: "Collection" }),
                          (0, t.jsx)("dd", { children: "Birmingham · B24" }),
                        ],
                      }),
                      (0, t.jsxs)("div", {
                        children: [
                          (0, t.jsx)("dt", { children: "Delivery" }),
                          (0, t.jsx)("dd", { children: "Leeds · LS10" }),
                        ],
                      }),
                      (0, t.jsxs)("div", {
                        children: [
                          (0, t.jsx)("dt", { children: "Space & payload" }),
                          (0, t.jsx)("dd", {
                            children: "Check before accepting",
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, t.jsx)("p", {
                    children:
                      "Professional indicators will be checked before use. No verified carrier or live vehicle is advertised here.",
                  }),
                ],
              }),
            ],
          }),
          (0, t.jsxs)("section", {
            id: "move-a-load",
            className: a.default.shipper,
            "aria-labelledby": "shipper-title",
            children: [
              (0, t.jsxs)("div", {
                children: [
                  (0, t.jsx)("p", {
                    className: a.default.eyebrow,
                    children: "FOR PLANNERS, FORWARDERS & PEOPLE WITH FREIGHT",
                  }),
                  (0, t.jsx)("h2", {
                    id: "shipper-title",
                    children: "Got a load to move?",
                  }),
                  (0, t.jsx)("p", {
                    className: a.default.sectionLead,
                    children:
                      "Your freight. A dedicated vehicle. A clear price.",
                  }),
                  (0, t.jsx)("p", {
                    children:
                      "From a dedicated van to a full trailer, your freight deserves the right vehicle and a professional operator. Our planned service establishes the price around the route, vehicle and requirements, with direct collection to delivery and no freight auction.",
                  }),
                ],
              }),
              (0, t.jsxs)("ol", {
                className: a.default.steps,
                children: [
                  (0, t.jsxs)("li", {
                    children: [
                      (0, t.jsx)("span", { children: "01" }),
                      (0, t.jsxs)("div", {
                        children: [
                          (0, t.jsx)("h3", {
                            children: "Define the dedicated job.",
                          }),
                          (0, t.jsx)("p", {
                            children:
                              "Collection and delivery postcodes, load size, weight and the vehicle required.",
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, t.jsxs)("li", {
                    children: [
                      (0, t.jsx)("span", { children: "02" }),
                      (0, t.jsxs)("div", {
                        children: [
                          (0, t.jsx)("h3", {
                            children: "Establish a clear price.",
                          }),
                          (0, t.jsx)("p", {
                            children:
                              "Route, vehicle, timings and handling requirements inform the price. Confirm what’s included before booking.",
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, t.jsxs)("li", {
                    children: [
                      (0, t.jsx)("span", { children: "03" }),
                      (0, t.jsxs)("div", {
                        children: [
                          (0, t.jsx)("h3", {
                            children: "Match the professional operator.",
                          }),
                          (0, t.jsx)("p", {
                            children:
                              "Vehicle fit, appropriate credentials and availability matter. The carrier chooses whether to accept the established rate.",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              (0, t.jsx)("p", {
                className: a.default.shipperNote,
                children:
                  "This is the intended service. Live pricing, job acceptance and bookings are not yet available here.",
              }),
            ],
          }),
          (0, t.jsxs)("section", {
            className: a.default.europe,
            "aria-labelledby": "europe-title",
            children: [
              (0, t.jsx)("p", {
                className: a.default.eyebrow,
                children: "THE ROAD DOESN’T END AT THE BORDER",
              }),
              (0, t.jsxs)("h2", {
                id: "europe-title",
                children: [
                  "Dedicated UK transport.",
                  (0, t.jsx)("br", {}),
                  "European work, properly planned.",
                ],
              }),
              (0, t.jsx)("p", {
                children:
                  "The right match considers your vehicle, timings, requirements and route. A job on the road home still deserves a professional rate and a dedicated service.",
              }),
              (0, t.jsxs)("div", {
                className: a.default.guideLinks,
                children: [
                  (0, t.jsx)(n.default, {
                    href: "/uk-european-loads#van-loads",
                    children: "Dedicated van work ↗",
                  }),
                  (0, t.jsx)(n.default, {
                    href: "/uk-european-loads#return-loads",
                    children: "Return journeys, professional rates ↗",
                  }),
                  (0, t.jsx)(n.default, {
                    href: "/uk-european-loads#european-work",
                    children: "Planning UK / EU work ↗",
                  }),
                ],
              }),
              (0, t.jsx)("p", {
                className: a.default.notice,
                children:
                  "Useful planning guides, not a claim of live load coverage.",
              }),
            ],
          }),
          (0, t.jsxs)("section", {
            className: a.default.faq,
            "aria-labelledby": "faq-title",
            children: [
              (0, t.jsxs)("div", {
                children: [
                  (0, t.jsx)("p", {
                    className: a.default.eyebrow,
                    children: "STRAIGHT ANSWERS",
                  }),
                  (0, t.jsxs)("h2", {
                    id: "faq-title",
                    children: [
                      "Before you",
                      (0, t.jsx)("br", {}),
                      "get moving.",
                    ],
                  }),
                ],
              }),
              (0, t.jsx)("div", {
                children: l.map(([e, r]) =>
                  (0, t.jsxs)(
                    "details",
                    {
                      children: [
                        (0, t.jsx)("summary", { children: e }),
                        (0, t.jsx)("p", { children: r }),
                      ],
                    },
                    e,
                  ),
                ),
              }),
            ],
          }),
          (0, t.jsxs)("section", {
            className: a.default.closing,
            children: [
              (0, t.jsx)("p", {
                className: a.default.eyebrow,
                children: "BUILT BY TRANSPORT PEOPLE. FOR TRANSPORT PEOPLE.",
              }),
              (0, t.jsxs)("h2", {
                children: [
                  "Dedicated transport.",
                  (0, t.jsx)("br", {}),
                  "Done properly.",
                ],
              }),
              (0, t.jsx)("p", {
                children:
                  "Proper jobs. Professional rates. No race to the bottom.",
              }),
              (0, t.jsx)("a", {
                className: a.default.secondary,
                href: "#load-board-preview",
                children: "Back to the dedicated jobs preview ↑",
              }),
            ],
          }),
        ],
      }),
      (0, t.jsxs)("footer", {
        className: a.default.footer,
        children: [
          (0, t.jsxs)(n.default, {
            href: "/",
            className: a.default.brand,
            children: ["HAUL", (0, t.jsx)("span", { children: "SMART" })],
          }),
          (0, t.jsx)("p", {
            children:
              "A professional UK & European transport network in development.",
          }),
          (0, t.jsx)(n.default, {
            href: "/uk-european-loads",
            children: "Dedicated jobs & European work",
          }),
          (0,t.jsx)(n.default,{href:"/privacy",children:"Privacy"}),
          (0,t.jsx)(n.default,{href:"/enquiry-terms",children:"Enquiry terms"
          }),
        ],
      }),
      (0, t.jsx)("script", {
        type: "application/ld+json",
        dangerouslySetInnerHTML: {
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Haulsmart",
            url: "https://www.haulsmart-europe.com/",
            description:
              "A professional dedicated transport network in development, built by transport people.",
          }),
        },
      }),
    ],
  });
}
export default ProfessionalHome;
