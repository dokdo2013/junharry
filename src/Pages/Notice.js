import { useState, useRef, useEffect } from "react";
import {
  Heading,
  Input,
  Button,
  Box,
  Table,
  Thead,
  Tbody,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Tr,
  Th,
  Td,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";

export default function Notice({ apiUrl, toast }) {
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      saveNotice(editorRef.current.getContent());
    }
  };
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    getNotice();
  }, []);

  const [noticeTitle, setNoticeTitle] = useState("");
  const [notice, setNotice] = useState([]);
  const [delNoticeName, setDelNoticeName] = useState("");
  const [delNoticeDate, setDelNoticeDate] = useState("");
  const [alertIdx, setAlertIdx] = useState(0);

  const saveNotice = (content) => {
    axios
      .post(
        apiUrl + "/junharry/notice",
        {
          title: noticeTitle,
          content: content,
        },
        {
          headers: {
            "X-Access-Token": localStorage.getItem("junharry-token"),
          },
        }
      )
      .then((Response) => {
        if (Response.data.code === "SUCCESS") {
          toast({
            title: "성공",
            description: Response.data.message,
            position: "top-right",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        } else {
          toast({
            title: "실패",
            description: Response.data.message,
            position: "top-right",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }

        // Refresh & Erase Content
        getNotice();
        setNoticeTitle("");
        editorRef.current.setContent("");
      })
      .catch((Error) => {
        toast({
          title: "실패",
          description: Error.message,
          position: "top-right",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        console.log(Error);
      });
  };

  const deleteNotice = () => {
    axios
      .delete(apiUrl + "/junharry/notice/" + alertIdx, {
        headers: {
          "X-Access-Token": localStorage.getItem("junharry-token"),
        },
      })
      .then((Response) => {
        if (Response.data.code === "SUCCESS") {
          toast({
            title: "성공",
            description: Response.data.message,
            position: "top-right",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          getNotice();
          onClose();
        } else {
          toast({
            title: "실패",
            description: Response.data.message,
            position: "top-right",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      });
  };

  const getNotice = () => {
    axios.get(apiUrl + "/junharry/notice").then((Response) => {
      if (Response.data.code === "SUCCESS") {
        setNotice(Response.data.data);
      } else {
        alert("API 호출 중 오류가 발생했습니다.");
        setNotice([]);
      }
    });
  };

  return (
    <>
      <AlertDialog isOpen={isOpen} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              정말 삭제하시겠습니까?
            </AlertDialogHeader>

            <AlertDialogBody>
              제목 : {delNoticeName}
              <br />
              등록일자 : {delNoticeDate}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onClose}>취소</Button>
              <Button
                colorScheme="red"
                onClick={() => deleteNotice(alertIdx)}
                ml={3}
              >
                삭제
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Heading className="font-is" size="md" mt={3} mb={3}>
        공지사항 등록
      </Heading>
      <Input
        type="text"
        mb={1}
        placeholder="제목을 입력해주세요"
        value={noticeTitle}
        onChange={(e) => {
          setNoticeTitle(e.target.value);
        }}
      />
      <Editor
        onInit={(evt, editor) => (editorRef.current = editor)}
        init={{
          height: 500,
          language: "ko_KR",
          plugins: ["link", "media", "image", "table"],
          toolbar:
            "undo redo | fontsize | bold italic underline strikethrough forecolor backcolor | " +
            "alignleft aligncenter alignright alignjustify | " +
            "outdent indent hr | " +
            "link media image table | ",
        }}
        apiKey="2p1t8f6n851vczdur5zvpn6isucvqwaclzmykr388a0h6qzo"
      />
      <Box style={{ textAlign: "right" }} mt={2}>
        <Button colorScheme="blue" onClick={log}>
          등록
        </Button>
      </Box>
      <Heading className="font-is" size="md" mt={3} mb={3}>
        공지사항 조회
      </Heading>
      <Table>
        <Thead>
          <Tr>
            <Th w={200}>등록일자</Th>
            <Th>제목/내용</Th>
            <Th w={50}>삭제</Th>
          </Tr>
        </Thead>
        <Tbody>
          {notice.map((item) => {
            return (
              <Tr key={item.idx}>
                <Td>{item.reg_datetime}</Td>
                <Td>
                  <Accordion allowToggle>
                    <AccordionItem>
                      <h2>
                        <AccordionButton>
                          <Box flex="1" textAlign="left">
                            {item.title}
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel
                        pb={4}
                        dangerouslySetInnerHTML={{ __html: item.content }}
                      ></AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </Td>
                <Td>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => {
                      setDelNoticeName(item.title);
                      setDelNoticeDate(item.reg_datetime);
                      setAlertIdx(item.idx);
                      onOpen();
                    }}
                  >
                    삭제
                  </Button>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </>
  );
}
