import { useRef } from "react";
import {
  Heading,
  Input,
  Button,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { Editor } from "@tinymce/tinymce-react";

export default function Notice({ apiUrl }) {
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  return (
    <>
      <Heading className="font-is" size="md" mt={3} mb={3}>
        공지사항 등록
      </Heading>
      <Input type="text" mb={1} placeholder="제목을 입력해주세요" />
      <Editor
        onInit={(evt, editor) => (editorRef.current = editor)}
        init={{
          height: 500,
          language: "ko_KR",
          plugins: ["link", "media", "image", "table"],
          toolbar:
            "undo redo | styles | bold italic forecolor backcolor | " +
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
            <Th>등록일자</Th>
            <Th>제목</Th>
            <Th>보기/삭제</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td></Td>
            <Td></Td>
            <Td></Td>
          </Tr>
        </Tbody>
      </Table>
    </>
  );
}
