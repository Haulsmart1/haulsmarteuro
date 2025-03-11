import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/Table";

export function LoadTable({ loads }) {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Origin</Th>
          <Th>Destination</Th>
          <Th>Price</Th>
          <Th>Status</Th>
        </Tr>
      </Thead>
      <Tbody>
        {loads.map((load) => (
          <Tr key={load.id}>
            <Td>{load.origin}</Td>
            <Td>{load.destination}</Td>
            <Td>{load.price}</Td>
            <Td>{load.status}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
