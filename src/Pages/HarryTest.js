import { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Flex,
  Avatar,
} from "@chakra-ui/react";

const HarryTest = ({ apiUrl, toast }) => {
  const [testData, setTestData] = useState([]);
  const popUser = [188643459, 789278221, 798123164, 178323155, 726441337];

  const getApi = () => {
    axios
      .get(apiUrl + "/junharry/test", {
        headers: {
          "X-Access-Token": localStorage.getItem("junharry-token"),
        },
      })
      .then((Response) => {
        if (Response.data.code === "SUCCESS") {
          // 점수로 정렬하기
          const data = Response.data.data;
          const sortedData = data.sort((a, b) => {
            return b.score - a.score;
          });

          // 유저 제외
          const filteredData = sortedData.filter((item) => {
            return !popUser.includes(item.user.user_id);
          });

          setTestData(filteredData);
        } else {
          toast({
            title: "오류",
            description: Response.data.message,
            position: "top-right",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        toast({
          title: "오류",
          description: error.response.data.message,
          position: "top-right",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  useEffect(() => {
    getApi();
  }, []);

  return (
    <>
      <Flex>
        <Table>
          <Thead>
            <Tr>
              <Th>순위</Th>
              <Th>유저정보</Th>
              <Th>점수</Th>
              <Th>유저상세</Th>
              <Th>점수상세</Th>
            </Tr>
          </Thead>
          <Tbody>
            {testData.map((data, idx) => (
              <Tr key={idx}>
                <Td>{idx + 1}</Td>
                <Td>
                  <Avatar src={data.user.user_profile_image_url} size="xs" />{" "}
                  {data.user.user_display_name} ({data.user.user_name})
                </Td>
                <Td>{data.score}</Td>
                <Td>
                  <Button
                    size="sm"
                    onClick={() => {
                      toast({
                        title: "현재 준비 중입니다",
                        position: "top-right",
                        status: "info",
                        duration: 5000,
                      });
                    }}
                  >
                    유저상세
                  </Button>
                </Td>
                <Td>
                  <Button
                    size="sm"
                    onClick={() => {
                      toast({
                        title: "현재 준비 중입니다",
                        position: "top-right",
                        status: "info",
                        duration: 5000,
                      });
                    }}
                  >
                    점수상세
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Flex>
    </>
  );
};

export default HarryTest;
