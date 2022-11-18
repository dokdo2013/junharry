import "./App.css";
import {
  Alert,
  Avatar,
  Button,
  Tooltip,
  Tabs,
  Calendar,
  Collapse,
  Badge,
  Card,
  Row,
  Col,
  List,
} from "antd";
import { LikeOutlined, CommentOutlined } from "@ant-design/icons";
import { FaYoutube, FaInstagram } from "react-icons/fa";
import { IoIosCafe } from "react-icons/io";
import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import Iframe from "react-iframe";
import MediaQuery from "react-responsive";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const { TabPane } = Tabs;
const { Meta } = Card;
const { Panel } = Collapse;

moment.locale("ko");

export default function Main() {
  const [schedule, setSchedule] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [youtube, setYoutube] = useState([]);
  const [notice, setNotice] = useState([]);
  const [game, setGame] = useState("loading");
  const [isLive, setIsLive] = useState(false);
  const [currentCalendarValue, setCurrentCalendarValue] = useState(moment());

  const [afreeca, setAfreeca] = useState([]);
  const [isAfreecaLoaded, setIsAfreecaLoaded] = useState(false);

  const [calendarSelectedValue, setCalendarSelectedValue] = useState(moment());
  const [mobileCalendarType, setMobileCalendarType] = useState("success");
  const [mobileCalendarTitle, setMobileCalendarTitle] = useState("");
  const [mobileCalendarContent, setMobileCalendarContent] = useState("");

  const url = "https://api-v1.leaven.team/junharry";
  let cnt = 0;

  // 모바일 캘린더 처리
  const calendarMobileClick = (date) => {
    const currentDate = date.format("YYYY-MM-DD");
    let count = 0;
    schedule.map((item) => {
      if (item.date.indexOf(currentDate) !== -1) {
        if (item.is_rest) {
          setMobileCalendarType("error");
        } else {
          setMobileCalendarType("success");
        }
        setMobileCalendarTitle(item.name);
        setMobileCalendarContent(item.date);
        count++;
      }
    });
    if (count === 0) {
      setMobileCalendarType("info");
      setMobileCalendarTitle("일정이 등록되지 않았습니다");
      setMobileCalendarContent(currentDate);
    }
  };

  // 라이브 여부 조회
  const getLive = () => {
    axios.get("https://api-v1.leaven.team/live").then((Response) => {
      if (Response.data.code === "SUCCESS") {
        const tempData = Response.data.data;
        if (tempData.indexOf("gofl2237") !== -1) {
          setIsLive(true);
        } else {
          setIsLive(false);
        }
      }
    });
  };

  // 아프리카TV 공지사항 조회
  const getAfreecaNotice = () => {
    const url =
      "https://bjapi.afreecatv.com/api/gofl2237/board/13296623?page=1&per_page=20&field=title%2Ccontents&keyword=&type=all&months=";
    axios
      .get(url)
      .then((Response) => {
        setAfreeca(Response.data.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsAfreecaLoaded(true);
      });
  };

  // 방송일정 조회
  const getSchedule = () => {
    axios.get(url + "/schedule").then((Response) => {
      if (Response.data.code === "SUCCESS") {
        setSchedule(Response.data.data);
      } else {
        alert("API 호출 중 오류가 발생했습니다.");
        setSchedule([
          {
            date: moment(),
            name: "일정이 아직 로딩되지 않았어요!",
          },
        ]);
      }
    });
  };

  // 유튜브 데이터 조회
  const getYoutube = () => {
    axios.get(url + "/youtube").then((Response) => {
      if (Response.data.code === "SUCCESS") {
        setYoutube(Response.data.data);
      } else {
        alert("Youtube API 호출 중 오류가 발생했습니다.");
        setYoutube([]);
      }
    });
  };

  // 월별 데이터 조회
  const getListData = (value) => {
    const currentDate = value.format("YYYY-MM-DD");
    for (let i = 0; i < schedule.length; i++) {
      if (schedule[i].date.substr(0, 10) === currentDate) {
        return [schedule[i]];
      }
    }
    return [];
  };

  // 공지사항 데이터 조회
  const getNoticeData = () => {
    axios.get(url + "/notice").then((Response) => {
      if (Response.data.code === "SUCCESS") {
        setNotice(Response.data.data);
      } else {
        alert("API 호출 중 오류가 발생했습니다.");
        setNotice([]);
      }
    });
  };

  // 플레이할 게임 조회
  const getGame = () => {
    axios.get(url + "/plain/game").then((Response) => {
      if (Response.data.code === "SUCCESS") {
        setGame(Response.data.data);
      } else {
        alert("API 호출 중 오류가 발생했습니다.");
        setGame("현재 등록된 플레이 할 게임이 없어요.");
      }
    });
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events" style={{ listStyle: "none", padding: 0 }}>
        {listData.map((item) => (
          <li key={item.name}>
            <Badge
              status={item.is_rest === 0 ? "success" : "error"}
              text={
                item.is_rest === 0
                  ? moment(item.date).format("A HH:mm")
                  : "휴방"
              }
            />
            <br />
            {item.name}
          </li>
        ))}
      </ul>
    );
  };

  const dateCellRenderMobile = (value) => {
    const listData = getListData(value);
    return (
      <>
        {listData.map((item) => (
          <Badge
            key={item.name}
            status={item.is_rest === 0 ? "success" : "error"}
          />
        ))}
      </>
    );
  };

  const onChange = (key) => {
    console.log(key);
  };

  useEffect(() => {
    getSchedule();
    getYoutube();
    getNoticeData();
    getGame();
    getLive();
    getAfreecaNotice();
  }, []);

  useEffect(() => {
    // 현재 스케쥴 세팅
    schedule.map((item) => {
      if (moment().format("YYYY-MM-DD") === item.date.substr(0, 10)) {
        setTodaySchedule([item]);
      }
    });
    setCurrentCalendarValue(moment());
    calendarMobileClick(calendarSelectedValue);
  }, [schedule]);

  return (
    <div>
      <main style={{}}>
        <Alert
          message="이제 아프리카TV에서 전해리 방송을 보실 수 있습니다!"
          action={
            <Button
              size="small"
              type="primary"
              onClick={() => {
                window.open("https://bj.afreecatv.com/gofl2237");
              }}
            >
              아프리카TV로 이동
            </Button>
          }
          type="info"
          banner
        />
        <div
          style={{
            width: "100%",
            height: isLive ? 580 : 300,
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ marginTop: 30 }}>
            <Avatar size={100} src="gofl2237.jpeg" />
          </div>
          {isLive ? (
            <Badge.Ribbon text="LIVE" color="red">
              <h1
                className="font-pc"
                style={{
                  fontWeight: "bold",
                  fontSize: "40px",
                  padding: "30px 0 15px 0",
                }}
              >
                전해리 방송일정
              </h1>
            </Badge.Ribbon>
          ) : (
            <h1
              className="font-pc"
              style={{
                fontWeight: "bold",
                fontSize: "40px",
                padding: "30px 0 15px 0",
              }}
            >
              전해리 방송일정
            </h1>
          )}
          {isLive && (
            <div id="iframe-container">
              <Iframe
                src="https://player.twitch.tv/?channel=gofl2237&parent=junharry.vercel.app&parent=junharry.com"
                frameborder="0"
                allowfullscreen="true"
                scrolling="no"
                height="270"
                width="480"
              ></Iframe>
            </div>
          )}
          <br />
          <div className="button-group" style={{ display: "flex !important" }}>
            <Tooltip title="아프리카TV">
              <Button
                className="flex-center"
                shape="circle"
                icon={
                  <img
                    height={18}
                    style={{ filter: "grayscale(100%)" }}
                    src="https://obj-sg.thewiki.kr/data/ec9584ed9484eba6acecb9b4545620ec9584ec9db4ecbd982e706e67.png"
                    alt="AfreecaTV"
                  />
                }
                size="large"
                onClick={() => {
                  window.open("https://bj.afreecatv.com/gofl2237");
                }}
              ></Button>
            </Tooltip>
            {/* <Tooltip title="트위치">
              <Button
                className="flex-center"
                shape="circle"
                icon={<FaTwitch />}
                size="large"
                onClick={() => {
                  window.open("https://twitch.tv/gofl2237");
                }}
              ></Button>
            </Tooltip> */}
            <Tooltip title="유튜브">
              <Button
                className="flex-center"
                shape="circle"
                icon={<FaYoutube />}
                size="large"
                onClick={() => {
                  window.open(
                    "https://www.youtube.com/channel/UCCsvJaEPyupJBVp3JDDAUXA"
                  );
                }}
              ></Button>
            </Tooltip>
            <Tooltip title="인스타그램">
              <Button
                className="flex-center"
                shape="circle"
                icon={<FaInstagram />}
                size="large"
                onClick={() => {
                  window.open("https://www.instagram.com/junharry_/");
                }}
              ></Button>
            </Tooltip>
            {/* <Tooltip title="디스코드">
              <Button
                className="flex-center"
                shape="circle"
                icon={<FaDiscord />}
                size="large"
                onClick={() => {
                  window.open("https://discord.gg/FTWqeNRy2B");
                }}
              ></Button>
            </Tooltip> */}
            <Tooltip title="카페">
              <Button
                className="flex-center"
                shape="circle"
                icon={<IoIosCafe />}
                size="large"
                onClick={() => {
                  window.open("https://cafe.naver.com/forharryfan");
                }}
              ></Button>
            </Tooltip>
          </div>
        </div>
        <div
          style={{
            overflow: "hidden",
            marginBottom: "-7px",
            backgroundColor: "white",
          }}
        >
          <svg
            preserveAspectRatio="none"
            viewBox="0 0 1200 120"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              fill: "#5DA3C2",
              width: "100%",
              height: 70,
              transform: "rotate(180deg) scaleX(-1)",
            }}
          >
            <path
              d="M0 0v46.29c47.79 22.2 103.59 32.17 158 28 70.36-5.37 136.33-33.31 206.8-37.5 73.84-4.36 147.54 16.88 218.2 35.26 69.27 18 138.3 24.88 209.4 13.08 36.15-6 69.85-17.84 104.45-29.34C989.49 25 1113-14.29 1200 52.47V0z"
              opacity=".25"
            />
            <path
              d="M0 0v15.81c13 21.11 27.64 41.05 47.69 56.24C99.41 111.27 165 111 224.58 91.58c31.15-10.15 60.09-26.07 89.67-39.8 40.92-19 84.73-46 130.83-49.67 36.26-2.85 70.9 9.42 98.6 31.56 31.77 25.39 62.32 62 103.63 73 40.44 10.79 81.35-6.69 119.13-24.28s75.16-39 116.92-43.05c59.73-5.85 113.28 22.88 168.9 38.84 30.2 8.66 59 6.17 87.09-7.5 22.43-10.89 48-26.93 60.65-49.24V0z"
              opacity=".5"
            />
            <path d="M0 0v5.63C149.93 59 314.09 71.32 475.83 42.57c43-7.64 84.23-20.12 127.61-26.46 59-8.63 112.48 12.24 165.56 35.4C827.93 77.22 886 95.24 951.2 90c86.53-7 172.46-45.71 248.8-84.81V0z" />
          </svg>
        </div>
        <div
          style={{
            width: "100%",
            backgroundColor: "#5DA3C2",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Tabs defaultActiveKey="1" centered style={{ display: "none" }}>
              <TabPane tab="방송일정" key="1">
                <p
                  className="font-is"
                  style={{
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  {todaySchedule.map((item) => {
                    return (
                      <>
                        <span
                          style={{
                            fontSize: "20px",
                          }}
                        >
                          {typeof item.date === "object"
                            ? item.date.format("YYYY-MM-DD H:m:s")
                            : item.date}
                        </span>
                        <br />
                        <span
                          style={{
                            color: "rgba(0,255,255,0.9)",
                            fontSize: "28px",
                          }}
                        >
                          {item.name}
                        </span>
                        <br />
                      </>
                    );
                  })}
                </p>

                <div
                  style={{
                    padding: "20px",
                    maxWidth: "1200px",
                    margin: "0 auto",
                  }}
                >
                  <MediaQuery maxWidth={767}>
                    <div
                      className="site-calendar-demo-card"
                      style={{ marginBottom: "12px" }}
                    >
                      <Calendar
                        mode="month"
                        fullscreen={false}
                        dateCellRender={dateCellRenderMobile}
                        defaultValue={currentCalendarValue}
                        onSelect={calendarMobileClick}
                      />
                    </div>
                    <Alert
                      message={mobileCalendarTitle}
                      description={mobileCalendarContent}
                      type={mobileCalendarType}
                    />
                  </MediaQuery>
                  <MediaQuery minWidth={768}>
                    <Calendar
                      mode="month"
                      dateCellRender={dateCellRender}
                      defaultValue={currentCalendarValue}
                    />
                  </MediaQuery>
                </div>
              </TabPane>
              <TabPane tab="공지사항" key="2">
                <div
                  style={{
                    padding: "20px",
                    maxWidth: "1200px",
                    margin: "0 auto",
                  }}
                >
                  <Collapse onChange={onChange}>
                    {notice.map((item) => {
                      return (
                        <Panel
                          header={item.title}
                          key={item.idx}
                          class="font-is"
                        >
                          <div
                            dangerouslySetInnerHTML={{ __html: item.content }}
                          ></div>
                          {/* {item.content.split("\\n").map((itemInner) => {
                            return (
                              <p className="font-is" key={cnt++ + 99}>
                                {itemInner.length === 0 ? "" : itemInner}
                              </p>
                            );
                          })} */}
                          <p
                            className="font-is"
                            style={{ fontSize: "12px", color: "grey" }}
                          >
                            {item.reg_datetime}
                          </p>
                        </Panel>
                      );
                    })}
                  </Collapse>
                </div>
                <div style={{ textAlign: "center", margin: "10px 0 20px 0" }}>
                  <Button
                    onClick={() => {
                      window.open(
                        "https://cafe.naver.com/forharryfan?iframe_url=/ArticleList.nhn%3Fsearch.clubid=27646284%26search.menuid=9%26search.boardtype=L"
                      );
                    }}
                    ghost
                  >
                    + 더 보기
                  </Button>
                </div>
              </TabPane>
              <TabPane tab="플레이 할 게임" key="3">
                <div style={{ textAlign: "center", margin: "10px 0 20px 0" }}>
                  <div
                    className="font-is"
                    dangerouslySetInnerHTML={{ __html: game }}
                  ></div>
                  <br />
                  {/* <p>
                    {game.split("\n").map((item) => {
                      return (
                        <p
                          className="font-is"
                          style={{ color: "white" }}
                          key={cnt++}
                        >
                          {item}
                        </p>
                      );
                    })}
                  </p> */}
                  <Button
                    onClick={() => {
                      window.open(
                        "https://cafe.naver.com/forharryfan?iframe_url=/ArticleList.nhn%3Fsearch.clubid=27646284%26search.menuid=44%26search.boardtype=L"
                      );
                    }}
                    ghost
                  >
                    + 게임 추천하기
                  </Button>
                </div>
              </TabPane>
            </Tabs>{" "}
            {/* AFREECATV 방송일정 */}
            {/* <Row
              style={{
                width: "100%",
                maxWidth: "1200px",
                margin: "0 auto",
              }}
            > */}
            <ResponsiveMasonry
              style={{ maxWidth: "1200px", margin: "0 auto" }}
              columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
            >
              <Masonry>
                {isAfreecaLoaded &&
                  afreeca.map((item) => {
                    return (
                      <a
                        href={`https://bj.afreecatv.com/gofl2237/post/${item.title_no}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Card
                          style={{ margin: "10px" }}
                          cover={
                            item.photos.length > 0 && (
                              <img
                                alt="cover"
                                height={160}
                                style={{ objectFit: "cover" }}
                                src={item.photos[0]?.url}
                              />
                            )
                          }
                          actions={[
                            <div>
                              <LikeOutlined
                                key="setting"
                                style={{ marginRight: 8 }}
                              />
                              {item.count.like_cnt}
                            </div>,
                            <div>
                              <CommentOutlined
                                key="edit"
                                style={{ marginRight: 8 }}
                              />
                              {item.count.comment_cnt}
                            </div>,
                          ]}
                        >
                          <Meta
                            avatar={<Avatar src={item.profile_image} />}
                            title={item.title_name}
                            description={item.reg_date}
                          />
                        </Card>
                      </a>
                    );
                  })}
              </Masonry>
            </ResponsiveMasonry>
          </div>
          <div
            style={{
              overflow: "hidden",
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <svg
              preserveAspectRatio="none"
              viewBox="0 0 1200 120"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                fill: "#df8591",
                width: "100%",
                height: 70,
                transform: "rotate(180deg) scaleX(-1)",
              }}
            >
              <path
                d="M0 0v46.29c47.79 22.2 103.59 32.17 158 28 70.36-5.37 136.33-33.31 206.8-37.5 73.84-4.36 147.54 16.88 218.2 35.26 69.27 18 138.3 24.88 209.4 13.08 36.15-6 69.85-17.84 104.45-29.34C989.49 25 1113-14.29 1200 52.47V0z"
                opacity=".25"
              />
              <path
                d="M0 0v15.81c13 21.11 27.64 41.05 47.69 56.24C99.41 111.27 165 111 224.58 91.58c31.15-10.15 60.09-26.07 89.67-39.8 40.92-19 84.73-46 130.83-49.67 36.26-2.85 70.9 9.42 98.6 31.56 31.77 25.39 62.32 62 103.63 73 40.44 10.79 81.35-6.69 119.13-24.28s75.16-39 116.92-43.05c59.73-5.85 113.28 22.88 168.9 38.84 30.2 8.66 59 6.17 87.09-7.5 22.43-10.89 48-26.93 60.65-49.24V0z"
                opacity=".5"
              />
              <path d="M0 0v5.63C149.93 59 314.09 71.32 475.83 42.57c43-7.64 84.23-20.12 127.61-26.46 59-8.63 112.48 12.24 165.56 35.4C827.93 77.22 886 95.24 951.2 90c86.53-7 172.46-45.71 248.8-84.81V0z" />
            </svg>
          </div>
        </div>
        <div>
          <h1
            className="font-pc"
            style={{
              textAlign: "center",
              color: "white",
              margin: "20px 0",
              fontWeight: "bold",
            }}
          >
            해리네 유튜브
          </h1>
          <Row
            style={{
              width: "100%",
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            {youtube.map((item) => {
              return (
                <Col xs={24} md={8} style={{ padding: "10px" }} key={item.idx}>
                  <Card
                    hoverable
                    style={{ width: "100%" }}
                    onClick={() => {
                      window.open(item.link);
                    }}
                    cover={<img src={item.cover_img} alt={item.name} />}
                  >
                    <Meta title={item.name} />
                  </Card>
                </Col>
              );
            })}
          </Row>
          <div style={{ textAlign: "center", margin: "10px 0 0 0" }}>
            <Button
              onClick={() => {
                window.open(
                  "https://www.youtube.com/channel/UCCsvJaEPyupJBVp3JDDAUXA"
                );
              }}
              ghost
            >
              + 더 보기
            </Button>
          </div>
        </div>
        <div style={{ height: "50px" }}></div>
      </main>
    </div>
  );
}
