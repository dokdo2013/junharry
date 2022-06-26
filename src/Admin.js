import { useState, useEffect } from "react";
import {
  ChakraProvider,
  Heading,
  Container,
  Box,
  Flex,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Schedule from "./Pages/Schedule";
import Notice from "./Pages/Notice";
import Game from "./Pages/Game";
import Youtube from "./Pages/Youtube";
import LinkPage from "./Pages/Link";

export default function Admin() {
  const apiUrl = "https://api-v1.leaven.team";
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("junharry-token")) {
      setIsLogin(true);
    }
  }, []);

  return (
    <div className="admin" style={{ backgroundColor: "white" }}>
      <main>
        <ChakraProvider>
          <Box
            style={{
              backgroundColor: "white !important",
              minHeight: "100vh",
              padding: "20px",
            }}
          >
            <Container maxW="container.xl">
              <Flex justifyContent="space-between">
                <Heading size="lg" className="font-is">
                  전해리 Admin
                </Heading>
                {isLogin ? (
                  <Button
                    className="font-is"
                    colorScheme="red"
                    onClick={() => {
                      localStorage.removeItem("junharry-token");
                      window.location.reload();
                    }}
                  >
                    로그아웃
                  </Button>
                ) : (
                  <Link to="login">
                    <Button className="font-is" colorScheme="blue">
                      로그인
                    </Button>
                  </Link>
                )}
              </Flex>
              <Box mt={5}>
                <Tabs variant="soft-rounded" colorScheme="blue">
                  <TabList>
                    <Tab>일정 관리</Tab>
                    <Tab>공지사항 관리</Tab>
                    <Tab>게임 관리</Tab>
                    <Tab>유튜브 관리</Tab>
                    <Tab>링크 관리</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <Schedule apiUrl={apiUrl} />
                    </TabPanel>
                    <TabPanel>
                      <Notice apiUrl={apiUrl} />
                    </TabPanel>
                    <TabPanel>
                      <Game apiUrl={apiUrl} />
                    </TabPanel>
                    <TabPanel>
                      <Youtube apiUrl={apiUrl} />
                    </TabPanel>
                    <TabPanel>
                      <LinkPage apiUrl={apiUrl} />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </Container>
          </Box>
        </ChakraProvider>
      </main>
    </div>
  );
}
