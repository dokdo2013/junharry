import { useRef } from "react";
import { Heading, Input, Button, Box } from "@chakra-ui/react";
import { Editor } from "@tinymce/tinymce-react";

export default function Notice() {
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
          toolbar:
            "undo redo | formatselect | " +
            "bold italic backcolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
        }}
        apiKey="2p1t8f6n851vczdur5zvpn6isucvqwaclzmykr388a0h6qzo"
      />
      <Box style={{ textAlign: "right" }} mt={2}>
        <Button colorScheme="blue" onClick={log}>
          등록
        </Button>
      </Box>
    </>
  );
}
