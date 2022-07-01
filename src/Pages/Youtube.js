import {
  Heading,
  Input,
  Button,
  Box,
  Alert,
  AlertIcon,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";

export default function Youtube({ apiUrl }) {
  return (
    <>
      <Alert status="info">
        <AlertIcon />
        입력창 3개 순서대로
        <Text fontWeight="bold" mx={1}>
          제목 - 유튜브 링크 - 썸네일 링크
        </Text>
        입니다.
      </Alert>

      <Heading className="font-is" size="md" mt={6} mb={3}>
        유튜브 1
      </Heading>
      <Input type="text" mb={1} placeholder="제목을 입력해주세요" />
      <Input type="text" mb={1} placeholder="유튜브 링크를 입력해주세요" />
      <Input type="text" mb={1} placeholder="썸네일 링크를 입력해주세요" />

      <Heading className="font-is" size="md" mt={6} mb={3}>
        유튜브 2
      </Heading>
      <Input type="text" mb={1} placeholder="제목을 입력해주세요" />
      <Input type="text" mb={1} placeholder="유튜브 링크를 입력해주세요" />
      <Input type="text" mb={1} placeholder="썸네일 링크를 입력해주세요" />

      <Heading className="font-is" size="md" mt={6} mb={3}>
        유튜브 3
      </Heading>
      <Input type="text" mb={1} placeholder="제목을 입력해주세요" />
      <Input type="text" mb={1} placeholder="유튜브 링크를 입력해주세요" />
      <Input type="text" mb={1} placeholder="썸네일 링크를 입력해주세요" />

      <Box style={{ textAlign: "right" }} mt={2}>
        <Button colorScheme="blue">등록</Button>
      </Box>
    </>
  );
}
